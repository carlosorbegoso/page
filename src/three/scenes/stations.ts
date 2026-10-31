import { PerspectiveCamera, Vector3 } from 'three';
import type { StationId } from '../sections';
import { layoutKind, type Pointer } from './common';

/** Side of the screen the station's celestial body occupies on desktop (plates go opposite). */
export type Side = 'left' | 'right';

/** Alfa, the star at the centre of the system. */
export const ALFA_POSITION = new Vector3(0, 0.6, -14);
export const EXPERIENCE_CENTRE = new Vector3(-5.5, 0.4, -21);
export const EXPERIENCE_TILT = (18 * Math.PI) / 180;
export const HERO_CENTRE = new Vector3(0, 0.55, 0);
export const MONOGRAM_RADIUS = 2.2;

export interface StationSpec {
  id: StationId;
  /** Point the camera looks at when reading this station. */
  target: Vector3;
  desktopSide: Side;
  /** View direction from the target towards the camera. */
  view: Vector3;
  /** Subject size in metres used for framing [height, width]. */
  subject: [number, number];
  /** Fraction of the viewport height the subject fills on desktop. */
  fill: number;
}

export const STATION_SPECS: Record<StationId, StationSpec> = {
  hero: {
    id: 'hero',
    target: HERO_CENTRE,
    desktopSide: 'right',
    view: new Vector3(0.1, 0.04, 1),
    subject: [MONOGRAM_RADIUS * 2.1, MONOGRAM_RADIUS * 2.1],
    fill: 0.55
  },
  about: {
    id: 'about',
    target: new Vector3(5, 0.8, -7),
    desktopSide: 'left',
    view: new Vector3(0.35, 0.2, 1),
    subject: [1.8, 2.6],
    fill: 0.6
  },
  company: {
    id: 'company',
    target: ALFA_POSITION.clone(),
    desktopSide: 'right',
    view: new Vector3(0.25, 0.45, 1),
    subject: [2.4, 6],
    fill: 0.6
  },
  products: {
    id: 'products',
    target: ALFA_POSITION.clone(),
    desktopSide: 'left',
    view: new Vector3(-0.45, 0.4, 0.85),
    subject: [2.4, 6],
    fill: 0.6
  },
  experience: {
    id: 'experience',
    target: EXPERIENCE_CENTRE,
    desktopSide: 'right',
    view: new Vector3(0.3, 0.7, 1),
    subject: [2.4, 6.8],
    fill: 0.5
  },
  contact: {
    id: 'contact',
    target: ALFA_POSITION.clone(),
    desktopSide: 'left',
    view: new Vector3(0.15, 0.08, -1),
    subject: [2.6, 2.6],
    fill: 0.6
  }
};

export interface CameraPose {
  position: Vector3;
  target: Vector3;
  cx: number;
  cy: number;
  /** Vertical FOV in degrees (default 30). */
  fov?: number;
  /** Roll in radians around the view axis. */
  roll?: number;
}

export const DEFAULT_FOV = 30;

interface ScreenFrame {
  cx: number;
  cy: number;
  heightFraction: number;
  widthFraction: number;
}

/** Desktop: body in the half opposite the plates. Below 1024 px: body in the top third. */
function screenFrame(spec: StationSpec, width: number): ScreenFrame {
  const kind = layoutKind(width);
  if (kind === 'desktop') {
    return { cx: spec.desktopSide === 'right' ? 0.74 : 0.26, cy: 0.5, heightFraction: spec.fill, widthFraction: 0.42 };
  }
  if (kind === 'tablet') return { cx: 0.5, cy: 0.2, heightFraction: spec.fill * 0.42, widthFraction: 0.86 };
  return { cx: 0.5, cy: 0.19, heightFraction: spec.fill * 0.4, widthFraction: 0.92 };
}

/** Camera pose that frames a station's subject for the current viewport. */
export function stationPose(
  spec: StationSpec,
  camera: PerspectiveCamera,
  width: number,
  height: number,
  overrides: { target?: Vector3; subject?: [number, number]; orbit?: Pointer } = {}
): CameraPose {
  const frame = screenFrame(spec, width);
  const [subjectHeight, subjectWidth] = overrides.subject ?? spec.subject;
  const tan = Math.tan((camera.fov * Math.PI) / 360);
  const aspect = width / height;
  const distance = Math.max(
    subjectHeight / (frame.heightFraction * 2 * tan),
    subjectWidth / (frame.widthFraction * 2 * tan * aspect)
  );
  const target = overrides.target?.clone() ?? spec.target.clone();
  const orbit = overrides.orbit ?? { x: 0, y: 0 };
  const dir = spec.view.clone().normalize().applyAxisAngle(new Vector3(0, 1, 0), orbit.x * 0.1);
  dir.y += orbit.y * 0.05;
  dir.normalize();
  return { position: target.clone().addScaledVector(dir, distance), target, cx: frame.cx, cy: frame.cy };
}

/** Applies a pose, shifting the projection centre so the target lands at (cx, cy) on screen. */
export function applyPose(camera: PerspectiveCamera, pose: CameraPose, width: number, height: number): void {
  camera.aspect = width / height;
  camera.fov = pose.fov ?? DEFAULT_FOV;
  camera.position.copy(pose.position);
  camera.near = 0.05;
  camera.far = 60;
  camera.lookAt(pose.target);
  if (pose.roll) camera.rotateZ(pose.roll);
  camera.setViewOffset(width, height, width * (0.5 - pose.cx), height * (0.5 - pose.cy), width, height);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
}

/** A detached camera configured with a pose (used to place plates for a station). */
export function poseCamera(source: PerspectiveCamera, pose: CameraPose, width: number, height: number): PerspectiveCamera {
  const camera = new PerspectiveCamera(source.fov, width / height, 0.05, 60);
  applyPose(camera, pose, width, height);
  return camera;
}

const ORBIT_RADIUS = 7;

/** Quintic ease-in-out (smootherstep). */
export function easeInOut(t: number): number {
  const x = Math.min(Math.max(t, 0), 1);
  return x * x * x * (x * (x * 6 - 15) + 10);
}

/**
 * Blends two poses. Around Alfa the camera swings on a sphere (never through the star);
 * elsewhere it flies straight with a gentle lift. Mid-flight the FOV breathes and the camera
 * rolls slightly in the direction of travel.
 */
export function blendPoses(a: CameraPose, b: CameraPose, t: number, rollDirection = 1): CameraPose {
  const target = a.target.clone().lerp(b.target, t);
  let position: Vector3;
  if (a.target.distanceTo(ALFA_POSITION) < ORBIT_RADIUS && b.target.distanceTo(ALFA_POSITION) < ORBIT_RADIUS) {
    const da = a.position.clone().sub(ALFA_POSITION);
    const db = b.position.clone().sub(ALFA_POSITION);
    const radius = da.length() + (db.length() - da.length()) * t;
    const dir = da.normalize().lerp(db.normalize(), t);
    if (dir.lengthSq() < 1e-4) dir.set(1, 0, 0);
    position = ALFA_POSITION.clone().addScaledVector(dir.normalize(), radius);
  } else {
    position = a.position.clone().lerp(b.position, t);
    position.y += Math.sin(t * Math.PI) * 1.2;
  }
  const arc = Math.sin(t * Math.PI);
  const fovA = a.fov ?? DEFAULT_FOV;
  const fovB = b.fov ?? DEFAULT_FOV;
  return {
    position,
    target,
    cx: a.cx + (b.cx - a.cx) * t,
    cy: a.cy + (b.cy - a.cy) * t,
    fov: fovA + (fovB - fovA) * t + arc * 3,
    roll: (a.roll ?? 0) + ((b.roll ?? 0) - (a.roll ?? 0)) * t + arc * 0.045 * rollDirection
  };
}
