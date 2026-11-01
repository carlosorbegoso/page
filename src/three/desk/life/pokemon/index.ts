import { Group, Matrix4, Vector3, type Mesh, type MeshBasicMaterial, type SphereGeometry } from 'three';
import { CHARIZARD, PIKACHU } from '../../layout';
import { CHARIZARD_RIG, charizardFrame, PIKACHU_RIG, pikachuFrame } from '../../props';
import { bump } from '../motion';
import { aroundPivot, poseInFrame, type RigPart } from '../rig';
import { disposeGlow, FireStream, glowBall, LightningBolt } from './effects';
import type { PokemonPartName } from './parts';
import { BATTLE_SECONDS, battleAt, RESTING, type BattleFrame } from './timeline';

export { pokemonPart } from './parts';

const IDENTITY = new Matrix4();
const UP = new Vector3(0, 1, 0);
const EAR_PERIOD = 5.5;
const SPARK_PERIOD = 7.3;
const BEAT_PERIOD = 9;
const MOUTH = new Vector3(0, 0.0725, 0.028);
const PIKACHU_CHEST = new Vector3(0, 0.035, 0.01);
const PIKACHU_CROWN = new Vector3(0, 0.074, 0);
const CHARIZARD_CHEST = new Vector3(0, 0.045, 0.012);

function eventPhase(time: number, period: number, seconds: number, offset = 0): { t: number; index: number } {
  const shifted = time + offset;
  const index = Math.floor(shifted / period);
  const t = (shifted - index * period) / seconds;
  return { t: t < 1 ? t : -1, index };
}

function hash(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function onBase(out: Matrix4, base: Vector3, offset: Vector3, yaw: number, axis: Vector3, tilt: number): Matrix4 {
  const turn = new Matrix4().makeRotationY(yaw);
  const lean = new Matrix4().makeRotationAxis(axis, tilt);
  return out
    .makeTranslation(base.x + offset.x, base.y + offset.y, base.z + offset.z)
    .multiply(lean)
    .multiply(turn)
    .multiply(new Matrix4().makeTranslation(-base.x, -base.y, -base.z));
}

export class PokemonLife {
  readonly overlays = new Group();
  private motion = false;
  private startedAt = -1;
  private sparkAt = -1;
  private frame: BattleFrame = RESTING;
  private wingAngle = 0;
  private readonly pikachuRest = pikachuFrame();
  private readonly charizardRest = charizardFrame();
  private readonly pikachuBody = new Matrix4();
  private readonly charizardBody = new Matrix4();
  private readonly local = new Matrix4();
  private readonly extra = new Matrix4();
  private readonly cheeks = [glowBall(0.0058, '#fff3a0', 2.2), glowBall(0.0058, '#fff3a0', 2.2)];
  private readonly flameGlow = glowBall(0.012, '#ff9a3a', 1.6);
  private readonly impact = glowBall(0.02, '#fff0a0', 2.4);
  private readonly fire = new FireStream();
  private readonly bolt = new LightningBolt();

  constructor(private readonly parts: Map<string, RigPart>) {
    for (const glow of [...this.cheeks, this.flameGlow, this.impact]) glow.matrixAutoUpdate = false;
    this.overlays.add(...this.cheeks, this.flameGlow, this.impact, this.fire.object3D, this.bolt.object3D);
  }

  battle(time: number, motion: boolean): void {
    if (!motion) {
      this.sparkAt = time;
      return;
    }
    if (this.startedAt < 0) this.startedAt = time;
  }

  update(time: number, motion: boolean): boolean {
    if (this.startedAt >= 0 && time - this.startedAt > BATTLE_SECONDS) this.startedAt = -1;
    if (this.sparkAt >= 0 && time - this.sparkAt > 0.8) this.sparkAt = -1;
    this.motion = motion || this.startedAt >= 0;
    this.frame = this.startedAt >= 0 ? battleAt(time - this.startedAt) : RESTING;
    return this.motion || this.sparkAt >= 0;
  }

  pose(time: number): void {
    const t = this.motion ? time : 0;
    this.posePikachu(t, time);
    this.poseCharizard(t);
    this.poseEffects(time);
  }

  poseKey(): string {
    const p = this.frame.pikachu;
    return `${Math.round(this.wingAngle * 12)}|${Math.round(p.x * 400)}|${Math.round(p.z * 400)}|${Math.round(p.yaw * 10)}|${Math.round(p.hop * 300)}`;
  }

  dispose(): void {
    for (const glow of [...this.cheeks, this.flameGlow, this.impact]) disposeGlow(glow);
    this.fire.dispose();
    this.bolt.dispose();
  }

  private posePikachu(t: number, clock: number): void {
    const p = this.frame.pikachu;
    const facing = PIKACHU.yaw + p.yaw;
    onBase(this.pikachuBody, PIKACHU.base, new Vector3(p.x, p.hop, p.z), p.yaw, new Vector3(Math.sin(facing), 0, Math.cos(facing)), p.roll);
    this.place('pikachuBody', this.pikachuBody);
    const ear = eventPhase(t, EAR_PERIOD, 0.45);
    const which = hash(ear.index);
    const flick = ear.t < 0 || !this.motion ? 0 : 0.45 * Math.sin(ear.t * Math.PI * 4) * (1 - ear.t);
    const restForward = new Vector3(Math.sin(PIKACHU.yaw), 0, Math.cos(PIKACHU.yaw));
    for (const side of [-1, 1]) {
      const active = which < 0.4 ? side < 0 : which < 0.8 ? side > 0 : true;
      const pivot = PIKACHU_RIG.earRoot(side).applyMatrix4(this.pikachuRest);
      aroundPivot(this.local, pivot, this.extra.makeRotationAxis(restForward, active ? -side * flick : 0));
      this.place(side < 0 ? 'pikachuEarL' : 'pikachuEarR', this.local.premultiply(this.pikachuBody));
    }
    const wag = this.motion ? 0.13 * Math.sin((t * Math.PI * 2) / 2.4) : 0;
    aroundPivot(this.local, PIKACHU_RIG.tailRootAt.clone().applyMatrix4(this.pikachuRest), this.extra.makeRotationAxis(UP, wag));
    this.place('pikachuTail', this.local.premultiply(this.pikachuBody));
    this.poseCheeks(t, clock);
  }

  private poseCheeks(t: number, clock: number): void {
    const idle = eventPhase(t, SPARK_PERIOD, 0.6, 2.1);
    const flicker = Math.sin(clock * 70) > -0.2 ? 1 : 0.25;
    const idleSpark = idle.t < 0 || !this.motion ? 0 : bump(idle.t);
    const asked = this.sparkAt >= 0 ? bump((clock - this.sparkAt) / 0.8) : 0;
    const strength = Math.max(idleSpark, asked, this.frame.pikachu.cheeks) * flicker;
    this.cheeks.forEach((cheek, i) => {
      cheek.visible = strength > 0.01;
      cheek.material.opacity = 0.75 * strength;
      cheek.matrix.copy(this.pikachuBody).multiply(this.extra.makeTranslation(PIKACHU_RIG.cheek(i === 0 ? -1 : 1).applyMatrix4(this.pikachuRest)));
    });
  }

  private poseCharizard(t: number): void {
    const c = this.frame.charizard;
    const facing = CHARIZARD.yaw + c.yaw;
    const right = new Vector3(Math.cos(facing), 0, -Math.sin(facing));
    onBase(this.charizardBody, CHARIZARD.base, right.clone().multiplyScalar(c.shake), c.yaw, right, c.lean);
    this.place('charizardBody', this.charizardBody);
    const beat = eventPhase(t, BEAT_PERIOD, 1.4, 4);
    const big = beat.t < 0 ? 0 : 0.32 * Math.sin(beat.t * Math.PI * 2) * bump(beat.t);
    this.wingAngle = this.motion ? 0.07 * Math.sin((t * Math.PI * 2) / 3.2) + big + c.wings : 0;
    const restForward = new Vector3(Math.sin(CHARIZARD.yaw), 0, Math.cos(CHARIZARD.yaw));
    for (const side of [-1, 1]) {
      const pivot = CHARIZARD_RIG.wingRoot(side).applyMatrix4(this.charizardRest);
      aroundPivot(this.local, pivot, this.extra.makeRotationAxis(restForward, side * this.wingAngle));
      this.place(side < 0 ? 'charizardWingL' : 'charizardWingR', this.local.premultiply(this.charizardBody));
    }
    this.poseTail(t, c.flame);
  }

  private poseTail(t: number, flare: number): void {
    const sway = this.motion ? 0.07 * Math.sin((t * Math.PI * 2) / 4.1 + 1) : 0;
    aroundPivot(this.local, CHARIZARD_RIG.tailRootAt.clone().applyMatrix4(this.charizardRest), this.extra.makeRotationAxis(UP, sway));
    this.local.premultiply(this.charizardBody);
    this.place('charizardTail', this.local);
    const n = this.motion ? 0.5 * Math.sin(t * 13.1) + 0.3 * Math.sin(t * 21.7 + 1.3) + 0.2 * Math.sin(t * 34.3 + 2.1) : 0;
    const tip = CHARIZARD_RIG.tailTip.clone().applyMatrix4(this.charizardRest);
    const flame = new Matrix4();
    aroundPivot(flame, tip, this.extra.makeScale(flare * (1 - 0.1 * n), flare * (1 + 0.24 * n), flare * (1 - 0.1 * n)));
    this.place('charizardFlame', flame.premultiply(this.local));
    this.flameGlow.visible = this.motion;
    this.flameGlow.material.opacity = (0.32 + 0.14 * n) * Math.min(flare, 1.6);
    this.flameGlow.matrix.copy(this.local).multiply(this.extra.makeTranslation(tip.x, tip.y + 0.011 * flare, tip.z));
  }

  private poseEffects(time: number): void {
    const { fire, bolt, impact } = this.frame.effects;
    const at = (body: Matrix4, rest: Matrix4, point: Vector3) => point.clone().applyMatrix4(rest).applyMatrix4(body);
    const mouth = at(this.charizardBody, this.charizardRest, MOUTH);
    const chest = at(this.charizardBody, this.charizardRest, CHARIZARD_CHEST);
    this.fire.update(time, fire, mouth, at(this.pikachuBody, this.pikachuRest, PIKACHU_CHEST));
    this.bolt.update(time, bolt, at(this.pikachuBody, this.pikachuRest, PIKACHU_CROWN), chest);
    setGlow(this.impact, impact * (0.7 + 0.3 * Math.sin(time * 60)), chest);
  }

  private place(name: PokemonPartName, local: Matrix4): void {
    const part = this.parts.get(name);
    if (part) poseInFrame(part.mesh, IDENTITY, local);
  }
}

function setGlow(glow: Mesh<SphereGeometry, MeshBasicMaterial>, strength: number, at: Vector3): void {
  glow.visible = strength > 0.01;
  glow.material.opacity = 0.6 * strength;
  glow.matrix.makeTranslation(at.x, at.y, at.z);
}
