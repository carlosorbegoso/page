import {
  BoxGeometry,
  CircleGeometry,
  Color,
  CylinderGeometry,
  LatheGeometry,
  Matrix4,
  Quaternion,
  RingGeometry,
  SphereGeometry,
  TorusGeometry,
  Vector2,
  Vector3
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { doubleSided, OBJECT_ID, PartBuilder, type Finish, type Placement } from '../builder';
import { DESK, KEYBOARD, LAMP, LAPTOP, MONITOR, MUG, OPEN_FOLDER, PHONE } from '../layout';
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
