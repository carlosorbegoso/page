import { BoxGeometry } from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { PartBuilder } from '../../builder';
import { PLINTH } from '../../layout';
import type { Palette, Quality } from '../palette';
import { buildAlfa } from './alfa';
import { buildBurbu } from './burbu';
import { buildGift } from './gift';
import { buildSkyMek } from './skymek';

/** The walnut plinth and the four executive desk pieces (mascots.md §2–3). */
export function buildFigures(b: PartBuilder, p: Palette, q: Quality): void {
  const { centre, width, depth, height } = PLINTH;
  b.add(new RoundedBoxGeometry(width, height, depth, 2, 0.003), p.wood, { position: [centre.x, centre.y + height / 2, centre.z] });
  b.add(new BoxGeometry(width - 0.02, 0.004, 0.002), p.brass, { position: [centre.x, centre.y + height * 0.55, centre.z + depth / 2 + 0.0006] });

  buildAlfa(b, p, q);
  buildBurbu(b, p, q);
  buildGift(b, p, q);
  buildSkyMek(b, p, q);
}
