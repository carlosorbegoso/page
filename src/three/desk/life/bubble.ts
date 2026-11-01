import { Matrix4, Vector3 } from 'three';
import { poseInFrame, type RigPart } from './rig';
import { bump, progress, STILL, type FigureOffset } from './motion';

const TYPING_SECONDS = 0.9;
const SEND_SECONDS = 0.35;
const SECONDS = TYPING_SECONDS + SEND_SECONDS;
const TYPING_RATE = 7.2;
const TYPING_HOP = 0.0024;

export function splitDots(part: RigPart): number[] {
  const centre = part.centre;
  const far = part.centroids.reduce(
    (best, point) =>
      point.distanceToSquared(centre) > best.distanceToSquared(centre) ? point : best,
    centre
  );
  const axis = far.clone().sub(centre).setY(0).normalize();
  const reach = Math.max(
    ...part.centroids.map(point => Math.abs(point.clone().sub(centre).dot(axis))),
    1e-6
  );
  return part.centroids.map(point =>
    Math.min(2, Math.max(0, Math.round(point.clone().sub(centre).dot(axis) / reach + 1)))
  );
}

export class BubbleLife {
  private startedAt = -1;
  private gentle = false;
  private readonly local = new Matrix4();
  private readonly hop = new Vector3();

  constructor(private readonly dots: RigPart[]) {}

  play(time: number, motion: boolean): void {
    this.startedAt = time;
    this.gentle = !motion;
  }

  private sendProgress(time: number): number {
    const t = progress(this.startedAt, time, SECONDS) * SECONDS;
    return t < TYPING_SECONDS ? -1 : (t - TYPING_SECONDS) / SEND_SECONDS;
  }

  offset(time: number): FigureOffset {
    const sent = this.sendProgress(time);
    if (sent < 0 || this.gentle) return STILL;
    return { lift: 0.01 * bump(sent), yaw: -0.12 * bump(sent) };
  }

  update(time: number): boolean {
    const t = progress(this.startedAt, time, SECONDS);
    if (t < 0) this.startedAt = -1;
    return t >= 0;
  }

  pose(time: number, frame: Matrix4): void {
    const elapsed = this.startedAt < 0 ? -1 : time - this.startedAt;
    const typing = !this.gentle && elapsed >= 0 && elapsed < TYPING_SECONDS;
    this.dots.forEach((dot, index) => {
      const hop = typing
        ? TYPING_HOP * Math.pow(Math.max(0, Math.sin(elapsed * TYPING_RATE * 1.4 - index * 1.1)), 2)
        : 0;
      this.local.makeTranslation(this.hop.set(0, hop, 0));
      poseInFrame(dot.mesh, frame, this.local);
    });
  }

  poseKey(time: number): string {
    const elapsed = this.startedAt < 0 ? -1 : time - this.startedAt;
    return elapsed < 0 ? '0' : `${Math.round(elapsed * 30)}`;
  }
}
