import { Vector3 } from 'three';
import { FIGURE_HEIGHT, FIGURES, PRODUCT_FIGURES, type FigureId } from '../layout';
import { cardCorners } from '../notes/layout';
import { TEXT_LEFT, type ShotContext, type SideLayout } from './context';
import { clearOfText, placeBeside, type TextSide } from './beside-text';
import { storyShot } from './portrait-fit';
import { printedProductShot } from './printed-shots';
import { centreOf, figurePoints, othersThan } from './protagonists';
import type { Framing, Setup } from './types';

type ProductId = (typeof PRODUCT_FIGURES)[number];

interface ProductSetup {
  landscape: Setup;
  portrait: Setup;
  subjects: FigureId[];
  text: TextSide;
  cardInPortrait?: boolean;
}

const PRODUCT_SETUP: Record<ProductId, ProductSetup> = {
  skymek: {
    landscape: { heading: 8, pitch: -18, distance: 0.44 },
    portrait: { heading: 4, pitch: -20, distance: 0.3 },
    subjects: ['skymek'],
    text: 'left'
  },
  parati: {
    landscape: { heading: -14, pitch: -36, distance: 0.45 },
    portrait: { heading: -4, pitch: -34, distance: 0.34 },
    subjects: ['parati'],
    text: 'right'
  },
  ventixs: {
    landscape: { heading: -6, pitch: -26, distance: 0.4 },
    portrait: { heading: -2, pitch: -14, distance: 0.4 },
    subjects: ['ventixs', 'alfa'],
    text: 'right',
    cardInPortrait: true
  }
};

const TEXT_RIGHT: SideLayout = { panel: { sx: 1 - TEXT_LEFT.panel.sx, sy: TEXT_LEFT.panel.sy }, subject: 1 - TEXT_LEFT.subject };

function figureCentre(id: FigureId): Vector3 {
  return FIGURES[id].clone().add(new Vector3(0, FIGURE_HEIGHT[id] * 0.5, 0));
}

function framedPoints(ctx: ShotContext, id: ProductId, setup: ProductSetup): { points: Vector3[]; aim: Vector3 } {
  const card = ctx.portrait && !setup.cardInPortrait ? [] : cardCorners(id, 1);
  const points = [...setup.subjects.flatMap(figurePoints), ...card];
  return { points, aim: centreOf(ctx.portrait ? [...figurePoints(id), ...card] : points) };
}

function productShot(ctx: ShotContext, id: ProductId): Framing {
  if (ctx.stacked) return printedProductShot(ctx, id);
  const setup = PRODUCT_SETUP[id];
  const { points, aim } = framedPoints(ctx, id, setup);
  const place = ctx.portrait ? { sx: 0.5, sy: ctx.subjectY } : placeBeside(ctx, setup.text, { sx: 0.5, sy: 0.5 });
  const landscape = clearOfText(ctx, setup.text, aim, setup.landscape, points);
  const frame = storyShot(ctx, aim, landscape, setup.portrait, place, points, othersThan(...setup.subjects));
  const layout = ctx.layoutFor(setup.text === 'left' ? TEXT_LEFT : TEXT_RIGHT);
  return { ...frame, aim: frame.aim ?? aim, focus: figureCentre(id), panel: { name: `product-${id}`, ...layout.panel } };
}

export function productShots(ctx: ShotContext): Framing[] {
  return PRODUCT_FIGURES.map(id => productShot(ctx, id));
}
