import { ROAR, VICTORY } from './beats';
import { arc, hold, pulse } from './curves';
import type { BattleFrame } from './frame';

const VICTORY_HOP = 0.012;
const WAG_HZ = 3.2;

function victory(t: number, frame: BattleFrame): void {
  const p = frame.pikachu;
  for (const [from, to] of VICTORY.hops) {
    p.hop += VICTORY_HOP * arc(t, from, to);
    p.squash += 0.08 * pulse(t, to, to + 0.14) - 0.06 * pulse(t, from, from + 0.1);
  }
  const proud = hold(t, VICTORY.ears, [7.3, 7.7]);
  p.ears += 0.4 * proud;
  p.lean -= 0.05 * proud;
  const wag = hold(t, [VICTORY.wag[0], VICTORY.wag[0] + 0.15], [VICTORY.wag[1] - 0.2, VICTORY.wag[1]]);
  p.tail += 0.35 * Math.sin((t - VICTORY.wag[0]) * Math.PI * 2 * WAG_HZ) * wag;
  const sparkle = hold(t, [VICTORY.hops[0][0], VICTORY.hops[0][0] + 0.1], [VICTORY.hops[1][1], VICTORY.hops[1][1] + 0.2]);
  p.cheeks += 0.35 * sparkle;
  frame.effects.crackle += 0.3 * sparkle;
}

function roar(t: number, frame: BattleFrame): void {
  const [from, to] = ROAR.rear;
  const rear = hold(t, [from, from + 0.3], [to - 0.3, to]);
  const c = frame.charizard;
  c.lean -= 0.2 * rear;
  c.squash -= 0.05 * rear;
  c.wings += 0.35 * rear;
  c.flame += 0.6 * rear;
  frame.effects.puff += hold(t, [ROAR.puff[0], ROAR.puff[0] + 0.1], [ROAR.puff[1] - 0.2, ROAR.puff[1]]);
}

export function addFinale(t: number, frame: BattleFrame): void {
  victory(t, frame);
  roar(t, frame);
}
