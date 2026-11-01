import { Vector3, type PerspectiveCamera } from 'three';

export const RACK_SECONDS = 0.6;
export const HOLD_TIMEOUT_SECONDS = 2;
const AMOUNT_TAU = 0.15;

export class RackFocus {
  private readonly point = new Vector3();
  private hasPoint = false;
  distance = 5;
  amount = 0;
  private rackFrom = 5;
  private rackTo = 5;
  private rackElapsed = RACK_SECONDS;
  private holding = false;
  private holdElapsed = 0;
  private holdFor = HOLD_TIMEOUT_SECONDS;
  private readonly forward = new Vector3();
  private readonly toPoint = new Vector3();

  get hasFocus(): boolean {
    return this.hasPoint;
  }

  get racking(): boolean {
    return this.rackElapsed < RACK_SECONDS;
  }

  set(point: Vector3 | null): void {
    this.hasPoint = point !== null;
    if (point) this.point.copy(point);
  }

  hold(duration: number | undefined): void {
    this.holding = true;
    this.holdElapsed = 0;
    this.holdFor = typeof duration === 'number' ? Math.max(duration - RACK_SECONDS, 0) : HOLD_TIMEOUT_SECONDS;
  }

  settle(): void {
    if (this.holding) this.release();
  }

  private release(): void {
    this.holding = false;
    this.rackElapsed = 0;
    this.rackFrom = this.distance;
  }

  update(camera: PerspectiveCamera, dt: number, enabled: boolean, instant: boolean, range: number): void {
    const target = this.hasPoint && enabled ? 1 : 0;
    if (this.holding) {
      this.holdElapsed += dt;
      if (this.holdElapsed >= Math.min(this.holdFor, HOLD_TIMEOUT_SECONDS)) this.release();
    }
    if (this.hasPoint) {
      camera.getWorldDirection(this.forward);
      const desired = Math.max(this.toPoint.subVectors(this.point, camera.position).dot(this.forward), camera.near);
      if (this.amount < 0.001 || instant) {
        this.distance = desired;
        this.rackElapsed = RACK_SECONDS;
      } else if (!this.holding) {
        if (this.rackElapsed < RACK_SECONDS) {
          this.rackTo = desired;
          this.rackElapsed = Math.min(this.rackElapsed + dt, RACK_SECONDS);
          const t = this.rackElapsed / RACK_SECONDS;
          const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          this.distance = this.rackFrom + (this.rackTo - this.rackFrom) * eased;
        } else if (Math.abs(desired - this.distance) > range * 0.5) {
          this.rackFrom = this.distance;
          this.rackTo = desired;
          this.rackElapsed = 0;
        } else {
          this.distance = desired;
        }
      }
    }
    const k = instant ? 1 : 1 - Math.exp(-dt / AMOUNT_TAU);
    this.amount += (target - this.amount) * k;
    if (Math.abs(target - this.amount) < 0.001) this.amount = target;
  }
}
