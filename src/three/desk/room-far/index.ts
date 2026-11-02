import type { BufferGeometry } from 'three';
import { PartBuilder } from '../builder';
import type { Palette, Quality } from '../props';
import { buildCabinet } from './cabinet';
import { buildCeiling } from './ceiling';
import { buildFrontWall } from './front-wall';
import { buildCoatRail, buildRug } from './textiles';
import { buildPoster } from './wall-art';

export function buildRoomFar(palette: Palette, q: Quality): BufferGeometry {
  const b = new PartBuilder();
  buildFrontWall(b, palette, q);
  buildCeiling(b, palette, q);
  buildCabinet(b, palette, q);
  buildPoster(b, palette, q);
  buildRug(b, palette);
  buildCoatRail(b, palette, q);
  return b.build();
}
