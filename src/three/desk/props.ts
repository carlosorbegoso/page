import {
  BoxGeometry,
  CircleGeometry,
  Color,
  CylinderGeometry,
  ExtrudeGeometry,
  LatheGeometry,
  Matrix4,
  Path,
  PlaneGeometry,
  Quaternion,
  Shape,
  ShapeGeometry,
  SphereGeometry,
  SplineCurve,
  TorusGeometry,
  Vector2,
  Vector3,
  type BufferGeometry
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { tokenColor, tokenNumber } from '../tokens';
import { doubleSided, OBJECT_ID, PartBuilder, type Finish } from './builder';
import {
  CHAIR,
  DESK,
  FIGURES,
  FOLDER,
  FOLDERS,
  GLASS_Z,
  KEYBOARD,
  LAMP,
  LAPTOP,
  MONITOR,
  MUG,
  OPEN_FOLDER,
  PHONE,
  PLANT,
  PLINTH,
  ROOM,
  SHELF,
  TELESCOPE,
  WINDOW,
  folderCentre,
  type FolderId
} from './layout';
import { SPINE_LABEL } from './spines';

/** Segment multiplier: 1 on `high`, lower on `mid`. */
export type Quality = number;

export interface Palette {
  wall: Finish;
  floor: Finish;
  wood: Finish;
  metal: Finish;
  fabric: Finish;
  ceramic: Finish;
  coffee: Finish;
  plant: Finish;
  pot: Finish;
  soil: Finish;
  paper: Finish;
  bookDark: Finish;
  bookBlue: Finish;
  brass: Finish;
  frame: Finish;
  bezel: Finish;
  keys: Finish;
  trackpad: Finish;
  shade: Finish;
  diffuser: Finish;
  telescope: Finish;
  telescopeBrass: Finish;
  lens: Finish;
  alfaBody: Finish;
  alfaVisor: Finish;
  alfaRing: Finish;
  alfaSignal: Finish;
  burbuBody: Finish;
  burbuDots: Finish;
  burbuBase: Finish;
  burbuSignal: Finish;
  giftBody: Finish;
  giftRibbon: Finish;
  giftSeam: Finish;
  giftTag: Finish;
  toolBody: Finish;
  toolBand: Finish;
  toolSignal: Finish;
  toolStand: Finish;
  folders: Record<FolderId, Finish>;
  label: Finish;
  phone: Finish;
}

/**
 * The wall and floor tokens describe how the surfaces should *look* at night; as albedos they
 * are near-black paint (< 1 % reflectance) and would render pure black, so they are lifted.
 */
const PERCEIVED_TO_ALBEDO = { wall: 3.5, floor: 2 } as const;

/** One finish family for the collectibles (matte ceramic, satin glaze, brass accents), so they read as a designed set. */
const COLLECTIBLE = { matte: 0.62, satin: 0.4 } as const;

/** Brand colour as a glaze: desaturated by `mute` (0–1) and scaled in value. */
function ceramic(color: Color, mute: number, value: number): Color {
  const hsl = { h: 0, s: 0, l: 0 };
  color.getHSL(hsl);
  return new Color().setHSL(hsl.h, hsl.s * (1 - mute), Math.min(hsl.l * value, 0.85));
}

/** Room finishes read from the design tokens (desk.md §2–3, mascots.md §2). */
export function readPalette(): Palette {
  const c = (token: string, fallback: string) => tokenColor(token, fallback);
  const brass: Finish = { color: c('--color-desk-brass', '#b08a4a'), roughness: 0.38, metalness: 1 };
  return {
    wall: { color: c('--color-desk-wall', '#121722').multiplyScalar(PERCEIVED_TO_ALBEDO.wall), roughness: 0.95, metalness: 0 },
    floor: { color: c('--color-desk-floor', '#17140f').multiplyScalar(PERCEIVED_TO_ALBEDO.floor), roughness: 0.7, metalness: 0, grain: 0.7 },
    wood: { color: c('--color-desk-wood', '#5a3e2b'), roughness: 0.72, metalness: 0, grain: 1 },
    metal: { color: c('--color-desk-metal', '#2b313c'), roughness: 0.35, metalness: 0.8 },
    fabric: { color: c('--color-desk-fabric', '#232a3a'), roughness: 0.9, metalness: 0 },
    ceramic: { color: c('--color-desk-ceramic', '#e6e0d4'), roughness: 0.7, metalness: 0 },
    coffee: { color: c('--color-desk-coffee', '#2a1a10'), roughness: 0.15, metalness: 0 },
    plant: { color: c('--color-desk-plant', '#2f5a44'), roughness: 0.45, metalness: 0 },
    pot: { color: c('--color-desk-pot', '#8c5a44'), roughness: 0.8, metalness: 0 },
    soil: { color: c('--color-desk-coffee', '#2a1a10').multiplyScalar(0.6), roughness: 1, metalness: 0 },
    paper: { color: c('--color-desk-paper', '#d8d2c4'), roughness: 0.9, metalness: 0 },
    bookDark: { color: c('--color-desk-fabric', '#232a3a'), roughness: 0.8, metalness: 0 },
    bookBlue: { color: c('--color-desk-metal', '#2b313c'), roughness: 0.8, metalness: 0 },
    brass: { color: c('--color-desk-brass', '#b08a4a'), roughness: 0.35, metalness: 1 },
    frame: { color: c('--color-window-frame', '#1a1f29'), roughness: 0.5, metalness: 0.6 },
    bezel: { color: c('--color-monitor-bezel', '#0c0f14'), roughness: 0.4, metalness: 0.3 },
    keys: { color: c('--color-monitor-bezel', '#0c0f14').multiplyScalar(1.6), roughness: 0.5, metalness: 0.2 },
    trackpad: { color: c('--color-desk-metal', '#2b313c'), roughness: 0.3, metalness: 0.6 },
    shade: { color: c('--color-lamp-shade', '#1d222b'), roughness: 0.6, metalness: 0.3 },
    diffuser: { color: c('--color-lamp', '#ffb566'), roughness: 0.5, metalness: 0, emissive: 2 },
    telescope: { color: c('--color-telescope', '#c9ced6'), roughness: 0.3, metalness: 0.1 },
    telescopeBrass: { color: c('--color-telescope-brass', '#b08a4a'), roughness: 0.35, metalness: 1 },
    lens: { color: new Color(0.01, 0.015, 0.03), roughness: 0.05, metalness: 0.4 },
    alfaBody: { color: c('--color-desk-ceramic', '#e6e0d4').lerp(new Color('#f4f7fb'), 0.6), roughness: 0.24, metalness: 0 },
    alfaVisor: { color: c('--color-alfa-body', '#10131a'), roughness: 0.1, metalness: 0.35 },
    alfaRing: brass,
    alfaSignal: { color: c('--color-alfa-signal', '#5aa9ff'), roughness: 0.3, metalness: 0, emissive: 1.4 * tokenNumber('--alfa-signal-intensity', 1) },
    burbuBody: { color: ceramic(c('--color-burbu-signal', '#3fcf8e'), 0.12, 0.92), roughness: 0.3, metalness: 0, emissive: 0.08 },
    burbuDots: { color: c('--color-desk-paper', '#d8d2c4').lerp(new Color('#ffffff'), 0.6), roughness: 0.3, metalness: 0, emissive: 0.18 },
    burbuBase: { color: c('--color-alfa-body', '#10131a').multiplyScalar(1.8), roughness: COLLECTIBLE.satin, metalness: 0.2 },
    burbuSignal: { color: c('--color-burbu-signal', '#3fcf8e'), roughness: 0.4, metalness: 0, emissive: 0.9 * tokenNumber('--burbu-signal-intensity', 0.8) },
    giftBody: { color: ceramic(c('--color-gift-ribbon', '#f28ba0'), 0.08, 0.95), roughness: 0.3, metalness: 0 },
    giftRibbon: { color: c('--color-desk-paper', '#d8d2c4').lerp(new Color('#fff8f2'), 0.55), roughness: 0.32, metalness: 0.05 },
    giftSeam: { color: c('--color-gift-ribbon', '#f28ba0'), roughness: 0.4, metalness: 0, emissive: 0.9 },
    giftTag: { color: c('--color-desk-paper', '#d8d2c4'), roughness: 0.85, metalness: 0 },
    toolBody: { color: new Color('#c9ccd1'), roughness: 0.24, metalness: 1 },
    toolBand: brass,
    toolStand: { color: c('--color-alfa-body', '#10131a').multiplyScalar(1.6), roughness: COLLECTIBLE.satin, metalness: 0 },
    toolSignal: { color: c('--color-tool-band', '#f0a43c'), roughness: 0.4, metalness: 0, emissive: 0.6 },
    folders: {
      sysarp: { color: c('--color-folder-sysarp', '#7e776a'), roughness: 0.85, metalness: 0 },
      baufest: { color: c('--color-folder-baufest', '#4a5847'), roughness: 0.85, metalness: 0 },
      intercorp: { color: c('--color-folder-intercorp', '#6b4a35'), roughness: 0.7, metalness: 0 },
      tcs: { color: c('--color-folder-tcs', '#33405a'), roughness: 0.85, metalness: 0 }
    },
    label: { color: c('--color-desk-paper', '#d8d2c4'), roughness: 0.9, metalness: 0 },
    phone: { color: c('--color-phone-body', '#15181e'), roughness: 0.45, metalness: 0.6 }
  };
}

const UP = new Vector3(0, 1, 0);

function seg(base: number, q: Quality, min = 3): number {
  return Math.max(min, Math.round(base * q));
}

function shade(finish: Finish, factor: number, warmth = 0): Finish {
  const color = finish.color.clone().multiplyScalar(factor);
  color.r *= 1 + warmth;
  color.b *= 1 - warmth;
  return { ...finish, color };
}

/** Matrix that places a +Y-aligned primitive centred between two points. */
function between(from: Vector3, to: Vector3): Matrix4 {
  const direction = to.clone().sub(from);
  const quaternion = new Quaternion().setFromUnitVectors(UP, direction.clone().normalize());
  return new Matrix4().compose(from.clone().add(to).multiplyScalar(0.5), quaternion, new Vector3(1, 1, 1));
}

function along(origin: Vector3, direction: Vector3, offset: number): Matrix4 {
  const quaternion = new Quaternion().setFromUnitVectors(UP, direction.clone().normalize());
  return new Matrix4().compose(origin.clone().addScaledVector(direction, offset), quaternion, new Vector3(1, 1, 1));
}

function rod(builder: PartBuilder, from: Vector3, to: Vector3, radius: number, finish: Finish, q: Quality, id = 0): void {
  builder.add(new CylinderGeometry(radius, radius, from.distanceTo(to), seg(10, q)), finish, between(from, to), id);
}

function seeded(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildRoom(b: PartBuilder, p: Palette): void {
  const t = ROOM.wallThickness;
  const random = seeded(7);
  const plank = 0.18;
  const length = ROOM.front - ROOM.back;
  for (let x = ROOM.left; x < ROOM.right - 0.01; x += plank) {
    const w = Math.min(plank, ROOM.right - x) - 0.003;
    const split = ROOM.back + length * (0.25 + random() * 0.5);
    for (const [z0, z1] of [
      [ROOM.back, split],
      [split, ROOM.front]
    ] as const) {
      const tone = shade(p.floor, 0.85 + random() * 0.3, (random() - 0.5) * 0.08);
      b.add(new BoxGeometry(w, 0.02, z1 - z0 - 0.003), tone, { position: [x + w / 2, -0.01, (z0 + z1) / 2] });
    }
  }

  const backZ = ROOM.back - t / 2;
  const left = WINDOW.x - WINDOW.width / 2;
  const right = WINDOW.x + WINDOW.width / 2;
  const bottom = WINDOW.y - WINDOW.height / 2;
  const top = WINDOW.y + WINDOW.height / 2;
  const span = ROOM.right - ROOM.left;
  b.add(new BoxGeometry(left - ROOM.left, ROOM.height, t), p.wall, { position: [(ROOM.left + left) / 2, ROOM.height / 2, backZ] });
  b.add(new BoxGeometry(ROOM.right - right, ROOM.height, t), p.wall, { position: [(right + ROOM.right) / 2, ROOM.height / 2, backZ] });
  b.add(new BoxGeometry(WINDOW.width, bottom, t), p.wall, { position: [WINDOW.x, bottom / 2, backZ] });
  b.add(new BoxGeometry(WINDOW.width, ROOM.height - top, t), p.wall, { position: [WINDOW.x, (top + ROOM.height) / 2, backZ] });
  b.add(new BoxGeometry(t, ROOM.height, length), p.wall, { position: [ROOM.left - t / 2, ROOM.height / 2, (ROOM.back + ROOM.front) / 2] });
  b.add(new BoxGeometry(t, ROOM.height, length), p.wall, { position: [ROOM.right + t / 2, ROOM.height / 2, (ROOM.back + ROOM.front) / 2] });
  b.add(new BoxGeometry(span + 2 * t, t, length), shade(p.wall, 0.8), { position: [(ROOM.left + ROOM.right) / 2, ROOM.height + t / 2, (ROOM.back + ROOM.front) / 2] });

  const skirting = shade(p.wall, 1.25);
  b.add(new BoxGeometry(span, 0.07, 0.012), skirting, { position: [(ROOM.left + ROOM.right) / 2, 0.035, ROOM.back + 0.006] });
  b.add(new BoxGeometry(0.012, 0.07, length), skirting, { position: [ROOM.left + 0.006, 0.035, (ROOM.back + ROOM.front) / 2] });
  b.add(new BoxGeometry(0.012, 0.07, length), skirting, { position: [ROOM.right - 0.006, 0.035, (ROOM.back + ROOM.front) / 2] });

  const f = WINDOW.frame;
  const depth = 0.06;
  b.add(new BoxGeometry(WINDOW.width + 0.12, 0.025, 0.16), shade(p.wall, 1.4), { position: [WINDOW.x, bottom - 0.0125, ROOM.back + 0.02] });
  b.add(new BoxGeometry(WINDOW.width, f, depth), p.frame, { position: [WINDOW.x, top - f / 2, GLASS_Z] });
  b.add(new BoxGeometry(WINDOW.width, f, depth), p.frame, { position: [WINDOW.x, bottom + f / 2, GLASS_Z] });
  b.add(new BoxGeometry(f, WINDOW.height, depth), p.frame, { position: [left + f / 2, WINDOW.y, GLASS_Z] });
  b.add(new BoxGeometry(f, WINDOW.height, depth), p.frame, { position: [right - f / 2, WINDOW.y, GLASS_Z] });
  b.add(new BoxGeometry(f * 0.8, WINDOW.height, depth * 0.9), p.frame, { position: [WINDOW.mullion, WINDOW.y, GLASS_Z] });
  b.add(new BoxGeometry(0.012, 0.11, 0.02), p.brass, { position: [WINDOW.mullion + 0.03, WINDOW.y - 0.05, GLASS_Z + 0.04] });
}

export function buildDesk(b: PartBuilder, p: Palette, q: Quality): void {
  const topY = DESK.top - DESK.thickness / 2;
  b.add(new RoundedBoxGeometry(DESK.width, DESK.thickness, DESK.depth, seg(3, q, 2), 0.008), p.wood, { position: [0, topY, DESK.z] });
  const legX = DESK.width / 2 - 0.07;
  const postZ = DESK.depth / 2 - 0.06;
  const legTop = DESK.top - DESK.thickness;
  for (const x of [-legX, legX]) {
    for (const z of [-postZ, postZ]) {
      b.add(new RoundedBoxGeometry(0.03, legTop - 0.02, 0.03, 1, 0.006), p.metal, { position: [x, (legTop + 0.02) / 2, z] });
    }
    b.add(new RoundedBoxGeometry(0.035, 0.02, postZ * 2 + 0.06, 1, 0.006), p.metal, { position: [x, 0.01, 0] });
    b.add(new RoundedBoxGeometry(0.03, 0.02, postZ * 2 + 0.03, 1, 0.006), p.metal, { position: [x, legTop - 0.01, 0] });
  }
  b.add(new RoundedBoxGeometry(legX * 2, 0.05, 0.02, 1, 0.005), p.metal, { position: [0, legTop - 0.04, -postZ] });
}

/** Monitor stand (static) and the keyboard group in front of it. */
export function buildWorkstation(b: PartBuilder, p: Palette, q: Quality): void {
  const { centre, yaw } = MONITOR;
  const back = new Vector3(Math.sin(yaw), 0, Math.cos(yaw)).multiplyScalar(-0.075);
  const baseCentre = new Vector3(centre.x, DESK.top + 0.005, centre.z).add(back.clone().multiplyScalar(0.3));
  b.add(new RoundedBoxGeometry(0.25, 0.01, 0.18, 2, 0.0045), p.metal, { position: baseCentre.toArray(), rotation: [0, yaw, 0] });
  const columnBase = new Vector3(centre.x, DESK.top + 0.01, centre.z).add(back);
  b.add(new RoundedBoxGeometry(0.052, centre.y - DESK.top + 0.04, 0.022, 2, 0.008), p.metal, {
    position: [columnBase.x, (DESK.top + centre.y + 0.04) / 2, columnBase.z],
    rotation: [0, yaw, 0]
  });

  const keyboard = new Vector3(KEYBOARD.x, DESK.top, KEYBOARD.z);
  const kb = new Matrix4().compose(keyboard, new Quaternion(), new Vector3(1, 1, 1));
  b.add(new RoundedBoxGeometry(0.37, 0.009, 0.125, 2, 0.004), p.bezel, new Matrix4().multiplyMatrices(kb, new Matrix4().makeTranslation(0, 0.0045, 0)));
  const keyW = 0.0205;
  const pitch = 0.0242;
  const rows = 5;
  const cols = 14;
  for (let r = 0; r < rows; r++) {
    for (let col = 0; col < cols; col++) {
      if (r === rows - 1 && col > 3 && col < 10) continue;
      const x = (col - (cols - 1) / 2) * pitch;
      const z = (r - (rows - 1) / 2) * pitch;
      b.add(new BoxGeometry(keyW, 0.004, keyW * 0.92), p.keys, new Matrix4().multiplyMatrices(kb, new Matrix4().makeTranslation(x, 0.011, z)));
    }
  }
  b.add(new BoxGeometry(pitch * 6 - 0.004, 0.004, keyW * 0.92), p.keys, new Matrix4().multiplyMatrices(kb, new Matrix4().makeTranslation(0, 0.011, 2 * pitch)));
  b.add(new RoundedBoxGeometry(0.13, 0.005, 0.105, 2, 0.003), p.trackpad, { position: [KEYBOARD.trackpadX, DESK.top + 0.0025, KEYBOARD.z] });

  const profile = [
    [0.0, 0.0],
    [0.037, 0.0],
    [0.042, 0.004],
    [0.0425, 0.09],
    [0.041, 0.095],
    [0.038, 0.095],
    [0.0375, 0.012],
    [0.0, 0.012]
  ].map(([x, y]) => new Vector2(x!, y!));
  b.add(new LatheGeometry(profile, seg(32, q, 12)), p.ceramic, { position: MUG.toArray() });
  b.add(new CircleGeometry(0.0376, seg(28, q, 10)), p.coffee, { position: [MUG.x, MUG.y + 0.076, MUG.z], rotation: [-Math.PI / 2, 0, 0] });
  b.add(new TorusGeometry(0.025, 0.006, seg(8, q, 4), seg(16, q, 8), Math.PI), p.ceramic, {
    position: [MUG.x + 0.04, MUG.y + 0.048, MUG.z],
    rotation: [0, 0, -Math.PI / 2]
  });
}

/** Monitor head (bezel, housing, VESA plate) centred on the screen, facing +Z: a separate mesh that pivots to portrait. */
export function buildMonitorHead(b: PartBuilder, p: Palette, q: Quality): void {
  const { width, height } = MONITOR.screen;
  const e = MONITOR.bezel;
  b.add(new RoundedBoxGeometry(width + 2 * e, height + 2 * e, MONITOR.depth, seg(2, q, 1), 0.003), p.bezel);
  b.add(new RoundedBoxGeometry(width * 0.72, height * 0.75, 0.03, seg(3, q, 2), 0.012), p.bezel, { position: [0, 0, -MONITOR.depth / 2 - 0.012] });
  b.add(new RoundedBoxGeometry(0.11, 0.11, 0.012, 1, 0.004), p.metal, { position: [0, 0, -MONITOR.depth / 2 - 0.032] });
}

function laptopFrame(): Matrix4 {
  return new Matrix4().compose(LAPTOP.centre, new Quaternion().setFromAxisAngle(UP, LAPTOP.yaw), new Vector3(1, 1, 1));
}

function laptopHinge(): Matrix4 {
  const hinge = new Matrix4().compose(
    new Vector3(0, LAPTOP.base, -LAPTOP.depth / 2 + 0.004),
    new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), -LAPTOP.lean),
    new Vector3(1, 1, 1)
  );
  return laptopFrame().multiply(hinge);
}

/** World frame of the laptop glass (centre, orientation, size), facing the user. */
export function laptopScreenFrame(): { centre: Vector3; quaternion: Quaternion } {
  const lidHeight = LAPTOP.depth - 0.004;
  const matrix = laptopHinge().multiply(new Matrix4().makeTranslation(0, lidHeight / 2, LAPTOP.lid / 2 + 0.0008));
  const centre = new Vector3();
  const quaternion = new Quaternion();
  matrix.decompose(centre, quaternion, new Vector3());
  return { centre, quaternion };
}

/** MacBook-like laptop in space grey: base, hinge and lid; the glass is a separate lit mesh. */
export function buildLaptop(b: PartBuilder, p: Palette): void {
  const frame = laptopFrame();
  const shell: Finish = { color: new Color('#5d626b'), roughness: 0.32, metalness: 0.9 };
  const at = (m: Matrix4) => new Matrix4().multiplyMatrices(frame, m);
  b.add(new RoundedBoxGeometry(LAPTOP.width, LAPTOP.base, LAPTOP.depth, 2, 0.004), shell, at(new Matrix4().makeTranslation(0, LAPTOP.base / 2, 0)));
  b.add(new BoxGeometry(LAPTOP.width * 0.86, 0.0006, LAPTOP.depth * 0.42), shade(p.bezel, 0.9), at(new Matrix4().makeTranslation(0, LAPTOP.base + 0.0003, -LAPTOP.depth * 0.12)));
  b.add(new BoxGeometry(LAPTOP.width * 0.36, 0.0005, LAPTOP.depth * 0.3), shade(shell, 0.85), at(new Matrix4().makeTranslation(0, LAPTOP.base + 0.0003, LAPTOP.depth * 0.3)));
  const lidHeight = LAPTOP.depth - 0.004;
  const hinge = laptopHinge();
  b.add(new RoundedBoxGeometry(LAPTOP.width, lidHeight, LAPTOP.lid, 2, 0.003), shell, new Matrix4().multiplyMatrices(hinge, new Matrix4().makeTranslation(0, lidHeight / 2, 0)));
  b.add(new BoxGeometry(LAPTOP.width - 0.008, lidHeight - 0.008, 0.0008), p.bezel, new Matrix4().multiplyMatrices(hinge, new Matrix4().makeTranslation(0, lidHeight / 2, LAPTOP.lid / 2 + 0.0002)));
}

/** Open TCS folder (linen boards, a few sheets) left of the keyboard. */
export function buildOpenFolder(b: PartBuilder, p: Palette): void {
  const { centre, width, depth, yaw } = OPEN_FOLDER;
  const frame = new Matrix4().compose(centre, new Quaternion().setFromAxisAngle(UP, yaw), new Vector3(1, 1, 1));
  const at = (x: number, y: number, z: number, rz = 0) =>
    new Matrix4().multiplyMatrices(frame, new Matrix4().compose(new Vector3(x, y, z), new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), rz), new Vector3(1, 1, 1)));
  const half = width / 2;
  const id = OBJECT_ID.openFolder;
  b.add(new RoundedBoxGeometry(half - 0.004, 0.004, depth, 1, 0.0015), p.folders.tcs, at(-half / 2, 0.002, 0, 0.02), OBJECT_ID.openFolderCover);
  b.add(new RoundedBoxGeometry(half - 0.004, 0.004, depth, 1, 0.0015), p.folders.tcs, at(half / 2, 0.002, 0, -0.02), id);
  b.add(new BoxGeometry(0.012, 0.006, depth), shade(p.folders.tcs, 0.7), at(0, 0.003, 0), id);
  b.add(new BoxGeometry(half - 0.03, 0.002, depth - 0.03), p.paper, at(half / 2, 0.006, 0, -0.02), id);
  b.add(new BoxGeometry(half - 0.034, 0.002, depth - 0.036), shade(p.paper, 0.93), at(half / 2 + 0.004, 0.0075, 0.004, -0.02), id);
  for (let line = 0; line < 7; line++) {
    b.add(new BoxGeometry(0.11 + (line % 3) * 0.02, 0.0004, 0.004), shade(p.bookDark, 0.8), at(half / 2 - 0.02, 0.0086, -0.09 + line * 0.022), id);
  }
  b.add(new BoxGeometry(half - 0.04, 0.002, depth - 0.04), shade(p.paper, 0.85), at(-half / 2, 0.005, 0, 0.02), OBJECT_ID.openFolderCover);
}

/** Phone on a small walnut stand; the glass itself is a separate mesh (the `phone` surface). */
export function buildPhone(b: PartBuilder, p: Palette): Matrix4 {
  const { base, yaw, lean, size } = PHONE;
  const stand = new Matrix4().compose(base, new Quaternion().setFromAxisAngle(UP, yaw), new Vector3(1, 1, 1));
  const at = (m: Matrix4) => new Matrix4().multiplyMatrices(stand, m);
  b.add(new RoundedBoxGeometry(0.085, 0.014, 0.07, 2, 0.003), p.wood, at(new Matrix4().makeTranslation(0, 0.007, 0)));
  b.add(new BoxGeometry(0.075, 0.012, 0.008), p.wood, at(new Matrix4().makeTranslation(0, 0.02, 0.024)));
  const body = at(
    new Matrix4().compose(
      new Vector3(0, 0.014 + (size.height / 2) * Math.cos(lean), 0.02 - (size.height / 2) * Math.sin(lean)),
      new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), -lean),
      new Vector3(1, 1, 1)
    )
  );
  b.add(new RoundedBoxGeometry(size.width, size.height, size.depth, 2, 0.003), p.phone, new Matrix4().multiplyMatrices(body, new Matrix4().makeTranslation(0, 0, -size.depth / 2)), OBJECT_ID.phone);
  return new Matrix4().multiplyMatrices(body, new Matrix4().makeTranslation(0, 0, 0.0004));
}

export function buildLamp(b: PartBuilder, p: Palette, q: Quality): void {
  const base = LAMP.base;
  b.add(new CylinderGeometry(0.07, 0.075, 0.018, seg(32, q, 12)), p.metal, { position: [base.x, base.y + 0.009, base.z] });
  b.add(new CylinderGeometry(0.012, 0.012, 0.03, seg(12, q)), p.metal, { position: [base.x, base.y + 0.03, base.z] });
  const shoulder = base.clone().add(new Vector3(0, 0.045, 0));
  rod(b, shoulder, LAMP.elbow, 0.0055, p.metal, q);
  rod(b, shoulder.clone().add(new Vector3(0.012, 0, 0.006)), LAMP.elbow.clone().add(new Vector3(0.012, 0, 0.006)), 0.0025, p.metal, q);
  b.add(new SphereGeometry(0.012, seg(12, q), seg(8, q)), p.metal, { position: LAMP.elbow.toArray() });
  rod(b, LAMP.elbow, LAMP.head, 0.005, p.metal, q);
  const aim = LAMP.aim.clone().sub(LAMP.head).normalize();
  b.add(new SphereGeometry(0.01, seg(10, q), seg(8, q)), p.metal, { position: LAMP.head.toArray() });
  const shadeLength = 0.13;
  b.add(doubleSided(new CylinderGeometry(0.075, 0.028, shadeLength, seg(32, q, 12), 1, true)), p.shade, along(LAMP.head, aim, shadeLength / 2 - 0.02));
  b.add(new CylinderGeometry(0.03, 0.03, 0.012, seg(20, q, 8)), p.shade, along(LAMP.head, aim, -0.026));
  const mouth = new Matrix4().multiplyMatrices(along(LAMP.head, aim, shadeLength - 0.035), new Matrix4().makeRotationX(Math.PI / 2));
  b.add(new CircleGeometry(0.066, seg(28, q, 10)), p.diffuser, mouth);
}

/** A curved, folded leaf blade (pointing +Y in its own frame). */
function leaf(length: number, width: number, curl: number, q: Quality): BufferGeometry {
  const shape = new Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(width * 0.65, length * 0.18, width * 0.55, length * 0.75, 0, length);
  shape.bezierCurveTo(-width * 0.55, length * 0.75, -width * 0.65, length * 0.18, 0, 0);
  const geometry = new ShapeGeometry(shape, seg(8, q, 4));
  const position = geometry.getAttribute('position');
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const y = position.getY(i);
    const v = y / length;
    position.setZ(i, -curl * v * v * length + Math.abs(x) * 0.35);
  }
  geometry.deleteAttribute('uv');
  geometry.computeVertexNormals();
  return doubleSided(geometry);
}

export function buildPlant(b: PartBuilder, p: Palette, q: Quality): void {
  const pot = PLANT.clone();
  const profile = [
    [0, 0],
    [0.045, 0],
    [0.048, 0.005],
    [0.058, 0.11],
    [0.061, 0.114],
    [0.061, 0.12],
    [0.054, 0.12],
    [0.052, 0.106],
    [0, 0.106]
  ].map(([x, y]) => new Vector2(x!, y!));
  b.add(new LatheGeometry(profile, seg(28, q, 10)), p.pot, { position: pot.toArray() });
  b.add(new CircleGeometry(0.052, seg(20, q, 8)), p.soil, { position: [pot.x, pot.y + 0.108, pot.z], rotation: [-Math.PI / 2, 0, 0] });
  const random = seeded(11);
  const leaves = Math.round(6 + 2 * q);
  for (let i = 0; i < leaves; i++) {
    const angle = (i / leaves) * Math.PI * 2 + random() * 0.5;
    const height = 0.1 + random() * 0.16;
    const lean = 0.25 + random() * 0.3;
    const stemBase = pot.clone().add(new Vector3(Math.cos(angle) * 0.012, 0.106, Math.sin(angle) * 0.012));
    const outward = new Vector3(Math.cos(angle), 0, Math.sin(angle));
    const stemTop = stemBase.clone().add(new Vector3(0, height, 0)).addScaledVector(outward, height * lean);
    rod(b, stemBase, stemTop, 0.002, shade(p.plant, 0.8), q * 0.5);
    const length = 0.1 + random() * 0.07;
    const tip = outward.clone().multiplyScalar(0.8).add(new Vector3(0, 0.35 + random() * 0.4, 0)).normalize();
    const blade = new Quaternion().setFromUnitVectors(UP, tip);
    const twist = new Quaternion().setFromAxisAngle(tip, random() * 0.8 - 0.4);
    const facing = new Quaternion().setFromAxisAngle(UP, -angle + Math.PI / 2);
    const rotation = twist.multiply(blade).multiply(facing);
    b.add(leaf(length, length * 0.55, 0.25 + random() * 0.2, q), shade(p.plant, 0.85 + random() * 0.3), new Matrix4().compose(stemTop, rotation, new Vector3(1, 1, 1)));
  }
}

/** Left-wall shelves: a box below, the four archive box files in the middle, books and brass on top. */
export function buildShelves(b: PartBuilder, p: Palette, q: Quality): void {
  const x = SHELF.x + SHELF.depth / 2;
  const z = SHELF.z;
  const [low, middle, top] = SHELF.boards;
  for (const y of SHELF.boards) {
    b.add(new RoundedBoxGeometry(SHELF.depth, 0.025, SHELF.length, 1, 0.004), p.wood, { position: [x, y, z] });
  }
  b.add(new RoundedBoxGeometry(0.22, 0.14, 0.26, 2, 0.01), p.fabric, { position: [x - 0.01, low + 0.0125 + 0.07, z - 0.18] });
  for (const id of FOLDERS) {
    const centre = folderCentre(id);
    const finish = p.folders[id];
    const objectId = OBJECT_ID[id];
    b.add(new RoundedBoxGeometry(FOLDER.depth, FOLDER.height, FOLDER.spine, 2, 0.004), finish, { position: centre.toArray() }, objectId);
    const spine = centre.x + FOLDER.depth / 2;
    b.add(new BoxGeometry(0.003, SPINE_LABEL.length + 0.01, SPINE_LABEL.width), p.label, { position: [spine + 0.0015, centre.y + SPINE_LABEL.lift, centre.z] }, objectId);
    b.add(new TorusGeometry(0.012, 0.0025, 6, seg(16, q, 8)), p.metal, { position: [spine + 0.002, centre.y - 0.07, centre.z], rotation: [0, Math.PI / 2, 0] }, objectId);
  }
  const random = seeded(23);
  const covers = [p.paper, p.bookDark, p.bookBlue, shade(p.pot, 0.55), shade(p.plant, 0.7)];
  let cursor = z - 0.32;
  for (let i = 0; i < 5; i++) {
    const thickness = 0.025 + random() * 0.02;
    const height = 0.18 + random() * 0.06;
    const depth = 0.16 + random() * 0.04;
    b.add(new RoundedBoxGeometry(depth, height, thickness, 1, 0.002), covers[i]!, {
      position: [x + 0.03, top + 0.0125 + height / 2, cursor + thickness / 2]
    });
    cursor += thickness + 0.002;
  }
  b.add(new CylinderGeometry(0.022, 0.03, 0.02, seg(20, q, 8)), p.brass, { position: [x, top + 0.0225, z + 0.2] });
  b.add(new SphereGeometry(0.04, seg(24, q, 10), seg(16, q, 8)), p.brass, { position: [x, top + 0.07, z + 0.2] });
  void middle;
}

export function buildChair(b: PartBuilder, p: Palette, q: Quality): void {
  const centre = CHAIR.clone();
  const yaw = 0.35;
  const frame = new Matrix4().compose(centre, new Quaternion().setFromAxisAngle(UP, yaw), new Vector3(1, 1, 1));
  const at = (x: number, y: number, z: number, rx = 0) =>
    new Matrix4().multiplyMatrices(frame, new Matrix4().compose(new Vector3(x, y, z), new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), rx), new Vector3(1, 1, 1)));
  b.add(new RoundedBoxGeometry(0.48, 0.07, 0.46, seg(3, q, 2), 0.03), p.fabric, at(0, 0.48, 0));
  b.add(new RoundedBoxGeometry(0.46, 0.5, 0.06, seg(3, q, 2), 0.028), p.fabric, at(0, 0.82, 0.23, -0.12));
  b.add(new RoundedBoxGeometry(0.05, 0.3, 0.02, 1, 0.008), p.metal, at(0, 0.55, 0.25, -0.12));
  b.add(new CylinderGeometry(0.022, 0.022, 0.3, seg(12, q)), p.metal, at(0, 0.3, 0));
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const tip = new Vector3(Math.cos(a) * 0.3, 0.05, Math.sin(a) * 0.3).applyMatrix4(frame);
    rod(b, new Vector3(0, 0.1, 0).applyMatrix4(frame), tip, 0.012, p.metal, q * 0.6);
    b.add(new SphereGeometry(0.022, seg(10, q), seg(6, q)), shade(p.metal, 0.6), { position: [tip.x, 0.022, tip.z] });
  }
}

/** Direction the telescope tube points to (room-local), set by the station from Alfa's position. */
/** Refractor on a tripod by the window, pointing at the city (pure set dressing). */
export function buildTelescope(b: PartBuilder, p: Palette, q: Quality): void {
  const foot = TELESCOPE.foot;
  const head = new Vector3(foot.x, TELESCOPE.headHeight, foot.z);
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + 0.4;
    const tip = new Vector3(foot.x + Math.cos(a) * 0.34, 0, foot.z + Math.sin(a) * 0.34);
    rod(b, head.clone().add(new Vector3(Math.cos(a) * 0.03, -0.02, Math.sin(a) * 0.03)), tip, 0.011, p.metal, q * 0.7);
    b.add(new SphereGeometry(0.014, seg(8, q), seg(6, q)), shade(p.metal, 0.5), { position: [tip.x, 0.012, tip.z] });
  }
  b.add(new CylinderGeometry(0.1, 0.1, 0.008, seg(24, q, 6)), p.metal, { position: [foot.x, 0.46, foot.z] });
  b.add(new CylinderGeometry(0.035, 0.04, 0.06, seg(16, q, 6)), p.metal, { position: head.toArray() });
  const pivot = head.clone().add(new Vector3(0, 0.06, 0));
  b.add(new RoundedBoxGeometry(0.06, 0.05, 0.07, 1, 0.006), p.metal, { position: pivot.toArray() });
  const dir = TELESCOPE.aim.clone().normalize();
  const tubeCentre = pivot.clone().add(new Vector3(0, 0.055, 0)).addScaledVector(dir, 0.08);
  const radial = seg(28, q, 10);
  b.add(new CylinderGeometry(0.045, 0.045, 0.7, radial), p.telescope, along(tubeCentre, dir, 0));
  b.add(new CylinderGeometry(0.053, 0.053, 0.17, radial, 1, true), p.telescope, along(tubeCentre, dir, 0.42));
  b.add(new CircleGeometry(0.05, radial), p.lens, new Matrix4().multiplyMatrices(along(tubeCentre, dir, 0.37), new Matrix4().makeRotationX(-Math.PI / 2)));
  for (const offset of [-0.1, 0.12]) b.add(new CylinderGeometry(0.05, 0.05, 0.022, radial), p.telescopeBrass, along(tubeCentre, dir, offset));
  b.add(new CylinderGeometry(0.024, 0.026, 0.09, seg(16, q, 6)), p.telescopeBrass, along(tubeCentre, dir, -0.39));
  const up = new Vector3(0, 1, 0).sub(dir.clone().multiplyScalar(dir.y)).normalize();
  const eyepiece = tubeCentre.clone().addScaledVector(dir, -0.44);
  rod(b, eyepiece, eyepiece.clone().addScaledVector(up, 0.06), 0.014, p.metal, q);
  const finder = tubeCentre.clone().addScaledVector(up, 0.07).addScaledVector(dir, -0.12);
  b.add(new CylinderGeometry(0.012, 0.012, 0.17, seg(12, q)), p.telescope, along(finder, dir, 0));
}

/**
 * Combination wrench for SkyMek as one continuous outline (11 cm): ring end, a tapered handle and an
 * open jaw. A single shape keeps the faces from overlapping, which read as a flat cut-out before.
 */
function wrenchShapes(): Shape[] {
  const ringR = 0.0135;
  const headR = 0.0175;
  const headX = 0.096;
  const ringW = 0.0058;
  const headW = 0.0074;
  const open = (36 * Math.PI) / 180;
  const ringA = Math.asin(ringW / ringR);
  const headA = Math.asin(headW / headR);
  const shape = new Shape();
  shape.moveTo(Math.cos(ringA) * ringR, ringW);
  shape.quadraticCurveTo(headX * 0.5, ringW * 0.92, headX - Math.cos(headA) * headR, headW);
  shape.absarc(headX, 0, headR, Math.PI - headA, open, true);
  for (const deg of [60, 120, 180, 240, 300]) {
    const a = (deg * Math.PI) / 180;
    shape.lineTo(headX + Math.cos(a) * 0.0098, Math.sin(a) * 0.0098);
  }
  shape.absarc(headX, 0, headR, -open, -(Math.PI - headA), true);
  shape.quadraticCurveTo(headX * 0.5, -ringW * 0.92, Math.cos(ringA) * ringR, -ringW);
  shape.absarc(0, 0, ringR, -ringA, ringA - Math.PI * 2, true);
  const hole = new Path();
  hole.absarc(0, 0, 0.0072, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  return [shape];
}

const FRONT = new Vector3(0, 0, 1);

function standing(base: Vector3, yaw: number): (m: Matrix4) => Matrix4 {
  const frame = new Matrix4().compose(base, new Quaternion().setFromAxisAngle(UP, yaw), new Vector3(1, 1, 1));
  return m => new Matrix4().multiplyMatrices(frame, m);
}

function sphereDirection(phi: number, theta: number): Vector3 {
  return new Vector3(-Math.cos(phi) * Math.sin(theta), Math.cos(theta), Math.sin(phi) * Math.sin(theta));
}

/** Alfa, TUSOCIO's partner: a small porcelain robot with a smoked visor, two glowing eyes, an antenna light and a brass collar. */
function buildAlfa(b: PartBuilder, p: Palette, q: Quality): void {
  const id = OBJECT_ID.alfa;
  const at = standing(FIGURES.alfa, 0.12);
  const place = (x: number, y: number, z: number) => at(new Matrix4().makeTranslation(x, y, z));

  const profile = new SplineCurve(
    [
      [0.019, 0],
      [0.024, 0.006],
      [0.029, 0.024],
      [0.0275, 0.042],
      [0.021, 0.056],
      [0.012, 0.064]
    ].map(([r, y]) => new Vector2(r!, y!))
  ).getPoints(seg(24, q, 14));
  const body = new LatheGeometry([new Vector2(0, 0), ...profile, new Vector2(0, 0.064)], seg(32, q, 20)).scale(1, 1, 0.9);
  body.deleteAttribute('uv');
  b.add(body, p.alfaBody, at(new Matrix4()), id);

  const chestY = 0.032;
  const chestR = profile.reduce((best, point) => (Math.abs(point.y - chestY) < Math.abs(best.y - chestY) ? point : best)).x * 0.9;
  b.add(new SphereGeometry(0.0042, seg(14, q, 8), seg(10, q, 6)).scale(1, 1, 0.35), p.alfaSignal, place(0, chestY, chestR), id);

  const collar = new TorusGeometry(0.0168, 0.0032, seg(10, q, 6), seg(40, q, 20)).scale(1, 0.9, 1);
  b.add(collar, p.alfaRing, at(new Matrix4().compose(new Vector3(0, 0.0635, 0), new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), Math.PI / 2), new Vector3(1, 1, 1))), id);

  const R = 0.027;
  const headY = 0.0885;
  const head = at(new Matrix4().compose(new Vector3(0, headY, 0), new Quaternion(), new Vector3(1, 0.93, 0.96)));
  b.add(new SphereGeometry(R, seg(32, q, 18), seg(24, q, 12)), p.alfaBody, head, id);
  const visorTheta = 1.5;
  const visor = new SphereGeometry(R * 1.03, seg(28, q, 14), seg(10, q, 5), Math.PI / 2 - 1.05, 2.1, visorTheta - 0.43, 0.86);
  b.add(visor, p.alfaVisor, head, id);
  for (const side of [-1, 1]) {
    const direction = sphereDirection(Math.PI / 2 + side * 0.36, visorTheta - 0.04);
    const eye = new Matrix4().compose(direction.clone().multiplyScalar(R * 1.035), new Quaternion().setFromUnitVectors(FRONT, direction), new Vector3(1, 1, 1));
    b.add(new SphereGeometry(0.0036, seg(14, q, 8), seg(10, q, 6)).scale(1, 1.4, 0.4), p.alfaSignal, new Matrix4().multiplyMatrices(head, eye), id);
    b.add(new CylinderGeometry(0.0062, 0.0068, 0.004, seg(20, q, 10)).rotateZ(Math.PI / 2), p.alfaRing, place(side * R * 0.98, headY, 0), id);
  }
  const crown = headY + R * 0.93;
  b.add(new CylinderGeometry(0.0034, 0.0042, 0.003, seg(16, q, 8)), p.alfaRing, place(0, crown, 0), id);
  b.add(new CylinderGeometry(0.0011, 0.0011, 0.013, seg(8, q, 5)), p.alfaRing, place(0, crown + 0.0075, 0), id);
  b.add(new SphereGeometry(0.0042, seg(14, q, 8), seg(10, q, 6)), p.alfaSignal, place(0, crown + 0.0155, 0), id);
}

/** Ventixs: a round chat bubble with its tail at the lower left and three typing dots, standing on a puck with a green light line. */
function buildBurbu(b: PartBuilder, p: Palette, q: Quality): void {
  const id = OBJECT_ID.ventixs;
  const at = standing(FIGURES.ventixs, -0.26);
  const baseH = 0.007;
  b.add(new RoundedBoxGeometry(0.058, baseH, 0.026, seg(3, q, 2), 0.0028), p.burbuBase, at(new Matrix4().makeTranslation(0, baseH / 2, 0)), id);
  b.add(new BoxGeometry(0.05, 0.0012, 0.0006), p.burbuSignal, at(new Matrix4().makeTranslation(0, baseH * 0.5, 0.0131)), id);

  const r = 0.027;
  const bevel = 0.0026;
  const tip = new Vector2(-0.029, -0.031);
  const tailStart = (250 * Math.PI) / 180;
  const tailEnd = (196 * Math.PI) / 180;
  const shape = new Shape();
  shape.moveTo(Math.cos(tailStart) * r, Math.sin(tailStart) * r);
  shape.absarc(0, 0, r, tailStart, tailEnd + Math.PI * 2, false);
  shape.quadraticCurveTo(-r * 0.98, -r * 0.62, tip.x, tip.y);
  shape.quadraticCurveTo(-r * 0.62, -r * 0.98, Math.cos(tailStart) * r, Math.sin(tailStart) * r);
  const depth = 0.011;
  const bubble = new ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSize: bevel,
    bevelThickness: 0.003,
    bevelSegments: seg(4, q, 2),
    curveSegments: seg(40, q, 18)
  }).translate(0, 0, -depth / 2);
  bubble.deleteAttribute('uv');

  /** Turns the bubble so the tail tip and the bottom of the round both rest on the puck, then centres that footprint. */
  const reach = Math.hypot(tip.x, tip.y) + bevel;
  const rest = Math.PI + Math.asin((r + bevel) / reach);
  const turn = rest - Math.atan2(tip.y, tip.x);
  const lean = new Matrix4().compose(
    new Vector3(-(Math.cos(rest) * reach) / 2, baseH - 0.0008 + r + bevel, 0),
    new Quaternion().setFromAxisAngle(FRONT, turn),
    new Vector3(1, 1, 1)
  );
  b.add(bubble, p.burbuBody, at(lean), id);
  const face = depth / 2 + 0.003;
  for (let i = 0; i < 3; i++) {
    const dot = new SphereGeometry(0.0039, seg(14, q, 8), seg(10, q, 6)).scale(1, 1, 0.5).translate((i - 1) * 0.0125, 0, face);
    b.add(dot, p.burbuDots, at(lean), id);
  }
}

/** Parati: a pink lacquered gift box with a cream satin ribbon, a looped bow, a glowing seam under the lid and a card tag. */
function buildGift(b: PartBuilder, p: Palette, q: Quality): void {
  const id = OBJECT_ID.parati;
  const at = standing(FIGURES.parati, -0.2);
  const place = (geometry: BufferGeometry, finish: Finish, x: number, y: number, z: number) =>
    b.add(geometry, finish, at(new Matrix4().makeTranslation(x, y, z)), id);
  const base = 0.056;
  const baseH = 0.044;
  const lid = 0.06;
  const lidH = 0.013;
  const lidY = baseH - 0.001 + lidH / 2;
  const top = lidY + lidH / 2;
  const band = 0.0095;

  place(new RoundedBoxGeometry(base, baseH, base, seg(3, q, 2), 0.0025), p.giftBody, 0, baseH / 2, 0);
  place(new BoxGeometry(base + 0.0012, 0.0016, base + 0.0012), p.giftSeam, 0, baseH - 0.0018, 0);
  place(new RoundedBoxGeometry(lid, lidH, lid, seg(3, q, 2), 0.003), p.giftBody, 0, lidY, 0);
  place(new BoxGeometry(band, baseH - 0.004, base + 0.0012), p.giftRibbon, 0, baseH / 2, 0);
  place(new BoxGeometry(base + 0.0012, baseH - 0.004, band), p.giftRibbon, 0, baseH / 2, 0);
  place(new BoxGeometry(band, lidH + 0.0006, lid + 0.0012), p.giftRibbon, 0, lidY, 0);
  place(new BoxGeometry(lid + 0.0012, lidH + 0.0006, band), p.giftRibbon, 0, lidY, 0);

  for (const side of [-1, 1]) {
    const loop = new TorusGeometry(0.0085, 0.0024, seg(8, q, 5), seg(24, q, 12)).scale(1, 0.72, 1.6);
    b.add(loop, p.giftRibbon, at(new Matrix4().compose(new Vector3(side * 0.0088, top + 0.0055, 0), new Quaternion().setFromAxisAngle(FRONT, side * 0.42), new Vector3(1, 1, 1))), id);
    const tail = new BoxGeometry(0.0065, 0.0011, 0.019).translate(0, 0, 0.0095);
    b.add(tail, p.giftRibbon, at(new Matrix4().compose(new Vector3(side * 0.002, top + 0.0007, 0.002), new Quaternion().setFromAxisAngle(UP, side * 0.55), new Vector3(1, 1, 1))), id);
  }
  place(new SphereGeometry(0.0046, seg(14, q, 8), seg(10, q, 6)).scale(1, 0.8, 1), p.giftRibbon, 0, top + 0.0035, 0);

  const tagX = base * 0.3;
  const tagY = baseH * 0.5;
  const tagZ = base / 2 + 0.0012;
  const tag = at(new Matrix4().compose(new Vector3(tagX, tagY, tagZ), new Quaternion().setFromAxisAngle(FRONT, -0.22), new Vector3(1, 1, 1)));
  b.add(new RoundedBoxGeometry(0.016, 0.011, 0.0012, 1, 0.0005), p.giftTag, tag, id);
  b.add(new CircleGeometry(0.0018, seg(16, q, 8)), p.giftSeam, new Matrix4().multiplyMatrices(tag, new Matrix4().makeTranslation(-0.004, 0.0015, 0.00065)), id);
  const hole = new Vector3(tagX - 0.006, tagY + 0.004, tagZ + 0.0003);
  const knot = new Vector3(0.0035, top - 0.001, lid / 2 + 0.0012);
  b.add(new CylinderGeometry(0.0004, 0.0004, hole.distanceTo(knot), 4), p.giftTag, at(between(hole, knot)), id);
}

/** The walnut plinth and the four executive desk pieces (mascots.md §2–3). */
export function buildFigures(b: PartBuilder, p: Palette, q: Quality): void {
  const { centre, width, depth, height } = PLINTH;
  b.add(new RoundedBoxGeometry(width, height, depth, 2, 0.003), p.wood, { position: [centre.x, centre.y + height / 2, centre.z] });
  b.add(new BoxGeometry(width - 0.02, 0.004, 0.002), p.brass, { position: [centre.x, centre.y + height * 0.55, centre.z + depth / 2 + 0.0006] });

  buildAlfa(b, p, q);
  buildBurbu(b, p, q);
  buildGift(b, p, q);

  const tool = FIGURES.skymek;
  const base = new Matrix4().compose(tool, new Quaternion().setFromAxisAngle(UP, -0.35), new Vector3(1, 1, 1));
  b.add(new RoundedBoxGeometry(0.1, 0.01, 0.024, 3, 0.0045), p.toolStand, new Matrix4().multiplyMatrices(base, new Matrix4().makeTranslation(-0.004, 0.005, -0.002)), OBJECT_ID.skymek);
  for (const x of [-0.034, 0.026]) {
    b.add(new RoundedBoxGeometry(0.008, 0.012, 0.016, 2, 0.002), p.toolStand, new Matrix4().multiplyMatrices(base, new Matrix4().makeTranslation(x, 0.014, -0.002)), OBJECT_ID.skymek);
  }
  const wrench = new ExtrudeGeometry(wrenchShapes(), {
    depth: 0.0042,
    bevelEnabled: true,
    bevelSize: 0.0012,
    bevelThickness: 0.0012,
    bevelSegments: seg(4, q, 2),
    curveSegments: seg(24, q, 10)
  }).translate(-0.048, 0, -0.0021);
  /** Stands on edge in the cradle, leaning back a little, so the camera reads its silhouette instead of a flat bar. */
  const lean = new Matrix4().multiplyMatrices(
    base,
    new Matrix4().compose(new Vector3(0, 0.026, 0), new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), -0.05).multiply(new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), -0.28)), new Vector3(1, 1, 1))
  );
  b.add(wrench, p.toolBody, lean, OBJECT_ID.skymek);
  b.add(new BoxGeometry(0.038, 0.0016, 0.0004), p.toolSignal, new Matrix4().multiplyMatrices(lean, new Matrix4().makeTranslation(-0.004, 0, 0.0034)), OBJECT_ID.skymek);
}

/** Rectangles (centre x/z and size) that receive a soft contact shadow, in room space. */
export function contactShadowSpots(): Array<{ x: number; y: number; z: number; w: number; d: number; yaw?: number }> {
  const top = DESK.top + 0.0012;
  const plinthTop = PLINTH.centre.y + PLINTH.height + 0.0012;
  const { centre, yaw } = MONITOR;
  return [
    { x: centre.x, y: top, z: centre.z - 0.03, w: 0.36, d: 0.26, yaw },
    { x: KEYBOARD.x, y: top, z: KEYBOARD.z, w: 0.44, d: 0.19 },
    { x: KEYBOARD.trackpadX, y: top, z: KEYBOARD.z, w: 0.17, d: 0.14 },
    { x: OPEN_FOLDER.centre.x, y: top, z: OPEN_FOLDER.centre.z, w: OPEN_FOLDER.width + 0.06, d: OPEN_FOLDER.depth + 0.05, yaw: OPEN_FOLDER.yaw },
    { x: MUG.x, y: top, z: MUG.z, w: 0.13, d: 0.13 },
    { x: PHONE.base.x, y: top, z: PHONE.base.z, w: 0.14, d: 0.12, yaw: PHONE.yaw },
    { x: LAMP.base.x, y: top, z: LAMP.base.z, w: 0.2, d: 0.2 },
    { x: PLINTH.centre.x, y: top, z: PLINTH.centre.z, w: PLINTH.width + 0.07, d: PLINTH.depth + 0.06 },
    { x: FIGURES.alfa.x, y: plinthTop, z: FIGURES.alfa.z, w: 0.065, d: 0.06 },
    { x: FIGURES.skymek.x, y: plinthTop, z: FIGURES.skymek.z, w: 0.12, d: 0.042, yaw: -0.35 },
    { x: FIGURES.parati.x, y: plinthTop, z: FIGURES.parati.z, w: 0.082, d: 0.082, yaw: -0.2 },
    { x: FIGURES.ventixs.x, y: plinthTop, z: FIGURES.ventixs.z, w: 0.074, d: 0.04, yaw: -0.26 },
    { x: TELESCOPE.foot.x, y: 0.0012, z: TELESCOPE.foot.z, w: 0.8, d: 0.8 },
    { x: CHAIR.x, y: 0.0012, z: CHAIR.z, w: 0.75, d: 0.75 },
    { x: -(DESK.width / 2 - 0.07), y: 0.0012, z: 0, w: 0.12, d: 0.8 },
    { x: DESK.width / 2 - 0.07, y: 0.0012, z: 0, w: 0.12, d: 0.8 }
  ];
}

/** Merges the contact-shadow quads into one geometry (uv kept for the blob texture). */
export function buildContactShadows(): BufferGeometry {
  const quads = contactShadowSpots().map(spot =>
    new PlaneGeometry(spot.w, spot.d).rotateX(-Math.PI / 2).rotateY(spot.yaw ?? 0).translate(spot.x, spot.y, spot.z)
  );
  const merged = mergeGeometries(quads, false)!;
  for (const quad of quads) quad.dispose();
  return merged;
}
