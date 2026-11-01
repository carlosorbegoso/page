import { BoxGeometry, ExtrudeGeometry, Matrix4, Path, Quaternion, Shape, Vector3 } from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { OBJECT_ID, PartBuilder } from '../../builder';
import { FIGURES } from '../../layout';
import { seg, shade, UP } from '../geometry';
import type { Palette, Quality } from '../palette';

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

export function buildSkyMek(b: PartBuilder, p: Palette, q: Quality): void {
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
  const lean = new Matrix4().multiplyMatrices(
    base,
    new Matrix4().compose(new Vector3(0, 0.026, 0), new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), -0.05).multiply(new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), -0.28)), new Vector3(1, 1, 1))
  );
  b.add(wrench, p.toolBody, lean, OBJECT_ID.skymek);
  b.add(new RoundedBoxGeometry(0.012, 0.0165, 0.0084, 2, 0.002), p.toolBand, new Matrix4().multiplyMatrices(lean, new Matrix4().makeTranslation(0.022, 0, 0)), OBJECT_ID.skymek);
  b.add(new BoxGeometry(0.03, 0.005, 0.0008), shade(p.brass, 0.85), new Matrix4().multiplyMatrices(base, new Matrix4().makeTranslation(-0.004, 0.005, 0.0104)), OBJECT_ID.skymek);
  b.add(new BoxGeometry(0.038, 0.0016, 0.0004), p.toolSignal, new Matrix4().multiplyMatrices(lean, new Matrix4().makeTranslation(-0.004, 0, 0.0034)), OBJECT_ID.skymek);
}
