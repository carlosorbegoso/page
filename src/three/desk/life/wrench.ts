import { Matrix4, Vector3 } from 'three';
import { aroundPivot, poseInFrame, type RigPart } from './rig';
import { bump, progress } from './motion';

const SECONDS = 1.1;
const HOVER_ROLL = 0.14;
const TWIST = 0.18;

function axes(points: Vector3[], centre: Vector3): { length: Vector3; normal: Vector3 } {
  const m = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (const point of points) {
    const d = [point.x - centre.x, point.y - centre.y, point.z - centre.z];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) m[r * 3 + c]! += d[r]! * d[c]!;
  }
  const dominant = (matrix: number[], seed: Vector3) => {
    const v = seed.clone();
    for (let i = 0; i < 32; i++) {
      v.set(matrix[0]! * v.x + matrix[1]! * v.y + matrix[2]! * v.z, matrix[3]! * v.x + matrix[4]! * v.y + matrix[5]! * v.z, matrix[6]! * v.x + matrix[7]! * v.y + matrix[8]! * v.z).normalize();
    }
    return v;
  };
  const length = dominant(m, new Vector3(1, 0.1, 0.1));
  const lambda = length.x * (m[0]! * length.x + m[1]! * length.y + m[2]! * length.z) + length.y * (m[3]! * length.x + m[4]! * length.y + m[5]! * length.z) + length.z * (m[6]! * length.x + m[7]! * length.y + m[8]! * length.z);
  const l = length.toArray();
  const deflated = m.map((value, i) => value - lambda * l[Math.floor(i / 3)]! * l[i % 3]!);
  const width = dominant(deflated, new Vector3(0.1, 1, 0.2));
  return { length, normal: new Vector3().crossVectors(length, width).normalize() };
}

export class WrenchLife {
  private readonly length: Vector3;
  private readonly normal: Vector3;
  private readonly bolt: Vector3;
  private startedAt = -1;
  private gentle = false;
  private hovered = false;
  private roll = 0;
  private readonly local = new Matrix4();
  private readonly turn = new Matrix4();
  private readonly twist = new Matrix4();
  private readonly up = new Vector3();

  constructor(private readonly wrench: RigPart | undefined) {
    const found = wrench ? axes(wrench.centroids, wrench.centre) : { length: new Vector3(1, 0, 0), normal: new Vector3(0, 0, 1) };
    this.length = found.length;
    this.normal = found.normal;
    const reach = wrench ? Math.max(...wrench.centroids.map(point => point.clone().sub(wrench.centre).dot(this.length))) : 0;
    this.bolt = (wrench?.centre.clone() ?? new Vector3()).addScaledVector(this.length, reach * 0.85);
    const tail = (wrench?.centre.clone() ?? new Vector3()).addScaledVector(this.length, -reach).sub(this.bolt);
    if (tail.clone().applyAxisAngle(this.normal, 0.1).y < tail.y) this.normal.negate();
  }

  play(time: number, motion: boolean): void {
    this.startedAt = time;
    this.gentle = !motion;
  }

  setHover(hovered: boolean): void {
    this.hovered = hovered;
  }

  glow(time: number): number {
    const t = progress(this.startedAt, time, SECONDS);
    return t < 0 ? 0 : 0.2 * bump(t);
  }

  update(dt: number, time: number, motion: boolean): boolean {
    const t = progress(this.startedAt, time, SECONDS);
    if (t < 0) this.startedAt = -1;
    const goal = this.hovered && motion ? HOVER_ROLL : 0;
    this.roll += (goal - this.roll) * (1 - Math.exp(-14 * dt));
    return t >= 0 || Math.abs(goal - this.roll) > 1e-3;
  }

  pose(time: number, frame: Matrix4): void {
    if (!this.wrench) return;
    const t = progress(this.startedAt, time, SECONDS);
    const active = t >= 0 && !this.gentle;
    const ratchet = active ? TWIST * (snap((t - 0.12) / 0.22) + snap((t - 0.42) / 0.22) - 2 * smooth((t - 0.72) / 0.26)) : 0;
    this.turn.makeRotationAxis(this.length, this.roll);
    aroundPivot(this.local, this.wrench.centre, this.turn, this.up.set(0, active ? 0.009 * bump(Math.min(t / 0.98, 1)) : 0, 0));
    aroundPivot(this.twist, this.bolt, this.turn.makeRotationAxis(this.normal, ratchet));
    poseInFrame(this.wrench.mesh, frame, this.local.multiply(this.twist));
  }

  poseKey(time: number): string {
    const t = progress(this.startedAt, time, SECONDS);
    return `${t < 0 ? 0 : Math.round(t * 40)},${Math.round(this.roll * 50)}`;
  }
}

function smooth(t: number): number {
  const x = Math.min(Math.max(t, 0), 1);
  return x * x * (3 - 2 * x);
}

function snap(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return 1 - Math.exp(-7 * t) * Math.cos(7.5 * t);
}
