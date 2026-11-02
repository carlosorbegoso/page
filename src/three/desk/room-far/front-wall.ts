import { BoxGeometry, CylinderGeometry } from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import type { Finish, PartBuilder } from '../builder';
import { ROOM } from '../layout';
import type { Palette, Quality } from '../props';
import { seg, shade } from '../props/geometry';
import { DOOR, FRONT_FACE, LIGHT_SWITCH } from './layout';

const doorLeft = DOOR.x - DOOR.width / 2;
const doorRight = DOOR.x + DOOR.width / 2;

function buildWallPanels(b: PartBuilder, wall: Finish): void {
  const t = ROOM.wallThickness;
  const z = FRONT_FACE + t / 2;
  const left = ROOM.left - t;
  const right = ROOM.right + t;
  b.add(new BoxGeometry(doorLeft - left, ROOM.height, t), wall, { position: [(left + doorLeft) / 2, ROOM.height / 2, z] });
  b.add(new BoxGeometry(right - doorRight, ROOM.height, t), wall, { position: [(doorRight + right) / 2, ROOM.height / 2, z] });
  b.add(new BoxGeometry(DOOR.width, ROOM.height - DOOR.height, t), wall, {
    position: [DOOR.x, (DOOR.height + ROOM.height) / 2, z]
  });
}

function buildCasing(b: PartBuilder, trim: Finish): void {
  const c = DOOR.casing;
  const z = FRONT_FACE - 0.008;
  b.add(new BoxGeometry(c, DOOR.height + c, 0.016), trim, { position: [doorLeft - c / 2, (DOOR.height + c) / 2, z] });
  b.add(new BoxGeometry(c, DOOR.height + c, 0.016), trim, { position: [doorRight + c / 2, (DOOR.height + c) / 2, z] });
  b.add(new BoxGeometry(DOOR.width + 2 * c, c, 0.018), trim, { position: [DOOR.x, DOOR.height + c / 2, z] });
  const jamb = ROOM.wallThickness;
  const jambZ = FRONT_FACE + jamb / 2;
  b.add(new BoxGeometry(0.012, DOOR.height, jamb), trim, { position: [doorLeft + 0.006, DOOR.height / 2, jambZ] });
  b.add(new BoxGeometry(0.012, DOOR.height, jamb), trim, { position: [doorRight - 0.006, DOOR.height / 2, jambZ] });
  b.add(new BoxGeometry(DOOR.width, 0.012, jamb), trim, { position: [DOOR.x, DOOR.height - 0.006, jambZ] });
}

function buildDoorLeaf(b: PartBuilder, p: Palette, q: Quality): void {
  const width = DOOR.width - 0.03;
  const height = DOOR.height - 0.03;
  const z = FRONT_FACE + 0.035;
  const leaf = shade(p.wall, 1.55, 0.04);
  b.add(new BoxGeometry(width, height, DOOR.leaf), leaf, { position: [DOOR.x, 0.014 + height / 2, z] });
  for (const [y, h] of [[0.18, 0.78], [1.06, 0.84]] as const) {
    b.add(new BoxGeometry(width - 0.2, h, 0.008), shade(leaf, 0.92), { position: [DOOR.x, y + h / 2, z - DOOR.leaf / 2 - 0.004] });
  }
  const hallway: Finish = { color: p.diffuser.color.clone().multiplyScalar(0.6), roughness: 1, metalness: 0, emissive: 0.5 };
  b.add(new BoxGeometry(width, 0.018, 0.01), hallway, { position: [DOOR.x, 0.009, z + DOOR.leaf / 2 + 0.01] });
  const knobX = doorRight - 0.09;
  const faceZ = z - DOOR.leaf / 2;
  b.add(new CylinderGeometry(0.026, 0.026, 0.01, seg(16, q, 8)), p.brass, { position: [knobX, 1.0, faceZ - 0.005], rotation: [Math.PI / 2, 0, 0] });
  b.add(new CylinderGeometry(0.008, 0.008, 0.05, seg(8, q, 6)), p.brass, { position: [knobX, 1.0, faceZ - 0.03], rotation: [Math.PI / 2, 0, 0] });
  b.add(new RoundedBoxGeometry(0.12, 0.018, 0.018, 1, 0.006), p.brass, { position: [knobX - 0.05, 1.0, faceZ - 0.055] });
}

function buildSwitch(b: PartBuilder, p: Palette): void {
  const z = FRONT_FACE - 0.005;
  b.add(new RoundedBoxGeometry(0.08, 0.12, 0.01, 1, 0.003), p.ceramic, { position: [LIGHT_SWITCH.x, LIGHT_SWITCH.y, z] });
  b.add(new RoundedBoxGeometry(0.03, 0.05, 0.01, 1, 0.003), shade(p.ceramic, 0.9), {
    position: [LIGHT_SWITCH.x, LIGHT_SWITCH.y, z - 0.006],
    rotation: [0.12, 0, 0]
  });
}

function buildFrontSkirting(b: PartBuilder, skirting: Finish): void {
  const z = FRONT_FACE - 0.006;
  const leftEnd = doorLeft - DOOR.casing;
  const rightEnd = doorRight + DOOR.casing;
  b.add(new BoxGeometry(leftEnd - ROOM.left, 0.07, 0.012), skirting, { position: [(ROOM.left + leftEnd) / 2, 0.035, z] });
  b.add(new BoxGeometry(ROOM.right - rightEnd, 0.07, 0.012), skirting, { position: [(rightEnd + ROOM.right) / 2, 0.035, z] });
}

export function buildFrontWall(b: PartBuilder, p: Palette, q: Quality): void {
  const trim = shade(p.wall, 1.4);
  buildWallPanels(b, shade(p.wall, 0.8));
  buildCasing(b, trim);
  buildDoorLeaf(b, p, q);
  buildSwitch(b, p);
  buildFrontSkirting(b, shade(p.wall, 1.25));
}
