import { Vector3 } from 'three';

/** Colour grade of one chapter, applied in linear light before the renderer's ACES. */
export interface Grade {
  /** Multiplier on top of `renderer.toneMappingExposure`. */
  exposure: number;
  /** -1 cold (monitor, moonlight) … +1 warm (lamp, dawn). */
  temperature: number;
  /** Strength of the cool-shadows / warm-highlights split (lamp vs window). */
  split: number;
  vignette: number;
  /** In-focus depth band in metres: wide for the room shots, a few cm for the macro of the figures. */
  focusRange: number;
}

/** Seconds to reach a chapter's grade; the dawn of `outro` takes 2.5 s (docs/PLAN.md). */
const DEFAULT_SECONDS = 1.2;

const GRADES: Record<string, Grade & { seconds?: number }> = {
  intro: { exposure: 0.55, temperature: -0.3, split: 0.1, vignette: 0.6, focusRange: 0.6, seconds: 0 },
  hero: { exposure: 1, temperature: 0, split: 0.2, vignette: 0.5, focusRange: 0.6, seconds: 0.8 },
  about: { exposure: 1, temperature: -0.08, split: 0.15, vignette: 0.45, focusRange: 0.6 },
  company: { exposure: 1, temperature: 0.12, split: 0.25, vignette: 0.55, focusRange: 0.25 },
  products: { exposure: 1, temperature: 0.14, split: 0.25, vignette: 0.55, focusRange: 0.13 },
  experience: { exposure: 0.98, temperature: 0.04, split: 0.2, vignette: 0.5, focusRange: 0.3 },
  contact: { exposure: 1, temperature: -0.06, split: 0.2, vignette: 0.5, focusRange: 0.2 },
  outro: { exposure: 1.3, temperature: 0.35, split: 0.1, vignette: 0.3, focusRange: 0.8, seconds: 2.5 }
};

const NEUTRAL = GRADES.hero!;

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function mix(a: Grade, b: Grade, t: number): Grade {
  return {
    exposure: a.exposure + (b.exposure - a.exposure) * t,
    temperature: a.temperature + (b.temperature - a.temperature) * t,
    split: a.split + (b.split - a.split) * t,
    vignette: a.vignette + (b.vignette - a.vignette) * t,
    focusRange: a.focusRange + (b.focusRange - a.focusRange) * t
  };
}

/** Tweens the grade between chapters (`power2.inOut`-like). */
export class ChapterGrading {
  private from: Grade = { ...NEUTRAL };
  private to: Grade = { ...NEUTRAL };
  private current: Grade = { ...NEUTRAL };
  private elapsed = 0;
  private duration = 0;
  private chapter = '';

  /** Starts the transition to `chapter`; unknown ids keep the current grade. */
  enter(chapter: string, instant: boolean): void {
    const target = GRADES[chapter];
    if (!target || chapter === this.chapter) return;
    this.chapter = chapter;
    this.from = { ...this.current };
    this.to = {
      exposure: target.exposure,
      temperature: target.temperature,
      split: target.split,
      vignette: target.vignette,
      focusRange: target.focusRange
    };
    this.duration = instant ? 0 : (target.seconds ?? DEFAULT_SECONDS);
    this.elapsed = 0;
    if (this.duration === 0) this.current = { ...this.to };
  }

  update(dt: number): Grade {
    if (this.elapsed < this.duration) {
      this.elapsed = Math.min(this.elapsed + dt, this.duration);
      this.current = mix(this.from, this.to, easeInOut(this.elapsed / this.duration));
    }
    return this.current;
  }

  get value(): Grade {
    return this.current;
  }

  get moving(): boolean {
    return this.elapsed < this.duration;
  }
}

/** White-balance gains for a temperature (luma-preserving). */
export function balanceGains(temperature: number, out: Vector3): Vector3 {
  out.set(1 + 0.12 * temperature, 1 + 0.02 * temperature, 1 - 0.14 * temperature);
  const luma = 0.2126 * out.x + 0.7152 * out.y + 0.0722 * out.z;
  return out.divideScalar(luma);
}
