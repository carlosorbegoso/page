import { Vector3, type PerspectiveCamera } from 'three';
import type { ChapterId, ChapterState, Shot } from './contracts';
import { damp, power2InOut } from './scenes/common';

/** Anti-motion-sickness limits (PLAN, final section). Enforced here, not by convention. */
export const CAMERA_LIMITS = {
  minDuration: 0.9,
  maxDuration: 1.4,
  maxDegPerSecond: 20,
  maxMetresPerSecond: 1,
  parallaxYawDeg: 1.5,
  parallaxPitchDeg: 0.8,
  fovDesktop: 30,
  fovTouch: 40
} as const;

const DEG = Math.PI / 180;
const UP = new Vector3(0, 1, 0);

export interface DirectorRequest {
  id: ChapterId;
  subIndex: number;
  shot: Shot;
}

export interface DirectorEvents {
  onEnter(id: ChapterId, subIndex: number): void;
  onSettled(id: ChapterId, subIndex: number): void;
  /** Reduced motion / pause: the caller dissolves and the director cuts. */
  dissolve(cut: () => void): void;
}

function viewAngleDeg(a: Shot, b: Shot): number {
  const da = a.target.clone().sub(a.position).normalize();
  const db = b.target.clone().sub(b.position).normalize();
  return Math.acos(Math.min(1, Math.max(-1, da.dot(db)))) / DEG;
}

/**
 * Camera director: one fixed shot per chapter (or sub-shot), moves only between shots.
 * Roll is always 0 (lookAt with world +Y), FOV is fixed per device, transitions last
 * 0.9–1.4 s with power2.inOut and are lengthened so speed never exceeds 20°/s or 1 m/s.
 * Cursor parallax (≤ 1.5° yaw, ≤ 0.8° pitch) only runs while settled.
 */
export class CameraDirector {
  private from: Shot | null = null;
  private to: Shot | null = null;
  private current: DirectorRequest | null = null;
  private previous: ChapterId | null = null;
  private elapsed = 0;
  private duration = 0;
  private settled = true;
  private parallax = { x: 0, y: 0 };
  private readonly position = new Vector3();
  private readonly target = new Vector3();
  /** Seconds the last transition would have needed at the speed limits (debug: > 1.4 means the shot pair is too far apart). */
  lastRequiredSeconds = 0;

  constructor(private readonly events: DirectorEvents) {}

  get chapter(): ChapterId | null {
    return this.current?.id ?? null;
  }

  get subIndex(): number {
    return this.current?.subIndex ?? 0;
  }

  get isSettled(): boolean {
    return this.settled;
  }

  /** Current target (rack focus point while nothing else is given). */
  get focus(): Vector3 {
    return this.target;
  }

  state(): ChapterState {
    const transition = this.settled || this.duration === 0 ? 1 : Math.min(this.elapsed / this.duration, 1);
    return {
      id: this.current?.id ?? 'intro',
      subIndex: this.current?.subIndex ?? 0,
      from: this.settled ? null : this.previous,
      transition,
      settled: this.settled
    };
  }

  /**
   * Requests a chapter shot. `instant` (capture, first frame) jumps without events delay;
   * `cut` (reduced motion / pause) dissolves and jumps.
   */
  request(next: DirectorRequest, mode: 'move' | 'cut' | 'instant'): void {
    if (this.current && this.current.id === next.id && this.current.subIndex === next.subIndex) {
      this.current = next;
      if (this.settled) this.to = next.shot;
      return;
    }
    this.previous = this.current?.id ?? null;
    this.current = next;
    this.events.onEnter(next.id, next.subIndex);
    const start: Shot = { position: this.position.clone(), target: this.target.clone() };
    if (mode === 'instant' || !this.to) {
      this.jump(next.shot);
      this.settle();
      return;
    }
    if (mode === 'cut') {
      this.settled = false;
      this.events.dissolve(() => {
        this.jump(next.shot);
        this.settle();
      });
      return;
    }
    const distance = start.position.distanceTo(next.shot.position);
    const angle = viewAngleDeg(start, next.shot);
    this.lastRequiredSeconds = Math.max(distance / CAMERA_LIMITS.maxMetresPerSecond, angle / CAMERA_LIMITS.maxDegPerSecond);
    this.duration = Math.min(Math.max(this.lastRequiredSeconds, CAMERA_LIMITS.minDuration), CAMERA_LIMITS.maxDuration);
    this.from = start;
    this.to = next.shot;
    this.elapsed = 0;
    this.settled = false;
  }

  /** Refreshes the target shot of the current chapter (resize, provider changes) without moving events. */
  refresh(shot: Shot): void {
    if (!this.current) return;
    this.current = { ...this.current, shot };
    if (this.settled) this.jump(shot);
    else this.to = shot;
  }

  private jump(shot: Shot): void {
    this.to = shot;
    this.from = null;
    this.position.copy(shot.position);
    this.target.copy(shot.target);
  }

  private settle(): void {
    this.settled = true;
    this.elapsed = this.duration;
    if (this.current) this.events.onSettled(this.current.id, this.current.subIndex);
  }

  /**
   * Advances the transition and applies the pose. `pointer` is the normalised pointer (0 when
   * not allowed). Returns true while the camera still moves (transition or parallax easing).
   */
  update(camera: PerspectiveCamera, dt: number, fov: number, pointer: { x: number; y: number }, reduced: boolean): boolean {
    let moving = false;
    if (!this.settled && this.from && this.to) {
      this.elapsed += dt;
      const t = power2InOut(this.elapsed / this.duration);
      this.position.lerpVectors(this.from.position, this.to.position, t);
      this.target.lerpVectors(this.from.target, this.to.target, t);
      moving = true;
      if (this.elapsed >= this.duration) {
        this.position.copy(this.to.position);
        this.target.copy(this.to.target);
        this.settle();
      }
    } else if (this.settled && this.to) {
      this.position.copy(this.to.position);
      this.target.copy(this.to.target);
    }

    const allowParallax = this.settled && !reduced;
    const goalX = allowParallax ? pointer.x : 0;
    const goalY = allowParallax ? pointer.y : 0;
    this.parallax.x = damp(this.parallax.x, goalX, 4, dt);
    this.parallax.y = damp(this.parallax.y, goalY, 4, dt);
    moving ||= Math.abs(this.parallax.x - goalX) > 0.001 || Math.abs(this.parallax.y - goalY) > 0.001;

    const offset = this.position.clone().sub(this.target);
    offset.applyAxisAngle(UP, -this.parallax.x * CAMERA_LIMITS.parallaxYawDeg * DEG);
    const right = new Vector3().crossVectors(UP, offset).normalize();
    offset.applyAxisAngle(right, this.parallax.y * CAMERA_LIMITS.parallaxPitchDeg * DEG);

    if (camera.fov !== fov) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
    camera.up.copy(UP);
    camera.position.copy(this.target).add(offset);
    camera.lookAt(this.target);
    camera.updateMatrixWorld();
    return moving;
  }
}
