const PASS_LEVEL = 0.05;
const TICK_MS = 1000;
const PASSES_PER_SECOND = 0.22;

/** Distant cars going by: a filtered noise swell that pans across, now and then. */
export class CityPasses {
  private readonly bus: GainNode;
  private level = 0;
  private readonly timer: ReturnType<typeof setInterval>;

  constructor(
    private readonly context: AudioContext,
    private readonly noise: AudioBuffer,
    destination: AudioNode
  ) {
    this.bus = context.createGain();
    this.bus.gain.value = 0;
    this.bus.connect(destination);
    this.timer = setInterval(() => this.tick(), TICK_MS);
  }

  set(level: number, seconds: number): void {
    this.level = level;
    this.bus.gain.setTargetAtTime(level * PASS_LEVEL, this.context.currentTime, seconds / 3);
  }

  dispose(): void {
    clearInterval(this.timer);
  }

  private tick(): void {
    if (this.context.state !== 'running' || this.level < 0.02) return;
    if (Math.random() > PASSES_PER_SECOND * this.level) return;
    const at = this.context.currentTime + 0.05;
    const duration = 2.5 + Math.random() * 3.5;
    const source = this.context.createBufferSource();
    source.buffer = this.noise;
    source.loop = true;
    source.playbackRate.value = 0.5 + Math.random() * 0.3;
    const tone = this.context.createBiquadFilter();
    tone.type = 'lowpass';
    tone.Q.value = 0.7;
    tone.frequency.setValueAtTime(260, at);
    tone.frequency.linearRampToValueAtTime(520 + Math.random() * 300, at + duration * 0.5);
    tone.frequency.linearRampToValueAtTime(240, at + duration);
    const amp = this.context.createGain();
    amp.gain.setValueAtTime(0, at);
    amp.gain.linearRampToValueAtTime(0.4 + Math.random() * 0.6, at + duration * 0.5);
    amp.gain.linearRampToValueAtTime(0, at + duration);
    const pan = this.context.createStereoPanner();
    const side = Math.random() < 0.5 ? -1 : 1;
    pan.pan.setValueAtTime(-0.6 * side, at);
    pan.pan.linearRampToValueAtTime(0.6 * side, at + duration);
    source.connect(tone).connect(amp).connect(pan).connect(this.bus);
    source.addEventListener('ended', () => pan.disconnect());
    source.start(at, Math.random() * 3);
    source.stop(at + duration + 0.05);
  }
}
