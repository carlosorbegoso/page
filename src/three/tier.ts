/**
 * Device capability tiers (PLAN §3.3). This module never imports three: the initial
 * bundle uses it to decide whether the 3D chunk is downloaded at all.
 */
export type Tier = 'none' | 'low' | 'mid' | 'high';

export interface TierResult {
  tier: Tier;
  reason: string;
  renderer: string;
}

const SOFTWARE_RENDERER = /swiftshader|llvmpipe|software|basic render|softpipe/i;
const TIERS: readonly Tier[] = ['none', 'low', 'mid', 'high'];

function isTier(value: string | null): value is Tier {
  return value !== null && (TIERS as readonly string[]).includes(value);
}

function probeWebGL2(): { ok: boolean; renderer: string } {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true });
    if (!gl) return { ok: false, renderer: '' };
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = String(
      info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)
    );
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return { ok: true, renderer };
  } catch {
    return { ok: false, renderer: '' };
  }
}

/**
 * Classifies the device before three is downloaded. `low` is never returned here:
 * it is a later degradation decided by the frame-time monitor.
 */
export function detectTier(override?: string | null): TierResult {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (matchMedia('(forced-colors: active)').matches) {
    return { tier: 'none', reason: 'forced-colors', renderer: '' };
  }
  if (connection?.saveData) return { tier: 'none', reason: 'save-data', renderer: '' };

  const probe = probeWebGL2();
  if (isTier(override ?? null)) {
    return { tier: override as Tier, reason: 'override', renderer: probe.renderer };
  }
  if (!probe.ok) return { tier: 'none', reason: 'no-webgl2', renderer: '' };
  if (SOFTWARE_RENDERER.test(probe.renderer)) {
    return { tier: 'none', reason: 'software-renderer', renderer: probe.renderer };
  }
  if (matchMedia('(pointer: coarse)').matches || innerWidth < 1024) {
    return { tier: 'mid', reason: 'coarse-or-narrow', renderer: probe.renderer };
  }
  return { tier: 'high', reason: 'default', renderer: probe.renderer };
}

/**
 * Measures the empty requestAnimationFrame interval (detects 30/60/120 Hz and iOS
 * low-power mode). Returns the median interval in milliseconds.
 */
export function calibrateRefreshInterval(durationMs = 500): Promise<number> {
  return new Promise(resolve => {
    const deltas: number[] = [];
    let last = -1;
    let start = -1;
    const step = (now: number) => {
      if (start < 0) start = now;
      if (last >= 0) deltas.push(now - last);
      last = now;
      if (now - start < durationMs) {
        requestAnimationFrame(step);
        return;
      }
      deltas.sort((a, b) => a - b);
      const median = deltas.length ? deltas[Math.floor(deltas.length / 2)]! : 1000 / 60;
      resolve(Math.min(Math.max(median, 1000 / 240), 1000 / 20));
    };
    requestAnimationFrame(step);
  });
}

/** Rolling frame-time sampler that reports the 75th percentile. */
export class FrameSampler {
  private samples: number[] = [];
  private skipped = 0;

  constructor(
    private readonly windowSize = 60,
    private readonly warmupFrames = 10
  ) {}

  push(ms: number): void {
    if (this.skipped < this.warmupFrames) {
      this.skipped++;
      return;
    }
    this.samples.push(ms);
    if (this.samples.length > this.windowSize) this.samples.shift();
  }

  get ready(): boolean {
    return this.samples.length >= Math.min(this.windowSize, 30);
  }

  p75(): number {
    if (!this.samples.length) return 0;
    const sorted = [...this.samples].sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length * 0.75)]!;
  }

  reset(): void {
    this.samples = [];
    this.skipped = 0;
  }
}

export interface DprPolicy {
  steps: number[];
  initialIndex: number;
  /** Rendered frames per refresh: 1 = every frame, 2 = alternate frames (30 fps at 60 Hz). */
  frameDivisor: number;
}

/** DPR ladder per tier: `high` starts at min(dpr, 2); `mid` starts at 1.0 and may climb to 1.5. */
export function dprPolicy(tier: Tier, devicePixelRatio = window.devicePixelRatio || 1): DprPolicy {
  if (tier === 'high') {
    const top = Math.min(devicePixelRatio, 2);
    const steps = [1, 1.25, 1.5, top].filter((v, i, all) => v <= top && all.indexOf(v) === i);
    return { steps, initialIndex: steps.length - 1, frameDivisor: 1 };
  }
  if (tier === 'mid') {
    const steps = [1, 1.25, 1.5].filter(v => v <= Math.max(devicePixelRatio, 1));
    return { steps, initialIndex: 0, frameDivisor: 2 };
  }
  return { steps: [1], initialIndex: 0, frameDivisor: 1 };
}

export type DprDecision = 'up' | 'down' | 'fail' | 'keep';

/** Below 20 fps at the lowest DPR the 3D gives way to the static fallback. */
export const UNACCEPTABLE_FRAME_MS = 50;

/**
 * Adaptive resolution rule: p75 above 1.5x the target interval steps down; at the DPR floor
 * only a p75 above UNACCEPTABLE_FRAME_MS fails. p75 under 60 % of the target, sustained 3 s, steps up.
 */
export class DprController {
  private index: number;
  private goodSince = -1;

  constructor(private readonly policy: DprPolicy) {
    this.index = policy.initialIndex;
  }

  get value(): number {
    return this.policy.steps[this.index]!;
  }

  evaluate(p75FrameMs: number, p75WorkMs: number, targetIntervalMs: number, now: number): DprDecision {
    if (p75FrameMs > targetIntervalMs * 1.5) {
      this.goodSince = -1;
      if (this.index > 0) {
        this.index--;
        return 'down';
      }
      return p75FrameMs > UNACCEPTABLE_FRAME_MS ? 'fail' : 'keep';
    }
    const roomy = p75WorkMs < targetIntervalMs * 0.6 && p75FrameMs <= targetIntervalMs * 1.1;
    if (!roomy || this.index >= this.policy.steps.length - 1) {
      this.goodSince = -1;
      return 'keep';
    }
    if (this.goodSince < 0) this.goodSince = now;
    if (now - this.goodSince < 3000) return 'keep';
    this.goodSince = -1;
    this.index++;
    return 'up';
  }
}
