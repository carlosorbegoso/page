import { createImpulse, createNoise } from './buffers';
import { isChapterId, midiToHz, PRESETS, type ChapterId, type ChapterPreset } from './chapters';
import { RoomTone } from './room';
import { playChime, playKey, playTock } from './voices';

/** Master level at full volume. Keep it low: this is a background bed, not music. */
export const MASTER_LEVEL = 0.11;

const LEVELS = {
  pad: 0.32,
  room: 1,
  key: 0.1,
  tockHover: 0.09,
  tockClick: 0.18,
  chime: 0.16
} as const;

const SWELL_GAIN = 1.45;
const SUB_SHOT_SWELL_GAIN = 1.2;
const FADE_IN_SECONDS = 2.5;
const FADE_OUT_SECONDS = 1.2;
const HIDDEN_FADE_SECONDS = 0.6;
const KEY_GAP_MS = 28;
const TOCK_GAP_MS = 250;
const CHIME_GAP_MS = 4000;
const FALLBACK_CHIME_DELAY_MS = 900;
const DETUNE_CENTS = 7;
const FILTER_LFO_HZ = 0.045;
const FILTER_LFO_DEPTH_HZ = 90;

type Source = 'chapter' | 'station' | 'section';

interface ChapterDetail {
  id?: string | null;
  subIndex?: number;
  progress?: number;
}

class ChordLayer {
  private readonly output: GainNode;
  private readonly oscillators: OscillatorNode[] = [];

  constructor(context: AudioContext, preset: ChapterPreset, destination: AudioNode) {
    this.output = context.createGain();
    this.output.gain.value = 0;
    this.output.connect(destination);

    const voiceGain = 1 / Math.sqrt(preset.chord.length * 2);
    preset.chord.forEach((note, index) => {
      const voice = context.createGain();
      voice.gain.value = voiceGain;
      voice.connect(this.output);
      const drift = index % 2 === 0 ? 1.5 : -1.5;
      for (const [type, detune] of [
        ['triangle', -DETUNE_CENTS],
        ['sine', DETUNE_CENTS]
      ] as const) {
        const oscillator = context.createOscillator();
        oscillator.type = type;
        oscillator.frequency.value = midiToHz(note);
        oscillator.detune.value = detune + drift;
        oscillator.connect(voice);
        this.oscillators.push(oscillator);
      }
    });
    for (const oscillator of this.oscillators) oscillator.start();
  }

  fadeIn(at: number, seconds: number): void {
    rampTo(this.output.gain, 1, at, seconds);
  }

  fadeOutAndStop(at: number, seconds: number): void {
    rampTo(this.output.gain, 0, at, seconds);
    for (const oscillator of this.oscillators) oscillator.stop(at + seconds + 0.05);
    this.oscillators[0]?.addEventListener('ended', () => this.output.disconnect());
  }
}

function rampTo(param: AudioParam, target: number, at: number, seconds: number): void {
  param.cancelScheduledValues(at);
  param.setValueAtTime(param.value, at);
  param.linearRampToValueAtTime(target, at + seconds);
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
  private lastKey = 0;
  private lastTock = 0;
  private lastChime = 0;
  private lastHoverLabel: string | null = null;
  private chimeTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly abort = new AbortController();

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
    this.chimeBus = context.createGain();
    this.connectWithSends(this.chimeBus, 0.6, 0.6, 0.5);

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
    if (!this.layer) this.setChapter(this.chapter ?? this.chapterFromDom(), false);
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
    on<{ label?: string | null }>('scene:hover', detail => this.onHover(detail?.label ?? null));
    on<{ source?: string }>('product:focus', detail => this.onSceneSelect(detail?.source));
    on<{ source?: string }>('experience:focus', detail => this.onSceneSelect(detail?.source));
    on<unknown>('desk:key', () => this.onKey());
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
    if (id !== 'contact') this.clearChimeTimer();
    const preset = PRESETS[id];
    const now = this.context.currentTime;
    const seconds = preset.crossfade;
    const tau = seconds / 3;

    const next = new ChordLayer(this.context, preset, this.padBus);
    this.layer?.fadeOutAndStop(now, seconds);
    next.fadeIn(now, seconds);
    this.layer = next;

    this.padFilter.frequency.setTargetAtTime(preset.cutoff, now, tau);
    this.roomSend.gain.setTargetAtTime(preset.room, now, tau);
    this.hallSend.gain.setTargetAtTime(preset.hall, now, tau);
    this.roomTone.set(preset, seconds);

    if (withSwell) this.swellBy(SWELL_GAIN);
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
    const cutoff = PRESETS.outro.cutoff * (0.7 + 0.3 * progress);
    this.padFilter.frequency.setTargetAtTime(cutoff, this.context.currentTime, 0.6);
  }

  private onHover(label: string | null): void {
    const changed = label !== this.lastHoverLabel;
    this.lastHoverLabel = label;
    if (label && changed) this.tock(LEVELS.tockHover);
  }

  private onSceneSelect(source: string | undefined): void {
    if (source === 'scene') this.tock(LEVELS.tockClick);
  }

  private tock(level: number): void {
    if (!this.canPlayDetail()) return;
    const now = performance.now();
    if (now - this.lastTock < TOCK_GAP_MS) return;
    this.lastTock = now;
    playTock(this.context, this.fxBus, level);
  }

  private onKey(): void {
    if (!this.canPlayDetail()) return;
    const now = performance.now();
    if (now - this.lastKey < KEY_GAP_MS) return;
    this.lastKey = now;
    playKey(this.context, this.fxBus, this.noise, LEVELS.key);
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

  private chapterFromDom(): ChapterId {
    const centre = innerHeight / 2;
    for (const section of document.querySelectorAll<HTMLElement>('[data-station]')) {
      const box = section.getBoundingClientRect();
      const id = section.dataset.station;
      if (box.top <= centre && box.bottom >= centre && isChapterId(id)) return id;
    }
    return 'hero';
  }

  private wait(seconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
  }
}

export function createAmbience(context: AudioContext): Ambience {
  return new Ambience(context);
}
