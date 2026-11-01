import type { Vector3 } from 'three';
import { CHARIZARD, PIKACHU } from '../layout';
import { monitorCorners } from './about-shots';
import type { ShotContext } from './context';
import { projector, screenBox } from './projection';
import type { Framing } from './types';

// The stage canvas is 100lvh: phone toolbars hide roughly its bottom tenth.
const VISIBLE_BOTTOM = 0.9;
const PASSES = 3;

export function centreMonitorGroup(ctx: ShotContext, framing: Framing): Framing {
  const group: Vector3[] = [...monitorCorners(ctx), CHARIZARD.base, PIKACHU.base];
  const target = (ctx.stage.top + VISIBLE_BOTTOM) / 2;
  let sy = framing.sy;
  for (let pass = 0; pass < PASSES; pass++) {
    const box = screenBox(group.map(projector({ ...framing, sy }, ctx.view)));
    if (!box) break;
    sy -= (box.top + box.bottom) / 2 - target;
  }
  return { ...framing, sy };
}
