import { Vector3, type Matrix4 } from 'three';
import { takenSheetCorners } from '../folder-detail/open-sheet-pose';
import { boardCorners, boardFaceMatrix, cardCorners, cardFaceMatrix, type ProductId } from '../notes/layout';
import type { ShotContext } from './context';
import { DEG, eyeFor } from './math';
import { fitDistance } from './projection';
import { centreOf, takenSheetPoints } from './protagonists';
import type { Framing, Region, Setup } from './types';

export const PRINT_FILL = 0.9;
export const HUD_CLEAR_PX = 124;
const PRINT_Y = 0.52;
const SHEET_FACING = { heading: -10, pitch: -24 } as const;
const BOARD_PITCH = -20;
const SHEET_PASSES = 3;

type Facing = Omit<Setup, 'distance'>;

export function printRegion(ctx: ShotContext): Region {
  return { left: (1 - PRINT_FILL) / 2, right: (1 + PRINT_FILL) / 2, top: HUD_CLEAR_PX / ctx.view.height, bottom: 0.97 };
}

function facingOf(face: Matrix4): Facing {
  const normal = new Vector3(0, 0, 1).transformDirection(face);
  return { heading: Math.atan2(-normal.x, normal.z) / DEG, pitch: Math.asin(-normal.y) / DEG };
}

function frontOn(ctx: ShotContext, corners: Vector3[], facing: Facing, panel: string): Framing {
  const aim = centreOf(corners);
  const place = { sx: 0.5, sy: PRINT_Y };
  const distance = fitDistance(aim, facing, place, corners, printRegion(ctx), ctx.view, 0.05);
  return { eye: eyeFor(aim, facing.heading, facing.pitch, distance), aim, focus: aim, ...place, panel: { name: panel, ...ctx.panelDocked } };
}

export function printedCompanyShot(ctx: ShotContext): Framing {
  return frontOn(ctx, boardCorners(), { ...facingOf(boardFaceMatrix()), pitch: BOARD_PITCH }, 'company');
}

type ProductShot = (ctx: ShotContext, id: ProductId) => Framing;

let stackedProductShot: ProductShot | null = null;

export function useStackedProductShot(shot: ProductShot): void {
  stackedProductShot = shot;
}

export function printedShotsKey(): string {
  return stackedProductShot ? 'staged' : '';
}

export function printedProductShot(ctx: ShotContext, id: ProductId): Framing {
  if (stackedProductShot) return stackedProductShot(ctx, id);
  return frontOn(ctx, cardCorners(id, 1), facingOf(cardFaceMatrix(id, 1, null)), `product-${id}`);
}

export function printedSheetShot(ctx: ShotContext, panel: string): Framing {
  let eye = eyeFor(centreOf(takenSheetPoints()), SHEET_FACING.heading, SHEET_FACING.pitch, 0.5);
  let shot = frontOn(ctx, takenSheetCorners(eye), SHEET_FACING, panel);
  for (let pass = 1; pass < SHEET_PASSES; pass++) {
    eye = shot.eye;
    shot = frontOn(ctx, takenSheetCorners(eye), SHEET_FACING, panel);
  }
  return shot;
}
