import { Vector3 } from 'three';
import { damp } from '../scenes/common';

const DEG = Math.PI / 180;
const UP = new Vector3(0, 1, 0);
const LIMIT = { yaw: 40 * DEG, pitch: 16 * DEG } as const;
const RADIANS_PER_PX = 0.0032;
const RETURN_AFTER_SECONDS = 2.2;
const FOLLOW_RATE = 12;
const RETURN_RATE = 2.4;
const SETTLED = 1e-4;

const clamp = (value: number, limit: number) => Math.min(Math.max(value, -limit), limit);

export class LookAround {
  private yaw = 0;
  private pitch = 0;
  private goalYaw = 0;
  private goalPitch = 0;
  private held = false;
  private idle = 0;
  private readonly direction = new Vector3();
  private readonly side = new Vector3();

  grab(): void {
    this.held = true;
  }

  drag(dx: number, dy: number): void {
    this.goalYaw = clamp(this.goalYaw + dx * RADIANS_PER_PX, LIMIT.yaw);
    this.goalPitch = clamp(this.goalPitch + dy * RADIANS_PER_PX, LIMIT.pitch);
  }

  release(): void {
    this.held = false;
    this.idle = 0;
  }

  reset(): void {
    this.goalYaw = 0;
    this.goalPitch = 0;
  }

  get active(): boolean {
    return this.held || Math.abs(this.yaw) > SETTLED || Math.abs(this.pitch) > SETTLED;
  }

  update(dt: number): boolean {
    if (!this.held) {
      this.idle += dt;
      if (this.idle > RETURN_AFTER_SECONDS) this.reset();
    }
    const rate = this.held ? FOLLOW_RATE : RETURN_RATE;
    this.yaw = damp(this.yaw, this.goalYaw, rate, dt);
    this.pitch = damp(this.pitch, this.goalPitch, rate, dt);
    if (Math.abs(this.yaw - this.goalYaw) < SETTLED) this.yaw = this.goalYaw;
    if (Math.abs(this.pitch - this.goalPitch) < SETTLED) this.pitch = this.goalPitch;
    return this.yaw !== this.goalYaw || this.pitch !== this.goalPitch;
  }

  aim(eye: Vector3, target: Vector3, out: Vector3): Vector3 {
    this.direction.copy(target).sub(eye).applyAxisAngle(UP, this.yaw);
    this.side.crossVectors(this.direction, UP).normalize();
    this.direction.applyAxisAngle(this.side, this.pitch);
    return out.copy(eye).add(this.direction);
  }
}
