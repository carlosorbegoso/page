import { Vector3 } from 'three';
import { FIGURE_HEIGHT, FIGURES, PRODUCT_FIGURES, type FigureId } from '../layout';
import { boardCorners, cardCorners } from '../notes/layout';
import { TEXT_LEFT, type ShotContext } from './context';
import { storyShot } from './portrait-fit';
import { centreOf, figurePoints, othersThan } from './protagonists';
import type { Framing, Place, Setup } from './types';

type ProductId = (typeof PRODUCT_FIGURES)[number];

const PRODUCT_SETUP: Record<ProductId, { landscape: Setup; portrait: Setup; subjects: FigureId[] }> = {
  skymek: { landscape: { heading: 14, pitch: -10, distance: 0.44 }, portrait: { heading: 7, pitch: -18, distance: 0.4 }, subjects: ['skymek'] },
  parati: { landscape: { heading: -12, pitch: -17, distance: 0.42 }, portrait: { heading: -6, pitch: -18, distance: 0.4 }, subjects: ['parati'] },
  ventixs: { landscape: { heading: 6, pitch: -10, distance: 0.4 }, portrait: { heading: 3, pitch: -12, distance: 0.4 }, subjects: ['ventixs', 'alfa'] }
};
const COMPANY_LANDSCAPE: Setup = { heading: -8, pitch: -1, distance: 0.64 };
const COMPANY_PORTRAIT: Setup = { heading: -10, pitch: -16, distance: 0.78 };
const CENTRED: Place = { sx: 0.5, sy: 0.5 };
const COMPANY_PLACE: Place = { sx: 0.5, sy: 0.51 };

function figureCentre(id: FigureId): Vector3 {
  return FIGURES[id].clone().add(new Vector3(0, FIGURE_HEIGHT[id] * 0.5, 0));
}

function placeFor(ctx: ShotContext, landscape: Place): Place {
  return ctx.portrait ? { sx: 0.5, sy: ctx.subjectY } : landscape;
}

export function companyShot(ctx: ShotContext): Framing {
  const board = boardCorners();
  const points = [...board, ...figurePoints('alfa')];
  const aim = centreOf(points);
  const focus = figureCentre('alfa').lerp(centreOf(board), 0.5);
  const layout = ctx.layoutFor(TEXT_LEFT);
  const frame = storyShot(ctx, aim, COMPANY_LANDSCAPE, COMPANY_PORTRAIT, placeFor(ctx, COMPANY_PLACE), points, othersThan('alfa'));
  return { ...frame, aim: frame.aim ?? aim, focus, panel: { name: 'company', ...layout.panel } };
}

export function productShots(ctx: ShotContext): Framing[] {
  return PRODUCT_FIGURES.map<Framing>(id => {
    const focus = figureCentre(id);
    const setup = PRODUCT_SETUP[id];
    const points = [...setup.subjects.flatMap(figurePoints), ...cardCorners(id, 1)];
    const aim = centreOf([...figurePoints(id), ...cardCorners(id, 1)]);
    const layout = ctx.layoutFor(TEXT_LEFT);
    const frame = storyShot(ctx, aim, setup.landscape, setup.portrait, placeFor(ctx, CENTRED), points, othersThan(...setup.subjects));
    return { ...frame, aim: frame.aim ?? aim, focus, panel: { name: `product-${id}`, ...layout.panel } };
  });
}
