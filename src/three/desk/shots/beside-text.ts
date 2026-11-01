import type { Vector3 } from 'three';
import { layoutKind } from '../../scenes/common';
import type { ShotContext } from './context';
import { fitDistance } from './projection';
import type { Place, Region, Setup } from './types';

export type TextSide = 'left' | 'right';

const BESIDE_TEXT = {
  left: { place: { sx: 0.78, sy: 0.52 }, left: 0.57, right: 0.96 },
  right: { place: { sx: 0.24, sy: 0.44 }, left: 0.04, right: 0.43 }
} as const;

function textBeside(ctx: ShotContext): boolean {
  return layoutKind(ctx.view.width) === 'desktop';
}

export function placeBeside(ctx: ShotContext, side: TextSide, below: Place): Place {
  return textBeside(ctx) ? BESIDE_TEXT[side].place : below;
}

export function clearOfText(ctx: ShotContext, side: TextSide, aim: Vector3, setup: Setup, points: Vector3[]): Setup {
  if (ctx.portrait || !textBeside(ctx)) return setup;
  const { place, left, right } = BESIDE_TEXT[side];
  const region: Region = { left, right, top: ctx.stage.top + 0.04, bottom: 0.94 };
  return { ...setup, distance: fitDistance(aim, setup, place, points, region, ctx.view, setup.distance) };
}
