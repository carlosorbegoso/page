import {
  BoxGeometry,
  CapsuleGeometry,
  CircleGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  IcosahedronGeometry,
  LatheGeometry,
  Matrix4,
  OctahedronGeometry,
  PlaneGeometry,
  Quaternion,
  Shape,
  ShapeGeometry,
  SphereGeometry,
  TorusGeometry,
  Vector2,
  Vector3,
  type BufferGeometry
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { tokenColor, tokenNumber } from '../tokens';
import { doubleSided, OBJECT_ID, PartBuilder, type Finish } from './builder';
import { DESK, FIGURES, GLASS_Z, LAMP, MONITOR, ROOM, TELESCOPE, WINDOW } from './layout';

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
  alfaSignal: Finish;
  burbuBody: Finish;
  burbuSignal: Finish;
  giftBody: Finish;
  giftRibbon: Finish;
  giftSeam: Finish;
}

/**
 * The wall and floor tokens describe how the surfaces should *look* at night; as albedos they
 * are near-black paint (< 1 % reflectance) and would render pure black, so they are lifted.
 */
const PERCEIVED_TO_ALBEDO = { wall: 3.5, floor: 2 } as const;

/** Room finishes read from the design tokens (desk.md §2–3, mascots.md §2). */
export function readPalette(): Palette {
  const c = (token: string, fallback: string) => tokenColor(token, fallback);
  const signal = 0.8;
  return {
    wall: { color: c('--color-desk-wall', '#121722').multiplyScalar(PERCEIVED_TO_ALBEDO.wall), roughness: 0.95, metalness: 0 },
    floor: { color: c('--color-desk-floor', '#17140f').multiplyScalar(PERCEIVED_TO_ALBEDO.floor), roughness: 0.7, metalness: 0, grain: 0.7 },
    wood: { color: c('--color-desk-wood', '#5a3e2b'), roughness: 0.72, metalness: 0, grain: 1 },
    metal: { color: c('--color-desk-metal', '#2b313c'), roughness: 0.35, metalness: 0.8 },
    fabric: { color: c('--color-desk-fabric', '#232a3a'), roughness: 0.9, metalness: 0 },
    ceramic: { color: c('--color-desk-ceramic', '#e6e0d4'), roughness: 0.35, metalness: 0 },
    coffee: { color: c('--color-desk-coffee', '#2a1a10'), roughness: 0.15, metalness: 0 },
    plant: { color: c('--color-desk-plant', '#2f5a44'), roughness: 0.45, metalness: 0 },
    pot: { color: c('--color-desk-pot', '#8c5a44'), roughness: 0.8, metalness: 0 },
    soil: { color: c('--color-desk-coffee', '#2a1a10').multiplyScalar(0.6), roughness: 1, metalness: 0 },
    paper: { color: c('--color-desk-paper', '#d8d2c4'), roughness: 0.9, metalness: 0 },
    bookDark: { color: c('--color-desk-fabric', '#232a3a'), roughness: 0.8, metalness: 0 },
    bookBlue: { color: c('--color-desk-metal', '#2b313c'), roughness: 0.8, metalness: 0 },
    brass: { color: c('--color-telescope-brass', '#b08a4a'), roughness: 0.35, metalness: 1 },
    frame: { color: c('--color-window-frame', '#1a1f29'), roughness: 0.5, metalness: 0.6 },
    bezel: { color: c('--color-monitor-bezel', '#0c0f14'), roughness: 0.4, metalness: 0.3 },
    keys: { color: c('--color-monitor-bezel', '#0c0f14').multiplyScalar(1.6), roughness: 0.5, metalness: 0.2 },
    trackpad: { color: c('--color-desk-metal', '#2b313c'), roughness: 0.3, metalness: 0.6 },
    shade: { color: c('--color-lamp-shade', '#1d222b'), roughness: 0.6, metalness: 0.3 },
    diffuser: { color: c('--color-lamp', '#ffb566'), roughness: 0.5, metalness: 0, emissive: 2 },
    telescope: { color: c('--color-telescope', '#c9ced6'), roughness: 0.3, metalness: 0.1 },
    telescopeBrass: { color: c('--color-telescope-brass', '#b08a4a'), roughness: 0.35, metalness: 1 },
    lens: { color: new Color(0.01, 0.015, 0.03), roughness: 0.05, metalness: 0.4 },
    alfaBody: {
      color: c('--color-alfa-body', '#2b3a52'),
      roughness: tokenNumber('--alfa-roughness', 0.38),
      metalness: tokenNumber('--alfa-metalness', 0.6)
    },
    alfaSignal: { color: c('--color-alfa-signal', '#5aa9ff'), roughness: 0.4, metalness: 0, emissive: signal },
    burbuBody: {
      color: c('--color-burbu-body', '#1f6e52'),
      roughness: tokenNumber('--burbu-roughness', 0.55),
      metalness: tokenNumber('--burbu-metalness', 0.1)
    },
    burbuSignal: { color: c('--color-burbu-signal', '#3fcf8e'), roughness: 0.4, metalness: 0, emissive: signal },
    giftBody: {
      color: c('--color-gift-body', '#2a3142'),
      roughness: tokenNumber('--gift-roughness', 0.62),
      metalness: tokenNumber('--gift-metalness', 0.05)
    },
    giftRibbon: {
      color: c('--color-gift-ribbon', '#f28ba0'),
      roughness: tokenNumber('--gift-ribbon-roughness', 0.3),
      metalness: tokenNumber('--gift-ribbon-metalness', 0.7)
    },
    giftSeam: { color: c('--color-gift-ribbon', '#f28ba0'), roughness: 0.4, metalness: 0, emissive: signal * 0.4 }
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

  const keyboard = new Vector3(-0.1, DESK.top, 0.16);
  const kYaw = yaw * 0.5;
  const kb = new Matrix4().compose(keyboard, new Quaternion().setFromAxisAngle(UP, kYaw), new Vector3(1, 1, 1));
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

  b.add(new RoundedBoxGeometry(0.13, 0.005, 0.105, 2, 0.003), p.trackpad, { position: [0.17, DESK.top + 0.0025, 0.165], rotation: [0, kYaw, 0] });

  const note = new Matrix4().compose(new Vector3(0.36, DESK.top, 0.17), new Quaternion().setFromAxisAngle(UP, 0.18), new Vector3(1, 1, 1));
  b.add(new RoundedBoxGeometry(0.15, 0.012, 0.21, 1, 0.003), p.bookDark, new Matrix4().multiplyMatrices(note, new Matrix4().makeTranslation(0, 0.006, 0)));
  b.add(new BoxGeometry(0.143, 0.0125, 0.203), p.paper, new Matrix4().multiplyMatrices(note, new Matrix4().makeTranslation(0.004, 0.006, 0)));
  b.add(new BoxGeometry(0.008, 0.0135, 0.211), shade(p.pot, 0.6), new Matrix4().multiplyMatrices(note, new Matrix4().makeTranslation(0.05, 0.006, 0)));
  const pencil = new Matrix4().compose(
    new Vector3(0.46, DESK.top + 0.004, 0.17),
    new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), Math.PI / 2).premultiply(new Quaternion().setFromAxisAngle(UP, 0.1)),
    new Vector3(1, 1, 1)
  );
  b.add(new CylinderGeometry(0.0038, 0.0038, 0.16, 6), shade(p.brass, 0.9), pencil);
  b.add(new ConeGeometry(0.0038, 0.018, 6), p.paper, new Matrix4().multiplyMatrices(pencil, new Matrix4().makeTranslation(0, 0.089, 0)));

  const mug = new Vector3(0.43, DESK.top, -0.04);
  const profile = [
    [0.0, 0.0],
    [0.034, 0.0],
    [0.039, 0.004],
    [0.04, 0.09],
    [0.0385, 0.095],
    [0.0355, 0.095],
    [0.035, 0.012],
    [0.0, 0.012]
  ].map(([x, y]) => new Vector2(x!, y!));
  b.add(new LatheGeometry(profile, seg(32, q, 12)), p.ceramic, { position: mug.toArray() });
  b.add(new CircleGeometry(0.0352, seg(28, q, 10)), p.coffee, { position: [mug.x, mug.y + 0.074, mug.z], rotation: [-Math.PI / 2, 0, 0] });
  b.add(new TorusGeometry(0.025, 0.006, seg(8, q, 4), seg(16, q, 8), Math.PI), p.ceramic, {
    position: [mug.x + 0.038, mug.y + 0.048, mug.z],
    rotation: [0, 0, -Math.PI / 2]
  });
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
  const pot = new Vector3(0.57, DESK.top, -0.21);
  const profile = [
    [0, 0],
    [0.052, 0],
    [0.056, 0.006],
    [0.068, 0.13],
    [0.072, 0.134],
    [0.072, 0.14],
    [0.064, 0.14],
    [0.062, 0.125],
    [0, 0.125]
  ].map(([x, y]) => new Vector2(x!, y!));
  b.add(new LatheGeometry(profile, seg(28, q, 10)), p.pot, { position: pot.toArray() });
  b.add(new CircleGeometry(0.062, seg(20, q, 8)), p.soil, { position: [pot.x, pot.y + 0.128, pot.z], rotation: [-Math.PI / 2, 0, 0] });
  const random = seeded(11);
  const leaves = Math.round(7 + 2 * q);
  for (let i = 0; i < leaves; i++) {
    const angle = (i / leaves) * Math.PI * 2 + random() * 0.5;
    const height = 0.12 + random() * 0.2;
    const lean = 0.25 + random() * 0.35;
    const stemBase = pot.clone().add(new Vector3(Math.cos(angle) * 0.015, 0.125, Math.sin(angle) * 0.015));
    const outward = new Vector3(Math.cos(angle), 0, Math.sin(angle));
    const stemTop = stemBase.clone().add(new Vector3(0, height, 0)).addScaledVector(outward, height * lean);
    rod(b, stemBase, stemTop, 0.0022, shade(p.plant, 0.8), q * 0.5);
    const length = 0.12 + random() * 0.08;
    const tip = outward.clone().multiplyScalar(0.8).add(new Vector3(0, 0.35 + random() * 0.4, 0)).normalize();
    const blade = new Quaternion().setFromUnitVectors(UP, tip);
    const twist = new Quaternion().setFromAxisAngle(tip, random() * 0.8 - 0.4);
    const facing = new Quaternion().setFromAxisAngle(UP, -angle + Math.PI / 2);
    const rotation = twist.multiply(blade).multiply(facing);
    b.add(leaf(length, length * 0.55, 0.25 + random() * 0.2, q), shade(p.plant, 0.85 + random() * 0.3), new Matrix4().compose(stemTop, rotation, new Vector3(1, 1, 1)));
  }
}

export function buildShelves(b: PartBuilder, p: Palette, q: Quality): void {
  const x = ROOM.left + 0.11;
  const z = 0.12;
  const levels = [1.22, 1.56, 1.9];
  const random = seeded(23);
  const covers = [p.paper, p.bookDark, p.bookBlue, shade(p.pot, 0.55), p.paper, shade(p.plant, 0.7), p.bookDark];
  for (const y of levels) {
    b.add(new RoundedBoxGeometry(0.22, 0.025, 0.9, 1, 0.004), p.wood, { position: [x, y, z] });
  }
  let cursor = z - 0.4;
  for (let i = 0; i < 7; i++) {
    const thickness = 0.022 + random() * 0.02;
    const height = 0.17 + random() * 0.07;
    const depth = 0.15 + random() * 0.03;
    const lean = i === 6 ? 0.18 : 0;
    b.add(new RoundedBoxGeometry(depth, height, thickness, 1, 0.002), covers[i % covers.length]!, {
      position: [x + 0.01, levels[0]! + 0.0125 + height / 2, cursor + thickness / 2 + lean * height * 0.5],
      rotation: [lean, 0, 0]
    });
    cursor += thickness + 0.002;
  }
  for (let i = 0; i < 3; i++) {
    const h = 0.025 + random() * 0.01;
    b.add(new RoundedBoxGeometry(0.16 - i * 0.012, h, 0.22 - i * 0.02, 1, 0.002), covers[(i + 2) % covers.length]!, {
      position: [x, levels[1]! + 0.0125 + h / 2 + i * 0.033, z + 0.2],
      rotation: [0, (random() - 0.5) * 0.2, 0]
    });
  }
  b.add(new RoundedBoxGeometry(0.14, 0.11, 0.14, 2, 0.01), p.fabric, { position: [x, levels[1]! + 0.0125 + 0.055, z - 0.22] });
  b.add(new CylinderGeometry(0.022, 0.03, 0.02, seg(20, q, 8)), p.brass, { position: [x, levels[2]! + 0.0225, z + 0.15] });
  b.add(new SphereGeometry(0.04, seg(24, q, 10), seg(16, q, 8)), p.brass, { position: [x, levels[2]! + 0.07, z + 0.15] });
  for (let i = 0; i < 2; i++) {
    b.add(new RoundedBoxGeometry(0.15, 0.2, 0.03, 1, 0.002), covers[i + 4]!, {
      position: [x + 0.01, levels[2]! + 0.1125, z - 0.25 + i * 0.033]
    });
  }
}

export function buildChair(b: PartBuilder, p: Palette, q: Quality): void {
  const centre = new Vector3(-0.72, 0, 1.05);
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
export function buildTelescope(b: PartBuilder, p: Palette, q: Quality, aim: Vector3): { head: Vector3; tubeCentre: Vector3 } {
  const id = OBJECT_ID.telescope;
  const foot = TELESCOPE.foot;
  const head = new Vector3(foot.x, TELESCOPE.headHeight, foot.z);
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + 0.4;
    const tip = new Vector3(foot.x + Math.cos(a) * 0.34, 0, foot.z + Math.sin(a) * 0.34);
    rod(b, head.clone().add(new Vector3(Math.cos(a) * 0.03, -0.02, Math.sin(a) * 0.03)), tip, 0.011, p.metal, q * 0.7, id);
    b.add(new SphereGeometry(0.014, seg(8, q), seg(6, q)), shade(p.metal, 0.5), { position: [tip.x, 0.012, tip.z] }, id);
  }
  b.add(new CylinderGeometry(0.1, 0.1, 0.008, seg(24, q, 6)), p.metal, { position: [foot.x, 0.46, foot.z] }, id);
  b.add(new CylinderGeometry(0.035, 0.04, 0.06, seg(16, q, 6)), p.metal, { position: head.toArray() }, id);
  const pivot = head.clone().add(new Vector3(0, 0.06, 0));
  b.add(new RoundedBoxGeometry(0.06, 0.05, 0.07, 1, 0.006), p.metal, { position: pivot.toArray() }, id);
  const dir = aim.clone().normalize();
  const tubeCentre = pivot.clone().add(new Vector3(0, 0.055, 0)).addScaledVector(dir, 0.08);
  const radial = seg(28, q, 10);
  b.add(new CylinderGeometry(0.045, 0.045, 0.7, radial), p.telescope, along(tubeCentre, dir, 0), id);
  b.add(new CylinderGeometry(0.053, 0.053, 0.17, radial, 1, true), p.telescope, along(tubeCentre, dir, 0.42), id);
  b.add(new CircleGeometry(0.05, radial), p.lens, new Matrix4().multiplyMatrices(along(tubeCentre, dir, 0.37), new Matrix4().makeRotationX(-Math.PI / 2)), id);
  for (const offset of [-0.1, 0.12]) {
    b.add(new CylinderGeometry(0.05, 0.05, 0.022, radial), p.telescopeBrass, along(tubeCentre, dir, offset), id);
  }
  b.add(new CylinderGeometry(0.047, 0.047, 0.012, radial), p.telescopeBrass, along(tubeCentre, dir, 0.335), id);
  b.add(new CylinderGeometry(0.024, 0.026, 0.09, seg(16, q, 6)), p.telescopeBrass, along(tubeCentre, dir, -0.39), id);
  const eyepieceBase = tubeCentre.clone().addScaledVector(dir, -0.44);
  const up = new Vector3(0, 1, 0).sub(dir.clone().multiplyScalar(dir.y)).normalize();
  rod(b, eyepieceBase, eyepieceBase.clone().addScaledVector(up, 0.06), 0.014, p.metal, q, id);
  rod(b, eyepieceBase.clone().addScaledVector(up, 0.06), eyepieceBase.clone().addScaledVector(up, 0.09), 0.017, shade(p.metal, 0.5), q, id);
  const finder = tubeCentre.clone().addScaledVector(up, 0.07).addScaledVector(dir, -0.12);
  b.add(new CylinderGeometry(0.012, 0.012, 0.17, seg(12, q)), p.telescope, along(finder, dir, 0), id);
  rod(b, finder.clone().addScaledVector(up, -0.012), finder.clone().addScaledVector(up, -0.03), 0.006, p.metal, q, id);
  return { head, tubeCentre };
}

/** Desk-sized collectibles of the mascots (mascots.md §2) on a walnut plinth. */
export function buildFigures(b: PartBuilder, p: Palette, q: Quality): void {
  const plinthTop = FIGURES.plinth.y + 0.018;
  b.add(new RoundedBoxGeometry(0.32, 0.018, 0.1, 2, 0.004), p.wood, { position: [FIGURES.plinth.x, FIGURES.plinth.y + 0.009, FIGURES.plinth.z] });

  const alfa = FIGURES.alfa;
  const radius = 0.046;
  const stretch = 1.15;
  const lift = 0.016;
  const body = new IcosahedronGeometry(radius, 1);
  const position = body.getAttribute('position');
  for (let i = 0; i < position.count; i++) {
    const y = position.getY(i) * stretch;
    const taper = y < 0 ? 0.85 : 1;
    position.setXYZ(i, position.getX(i) * taper, y, position.getZ(i) * taper);
  }
  body.deleteAttribute('normal');
  body.computeVertexNormals();
  const alfaCentre = new Vector3(alfa.x, plinthTop + lift + radius * stretch, alfa.z);
  b.add(body, p.alfaBody, { position: alfaCentre.toArray(), rotation: [0, 0.4, 0.12] }, OBJECT_ID.alfa);
  b.add(new TorusGeometry(radius * 0.955, 0.0014, 4, seg(40, q, 16)), p.alfaSignal, {
    position: [alfaCentre.x - Math.sin(0.12) * radius * 0.22, alfaCentre.y + radius * 0.22, alfaCentre.z],
    rotation: [Math.PI / 2, 0.12, 0]
  }, OBJECT_ID.alfa);
  b.add(new CylinderGeometry(0.0025, 0.0025, lift + 0.01, 8), p.brass, { position: [alfa.x, plinthTop + (lift + 0.01) / 2, alfa.z] }, OBJECT_ID.alfa);
  b.add(new CylinderGeometry(0.018, 0.02, 0.004, seg(20, q, 8)), p.brass, { position: [alfa.x, plinthTop + 0.002, alfa.z] }, OBJECT_ID.alfa);

  const burbu = FIGURES.burbu;
  const s = 0.175;
  const bubble = new Matrix4().compose(
    new Vector3(burbu.x, plinthTop + 0.2 * s + 0.004, burbu.z),
    new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), -0.1).premultiply(new Quaternion().setFromAxisAngle(UP, 0.35)),
    new Vector3(s, s, s)
  );
  const capsule = new CapsuleGeometry(0.2, 0.25, seg(8, q, 4), seg(16, q, 8)).rotateZ(Math.PI / 2).scale(1, 1, 0.55);
  const tail = new ConeGeometry(0.07, 0.12, seg(12, q, 6)).scale(1, 1, 0.55).rotateZ(2.4).translate(-0.2, -0.17, 0);
  b.add(mergeGeometries([capsule, tail])!, p.burbuBody, bubble, OBJECT_ID.burbu);
  capsule.dispose();
  tail.dispose();
  for (let i = 0; i < 3; i++) {
    const dot = new CapsuleGeometry(0.018, 0.04, 2, seg(8, q, 4)).rotateZ(Math.PI / 2).translate((i - 1) * 0.09, 0, 0.2 * 0.55 - 0.002);
    b.add(dot, p.burbuSignal, bubble, OBJECT_ID.burbu);
  }

  const gift = FIGURES.gift;
  const g = 0.095;
  const box = new Matrix4().compose(new Vector3(gift.x, plinthTop, gift.z), new Quaternion().setFromAxisAngle(UP, -0.35), new Vector3(g, g, g));
  const bodyH = 0.48;
  const lidH = 0.12;
  const lidY = bodyH + 0.012 + lidH / 2;
  const part = (geometry: BufferGeometry, finish: Finish, y: number) =>
    b.add(geometry, finish, new Matrix4().multiplyMatrices(box, new Matrix4().makeTranslation(0, y, 0)), OBJECT_ID.gift);
  part(new RoundedBoxGeometry(0.6, bodyH, 0.6, 2, 0.05), p.giftBody, bodyH / 2);
  part(new BoxGeometry(0.08, bodyH + 0.004, 0.62), p.giftRibbon, bodyH / 2);
  part(new BoxGeometry(0.62, bodyH + 0.004, 0.08), p.giftRibbon, bodyH / 2);
  part(new BoxGeometry(0.61, 0.008, 0.61), p.giftSeam, bodyH + 0.006);
  part(new RoundedBoxGeometry(0.64, lidH, 0.64, 2, 0.04), p.giftBody, lidY);
  part(new BoxGeometry(0.08, lidH + 0.006, 0.66), p.giftRibbon, lidY);
  part(new BoxGeometry(0.66, lidH + 0.006, 0.08), p.giftRibbon, lidY);
  for (const side of [-1, 1]) {
    b.add(
      new OctahedronGeometry(0.07, 0).scale(1.4, 0.6, 0.8).rotateZ(side * -0.35).translate(side * 0.075, lidY + lidH / 2 + 0.03, 0),
      p.giftRibbon,
      box,
      OBJECT_ID.gift
    );
  }
}

/** Monitor head (bezel and back housing), centred on the screen, facing +Z. */
export function buildMonitorHead(b: PartBuilder, p: Palette, q: Quality): void {
  const { width, height } = MONITOR.screen;
  const e = MONITOR.bezel;
  b.add(new RoundedBoxGeometry(width + 2 * e, height + 2 * e, MONITOR.depth, seg(2, q, 1), 0.003), p.bezel);
  b.add(new RoundedBoxGeometry(width * 0.72, height * 0.75, 0.03, seg(3, q, 2), 0.012), p.bezel, { position: [0, 0, -MONITOR.depth / 2 - 0.012] });
  b.add(new RoundedBoxGeometry(0.11, 0.11, 0.012, 1, 0.004), p.metal, { position: [0, 0, -MONITOR.depth / 2 - 0.032] });
}

/** Rectangles (centre x/z and size) that receive a soft contact shadow, in room space. */
export function contactShadowSpots(): Array<{ x: number; y: number; z: number; w: number; d: number; yaw?: number }> {
  const top = DESK.top + 0.0012;
  const { centre, yaw } = MONITOR;
  return [
    { x: centre.x, y: top, z: centre.z - 0.03, w: 0.36, d: 0.26, yaw },
    { x: -0.1, y: top, z: 0.16, w: 0.44, d: 0.19, yaw: yaw * 0.5 },
    { x: 0.17, y: top, z: 0.165, w: 0.17, d: 0.14 },
    { x: 0.36, y: top, z: 0.17, w: 0.2, d: 0.26, yaw: 0.18 },
    { x: 0.43, y: top, z: -0.04, w: 0.12, d: 0.12 },
    { x: 0.57, y: top, z: -0.21, w: 0.2, d: 0.2 },
    { x: LAMP.base.x, y: top, z: LAMP.base.z, w: 0.2, d: 0.2 },
    { x: FIGURES.plinth.x, y: top, z: FIGURES.plinth.z, w: 0.38, d: 0.15 },
    { x: TELESCOPE.foot.x, y: 0.0012, z: TELESCOPE.foot.z, w: 0.8, d: 0.8 },
    { x: -0.72, y: 0.0012, z: 1.05, w: 0.75, d: 0.75 },
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
