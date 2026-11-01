import { createImpulse, createNoise } from './buffers';
import { chapterFromDom, isChapterId, PRESETS, type ChapterId } from './chapters';
import { padCutoff, roomMix } from './daylight';
import { listenDeskSounds } from './desk-sounds';
import { MusicBed } from './music';
import { ChordLayer, rampTo } from './pad';
import { RoomTone } from './room';
import { listenUiSounds } from './ui-sounds';
import { playChime } from './voices';

/** Master level at full volume. Keep it low: this is a background bed, not music. */
export const MASTER_LEVEL = 0.11;

const LEVELS = {
  pad: 0.32,
  /** The pad steps back to a colour once a music track is actually playing. */
  padUnderMusic: 0.12,
  music: 2.2,
  sample: 0.5,
  room: 1,
  chime: 0.16
} as const;

const SWELL_GAIN = 1.45;
const SUB_SHOT_SWELL_GAIN = 1.2;
const FADE_IN_SECONDS = 2.5;
const FADE_OUT_SECONDS = 1.2;
const HIDDEN_FADE_SECONDS = 0.6;
const CHIME_GAP_MS = 4000;
const FALLBACK_CHIME_DELAY_MS = 900;
const FILTER_LFO_HZ = 0.045;
const FILTER_LFO_DEPTH_HZ = 90;

type Source = 'chapter' | 'station' | 'section';

interface ChapterDetail {
  id?: string | null;
  subIndex?: number;
  progress?: number;
}

export class Ambience {
  private readonly master: GainNode;
  private readonly padBus: GainNode;
  private readonly padFilter: BiquadFilterNode;
  private readonly swell: GainNode;
  private readonly roomSend: GainNode;
  private readonly hallSend: GainNode;
  private readonly fxBus: GainNode;
  private readonly chimeBus: GainNode;
  private readonly roomTone: RoomTone;
  private readonly noise: AudioBuffer;
  private readonly lfo: OscillatorNode;
  private layer: ChordLayer | null = null;
  private chapter: ChapterId | null = null;
  private subIndex = 0;
  private driver: Source | null = null;
  private paused: boolean;
  private enabled = false;
  private lastChime = 0;
  private chimeTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly abort = new AbortController();
  private readonly music: MusicBed;

  constructor(private readonly context: AudioContext) {
    const limiter = context.createDynamicsCompressor();
    limiter.threshold.value = -18;
    limiter.knee.value = 12;
    limiter.ratio.value = 6;
    limiter.attack.value = 0.01;
    limiter.release.value = 0.4;
    limiter.connect(context.destination);

    this.master = context.createGain();
    this.master.gain.value = 0;
    this.master.connect(limiter);

    const roomVerb = context.createConvolver();
    roomVerb.buffer = createImpulse(context, 1.2, 2.8, 3000);
    const hallVerb = context.createConvolver();
    hallVerb.buffer = createImpulse(context, 3.6, 2, 4200);
    this.roomSend = context.createGain();
    this.hallSend = context.createGain();
    this.roomSend.connect(roomVerb).connect(this.master);
    this.hallSend.connect(hallVerb).connect(this.master);

    this.padBus = context.createGain();
    this.padBus.gain.value = LEVELS.pad;
    this.padFilter = context.createBiquadFilter();
    this.padFilter.type = 'lowpass';
    this.padFilter.Q.value = 0.6;
    this.padFilter.frequency.value = PRESETS.hero.cutoff;
    this.swell = context.createGain();
    this.padBus.connect(this.padFilter).connect(this.swell);
    this.connectWithSends(this.swell, 1, 1, 1);

    this.lfo = context.createOscillator();
    this.lfo.frequency.value = FILTER_LFO_HZ;
    const lfoDepth = context.createGain();
    lfoDepth.gain.value = FILTER_LFO_DEPTH_HZ;
    this.lfo.connect(lfoDepth).connect(this.padFilter.frequency);
    this.lfo.start();

    this.noise = createNoise(context, 4);
    this.roomTone = new RoomTone(context, this.noise);
    this.roomTone.output.gain.value = LEVELS.room;
    this.connectWithSends(this.roomTone.output, 1, 0.25, 0);

    this.fxBus = context.createGain();
    this.connectWithSends(this.fxBus, 0.85, 0.35, 0.05);
    const foley = { context, output: this.fxBus, noise: this.noise, signal: this.abort.signal };
    listenUiSounds({ ...foley, canPlay: () => this.canPlayDetail() });
    listenDeskSounds({ ...foley, canPlay: () => this.enabled && context.state === 'running' });
    this.chimeBus = context.createGain();
    this.connectWithSends(this.chimeBus, 0.6, 0.6, 0.5);

    this.music = new MusicBed(context, this.fxBus, () =>
      this.padBus.gain.setTargetAtTime(LEVELS.padUnderMusic, context.currentTime, 1)
    );
    this.music.output.gain.value = LEVELS.music;
    this.connectWithSends(this.music.output, 1, 0.12, 0);

    this.paused =
      document.documentElement.dataset.motion === 'paused' ||
      matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.listen();
  }

  /** Fades the bed in. Safe to call repeatedly. */
  async start(): Promise<void> {
    this.enabled = true;
    if (this.context.state !== 'running') await this.context.resume();
    if (!this.enabled) return;
    if (!this.layer) this.setChapter(this.chapter ?? chapterFromDom(), false);
    this.music.follow(this.chapter ?? chapterFromDom());
    if (document.visibilityState === 'hidden') return;
    this.rampMaster(MASTER_LEVEL, FADE_IN_SECONDS);
  }

  /** Fades out, then suspends the context so it costs no CPU while muted. */
  async stop(): Promise<void> {
    this.enabled = false;
    this.rampMaster(0, FADE_OUT_SECONDS);
    await this.wait(FADE_OUT_SECONDS);
    if (!this.enabled && this.context.state === 'running') await this.context.suspend();
  }

  dispose(): void {
    this.abort.abort();
    this.music.stop();
    this.roomTone.dispose();
    this.lfo.stop();
    void this.context.close();
  }

  private listen(): void {
    const options = { signal: this.abort.signal };
    const on = <T>(type: string, handler: (detail: T | undefined) => void) =>
      window.addEventListener(type, event => handler((event as CustomEvent<T>).detail), options);

    on<ChapterDetail>('chapter:enter', detail =>
      this.onEnter('chapter', detail?.id, detail?.subIndex)
    );
    on<ChapterDetail>('station:enter', detail => this.onEnter('station', detail?.id));
    on<ChapterDetail>('section:active', detail => this.onEnter('section', detail?.id));
    on<ChapterDetail>('chapter:settled', detail => this.onSettled(detail?.id));
    on<ChapterDetail>('chapter:progress', detail => this.onProgress(detail));
    on<unknown>('time:toggle', () => {
      if (!this.chapter) return;
      if (this.enabled) this.music.follow(this.chapter);
      this.applyTimeOfDay(this.chapter, PRESETS[this.chapter].crossfade + 2);
    });
    on<{ on?: boolean }>('desk:switch', detail => {
      if (this.enabled) void this.music.playSample(detail?.on === false ? 'switchOff' : 'switchOn', LEVELS.sample);
    });
    on<{ paused?: boolean }>('motion:toggle', detail => {
      this.paused = Boolean(detail?.paused);
    });
    document.addEventListener('visibilitychange', () => void this.onVisibility(), options);
  }

  /** Chapter events win; station and section events only drive the sound until they arrive. */
  private accepts(source: Source): boolean {
    const rank: Record<Source, number> = { chapter: 0, station: 1, section: 2 };
    if (this.driver === null || rank[source] < rank[this.driver]) this.driver = source;
    return this.driver === source;
  }

  private onEnter(source: Source, id: string | null | undefined, subIndex = 0): void {
    if (!isChapterId(id) || !this.accepts(source)) return;
    if (id === this.chapter) {
      if (subIndex !== this.subIndex) {
        this.subIndex = subIndex;
        this.swellBy(SUB_SHOT_SWELL_GAIN);
        if (id === 'experience' && subIndex > 0 && this.canPlayDetail()) void this.music.playSample('pageFlip', LEVELS.sample * 0.7);
      }
      return;
    }
    this.subIndex = subIndex;
    const isFirst = this.chapter === null;
    this.setChapter(id, !isFirst);
    if (source !== 'chapter' && id === 'contact') {
      this.clearChimeTimer();
      this.chimeTimer = setTimeout(() => this.onSettled('contact'), FALLBACK_CHIME_DELAY_MS);
    }
  }

  private onSettled(id: string | null | undefined): void {
    if (id !== 'contact' || this.chapter !== 'contact' || !this.canPlayDetail()) return;
    const now = performance.now();
    if (now - this.lastChime < CHIME_GAP_MS) return;
    this.lastChime = now;
    playChime(this.context, this.chimeBus, LEVELS.chime);
  }

  private setChapter(id: ChapterId, withSwell: boolean): void {
    this.chapter = id;
    if (this.enabled) this.music.follow(id);
    if (id !== 'contact') this.clearChimeTimer();
    const preset = PRESETS[id];
    const now = this.context.currentTime;
    const seconds = preset.crossfade;
    const tau = seconds / 3;

    const next = new ChordLayer(this.context, preset, this.padBus);
    this.layer?.fadeOutAndStop(now, seconds);
    next.fadeIn(now, seconds);
    this.layer = next;

    this.roomSend.gain.setTargetAtTime(preset.room, now, tau);
    this.hallSend.gain.setTargetAtTime(preset.hall, now, tau);
    this.applyTimeOfDay(id, seconds);

    if (withSwell) this.swellBy(SWELL_GAIN);
  }

  private applyTimeOfDay(id: ChapterId, seconds: number): void {
    const preset = PRESETS[id];
    this.padFilter.frequency.setTargetAtTime(padCutoff(id, preset), this.context.currentTime, seconds / 3);
    this.roomTone.set(roomMix(id, preset), seconds);
  }

  private swellBy(peak: number): void {
    if (this.paused) return;
    const now = this.context.currentTime;
    const gain = this.swell.gain;
    gain.cancelScheduledValues(now);
    gain.setTargetAtTime(peak, now, 0.6);
    gain.setTargetAtTime(1, now + 1.8, 1.2);
  }

  /** Only the dawn follows the scroll: the chord keeps opening as the outro is read. */
  private onProgress(detail: ChapterDetail | undefined): void {
    if (this.paused || this.chapter !== 'outro' || detail?.id !== 'outro') return;
    const progress = Math.min(1, Math.max(0, Number(detail.progress) || 0));
    const cutoff = padCutoff('outro', PRESETS.outro) * (0.7 + 0.3 * progress);
    this.padFilter.frequency.setTargetAtTime(cutoff, this.context.currentTime, 0.6);
  }

  private canPlayDetail(): boolean {
    return this.enabled && !this.paused && this.context.state === 'running';
  }

  private async onVisibility(): Promise<void> {
    if (document.visibilityState === 'hidden') {
      this.rampMaster(0, HIDDEN_FADE_SECONDS);
      await this.wait(HIDDEN_FADE_SECONDS);
      if (document.visibilityState === 'hidden' && this.context.state === 'running') {
        await this.context.suspend();
      }
      return;
    }
    if (!this.enabled) return;
    await this.context.resume();
    this.rampMaster(MASTER_LEVEL, FADE_IN_SECONDS);
  }

  private connectWithSends(node: AudioNode, dry: number, room: number, hall: number): void {
    for (const [destination, level] of [
      [this.master, dry],
      [this.roomSend, room],
      [this.hallSend, hall]
    ] as const) {
      if (level <= 0) continue;
      const gain = this.context.createGain();
      gain.gain.value = level;
      node.connect(gain).connect(destination);
    }
  }

  private rampMaster(target: number, seconds: number): void {
    rampTo(this.master.gain, target, this.context.currentTime, seconds);
  }

  private clearChimeTimer(): void {
    if (this.chimeTimer) clearTimeout(this.chimeTimer);
    this.chimeTimer = null;
  }

  private wait(seconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
  }
}

export function createAmbience(context: AudioContext): Ambience {
  return new Ambience(context);
}
