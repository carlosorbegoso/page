import type { Vector3 } from 'three';
import { cardCorners, type ProductId } from '../notes/layout';
import { STACKED_CARDS } from '../notes/stacked/places';
import type { ShotContext } from './context';
import { eyeFor } from './math';
import { HUD_CLEAR_PX, printRegion } from './printed-shots';
import { fitDistance, projector } from './projection';
import { centreOf, figurePoints } from './protagonists';
import type { Framing } from './types';

const PITCH = { from: -15, to: -45 } as const;
const FILL = 0.92;
const GAP = 0.006;
const HUD_MARGIN = 0.01;
const CENTRING_PASSES = 6;
const NEAREST = 0.15;

function centredAbove(ctx: ShotContext, points: Vector3[], pitch: number): Framing {
  const region = { ...printRegion(ctx), left: (1 - FILL) / 2, right: (1 + FILL) / 2, top: HUD_CLEAR_PX / ctx.view.height + HUD_MARGIN };
  const aim = centreOf(points);
  const facing = { heading: 0, pitch };
  const place = { sx: 0.5, sy: (region.top + region.bottom) / 2 };
  let framing: Framing = { eye: aim, aim, focus: aim, ...place };
  for (let pass = 0; pass < CENTRING_PASSES; pass++) {
    const distance = fitDistance(aim, facing, place, points, region, ctx.view, NEAREST);
    framing = { eye: eyeFor(aim, 0, pitch, distance), aim, focus: aim, ...place };
    const project = projector(framing, ctx.view);
    const ys = points.flatMap(point => project(point)?.y ?? []);
    place.sy += (region.top - Math.min(...ys) + region.bottom - Math.max(...ys)) / 2;
  }
  return { ...framing, ...place };
}

function figureClearsCard(framing: Framing, ctx: ShotContext, figure: Vector3[], card: Vector3[]): boolean {
  const project = projector(framing, ctx.view);
  const ys = (points: Vector3[]) => points.map(point => project(point)?.y ?? Infinity);
  return Math.max(...ys(figure)) <= Math.min(...ys(card)) - GAP;
}

export function stackedProductShot(ctx: ShotContext, id: ProductId): Framing {
  const card = cardCorners(id, 1, STACKED_CARDS);
  const figure = figurePoints(id);
  let framing = centredAbove(ctx, [...card, ...figure], PITCH.from);
  for (let pitch = PITCH.from - 1; pitch >= PITCH.to && !figureClearsCard(framing, ctx, figure, card); pitch--) {
    framing = centredAbove(ctx, [...card, ...figure], pitch);
  }
  return { ...framing, focus: centreOf(card), panel: { name: `product-${id}`, ...ctx.panelDocked } };
}
