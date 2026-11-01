import type { Vector3 } from 'three';
import { HUD_HEIGHT, type ShotContext } from './context';
import { eyeFor } from './math';
import { fitDistance, projector, screenBox } from './projection';
import { centreOf } from './protagonists';
import type { Place, Region, Setup } from './types';

export const FRAME_MARGIN = 0.07;
const CENTRING_PASSES = 3;

export type Facing = Omit<Setup, 'distance'>;
export type BoxFrame = { eye: Vector3; aim: Vector3; sx: number; sy: number };

export function boxRegion(ctx: ShotContext, margin = FRAME_MARGIN): Region {
  return { left: margin, right: 1 - margin, top: Math.max(margin, HUD_HEIGHT / ctx.view.height), bottom: 1 - margin };
}

export function boxShot(ctx: ShotContext, facing: Facing, points: Vector3[], nearest = 0.05, region = boxRegion(ctx)): BoxFrame {
  const aim = centreOf(points);
  const place: Place = { sx: (region.left + region.right) / 2, sy: (region.top + region.bottom) / 2 };
  const frameAt = (distance: number): BoxFrame => ({ eye: eyeFor(aim, facing.heading, facing.pitch, distance), aim, ...place });
  for (let pass = 0; pass < CENTRING_PASSES; pass++) {
    const frame = frameAt(fitDistance(aim, facing, place, points, region, ctx.view, nearest));
    const seen = screenBox(points.map(projector({ ...frame, focus: aim }, ctx.view)));
    if (!seen) break;
    place.sx += (region.left + region.right - seen.left - seen.right) / 2;
    place.sy += (region.top + region.bottom - seen.top - seen.bottom) / 2;
  }
  return frameAt(fitDistance(aim, facing, place, points, region, ctx.view, nearest));
}
