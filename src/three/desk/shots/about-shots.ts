import { Vector3 } from 'three';
import { DESK } from '../layout';
import { boardCorners } from '../notes/layout';
import { BIO_CARD, PICTURE_LIGHT, PORTRAIT, PORTRAIT_GLASS_Z } from '../portrait/layout';
import { boxRegion, boxShot, type Facing } from './box-fit';
import type { ShotContext } from './context';
import { DEG, eyeFor, lerp } from './math';
import { fitDistance } from './projection';
import { centreOf } from './protagonists';
import type { Framing, Region } from './types';

const HEADING = 0;
const PITCH = -2;
const PAIR_X = 0.5;

const PORTRAIT_TOP = PORTRAIT.centre.y + PORTRAIT.height / 2;

function wallRect(bottom: number): Vector3[] {
  const { centre, width } = PORTRAIT;
  return [-1, 1].flatMap(x => [bottom, PORTRAIT_TOP].map(y => new Vector3(centre.x + (x * width) / 2, y, PORTRAIT_GLASS_Z)));
}

function portraitCorners(): Vector3[] {
  return wallRect(PORTRAIT_TOP - PORTRAIT.height);
}

function pictureLamp(): Vector3[] {
  const { hood, hoodLength, hoodRadius } = PICTURE_LIGHT;
  return [-1, 1].map(x => hood.clone().add(new Vector3((x * hoodLength) / 2, hoodRadius, 0)));
}

export function monitorCorners(ctx: ShotContext): Vector3[] {
  const { centre, quaternion } = ctx.monitor;
  const right = new Vector3(1, 0, 0).applyQuaternion(quaternion).multiplyScalar(ctx.screenSpan / 2);
  const up = new Vector3(0, 1, 0).applyQuaternion(quaternion).multiplyScalar(ctx.screenRise / 2);
  return [-1, 1].flatMap(x => [-1, 1].map(y => centre.clone().addScaledVector(right, x).addScaledVector(up, y)));
}

const DESK_LINE = { x: 0.62, z: 0 } as const;
const ROOM_FACING: Record<'hero' | 'about' | 'outro', Facing> = {
  hero: { heading: 0, pitch: -8 },
  about: { heading: 12, pitch: -6 },
  outro: { heading: -16, pitch: -4 }
};
const OUTRO_MARGIN = 0.09;

function roomPoints(ctx: ShotContext): Vector3[] {
  const deskLine = [-1, 1].map(x => new Vector3(x * DESK_LINE.x, DESK.top, DESK_LINE.z));
  return [...portraitCorners(), ...pictureLamp(), PICTURE_LIGHT.plate, ...monitorCorners(ctx), ...boardCorners(), ...deskLine];
}

export function roomShot(ctx: ShotContext, beat: keyof typeof ROOM_FACING): Framing {
  const region = beat === 'outro' ? boxRegion(ctx, OUTRO_MARGIN) : boxRegion(ctx);
  return { ...boxShot(ctx, ROOM_FACING[beat], roomPoints(ctx), undefined, region), focus: ctx.monitor.centre };
}

export const HERO_PLACE = { sx: 0.56, sy: 0.6 };

export function heroFitDistance(ctx: ShotContext, nearest: number): number {
  const { normal, centre } = ctx.monitor;
  const facing = { heading: Math.atan2(-normal.x, normal.z) / DEG, pitch: Math.asin(-normal.y) / DEG };
  const points = [...portraitCorners(), ...pictureLamp(), ...monitorCorners(ctx)];
  const region: Region = { left: 0.03, right: 0.97, top: 0.03, bottom: 0.97 };
  return fitDistance(centre, facing, HERO_PLACE, points, region, ctx.view, nearest);
}

export function aboutPairShot(ctx: ShotContext, monitorOnly: Framing): Framing {
  const points = [...portraitCorners(), ...pictureLamp(), ...monitorCorners(ctx)];
  const aim = centreOf(points);
  const region: Region = { left: 0.04, right: 0.96, top: ctx.stage.top + 0.03, bottom: 0.95 };
  const place = { sx: PAIR_X, sy: 0.5 };
  const distance = fitDistance(aim, { heading: HEADING, pitch: PITCH }, place, points, region, ctx.view, 0.6);
  const pair: Framing = { eye: eyeFor(aim, HEADING, PITCH, distance), focus: ctx.monitor.centre, aim, ...place };
  if (ctx.t <= 0) return pair;
  return {
    eye: pair.eye.clone().lerp(monitorOnly.eye, ctx.t),
    focus: ctx.monitor.centre,
    aim: aim.clone().lerp(monitorOnly.focus, ctx.t),
    sx: lerp(pair.sx, monitorOnly.sx, ctx.t),
    sy: lerp(pair.sy, monitorOnly.sy, ctx.t)
  };
}

export function stackedBioShot(ctx: ShotContext): Framing {
  const points = wallRect(BIO_CARD.centre.y - BIO_CARD.height / 2);
  const aim = centreOf(points);
  const place = { sx: 0.5, sy: 0.5 };
  const region: Region = { left: 0.05, right: 0.95, top: ctx.stage.top + 0.02, bottom: 0.96 };
  const distance = fitDistance(aim, { heading: HEADING, pitch: 0 }, place, points, region, ctx.view, 0.4);
  return { eye: eyeFor(aim, HEADING, 0, distance), focus: aim, ...place, panel: { name: 'about-bio', ...ctx.panelDocked } };
}
