import { CapsuleGeometry, CylinderGeometry, LatheGeometry, Matrix4, Quaternion, SphereGeometry, SplineCurve, TorusGeometry, Vector2, Vector3 } from 'three';
import { OBJECT_ID, PartBuilder, type Finish } from '../../builder';
import { FIGURES } from '../../layout';
import { seg } from '../geometry';
import type { Palette, Quality } from '../palette';
import { FRONT, sphereDirection, standing } from './frame';

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

function buildAlfaHead(b: PartBuilder, p: Palette, q: Quality, at: (m: Matrix4) => Matrix4): void {
  const id = OBJECT_ID.alfa;
  const place = (x: number, y: number, z: number) => at(new Matrix4().makeTranslation(x, y, z));
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

export function buildAlfa(b: PartBuilder, p: Palette, q: Quality): void {
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
  buildAlfaHead(b, p, q, at);
}
