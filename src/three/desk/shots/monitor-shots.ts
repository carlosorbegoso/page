import { Plane, Vector3 } from 'three';
import { HERO_EYE, ROOM } from '../layout';
import { aboutPairShot, HERO_PLACE, heroFitDistance, stackedBioShot } from './about-shots';
import type { ShotContext } from './context';
import { clamp, DEG, heightFit, lerp, widthFit } from './math';
import type { Framing } from './types';

export function heroDistance(ctx: ShotContext): number {
  const { view, screenSpan, screenRise, t } = ctx;
  return lerp(
    heroFitDistance(ctx, clamp(widthFit(screenSpan, 0.5, view), 1.05, HERO_EYE.distanceTo(ctx.monitor.centre))),
    clamp(Math.max(widthFit(screenSpan, 0.8, view), heightFit(screenRise, 0.78, view)), 1.0, 2.3),
    t
  );
}

export function heroShot(ctx: ShotContext, distance: number): Framing {
  const screen = ctx.monitor.centre;
  return {
    eye: screen.clone().addScaledVector(ctx.monitor.normal, distance),
    focus: screen,
    sx: lerp(HERO_PLACE.sx, 0.5, ctx.t),
    sy: lerp(HERO_PLACE.sy, 0.5, ctx.t)
  };
}

export function aboutShot(ctx: ShotContext, heroDistance: number): Framing {
  const { view, screenSpan, screenRise, portrait } = ctx;
  const screen = ctx.monitor.centre;
  const aboutDistance = portrait
    ? clamp(Math.max(widthFit(screenSpan, 0.86, view), heightFit(screenRise, 0.86, view)), 0.7, heroDistance - 0.05)
    : clamp(widthFit(screenSpan, 0.7, view), 0.7, heroDistance - 0.25);
  const monitorOnly = { eye: screen.clone().addScaledVector(ctx.monitor.normal, aboutDistance), focus: screen, sx: 0.5, sy: portrait ? 0.48 : 0.5 };
  return aboutPairShot(ctx, monitorOnly);
}

export function contactShot(ctx: ShotContext): Framing {
  const { phone, t, lens, view } = ctx;
  const phoneDistance = lerp(0.42, clamp(widthFit(0.075, 0.82, view), 0.28 * lens, 0.5 * lens), t);
  return {
    eye: phone.centre.clone().addScaledVector(phone.normal, phoneDistance),
    focus: phone.centre,
    sx: 0.5,
    sy: ctx.portrait ? 0.48 : 0.5
  };
}

export function outroShot(ctx: ShotContext, hero: Framing, heroDistance: number): Framing {
  const screen = ctx.monitor.centre;
  const back = hero.eye.clone().sub(screen).normalize();
  return {
    eye: screen.clone().addScaledVector(back, Math.min(heroDistance + 0.08, 1.75)),
    focus: screen,
    sx: hero.sx,
    sy: hero.sy,
    panel: outroPanel(ctx)
  };
}

export function outroPanel(ctx: ShotContext): NonNullable<Framing['panel']> {
  const { portrait } = ctx;
  return { name: 'outro', sx: portrait ? 0.08 : 0.07, sy: portrait ? 0.12 : 0.26, plane: new Plane(new Vector3(0, 0, 1), -(ROOM.back + 0.005)) };
}

const SCREEN_FILL = 0.93;
const OUTRO = { turn: 8 * DEG, fill: 0.91 };
const UP = new Vector3(0, 1, 0);

function monitorFill(ctx: ShotContext, name: string, turn = 0, fill = SCREEN_FILL): Framing {
  const screen = ctx.monitor.centre;
  const distance = widthFit(ctx.screenSpan * Math.cos(turn), fill, ctx.view);
  const facing = ctx.monitor.normal.clone().applyAxisAngle(UP, turn);
  return { eye: screen.clone().addScaledVector(facing, distance), focus: screen, sx: 0.5, sy: 0.5, panel: { name, ...ctx.panelDocked } };
}

export function stackedMonitorShots(ctx: ShotContext): { hero: Framing; about: Framing[]; outro: Framing } {
  return { hero: monitorFill(ctx, 'hero'), about: [stackedBioShot(ctx), monitorFill(ctx, 'about-stack')], outro: monitorFill(ctx, 'outro', OUTRO.turn, OUTRO.fill) };
}
