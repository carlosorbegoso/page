import { THUNDERBOLT } from './beats';
import { hold, span } from './curves';
import type { BattleFrame } from './frame';

const STRIKE_RISE = 0.025;
const STRIKE_DECAY = 0.08;
const RESIDUAL = 0.28;

function strikeEnvelope(age: number): number {
  if (age < 0) return 0;
  if (age < STRIKE_RISE) return age / STRIKE_RISE;
  return Math.exp(-(age - STRIKE_RISE) / STRIKE_DECAY);
}

export function strikeAt(t: number): { index: number; flash: number } {
  let index = -1;
  let flash = 0;
  THUNDERBOLT.strikes.forEach((at, i) => {
    if (t < at) return;
    index = i;
    flash = Math.max(flash, strikeEnvelope(t - at) * (1 - 0.2 * i));
  });
  return { index, flash };
}

function charge(t: number, frame: BattleFrame): void {
  const [from, to] = THUNDERBOLT.charge;
  const gathering = hold(t, [from, to], THUNDERBOLT.end);
  const p = frame.pikachu;
  p.squash += 0.18 * hold(t, [from, from + 0.25], [to - 0.04, to + 0.04]);
  p.lean += 0.1 * hold(t, [from, from + 0.25], [to - 0.04, to + 0.04]);
  p.cheeks += (0.4 + 0.6 * span(t, from, to)) * gathering;
  p.ears += 0.3 * gathering;
  frame.effects.crackle += gathering;
}

export function addThunderbolt(t: number, frame: BattleFrame): void {
  charge(t, frame);
  const first = THUNDERBOLT.strikes[0];
  const release = hold(t, [first - 0.05, first + 0.04], [THUNDERBOLT.end[0] - 0.05, THUNDERBOLT.end[1] + 0.1]);
  frame.pikachu.squash -= 0.12 * release;
  frame.pikachu.lean -= 0.1 * release;
  const strike = strikeAt(t);
  const open = t >= first ? 1 - span(t, THUNDERBOLT.end[0], THUNDERBOLT.end[1]) : 0;
  frame.effects.bolt += Math.max(strike.flash, RESIDUAL) * open;
  frame.effects.strike = open > 0 ? strike.index : -1;
}
