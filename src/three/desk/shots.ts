import { Euler, Matrix4, PerspectiveCamera, Plane, Quaternion, Ray, Vector3 } from 'three';
import { CHAPTERS, type ChapterId, type Shot } from '../contracts';
import { layoutKind, stackedLayout } from '../scenes/common';
import {
  FIGURE_HEIGHT,
  FIGURES,
  FOLDER,
  FOLDERS,
  HERO_EYE,
  LAPTOP,
  MONITOR,
  OPEN_FOLDER,
  PHONE,
  PRODUCT_FIGURES,
  ROOM,
  folderCentre,
  folderSpine,
  type FigureId,
  type FolderId
} from './layout';

const DEG = Math.PI / 180;

/** Folders inside `experience` in story order (chronological, docs/PLAN-historia.md). Sub 0 is the whole shelf. */
export const EXPERIENCE_ORDER = ['sysarp', 'baufest', 'intercorp', 'tcs'] as const satisfies readonly FolderId[];

/** Folder a sub-shot of `experience` lands on; the opening shelf shot has none. */
export function experienceFolder(subIndex: number): FolderId | null {
  return subIndex < 1 ? null : EXPERIENCE_ORDER[Math.min(subIndex - 1, EXPERIENCE_ORDER.length - 1)]!;
}

export const SUB_SHOTS: Partial<Record<ChapterId, number>> = { about: 2, products: PRODUCT_FIGURES.length, experience: EXPERIENCE_ORDER.length + 1 };

/** `data-plate-anchor` names of the experience panels (content ids). */
const EXPERIENCE_ANCHOR: Record<(typeof EXPERIENCE_ORDER)[number], string> = {
  sysarp: 'exp-sysarp',
  baufest: 'exp-baufest',
  intercorp: 'exp-intercorp-retail',
  tcs: 'exp-tcs'
};

/** Director limits between consecutive shots (src/three/director.ts: 1.4 s at 20°/s and 1 m/s). */
export const SHOT_LIMITS = { degrees: 28, metres: 1.4 } as const;

/** Anchor names for the 2D panels (`data-plate-anchor`). */
export const ANCHOR_NAMES = [
  'company',
  'product-skymek',
  'product-parati',
  'product-ventixs',
  'exp-intro',
  'exp-tcs',
  'exp-intercorp-retail',
  'exp-baufest',
  'exp-sysarp',
  'outro',
  'hero',
  'about-bio',
  'about-stack'
] as const;

export interface Viewport {
  width: number;
  height: number;
  /** Device FOV from the director (30 desktop, 40 below 1024 px, wider on stacked phones). */
  fov: number;
}

/** A framed shot: eye, subject and where the subject lands on screen. */
export interface Framing {
  eye: Vector3;
  /** Subject in sharp focus (depth of field). */
  focus: Vector3;
  /** Point placed at (sx, sy) when it differs from `focus` (the centre of a group framed whole). */
  aim?: Vector3;
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
  const { width, height } = MONITOR.screen;
  return { centre, normal, quaternion, width, height };
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

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * How portrait the viewport is: 0 from a square frame up (landscape values verbatim, so desktop
 * keeps its shots), 1 from a 0.6 phone down, eased in between so tablets get one blended shot.
 */
export function portraitBlend(view: Viewport): number {
  const x = clamp((1 - view.width / view.height) / 0.4, 0, 1);
  return x * x * (3 - 2 * x);
}

/** Camera pose of a shot around its subject; portrait distances are for a 40° lens. */
interface Setup {
  heading: number;
  pitch: number;
  distance: number;
}

/** Screen area (fractions) that every protagonist point must stay inside. */
interface Region {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

/** HUD bar (clock, tour button) across the top of the frame, in CSS px. */
const HUD_HEIGHT = 72;
/** Footprints of the collectibles (pick proxies, SkyMek's wrench spans more), lifted while focused. */
const FIGURE_BOX: Record<FigureId, [number, number, number]> = {
  alfa: [0.08, 0.133, 0.07],
  skymek: [0.13, 0.08, 0.08],
  parati: [0.08, 0.08, 0.07],
  ventixs: [0.08, 0.08, 0.07]
};
const FIGURE_LIFT = 0.012;
/** Hover / current pull of a shelf box along +X (DeskSet `FOLDER_PULL`). */
const FOLDER_PULL = 0.03;

function boxCorners(min: Vector3, max: Vector3): Vector3[] {
  const corners: Vector3[] = [];
  for (const x of [min.x, max.x]) for (const y of [min.y, max.y]) for (const z of [min.z, max.z]) corners.push(new Vector3(x, y, z));
  return corners;
}

function figurePoints(id: FigureId): Vector3[] {
  const [width, height, depth] = FIGURE_BOX[id];
  const base = FIGURES[id];
  return boxCorners(
    new Vector3(base.x - width / 2, base.y, base.z - depth / 2),
    new Vector3(base.x + width / 2, base.y + Math.max(height, FIGURE_HEIGHT[id]) + FIGURE_LIFT, base.z + depth / 2)
  );
}

function folderPoints(id: FolderId, pull: number): Vector3[] {
  const centre = folderCentre(id);
  return boxCorners(
    new Vector3(centre.x - FOLDER.depth / 2, centre.y - FOLDER.height / 2, centre.z - FOLDER.spine / 2),
    new Vector3(centre.x + FOLDER.depth / 2 + pull, centre.y + FOLDER.height / 2, centre.z + FOLDER.spine / 2)
  );
}

/** The archive cover sheet on the first box's outer face (spines.ts), slid out with its box. */
function coverPoints(pull: number): Vector3[] {
  const first = folderCentre(FOLDERS[0]);
  const z = first.z + FOLDER.spine / 2;
  const halfWidth = (FOLDER.depth * 0.72) / 2;
  const halfHeight = (FOLDER.height * 0.72) / 2;
  return boxCorners(new Vector3(first.x - halfWidth, first.y + 0.005 - halfHeight, z), new Vector3(first.x + halfWidth + pull, first.y + 0.005 + halfHeight, z));
}

function openFolderPoints(): Vector3[] {
  const { centre, width, depth, yaw } = OPEN_FOLDER;
  const across = new Vector3(Math.cos(yaw), 0, -Math.sin(yaw)).multiplyScalar(width / 2);
  const along = new Vector3(Math.sin(yaw), 0, Math.cos(yaw)).multiplyScalar(depth / 2);
  const corners: Vector3[] = [];
  for (const a of [-1, 1]) for (const b of [-1, 1]) for (const y of [0, 0.02]) corners.push(centre.clone().addScaledVector(across, a).addScaledVector(along, b).setY(centre.y + y));
  return corners;
}

function centreOf(points: Vector3[]): Vector3 {
  const min = points[0]!.clone();
  const max = points[0]!.clone();
  for (const point of points) {
    min.min(point);
    max.max(point);
  }
  return min.add(max).multiplyScalar(0.5);
}

/** Screen position (fractions, y down) of world points for a framing; null behind the camera. */
function projector(framing: Framing, view: Viewport): (point: Vector3) => { x: number; y: number } | null {
  const shot = toShot(framing, view);
  const camera = new PerspectiveCamera(view.fov, view.width / view.height, 0.02, 60);
  camera.position.copy(shot.position);
  camera.lookAt(shot.target);
  camera.updateMatrixWorld();
  const projected = new Vector3();
  return point => {
    projected.copy(point).project(camera);
    return projected.z < 1 ? { x: (projected.x + 1) / 2, y: (1 - projected.y) / 2 } : null;
  };
}

function inside(at: { x: number; y: number } | null, region: Region): boolean {
  return !!at && at.x >= region.left && at.x <= region.right && at.y >= region.top && at.y <= region.bottom;
}

/** The frame grown by the depth-of-field halo: a neighbour outside it reads as fully out. */
const HALO: Region = { left: -0.04, right: 1.04, top: -0.04, bottom: 1.04 };
/** Breathing room around protagonists fitted to the stage, as a share of the tightest distance. */
const BREATH = 1.12;
/** A small change of a portrait shot that may swing a sliced neighbour wholly out of frame. */
interface Nudge {
  /** Degrees added to the heading. */
  turn: number;
  /** Degrees added to the pitch (negative looks further down). */
  tilt: number;
  /** Added to the subject's screen x. */
  shift: number;
  /** Dolly factor: in to the tightest fit to lose a neighbour at the edge, out so a tall one behind fits whole. */
  back: number;
}

/** Tried in order, gentlest first, before a sliced neighbour joins the subjects. */
const NUDGES: Nudge[] = [0, -6, -12].flatMap(tilt =>
  [1, 1 / BREATH, 1.15, 1.3, 1.5].flatMap(back =>
    [0, 0.05, -0.05, 0.1, -0.1].flatMap(shift => [0, 4, -4, 8, -8, 12, -12].map(turn => ({ turn, tilt, shift, back })))
  )
);

/** Foreground props that must not stand in front of the subjects: the phone on its stand. */
const OCCLUDERS: Vector3[][] = [
  boxCorners(new Vector3(PHONE.base.x - 0.05, PHONE.base.y, PHONE.base.z - 0.05), new Vector3(PHONE.base.x + 0.05, PHONE.base.y + 0.16, PHONE.base.z + 0.05))
];

interface ScreenBox {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

function screenBox(points: Array<{ x: number; y: number } | null>): ScreenBox | null {
  const seen = points.filter((point): point is { x: number; y: number } => !!point);
  if (!seen.length) return null;
  const xs = seen.map(point => point.x);
  const ys = seen.map(point => point.y);
  return { left: Math.min(...xs), right: Math.max(...xs), top: Math.min(...ys), bottom: Math.max(...ys) };
}

function overlaps(a: ScreenBox | null, b: ScreenBox | null): boolean {
  return !!a && !!b && a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
}

function fitsInside(framing: Framing, points: Vector3[], region: Region, view: Viewport): boolean {
  const project = projector(framing, view);
  return points.every(point => inside(project(point), region));
}

/** Shortest distance (from `nearest`) at which every point lands inside `region`. */
function fitDistance(aim: Vector3, setup: Omit<Setup, 'distance'>, place: { sx: number; sy: number }, points: Vector3[], region: Region, view: Viewport, nearest: number): number {
  const at = (distance: number): Framing => ({ eye: eyeFor(aim, setup.heading, setup.pitch, distance), focus: aim, ...place });
  if (fitsInside(at(nearest), points, region, view)) return nearest;
  let near = nearest;
  let far = nearest;
  while (far < 4) {
    far *= 1.25;
    if (fitsInside(at(far), points, region, view)) break;
    near = far;
  }
  for (let i = 0; i < 12; i++) {
    const mid = (near + far) / 2;
    if (fitsInside(at(mid), points, region, view)) far = mid;
    else near = mid;
  }
  return far;
}

let cached: { key: string; value: Record<ChapterId, Framing[]> } | null = null;

/**
 * Every chapter's framing for a viewport. Landscape follows desk.md §5 (subject on one half,
 * panel column on the other); portrait puts the subject in the top third and panels below.
 * Stacked phones (`stackedLayout`) frame the room in the top half and dock every panel at the
 * bottom, like subtitles. Each story shot has a landscape and a portrait setup blended by
 * `portraitBlend`; in portrait its protagonists are fitted whole between the HUD and the text.
 * Consecutive shots stay within `SHOT_LIMITS`: see `checkShots`.
 */
export function framings(view: Viewport, phone: SurfaceFrame): Record<ChapterId, Framing[]> {
  const key = `${view.width}x${view.height}@${view.fov}:${phone.centre.toArray().join()}:${phone.normal.toArray().join()}`;
  if (cached?.key !== key) cached = { key, value: computeFramings(view, phone) };
  return cached.value;
}

function computeFramings(view: Viewport, phone: SurfaceFrame): Record<ChapterId, Framing[]> {
  const portrait = view.width < view.height;
  const stacked = stackedLayout(view);
  const t = portraitBlend(view);
  /** Stacked phones use a wider lens; the close-ups dolly in by this factor so subjects keep their 40° size. */
  const lens = stacked ? Math.tan(20 * DEG) / Math.tan((view.fov * DEG) / 2) : 1;
  const monitor = monitorFrame();
  const screen = monitor.centre;
  const screenSpan = monitor.width + MONITOR.bezel * 2;
  const screenRise = monitor.height + MONITOR.bezel * 2;
  /**
   * The director lays an anchored panel on the side of its anchor away from the frame centre:
   * an anchor right of centre gets the panel on its left. Subjects sit on the opposite side.
   */
  const textLeft = { panel: { sx: 0.56, sy: 0.3 }, subject: 0.7 };
  /** Below the bottom edge minus the panel height, so the director docks the panel at the bottom. */
  const panelDocked = { sx: 0.5, sy: 0.95 };
  /** A portrait frame 1024 px or wider gets the desktop panel, centred on its anchor: lower it under the stage. */
  const panelBelow = stacked ? panelDocked : { sx: 0.06, sy: layoutKind(view.width) === 'desktop' ? 0.74 : 0.6 };
  const layoutFor = (side: typeof textLeft) => ({ panel: portrait ? panelBelow : side.panel, sx: portrait ? 0.5 : side.subject });
  const subjectY = stacked ? 0.27 : portrait ? 0.3 : 0.5;
  /** Distance at which `span` metres fill the half of the frame above the docked panel. */
  const topHalf = (span: number) => span / Math.tan((view.fov * DEG) / 2);
  /** Free frame above the text: under the HUD, over the docked panel (stacked) or the panel below. */
  const stage: Region = { left: 0.05, right: 0.95, top: HUD_HEIGHT / view.height, bottom: stacked ? 0.53 : 0.6 };
  const stageY = (stage.top + stage.bottom) / 2;
  /** A neighbour may sit anywhere clear of the edges and the HUD: it is soft and behind the subject. */
  const whole: Region = { left: 0.02, right: 0.98, top: stage.top, bottom: 1 };

  /**
   * A story shot: `landscape` verbatim on desktop, blended towards `portrait` by aspect, and in
   * portrait as close as `subjects` fit `stage` (with `BREATH`), aimed at their centre. A neighbour the edge
   * or the HUD would slice, and no nudge clears, joins the subjects (nearest first), so each one
   * ends up wholly in frame or wholly out.
   */
  const storyShot = (
    focus: Vector3,
    landscape: Setup,
    portraitSetup: Setup,
    place: { sx: number; sy: number },
    subjects: Vector3[],
    neighbours: Vector3[][] = []
  ): { eye: Vector3; aim?: Vector3; sx: number; sy: number } => {
    const heading = lerp(landscape.heading, portraitSetup.heading, t);
    const pitch = lerp(landscape.pitch, portraitSetup.pitch, t);
    const preferred = lerp(landscape.distance, portraitSetup.distance * lens, t);
    if (!portrait) return { eye: eyeFor(focus, heading, pitch, preferred), sx: place.sx, sy: place.sy };
    const sy = lerp(place.sy, stageY, t);
    const frame = (points: Vector3[], nudge: Nudge) => {
      const aim = focus.clone().lerp(centreOf(points), t);
      const setup = { heading: heading + nudge.turn, pitch: pitch + nudge.tilt };
      const sx = place.sx + nudge.shift;
      const tightest = fitDistance(aim, setup, { sx, sy }, points, stage, view, 0.1);
      const distance = Math.max(tightest, Math.max(tightest, Math.min(preferred, tightest * BREATH)) * nudge.back);
      const eye = eyeFor(aim, setup.heading, setup.pitch, distance);
      const project = projector({ eye, focus, aim, sx, sy }, view);
      const sliced = neighbours.filter(group => {
        if (points.includes(group[0]!)) return false;
        const at = group.map(project);
        return !at.every(point => !inside(point, HALO)) && !at.every(point => inside(point, whole));
      });
      const subjectBox = screenBox(points.map(project));
      const blocked = OCCLUDERS.some(
        group => centreOf(group).distanceTo(eye) < aim.distanceTo(eye) && overlaps(screenBox(group.map(project)), subjectBox)
      );
      return { shot: { eye, aim, sx, sy }, sliced, blocked };
    };
    const points = [...subjects];
    for (;;) {
      let nearest: Vector3[] | null = null;
      let unblockable: { eye: Vector3; aim: Vector3; sx: number; sy: number } | null = null;
      for (const nudge of NUDGES) {
        const { shot, sliced, blocked } = frame(points, nudge);
        if (!sliced.length && !blocked) return shot;
        if (!sliced.length) unblockable ??= shot;
        else nearest ??= sliced.reduce((best, group) => (centreOf(group).distanceTo(focus) < centreOf(best).distanceTo(focus) ? group : best));
      }
      if (unblockable || !nearest) return unblockable!;
      points.push(...nearest);
    }
  };
  const othersThan = (...ids: FigureId[]) => (Object.keys(FIGURES) as FigureId[]).filter(id => !ids.includes(id)).map(figurePoints);

  const heroDistance = lerp(
    clamp(widthFit(screenSpan, 0.5, view), 1.05, HERO_EYE.distanceTo(screen)),
    clamp(Math.max(widthFit(screenSpan, 0.8, view), heightFit(screenRise, 0.78, view)), 1.0, 2.3),
    t
  );
  const hero: Framing = {
    eye: screen.clone().addScaledVector(monitor.normal, heroDistance),
    focus: screen,
    sx: lerp(0.42, 0.5, t),
    sy: lerp(0.47, 0.5, t)
  };
  const aboutDistance = portrait
    ? clamp(Math.max(widthFit(screenSpan, 0.86, view), heightFit(screenRise, 0.86, view)), 0.7, heroDistance - 0.05)
    : clamp(widthFit(screenSpan, 0.7, view), 0.7, heroDistance - 0.25);
  const about: Framing = {
    eye: screen.clone().addScaledVector(monitor.normal, aboutDistance),
    focus: screen,
    sx: 0.5,
    sy: portrait ? 0.48 : 0.5
  };

  const alfaFocus = FIGURES.alfa.clone().add(new Vector3(0, FIGURE_HEIGHT.alfa * 0.5, 0));
  /** Portrait opens on the whole family on the plinth: the mother brand and its three products. */
  const companyLayout = layoutFor(textLeft);
  const companyPlace = { sx: companyLayout.sx, sy: subjectY };
  const company: Framing = {
    ...storyShot(
      alfaFocus,
      { heading: -4, pitch: -12, distance: 0.6 },
      { heading: -10, pitch: -16, distance: 0.78 },
      companyPlace,
      (Object.keys(FIGURES) as FigureId[]).flatMap(figurePoints)
    ),
    focus: alfaFocus,
    panel: { name: 'company', ...companyLayout.panel }
  };

  /**
   * Each product as a collectible on its plinth, right of its text. The camera looks along the
   * plinth at an angle so the neighbours recede in depth and the rack focus softens them.
   */
  const productSetup: Record<(typeof PRODUCT_FIGURES)[number], { landscape: Setup; portrait: Setup; subjects: FigureId[] }> = {
    skymek: { landscape: { heading: 14, pitch: -10, distance: 0.44 }, portrait: { heading: 7, pitch: -18, distance: 0.4 }, subjects: ['skymek'] },
    /** Steeper, so the mug in front of Parati drops below the frame. */
    parati: { landscape: { heading: -12, pitch: -17, distance: 0.42 }, portrait: { heading: -6, pitch: -18, distance: 0.4 }, subjects: ['parati'] },
    /** Alfa stands right behind Ventixs, so it can only be framed whole with it, never cleanly out. */
    ventixs: { landscape: { heading: 6, pitch: -10, distance: 0.4 }, portrait: { heading: 3, pitch: -12, distance: 0.4 }, subjects: ['ventixs', 'alfa'] }
  };
  const products = PRODUCT_FIGURES.map<Framing>(id => {
    const focus = FIGURES[id].clone().add(new Vector3(0, FIGURE_HEIGHT[id] * 0.5, 0));
    const setup = productSetup[id];
    const layout = layoutFor(textLeft);
    const place = { sx: layout.sx, sy: portrait ? subjectY : 0.56 };
    return {
      ...storyShot(focus, setup.landscape, setup.portrait, place, setup.subjects.flatMap(figurePoints), othersThan(...setup.subjects)),
      focus,
      panel: { name: `product-${id}`, ...layout.panel }
    };
  });
  const experienceLayout = layoutFor(textLeft);
  const experiencePlace = { sx: experienceLayout.sx, sy: portrait ? subjectY : 0.5 };

  /**
   * The whole shelf opens the day years. It also bridges the cut from the monitor: about → the first
   * folder alone turns about 35°, past SHOT_LIMITS; through the shelf each cut stays under 25°.
   */
  const shelfFocus = folderSpine('baufest').lerp(folderSpine('intercorp'), 0.5);
  const shelf: Framing = {
    ...storyShot(
      shelfFocus,
      { heading: -14, pitch: -4, distance: 1.6 },
      { heading: -20, pitch: -4, distance: 1.6 },
      experiencePlace,
      [...coverPoints(0), ...FOLDERS.flatMap(id => folderPoints(id, 0))]
    ),
    focus: shelfFocus,
    panel: { name: 'exp-intro', ...experienceLayout.panel }
  };

  /** Portrait keeps the archive cover sheet in frame with the current box, so it looks along the stack less steeply. */
  const folders = EXPERIENCE_ORDER.map<Framing>(id => {
    if (id === 'tcs') {
      const focus = OPEN_FOLDER.centre.clone().add(new Vector3(0, 0.01, 0));
      const place = { sx: experienceLayout.sx, sy: stacked ? subjectY : portrait ? 0.32 : 0.56 };
      return {
        ...storyShot(focus, { heading: -8, pitch: -18, distance: 0.85 }, { heading: -20, pitch: -18, distance: 1.05 }, place, openFolderPoints()),
        focus,
        panel: { name: EXPERIENCE_ANCHOR.tcs, ...experienceLayout.panel }
      };
    }
    const focus = folderSpine(id);
    return {
      ...storyShot(
        focus,
        { heading: -26, pitch: 0, distance: 1.18 },
        { heading: -22, pitch: -2, distance: 1.24 },
        experiencePlace,
        [...coverPoints(id === 'sysarp' ? FOLDER_PULL : 0), ...folderPoints(id, FOLDER_PULL)]
      ),
      focus,
      panel: { name: EXPERIENCE_ANCHOR[id], ...experienceLayout.panel }
    };
  });
  const experience = [shelf, ...folders];

  const phoneDistance = lerp(0.42, clamp(widthFit(0.075, 0.82, view), 0.28 * lens, 0.5 * lens), t);
  const contact: Framing = {
    eye: phone.centre.clone().addScaledVector(phone.normal, phoneDistance),
    focus: phone.centre,
    sx: 0.5,
    sy: portrait ? 0.48 : 0.5
  };

  const back = hero.eye.clone().sub(screen).normalize();
  const outro: Framing = {
    eye: screen.clone().addScaledVector(back, Math.min(heroDistance + 0.08, 1.75)),
    focus: screen,
    sx: hero.sx,
    sy: hero.sy,
    panel: {
      name: 'outro',
      sx: portrait ? 0.08 : 0.07,
      sy: portrait ? 0.12 : 0.26,
      plane: new Plane(new Vector3(0, 0, 1), -(ROOM.back + 0.005))
    }
  };

  const story = { company: [company], products, experience, contact: [contact] };
  if (stacked) {
    const shots = stackedMonitorShots(topHalf, panelDocked, subjectY);
    return { intro: [shots.hero], hero: [shots.hero], about: shots.about, outro: [shots.outro], ...story };
  }
  return { intro: [hero], hero: [hero], about: [about, about], outro: [outro], ...story };
}

/**
 * Monitor chapters on a stacked phone are establishing shots, not screen reads: the hero holds the
 * whole night desk (laptop, monitor, lamp, window), about pushes onto the monitor and then turns to
 * the laptop on the way to the shelf, and the outro pulls back up to the window.
 */
function stackedMonitorShots(
  topHalf: (span: number) => number,
  panel: { sx: number; sy: number },
  subjectY: number
): { hero: Framing; about: Framing[]; outro: Framing } {
  const room = MONITOR.centre.clone().add(new Vector3(0.12, 0.06, -0.04));
  const hero: Framing = {
    eye: eyeFor(room, 4, -7, topHalf(1.45)),
    focus: room,
    sx: 0.5,
    /** The opening caption is short, so the desk can sit lower and meet it. */
    sy: subjectY + 0.04,
    panel: { name: 'hero', ...panel }
  };
  const monitor = MONITOR.centre.clone().add(new Vector3(0.12, -0.02, 0));
  const bio: Framing = {
    eye: eyeFor(monitor, 8, -10, topHalf(0.85)),
    focus: monitor,
    sx: 0.5,
    sy: subjectY,
    panel: { name: 'about-bio', ...panel }
  };
  const laptop = LAPTOP.centre.clone().add(new Vector3(0.02, 0.1, 0));
  const stack: Framing = {
    eye: eyeFor(laptop, -14, -14, topHalf(0.5)),
    focus: laptop,
    sx: 0.5,
    sy: subjectY,
    panel: { name: 'about-stack', ...panel }
  };
  const sky = MONITOR.centre.clone().add(new Vector3(0.3, 0.22, -0.1));
  const outro: Framing = {
    eye: eyeFor(sky, 6, 2, topHalf(0.88)),
    focus: sky,
    sx: 0.5,
    sy: subjectY,
    panel: { name: 'outro', ...panel }
  };
  return { hero, about: [bio, stack], outro };
}

/** Camera target that puts `framing.aim` (else `focus`) at (sx, sy) on screen, with roll 0. */
export function toShot(framing: Framing, view: Viewport): Shot {
  const tan = Math.tan((view.fov * DEG) / 2);
  const aspect = view.width / view.height;
  const forward = (framing.aim ?? framing.focus).clone().sub(framing.eye);
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
  const depth = (framing.aim ?? framing.focus).clone().sub(shot.position).dot(forward);
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
  for (const chapter of CHAPTERS.filter(id => id !== 'intro')) {
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
