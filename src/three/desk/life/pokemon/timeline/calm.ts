import { CALM_SECONDS } from './beats';
import { FACE_CHARIZARD, FACE_PIKACHU, hold, pulse } from './curves';
import { restingFrame, type BattleFrame } from './frame';

const TURN_SHARE = 0.35;

export function calmAt(t: number): BattleFrame {
  const frame = restingFrame(true);
  if (t < 0 || t > CALM_SECONDS) return frame;
  const turn = TURN_SHARE * hold(t, [0, 0.7], [CALM_SECONDS - 0.8, CALM_SECONDS]);
  frame.pikachu.yaw = FACE_CHARIZARD * turn;
  frame.charizard.yaw = FACE_PIKACHU * turn;
  frame.charizard.flame = 1 + 0.35 * pulse(t, 0.5, 1.7);
  frame.effects.mouthGlow = 0.35 * pulse(t, 0.6, 1.7);
  frame.pikachu.cheeks = 0.6 * pulse(t, 1.4, 2.6);
  return frame;
}
