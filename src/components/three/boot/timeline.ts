export type BootPhase =
  'load' | 'dash' | 'return' | 'ok' | 'mark' | 'led' | 'open' | 'done' | 'fail';

export interface Cue {
  phase: BootPhase;
  at: number;
  travel?: number;
  position?: number;
}

export const FAST_LOAD_MS = 600;
export const HUD_AFTER_OPEN_MS = 1300;
export const FAIL_REDIRECT_MS = 1700;

export const NORMAL_EXIT: readonly Cue[] = [
  { phase: 'return', at: 0, travel: 380, position: 0 },
  { phase: 'ok', at: 380 },
  { phase: 'mark', at: 950 },
  { phase: 'led', at: 1450 },
  { phase: 'open', at: 1750 },
  { phase: 'done', at: 2450 }
];

export const FAST_EXIT: readonly Cue[] = [
  { phase: 'dash', at: 0, travel: 220, position: 1 },
  { phase: 'return', at: 220, travel: 180, position: 0 },
  { phase: 'ok', at: 400 },
  { phase: 'mark', at: 750 },
  { phase: 'led', at: 1100 },
  { phase: 'open', at: 1350 },
  { phase: 'done', at: 2050 }
];

export const STILL_EXIT: readonly Cue[] = [
  { phase: 'ok', at: 0, position: 1 },
  { phase: 'mark', at: 500 },
  { phase: 'open', at: 900 },
  { phase: 'done', at: 1200 }
];

export const FAIL_EXIT: readonly Cue[] = [{ phase: 'fail', at: 0, travel: 520, position: 0 }];

export function formatElapsed(ms: number): string {
  if (ms < 1000) return `${Math.max(1, Math.round(ms))} ms`;
  return `${(ms / 1000).toFixed(1)} s`;
}
