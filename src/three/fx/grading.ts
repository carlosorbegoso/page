import { Vector3 } from 'three';

export interface Grade {
  exposure: number;
  temperature: number;
  split: number;
  vignette: number;
  focusRange: number;
  contrast: number;
  bokeh: number;
}

const DEFAULT_SECONDS = 1.2;

const GRADES: Record<string, Grade & { seconds?: number; delay?: number }> = {
  intro: { exposure: 0.55, temperature: -0.3, split: 0.15, contrast: 0.2, vignette: 0.6, focusRange: 0.6, bokeh: 1, seconds: 0 },
  hero: { exposure: 1, temperature: 0, split: 0.38, contrast: 0.22, vignette: 0.55, focusRange: 0.6, bokeh: 1, seconds: 0.8 },
  about: { exposure: 1, temperature: -0.08, split: 0.25, contrast: 0.15, vignette: 0.45, focusRange: 0.6, bokeh: 1 },
  company: { exposure: 1.04, temperature: 0.18, split: 0.5, contrast: 0.3, vignette: 0.6, focusRange: 0.3, bokeh: 1.2, seconds: 1.4, delay: 1.6 },
  products: { exposure: 1, temperature: 0.14, split: 0.48, contrast: 0.3, vignette: 0.6, focusRange: 0.3, bokeh: 1.2 },
  experience: { exposure: 0.96, temperature: -0.22, split: 0.2, contrast: 0.2, vignette: 0.6, focusRange: 0.25, bokeh: 1.4 },
  contact: { exposure: 1, temperature: -0.06, split: 0.32, contrast: 0.2, vignette: 0.55, focusRange: 0.2, bokeh: 1.2 },
  outro: { exposure: 1.3, temperature: 0.35, split: 0.2, contrast: 0.15, vignette: 0.35, focusRange: 0.8, bokeh: 1, seconds: 2.5 }
};

const GRADES_DAY: Record<string, Partial<Grade>> = {
  intro: { exposure: 0.95, temperature: 0.05, split: 0.12, contrast: 0.12, vignette: 0.25 },
  hero: { exposure: 0.95, temperature: 0.05, split: 0.12, contrast: 0.12, vignette: 0.25 },
  about: { exposure: 0.95, temperature: 0, split: 0.1, contrast: 0.1, vignette: 0.22 },
  experience: { exposure: 1, temperature: 0.02, split: 0.1, contrast: 0.12, vignette: 0.3 },
  company: { exposure: 1, temperature: 0.3, split: 0.3, contrast: 0.2, vignette: 0.35 },
  products: { exposure: 1, temperature: 0.28, split: 0.3, contrast: 0.22, vignette: 0.4 },
  contact: { exposure: 0.95, temperature: 0.2, split: 0.25, contrast: 0.16, vignette: 0.35 },
  outro: { exposure: 0.85, temperature: 0.15, split: 0.4, contrast: 0.2, vignette: 0.5 }
};

const isDay = () => typeof document !== 'undefined' && document.documentElement.dataset.time === 'day';

const NEUTRAL = GRADES.hero!;

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function mix(a: Grade, b: Grade, t: number): Grade {
  return {
    exposure: a.exposure + (b.exposure - a.exposure) * t,
    temperature: a.temperature + (b.temperature - a.temperature) * t,
    split: a.split + (b.split - a.split) * t,
    contrast: a.contrast + (b.contrast - a.contrast) * t,
    vignette: a.vignette + (b.vignette - a.vignette) * t,
    focusRange: a.focusRange + (b.focusRange - a.focusRange) * t,
    bokeh: a.bokeh + (b.bokeh - a.bokeh) * t
  };
}

export class ChapterGrading {
  private from: Grade = { ...NEUTRAL };
  private to: Grade = { ...NEUTRAL };
  private current: Grade = { ...NEUTRAL };
  private elapsed = 0;
  private duration = 0;
  private chapter = '';

  enter(chapter: string, instant: boolean, force = false): void {
    const night = GRADES[chapter];
    if (!night || (chapter === this.chapter && !force)) return;
    const target = { ...night, ...(isDay() ? GRADES_DAY[chapter] : undefined) };
    this.chapter = chapter;
    this.from = { ...this.current };
    this.to = {
      exposure: target.exposure,
      temperature: target.temperature,
      split: target.split,
      contrast: target.contrast,
      vignette: target.vignette,
      focusRange: target.focusRange,
      bokeh: target.bokeh
    };
    this.duration = instant ? 0 : force ? DEFAULT_SECONDS : (target.seconds ?? DEFAULT_SECONDS);
    this.elapsed = instant || force ? 0 : -(target.delay ?? 0);
    if (this.duration === 0) this.current = { ...this.to };
  }

  update(dt: number): Grade {
    if (this.elapsed < this.duration) {
      this.elapsed = Math.min(this.elapsed + dt, this.duration);
      if (this.elapsed > 0) this.current = mix(this.from, this.to, easeInOut(this.elapsed / this.duration));
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

export function balanceGains(temperature: number, out: Vector3): Vector3 {
  out.set(1 + 0.12 * temperature, 1 + 0.02 * temperature, 1 - 0.14 * temperature);
  const luma = 0.2126 * out.x + 0.7152 * out.y + 0.0722 * out.z;
  return out.divideScalar(luma);
}
