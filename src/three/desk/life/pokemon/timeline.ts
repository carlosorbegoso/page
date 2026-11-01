import { CHARIZARD, PIKACHU } from '../../layout';
import { bump } from '../motion';

/** Length of the whole battle, from the first step to Pikachu back on its spot. */
export const BATTLE_SECONDS = 7.6;

export interface PikachuPose {
  /** Offset of the base on the stand (room x, z). */
  x: number;
  z: number;
  hop: number;
  /** Turn from the rest yaw. */
  yaw: number;
  roll: number;
  cheeks: number;
}

export interface CharizardPose {
  yaw: number;
  /** Rearing back (radians about its own right axis). */
  lean: number;
  shake: number;
  wings: number;
  flame: number;
}

export interface BattleEffects {
  fire: number;
  bolt: number;
  impact: number;
}

export interface BattleFrame {
  pikachu: PikachuPose;
  charizard: CharizardPose;
  effects: BattleEffects;
}

const span = (t: number, from: number, to: number) => Math.min(Math.max((t - from) / (to - from), 0), 1);
const ease = (t: number) => t * t * (3 - 2 * t);
const pulse = (t: number, from: number, to: number) => bump(span(t, from, to));

const toCharizard = { x: CHARIZARD.base.x - PIKACHU.base.x, z: CHARIZARD.base.z - PIKACHU.base.z };
const distance = Math.hypot(toCharizard.x, toCharizard.z);
/** Pikachu stops a little over 10 cm from Charizard, inside the stand's base. */
const WALK = distance - 0.105;
const FACE_CHARIZARD = Math.atan2(toCharizard.x, toCharizard.z) - PIKACHU.yaw;
const FACE_HOME = FACE_CHARIZARD + Math.PI;
const FACE_PIKACHU = Math.atan2(-toCharizard.x, -toCharizard.z) - CHARIZARD.yaw;

export const RESTING: BattleFrame = {
  pikachu: { x: 0, z: 0, hop: 0, yaw: 0, roll: 0, cheeks: 0 },
  charizard: { yaw: 0, lean: 0, shake: 0, wings: 0, flame: 1 },
  effects: { fire: 0, bolt: 0, impact: 0 }
};

/** Steps of a short waddle: a bob on every footfall and a side-to-side roll. */
function gait(t: number, walking: number): { hop: number; roll: number } {
  const phase = t * Math.PI * 7;
  return { hop: walking * 0.0045 * Math.abs(Math.sin(phase)), roll: walking * 0.14 * Math.sin(phase) };
}

function pikachuAt(t: number): PikachuPose {
  const out = ease(span(t, 0.4, 1.5));
  const back = ease(span(t, 5.7, 6.9));
  const along = WALK * (out - back);
  const walking = Math.max(pulse(t, 0.4, 1.5) > 0 ? 1 : 0, pulse(t, 5.7, 6.9) > 0 ? 1 : 0);
  const steps = gait(t, walking);
  const turnIn = ease(span(t, 0, 0.5)) * FACE_CHARIZARD;
  const turnHome = ease(span(t, 5.4, 5.8)) * (FACE_HOME - FACE_CHARIZARD);
  const settle = ease(span(t, 6.9, 7.5)) * -FACE_HOME;
  const dodge = 0.034 * pulse(t, 2.45, 3.05);
  const victory = 0.014 * (pulse(t, 4.75, 5.05) + pulse(t, 5.1, 5.4));
  return {
    x: (toCharizard.x / distance) * along,
    z: (toCharizard.z / distance) * along,
    hop: steps.hop + dodge + victory,
    yaw: turnIn + turnHome + settle,
    roll: steps.roll,
    cheeks: Math.max(span(t, 3.2, 3.5) * (1 - span(t, 4.6, 4.9)), pulse(t, 4.75, 5.4) * 0.6)
  };
}

function charizardAt(t: number): CharizardPose {
  const turn = ease(span(t, 0.2, 0.9)) * (1 - ease(span(t, 5.6, 6.4))) * FACE_PIKACHU;
  const roar = pulse(t, 1.5, 2.35);
  const flinch = pulse(t, 3.7, 4.7);
  return {
    yaw: turn,
    lean: -0.28 * roar + 0.22 * flinch,
    shake: flinch * 0.003 * Math.sin(t * 90),
    wings: 0.4 * Math.sin(span(t, 1.5, 2.35) * Math.PI * 3) * roar,
    flame: 1 + 0.9 * roar + 0.5 * pulse(t, 2.3, 3.4)
  };
}

/** Pose of both figures and the strength of the effects `t` seconds into the battle. */
export function battleAt(t: number): BattleFrame {
  if (t < 0 || t > BATTLE_SECONDS) return RESTING;
  return {
    pikachu: pikachuAt(t),
    charizard: charizardAt(t),
    effects: {
      fire: pulse(t, 2.3, 3.4),
      bolt: span(t, 3.55, 3.7) * (1 - span(t, 4.45, 4.65)),
      impact: pulse(t, 3.65, 4.6)
    }
  };
}
