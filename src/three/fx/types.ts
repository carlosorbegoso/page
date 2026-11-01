import type { FxPipeline } from '../contracts';
import type { Tier } from '../tier';
import type { FxFeature } from './adapt';

/** Snapshot for the debug overlay and the docs (`window.__fx.stats()` with `?debug`). */
export interface FxStats {
  tier: Tier;
  gpuTimer: boolean;
  /** False on ANGLE Metal: timings are shown but the budget rule is off. */
  gpuTimerTrusted: boolean;
  /** Smoothed GPU ms per pass: fluid, scene, dof, bloom, composite. */
  ms: Record<string, number>;
  /** GPU ms of the effects alone (everything but `scene`). */
  effectsMs: number;
  disabled: FxFeature[];
  fluidAwake: boolean;
  dofAmount: number;
  chapter: string;
  buffer: { width: number; height: number };
}

/** The pipeline plus what the Stage can read back. */
export interface CinematicFx extends FxPipeline {
  /** True while the fluid, a rack focus or a grade transition still moves: OR it into the Stage's `settling`. */
  readonly settling: boolean;
  stats(): FxStats;
}

export interface FxOptions {
  tier?: Tier;
}
