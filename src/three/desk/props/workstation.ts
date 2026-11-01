import {
  BoxGeometry,
  CatmullRomCurve3,
  CircleGeometry,
  Color,
  CylinderGeometry,
  LatheGeometry,
  Matrix4,
  Quaternion,
  RingGeometry,
  SphereGeometry,
  TorusGeometry,
  TubeGeometry,
  Vector2,
  Vector3
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { doubleSided, OBJECT_ID, PartBuilder, type Finish, type Placement } from '../builder';
import { DESK, KEYBOARD, LAMP, LAPTOP, MONITOR, MUG, PHONE } from '../layout';
import { along, rod, seg, shade, UP } from './geometry';
import type { Palette, Quality } from './palette';

/** Coffee surface height inside the mug: high enough that the wide shot sees the dark disc and its crema. */
const COFFEE_LEVEL = 0.085;

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
  const surface = (): Placement => ({ position: [MUG.x, MUG.y + COFFEE_LEVEL, MUG.z], rotation: [-Math.PI / 2, 0, 0] });
  const rim = seg(28, q, 10);
  b.add(new CircleGeometry(0.028, rim), p.coffee, surface());
  b.add(new RingGeometry(0.028, 0.0315, rim), shade(p.crema, 0.6), surface());
  b.add(new RingGeometry(0.0315, 0.0376, rim), p.crema, surface());
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
  b.add(new RoundedBoxGeometry(width * 0.72, height * 0.75, 0.03, 3, 0.012), p.bezel, { position: [0, 0, -MONITOR.depth / 2 - 0.012] });
  b.add(new RoundedBoxGeometry(0.11, 0.11, 0.012, 1, 0.004), p.metal, { position: [0, 0, -MONITOR.depth / 2 - 0.032] });
}

/** Rubber feet lift the case off the desk, so a dark contact line separates it from the wood. */
const LAPTOP_FOOT = 0.0016;
const LAPTOP_LID_HEIGHT = LAPTOP.depth - 0.004;
/** The panel sits above the lid centre: a thin top bezel and a deeper chin, as on a MacBook. */
const LAPTOP_SCREEN_RISE = 0.0035;
const LAPTOP_KEY_PITCH = 0.0178;
const LAPTOP_KEY_GAP = 0.0024;
/** Key widths in key units per row, back to front; the first row is the half-height function row. */
const LAPTOP_KEY_ROWS: readonly (readonly number[])[] = [
  [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5],
  [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1.75, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.75],
  [2.25, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.25],
  [1, 1, 1, 1.25, 5, 1.25, 1]
];
const LAPTOP_KEY_UNITS = 14.5;

function laptopFrame(): Matrix4 {
  return new Matrix4().compose(LAPTOP.centre, new Quaternion().setFromAxisAngle(UP, LAPTOP.yaw), new Vector3(1, 1, 1));
}

function laptopHinge(): Matrix4 {
  const hinge = new Matrix4().compose(
    new Vector3(0, LAPTOP_FOOT + LAPTOP.base, -LAPTOP.depth / 2 + 0.004),
    new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), -LAPTOP.lean),
    new Vector3(1, 1, 1)
  );
  return laptopFrame().multiply(hinge);
}

/** World frame of the laptop glass (centre, orientation, size), facing the user. */
export function laptopScreenFrame(): { centre: Vector3; quaternion: Quaternion } {
  const matrix = laptopHinge().multiply(new Matrix4().makeTranslation(0, LAPTOP_LID_HEIGHT / 2 + LAPTOP_SCREEN_RISE, LAPTOP.lid / 2 + 0.0008));
  const centre = new Vector3();
  const quaternion = new Quaternion();
  matrix.decompose(centre, quaternion, new Vector3());
  return { centre, quaternion };
}

/** MacBook-like laptop in space grey: case, keyboard, trackpad, hinge and lid; the glass is a separate lit mesh. */
export function buildLaptop(b: PartBuilder, p: Palette): void {
  const frame = laptopFrame();
  const shell: Finish = { color: new Color('#5d626b'), roughness: 0.32, metalness: 0.9 };
  const rubber: Finish = { color: new Color('#0b0c0e'), roughness: 0.95, metalness: 0 };
  const keycap: Finish = { color: new Color('#0a0b0d'), roughness: 0.92, metalness: 0 };
  const well: Finish = { ...shade(p.bezel, 0.6), roughness: 0.9, metalness: 0 };
  const glass: Finish = { color: new Color('#050608'), roughness: 0.24, metalness: 0.1 };
  const at = (x: number, y: number, z: number) => new Matrix4().multiplyMatrices(frame, new Matrix4().makeTranslation(x, y, z));
  const { width, depth, base } = LAPTOP;
  const deck = LAPTOP_FOOT + base;

  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      b.add(new CylinderGeometry(0.006, 0.006, LAPTOP_FOOT, 12), rubber, at(sx * (width / 2 - 0.026), LAPTOP_FOOT / 2, sz * (depth / 2 - 0.024)));
    }
  }
  b.add(new RoundedBoxGeometry(width, base, depth, 3, 0.005), shell, at(0, LAPTOP_FOOT + base / 2, 0));
  b.add(new BoxGeometry(0.052, 0.0022, 0.004), shade(shell, 0.45), at(0, deck - 0.0011, depth / 2 - 0.0012));

  const keyboardWidth = LAPTOP_KEY_UNITS * LAPTOP_KEY_PITCH;
  const keyboardDepth = 5.5 * LAPTOP_KEY_PITCH;
  const keyboardZ = -depth / 2 + 0.017 + keyboardDepth / 2;
  b.add(new BoxGeometry(keyboardWidth + 0.006, 0.0004, keyboardDepth + 0.006), well, at(0, deck - 0.0001, keyboardZ));
  const keyTop = deck + 0.0007;
  const addKey = (x: number, z: number, w: number, d: number) =>
    b.add(new RoundedBoxGeometry(w, 0.0012, d, 1, 0.0005), keycap, at(x, keyTop, z));
  let rowZ = keyboardZ - keyboardDepth / 2;
  LAPTOP_KEY_ROWS.forEach((row, index) => {
    const rowDepth = (index === 0 ? 0.5 : 1) * LAPTOP_KEY_PITCH;
    const z = rowZ + rowDepth / 2;
    let x = -keyboardWidth / 2;
    for (const units of row) {
      const w = units * LAPTOP_KEY_PITCH;
      addKey(x + w / 2, z, w - LAPTOP_KEY_GAP, rowDepth - LAPTOP_KEY_GAP);
      x += w;
    }
    if (index === LAPTOP_KEY_ROWS.length - 1) {
      const arrow = LAPTOP_KEY_PITCH;
      const half = arrow / 2;
      addKey(x + half, z + half / 2, arrow - LAPTOP_KEY_GAP, half - LAPTOP_KEY_GAP);
      addKey(x + arrow + half, z - half / 2, arrow - LAPTOP_KEY_GAP, half - LAPTOP_KEY_GAP);
      addKey(x + arrow + half, z + half / 2, arrow - LAPTOP_KEY_GAP, half - LAPTOP_KEY_GAP);
      addKey(x + 2 * arrow + half, z + half / 2, arrow - LAPTOP_KEY_GAP, half - LAPTOP_KEY_GAP);
    }
    rowZ += rowDepth;
  });

  const grilleWidth = (width - keyboardWidth) / 2 - 0.009;
  for (const sx of [-1, 1]) {
    b.add(new BoxGeometry(grilleWidth, 0.0004, keyboardDepth), { color: new Color('#16181c'), roughness: 0.95, metalness: 0 }, at(sx * (keyboardWidth / 2 + 0.003 + grilleWidth / 2 + 0.0015), deck - 0.0001, keyboardZ));
  }

  const trackpadDepth = 0.066;
  const trackpadZ = depth / 2 - 0.011 - trackpadDepth / 2;
  b.add(new RoundedBoxGeometry(0.1365, 0.0005, trackpadDepth + 0.0025, 1, 0.0002), { ...shade(shell, 0.3), roughness: 0.6 }, at(0, deck, trackpadZ));
  b.add(new RoundedBoxGeometry(0.132, 0.0006, trackpadDepth, 1, 0.0002), { ...shade(shell, 0.8), roughness: 0.28, metalness: 0.9 }, at(0, deck + 0.0001, trackpadZ));

  const hinge = laptopHinge();
  const onLid = (x: number, y: number, z: number) => new Matrix4().multiplyMatrices(hinge, new Matrix4().makeTranslation(x, y, z));
  b.add(new CylinderGeometry(0.0052, 0.0052, width * 0.8, 14), { ...shade(shell, 0.4), roughness: 0.45, metalness: 0.8 }, new Matrix4().multiplyMatrices(at(0, deck - 0.0015, -depth / 2 + 0.004), new Matrix4().makeRotationZ(Math.PI / 2)));
  b.add(new RoundedBoxGeometry(width, LAPTOP_LID_HEIGHT, LAPTOP.lid, 3, 0.003), shell, onLid(0, LAPTOP_LID_HEIGHT / 2, 0));
  b.add(new BoxGeometry(width - 0.003, LAPTOP_LID_HEIGHT - 0.003, 0.0008), glass, onLid(0, LAPTOP_LID_HEIGHT / 2, LAPTOP.lid / 2 + 0.0002));
  b.add(new CylinderGeometry(0.0011, 0.0011, 0.0004, 10), { color: new Color('#182030'), roughness: 0.1, metalness: 0.3 }, new Matrix4().multiplyMatrices(onLid(0, LAPTOP_LID_HEIGHT - 0.0055, LAPTOP.lid / 2 + 0.0007), new Matrix4().makeRotationX(Math.PI / 2)));
  buildLaptopCable(b, frame, rubber);
}

/** USB-C lead from the laptop's right-hand port, across the desk and behind the stand, up into the monitor's back. */
function buildLaptopCable(b: PartBuilder, laptop: Matrix4, finish: Finish): void {
  const { width, base } = LAPTOP;
  const portY = LAPTOP_FOOT + base * 0.5;
  const portZ = -0.05;
  const onLaptop = (x: number, y: number, z: number) => new Vector3(x, y, z).applyMatrix4(laptop);
  const { centre, yaw } = MONITOR;
  const behind = new Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
  const right = new Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
  const nearMonitor = (side: number, back: number, lift: number) =>
    new Vector3(centre.x, DESK.top + lift, centre.z).addScaledVector(right, side).addScaledVector(behind, back);
  const radius = 0.0018;
  const curve = new CatmullRomCurve3([
    onLaptop(width / 2 + 0.011, portY, portZ),
    onLaptop(width / 2 + 0.028, LAPTOP_FOOT + 0.004, portZ - 0.01),
    nearMonitor(-0.17, 0.11, radius),
    nearMonitor(-0.09, 0.15, radius),
    nearMonitor(-0.02, 0.125, radius + 0.002),
    nearMonitor(0, 0.097, 0.03),
    nearMonitor(0, 0.0875, 0.085)
  ]);
  b.add(new TubeGeometry(curve, 96, radius, 8, false), finish);
  const plug: Finish = { ...finish, roughness: 0.5 };
  b.add(new RoundedBoxGeometry(0.013, 0.0042, 0.0085, 1, 0.0015), plug, new Matrix4().multiplyMatrices(laptop, new Matrix4().makeTranslation(width / 2 + 0.0055, portY, portZ)));
  const monitorPlug = new Matrix4().compose(nearMonitor(0, 0.0815, 0.085), new Quaternion().setFromAxisAngle(UP, yaw), new Vector3(1, 1, 1));
  b.add(new RoundedBoxGeometry(0.0085, 0.0042, 0.013, 1, 0.0015), plug, monitorPlug);
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
