import { FIGURES, MUG } from '../layout';
import { OBJECT_ID } from '../builder';
import type { Palette } from '../props';
import { sameColor, type TriangleInfo } from './rig';

const ALFA_HEAD_Y = 0.0885;
const ALFA_NECK_Y = 0.067;
const ALFA_ANTENNA_Y = 0.12;
const GIFT_LID_Y = 0.0445;
const GIFT_SEAM_BAND = 0.0428;
const MUG_REACH = 0.075;
const MUG_HEIGHT = 0.11;

/** Names the moving part a triangle of the figures geometry belongs to (null = it stays put). */
export function figureParts(palette: Palette): (info: TriangleInfo) => string | null {
  return ({ oid, centroid, color, emissive, normal }) => {
    if (oid === OBJECT_ID.alfa) {
      const h = centroid.y - FIGURES.alfa.y;
      if (h <= ALFA_NECK_Y) return null;
      if (emissive > 0 && h > ALFA_ANTENNA_Y) return 'alfaAntenna';
      if (emissive > 0 && Math.abs(h - ALFA_HEAD_Y) < 0.012) return 'alfaEyes';
      return 'alfaHead';
    }
    if (oid === OBJECT_ID.parati) {
      const h = centroid.y - FIGURES.parati.y;
      if (sameColor(color, palette.giftSeam.color) || h < GIFT_SEAM_BAND) return null;
      return h > GIFT_LID_Y || normal.y < 0.4 ? 'giftLid' : null;
    }
    if (oid === OBJECT_ID.ventixs) return sameColor(color, palette.burbuDots.color) ? 'bubbleDots' : null;
    if (oid === OBJECT_ID.skymek) return [palette.toolBody, palette.toolBand, palette.toolSignal].some(finish => sameColor(color, finish.color)) ? 'wrench' : null;
    return null;
  };
}

/** Picks the coffee mug (body, handle, coffee) out of the workstation geometry. */
export function mugPart({ oid, centroid }: TriangleInfo): string | null {
  if (oid !== OBJECT_ID.none) return null;
  const h = centroid.y - MUG.y;
  return h > -0.001 && h < MUG_HEIGHT && Math.hypot(centroid.x - MUG.x, centroid.z - MUG.z) < MUG_REACH ? 'mug' : null;
}
