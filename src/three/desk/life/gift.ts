import { Color, Matrix4, Vector3 } from 'three';
import { aroundPivot, poseInFrame, type RigPart } from './rig';
import { Sparks } from './sparks';
import { bump, progress, STILL, type FigureOffset } from './motion';

const SECONDS = 1.35;
const POP = 0.016;
const SHAKE_SECONDS = 0.45;

export class GiftLife {
  readonly sparks: Sparks;
  private startedAt = -1;
  private gentle = false;
  private burst = false;
  private hovered = false;
  private wasHovered = false;
  private shakeAt = -1;
  private readonly local = new Matrix4();
  private readonly tilt = new Matrix4();
  private readonly offsetUp = new Vector3();

  constructor(
    private readonly lid: RigPart | undefined,
    colors: Color[]
  ) {
    this.sparks = new Sparks(16, colors);
  }

  play(time: number, motion: boolean): void {
    this.startedAt = time;
    this.gentle = !motion;
    this.burst = false;
  }

  setHover(hovered: boolean): void {
    this.hovered = hovered;
  }

  offset(time: number): FigureOffset {
    const shake = progress(this.shakeAt, time, SHAKE_SECONDS);
    const yaw = shake < 0 ? 0 : 0.07 * Math.sin(shake * Math.PI * 6) * (1 - shake);
    const t = progress(this.startedAt, time, SECONDS);
    if (t < 0 || this.gentle) return yaw ? { lift: 0, yaw } : STILL;
    return { lift: 0.005 * bump(t / 0.2), yaw };
  }

  glow(time: number): number {
    const t = progress(this.startedAt, time, SECONDS);
    return t < 0 ? 0 : 0.18 * bump(t);
  }

  update(time: number, motion: boolean, pixelScale: number, frame: Matrix4): boolean {
    if (this.hovered && !this.wasHovered && motion) this.shakeAt = time;
    this.wasHovered = this.hovered;
    const shaking = progress(this.shakeAt, time, SHAKE_SECONDS) >= 0;
    if (!shaking) this.shakeAt = -1;
    const t = progress(this.startedAt, time, SECONDS);
    if (t >= 0.1 && !this.burst && !this.gentle && this.lid) {
      this.burst = true;
      const origin = this.lid.centre.clone().applyMatrix4(frame);
      this.sparks.burst(origin.setY(origin.y + 0.012), time, 0.06);
    }
    if (t < 0) this.startedAt = -1;
    const flying = this.sparks.update(time, pixelScale);
    return t >= 0 || flying || shaking;
  }

  pose(time: number, frame: Matrix4): void {
    if (!this.lid) return;
    const t = progress(this.startedAt, time, SECONDS);
    const height = t < 0 || this.gentle ? 0 : lidHeight(t);
    const lean = t < 0 || this.gentle ? 0 : 0.32 * bump(Math.min(t / 0.6, 1)) + 0.06 * Math.sin(t * 22) * bump(t / 0.6);
    this.tilt.makeRotationX(-lean);
    aroundPivot(this.local, this.lid.centre, this.tilt, this.offsetUp.set(0, height, 0));
    poseInFrame(this.lid.mesh, frame, this.local);
  }

  poseKey(time: number): string {
    const t = progress(this.startedAt, time, SECONDS);
    return t < 0 ? '0' : `${Math.round(lidHeight(t) * 2000)}`;
  }

  dispose(): void {
    this.sparks.dispose();
  }
}

function lidHeight(t: number): number {
  if (t < 0.14) return POP * (1 - Math.pow(1 - t / 0.14, 3));
  if (t < 0.42) return POP * (1 - 0.06 * Math.sin(((t - 0.14) / 0.28) * Math.PI));
  if (t < 0.6) return POP * (1 - Math.pow((t - 0.42) / 0.18, 2));
  return POP * 0.14 * bump((t - 0.6) / 0.16) + POP * 0.04 * bump((t - 0.76) / 0.1);
}
