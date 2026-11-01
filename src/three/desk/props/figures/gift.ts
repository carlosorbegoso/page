import { BoxGeometry, CircleGeometry, CylinderGeometry, ExtrudeGeometry, Matrix4, Quaternion, Shape, SphereGeometry, TorusGeometry, Vector3, type BufferGeometry } from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { OBJECT_ID, PartBuilder, type Finish } from '../../builder';
import { FIGURES } from '../../layout';
import { between, seg, shade, UP } from '../geometry';
import type { Palette, Quality } from '../palette';
import { FRONT, standing } from './frame';

/** A flat ribbon end with a V cut, lying along +Z from the knot. */
function ribbonTail(width: number, length: number): ExtrudeGeometry {
  const notch = width * 0.45;
  const shape = new Shape();
  shape.moveTo(-width / 2, 0);
  shape.lineTo(width / 2, 0);
  shape.lineTo(width / 2, length);
  shape.lineTo(0, length - notch);
  shape.lineTo(-width / 2, length);
  shape.closePath();
  const thickness = 0.0011;
  return new ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false }).rotateX(Math.PI / 2).translate(0, thickness / 2, 0);
}

/** Parati: a pink lacquered gift box with a cream satin ribbon, a looped bow, a glowing seam under the lid and a card tag. */
export function buildGift(b: PartBuilder, p: Palette, q: Quality): void {
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
    const inner = new TorusGeometry(0.0052, 0.0017, seg(8, q, 5), seg(20, q, 10)).scale(1, 0.72, 1.25);
    b.add(inner, shade(p.giftRibbon, 0.92), at(new Matrix4().compose(new Vector3(side * 0.0058, top + 0.0046, 0.001), new Quaternion().setFromAxisAngle(FRONT, side * 0.75), new Vector3(1, 1, 1))), id);
    b.add(ribbonTail(0.0065, 0.022), p.giftRibbon, at(new Matrix4().compose(new Vector3(side * 0.002, top + 0.0007, 0.002), new Quaternion().setFromAxisAngle(UP, side * 0.55), new Vector3(1, 1, 1))), id);
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
