import { Euler, Matrix4, PerspectiveCamera, Plane, Quaternion, Ray, Vector3 } from 'three';
import type { ChapterId, Shot } from '../contracts';
import {
  FIGURE_HEIGHT,
  FIGURES,
  HERO_EYE,
  MONITOR,
  OPEN_FOLDER,
  PRODUCT_FIGURES,
  ROOM,
  folderSpine,
  type FolderId
} from './layout';

const DEG = Math.PI / 180;

/** Sub-shot order inside `experience` (reverse chronological, PLAN "Contenido"). */
export const EXPERIENCE_ORDER = ['tcs', 'intercorp', 'baufest', 'sysarp'] as const satisfies readonly FolderId[];

export const SUB_SHOTS: Partial<Record<ChapterId, number>> = { products: PRODUCT_FIGURES.length, experience: EXPERIENCE_ORDER.length };

/** Anchor names for the 2D panels (`data-plate-anchor`). */
export const ANCHOR_NAMES = [
  'company',
  'product-skymek',
  'product-parati',
  'product-ventixs',
  'exp-tcs',
  'exp-intercorp',
  'exp-baufest',
  'exp-sysarp',
  'outro'
] as const;

export interface Viewport {
  width: number;
  height: number;
  /** Device FOV from the director (30 desktop, 40 below 1024 px). */
  fov: number;
}

/** A framed shot: eye, subject and where the subject lands on screen. */
export interface Framing {
  eye: Vector3;
  focus: Vector3;
  sx: number;
  sy: number;
  /** Where a 2D panel starts on screen for this shot (`getAnchor`). */
  panel?: { name: string; sx: number; sy: number; plane?: Plane };
}

export interface SurfaceFrame {
  centre: Vector3;
  normal: Vector3;
  quaternion: Quaternion;
  width: number;
  height: number;
}

/** View direction for a heading (+ = looking right, towards +X) and pitch (+ = up). */
function direction(heading: number, pitch: number): Vector3 {
  return new Vector3(Math.sin(heading * DEG) * Math.cos(pitch * DEG), Math.sin(pitch * DEG), -Math.cos(heading * DEG) * Math.cos(pitch * DEG));
}

function eyeFor(focus: Vector3, heading: number, pitch: number, distance: number): Vector3 {
  return focus.clone().addScaledVector(direction(heading, pitch), -distance);
}

/** World frame of the monitor glass. */
export function monitorFrame(): SurfaceFrame {
  const quaternion = new Quaternion().setFromEuler(new Euler(MONITOR.tilt, MONITOR.yaw, 0, 'YXZ'));
  const normal = new Vector3(0, 0, 1).applyQuaternion(quaternion);
  const centre = MONITOR.centre.clone().addScaledVector(normal, MONITOR.depth / 2 + 0.0006);
  return { centre, normal, quaternion, width: MONITOR.screen.width, height: MONITOR.screen.height };
}

/** World frame of the phone glass (from the prop's matrix). */
export function phoneFrame(matrix: Matrix4, width: number, height: number): SurfaceFrame {
  const centre = new Vector3();
  const quaternion = new Quaternion();
  matrix.decompose(centre, quaternion, new Vector3());
  return { centre, normal: new Vector3(0, 0, 1).applyQuaternion(quaternion), quaternion, width, height };
}

/** Distance at which an object of `size` metres spans `fraction` of the frame width. */
function widthFit(size: number, fraction: number, view: Viewport): number {
  const tan = Math.tan((view.fov * DEG) / 2);
  return size / fraction / (2 * tan * (view.width / view.height));
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Every chapter's framing for a viewport. Landscape follows desk.md §5 (subject on one half,
 * panel column on the other); portrait puts the subject in the top third and panels below.
 * Consecutive shots respect the PLAN limits (≤ 45° yaw, ≤ 25° pitch, ≤ 1.5 m): see `checkShots`.
 */
export function framings(view: Viewport, phone: SurfaceFrame): Record<ChapterId, Framing[]> {
  const portrait = view.width < view.height;
  const monitor = monitorFrame();
  const screen = monitor.centre;
  const screenSpan = MONITOR.screen.width + MONITOR.bezel * 2;
  const panelRight = { sx: 0.54, sy: 0.34 };
  const panelBelow = { sx: 0.06, sy: 0.6 };
  const panel = portrait ? panelBelow : panelRight;
  const subjectX = portrait ? 0.5 : 0.32;
  const subjectY = portrait ? 0.3 : 0.5;

  const heroDistance = portrait ? clamp(widthFit(screenSpan, 0.94, view), 1.2, 2.3) : HERO_EYE.distanceTo(screen);
  const hero: Framing = {
    eye: screen.clone().addScaledVector(monitor.normal, heroDistance),
    focus: screen,
    sx: portrait ? 0.5 : 0.42,
    sy: portrait ? 0.42 : 0.47
  };
  const aboutDistance = portrait ? heroDistance * 0.94 : clamp(widthFit(screenSpan, 0.7, view), 0.7, heroDistance - 0.25);
  const about: Framing = {
    eye: screen.clone().addScaledVector(monitor.normal, aboutDistance),
    focus: screen,
    sx: 0.5,
    sy: portrait ? 0.3 : 0.5
  };

  const alfaFocus = FIGURES.alfa.clone().add(new Vector3(0, FIGURE_HEIGHT.alfa * 0.5, 0));
  const company: Framing = {
    eye: eyeFor(alfaFocus, 0, -12, portrait ? 0.78 : 0.55),
    focus: alfaFocus,
    sx: subjectX,
    sy: subjectY,
    panel: { name: 'company', ...panel }
  };

  const products = PRODUCT_FIGURES.map<Framing>(id => {
    const focus = FIGURES[id].clone().add(new Vector3(0, FIGURE_HEIGHT[id] * 0.5, 0));
    return {
      eye: eyeFor(focus, 0, -14, portrait ? 0.46 : 0.35),
      focus,
      sx: subjectX,
      sy: subjectY,
      panel: { name: `product-${id}`, ...panel }
    };
  });

  const experience = EXPERIENCE_ORDER.map<Framing>(id => {
    if (id === 'tcs') {
      const focus = OPEN_FOLDER.centre.clone().add(new Vector3(0, 0.01, 0));
      return {
        eye: eyeFor(focus, -20, -22, portrait ? 1.05 : 0.85),
        focus,
        sx: portrait ? 0.5 : 0.36,
        sy: portrait ? 0.32 : 0.56,
        panel: { name: 'exp-tcs', ...panel }
      };
    }
    const focus = folderSpine(id);
    return {
      eye: eyeFor(focus, -34, 3, portrait ? 1.9 : 1.7),
      focus,
      sx: subjectX,
      sy: portrait ? 0.3 : 0.5,
      panel: { name: `exp-${id}`, ...panel }
    };
  });

  const phoneDistance = portrait ? clamp(widthFit(0.075, 0.9, view), 0.22, 0.5) : 0.45;
  const contact: Framing = {
    eye: phone.centre.clone().addScaledVector(phone.normal, phoneDistance),
    focus: phone.centre,
    sx: 0.5,
    sy: portrait ? 0.42 : 0.5
  };

  const back = hero.eye.clone().sub(screen).normalize();
  const outro: Framing = {
    eye: hero.eye.clone().addScaledVector(back, 0.2),
    focus: screen,
    sx: hero.sx,
    sy: hero.sy,
    panel: {
      name: 'outro',
      sx: portrait ? 0.08 : 0.07,
      sy: portrait ? 0.12 : 0.22,
      plane: new Plane(new Vector3(0, 0, 1), -(ROOM.back + 0.005))
    }
  };

  return { intro: [hero], hero: [hero], about: [about], company: [company], products, experience, contact: [contact], outro: [outro] };
}

/** Camera target that puts `framing.focus` at (sx, sy) on screen, with roll 0. */
export function toShot(framing: Framing, view: Viewport): Shot {
  const tan = Math.tan((view.fov * DEG) / 2);
  const aspect = view.width / view.height;
  const forward = framing.focus.clone().sub(framing.eye);
  const distance = forward.length();
  forward.normalize();
  const right = forward.clone().cross(new Vector3(0, 1, 0)).normalize();
  const up = right.clone().cross(forward).normalize();
  const dir = forward
    .clone()
    .addScaledVector(right, (0.5 - framing.sx) * 2 * aspect * tan)
    .addScaledVector(up, (framing.sy - 0.5) * 2 * tan)
    .normalize();
  return { position: framing.eye.clone(), target: framing.eye.clone().addScaledVector(dir, distance), fov: view.fov };
}

/** World point that projects to the panel position of a framing (at the subject's depth, or on its plane). */
export function panelAnchor(framing: Framing, view: Viewport): Vector3 | null {
  if (!framing.panel) return null;
  const shot = toShot(framing, view);
  const camera = new PerspectiveCamera(view.fov, view.width / view.height, 0.05, 60);
  camera.position.copy(shot.position);
  camera.lookAt(shot.target);
  camera.updateMatrixWorld();
  const point = new Vector3(framing.panel.sx * 2 - 1, 1 - framing.panel.sy * 2, 0.5).unproject(camera);
  const ray = new Ray(shot.position.clone(), point.sub(shot.position).normalize());
  if (framing.panel.plane) {
    const hit = ray.intersectPlane(framing.panel.plane, new Vector3());
    if (hit) return hit;
  }
  const forward = shot.target.clone().sub(shot.position).normalize();
  const depth = framing.focus.clone().sub(shot.position).dot(forward);
  return ray.at(depth / Math.max(ray.direction.dot(forward), 0.2), new Vector3());
}

export interface ShotCheck {
  from: string;
  to: string;
  yaw: number;
  pitch: number;
  distance: number;
  ok: boolean;
}

function angles(shot: Shot): { heading: number; pitch: number } {
  const d = shot.target.clone().sub(shot.position).normalize();
  return { heading: Math.atan2(d.x, -d.z) / DEG, pitch: Math.asin(d.y) / DEG };
}

/** Yaw / pitch / distance between consecutive shots against the anti-motion-sickness limits. */
export function checkShots(view: Viewport, phone: SurfaceFrame): ShotCheck[] {
  const all = framings(view, phone);
  const order: Array<[string, Framing]> = [];
  for (const chapter of ['hero', 'about', 'company', 'products', 'experience', 'contact', 'outro'] as const) {
    all[chapter].forEach((framing, index) => order.push([all[chapter].length > 1 ? `${chapter}:${index}` : chapter, framing]));
  }
  const result: ShotCheck[] = [];
  for (let i = 1; i < order.length; i++) {
    const [fromName, fromFraming] = order[i - 1]!;
    const [toName, toFraming] = order[i]!;
    const a = toShot(fromFraming, view);
    const b = toShot(toFraming, view);
    const angleA = angles(a);
    const angleB = angles(b);
    const yaw = Math.abs(angleB.heading - angleA.heading);
    const pitch = Math.abs(angleB.pitch - angleA.pitch);
    const distance = a.position.distanceTo(b.position);
    result.push({ from: fromName, to: toName, yaw, pitch, distance, ok: yaw <= 45 && pitch <= 25 && distance <= 1.5 });
  }
  return result;
}
