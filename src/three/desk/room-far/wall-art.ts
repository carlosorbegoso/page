import { BoxGeometry, Color, CylinderGeometry } from 'three';
import type { Finish, PartBuilder } from '../builder';
import { ROOM } from '../layout';
import type { Palette, Quality } from '../props';
import { seg } from '../props/geometry';
import { POSTER } from './layout';

const matte = (hex: string): Finish => ({ color: new Color(hex), roughness: 0.85, metalness: 0 });

const PRINT = {
  skyHigh: matte('#2c3a5a'),
  skyLow: matte('#c46a4a'),
  haze: matte('#e2a06a'),
  sun: matte('#f1d39a'),
  sea: matte('#1f3346'),
  cliff: matte('#14161b')
} as const;

function face(b: PartBuilder, finish: Finish, lift: number, y: number, z: number, height: number, width: number): void {
  b.add(new BoxGeometry(0.002, height, width), finish, { position: [ROOM.left + POSTER.depth * 0.5 + lift, POSTER.y + y, POSTER.z + z] });
}

function buildFrame(b: PartBuilder, p: Palette): void {
  const bar = 0.03;
  const x = ROOM.left + POSTER.depth / 2;
  const { width, height } = POSTER;
  for (const side of [-1, 1]) {
    b.add(new BoxGeometry(POSTER.depth, height, bar), p.frame, { position: [x, POSTER.y, POSTER.z + side * (width - bar) / 2] });
    b.add(new BoxGeometry(POSTER.depth, bar, width - 2 * bar), p.frame, { position: [x, POSTER.y + side * (height - bar) / 2, POSTER.z] });
  }
  face(b, p.paper, 0, 0, 0, height - 2 * bar, width - 2 * bar);
}

function buildPrint(b: PartBuilder, q: Quality): void {
  const w = POSTER.width - 0.16;
  face(b, PRINT.skyHigh, 0.002, 0.2, 0, 0.3, w);
  face(b, PRINT.skyLow, 0.002, -0.035, 0, 0.17, w);
  face(b, PRINT.haze, 0.002, -0.15, 0, 0.06, w);
  b.add(new CylinderGeometry(0.075, 0.075, 0.002, seg(28, q, 14)), PRINT.sun, {
    position: [ROOM.left + POSTER.depth / 2 + 0.004, POSTER.y - 0.18, POSTER.z + 0.08],
    rotation: [0, 0, Math.PI / 2]
  });
  face(b, PRINT.sea, 0.006, -0.24, 0, 0.12, w);
  const cliffs = [0.3, 0.22, 0.15, 0.08];
  cliffs.forEach((h, i) => face(b, PRINT.cliff, 0.008, -0.3 + h / 2, -w / 2 + 0.05 + i * 0.1, h, 0.1));
  face(b, PRINT.cliff, 0.002, -0.355, 0, 0.01, w * 0.4);
}

export function buildPoster(b: PartBuilder, p: Palette, q: Quality): void {
  buildFrame(b, p);
  buildPrint(b, q);
}
