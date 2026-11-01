import { FLAMETHROWER } from './beats';
import { ease, hold, pulse, span } from './curves';
import type { BattleFrame } from './frame';

export function addFlamethrower(t: number, frame: BattleFrame): void {
  const [inhaleFrom, inhaleTo] = FLAMETHROWER.inhale;
  const inhale = pulse(t, inhaleFrom, inhaleTo + 0.05);
  const breath = hold(t, [inhaleTo - 0.05, inhaleTo + 0.1], [FLAMETHROWER.fade[0] + 0.05, FLAMETHROWER.breath[1] + 0.1]);
  const c = frame.charizard;
  c.lean += 0.22 * breath - 0.2 * inhale;
  c.squash -= 0.05 * inhale;
  c.flame += 0.8 * inhale + 0.4 * breath;
  const fire = hold(t, FLAMETHROWER.rise, FLAMETHROWER.fade);
  frame.effects.fire += fire;
  frame.effects.fireFollow += 0.3 * ease(span(t, FLAMETHROWER.follow[0], FLAMETHROWER.follow[1])) * (1 - span(t, FLAMETHROWER.fade[1], FLAMETHROWER.breath[1] + 0.2));
  frame.effects.mouthGlow += 0.5 * inhale;
}
