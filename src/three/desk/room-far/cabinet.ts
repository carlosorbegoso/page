import { BoxGeometry, Color, SphereGeometry } from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import type { Finish, PartBuilder } from '../builder';
import { ROOM } from '../layout';
import type { Palette, Quality } from '../props';
import { seeded, seg, shade } from '../props/geometry';
import { CABINET } from './layout';

const back = ROOM.right;
const frontX = back - CABINET.depth;
const centreX = back - CABINET.depth / 2;
const zMin = CABINET.z - CABINET.length / 2;
const zMax = CABINET.z + CABINET.length / 2;
const plinth = 0.06;
const shelfY = plinth + (CABINET.height - plinth) / 2;

function buildCarcass(b: PartBuilder, wood: Finish): void {
  const t = CABINET.board;
  const { depth, height, length } = CABINET;
  b.add(new RoundedBoxGeometry(depth + 0.01, t, length + 0.02, 1, 0.004), wood, { position: [centreX - 0.005, height - t / 2, CABINET.z] });
  for (const z of [zMin + t / 2, zMax - t / 2]) {
    b.add(new BoxGeometry(depth, height - t, t), wood, { position: [centreX, (height - t) / 2, z] });
  }
  for (const y of [plinth + t / 2, shelfY]) {
    b.add(new BoxGeometry(depth - 0.01, t, length - 2 * t), wood, { position: [centreX + 0.005, y, CABINET.z] });
  }
  b.add(new BoxGeometry(0.01, height - t, length - 2 * t), shade(wood, 0.7), { position: [back - 0.005, (height - t) / 2, CABINET.z] });
  b.add(new BoxGeometry(0.012, plinth, length - 2 * t), shade(wood, 0.5), { position: [frontX + 0.03, plinth / 2, CABINET.z] });
}

function bookRow(b: PartBuilder, covers: Finish[], floor: number, seed: number, count: number): void {
  const random = seeded(seed);
  let cursor = zMin + CABINET.board + 0.02;
  for (let i = 0; i < count; i++) {
    const thickness = 0.022 + random() * 0.03;
    const height = 0.2 + random() * 0.08;
    const depth = 0.17 + random() * 0.06;
    const lean = i === count - 1 ? 0.22 : 0;
    b.add(new RoundedBoxGeometry(depth, height, thickness, 1, 0.002), covers[Math.floor(random() * covers.length)]!, {
      position: [back - 0.03 - depth / 2, floor + height / 2 * Math.cos(lean), cursor + thickness / 2 + Math.sin(lean) * height / 2],
      rotation: [lean, 0, 0]
    });
    cursor += thickness + 0.002 + (lean ? height * 0.25 : 0);
  }
}

function buildTopStack(b: PartBuilder, covers: Finish[]): void {
  let y = CABINET.height;
  const random = seeded(41);
  for (let i = 0; i < 3; i++) {
    const thickness = 0.03 + random() * 0.02;
    b.add(new RoundedBoxGeometry(0.2 - i * 0.015, thickness, 0.27 - i * 0.02, 1, 0.003), covers[i]!, {
      position: [centreX - 0.01, y + thickness / 2, zMax - 0.2],
      rotation: [0, 0.12 * (i - 1), 0]
    });
    y += thickness;
  }
}

function buildDuck(b: PartBuilder, q: Quality): void {
  const yellow: Finish = { color: new Color('#e8b83a'), roughness: 0.35, metalness: 0 };
  const beak: Finish = { color: new Color('#d9762b'), roughness: 0.4, metalness: 0 };
  const eye: Finish = { color: new Color('#101216'), roughness: 0.3, metalness: 0 };
  const x = centreX - 0.04;
  const z = zMin + 0.22;
  const y = CABINET.height;
  b.add(new SphereGeometry(0.045, seg(14, q, 8), seg(10, q, 6)).scale(1.15, 0.8, 1), yellow, { position: [x, y + 0.036, z] });
  b.add(new SphereGeometry(0.03, seg(12, q, 8), seg(8, q, 6)), yellow, { position: [x - 0.03, y + 0.085, z] });
  b.add(new BoxGeometry(0.03, 0.01, 0.024), beak, { position: [x - 0.062, y + 0.08, z] });
  for (const side of [-1, 1]) {
    b.add(new SphereGeometry(0.005, 6, 4), eye, { position: [x - 0.05, y + 0.095, z + side * 0.014] });
  }
}

export function buildCabinet(b: PartBuilder, p: Palette, q: Quality): void {
  const covers = [p.paper, p.bookDark, p.bookBlue, shade(p.pot, 0.6), shade(p.plant, 0.75), p.folders.intercorp, p.folders.baufest];
  buildCarcass(b, p.wood);
  bookRow(b, covers, plinth + CABINET.board, 31, 14);
  bookRow(b, covers, shelfY + CABINET.board / 2, 37, 10);
  buildTopStack(b, covers);
  buildDuck(b, q);
}
