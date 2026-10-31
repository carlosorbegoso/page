import { Vector3, type PerspectiveCamera } from 'three';
import type { StationId } from '../sections';
import { layoutKind, type Pointer } from './common';

/** Which side of the screen the station's object occupies on desktop (text panel goes opposite). */
export type Side = 'left' | 'right';

export interface StationSpec {
  id: StationId;
  anchor: Vector3;
  desktopSide: Side;
  /** View direction from the target towards the camera. */
  view: Vector3;
  /** Subject size in metres used for framing [height, width]. */
  subject: [number, number];
  /** Fraction of the viewport height the subject should fill on desktop. */
  fill: number;
  /** Target offset from the anchor (centre of the subject). */
  centre: Vector3;
}

export const STATION_SPECS: Record<StationId, StationSpec> = {
  hero: {
    id: 'hero',
    anchor: new Vector3(0, 0, 0),
    desktopSide: 'right',
    view: new Vector3(0.32, 0.22, 1),
    subject: [1.25, 1],
    fill: 0.5,
    centre: new Vector3(0, 0.55, 0)
  },
  about: {
    id: 'about',
    anchor: new Vector3(5, 0, -7),
    desktopSide: 'left',
    view: new Vector3(-0.45, 0.35, 1),
    subject: [1.1, 1.7],
    fill: 0.48,
    centre: new Vector3(0, 0.5, 0)
  },
  company: {
    id: 'company',
    anchor: new Vector3(0, 0, -14),
    desktopSide: 'right',
    view: new Vector3(0.2, 0.32, 1),
    subject: [1.45, 2.3],
    fill: 0.55,
    centre: new Vector3(0, 0.45, 0)
  },
  products: {
    id: 'products',
    anchor: new Vector3(0, 0, -14),
    desktopSide: 'left',
    view: new Vector3(-0.4, 0.22, 1),
    subject: [1.45, 2.3],
    fill: 0.55,
    centre: new Vector3(0, 0.4, 0)
  },
  experience: {
    id: 'experience',
    anchor: new Vector3(-5.5, 0, -21),
    desktopSide: 'right',
    view: new Vector3(0.45, 0.5, 1),
    subject: [1.2, 3.2],
    fill: 0.5,
    centre: new Vector3(0, 0.45, -0.2)
  },
  contact: {
    id: 'contact',
    anchor: new Vector3(0, 0, -28),
    desktopSide: 'left',
    view: new Vector3(-0.1, 0.15, 1),
    subject: [1.25, 1],
    fill: 0.64,
    centre: new Vector3(0, 0.55, 0)
  }
};

export interface CameraPose {
  position: Vector3;
  target: Vector3;
  cx: number;
  cy: number;
}

interface ScreenFrame {
  cx: number;
  cy: number;
  heightFraction: number;
  widthFraction: number;
}

/**
 * Screen placement measured against the UI panels: desktop puts the object in the half
 * opposite the panel; below 1024 px it sits in the free band above the bottom panel.
 */
function screenFrame(spec: StationSpec, width: number): ScreenFrame {
  const kind = layoutKind(width);
  if (kind === 'desktop') {
    return {
      cx: spec.desktopSide === 'right' ? 0.75 : 0.25,
      cy: 0.5,
      heightFraction: spec.fill,
      widthFraction: 0.4
    };
  }
  if (kind === 'tablet') return { cx: 0.5, cy: 0.3, heightFraction: spec.fill * 0.6, widthFraction: 0.7 };
  return { cx: 0.5, cy: 0.19, heightFraction: spec.fill * 0.48, widthFraction: 0.88 };
}

/** Camera pose that frames a station's subject for the current viewport. */
export function stationPose(
  spec: StationSpec,
  camera: PerspectiveCamera,
  width: number,
  height: number,
  overrides: { target?: Vector3; subject?: [number, number]; orbit?: Pointer; dolly?: number } = {}
): CameraPose {
  const frame = screenFrame(spec, width);
  const [subjectHeight, subjectWidth] = overrides.subject ?? spec.subject;
  const tan = Math.tan((camera.fov * Math.PI) / 360);
  const aspect = width / height;
  const distance =
    Math.max(subjectHeight / (frame.heightFraction * 2 * tan), subjectWidth / (frame.widthFraction * 2 * tan * aspect)) *
    (overrides.dolly ?? 1);
  const target = overrides.target?.clone() ?? spec.anchor.clone().add(spec.centre);
  const orbit = overrides.orbit ?? { x: 0, y: 0 };
  const dir = spec.view.clone().normalize().applyAxisAngle(new Vector3(0, 1, 0), orbit.x * 0.12);
  dir.y += orbit.y * 0.06;
  dir.normalize();
  return { position: target.clone().addScaledVector(dir, distance), target, cx: frame.cx, cy: frame.cy };
}

/** Applies a pose, shifting the projection centre so the target lands at (cx, cy) on screen. */
export function applyPose(camera: PerspectiveCamera, pose: CameraPose, width: number, height: number): void {
  const distance = pose.position.distanceTo(pose.target);
  camera.aspect = width / height;
  camera.position.copy(pose.position);
  camera.near = Math.max(distance * 0.04, 0.05);
  camera.far = distance + 40;
  camera.lookAt(pose.target);
  camera.setViewOffset(width, height, width * (0.5 - pose.cx), height * (0.5 - pose.cy), width, height);
  camera.updateProjectionMatrix();
}

/** Blends two poses; the camera lifts along an arc while flying between stations. */
export function blendPoses(a: CameraPose, b: CameraPose, t: number): CameraPose {
  const position = a.position.clone().lerp(b.position, t);
  position.y += Math.sin(t * Math.PI) * 0.9;
  return {
    position,
    target: a.target.clone().lerp(b.target, t),
    cx: a.cx + (b.cx - a.cx) * t,
    cy: a.cy + (b.cy - a.cy) * t
  };
}
