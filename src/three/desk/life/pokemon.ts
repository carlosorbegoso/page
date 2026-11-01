import { AdditiveBlending, Color, Group, Matrix4, Mesh, MeshBasicMaterial, SphereGeometry, Vector3, type Object3D } from 'three';
import { OBJECT_ID } from '../builder';
import { CHARIZARD, PIKACHU } from '../layout';
import { CHARIZARD_RIG, charizardFrame, PIKACHU_RIG, pikachuFrame } from '../props';
import { bump } from './motion';
import { aroundPivot, poseInFrame, sameColor, type RigPart, type TriangleInfo } from './rig';

const IDENTITY = new Matrix4();
const UP = new Vector3(0, 1, 0);
const EAR_PERIOD = 5.5;
const EAR_SECONDS = 0.45;
const SPARK_PERIOD = 7.3;
const SPARK_SECONDS = 0.6;
const BEAT_PERIOD = 9;
const BEAT_SECONDS = 1.4;

const PIKACHU_LOCAL = pikachuFrame().invert();
const CHARIZARD_LOCAL = charizardFrame().invert();

const matches = (color: TriangleInfo['color'], ...candidates: Color[]) => candidates.some(candidate => sameColor(color, candidate));
const side = (centroid: Vector3, toLocal: Matrix4) => (centroid.clone().applyMatrix4(toLocal).x < 0 ? 'L' : 'R');

/** Names the moving part of Pikachu or Charizard a workstation triangle belongs to (null = it stays put). */
export function pokemonPart({ oid, centroid, color }: TriangleInfo): string | null {
  if (oid !== OBJECT_ID.none) return null;
  const R = PIKACHU_RIG;
  if (matches(color, R.ear, R.earTip)) return `pikachuEar${side(centroid, PIKACHU_LOCAL)}`;
  if (matches(color, R.tail, R.tailRoot)) return 'pikachuTail';
  const C = CHARIZARD_RIG;
  if (matches(color, C.wing, C.membrane, C.bone, C.claw)) return `charizardWing${side(centroid, CHARIZARD_LOCAL)}`;
  if (matches(color, C.tail)) return 'charizardTail';
  if (matches(color, C.flame, C.core)) return 'charizardFlame';
  return null;
}

/** Deterministic 0..1 per event index, so the twitches do not repeat in lockstep. */
function hash(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** Phase 0..1 of the event running at `time` in a repeating `period`, or −1 between events. */
function eventPhase(time: number, period: number, seconds: number, offset = 0): { t: number; index: number } {
  const shifted = time + offset;
  const index = Math.floor(shifted / period);
  const t = (shifted - index * period) / seconds;
  return { t: t < 1 ? t : -1, index };
}

function glowBall(radius: number, color: string, strength: number): Mesh<SphereGeometry, MeshBasicMaterial> {
  const material = new MeshBasicMaterial({ color: new Color(color).multiplyScalar(strength), transparent: true, opacity: 0, depthWrite: false, blending: AdditiveBlending });
  const mesh = new Mesh(new SphereGeometry(radius, 12, 8), material);
  mesh.matrixAutoUpdate = false;
  mesh.visible = false;
  mesh.raycast = () => undefined;
  return mesh;
}

/**
 * Pikachu twitches an ear now and then, sways its tail and sparks from its cheeks; Charizard breathes
 * its wings with an occasional full beat, sways its tail and its tail flame flickers. Everything rests
 * when motion is reduced.
 */
export class PokemonLife {
  readonly overlays = new Group();
  private motion = false;
  private wingAngle = 0;
  private readonly pikachu = pikachuFrame();
  private readonly charizard = charizardFrame();
  private readonly pikachuForward = new Vector3(Math.sin(PIKACHU.yaw), 0, Math.cos(PIKACHU.yaw));
  private readonly charizardForward = new Vector3(Math.sin(CHARIZARD.yaw), 0, Math.cos(CHARIZARD.yaw));
  private readonly cheeks: Mesh<SphereGeometry, MeshBasicMaterial>[];
  private readonly flameGlow = glowBall(0.012, '#ff9a3a', 1.6);
  private readonly local = new Matrix4();
  private readonly extra = new Matrix4();
  private readonly turn = new Matrix4();

  constructor(private readonly parts: Map<string, RigPart>) {
    this.cheeks = [-1, 1].map(s => {
      const cheek = glowBall(0.0058, '#fff3a0', 2.2);
      cheek.matrix.makeTranslation(PIKACHU_RIG.cheek(s).applyMatrix4(this.pikachu));
      return cheek;
    });
    this.overlays.add(...this.cheeks, this.flameGlow);
  }

  update(motion: boolean): boolean {
    this.motion = motion;
    return motion;
  }

  pose(time: number): void {
    const t = this.motion ? time : 0;
    this.posePikachu(t);
    this.poseCharizard(t);
  }

  poseKey(): string {
    return `${Math.round(this.wingAngle * 12)}`;
  }

  dispose(): void {
    this.overlays.traverse(node => {
      const mesh = node as Partial<Mesh<SphereGeometry, MeshBasicMaterial>>;
      mesh.geometry?.dispose();
      mesh.material?.dispose();
    });
  }

  private posePikachu(time: number): void {
    const ear = eventPhase(time, EAR_PERIOD, EAR_SECONDS);
    const which = hash(ear.index);
    const flick = ear.t < 0 || !this.motion ? 0 : 0.45 * Math.sin(ear.t * Math.PI * 4) * (1 - ear.t);
    for (const s of [-1, 1]) {
      const active = which < 0.4 ? s < 0 : which < 0.8 ? s > 0 : true;
      const pivot = PIKACHU_RIG.earRoot(s).applyMatrix4(this.pikachu);
      aroundPivot(this.local, pivot, this.turn.makeRotationAxis(this.pikachuForward, active ? -s * flick : 0));
      this.place(`pikachuEar${s < 0 ? 'L' : 'R'}`, this.local);
    }
    const wag = this.motion ? 0.13 * Math.sin((time * Math.PI * 2) / 2.4) : 0;
    aroundPivot(this.local, PIKACHU_RIG.tailRootAt.clone().applyMatrix4(this.pikachu), this.turn.makeRotationAxis(UP, wag));
    this.place('pikachuTail', this.local);
    const spark = eventPhase(time, SPARK_PERIOD, SPARK_SECONDS, 2.1);
    const strength = spark.t < 0 || !this.motion ? 0 : bump(spark.t) * (Math.sin(spark.t * 70) > -0.2 ? 1 : 0.25);
    for (const cheek of this.cheeks) {
      cheek.visible = strength > 0.01;
      cheek.material.opacity = 0.75 * strength;
    }
  }

  private poseCharizard(time: number): void {
    const beat = eventPhase(time, BEAT_PERIOD, BEAT_SECONDS, 4);
    const big = beat.t < 0 ? 0 : 0.32 * Math.sin(beat.t * Math.PI * 2) * bump(beat.t);
    this.wingAngle = this.motion ? 0.07 * Math.sin((time * Math.PI * 2) / 3.2) + big : 0;
    for (const s of [-1, 1]) {
      const pivot = CHARIZARD_RIG.wingRoot(s).applyMatrix4(this.charizard);
      aroundPivot(this.local, pivot, this.turn.makeRotationAxis(this.charizardForward, s * this.wingAngle));
      this.place(`charizardWing${s < 0 ? 'L' : 'R'}`, this.local);
    }
    const sway = this.motion ? 0.07 * Math.sin((time * Math.PI * 2) / 4.1 + 1) : 0;
    aroundPivot(this.local, CHARIZARD_RIG.tailRootAt.clone().applyMatrix4(this.charizard), this.turn.makeRotationAxis(UP, sway));
    this.place('charizardTail', this.local);
    const n = this.motion ? 0.5 * Math.sin(time * 13.1) + 0.3 * Math.sin(time * 21.7 + 1.3) + 0.2 * Math.sin(time * 34.3 + 2.1) : 0;
    const tip = CHARIZARD_RIG.tailTip.clone().applyMatrix4(this.charizard);
    aroundPivot(this.extra, tip, this.turn.makeScale(1 - 0.1 * n, 1 + 0.24 * n, 1 - 0.1 * n));
    this.place('charizardFlame', this.extra.premultiply(this.local));
    this.flameGlow.visible = this.motion;
    this.flameGlow.material.opacity = 0.32 + 0.14 * n;
    this.flameGlow.matrix.copy(this.local).multiply(this.turn.makeTranslation(tip.x, tip.y + 0.011, tip.z));
  }

  private place(name: string, local: Matrix4): void {
    const part = this.parts.get(name);
    if (part) poseInFrame(part.mesh as Object3D, IDENTITY, local);
  }
}
