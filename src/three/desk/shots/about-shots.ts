import { Vector3 } from 'three';
import { MONITOR } from '../layout';
import { PORTRAIT, PORTRAIT_GLASS_Z } from '../portrait/layout';
import type { ShotContext } from './context';
import { eyeFor, lerp } from './math';
import { fitDistance } from './projection';
import type { Framing, Region } from './types';

const HEADING = 0;
const PITCH = -2;
const PAIR_X = 0.5;

function portraitCorners(): Vector3[] {
  const { centre, width, height } = PORTRAIT;
  return [-1, 1].flatMap(x => [-1, 1].map(y => new Vector3(centre.x + (x * width) / 2, centre.y + (y * height) / 2, PORTRAIT_GLASS_Z)));
}

function monitorCorners(ctx: ShotContext): Vector3[] {
  const { centre, quaternion } = ctx.monitor;
  const right = new Vector3(1, 0, 0).applyQuaternion(quaternion).multiplyScalar(ctx.screenSpan / 2);
  const up = new Vector3(0, 1, 0).applyQuaternion(quaternion).multiplyScalar(ctx.screenRise / 2);
  return [-1, 1].flatMap(x => [-1, 1].map(y => centre.clone().addScaledVector(right, x).addScaledVector(up, y)));
}

function pairCentre(points: Vector3[]): Vector3 {
  const min = points.reduce((low, point) => low.min(point), points[0]!.clone());
  const max = points.reduce((high, point) => high.max(point), points[0]!.clone());
  return min.add(max).multiplyScalar(0.5);
}

export function aboutPairShot(ctx: ShotContext, monitorOnly: Framing): Framing {
  const points = [...portraitCorners(), ...monitorCorners(ctx)];
  const aim = pairCentre(points);
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

export function stackedAboutFocus(): Vector3 {
  return PORTRAIT.centre.clone().lerp(MONITOR.centre, 0.45).add(new Vector3(0, -0.02, 0));
}
