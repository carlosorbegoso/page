import { FACE_OFF, QUICK_ATTACK, RETURN } from './beats';
import { ease, FACE_CHARIZARD, FACE_PIKACHU, hold, span } from './curves';
import type { BattleFrame } from './frame';

const CROUCH_UNTIL = [QUICK_ATTACK.hop[0] - 0.06, QUICK_ATTACK.hop[0] + 0.02] as const;

function facing(t: number, frame: BattleFrame): void {
  const home = 1 - ease(span(t, RETURN.turn[0], RETURN.turn[1]));
  frame.pikachu.yaw += FACE_CHARIZARD * ease(span(t, FACE_OFF.turn[0], FACE_OFF.turn[1])) * home;
  frame.charizard.yaw += FACE_PIKACHU * ease(span(t, FACE_OFF.turn[0] + 0.1, FACE_OFF.turn[1] + 0.1)) * home;
  frame.still = hold(t, [0, 0.4], RETURN.still);
}

function crouch(t: number, frame: BattleFrame): void {
  const low = hold(t, FACE_OFF.crouch, CROUCH_UNTIL);
  frame.pikachu.squash += 0.14 * low;
  frame.pikachu.lean += 0.16 * low;
  frame.pikachu.ears -= 0.45 * low;
  frame.pikachu.tail += 0.25 * low;
  const crackle = hold(t, [FACE_OFF.sparks[0], FACE_OFF.sparks[0] + 0.1], [FACE_OFF.sparks[1] - 0.15, FACE_OFF.sparks[1]]);
  frame.pikachu.cheeks += 0.45 * crackle;
  frame.effects.crackle += 0.7 * crackle;
}

function rearUp(t: number, frame: BattleFrame): void {
  const rear = hold(t, [FACE_OFF.rear[0], FACE_OFF.rear[0] + 0.4], [FACE_OFF.rear[1] - 0.15, FACE_OFF.rear[1] + 0.1]);
  frame.charizard.lean -= 0.24 * rear;
  frame.charizard.squash -= 0.06 * rear;
  frame.charizard.wings += 0.45 * rear;
  frame.charizard.flame += 0.5 * rear;
}

export function addFaceOff(t: number, frame: BattleFrame): void {
  facing(t, frame);
  crouch(t, frame);
  rearUp(t, frame);
}
