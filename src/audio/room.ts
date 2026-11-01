import { createDrop } from './buffers';
import { CityPasses } from './traffic';

export const ROOM_LEVELS = {
  rainWash: 0.05,
  drops: 0.07,
  hum: 0.12,
  city: 0.16
} as const;

const DROPS_PER_SECOND = 9;
const DROP_TICK_MS = 120;

/** Continuous room tone: rain on the window glass, a faint room hum and a distant city. */
export class RoomTone {
  readonly output: GainNode;
  private readonly rain: GainNode;
  private readonly dropBus: GainNode;
  private readonly hum: GainNode;
  private readonly city: GainNode;
  private readonly passes: CityPasses;
  private readonly drops: AudioBuffer[];
  private readonly sources: AudioScheduledSourceNode[] = [];
  private rainLevel = 0;
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(
    private readonly context: AudioContext,
    noise: AudioBuffer
  ) {
    this.output = context.createGain();

    this.rain = context.createGain();
    this.rain.gain.value = 0;
    this.rain.connect(this.output);
    const wash = this.loop(noise, 1);
    const washHigh = context.createBiquadFilter();
    washHigh.type = 'highpass';
    washHigh.frequency.value = 450;
    const washLow = context.createBiquadFilter();
    washLow.type = 'lowpass';
    washLow.frequency.value = 4800;
    const washGain = context.createGain();
    washGain.gain.value = ROOM_LEVELS.rainWash;
    wash.connect(washHigh).connect(washLow).connect(washGain).connect(this.rain);
    this.modulate(washGain.gain, 0.07, ROOM_LEVELS.rainWash * 0.25);

    this.dropBus = context.createGain();
    this.dropBus.gain.value = ROOM_LEVELS.drops;
    const glass = context.createBiquadFilter();
    glass.type = 'peaking';
    glass.frequency.value = 3200;
    glass.gain.value = -4;
    this.dropBus.connect(glass).connect(this.rain);
    this.drops = [2400, 3100, 3800, 4700].map(hz => createDrop(context, hz));

    this.hum = context.createGain();
    this.hum.gain.value = 0;
    this.hum.connect(this.output);
    const rumble = this.loop(noise, 0.71);
    const rumbleLow = context.createBiquadFilter();
    rumbleLow.type = 'lowpass';
    rumbleLow.frequency.value = 160;
    const rumbleGain = context.createGain();
    rumbleGain.gain.value = 0.6;
    rumble.connect(rumbleLow).connect(rumbleGain).connect(this.hum);
    for (const [hz, gain] of [
      [60, 0.12],
      [120, 0.04],
      [180, 0.015]
    ] as const) {
      const tone = context.createOscillator();
      tone.frequency.value = hz;
      const toneGain = context.createGain();
      toneGain.gain.value = gain * ROOM_LEVELS.hum;
      tone.connect(toneGain).connect(this.hum);
      this.sources.push(tone);
    }
    rumbleGain.gain.value = 0.6 * ROOM_LEVELS.hum;

    this.city = context.createGain();
    this.city.gain.value = 0;
    this.city.connect(this.output);
    const traffic = this.loop(noise, 0.43);
    const trafficLow = context.createBiquadFilter();
    trafficLow.type = 'lowpass';
    trafficLow.frequency.value = 280;
    const trafficBand = context.createBiquadFilter();
    trafficBand.type = 'peaking';
    trafficBand.frequency.value = 110;
    trafficBand.gain.value = 5;
    const trafficGain = context.createGain();
    trafficGain.gain.value = ROOM_LEVELS.city;
    traffic.connect(trafficLow).connect(trafficBand).connect(trafficGain).connect(this.city);
    this.modulate(trafficGain.gain, 0.023, ROOM_LEVELS.city * 0.35);

    this.passes = new CityPasses(context, noise, this.output);

    for (const source of this.sources) source.start();
    this.timer = setInterval(() => this.scheduleDrops(), DROP_TICK_MS);
  }

  set(levels: { rain: number; hum: number; city: number; passes?: number }, seconds: number): void {
    const now = this.context.currentTime;
    const tau = seconds / 3;
    this.rainLevel = levels.rain;
    this.rain.gain.setTargetAtTime(levels.rain, now, tau);
    this.hum.gain.setTargetAtTime(levels.hum, now, tau);
    this.city.gain.setTargetAtTime(levels.city, now, tau);
    this.passes.set(levels.passes ?? 0, seconds);
  }

  dispose(): void {
    if (this.timer) clearInterval(this.timer);
    this.passes.dispose();
    for (const source of this.sources) source.stop();
  }

  private scheduleDrops(): void {
    if (this.context.state !== 'running' || this.rainLevel < 0.02) return;
    const window = DROP_TICK_MS / 1000;
    const expected = DROPS_PER_SECOND * window * this.rainLevel;
    const count = Math.floor(expected) + (Math.random() < expected % 1 ? 1 : 0);
    const now = this.context.currentTime + 0.05;
    for (let i = 0; i < count; i++) {
      const source = this.context.createBufferSource();
      source.buffer = this.drops[Math.floor(Math.random() * this.drops.length)] ?? null;
      source.playbackRate.value = 0.75 + Math.random() * 0.6;
      const gain = this.context.createGain();
      gain.gain.value = 0.15 + Math.random() ** 3 * 0.85;
      const pan = this.context.createStereoPanner();
      pan.pan.value = Math.random() * 1.6 - 0.8;
      source.connect(gain).connect(pan).connect(this.dropBus);
      source.addEventListener('ended', () => pan.disconnect());
      source.start(now + Math.random() * window);
    }
  }

  private loop(buffer: AudioBuffer, rate: number): AudioBufferSourceNode {
    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.playbackRate.value = rate;
    this.sources.push(source);
    return source;
  }

  private modulate(param: AudioParam, hz: number, depth: number): void {
    const lfo = this.context.createOscillator();
    lfo.frequency.value = hz;
    const amount = this.context.createGain();
    amount.gain.value = depth;
    lfo.connect(amount).connect(param);
    this.sources.push(lfo);
  }
}
