import { Vector3 } from 'three';
import { FIGURE_HEIGHT, FIGURES, type FigureId } from '../layout';
import { boardCorners } from '../notes/layout';
import { TEXT_LEFT, type ShotContext } from './context';
import { storyShot } from './portrait-fit';
import { centreOf, figurePoints, othersThan } from './protagonists';
import type { Framing, Place, Setup } from './types';

const COMPANY_LANDSCAPE: Setup = { heading: -8, pitch: -1, distance: 0.64 };
const COMPANY_PORTRAIT: Setup = { heading: -10, pitch: -16, distance: 0.78 };
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
