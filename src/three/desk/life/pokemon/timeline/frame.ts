export interface PikachuPose {
  x: number;
  z: number;
  hop: number;
  yaw: number;
  roll: number;
  lean: number;
  squash: number;
  ears: number;
  tail: number;
  cheeks: number;
}

export interface CharizardPose {
  x: number;
  z: number;
  lift: number;
  yaw: number;
  lean: number;
  squash: number;
  shake: number;
  wings: number;
  fold: number;
  flame: number;
}

export interface BattleEffects {
  fire: number;
  fireFollow: number;
  bolt: number;
  strike: number;
  impact: number;
  trail: number;
  crackle: number;
  smoke: number;
  puff: number;
  mouthGlow: number;
}

export interface BattleFrame {
  pikachu: PikachuPose;
  charizard: CharizardPose;
  effects: BattleEffects;
  still: number;
  calm: boolean;
}

export function restingFrame(calm = false): BattleFrame {
  return {
    pikachu: { x: 0, z: 0, hop: 0, yaw: 0, roll: 0, lean: 0, squash: 0, ears: 0, tail: 0, cheeks: 0 },
    charizard: { x: 0, z: 0, lift: 0, yaw: 0, lean: 0, squash: 0, shake: 0, wings: 0, fold: 0, flame: 1 },
    effects: { fire: 0, fireFollow: 0, bolt: 0, strike: -1, impact: 0, trail: 0, crackle: 0, smoke: 0, puff: 0, mouthGlow: 0 },
    still: 0,
    calm
  };
}

export const RESTING: BattleFrame = restingFrame();
