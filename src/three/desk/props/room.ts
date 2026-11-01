import {
  BoxGeometry,
  CylinderGeometry,
  Matrix4,
  Quaternion,
  SphereGeometry,
  TorusGeometry,
  Vector3
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { OBJECT_ID, PartBuilder } from '../builder';
import {
  CHAIR,
  DESK,
  FOLDER,
  FOLDERS,
  GLASS_Z,
  ROOM,
  SHELF,
  WINDOW,
  folderCentre
} from '../layout';
import { SPINE_LABEL } from '../spines';
import { rod, seeded, seg, shade, UP } from './geometry';
import type { Palette, Quality } from './palette';

function windowEdges() {
  return {
    left: WINDOW.x - WINDOW.width / 2,
    right: WINDOW.x + WINDOW.width / 2,
    bottom: WINDOW.y - WINDOW.height / 2,
    top: WINDOW.y + WINDOW.height / 2
  };
}

function buildFloor(b: PartBuilder, p: Palette): void {
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
}

function buildWalls(b: PartBuilder, p: Palette): void {
  const t = ROOM.wallThickness;
  const length = ROOM.front - ROOM.back;
  const backZ = ROOM.back - t / 2;
  const { left, right, bottom, top } = windowEdges();
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
}

function buildWindowFrame(b: PartBuilder, p: Palette): void {
  const { left, right, bottom, top } = windowEdges();
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

export function buildRoom(b: PartBuilder, p: Palette): void {
  buildFloor(b, p);
  buildWalls(b, p);
  buildWindowFrame(b, p);
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
