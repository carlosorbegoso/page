import { Plane, Vector3 } from 'three';
import { HERO_EYE, LAPTOP, MONITOR, ROOM } from '../layout';
import { aboutPairShot, stackedAboutFocus } from './about-shots';
import type { ShotContext } from './context';
import { clamp, eyeFor, heightFit, lerp, widthFit } from './math';
import type { Framing } from './types';

export function heroDistance(ctx: ShotContext): number {
  const { view, screenSpan, screenRise, t } = ctx;
  return lerp(
    clamp(widthFit(screenSpan, 0.5, view), 1.05, HERO_EYE.distanceTo(ctx.monitor.centre)),
    clamp(Math.max(widthFit(screenSpan, 0.8, view), heightFit(screenRise, 0.78, view)), 1.0, 2.3),
    t
  );
}

export function heroShot(ctx: ShotContext, distance: number): Framing {
  const screen = ctx.monitor.centre;
  return {
    eye: screen.clone().addScaledVector(ctx.monitor.normal, distance),
    focus: screen,
    sx: lerp(0.42, 0.5, ctx.t),
    sy: lerp(0.47, 0.5, ctx.t)
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
  const { portrait } = ctx;
  const back = hero.eye.clone().sub(screen).normalize();
  return {
    eye: screen.clone().addScaledVector(back, Math.min(heroDistance + 0.08, 1.75)),
    focus: screen,
    sx: hero.sx,
    sy: hero.sy,
    panel: {
      name: 'outro',
      sx: portrait ? 0.08 : 0.07,
      sy: portrait ? 0.12 : 0.26,
      plane: new Plane(new Vector3(0, 0, 1), -(ROOM.back + 0.005))
    }
  };
}

function stackedShot(ctx: ShotContext, focus: Vector3, heading: number, pitch: number, span: number, name: string, sy = ctx.subjectY): Framing {
  return { eye: eyeFor(focus, heading, pitch, ctx.topHalf(span)), focus, sx: 0.5, sy, panel: { name, ...ctx.panelDocked } };
}

export function stackedMonitorShots(ctx: ShotContext): { hero: Framing; about: Framing[]; outro: Framing } {
  const room = MONITOR.centre.clone().add(new Vector3(0.12, 0.06, -0.04));
  const hero = stackedShot(ctx, room, 4, -7, 1.45, 'hero', ctx.subjectY + 0.04);
  const bio = stackedShot(ctx, stackedAboutFocus(), 4, -8, 0.92, 'about-bio');
  const laptop = LAPTOP.centre.clone().add(new Vector3(0.02, 0.1, 0));
  const stack = stackedShot(ctx, laptop, -14, -14, 0.5, 'about-stack');
  const sky = MONITOR.centre.clone().add(new Vector3(0.3, 0.22, -0.1));
  const outro = stackedShot(ctx, sky, 6, 2, 0.88, 'outro');
  return { hero, about: [bio, stack], outro };
}
