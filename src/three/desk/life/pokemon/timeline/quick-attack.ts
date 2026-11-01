import { QUICK_ATTACK } from './beats';
import { arc, ease, easeOut, pulse, SIDE, span } from './curves';
import type { BattleFrame } from './frame';

const DODGE = 0.028;
const HOP = 0.022;
const RETURN_HOP = 0.008;

export function addQuickAttack(t: number, frame: BattleFrame): void {
  const [from, to] = QUICK_ATTACK.hop;
  const [backFrom, backTo] = QUICK_ATTACK.back;
  const out = easeOut(span(t, from, to)) * (1 - ease(span(t, backFrom, backTo)));
  const p = frame.pikachu;
  p.x += SIDE.x * DODGE * out;
  p.z += SIDE.z * DODGE * out;
  p.hop += HOP * arc(t, from, to);
  const middle = (backFrom + backTo) / 2;
  p.hop += RETURN_HOP * (arc(t, backFrom, middle) + arc(t, middle, backTo));
  p.roll -= 0.35 * pulse(t, from, to);
  p.squash -= 0.12 * pulse(t, from, from + 0.12);
  p.squash += 0.16 * pulse(t, QUICK_ATTACK.land[0], QUICK_ATTACK.land[1]);
  p.ears -= 0.3 * pulse(t, from, QUICK_ATTACK.land[1]);
  frame.effects.trail += pulse(t, QUICK_ATTACK.trail[0], QUICK_ATTACK.trail[1]);
}
