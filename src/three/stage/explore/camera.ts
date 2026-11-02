import { Vector3 } from 'three';
import { damp } from '../../scenes/common';

const DEG = Math.PI / 180;
const UP = new Vector3(0, 1, 0);
const SIDE = new Vector3(1, 0, 0);
const EYE = new Vector3(0.35, 1.5, 1.75);
const FIRST_LOOK = new Vector3(0.1, 1.0, -0.25);
const PITCH_LIMIT = 70 * DEG;
const BLEND_SECONDS = 1.4;
const TURN_RATE = 14;
const LOOK_DISTANCE = 2;

function smootherstep(x: number): number {
  return x * x * x * (x * (x * 6 - 15) + 10);
}

function headingTo(point: Vector3): { yaw: number; pitch: number } {
  const d = point.clone().sub(EYE);
  return { yaw: Math.atan2(-d.x, -d.z), pitch: Math.atan2(d.y, Math.hypot(d.x, d.z)) };
}

export class ExploreCamera {
  private goal = 0;
  private blend = 0;
  private yaw = 0;
  private pitch = 0;
  private goalYaw = 0;
  private goalPitch = 0;
  private readonly look = new Vector3();

  get engaged(): boolean {
    return this.blend > 0 || this.goal > 0;
  }

  enter(): void {
    const first = headingTo(FIRST_LOOK);
    this.yaw = this.goalYaw = first.yaw;
    this.pitch = this.goalPitch = first.pitch;
    this.goal = 1;
  }

  exit(): void {
    this.goal = 0;
  }

  turn(dYaw: number, dPitch: number): void {
    this.goalYaw += dYaw;
    this.goalPitch = Math.min(Math.max(this.goalPitch + dPitch, -PITCH_LIMIT), PITCH_LIMIT);
  }

  apply(position: Vector3, target: Vector3, dt: number, instant: boolean): boolean {
    const step = instant ? 1 : dt / BLEND_SECONDS;
    this.blend += Math.max(-step, Math.min(step, this.goal - this.blend));
    if (this.blend <= 0) return false;
    this.yaw = damp(this.yaw, this.goalYaw, TURN_RATE, dt);
    this.pitch = damp(this.pitch, this.goalPitch, TURN_RATE, dt);
    const turning =
      Math.abs(this.yaw - this.goalYaw) > 1e-4 || Math.abs(this.pitch - this.goalPitch) > 1e-4;
    this.look
      .set(0, 0, -LOOK_DISTANCE)
      .applyAxisAngle(SIDE, this.pitch)
      .applyAxisAngle(UP, this.yaw)
      .add(EYE);
    const t = smootherstep(this.blend);
    position.lerp(EYE, t);
    target.lerp(this.look, t);
    return turning || this.blend !== this.goal;
  }
}
