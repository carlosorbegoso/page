import type { ChapterId } from './chapters';

/** The score follows the story: tonight's lofi, a sparse piano for the day years, a pad at dawn. */
export type Act = 'night' | 'day' | 'dawn';

const ACT_OF: Record<ChapterId, Act> = {
  intro: 'night',
  hero: 'night',
  about: 'night',
  experience: 'day',
  company: 'night',
  products: 'night',
  contact: 'night',
  outro: 'dawn'
};

/** CC0 tracks (docs/audio.md, "Créditos"); fetched only once the visitor turns the sound on. */
const TRACKS: Record<Act, string> = {
  night: 'audio/music-night.m4a',
  day: 'audio/music-day.m4a',
  dawn: 'audio/music-dawn.m4a'
};

const SAMPLES = {
  switchOn: 'audio/switch-on.m4a',
  switchOff: 'audio/switch-off.m4a',
  pageFlip: 'audio/page-flip.m4a'
} as const;
export type SampleId = keyof typeof SAMPLES;

/** AAC pads the start of a file; skipping it keeps the seamless loops seamless. */
const ENCODER_PRIMING_SECONDS = 0.046;
const CROSSFADE_SECONDS = 3;
const DAWN_CROSSFADE_SECONDS = 5;

function assetUrl(path: string): string {
  return `${import.meta.env.BASE_URL.replace(/\/?$/, '/')}${path}`;
}

/** Looping music beds crossfaded per act, plus one-shot samples (lamp switch, page flip). */
export class MusicBed {
  readonly output: GainNode;
  private readonly buffers = new Map<string, Promise<AudioBuffer | null>>();
  private current: { act: Act; source: AudioBufferSourceNode; gain: GainNode } | null = null;
  private wanted: Act | null = null;

  constructor(
    private readonly context: AudioContext,
    private readonly samplesOut: AudioNode,
    private readonly onFirstTrack: () => void = () => undefined
  ) {
    this.output = context.createGain();
  }

  /** Switches to the act of a chapter; repeated calls for the same act do nothing. */
  follow(chapter: ChapterId): void {
    const day = document.documentElement.dataset.time === 'day';
    void this.play(day ? (chapter === 'outro' ? 'night' : 'day') : ACT_OF[chapter]);
  }

  async playSample(id: SampleId, level: number): Promise<void> {
    const buffer = await this.load(SAMPLES[id]);
    if (!buffer) return;
    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = 0.96 + Math.random() * 0.08;
    const gain = this.context.createGain();
    gain.gain.value = level;
    source.connect(gain).connect(this.samplesOut);
    source.start();
  }

  stop(): void {
    this.current?.source.stop();
    this.current = null;
    this.wanted = null;
  }

  private async play(act: Act): Promise<void> {
    if (this.wanted === act) return;
    this.wanted = act;
    const buffer = await this.load(TRACKS[act]);
    if (!buffer || this.wanted !== act) return;
    const now = this.context.currentTime;
    const fade = act === 'dawn' ? DAWN_CROSSFADE_SECONDS : CROSSFADE_SECONDS;
    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.loopStart = Math.min(ENCODER_PRIMING_SECONDS, buffer.duration / 2);
    source.loopEnd = buffer.duration;
    const gain = this.context.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(1, now + fade);
    source.connect(gain).connect(this.output);
    source.start(now, source.loopStart);
    const previous = this.current;
    if (previous) {
      previous.gain.gain.cancelScheduledValues(now);
      previous.gain.gain.setValueAtTime(previous.gain.gain.value, now);
      previous.gain.gain.linearRampToValueAtTime(0, now + fade);
      previous.source.stop(now + fade + 0.1);
    }
    if (!this.current) this.onFirstTrack();
    this.current = { act, source, gain };
  }

  private load(path: string): Promise<AudioBuffer | null> {
    let pending = this.buffers.get(path);
    if (!pending) {
      pending = fetch(assetUrl(path))
        .then(response => (response.ok ? response.arrayBuffer() : Promise.reject(new Error(response.statusText))))
        .then(data => this.context.decodeAudioData(data))
        .catch(() => null);
      this.buffers.set(path, pending);
    }
    return pending;
  }
}
