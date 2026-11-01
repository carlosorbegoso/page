import { BoxGeometry, Group, InstancedMesh, Matrix4, Quaternion, Vector3, type MeshBasicMaterial } from 'three';
import { glowMaterial } from './glow';

const MAIN = 10;
const BRANCH = 4;
const BRANCH_FROM = [3, 6];
const SEGMENTS = MAIN + BRANCH * BRANCH_FROM.length;
const JITTER_SECONDS = 0.045;
const LIFT = 0.03;
const UP = new Vector3(0, 1, 0);
const matrix = new Matrix4();
const turn = new Quaternion();
const middle = new Vector3();
const size = new Vector3();
const along = new Vector3();

const wiggle = (amount: number) => new Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(amount);

export class LightningBolt {
  readonly object3D = new Group();
  private readonly unit = new BoxGeometry(1, 1, 1);
  private readonly coreMaterial = glowMaterial('#f4f8ff', 2.6);
  private readonly haloMaterial = glowMaterial('#8fc4ff', 1.3);
  private readonly core = this.instanced(this.coreMaterial);
  private readonly halo = this.instanced(this.haloMaterial);
  private readonly points: Vector3[] = [];
  private shapedAt = -1;
  private strike = -2;

  constructor() {
    this.object3D.add(this.halo, this.core);
    this.object3D.visible = false;
  }

  private instanced(material: MeshBasicMaterial): InstancedMesh {
    const mesh = new InstancedMesh(this.unit, material, SEGMENTS);
    mesh.frustumCulled = false;
    mesh.raycast = () => undefined;
    return mesh;
  }

  update(time: number, amount: number, strike: number, from: Vector3, to: Vector3): void {
    this.object3D.visible = amount > 0.01;
    if (!this.object3D.visible) return;
    const struck = strike !== this.strike;
    if (struck || time - this.shapedAt > JITTER_SECONDS || this.points.length === 0) this.reshape(time, from, to, struck ? 0.016 : 0.009);
    this.strike = strike;
    const branches = amount > 0.5 ? SEGMENTS : MAIN;
    for (let i = 0; i < branches; i++) {
      const [a, b] = this.segment(i);
      this.setSegment(i, a, b);
    }
    this.core.count = this.halo.count = branches;
    this.core.instanceMatrix.needsUpdate = this.halo.instanceMatrix.needsUpdate = true;
    const strobe = Math.sin(time * 80) > -0.3 ? 1 : 0.35;
    this.coreMaterial.opacity = Math.min(1, amount) * strobe;
    this.haloMaterial.opacity = 0.4 * Math.min(1, amount) * strobe;
  }

  private segment(i: number): [Vector3, Vector3] {
    if (i < MAIN) return [this.points[i]!, this.points[i + 1]!];
    const k = i - MAIN;
    const start = MAIN + 1 + Math.floor(k / BRANCH) * (BRANCH + 1) + (k % BRANCH);
    return [this.points[start]!, this.points[start + 1]!];
  }

  private setSegment(i: number, a: Vector3, b: Vector3): void {
    along.copy(b).sub(a);
    const length = along.length();
    turn.setFromUnitVectors(UP, along.normalize());
    const width = i < MAIN ? 1 : 0.6;
    middle.copy(a).add(b).multiplyScalar(0.5);
    this.core.setMatrixAt(i, matrix.compose(middle, turn, size.set(0.0011 * width, length, 0.0011 * width)));
    this.halo.setMatrixAt(i, matrix.compose(middle, turn, size.set(0.0045 * width, length, 0.0045 * width)));
  }

  private reshape(time: number, from: Vector3, to: Vector3, jag: number): void {
    this.shapedAt = time;
    this.points.length = 0;
    for (let i = 0; i <= MAIN; i++) {
      const t = i / MAIN;
      const point = from.clone().lerp(to, t);
      point.y += Math.sin(t * Math.PI) * LIFT;
      if (i > 0 && i < MAIN) point.add(wiggle(jag * Math.sin(t * Math.PI) + 0.003));
      this.points.push(point);
    }
    for (const start of BRANCH_FROM) this.branch(this.points[start]!, to.clone().sub(from).normalize(), jag);
  }

  private branch(start: Vector3, heading: Vector3, jag: number): void {
    const out = heading.clone().add(wiggle(1.6)).setY(-Math.abs(heading.y) - 0.4).normalize().multiplyScalar(0.022 / BRANCH);
    let point = start.clone();
    this.points.push(point);
    for (let i = 0; i < BRANCH; i++) {
      point = point.clone().add(out).add(wiggle(jag * 0.5));
      this.points.push(point);
    }
  }

  dispose(): void {
    this.unit.dispose();
    this.coreMaterial.dispose();
    this.haloMaterial.dispose();
    this.core.dispose();
    this.halo.dispose();
  }
}
