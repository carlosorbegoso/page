import { BoxGeometry, CatmullRomCurve3, Color, CylinderGeometry, Matrix4, Quaternion, TubeGeometry, Vector3 } from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import type { Finish, PartBuilder } from '../builder';
import { DESK, LAPTOP, MONITOR } from '../layout';
import { shade, UP } from './geometry';
import type { Palette } from './palette';

/** Rubber feet lift the case off the desk, so a dark contact line separates it from the wood. */
const LAPTOP_FOOT = 0.0011;
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
  const body: Finish = { ...shade(shell, 1.2), roughness: 0.45, metalness: 0.35 };
  b.add(new RoundedBoxGeometry(width, base, depth, 3, 0.005), body, at(0, LAPTOP_FOOT + base / 2, 0));
  b.add(new BoxGeometry(width - 0.006, 0.0003, depth - 0.006), shell, at(0, deck - 0.0001, 0));
  b.add(new BoxGeometry(0.04, 0.0012, 0.003), { ...shade(shell, 0.8), roughness: 0.5, metalness: 0.35 }, at(0, deck - 0.0005, depth / 2 - 0.001));

  const keyboardWidth = LAPTOP_KEY_UNITS * LAPTOP_KEY_PITCH;
  const keyboardDepth = 5.5 * LAPTOP_KEY_PITCH;
  const keyboardZ = -depth / 2 + 0.017 + keyboardDepth / 2;
  b.add(new BoxGeometry(keyboardWidth + 0.006, 0.0004, keyboardDepth + 0.006), well, at(0, deck, keyboardZ));
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
    b.add(new BoxGeometry(grilleWidth, 0.0004, keyboardDepth), { color: new Color('#16181c'), roughness: 0.95, metalness: 0 }, at(sx * (keyboardWidth / 2 + 0.003 + grilleWidth / 2 + 0.0015), deck, keyboardZ));
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
