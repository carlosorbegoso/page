import { IMPACT } from './beats';
import { ease, easeOut, hold, LINE, pulse, span } from './curves';
import type { BattleFrame } from './frame';
import { strikeAt } from './thunderbolt';

const KNOCKBACK = 0.012;
const SHAKE = 0.0025;

export function addImpact(t: number, frame: BattleFrame): void {
  const [from, to] = IMPACT.recoil;
  const recoil = easeOut(span(t, from, from + 0.07)) * (1 - ease(span(t, from + 0.12, to)));
  const c = frame.charizard;
  c.x += LINE.x * KNOCKBACK * recoil;
  c.z += LINE.z * KNOCKBACK * recoil;
  c.lean -= 0.28 * recoil;
  c.wings += 0.3 * recoil;
  c.shake += SHAKE * Math.sin(t * 85) * recoil * (1 - span(t, from, to));
  const strike = t >= IMPACT.hit ? strikeAt(t).flash * (1 - span(t, to - 0.25, to)) : 0;
  frame.effects.impact += Math.max(pulse(t, IMPACT.flash[0], IMPACT.flash[1]), 0.6 * strike);
  frame.effects.smoke += hold(t, [IMPACT.smoke[0], IMPACT.smoke[0] + 0.1], [IMPACT.smoke[1] - 0.3, IMPACT.smoke[1]]);
}
