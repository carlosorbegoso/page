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

export const SUB_SHOTS: Partial<Record<ChapterId, number>> = { about: 2, products: PRODUCT_FIGURES.length, experience: EXPERIENCE_ORDER.length };

/** `data-plate-anchor` names of the experience panels (content ids). */
const EXPERIENCE_ANCHOR: Record<(typeof EXPERIENCE_ORDER)[number], string> = {
  tcs: 'exp-tcs',
  intercorp: 'exp-intercorp-retail',
  baufest: 'exp-baufest',
  sysarp: 'exp-sysarp'
};

/** Director limits between consecutive shots (src/three/director.ts: 1.4 s at 20°/s and 1 m/s). */
export const SHOT_LIMITS = { degrees: 28, metres: 1.4 } as const;

/** Anchor names for the 2D panels (`data-plate-anchor`). */
export const ANCHOR_NAMES = [
  'company',
  'product-skymek',
  'product-parati',
  'product-ventixs',
  'exp-tcs',
  'exp-intercorp-retail',
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

/** Below this viewport width the monitor head pivots to portrait so the screen content reads 1:1. */
export const PORTRAIT_MONITOR_BELOW = 768;

export function portraitMonitor(view: { width: number }): boolean {
  return view.width < PORTRAIT_MONITOR_BELOW;
}

/** World frame of the monitor glass (width/height as displayed; the plate stays upright). */
export function monitorFrame(portrait = false): SurfaceFrame {
  const quaternion = new Quaternion().setFromEuler(new Euler(MONITOR.tilt, MONITOR.yaw, 0, 'YXZ'));
  const normal = new Vector3(0, 0, 1).applyQuaternion(quaternion);
  const centre = MONITOR.centre.clone().addScaledVector(normal, MONITOR.depth / 2 + 0.0006);
  const { width, height } = MONITOR.screen;
  return { centre, normal, quaternion, width: portrait ? height : width, height: portrait ? width : height };
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

/** Distance at which an object of `size` metres spans `fraction` of the frame height. */
function heightFit(size: number, fraction: number, view: Viewport): number {
  return size / fraction / (2 * Math.tan((view.fov * DEG) / 2));
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Every chapter's framing for a viewport. Landscape follows desk.md §5 (subject on one half,
 * panel column on the other); portrait puts the subject in the top third and panels below.
 * Consecutive shots stay within the director's limits (`SHOT_LIMITS`): see `checkShots`.
 */
export function framings(view: Viewport, phone: SurfaceFrame): Record<ChapterId, Framing[]> {
  const portrait = view.width < view.height;
  const monitor = monitorFrame(portraitMonitor(view));
  const screen = monitor.centre;
  const screenSpan = monitor.width + MONITOR.bezel * 2;
  const screenRise = monitor.height + MONITOR.bezel * 2;
  /**
   * The director lays an anchored panel on the side of its anchor away from the frame centre:
   * an anchor right of centre gets the panel on its left. Subjects sit on the opposite side.
   */
  const textLeft = { panel: { sx: 0.56, sy: 0.3 }, subject: 0.7 };
  const panelBelow = { sx: 0.06, sy: 0.6 };
  const layoutFor = (side: typeof textLeft) => ({ panel: portrait ? panelBelow : side.panel, sx: portrait ? 0.5 : side.subject });
  const subjectY = portrait ? 0.3 : 0.5;

  const heroDistance = portrait
    ? clamp(widthFit(screenSpan, 0.62, view), 1.2, 2.3)
    : clamp(widthFit(screenSpan, 0.5, view), 1.05, HERO_EYE.distanceTo(screen));
  const hero: Framing = {
    eye: screen.clone().addScaledVector(monitor.normal, heroDistance),
    focus: screen,
    sx: portrait ? 0.5 : 0.42,
    sy: portrait ? 0.42 : 0.47
  };
  const aboutDistance = portrait
    ? clamp(Math.max(widthFit(screenSpan, 0.86, view), heightFit(screenRise, 0.86, view)), 0.7, heroDistance - 0.2) : clamp(widthFit(screenSpan, 0.7, view), 0.7, heroDistance - 0.25);
  const about: Framing = {
    eye: screen.clone().addScaledVector(monitor.normal, aboutDistance),
    focus: screen,
    sx: 0.5,
    sy: portrait ? 0.48 : 0.5
  };

  const alfaFocus = FIGURES.alfa.clone().add(new Vector3(0, FIGURE_HEIGHT.alfa * 0.5, 0));
  const companyLayout = layoutFor(textLeft);
  const company: Framing = {
    eye: eyeFor(alfaFocus, -4, -12, portrait ? 0.78 : 0.6),
    focus: alfaFocus,
    sx: companyLayout.sx,
    sy: subjectY,
    panel: { name: 'company', ...companyLayout.panel }
  };

  /**
   * Each product as a collectible on its plinth, right of its text. The camera looks along the
   * plinth at an angle so the neighbours recede in depth and the rack focus softens them.
   */
  const productSetup: Record<(typeof PRODUCT_FIGURES)[number], { side: typeof textLeft; heading: number; pitch: number; distance: number }> = {
    skymek: { side: textLeft, heading: 14, pitch: -10, distance: 0.44 },
    /** Steeper, so the mug in front of Parati drops below the frame. */
    parati: { side: textLeft, heading: -12, pitch: -17, distance: 0.42 },
    ventixs: { side: textLeft, heading: 6, pitch: -10, distance: 0.4 }
  };
  const products = PRODUCT_FIGURES.map<Framing>(id => {
    const focus = FIGURES[id].clone().add(new Vector3(0, FIGURE_HEIGHT[id] * 0.5, 0));
    const setup = productSetup[id];
    const layout = layoutFor(setup.side);
    return {
      eye: eyeFor(focus, portrait ? setup.heading * 0.5 : setup.heading, portrait ? -24 : setup.pitch, portrait ? 0.5 : setup.distance),
      focus,
      sx: layout.sx,
      sy: portrait ? subjectY : 0.56,
      panel: { name: `product-${id}`, ...layout.panel }
    };
  });
  const experienceLayout = layoutFor(textLeft);

  const experience = EXPERIENCE_ORDER.map<Framing>(id => {
    if (id === 'tcs') {
      const focus = OPEN_FOLDER.centre.clone().add(new Vector3(0, 0.01, 0));
      return {
        eye: eyeFor(focus, portrait ? -20 : -8, -18, portrait ? 1.05 : 0.85),
        focus,
        sx: experienceLayout.sx,
        sy: portrait ? 0.32 : 0.56,
        panel: { name: EXPERIENCE_ANCHOR.tcs, ...experienceLayout.panel }
      };
    }
    const focus = folderSpine(id);
    return {
      eye: eyeFor(focus, portrait ? -34 : -26, 0, portrait ? 1.24 : 1.18),
      focus,
      sx: experienceLayout.sx,
      sy: portrait ? 0.3 : 0.5,
      panel: { name: EXPERIENCE_ANCHOR[id], ...experienceLayout.panel }
    };
  });

  const phoneDistance = portrait ? clamp(widthFit(0.075, 0.9, view), 0.36, 0.5) : 0.42;
  const contact: Framing = {
    eye: phone.centre.clone().addScaledVector(phone.normal, phoneDistance),
    focus: phone.centre,
    sx: 0.5,
    sy: portrait ? 0.42 : 0.5
  };

  const back = hero.eye.clone().sub(screen).normalize();
  const outro: Framing = {
    eye: screen.clone().addScaledVector(back, Math.min(heroDistance + 0.2, 1.75)),
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

  return { intro: [hero], hero: [hero], about: [about, about], company: [company], products, experience, contact: [contact], outro: [outro] };
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
  /** Angle between the two view directions (what the director limits). */
  angle: number;
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
    const da = a.target.clone().sub(a.position).normalize();
    const db = b.target.clone().sub(b.position).normalize();
    const angle = Math.acos(Math.min(1, Math.max(-1, da.dot(db)))) / DEG;
    result.push({ from: fromName, to: toName, yaw, pitch, angle, distance, ok: angle <= SHOT_LIMITS.degrees && distance <= SHOT_LIMITS.metres });
  }
  return result;
}
