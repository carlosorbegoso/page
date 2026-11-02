import { BoxGeometry, Color, CylinderGeometry } from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import type { Finish, PartBuilder } from '../builder';
import type { Palette, Quality } from '../props';
import { seg, shade } from '../props/geometry';
import { COAT_RAIL, FRONT_FACE, RUG } from './layout';

export function buildRug(b: PartBuilder, p: Palette): void {
  const wool: Finish = { color: shade(p.fabric, 1.5, 0.12).color, roughness: 1, metalness: 0, surface: 'weave', detail: 0.3 };
  const border: Finish = { color: shade(p.pot, 0.55).color, roughness: 1, metalness: 0, surface: 'weave', detail: 0.3 };
  const stripe: Finish = { color: shade(p.pot, 0.4).color, roughness: 1, metalness: 0, surface: 'weave', detail: 0.3 };
  const base = 0.003;
  b.add(new BoxGeometry(RUG.width, RUG.height, RUG.length), border, { position: [RUG.x, base + RUG.height / 2, RUG.z] });
  b.add(new BoxGeometry(RUG.width - 0.16, 0.002, RUG.length - 0.16), wool, { position: [RUG.x, base + RUG.height + 0.001, RUG.z] });
  for (const offset of [-0.3, 0, 0.3]) {
    b.add(new BoxGeometry(RUG.width - 0.26, 0.002, 0.03), stripe, { position: [RUG.x, base + RUG.height + 0.002, RUG.z + offset] });
  }
}

function buildRail(b: PartBuilder, p: Palette, q: Quality): number[] {
  const z = FRONT_FACE - 0.012;
  b.add(new RoundedBoxGeometry(COAT_RAIL.length, 0.07, 0.024, 1, 0.006), p.wood, { position: [COAT_RAIL.x, COAT_RAIL.y, z] });
  const pegs = [-0.2, 0, 0.2].map(dx => COAT_RAIL.x + dx);
  for (const x of pegs) {
    b.add(new CylinderGeometry(0.009, 0.009, 0.07, seg(10, q, 6)), p.brass, {
      position: [x, COAT_RAIL.y - 0.005, z - 0.045],
      rotation: [Math.PI / 2 - 0.35, 0, 0]
    });
  }
  return pegs;
}

function buildHoodie(b: PartBuilder, x: number, q: Quality): void {
  const cotton: Finish = { color: new Color('#3a4150'), roughness: 0.95, metalness: 0, surface: 'weave', detail: 0.85 };
  const seam = shade(cotton, 0.8);
  const z = FRONT_FACE - 0.07;
  const top = COAT_RAIL.y - 0.03;
  const r = seg(3, q, 2);
  b.add(new RoundedBoxGeometry(0.24, 0.22, 0.1, r, 0.04), cotton, { position: [x, top - 0.05, z + 0.01], rotation: [-0.15, 0, 0] });
  b.add(new RoundedBoxGeometry(0.44, 0.6, 0.09, r, 0.035), cotton, { position: [x, top - 0.42, z + 0.02] });
  for (const side of [-1, 1]) {
    b.add(new RoundedBoxGeometry(0.1, 0.56, 0.08, r, 0.03), cotton, {
      position: [x + side * 0.235, top - 0.43, z + 0.025],
      rotation: [0, 0, side * 0.08]
    });
  }
  b.add(new BoxGeometry(0.24, 0.13, 0.006), seam, { position: [x, top - 0.6, z - 0.026] });
  b.add(new BoxGeometry(0.4, 0.05, 0.096), seam, { position: [x, top - 0.71, z + 0.02] });
  for (const side of [-1, 1]) {
    b.add(new CylinderGeometry(0.003, 0.003, 0.14, 5), shade(cotton, 1.6), { position: [x + side * 0.035, top - 0.24, z - 0.04] });
  }
}

export function buildCoatRail(b: PartBuilder, p: Palette, q: Quality): void {
  const pegs = buildRail(b, p, q);
  buildHoodie(b, pegs[1]!, q);
}
