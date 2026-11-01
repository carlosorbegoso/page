import { Matrix4, Vector3 } from 'three';
import { PIKACHU } from '../../../layout';
import { PIKACHU_RIG, pikachuFrame } from '../../../props';
import { bump } from '../../motion';
import { disposeGlow, glowBall, setGlow } from '../effects/glow';
import type { PokemonPartName } from '../parts';
import type { PikachuPose } from '../timeline';
import { bodyMatrix, inRest } from './body';
import { eventPhase, hash, type IdleClock } from './idle';

type Place = (name: PokemonPartName, local: Matrix4) => void;

const EAR_PERIOD = 5.5;
const SPARK_PERIOD = 7.3;
const WAG_PERIOD = 2.4;
const offset = new Vector3();
const spin = new Matrix4();
const step = new Matrix4();

export class PikachuRig {
  readonly body = new Matrix4();
  readonly cheeks = [glowBall(0.0058, '#fff3a0', 2), glowBall(0.0058, '#fff3a0', 2)];
  private readonly rest = pikachuFrame();
  private readonly restInverse = this.rest.clone().invert();
  private readonly local = new Matrix4();
  private readonly joint = new Matrix4();
  private readonly at = new Vector3();

  constructor(private readonly place: Place) {}

  bodyAt(p: PikachuPose, out: Matrix4): Matrix4 {
    offset.set(p.x, p.hop, p.z);
    return bodyMatrix(out, PIKACHU.base, { offset, facing: PIKACHU.yaw, yaw: p.yaw, lean: p.lean, roll: p.roll, squash: p.squash });
  }

  point(local: Vector3, out: Vector3, body = this.body): Vector3 {
    return out.copy(local).applyMatrix4(this.rest).applyMatrix4(body);
  }

  pose(p: PikachuPose, idle: IdleClock): void {
    this.place('pikachuBody', this.bodyAt(p, this.body));
    this.poseEars(p, idle);
    const wag = idle.weight * 0.13 * Math.sin((idle.t * Math.PI * 2) / WAG_PERIOD) + p.tail;
    this.limb('pikachuTail', PIKACHU_RIG.tailRootAt, spin.makeRotationY(wag));
    this.poseCheeks(p, idle);
  }

  private poseEars(p: PikachuPose, idle: IdleClock): void {
    const ear = eventPhase(idle.t, EAR_PERIOD, 0.45);
    const which = hash(ear.index);
    const flick = ear.t < 0 ? 0 : idle.weight * 0.45 * Math.sin(ear.t * Math.PI * 4) * (1 - ear.t);
    for (const side of [-1, 1]) {
      const active = which < 0.4 ? side < 0 : which < 0.8 ? side > 0 : true;
      spin.makeRotationZ(active ? -side * flick : 0).multiply(step.makeRotationX(p.ears));
      this.limb(side < 0 ? 'pikachuEarL' : 'pikachuEarR', PIKACHU_RIG.earRoot(side), spin);
    }
  }

  private limb(name: PokemonPartName, root: Vector3, rotation: Matrix4): void {
    this.joint.makeTranslation(root.x, root.y, root.z).multiply(rotation).multiply(step.makeTranslation(-root.x, -root.y, -root.z));
    this.place(name, inRest(this.local, this.rest, this.restInverse, this.joint).premultiply(this.body));
  }

  private poseCheeks(p: PikachuPose, idle: IdleClock): void {
    const spark = eventPhase(idle.t, SPARK_PERIOD, 0.6, 2.1);
    const idleSpark = spark.t < 0 ? 0 : idle.weight * bump(spark.t);
    const flicker = idle.calm || Math.sin(idle.clock * 70) > -0.2 ? 1 : 0.25;
    const strength = Math.min(Math.max(idleSpark, p.cheeks), 1) * flicker;
    this.cheeks.forEach((cheek, i) => setGlow(cheek, 0.75 * strength, this.point(PIKACHU_RIG.cheek(i === 0 ? -1 : 1), this.at), 1 + 0.3 * strength));
  }

  dispose(): void {
    this.cheeks.forEach(disposeGlow);
  }
}
