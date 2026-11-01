import { BoxGeometry, ExtrudeGeometry, Matrix4, Quaternion, Shape, SphereGeometry, TorusGeometry, Vector2, Vector3 } from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { OBJECT_ID, PartBuilder } from '../../builder';
import { FIGURES } from '../../layout';
import { seg, shade } from '../geometry';
import type { Palette, Quality } from '../palette';
import { FRONT, standing } from './frame';

/** Ventixs: a round chat bubble with its tail at the lower left and three typing dots, standing on a puck with a green light line. */
export function buildBurbu(b: PartBuilder, p: Palette, q: Quality): void {
  const id = OBJECT_ID.ventixs;
  const at = standing(FIGURES.ventixs, -0.26);
  const baseH = 0.007;
  b.add(new RoundedBoxGeometry(0.058, baseH, 0.026, seg(3, q, 2), 0.0028), p.burbuBase, at(new Matrix4().makeTranslation(0, baseH / 2, 0)), id);
  b.add(new BoxGeometry(0.05, 0.0012, 0.0006), p.burbuSignal, at(new Matrix4().makeTranslation(0, baseH * 0.5, 0.0131)), id);
  b.add(new BoxGeometry(0.052, 0.0007, 0.0007), p.brass, at(new Matrix4().makeTranslation(0, baseH - 0.0006, 0.0124)), id);

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
    const socket = new TorusGeometry(0.0044, 0.0007, seg(6, q, 4), seg(20, q, 10)).translate((i - 1) * 0.0125, 0, face - 0.0004);
    b.add(socket, { ...shade(p.burbuBody, 0.62), roughness: 0.6 }, at(lean), id);
  }
}
