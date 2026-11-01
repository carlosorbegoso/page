import { Quaternion, Vector3, type PerspectiveCamera } from 'three';
import type { ChapterId, ChapterState, Shot } from './contracts';
import { damp } from './scenes/common';

/** Anti-motion-sickness limits (PLAN, final section). Enforced here, not by convention. */
export const CAMERA_LIMITS = {
  minDuration: 0.9,
  maxDuration: 1.4,
  maxDegPerSecond: 20,
  maxMetresPerSecond: 1,
  parallaxYawDeg: 1.5,
  parallaxPitchDeg: 0.8,
  fovDesktop: 30,
  fovTouch: 40,
  /** Upright phones: a taller lens so the room fits the top half of the frame above the panels. */
  fovStacked: 52,
  breathMetres: 0.006,
  breathDegrees: 0.12,
  breathPeriodSeconds: 11
} as const;

const DEG = Math.PI / 180;
const UP = new Vector3(0, 1, 0);
/** Seconds for the settled breathing to fade in, so it never starts with a jump. */
const BREATH_FADE_SECONDS = 2.5;

/** Quintic smootherstep: zero velocity and acceleration at both ends, a lower peak speed than power2.inOut. */
export function cinematicEase(t: number): number {
  const x = Math.min(Math.max(t, 0), 1);
  return x * x * x * (x * (x * 6 - 15) + 10);
}

export interface DirectorRequest {
  id: ChapterId;
  subIndex: number;
  shot: Shot;
}

export interface DirectorEvents {
  /** `duration` is the camera move in seconds (0 for an instant jump or a dissolve cut). */
  onEnter(id: ChapterId, subIndex: number, duration: number): void;
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
 * 0.9–1.4 s with a quintic ease and are lengthened so speed never exceeds 20°/s or 1 m/s.
 * Cursor parallax (≤ 1.5° yaw, ≤ 0.8° pitch) and a slow breathing drift only run while settled.
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
  private breathTime = 0;
  private breathLevel = 0;
  private readonly heldPosition = new Vector3();
  private readonly heldQuaternion = new Quaternion();
  private readonly breathShift = new Vector3();
  private readonly breathLook = new Vector3();
  private readonly breathRight = new Vector3();
  private readonly breathUp = new Vector3();
  private readonly breathForward = new Vector3();
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
    const start: Shot = { position: this.position.clone(), target: this.target.clone() };
    if (mode === 'instant' || !this.to) {
      this.events.onEnter(next.id, next.subIndex, 0);
      this.jump(next.shot);
      this.settle();
      return;
    }
    if (mode === 'cut') {
      this.events.onEnter(next.id, next.subIndex, 0);
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
    this.events.onEnter(next.id, next.subIndex, this.duration);
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
      const t = cinematicEase(this.elapsed / this.duration);
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

  /**
   * Slow settled drift on top of the pose `update` applied: a small truck and dolly (≤ 6 mm) and
   * a look offset (≤ 0.12°) on incommensurate periods ≥ 11 s, re-aimed with world +Y so roll stays
   * 0. It fades in after the camera settles and out as soon as it moves. Returns a function that
   * puts the camera back, so the 2D panels and the CSS3D surfaces keep the steady pose.
   */
  breathe(camera: PerspectiveCamera, dt: number, enabled: boolean): () => void {
    const goal = enabled && this.settled ? 1 : 0;
    const rate = goal > this.breathLevel || this.settled ? 1 / BREATH_FADE_SECONDS : 4;
    this.breathLevel = Math.min(Math.max(this.breathLevel + Math.sign(goal - this.breathLevel) * rate * dt, 0), 1);
    if (Math.abs(goal - this.breathLevel) < 0.01) this.breathLevel = goal;
    if (this.breathLevel === 0) return () => undefined;
    this.breathTime += dt;
    const level = this.breathLevel * this.breathLevel * (3 - 2 * this.breathLevel);
    const phase = (this.breathTime / CAMERA_LIMITS.breathPeriodSeconds) * Math.PI * 2;
    const metres = CAMERA_LIMITS.breathMetres * level;
    const look = Math.tan(CAMERA_LIMITS.breathDegrees * DEG) * level;

    this.heldPosition.copy(camera.position);
    this.heldQuaternion.copy(camera.quaternion);
    camera.getWorldDirection(this.breathForward);
    this.breathRight.crossVectors(this.breathForward, UP).normalize();
    this.breathUp.crossVectors(this.breathRight, this.breathForward).normalize();
    const distance = Math.max(camera.position.distanceTo(this.target), 0.05);
    this.breathShift
      .copy(this.breathRight)
      .multiplyScalar(Math.sin(phase) * metres)
      .addScaledVector(this.breathUp, Math.sin(phase * 0.77 + 1.3) * metres * 0.5)
      .addScaledVector(this.breathForward, Math.sin(phase * 0.61 + 2.1) * metres * 0.6);
    this.breathLook
      .copy(this.target)
      .add(this.breathShift)
      .addScaledVector(this.breathRight, Math.sin(phase * 0.83 + 0.4) * look * distance)
      .addScaledVector(this.breathUp, Math.sin(phase * 0.69 + 2.7) * look * distance * 0.6);
    camera.position.add(this.breathShift);
    camera.lookAt(this.breathLook);
    camera.updateMatrixWorld();
    return () => {
      camera.position.copy(this.heldPosition);
      camera.quaternion.copy(this.heldQuaternion);
      camera.updateMatrixWorld();
    };
  }

  /** True while the breathing still fades in or out (the Stage keeps rendering). */
  get breathing(): boolean {
    return this.breathLevel > 0;
  }
}
