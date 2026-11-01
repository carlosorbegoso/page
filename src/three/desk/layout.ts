import { Vector3 } from 'three';

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

export const GLASS_Z = ROOM.back - ROOM.wallThickness / 2;

export const BLIND = { z: GLASS_Z + 0.056, cassette: 0.07, cassetteDepth: 0.06 } as const;

export const HERO_EYE = new Vector3(-0.15, 1.22, 1.55);

const MONITOR_CENTRE = new Vector3(-0.15, 1.1, -0.12);
const toHero = HERO_EYE.clone().sub(MONITOR_CENTRE);

export const MONITOR = {
  centre: MONITOR_CENTRE,
  yaw: Math.atan2(toHero.x, toHero.z),
  tilt: -Math.atan2(toHero.y, Math.hypot(toHero.x, toHero.z)),
  screen: { width: 0.598, height: 0.336 },
  bezel: 0.006,
  depth: 0.018
} as const;

export const KEYBOARD = { x: -0.05, z: 0.16, trackpadX: 0.21 } as const;

export const LAMP = {
  base: new Vector3(0.6, DESK.top, -0.28),
  elbow: new Vector3(0.68, 1.16, -0.33),
  head: new Vector3(0.47, 1.28, -0.06),
  aim: new Vector3(0.44, DESK.top, -0.12)
} as const;

export const PLINTH = { centre: new Vector3(0.42, DESK.top, -0.13), width: 0.5, depth: 0.1, height: 0.03 } as const;

const plinthTop = PLINTH.centre.y + PLINTH.height;
const onPlinth = (x: number, z: number) => new Vector3(PLINTH.centre.x + x, plinthTop, PLINTH.centre.z + z);

export const FIGURES = {
  alfa: onPlinth(-0.03, -0.028),
  skymek: onPlinth(-0.19, 0.008),
  parati: onPlinth(0.19, -0.006),
  ventixs: onPlinth(0.035, 0.018)
} as const;

export const FIGURE_HEIGHT = { alfa: 0.133, skymek: 0.06, parati: 0.07, ventixs: 0.066 } as const;

export type FigureId = keyof typeof FIGURES;
export const PRODUCT_FIGURES = ['skymek', 'parati', 'ventixs'] as const;

export const PIKACHU = { base: new Vector3(-0.072, DESK.top + 0.01, -0.09), yaw: -0.2 } as const;

export const CHARIZARD = { base: new Vector3(-0.226, DESK.top + 0.01, -0.1), yaw: 0.22 } as const;

export const SUCCULENT = new Vector3(-0.335, DESK.top, -0.02);

export const OPEN_FOLDER = { centre: new Vector3(-0.46, DESK.top, 0.17), width: 0.42, depth: 0.29, yaw: 0.12 } as const;

export const PHONE = {
  base: new Vector3(0.52, DESK.top, 0.24),
  yaw: 0.26,
  lean: 0.28,
  size: { width: 0.071, height: 0.147, depth: 0.008 },
  screen: { width: 0.065, height: 0.14 }
} as const;

export const MUG = new Vector3(0.64, DESK.top, 0.17);

export const LAPTOP = {
  centre: new Vector3(-0.57, DESK.top, -0.1),
  yaw: 0.25,
  width: 0.304,
  depth: 0.212,
  base: 0.0155,
  lid: 0.006,
  screen: { width: 0.286, height: 0.179 },
  lean: 0.3
} as const;

export const SHELF = {
  x: ROOM.left,
  depth: 0.3,
  length: 0.7,
  z: -0.06,
  boards: [0.88, 1.24, 1.66] as const
} as const;

export const FOLDERS = ['sysarp', 'baufest', 'intercorp', 'tcs'] as const;
export type FolderId = (typeof FOLDERS)[number];

export const FOLDER = { height: 0.32, depth: 0.28, spine: 0.08, gap: 0.012 } as const;

export function folderCentre(id: FolderId): Vector3 {
  const index = FOLDERS.indexOf(id);
  const z = SHELF.z + 0.22 - index * (FOLDER.spine + FOLDER.gap);
  return new Vector3(SHELF.x + FOLDER.depth / 2 + 0.01, SHELF.boards[1] + 0.0125 + FOLDER.height / 2, z);
}

export function folderSpine(id: FolderId): Vector3 {
  return folderCentre(id).add(new Vector3(FOLDER.depth / 2, 0, 0));
}

export const PLANT = new Vector3(1.0, WINDOW.y - WINDOW.height / 2, -0.34);

export const TELESCOPE = { foot: new Vector3(1.22, 0, 0.5), headHeight: 1.08, aim: new Vector3(-0.1, 0.12, -1) } as const;

export const CHAIR = new Vector3(-0.7, 0, 1.1);
