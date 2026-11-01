import { Matrix4, Vector3 } from 'three';
import { CHARIZARD } from '../../../layout';
import { CHARIZARD_RIG, charizardFrame } from '../../../props';
import { bump } from '../../motion';
import { disposeGlow, glowBall, setGlow } from '../effects/glow';
import type { PokemonPartName } from '../parts';
import type { CharizardPose } from '../timeline';
import { bodyMatrix, inRest } from './body';
import { eventPhase, flameNoise, type IdleClock } from './idle';

type Place = (name: PokemonPartName, local: Matrix4) => void;

const BEAT_PERIOD = 9;
const FOLD_SPAN = 0.3;
const FOLD_SWEEP = 0.35;
const offset = new Vector3();
const spin = new Matrix4();
const step = new Matrix4();

export class CharizardRig {
  readonly body = new Matrix4();
  readonly flameGlow = glowBall(0.012, '#ff9a3a', 1.6);
  wingAngle = 0;
  private readonly rest = charizardFrame();
  private readonly restInverse = this.rest.clone().invert();
  private readonly local = new Matrix4();
  private readonly joint = new Matrix4();
  private readonly tail = new Matrix4();
  private readonly at = new Vector3();

  constructor(private readonly place: Place) {}

  point(local: Vector3, out: Vector3): Vector3 {
    return out.copy(local).applyMatrix4(this.rest).applyMatrix4(this.body);
  }

  pose(c: CharizardPose, idle: IdleClock): void {
    const facing = CHARIZARD.yaw + c.yaw;
    offset.set(c.x + Math.cos(facing) * c.shake, c.lift, c.z - Math.sin(facing) * c.shake);
    bodyMatrix(this.body, CHARIZARD.base, { offset, facing: CHARIZARD.yaw, yaw: c.yaw, lean: c.lean, roll: 0, squash: c.squash });
    this.place('charizardBody', this.body);
    const beat = eventPhase(idle.t, BEAT_PERIOD, 1.4, 4);
    const big = beat.t < 0 ? 0 : 0.32 * Math.sin(beat.t * Math.PI * 2) * bump(beat.t);
    this.wingAngle = idle.weight * (0.07 * Math.sin((idle.t * Math.PI * 2) / 3.2) + big) + c.wings;
    for (const side of [-1, 1]) this.poseWing(side, c.fold);
    this.poseTail(c.flame, idle);
  }

  private poseWing(side: number, fold: number): void {
    const root = CHARIZARD_RIG.wingRoot(side);
    spin.makeRotationZ(side * this.wingAngle).multiply(step.makeRotationY(side * FOLD_SWEEP * fold)).multiply(step.makeScale(1 - FOLD_SPAN * fold, 1 - 0.12 * fold, 1));
    this.joint.makeTranslation(root.x, root.y, root.z).multiply(spin).multiply(step.makeTranslation(-root.x, -root.y, -root.z));
    this.place(side < 0 ? 'charizardWingL' : 'charizardWingR', inRest(this.local, this.rest, this.restInverse, this.joint).premultiply(this.body));
  }

  private poseTail(flare: number, idle: IdleClock): void {
    const sway = idle.weight * 0.07 * Math.sin((idle.t * Math.PI * 2) / 4.1 + 1);
    const root = CHARIZARD_RIG.tailRootAt;
    this.joint.makeTranslation(root.x, root.y, root.z).multiply(spin.makeRotationY(sway)).multiply(step.makeTranslation(-root.x, -root.y, -root.z));
    inRest(this.tail, this.rest, this.restInverse, this.joint).premultiply(this.body);
    this.place('charizardTail', this.tail);
    const n = idle.alive ? flameNoise(idle.clock) : 0;
    const tip = CHARIZARD_RIG.tailTip;
    const s = flare;
    this.joint.makeTranslation(tip.x, tip.y, tip.z).multiply(spin.makeScale(s * (1 - 0.1 * n), s * (1 + 0.24 * n), s * (1 - 0.1 * n))).multiply(step.makeTranslation(-tip.x, -tip.y, -tip.z));
    this.place('charizardFlame', inRest(this.local, this.rest, this.restInverse, this.joint).premultiply(this.tail));
    this.at.set(tip.x, tip.y + 0.011 * flare, tip.z).applyMatrix4(this.rest).applyMatrix4(this.tail);
    const lit = idle.alive ? 1 : Math.min(1, Math.max(0, (flare - 1) * 4));
    const glow = lit * (0.32 + 0.14 * n) * Math.min(flare, 1.6);
    setGlow(this.flameGlow, glow, this.at);
  }

  dispose(): void {
    disposeGlow(this.flameGlow);
  }
}
