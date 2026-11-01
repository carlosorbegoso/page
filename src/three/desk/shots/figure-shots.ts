import { Vector3 } from 'three';
import { FIGURE_HEIGHT, FIGURES, PRODUCT_FIGURES, type FigureId } from '../layout';
import { TEXT_LEFT, type ShotContext } from './context';
import { storyShot } from './portrait-fit';
import { figurePoints, othersThan } from './protagonists';
import type { Framing, Setup } from './types';

type ProductId = (typeof PRODUCT_FIGURES)[number];

/**
 * Each product as a collectible on its plinth, right of its text. The camera looks along the
 * plinth at an angle so the neighbours recede in depth and the rack focus softens them.
 */
const PRODUCT_SETUP: Record<ProductId, { landscape: Setup; portrait: Setup; subjects: FigureId[] }> = {
  skymek: { landscape: { heading: 14, pitch: -10, distance: 0.44 }, portrait: { heading: 7, pitch: -18, distance: 0.4 }, subjects: ['skymek'] },
  /** Steeper, so the mug in front of Parati drops below the frame. */
  parati: { landscape: { heading: -12, pitch: -17, distance: 0.42 }, portrait: { heading: -6, pitch: -18, distance: 0.4 }, subjects: ['parati'] },
  /** Alfa stands right behind Ventixs, so it can only be framed whole with it, never cleanly out. */
  ventixs: { landscape: { heading: 6, pitch: -10, distance: 0.4 }, portrait: { heading: 3, pitch: -12, distance: 0.4 }, subjects: ['ventixs', 'alfa'] }
};
const COMPANY_LANDSCAPE: Setup = { heading: -4, pitch: -12, distance: 0.6 };
const COMPANY_PORTRAIT: Setup = { heading: -10, pitch: -16, distance: 0.78 };

function figureCentre(id: FigureId): Vector3 {
  return FIGURES[id].clone().add(new Vector3(0, FIGURE_HEIGHT[id] * 0.5, 0));
}

/** Portrait opens on the whole family on the plinth: the mother brand and its three products. */
export function companyShot(ctx: ShotContext): Framing {
  const alfaFocus = figureCentre('alfa');
  const layout = ctx.layoutFor(TEXT_LEFT);
  const place = { sx: layout.sx, sy: ctx.subjectY };
  return {
    ...storyShot(ctx, alfaFocus, COMPANY_LANDSCAPE, COMPANY_PORTRAIT, place, (Object.keys(FIGURES) as FigureId[]).flatMap(figurePoints)),
    focus: alfaFocus,
    panel: { name: 'company', ...layout.panel }
  };
}

export function productShots(ctx: ShotContext): Framing[] {
  return PRODUCT_FIGURES.map<Framing>(id => {
    const focus = figureCentre(id);
    const setup = PRODUCT_SETUP[id];
    const layout = ctx.layoutFor(TEXT_LEFT);
    const place = { sx: layout.sx, sy: ctx.portrait ? ctx.subjectY : 0.56 };
    return {
      ...storyShot(ctx, focus, setup.landscape, setup.portrait, place, setup.subjects.flatMap(figurePoints), othersThan(...setup.subjects)),
      focus,
      panel: { name: `product-${id}`, ...layout.panel }
    };
  });
}
