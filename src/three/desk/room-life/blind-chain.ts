import { Group, InstancedMesh, Matrix4, SphereGeometry, type Material } from 'three';

const BEAD_RADIUS = 0.0022;
const PITCH = 0.0085;
const LENGTH = 0.56;
const GAP = 0.007;
const TRAVEL = 1.1;

/** Bead pull-chain loop of the roller: it runs while the blind travels and swings from the cassette. */
export class BeadChain {
  readonly group = new Group();
  private readonly beads: InstancedMesh;
  private readonly loop = 2 * LENGTH + Math.PI * (GAP / 2);
  private readonly matrix = new Matrix4();
  private readonly pitch: number;
  private shift = Number.NaN;

  constructor(material: Material) {
    const count = Math.round(this.loop / PITCH);
    this.pitch = this.loop / count;
    this.beads = new InstancedMesh(new SphereGeometry(BEAD_RADIUS, 6, 4), material, count);
    this.beads.raycast = () => undefined;
    this.beads.frustumCulled = false;
    this.group.add(this.beads);
  }

  run(blind: number): void {
    const shift = (blind * TRAVEL) % this.pitch;
    if (Math.abs(shift - this.shift) < 1e-5) return;
    this.shift = shift;
    for (let i = 0; i < this.beads.count; i++) {
      const [x, y] = this.along(i * this.pitch + shift);
      this.beads.setMatrixAt(i, this.matrix.makeTranslation(x, y, 0));
    }
    this.beads.instanceMatrix.needsUpdate = true;
  }

  swing(angle: number): void {
    this.group.rotation.set(angle * 0.4, 0, -angle * 1.6);
  }

  private along(s: number): [number, number] {
    const half = GAP / 2;
    const t = s % this.loop;
    if (t < LENGTH) return [-half, -t];
    const turn = t - LENGTH;
    if (turn < Math.PI * half) {
      const angle = turn / half;
      return [-half * Math.cos(angle), -LENGTH - half * Math.sin(angle)];
    }
    return [half, -LENGTH + (turn - Math.PI * half)];
  }

  dispose(): void {
    this.beads.geometry.dispose();
    this.beads.dispose();
  }
}
