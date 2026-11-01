import { BATTLE_SECONDS } from './beats';
import { addFaceOff } from './face-off';
import { addFlamethrower } from './flamethrower';
import { addFinale } from './finale';
import { addFlight } from './flight';
import { restingFrame, RESTING, type BattleFrame } from './frame';
import { addImpact } from './impact';
import { addQuickAttack } from './quick-attack';
import { addThunderbolt } from './thunderbolt';

export { BATTLE_SECONDS, CALM_SECONDS, QUICK_ATTACK } from './beats';
export { calmAt } from './calm';
export { BATTLE_CUES, CALM_CUES, type BattleCue, type BattleSound } from './cues';
export { RESTING, type BattleEffects, type BattleFrame, type CharizardPose, type PikachuPose } from './frame';

export function battleAt(t: number): BattleFrame {
  if (t < 0 || t > BATTLE_SECONDS) return RESTING;
  const frame = restingFrame();
  addFaceOff(t, frame);
  addFlight(t, frame);
  addFlamethrower(t, frame);
  addQuickAttack(t, frame);
  addThunderbolt(t, frame);
  addImpact(t, frame);
  addFinale(t, frame);
  return frame;
}
