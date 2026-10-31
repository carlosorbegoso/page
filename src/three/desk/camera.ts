import { Vector3 } from 'three';
import type { StationCameraPose } from '../contracts';

export type DeskLayout = 'desktop' | 'tablet' | 'phone';

export function deskLayout(width: number): DeskLayout {
  if (width >= 1024) return 'desktop';
  if (width >= 768) return 'tablet';
  return 'phone';
}

/** Vertical FOV per layout (desk.md §5: tablet uses the desktop framing at 34°). */
export function layoutFov(layout: DeskLayout): number {
  return layout === 'tablet' ? 34 : 30;
}

const MAX_PLATE_TILT = (8 * Math.PI) / 180;
const DEG = Math.PI / 180;

/**
 * On-screen size of the plate relative to 1:1. Phones read it at 1:1 unless it is taller than two
 * thirds of the viewport (floor 0.78). On desktop/tablet a plate at 1:1 would let the monitor
 * swallow the frame, so it
 * may shrink to stay within 56 % of the viewport height and width, never below 0.66 (crisp:
 * CSS3D only blurs when scaled up).
 */
export function plateProjection(layout: DeskLayout, viewport: { width: number; height: number }, plate: { width: number; height: number }): number {
  if (layout === 'phone') return Math.min(1, Math.max(0.78, (0.66 * viewport.height) / Math.max(plate.height, 1)));
  const fit = Math.min((0.56 * viewport.height) / Math.max(plate.height, 1), (0.56 * viewport.width) / Math.max(plate.width, 1));
  return Math.min(1, Math.max(0.66, fit));
}

export interface ReadingInput {
  layout: DeskLayout;
  width: number;
  height: number;
  /** World units per CSS px of the plate. */
  scale: number;
  plateWidth: number;
  screenCentre: Vector3;
  screenNormal: Vector3;
  plateHeight: number;
  /** Damped pointer offset (-1..1), already zero when parallax is not allowed. */
  pointer: { x: number; y: number };
}

/**
 * Opening shot: the eye sits on the screen normal at the distance where the plate projects
 * 1:1 (`scale = 2·d·tan(fov/2) / innerHeight`, constellation.md §2) times `plateProjection`,
 * and yaws/pitches so the screen lands at (sx, sy). Off-centre placement is capped so the plate's angle to the image
 * plane stays ≤ 8°.
 */
export function readingPose(input: ReadingInput): StationCameraPose {
  const fov = layoutFov(input.layout);
  const tan = Math.tan((fov * DEG) / 2);
  const aspect = input.width / Math.max(input.height, 1);
  const distance = (input.scale * input.height) / (2 * tan) / plateProjection(input.layout, input, { width: input.plateWidth, height: input.plateHeight });
  const eye = input.screenCentre.clone().addScaledVector(input.screenNormal, distance);

  let sx = 0.5;
  let sy = 0.5;
  if (input.layout === 'desktop') {
    const fit = ((input.plateWidth / 2) * plateProjection(input.layout, input, { width: input.plateWidth, height: input.plateHeight }) + 32) / input.width;
    const tilt = 0.5 - Math.tan(MAX_PLATE_TILT) / (2 * aspect * tan);
    sx = Math.min(0.5, Math.max(0.38, fit, tilt));
    sy = 0.37;
  } else if (input.layout === 'phone') {
    sy = 0.57;
  }
  const forward = input.screenNormal.clone().negate();
  const right = forward.clone().cross(new Vector3(0, 1, 0)).normalize();
  const up = right.clone().cross(forward).normalize();
  const yaw = (0.5 - sx) * 2 * aspect * tan + Math.tan(1.5 * DEG * input.pointer.x);
  const pitch = (sy - 0.5) * 2 * tan + Math.tan(0.8 * DEG * input.pointer.y);
  const direction = forward.addScaledVector(right, yaw).addScaledVector(up, pitch).normalize();
  return { position: eye, target: eye.clone().addScaledVector(direction, distance), fov };
}

export interface PathKey {
  at: number;
  position: Vector3;
  target: Vector3;
  fov: number;
}

/**
 * Smooth path through keyed poses: non-uniform Catmull-Rom tangents in a cubic Hermite,
 * with zero velocity at both ends (the camera starts and lands at rest).
 */
export function samplePath(keys: readonly PathKey[], t: number): StationCameraPose {
  const last = keys.length - 1;
  if (t <= keys[0]!.at) return poseOf(keys[0]!);
  if (t >= keys[last]!.at) return poseOf(keys[last]!);
  let i = 0;
  while (i < last - 1 && t > keys[i + 1]!.at) i++;
  const a = keys[i]!;
  const b = keys[i + 1]!;
  const span = b.at - a.at;
  const u = (t - a.at) / span;
  const tangent = (index: number, pick: (key: PathKey) => Vector3) => {
    if (index <= 0 || index >= last) return new Vector3();
    const prev = keys[index - 1]!;
    const next = keys[index + 1]!;
    return pick(next).clone().sub(pick(prev)).multiplyScalar(span / (next.at - prev.at));
  };
  const hermite = (pick: (key: PathKey) => Vector3) => {
    const u2 = u * u;
    const u3 = u2 * u;
    return pick(a)
      .clone()
      .multiplyScalar(2 * u3 - 3 * u2 + 1)
      .addScaledVector(tangent(i, pick), u3 - 2 * u2 + u)
      .addScaledVector(pick(b), -2 * u3 + 3 * u2)
      .addScaledVector(tangent(i + 1, pick), u3 - u2);
  };
  const eased = u * u * (3 - 2 * u);
  return {
    position: hermite(key => key.position),
    target: hermite(key => key.target),
    fov: a.fov + (b.fov - a.fov) * eased
  };
}

function poseOf(key: PathKey): StationCameraPose {
  return { position: key.position.clone(), target: key.target.clone(), fov: key.fov };
}
