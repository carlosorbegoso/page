import { Group, Matrix4, Vector3, type BufferGeometry, type PointLight } from 'three';
import { motionAllowed, readMotion } from '../../../motion';
import { PIKACHU_RIG } from '../../props';
import { poseInFrame, type RigPart } from '../rig';
import { BattleVisuals } from './effects/battle-visuals';
import type { BattleAnchors } from './effects/bursts';
import type { PokemonPartName } from './parts';
import { CharizardRig } from './pose/charizard';
import type { IdleClock } from './pose/idle';
import { PikachuRig } from './pose/pikachu';
import { BATTLE_CUES, BATTLE_SECONDS, battleAt, CALM_CUES, CALM_SECONDS, calmAt, QUICK_ATTACK, RESTING, type BattleFrame } from './timeline';

const IDENTITY = new Matrix4();
const MOUTH = new Vector3(0, 0.0725, 0.028);
const PIKACHU_CHEST = new Vector3(0, 0.035, 0.01);
const PIKACHU_CROWN = new Vector3(0, 0.06, 0.008);
const CHARIZARD_CHEST = new Vector3(0, 0.045, 0.012);
const CHARIZARD_FORWARD = new Vector3(0, 0, 1);
const MAX_STEP = 0.05;
const CUE_GAP = 0.5;
const GHOST_PARTS: readonly PokemonPartName[] = ['pikachuBody', 'pikachuEarL', 'pikachuEarR'];

export class PokemonLife {
  readonly overlays = new Group();
  private readonly pikachu: PikachuRig;
  private readonly charizard: CharizardRig;
  private readonly visuals: BattleVisuals;
  private readonly fireSpot = new Vector3();
  private readonly ghost = new Matrix4();
  private readonly anchors: BattleAnchors = { mouth: new Vector3(), fireEnd: new Vector3(), cheeks: [new Vector3(), new Vector3()], chest: new Vector3(), facing: new Vector3() };
  private readonly boltFrom = new Vector3();
  private readonly live = new Vector3();
  private pending: boolean | null = null;
  private startedAt = -1;
  private calm = false;
  private cueAt = 0;
  private posedAt = -1;
  private idle = false;
  private pixelScale = 600;
  private frame: BattleFrame = RESTING;

  constructor(
    private readonly parts: ReadonlyMap<string, RigPart>,
    light: PointLight | null
  ) {
    const place = (name: PokemonPartName, local: Matrix4) => this.place(name, local);
    this.pikachu = new PikachuRig(place);
    this.charizard = new CharizardRig(place);
    const ghosts = GHOST_PARTS.map(name => parts.get(name)?.mesh.geometry).filter((g): g is BufferGeometry => Boolean(g));
    this.visuals = new BattleVisuals(ghosts, light);
    this.pikachu.point(PIKACHU_CHEST, this.fireSpot, this.pikachu.bodyAt(battleAt(QUICK_ATTACK.hop[0]).pikachu, this.ghost));
    this.overlays.add(...this.pikachu.cheeks, this.charizard.flameGlow, this.visuals.object3D);
  }

  get running(): boolean {
    return this.pending !== null || this.startedAt >= 0;
  }

  battle(): void {
    if (this.running) return;
    this.pending = !motionAllowed(readMotion());
  }

  update(time: number, motion: boolean, pixelScale: number): boolean {
    if (this.pending !== null) this.start(time, this.pending);
    const elapsed = time - this.startedAt;
    if (this.startedAt >= 0 && elapsed > (this.calm ? CALM_SECONDS : BATTLE_SECONDS)) this.startedAt = -1;
    this.idle = motion;
    this.pixelScale = pixelScale;
    this.frame = this.startedAt < 0 ? RESTING : this.calm ? calmAt(elapsed) : battleAt(elapsed);
    if (this.startedAt >= 0) this.playCues(elapsed);
    return motion || this.running || this.visuals.moving;
  }

  private start(time: number, calm: boolean): void {
    this.pending = null;
    this.startedAt = time;
    this.calm = calm;
    this.cueAt = 0;
    this.visuals.reset();
  }

  private playCues(elapsed: number): void {
    const from = this.cueAt;
    this.cueAt = elapsed;
    if (elapsed - from > CUE_GAP) return;
    for (const cue of this.calm ? CALM_CUES : BATTLE_CUES) {
      if (cue.at > from && cue.at <= elapsed) window.dispatchEvent(new CustomEvent('desk:battle', { detail: { sound: cue.sound } }));
    }
  }

  pose(time: number): void {
    const dt = this.posedAt < 0 ? 0 : Math.min(Math.max(time - this.posedAt, 0), MAX_STEP);
    this.posedAt = time;
    const battling = this.startedAt >= 0;
    const clock: IdleClock = { t: this.idle ? time : 0, clock: time, weight: this.idle ? 1 - this.frame.still : 0, alive: this.idle || (battling && !this.calm), calm: this.frame.calm };
    this.pikachu.pose(this.frame.pikachu, clock);
    this.charizard.pose(this.frame.charizard, clock);
    this.locateAnchors();
    this.visuals.update({ frame: this.frame, anchors: this.anchors, boltFrom: this.boltFrom, time, dt, pixelScale: this.pixelScale, ghostAt: (lag, out) => this.ghostAt(lag, out) });
  }

  private locateAnchors(): void {
    const a = this.anchors;
    this.charizard.point(MOUTH, a.mouth);
    this.charizard.point(CHARIZARD_CHEST, a.chest);
    a.facing.copy(CHARIZARD_FORWARD).transformDirection(this.charizard.body);
    this.pikachu.point(PIKACHU_RIG.cheek(-1), a.cheeks[0]);
    this.pikachu.point(PIKACHU_RIG.cheek(1), a.cheeks[1]);
    this.pikachu.point(PIKACHU_CROWN, this.boltFrom);
    this.pikachu.point(PIKACHU_CHEST, this.live);
    a.fireEnd.lerpVectors(this.fireSpot, this.live, this.frame.effects.fireFollow);
  }

  private ghostAt(lag: number, out: Matrix4): Matrix4 {
    return this.pikachu.bodyAt(battleAt(this.posedAt - this.startedAt - lag).pikachu, out);
  }

  poseKey(): string {
    const p = this.frame.pikachu;
    const c = this.frame.charizard;
    const r = (value: number, scale: number) => Math.round(value * scale);
    return [r(this.charizard.wingAngle, 12), r(p.x, 400), r(p.z, 400), r(p.yaw, 10), r(p.hop, 300), r(p.squash, 40), r(c.lift, 300), r(c.lean, 20), r(c.yaw, 10)].join('|');
  }

  dispose(): void {
    this.pikachu.dispose();
    this.charizard.dispose();
    this.visuals.dispose();
  }

  private place(name: PokemonPartName, local: Matrix4): void {
    const part = this.parts.get(name);
    if (part) poseInFrame(part.mesh, IDENTITY, local);
  }
}
