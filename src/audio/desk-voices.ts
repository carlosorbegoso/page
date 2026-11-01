import { grain, ring, thump, vary } from './synth';
import { playKey } from './voices';

/** One desk object's sound. `pitch` is the ±5 % variation picked for this hit. */
export type DeskVoice = (
  context: BaseAudioContext,
  out: AudioNode,
  noise: AudioBuffer,
  level: number,
  pitch: number
) => void;

const start = (context: BaseAudioContext) => context.currentTime + 0.005;

/** Alarm clock: three quick hammer strikes on a small bell, damped by the hand. */
const clock: DeskVoice = (context, out, _noise, level, pitch) => {
  const at = start(context);
  for (let strike = 0; strike < 3; strike++) {
    const t = at + strike * 0.055;
    const amp = level * (1 - strike * 0.22);
    for (const [ratio, gain, decay] of [
      [1, 1, 0.3],
      [2.76, 0.32, 0.16],
      [5.4, 0.12, 0.08]
    ] as const) ring(context, out, t, 1850 * pitch * ratio, amp * gain, decay);
  }
};

/** Laptop hinge: a short friction creak that settles with a soft thud. */
const laptop: DeskVoice = (context, out, noise, level, pitch) => {
  const at = start(context);
  for (let i = 0; i < 6; i++) {
    grain(context, out, noise, at + i * 0.028 + Math.random() * 0.008, {
      hz: vary(1100 * pitch, 0.12),
      q: 9,
      level: level * 0.5,
      decay: 0.03
    });
  }
  thump(context, out, at + 0.19, { from: 160 * pitch, to: 90, level: level * 0.7, decay: 0.09 });
};

/** Keyboard: two or three mechanical taps, a burst of typing. */
const keyboard: DeskVoice = (context, out, noise, level) => {
  const taps = 2 + Math.round(Math.random());
  for (let i = 0; i < taps; i++) {
    setTimeout(() => playKey(context, out, noise, level), i * vary(75, 0.3));
  }
};

/** Folder and paper: a dry crinkle over the soft slap of card on wood. */
const folder: DeskVoice = (context, out, noise, level, pitch) => {
  const at = start(context);
  for (let i = 0; i < 7; i++) {
    grain(context, out, noise, at + Math.random() * 0.16, {
      hz: vary(2800 * pitch, 0.35),
      q: 1.6,
      level: level * vary(0.45, 0.4),
      decay: vary(0.035, 0.4)
    });
  }
  grain(context, out, noise, at, { hz: 900 * pitch, q: 0.8, level: level * 0.5, attack: 0.02, decay: 0.2 });
  thump(context, out, at + 0.15, { from: 140 * pitch, to: 80, level: level * 0.5, decay: 0.07 });
};

/** Chat bubble: a round pop that rises, like a message landing. */
const chat: DeskVoice = (context, out, noise, level, pitch) => {
  const at = start(context);
  thump(context, out, at, { from: 420 * pitch, to: 980 * pitch, level: level * 0.8, decay: 0.08 });
  grain(context, out, noise, at, { hz: 3500, q: 2, level: level * 0.12, decay: 0.012 });
};

/** Gift: ribbon and wrapping paper, brighter and busier than a folder. */
const gift: DeskVoice = (context, out, noise, level, pitch) => {
  const at = start(context);
  for (let i = 0; i < 12; i++) {
    grain(context, out, noise, at + (i / 12) * 0.26 + Math.random() * 0.02, {
      hz: vary(4600 * pitch, 0.3),
      q: 2.2,
      level: level * vary(0.35, 0.5) * (1 - i / 16),
      decay: vary(0.03, 0.4)
    });
  }
  grain(context, out, noise, at, { hz: 1800 * pitch, q: 1.2, level: level * 0.25, attack: 0.04, decay: 0.28 });
};

/** Mug: a light tap on porcelain, a high glassy ring with a tiny tick. */
const mug: DeskVoice = (context, out, noise, level, pitch) => {
  const at = start(context);
  for (const [hz, gain, decay] of [
    [2950, 1, 0.32],
    [4870, 0.45, 0.2],
    [7310, 0.18, 0.1]
  ] as const) ring(context, out, at, hz * pitch, level * gain * 0.6, decay);
  grain(context, out, noise, at, { hz: 6000, q: 1.5, level: level * 0.2, decay: 0.01 });
};

/** Wrench: a small steel clink, inharmonic and short. */
const wrench: DeskVoice = (context, out, noise, level, pitch) => {
  const at = start(context);
  for (const [hz, gain, decay] of [
    [1730, 0.7, 0.22],
    [4410, 0.5, 0.15],
    [6930, 0.25, 0.08]
  ] as const) ring(context, out, at, hz * pitch, level * gain * 0.6, decay);
  grain(context, out, noise, at, { hz: 5000, q: 1.2, level: level * 0.25, decay: 0.008 });
};

/** Vinyl figure: a soft hollow plastic bump. */
const toy: DeskVoice = (context, out, noise, level, pitch) => {
  const at = start(context);
  thump(context, out, at, { from: 620 * pitch, to: 330 * pitch, level: level * 0.7, decay: 0.06, type: 'triangle' });
  grain(context, out, noise, at, { hz: 1600 * pitch, q: 3, level: level * 0.2, decay: 0.03 });
};

/** Phone on the desk: two short vibration pulses. */
const phone: DeskVoice = (context, out, _noise, level, pitch) => {
  const at = start(context);
  const filter = context.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 420;
  filter.connect(out);
  for (const offset of [0, 0.2]) {
    const t = at + offset;
    const motor = context.createOscillator();
    motor.type = 'sawtooth';
    motor.frequency.value = 150 * pitch;
    const amp = context.createGain();
    amp.gain.setValueAtTime(0, t);
    amp.gain.linearRampToValueAtTime(level * 0.55, t + 0.015);
    amp.gain.setValueAtTime(level * 0.55, t + 0.11);
    amp.gain.linearRampToValueAtTime(0, t + 0.14);
    motor.connect(amp).connect(filter);
    motor.start(t);
    motor.stop(t + 0.15);
    motor.addEventListener('ended', () => amp.disconnect());
  }
  setTimeout(() => filter.disconnect(), 600);
};

/** Window blind: the slats rattle as the cord is pulled. */
const blind: DeskVoice = (context, out, noise, level, pitch) => {
  const at = start(context);
  let t = at;
  for (let i = 0; i < 9; i++) {
    grain(context, out, noise, t, { hz: vary(2300 * pitch, 0.2), q: 6, level: level * vary(0.4, 0.3), decay: 0.025 });
    t += vary(0.034, 0.25);
  }
  grain(context, out, noise, at, { hz: 700 * pitch, q: 0.9, level: level * 0.2, attack: 0.05, decay: 0.3 });
};

export const DESK_VOICES = { clock, laptop, keyboard, folder, chat, gift, mug, wrench, toy, phone, blind } as const;
export type DeskSound = keyof typeof DESK_VOICES;
