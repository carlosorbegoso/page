import type { GpuTimer } from './gpuTimer';
import type { TierProfile } from './settings';

export type FxFeature = 'fluid' | 'dof';

const CUT_ORDER: readonly FxFeature[] = ['fluid', 'dof'];
const EVALUATE_EVERY_MS = 1000;
const MIN_SAMPLES = 20;

export class FxBudget {
  private readonly disabled = new Set<FxFeature>();
  private lastEvaluation = 0;
  private strikes = 0;

  has(feature: FxFeature): boolean {
    return this.disabled.has(feature);
  }

  list(): FxFeature[] {
    return [...this.disabled];
  }

  reset(): void {
    this.disabled.clear();
    this.strikes = 0;
  }

  evaluate(timer: GpuTimer | null, profile: TierProfile): FxFeature | null {
    if (!timer?.trusted || timer.sampleCount < MIN_SAMPLES) return null;
    const now = performance.now();
    if (now - this.lastEvaluation < EVALUATE_EVERY_MS) return null;
    this.lastEvaluation = now;
    const { budgetMs, dofCeilingMs } = profile;
    if (dofCeilingMs > 0 && (timer.ms.get('dof') ?? 0) > dofCeilingMs && !this.disabled.has('dof')) {
      return this.cut('dof', timer);
    }
    if (budgetMs <= 0) return null;
    if (effectsMs(timer) <= budgetMs) {
      this.strikes = 0;
      return null;
    }
    if (++this.strikes < 2) return null;
    const next = CUT_ORDER.find(feature => !this.disabled.has(feature));
    return next ? this.cut(next, timer) : null;
  }

  private cut(feature: FxFeature, timer: GpuTimer): FxFeature {
    this.disabled.add(feature);
    this.strikes = 0;
    timer.reset();
    return feature;
  }
}

export function effectsMs(timer: GpuTimer | null): number {
  let total = 0;
  for (const [label, ms] of timer?.ms ?? []) if (label !== 'scene') total += ms;
  return total;
}
