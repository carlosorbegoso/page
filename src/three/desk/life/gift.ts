import { Color, Matrix4, Vector3 } from 'three';
import { aroundPivot, poseInFrame, type RigPart } from './rig';
import { Sparks } from './sparks';
import { bump, progress, STILL, type FigureOffset } from './motion';

const SECONDS = 2;
const OPEN_ANGLE = { wide: 1.95, tall: 1.15 } as const;
const OPENING = 0.16;
const CLOSING_AT = 0.78;
const CLOSING = 0.14;

function easeOutBack(t: number): number {
  const x = Math.min(Math.max(t, 0), 1) - 1;
  return 1 + 2.2 * x * x * x + 1.2 * x * x;
}

function lidAngle(t: number, open: number): number {
  if (t < 0) return 0;
  if (t < OPENING) return open * easeOutBack(t / OPENING);
  if (t < CLOSING_AT)
    return open + 0.05 * Math.sin((t - OPENING) * 14) * Math.max(0, 1 - (t - OPENING) * 4);
  const close = Math.min((t - CLOSING_AT) / CLOSING, 1);
  const settle =
    t > CLOSING_AT + CLOSING
      ? 0.08 * bump((t - CLOSING_AT - CLOSING) / (1 - CLOSING_AT - CLOSING))
      : 0;
  return open * (1 - close * close) + settle;
}

function hingeOf(lid: RigPart): Vector3 {
  const back = Math.min(...lid.centroids.map(point => point.z));
  const bottom = Math.min(...lid.centroids.map(point => point.y));
  return new Vector3(lid.centre.x, bottom, back);
}

export class GiftLife {
  readonly sparks: Sparks;
  private startedAt = -1;
  private gentle = false;
  private burst = false;
  private open: number = OPEN_ANGLE.wide;
  private readonly hinge: Vector3;
  private readonly local = new Matrix4();
  private readonly turn = new Matrix4();

  constructor(
    private readonly lid: RigPart | undefined,
    colors: Color[]
  ) {
    this.sparks = new Sparks(16, colors);
    this.hinge = lid ? hingeOf(lid) : new Vector3();
  }

  play(time: number, motion: boolean): void {
    this.startedAt = time;
    this.gentle = !motion;
    this.burst = false;
    this.open = innerWidth < innerHeight ? OPEN_ANGLE.tall : OPEN_ANGLE.wide;
  }

  offset(time: number): FigureOffset {
    const t = progress(this.startedAt, time, SECONDS);
    if (t < 0 || this.gentle) return STILL;
    return {
      lift: 0.003 * bump(t / 0.12) + 0.002 * bump((t - CLOSING_AT - CLOSING) / 0.08),
      yaw: 0
    };
  }

  update(time: number, pixelScale: number, frame: Matrix4): boolean {
    const t = progress(this.startedAt, time, SECONDS);
    if (t >= OPENING * 0.6 && !this.burst && !this.gentle && this.lid) {
      this.burst = true;
      const origin = this.lid.centre.clone().applyMatrix4(frame);
      this.sparks.burst(origin.setY(origin.y + 0.012), time, 0.05);
    }
    if (t < 0) this.startedAt = -1;
    const flying = this.sparks.update(time, pixelScale);
    return t >= 0 || flying;
  }

  pose(time: number, frame: Matrix4): void {
    if (!this.lid) return;
    const t = progress(this.startedAt, time, SECONDS);
    this.turn.makeRotationX(this.gentle ? 0 : -lidAngle(t, this.open));
    aroundPivot(this.local, this.hinge, this.turn);
    poseInFrame(this.lid.mesh, frame, this.local);
  }

  poseKey(time: number): string {
    const t = progress(this.startedAt, time, SECONDS);
    return t < 0 || this.gentle ? '0' : `${Math.round(lidAngle(t, this.open) * 200)}`;
  }

  dispose(): void {
    this.sparks.dispose();
  }
}
