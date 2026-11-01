import { Matrix4, Vector3 } from 'three';
import { aroundPivot, poseInFrame, type RigPart } from './rig';
import { progress } from './motion';

const SECONDS = 2;
const TURN_SECONDS = 0.55;
const TURN = 0.42;
const HOVER_TURN = 0.07;
const IDENTITY = new Matrix4();

export class MugLife {
  private startedAt = -1;
  private gentle = false;
  private angle = 0;
  private hovered = false;
  private nudge = 0;
  private from = 0;
  private readonly axisAt: Vector3;
  private readonly local = new Matrix4();
  private readonly turn = new Matrix4();

  constructor(
    private readonly mug: RigPart | undefined,
    axis: Vector3
  ) {
    this.axisAt = axis.clone();
  }

  play(time: number, motion: boolean): void {
    if (this.startedAt >= 0) this.from = this.goal();
    this.startedAt = time;
    this.gentle = !motion;
  }

  setHover(hovered: boolean): void {
    this.hovered = hovered;
  }

  steamGain(time: number): number {
    const t = progress(this.startedAt, time, SECONDS);
    if (t < 0) return 1;
    const envelope = Math.min(1, t / 0.06) * (t < 0.55 ? 1 : 1 - (t - 0.55) / 0.45);
    return 1 + 1.4 * envelope;
  }

  update(dt: number, time: number, motion: boolean): boolean {
    const goal = this.hovered && motion ? HOVER_TURN : 0;
    this.nudge += (goal - this.nudge) * (1 - Math.exp(-14 * dt));
    const easing = Math.abs(goal - this.nudge) > 1e-4;
    const t = progress(this.startedAt, time, SECONDS);
    if (t < 0 && this.startedAt >= 0) {
      this.from = this.goal();
      this.startedAt = -1;
    }
    return t >= 0 || easing;
  }

  pose(time: number): void {
    if (!this.mug) return;
    const t = progress(this.startedAt, time, TURN_SECONDS);
    const done = this.startedAt >= 0 && t < 0;
    const eased = t < 0 ? (done ? 1 : 0) : 1 - Math.pow(1 - t, 3) + 0.08 * Math.sin(t * Math.PI) * (1 - t);
    this.angle = this.from + (this.gentle ? 0 : TURN) * (this.startedAt >= 0 ? eased : 0);
    aroundPivot(this.local, this.axisAt, this.turn.makeRotationY(this.angle + this.nudge));
    poseInFrame(this.mug.mesh, IDENTITY, this.local);
  }

  poseKey(): string {
    return `${Math.round((this.angle + this.nudge) * 50)}`;
  }

  private goal(): number {
    return this.from + (this.gentle ? 0 : TURN);
  }
}
