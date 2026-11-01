import { midiToHz } from './chapters';
import { envelope, releaseAfter, vary } from './synth';

/** Soft mechanical key: a felted thock under a short bandpassed click. */
export function playKey(
  context: BaseAudioContext,
  destination: AudioNode,
  noise: AudioBuffer,
  level: number
): void {
  const at = context.currentTime + 0.005;
  const amp = vary(level, 0.25);

  const click = context.createBufferSource();
  click.buffer = noise;
  click.playbackRate.value = vary(1, 0.1);
  const band = context.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = vary(2600, 0.15);
  band.Q.value = 1.4;
  const clickGain = envelope(context, destination, at);
  clickGain.gain.linearRampToValueAtTime(amp * 0.6, at + 0.002);
  clickGain.gain.exponentialRampToValueAtTime(0.0001, at + 0.035);
  click.connect(band).connect(clickGain);
  click.start(at, Math.random() * 2, 0.05);
  releaseAfter(click, [band, clickGain]);

  const thock = context.createOscillator();
  thock.frequency.setValueAtTime(vary(210, 0.08), at);
  thock.frequency.exponentialRampToValueAtTime(120, at + 0.05);
  const thockGain = envelope(context, destination, at);
  thockGain.gain.linearRampToValueAtTime(amp, at + 0.003);
  thockGain.gain.exponentialRampToValueAtTime(0.0001, at + 0.07);
  thock.connect(thockGain);
  thock.start(at);
  thock.stop(at + 0.08);
  releaseAfter(thock, [thockGain]);
}

/** Wooden "tock": a short pitched knock with a dropping tone, like a knuckle on a walnut desk. */
export function playTock(context: BaseAudioContext, destination: AudioNode, level: number): void {
  const at = context.currentTime + 0.005;
  const pitch = vary(480, 0.06);
  for (const [ratio, gain, decay] of [
    [1, 1, 0.11],
    [2.31, 0.35, 0.05],
    [3.9, 0.12, 0.03]
  ] as const) {
    const oscillator = context.createOscillator();
    oscillator.frequency.setValueAtTime(pitch * ratio * 1.04, at);
    oscillator.frequency.exponentialRampToValueAtTime(pitch * ratio, at + 0.03);
    const amp = envelope(context, destination, at);
    amp.gain.linearRampToValueAtTime(level * gain, at + 0.002);
    amp.gain.exponentialRampToValueAtTime(0.0001, at + decay);
    oscillator.connect(amp);
    oscillator.start(at);
    oscillator.stop(at + decay + 0.02);
    releaseAfter(oscillator, [amp]);
  }
}

/** Phone notification: two soft glassy notes a fifth apart. */
export function playChime(context: BaseAudioContext, destination: AudioNode, level: number): void {
  const start = context.currentTime + 0.03;
  [
    [88, 0],
    [95, 0.16]
  ].forEach(([note = 88, delay = 0]) => {
    const at = start + delay;
    const frequency = midiToHz(note);
    const amp = envelope(context, destination, at);
    amp.gain.linearRampToValueAtTime(level, at + 0.006);
    amp.gain.exponentialRampToValueAtTime(0.0001, at + 1.8);
    for (const [ratio, gain] of [
      [1, 1],
      [2.756, 0.18],
      [5.404, 0.05]
    ] as const) {
      const oscillator = context.createOscillator();
      oscillator.frequency.value = frequency * ratio;
      const partial = context.createGain();
      partial.gain.value = gain;
      oscillator.connect(partial).connect(amp);
      oscillator.start(at);
      oscillator.stop(at + 1.9);
      releaseAfter(oscillator, [partial]);
    }
  });
}
