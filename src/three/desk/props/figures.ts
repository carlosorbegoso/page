import {
  BoxGeometry,
  CapsuleGeometry,
  CircleGeometry,
  CylinderGeometry,
  ExtrudeGeometry,
  LatheGeometry,
  Matrix4,
  Path,
  Quaternion,
  Shape,
  SphereGeometry,
  SplineCurve,
  TorusGeometry,
  Vector2,
  Vector3,
  type BufferGeometry
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { OBJECT_ID, PartBuilder, type Finish } from '../builder';
import { FIGURES, PLINTH } from '../layout';
import { between, seg, UP } from './geometry';
import type { Palette, Quality } from './palette';

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

/**
 * Base ring, waist groove, chest bezel and arms. Everything stays below the neck (6.7 cm) and only the
 * chest light glows, because `life/classify` turns anything higher with the head and treats glow there as eyes.
 */
function buildAlfaBodyDetails(
  b: PartBuilder,
  p: Palette,
  q: Quality,
  at: (m: Matrix4) => Matrix4,
  radiusAt: (y: number) => number,
  chestY: number,
  chestR: number
): void {
  const id = OBJECT_ID.alfa;
  const flat = (y: number, sx = 1, sz = 0.9) =>
    at(new Matrix4().compose(new Vector3(0, y, 0), new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), Math.PI / 2), new Vector3(sx, sz, 1)));
  const satin: Finish = { ...p.alfaVisor, roughness: 0.35, metalness: 0.2 };
  b.add(new CylinderGeometry(0.0212, 0.0222, 0.0036, seg(32, q, 16)).scale(1, 1, 0.9), satin, at(new Matrix4().makeTranslation(0, 0.0018, 0)), id);
  const waistY = 0.021;
  b.add(new TorusGeometry(radiusAt(waistY) + 0.0001, 0.00055, seg(6, q, 4), seg(48, q, 24)), satin, flat(waistY), id);
  b.add(new TorusGeometry(0.0058, 0.0008, seg(8, q, 5), seg(24, q, 12)), p.alfaRing, at(new Matrix4().makeTranslation(0, chestY, chestR + 0.0004)), id);
  const shoulderY = 0.047;
  const shoulderX = radiusAt(shoulderY) * 0.98;
  for (const side of [-1, 1]) {
    b.add(new SphereGeometry(0.0046, seg(12, q, 8), seg(10, q, 6)), p.alfaRing, at(new Matrix4().makeTranslation(side * shoulderX, shoulderY, 0)), id);
    const tilt = new Quaternion().setFromAxisAngle(FRONT, side * 0.22);
    const hang = new Vector3(0, -0.0125, 0).applyQuaternion(tilt).add(new Vector3(side * (shoulderX + 0.0042), shoulderY, 0));
    b.add(new CapsuleGeometry(0.0052, 0.016, seg(6, q, 4), seg(14, q, 8)), p.alfaBody, at(new Matrix4().compose(hang, tilt, new Vector3(1, 1, 0.9))), id);
  }
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

  const radiusAt = (y: number) => profile.reduce((best, point) => (Math.abs(point.y - y) < Math.abs(best.y - y) ? point : best)).x;
  const chestY = 0.032;
  const chestR = radiusAt(chestY) * 0.9;
  b.add(new SphereGeometry(0.0042, seg(14, q, 8), seg(10, q, 6)).scale(1, 1, 0.35), p.alfaSignal, place(0, chestY, chestR), id);
  buildAlfaBodyDetails(b, p, q, at, radiusAt, chestY, chestR);

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
