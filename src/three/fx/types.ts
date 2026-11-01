import type { FxPipeline } from '../contracts';
import type { Tier } from '../tier';
import type { FxFeature } from './adapt';

export interface FxStats {
  tier: Tier;
  gpuTimer: boolean;
  gpuTimerTrusted: boolean;
  ms: Record<string, number>;
  effectsMs: number;
  disabled: FxFeature[];
  fluidAwake: boolean;
  dofAmount: number;
  chapter: string;
  buffer: { width: number; height: number };
}

export interface CinematicFx extends FxPipeline {
  readonly settling: boolean;
  stats(): FxStats;
}

export interface FxOptions {
  tier?: Tier;
}
