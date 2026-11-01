import type { DeskVoice } from './desk-voices';
import { envelope, grain, releaseAfter, ring, thump, vary } from './synth';

export type BattleSound = 'growl' | 'flap' | 'flame' | 'quick' | 'spark' | 'thunder' | 'impact' | 'land' | 'chirp' | 'roar';

interface Sweep {
  type: BiquadFilterType;
  from: number;
  to: number;
  q: number;
  level: number;
  attack: number;
  hold: number;
  decay: number;
}

const start = (context: BaseAudioContext) => context.currentTime + 0.005;

function sweep(context: BaseAudioContext, out: AudioNode, noise: AudioBuffer, at: number, options: Sweep): void {
  const source = context.createBufferSource();
  source.buffer = noise;
  const filter = context.createBiquadFilter();
  filter.type = options.type;
  filter.Q.value = options.q;
  const end = at + options.attack + options.hold + options.decay;
  filter.frequency.setValueAtTime(options.from, at);
  filter.frequency.exponentialRampToValueAtTime(options.to, end);
  const amp = envelope(context, out, at);
  amp.gain.linearRampToValueAtTime(options.level, at + options.attack);
  amp.gain.setValueAtTime(options.level, at + options.attack + options.hold);
  amp.gain.exponentialRampToValueAtTime(0.0001, end);
  source.connect(filter).connect(amp);
  source.start(at, Math.random() * Math.max(0, noise.duration - end + at - 0.1), end - at + 0.05);
  releaseAfter(source, [filter, amp]);
}

function growlTone(context: BaseAudioContext, out: AudioNode, at: number, hz: number, level: number, seconds: number): void {
  const oscillator = context.createOscillator();
  oscillator.type = 'sawtooth';
  oscillator.frequency.setValueAtTime(hz, at);
  oscillator.frequency.linearRampToValueAtTime(hz * 1.25, at + seconds * 0.3);
  oscillator.frequency.exponentialRampToValueAtTime(hz * 0.7, at + seconds);
  const filter = context.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = hz * 6;
  const amp = envelope(context, out, at);
  amp.gain.linearRampToValueAtTime(level, at + 0.06);
  amp.gain.exponentialRampToValueAtTime(0.0001, at + seconds);
  oscillator.connect(filter).connect(amp);
  oscillator.start(at);
  oscillator.stop(at + seconds + 0.02);
  releaseAfter(oscillator, [filter, amp]);
}

const growl: DeskVoice = (context, out, noise, level, pitch) => {
  const at = start(context);
  growlTone(context, out, at, 110 * pitch, level * 0.6, 0.45);
  sweep(context, out, noise, at, { type: 'bandpass', from: 500, to: 300, q: 2, level: level * 0.5, attack: 0.05, hold: 0.15, decay: 0.25 });
};

const roar: DeskVoice = (context, out, noise, level, pitch) => {
  const at = start(context);
  growlTone(context, out, at, 95 * pitch, level * 0.7, 0.9);
  growlTone(context, out, at + 0.02, 143 * pitch, level * 0.35, 0.8);
  sweep(context, out, noise, at, { type: 'bandpass', from: 700, to: 260, q: 1.5, level: level * 0.55, attack: 0.08, hold: 0.35, decay: 0.45 });
};

const flap: DeskVoice = (context, out, noise, level, pitch) => {
  sweep(context, out, noise, start(context), { type: 'lowpass', from: 900 * pitch, to: 250, q: 0.7, level, attack: 0.03, hold: 0.02, decay: 0.12 });
};

const flame: DeskVoice = (context, out, noise, level, pitch) => {
  const at = start(context);
  sweep(context, out, noise, at, { type: 'bandpass', from: 600 * pitch, to: 1800 * pitch, q: 0.8, level, attack: 0.12, hold: 0.6, decay: 0.35 });
  sweep(context, out, noise, at, { type: 'lowpass', from: 300, to: 180, q: 0.7, level: level * 0.8, attack: 0.1, hold: 0.6, decay: 0.4 });
  for (let i = 0; i < 10; i++) grain(context, out, noise, at + 0.1 + Math.random() * 0.8, { hz: vary(3200, 0.3), q: 8, level: level * 0.25, decay: 0.02 });
};

const quick: DeskVoice = (context, out, noise, level, pitch) => {
  sweep(context, out, noise, start(context), { type: 'bandpass', from: 700 * pitch, to: 4200 * pitch, q: 3, level, attack: 0.08, hold: 0, decay: 0.16 });
};

const spark: DeskVoice = (context, out, noise, level, pitch) => {
  const at = start(context);
  for (let i = 0; i < 9; i++) grain(context, out, noise, at + i * 0.035 + Math.random() * 0.02, { hz: vary(5200 * pitch, 0.25), q: 10, level: level * (0.5 + Math.random() * 0.5), decay: 0.018 });
};

const thunder: DeskVoice = (context, out, noise, level, pitch) => {
  const at = start(context);
  sweep(context, out, noise, at, { type: 'highpass', from: 2500 * pitch, to: 900, q: 0.7, level, attack: 0.004, hold: 0.02, decay: 0.12 });
  sweep(context, out, noise, at + 0.01, { type: 'lowpass', from: 420, to: 90, q: 0.9, level: level * 0.9, attack: 0.02, hold: 0.05, decay: 0.6 });
  for (let i = 0; i < 5; i++) grain(context, out, noise, at + i * 0.018, { hz: vary(4000, 0.3), q: 4, level: level * 0.6, decay: 0.015 });
};

const impact: DeskVoice = (context, out, noise, level, pitch) => {
  const at = start(context);
  thump(context, out, at, { from: 150 * pitch, to: 48, level, decay: 0.32 });
  sweep(context, out, noise, at, { type: 'lowpass', from: 2200, to: 300, q: 0.7, level: level * 0.6, attack: 0.003, hold: 0.01, decay: 0.2 });
};

const land: DeskVoice = (context, out, noise, level, pitch) => {
  const at = start(context);
  thump(context, out, at, { from: 120 * pitch, to: 60, level, decay: 0.18 });
  sweep(context, out, noise, at, { type: 'lowpass', from: 800, to: 200, q: 0.7, level: level * 0.4, attack: 0.005, hold: 0, decay: 0.15 });
};

const chirp: DeskVoice = (context, out, _noise, level, pitch) => {
  const at = start(context);
  thump(context, out, at, { from: 1150 * pitch, to: 1650 * pitch, level, decay: 0.09, type: 'triangle' });
  thump(context, out, at + 0.12, { from: 1500 * pitch, to: 1250 * pitch, level: level * 0.9, decay: 0.14, type: 'triangle' });
  ring(context, out, at + 0.12, 2600 * pitch, level * 0.15, 0.12);
};

export const BATTLE_VOICES: Record<BattleSound, DeskVoice> = { growl, flap, flame, quick, spark, thunder, impact, land, chirp, roar };

export const BATTLE_LEVEL: Record<BattleSound, number> = {
  growl: 0.12,
  flap: 0.14,
  flame: 0.16,
  quick: 0.1,
  spark: 0.06,
  thunder: 0.22,
  impact: 0.2,
  land: 0.14,
  chirp: 0.07,
  roar: 0.16
};
