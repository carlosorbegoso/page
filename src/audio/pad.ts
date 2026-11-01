import { midiToHz, type ChapterPreset } from './chapters';

const DETUNE_CENTS = 7;

export class ChordLayer {
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

export function rampTo(param: AudioParam, target: number, at: number, seconds: number): void {
  param.cancelScheduledValues(at);
  param.setValueAtTime(param.value, at);
  param.linearRampToValueAtTime(target, at + seconds);
}
