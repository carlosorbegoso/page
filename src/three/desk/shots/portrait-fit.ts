import type { Vector3 } from 'three';
import type { ShotContext } from './context';
import { eyeFor, lerp } from './math';
import { fitDistance, inside, overlaps, projector, screenBox } from './projection';
import { centreOf, OCCLUDERS } from './protagonists';
import type { Place, Region, Setup } from './types';

/** The frame grown by the depth-of-field halo: a neighbour outside it reads as fully out. */
const HALO: Region = { left: -0.04, right: 1.04, top: -0.04, bottom: 1.04 };
/** Breathing room around protagonists fitted to the stage, as a share of the tightest distance. */
const BREATH = 1.12;

/** A small change of a portrait shot that may swing a sliced neighbour wholly out of frame. */
interface Nudge {
  /** Degrees added to the heading. */
  turn: number;
  /** Degrees added to the pitch (negative looks further down). */
  tilt: number;
  /** Added to the subject's screen x. */
  shift: number;
  /** Dolly factor: in to the tightest fit to lose a neighbour at the edge, out so a tall one behind fits whole. */
  back: number;
}

/** Tried in order, gentlest first, before a sliced neighbour joins the subjects. */
const NUDGES: Nudge[] = [0, -6, -12].flatMap(tilt =>
  [1, 1 / BREATH, 1.15, 1.3, 1.5].flatMap(back =>
    [0, 0.05, -0.05, 0.1, -0.1].flatMap(shift => [0, 4, -4, 8, -8, 12, -12].map(turn => ({ turn, tilt, shift, back })))
  )
);

export type StoryFrame = { eye: Vector3; aim?: Vector3; sx: number; sy: number };
type FittedFrame = { eye: Vector3; aim: Vector3; sx: number; sy: number };

/** One portrait story shot being fitted: its blended pose and the neighbours it must not slice. */
interface PortraitFit {
  ctx: ShotContext;
  focus: Vector3;
  heading: number;
  pitch: number;
  preferred: number;
  sx: number;
  sy: number;
  neighbours: Vector3[][];
}

interface Attempt {
  shot: FittedFrame;
  sliced: Vector3[][];
  blocked: boolean;
}

function attempt(fit: PortraitFit, points: Vector3[], nudge: Nudge): Attempt {
  const { ctx, focus } = fit;
  const aim = focus.clone().lerp(centreOf(points), ctx.t);
  const setup = { heading: fit.heading + nudge.turn, pitch: fit.pitch + nudge.tilt };
  const sx = fit.sx + nudge.shift;
  const sy = fit.sy;
  const tightest = fitDistance(aim, setup, { sx, sy }, points, ctx.stage, ctx.view, 0.1);
  const distance = Math.max(tightest, Math.max(tightest, Math.min(fit.preferred, tightest * BREATH)) * nudge.back);
  const eye = eyeFor(aim, setup.heading, setup.pitch, distance);
  const project = projector({ eye, focus, aim, sx, sy }, ctx.view);
  const sliced = fit.neighbours.filter(group => {
    if (points.includes(group[0]!)) return false;
    const at = group.map(project);
    return !at.every(point => !inside(point, HALO)) && !at.every(point => inside(point, ctx.whole));
  });
  const subjectBox = screenBox(points.map(project));
  const blocked = OCCLUDERS.some(
    group => centreOf(group).distanceTo(eye) < aim.distanceTo(eye) && overlaps(screenBox(group.map(project)), subjectBox)
  );
  return { shot: { eye, aim, sx, sy }, sliced, blocked };
}

function nearestTo(focus: Vector3, groups: Vector3[][]): Vector3[] {
  return groups.reduce((best, group) => (centreOf(group).distanceTo(focus) < centreOf(best).distanceTo(focus) ? group : best));
}

function fitPortrait(fit: PortraitFit, subjects: Vector3[]): FittedFrame {
  const points = [...subjects];
  for (;;) {
    let nearest: Vector3[] | null = null;
    let unblockable: FittedFrame | null = null;
    for (const nudge of NUDGES) {
      const { shot, sliced, blocked } = attempt(fit, points, nudge);
      if (!sliced.length && !blocked) return shot;
      if (!sliced.length) unblockable ??= shot;
      else nearest ??= nearestTo(fit.focus, sliced);
    }
    if (unblockable || !nearest) return unblockable!;
    points.push(...nearest);
  }
}

/**
 * A story shot: `landscape` verbatim on desktop, blended towards `portrait` by aspect, and in
 * portrait as close as `subjects` fit `stage` (with `BREATH`), aimed at their centre. A neighbour the edge
 * or the HUD would slice, and no nudge clears, joins the subjects (nearest first), so each one
 * ends up wholly in frame or wholly out.
 */
export function storyShot(
  ctx: ShotContext,
  focus: Vector3,
  landscape: Setup,
  portraitSetup: Setup,
  place: Place,
  subjects: Vector3[],
  neighbours: Vector3[][] = []
): StoryFrame {
  const { t } = ctx;
  const heading = lerp(landscape.heading, portraitSetup.heading, t);
  const pitch = lerp(landscape.pitch, portraitSetup.pitch, t);
  const preferred = lerp(landscape.distance, portraitSetup.distance * ctx.lens, t);
  if (!ctx.portrait) return { eye: eyeFor(focus, heading, pitch, preferred), sx: place.sx, sy: place.sy };
  const sy = lerp(place.sy, ctx.stageY, t);
  return fitPortrait({ ctx, focus, heading, pitch, preferred, sx: place.sx, sy, neighbours }, subjects);
}
