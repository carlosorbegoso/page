import { CapsuleGeometry, Color, Matrix4, Mesh, MeshBasicMaterial, Quaternion, Vector3 } from 'three';
import { poseInFrame, type RigPart } from './rig';
import { bump, progress, STILL, type FigureOffset } from './motion';

const SECONDS = 0.8;
const MESSAGE_SECONDS = 1.2;
const TYPING_RATE = 7.2;
const TYPING_HOP = 0.0024;

/**
 * Splits the typing-dot triangles into the three dots, ordered along the bubble (left to right as
 * built), by their spread from the group's centre.
 */
export function splitDots(part: RigPart): number[] {
  const centre = part.centre;
  const far = part.centroids.reduce((best, point) => (point.distanceToSquared(centre) > best.distanceToSquared(centre) ? point : best), centre);
  const axis = far.clone().sub(centre).setY(0).normalize();
  const reach = Math.max(...part.centroids.map(point => Math.abs(point.clone().sub(centre).dot(axis))), 1e-6);
  return part.centroids.map(point => Math.min(2, Math.max(0, Math.round(point.clone().sub(centre).dot(axis) / reach + 1))));
}

/**
 * Ventixs's chat bubble: under the pointer (or while its product is on screen) the three dots bob in
 * sequence like someone typing; a click bounces the bubble and a tiny message pops out and floats up.
 */
export class BubbleLife {
  readonly message: Mesh<CapsuleGeometry, MeshBasicMaterial>;
  private startedAt = -1;
  private gentle = false;
  private typing = 0;
  private typingGoal = false;
  private readonly local = new Matrix4();
  private readonly hop = new Vector3();
  private readonly centre: Vector3;
  private readonly at = new Vector3();
  private readonly turn = new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), Math.PI / 2);
  private readonly size = new Vector3();

  constructor(
    private readonly dots: RigPart[],
    color: Color
  ) {
    this.centre = dots.reduce((sum, dot) => sum.add(dot.centre), new Vector3()).multiplyScalar(1 / Math.max(dots.length, 1));
    this.message = new Mesh(new CapsuleGeometry(0.0055, 0.012, 4, 12), new MeshBasicMaterial({ color: color.clone().multiplyScalar(1.6), transparent: true, opacity: 0 }));
    this.message.name = 'desk-bubble-message';
    this.message.matrixAutoUpdate = false;
    this.message.visible = false;
    this.message.raycast = () => undefined;
  }

  play(time: number, motion: boolean): void {
    this.startedAt = time;
    this.gentle = !motion;
  }

  /** Dots type while the pointer is over the bubble or its product is the one on screen. */
  setTyping(typing: boolean): void {
    this.typingGoal = typing;
  }

  offset(time: number): FigureOffset {
    const t = progress(this.startedAt, time, SECONDS);
    if (t < 0 || this.gentle) return STILL;
    return { lift: 0.014 * bump(t / 0.4) + 0.004 * bump((t - 0.42) / 0.22), yaw: -0.18 * bump(t / 0.4) + 0.05 * bump((t - 0.4) / 0.3) };
  }

  glow(time: number): number {
    const t = progress(this.startedAt, time, SECONDS);
    return t < 0 ? 0 : 0.22 * bump(t);
  }

  update(dt: number, time: number, motion: boolean): boolean {
    const t = progress(this.startedAt, time, MESSAGE_SECONDS);
    if (t < 0) this.startedAt = -1;
    const goal = this.typingGoal && motion ? 1 : 0;
    this.typing += (goal - this.typing) * (1 - Math.exp(-8 * dt));
    if (Math.abs(goal - this.typing) < 1e-3) this.typing = goal;
    return t >= 0 || this.typing > 0;
  }

  pose(time: number, frame: Matrix4): void {
    const t = progress(this.startedAt, time, SECONDS);
    this.dots.forEach((dot, index) => {
      const typing = this.typing * TYPING_HOP * Math.pow(Math.max(0, Math.sin(time * TYPING_RATE - index * 1.1)), 2);
      const sent = t >= 0 && !this.gentle ? 0.0035 * bump(t / 0.35) : 0;
      this.local.makeTranslation(this.hop.set(0, t >= 0 ? sent : typing, 0));
      poseInFrame(dot.mesh, frame, this.local);
    });
    const m = progress(this.startedAt, time, MESSAGE_SECONDS);
    const shown = m >= 0.08 && !this.gentle;
    this.message.visible = shown;
    if (!shown) return;
    const k = (m - 0.08) / 0.92;
    const pop = k < 0.2 ? 1.15 * Math.sin((k / 0.2) * (Math.PI / 2)) : 1 + 0.15 * Math.max(0, 1 - (k - 0.2) / 0.15);
    this.message.material.opacity = Math.min(1, k / 0.1) * (k > 0.6 ? 1 - (k - 0.6) / 0.4 : 1);
    this.at.copy(this.centre).applyMatrix4(frame);
    this.at.y += 0.034 + 0.022 * (1 - Math.pow(1 - k, 2));
    this.at.x += 0.006 * k;
    this.message.matrix.compose(this.at, this.turn, this.size.setScalar(Math.max(pop, 0.001)));
    this.message.matrixWorldNeedsUpdate = true;
  }

  dispose(): void {
    this.message.geometry.dispose();
    this.message.material.dispose();
  }
}
