import { tokenNumber } from '../tokens';
import type { Tier } from '../tier';

/** FX design tokens (`--fx-*` in tokens.css, values from docs/design/desk.md §7). */
export interface FxTokens {
  bloomStrength: number;
  bloomRadius: number;
  bloomThreshold: number;
  bloomSmoothing: number;
  grain: number;
  vignetteDarkness: number;
  vignetteOffset: number;
  bokeh: number;
  pointerDamping: number;
}

export function readFxTokens(): FxTokens {
  return {
    bloomStrength: Math.min(tokenNumber('--fx-bloom-strength', 0.32), 0.6),
    bloomRadius: tokenNumber('--fx-bloom-radius', 0.45),
    bloomThreshold: tokenNumber('--fx-bloom-threshold', 0.88),
    bloomSmoothing: 0.1,
    grain: Math.min(tokenNumber('--fx-grain', 0.035), 0.06),
    vignetteDarkness: tokenNumber('--fx-vignette-darkness', 0.5),
    vignetteOffset: tokenNumber('--fx-vignette-offset', 0.32),
    bokeh: tokenNumber('--fx-dof-bokeh-scale', 2.5),
    pointerDamping: tokenNumber('--fx-pointer-damping', 0.06)
  };
}

export type DofMode = 'full' | 'lite' | 'off';

/** What each tier runs. `low`/`none` bypass the pipeline (direct render). */
export interface TierProfile {
  enabled: boolean;
  msaa: number;
  bloomDivisor: number;
  bloomLevels: number;
  dof: DofMode;
  dofDivisor: number;
  dofTaps: number;
  fluidSize: number;
  pressureIterations: number;
  vorticity: boolean;
  /** GPU ms of all effects (scene excluded) before cutting fluid → DoF; 0 = no budget. */
  budgetMs: number;
  /** DoF is switched off when it alone costs more than this; 0 = never. */
  dofCeilingMs: number;
}

const PROFILES: Record<Tier, TierProfile> = {
  high: {
    enabled: true,
    msaa: 4,
    bloomDivisor: 2,
    bloomLevels: 5,
    dof: 'full',
    dofDivisor: 2,
    dofTaps: 24,
    fluidSize: 256,
    pressureIterations: 10,
    vorticity: true,
    budgetMs: 2.5,
    dofCeilingMs: 0
  },
  mid: {
    enabled: true,
    msaa: 0,
    bloomDivisor: 4,
    bloomLevels: 4,
    dof: 'lite',
    dofDivisor: 4,
    dofTaps: 12,
    fluidSize: 128,
    pressureIterations: 6,
    vorticity: false,
    budgetMs: 4,
    dofCeilingMs: 3
  },
  low: disabledProfile(),
  none: disabledProfile()
};

function disabledProfile(): TierProfile {
  return {
    enabled: false,
    msaa: 0,
    bloomDivisor: 4,
    bloomLevels: 0,
    dof: 'off',
    dofDivisor: 4,
    dofTaps: 0,
    fluidSize: 0,
    pressureIterations: 0,
    vorticity: false,
    budgetMs: 0,
    dofCeilingMs: 0
  };
}

export function tierProfile(tier: Tier): TierProfile {
  return { ...PROFILES[tier] };
}

/** Same rule as `detectTier` for the moment before the Stage calls `setTier`. */
export function guessTier(): Tier {
  return matchMedia('(pointer: coarse)').matches || innerWidth < 1024 ? 'mid' : 'high';
}
