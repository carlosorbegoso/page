import { BoxGeometry, ExtrudeGeometry, Matrix4, Quaternion, Shape, SphereGeometry, TorusGeometry, Vector2, Vector3 } from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { OBJECT_ID, PartBuilder } from '../../builder';
import { FIGURES } from '../../layout';
import { seg, shade } from '../geometry';
import type { Palette, Quality } from '../palette';
import { FRONT, standing } from './frame';

const PUCK_HEIGHT = 0.007;
const BUBBLE = { radius: 0.027, bevel: 0.0026, depth: 0.011, tip: new Vector2(-0.029, -0.031) } as const;
const TAIL_START = (250 * Math.PI) / 180;
const TAIL_END = (196 * Math.PI) / 180;

type At = (m: Matrix4) => Matrix4;

function buildPuck(b: PartBuilder, p: Palette, q: Quality, at: At): void {
  const id = OBJECT_ID.ventixs;
  b.add(new RoundedBoxGeometry(0.058, PUCK_HEIGHT, 0.026, seg(3, q, 2), 0.0028), p.burbuBase, at(new Matrix4().makeTranslation(0, PUCK_HEIGHT / 2, 0)), id);
  b.add(new BoxGeometry(0.05, 0.0012, 0.0006), p.burbuSignal, at(new Matrix4().makeTranslation(0, PUCK_HEIGHT * 0.5, 0.0131)), id);
  b.add(new BoxGeometry(0.052, 0.0007, 0.0007), p.brass, at(new Matrix4().makeTranslation(0, PUCK_HEIGHT - 0.0006, 0.0124)), id);
}

function bubbleGeometry(q: Quality): ExtrudeGeometry {
  const { radius: r, bevel, depth, tip } = BUBBLE;
  const shape = new Shape();
  shape.moveTo(Math.cos(TAIL_START) * r, Math.sin(TAIL_START) * r);
  shape.absarc(0, 0, r, TAIL_START, TAIL_END + Math.PI * 2, false);
  shape.quadraticCurveTo(-r * 0.98, -r * 0.62, tip.x, tip.y);
  shape.quadraticCurveTo(-r * 0.62, -r * 0.98, Math.cos(TAIL_START) * r, Math.sin(TAIL_START) * r);
  const bubble = new ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSize: bevel,
    bevelThickness: 0.003,
    bevelSegments: seg(4, q, 2),
    curveSegments: seg(40, q, 18)
  }).translate(0, 0, -depth / 2);
  bubble.deleteAttribute('uv');
  return bubble;
}

function bubbleRestPose(): Matrix4 {
  const { radius: r, bevel, tip } = BUBBLE;
  const reach = Math.hypot(tip.x, tip.y) + bevel;
  const rest = Math.PI + Math.asin((r + bevel) / reach);
  const turn = rest - Math.atan2(tip.y, tip.x);
  return new Matrix4().compose(
    new Vector3(-(Math.cos(rest) * reach) / 2, PUCK_HEIGHT - 0.0008 + r + bevel, 0),
    new Quaternion().setFromAxisAngle(FRONT, turn),
    new Vector3(1, 1, 1)
  );
}

function buildDots(b: PartBuilder, p: Palette, q: Quality, onBubble: Matrix4): void {
  const id = OBJECT_ID.ventixs;
  const face = BUBBLE.depth / 2 + 0.003;
  for (let i = 0; i < 3; i++) {
    const dot = new SphereGeometry(0.0039, seg(14, q, 8), seg(10, q, 6)).scale(1, 1, 0.5).translate((i - 1) * 0.0125, 0, face);
    b.add(dot, p.burbuDots, onBubble, id);
    const socket = new TorusGeometry(0.0044, 0.0007, seg(6, q, 4), seg(20, q, 10)).translate((i - 1) * 0.0125, 0, face - 0.0004);
    b.add(socket, { ...shade(p.burbuBody, 0.62), roughness: 0.6 }, onBubble, id);
  }
}

export function buildBurbu(b: PartBuilder, p: Palette, q: Quality): void {
  const at = standing(FIGURES.ventixs, -0.26);
  buildPuck(b, p, q, at);
  const onBubble = at(bubbleRestPose());
  b.add(bubbleGeometry(q), p.burbuBody, onBubble, OBJECT_ID.ventixs);
  buildDots(b, p, q, onBubble);
}
