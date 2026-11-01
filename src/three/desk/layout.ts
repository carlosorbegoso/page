import { Vector3 } from 'three';

/**
 * World = room coordinates (1 u = 1 m, +Y up): origin on the floor under the centre of the desk
 * top, −Z towards the window wall, the left wall (shelves) at −X. Positions follow
 * `docs/design/desk.md` v2; deviations are listed in `docs/3d/desk.md`.
 */
export const ROOM = {
  left: -1.35,
  right: 1.95,
  back: -0.42,
  front: 3.4,
  height: 2.7,
  wallThickness: 0.14
} as const;

export const DESK = { width: 1.4, depth: 0.7, top: 0.74, thickness: 0.03, z: 0 } as const;

export const WINDOW = { x: 0.5, y: 1.5, width: 1.6, height: 1.1, frame: 0.04, mullion: 0.5 } as const;

/** Inner (room-side) plane of the glass. */
export const GLASS_Z = ROOM.back - ROOM.wallThickness / 2;

/** Reference eye of the `hero` shot (desk.md §5); the monitor is turned to face it exactly. */
export const HERO_EYE = new Vector3(-0.15, 1.22, 1.55);

const MONITOR_CENTRE = new Vector3(-0.15, 1.1, -0.12);
const toHero = HERO_EYE.clone().sub(MONITOR_CENTRE);

/** 27" 16:9 panel facing the hero eye, so `hero` and `about` see the screen frontally (1:1 CSS3D). */
export const MONITOR = {
  centre: MONITOR_CENTRE,
  yaw: Math.atan2(toHero.x, toHero.z),
  tilt: -Math.atan2(toHero.y, Math.hypot(toHero.x, toHero.z)),
  screen: { width: 0.598, height: 0.336 },
  bezel: 0.006,
  depth: 0.018
} as const;

export const KEYBOARD = { x: -0.05, z: 0.16, trackpadX: 0.21 } as const;

/**
 * The lamp sits at the back right so its cone covers the plinth (desk.md asks for both the lamp
 * "back left" and the plinth "right, under the lamp cone": the cone wins).
 */
export const LAMP = {
  base: new Vector3(0.6, DESK.top, -0.28),
  elbow: new Vector3(0.68, 1.16, -0.33),
  head: new Vector3(0.47, 1.28, -0.06),
  aim: new Vector3(0.44, DESK.top, -0.12)
} as const;

/**
 * Walnut plinth with a brass inlay. Wider than mascots.md's 24 cm (50 cm) so each product can be
 * framed in macro with its neighbours outside the frame (never behind the text).
 */
export const PLINTH = { centre: new Vector3(0.42, DESK.top, -0.13), width: 0.5, depth: 0.1, height: 0.03 } as const;

const plinthTop = PLINTH.centre.y + PLINTH.height;
const onPlinth = (x: number, z: number) => new Vector3(PLINTH.centre.x + x, plinthTop, PLINTH.centre.z + z);

/** Base centres of the collectibles: SkyMek and Parati at the ends, Alfa (tallest) at the back near the centre, Burbu in front right of it. */
export const FIGURES = {
  alfa: onPlinth(-0.03, -0.028),
  skymek: onPlinth(-0.19, 0.008),
  parati: onPlinth(0.19, -0.006),
  ventixs: onPlinth(0.035, 0.018)
} as const;

/** Approximate heights for framing (m). */
export const FIGURE_HEIGHT = { alfa: 0.133, skymek: 0.06, parati: 0.07, ventixs: 0.066 } as const;

export type FigureId = keyof typeof FIGURES;
export const PRODUCT_FIGURES = ['skymek', 'parati', 'ventixs'] as const;

/** Open TCS folder on the desk, left of the keyboard ("today's folder"). */
export const OPEN_FOLDER = { centre: new Vector3(-0.46, DESK.top, 0.17), width: 0.42, depth: 0.29, yaw: 0.12 } as const;

/** Phone on a small walnut stand, right of the keyboard; its glass is the `phone` surface. */
export const PHONE = {
  base: new Vector3(0.52, DESK.top, 0.24),
  /** Turned towards the room's left so the `contact` shot stays within the turn limit from the shelf. */
  yaw: 0.26,
  /** Angle of the glass from vertical (the shot looks down at it frontally). */
  lean: 0.28,
  size: { width: 0.071, height: 0.147, depth: 0.008 },
  screen: { width: 0.065, height: 0.14 }
} as const;

export const MUG = new Vector3(0.64, DESK.top, 0.17);

/**
 * Carlos works on a MacBook next to the external monitor: open on the left of the desk, turned
 * towards the chair, its lid leaning back past vertical like a real laptop in use.
 */
export const LAPTOP = {
  centre: new Vector3(-0.57, DESK.top, -0.1),
  yaw: 0.25,
  width: 0.304,
  depth: 0.212,
  base: 0.0155,
  lid: 0.006,
  screen: { width: 0.286, height: 0.179 },
  /** Lid lean back from vertical, radians. */
  lean: 0.3
} as const;

/** Floating shelves on the left wall; the middle one holds the four archive box files. */
export const SHELF = {
  x: ROOM.left,
  depth: 0.3,
  length: 0.7,
  z: -0.06,
  boards: [0.88, 1.24, 1.66] as const
} as const;

export const FOLDERS = ['sysarp', 'baufest', 'intercorp', 'tcs'] as const;
export type FolderId = (typeof FOLDERS)[number];

/** Archive box files 32 × 28 × 8 cm, spines facing the room, left → right as seen from the room. */
export const FOLDER = { height: 0.32, depth: 0.28, spine: 0.08, gap: 0.012 } as const;

export function folderCentre(id: FolderId): Vector3 {
  const index = FOLDERS.indexOf(id);
  const z = SHELF.z + 0.22 - index * (FOLDER.spine + FOLDER.gap);
  return new Vector3(SHELF.x + FOLDER.depth / 2 + 0.01, SHELF.boards[1] + 0.0125 + FOLDER.height / 2, z);
}

/** Spine face centre (what the camera reads). */
export function folderSpine(id: FolderId): Vector3 {
  return folderCentre(id).add(new Vector3(FOLDER.depth / 2, 0, 0));
}

export const PLANT = new Vector3(1.0, WINDOW.y - WINDOW.height / 2, -0.34);

export const TELESCOPE = { foot: new Vector3(1.22, 0, 0.5), headHeight: 1.08, aim: new Vector3(-0.1, 0.12, -1) } as const;

export const CHAIR = new Vector3(-0.7, 0, 1.1);
