import { FACE_OFF, FLAMETHROWER, IMPACT, LANDING, QUICK_ATTACK, ROAR, TAKEOFF, THUNDERBOLT, VICTORY } from './beats';

export type BattleSound = 'growl' | 'flap' | 'flame' | 'quick' | 'spark' | 'thunder' | 'impact' | 'land' | 'chirp' | 'roar';

export interface BattleCue {
  at: number;
  sound: BattleSound;
}

const HOVER_FLAP = 0.34;

export const BATTLE_CUES: readonly BattleCue[] = [
  { at: FACE_OFF.rear[0] + 0.15, sound: 'growl' },
  { at: FACE_OFF.sparks[0] + 0.05, sound: 'spark' },
  ...[0, 1, 2].map(i => ({ at: TAKEOFF.flaps + (i + 0.25) * HOVER_FLAP, sound: 'flap' as const })),
  { at: FLAMETHROWER.rise[0], sound: 'flame' },
  { at: QUICK_ATTACK.hop[0] - 0.01, sound: 'quick' },
  { at: THUNDERBOLT.charge[0] + 0.03, sound: 'spark' },
  ...THUNDERBOLT.strikes.map(at => ({ at, sound: 'thunder' as const })),
  { at: IMPACT.hit + 0.01, sound: 'impact' },
  { at: LANDING.touch[0], sound: 'land' },
  { at: VICTORY.hops[0][0], sound: 'chirp' },
  { at: ROAR.rear[0] + 0.1, sound: 'roar' }
];

export const CALM_CUES: readonly BattleCue[] = [{ at: 1.5, sound: 'spark' }];
