import type { WebGLRenderer } from 'three';
import { DprController, FrameSampler, type DprDecision, type DprPolicy, type Tier } from '../tier';

const IDLE_WINDOW_MS = 8000;

export interface StageLoopHost {
  renderer(): WebGLRenderer;
  readonly capture: boolean;
  tier(): Tier;
  canRun(): boolean;
  motionAllowed(): boolean;
  settled(): boolean;
  /** Draws one frame; returns whether something still moves. */
  render(dt: number, now: number): boolean;
  afterRender(now: number): void;
  finishIntro(): void;
  resolutionChanged(decision: DprDecision): void;
  degrade(): void;
}

/** Frame-time samples for the once-a-second DPR decision. */
class FrameBudget {
  readonly sampler = new FrameSampler(60);
  private readonly workSampler = new FrameSampler(60);
  private lastRendered = -1;
  private lastEvaluation = 0;

  reset(): void {
    this.sampler.reset();
    this.workSampler.reset();
  }

  stopped(): void {
    this.lastRendered = -1;
    this.reset();
  }

  record(now: number, work: number, targetMs: number, dpr: DprController): DprDecision {
    if (this.lastRendered >= 0) {
      this.sampler.push(now - this.lastRendered);
      this.workSampler.push(work);
    }
    this.lastRendered = now;
    if (!this.sampler.ready || now - this.lastEvaluation < 1000) return 'keep';
    this.lastEvaluation = now;
    return dpr.evaluate(this.sampler.p75(), this.workSampler.p75(), targetMs, now);
  }
}

/**
 * On-demand render loop: runs while something moves or the visitor was active in the last 8 s,
 * renders every `frameDivisor`-th frame when settled, and adapts the DPR to the frame budget.
 */
export class StageLoop {
  refreshMs = 1000 / 60;
  frameDivisor = 1;
  dpr!: DprController;
  /** End of the intro hold (ms); +∞ until the scene is revealed, 0 when there is no intro. */
  introUntil = 0;
  lastInteraction = performance.now();
  readonly clockStart = performance.now();
  private readonly budget = new FrameBudget();
  private running = false;
  private lastFrame = -1;
  private frameCount = 0;

  constructor(private readonly host: StageLoopHost) {}

  usePolicy(policy: DprPolicy): void {
    this.dpr = new DprController(policy);
    this.frameDivisor = policy.frameDivisor;
  }

  p75(): number {
    return this.budget.sampler.p75();
  }

  idleMotion(): boolean {
    const tier = this.host.tier();
    return !this.host.capture && this.host.motionAllowed() && (tier === 'high' || tier === 'mid') && performance.now() - this.lastInteraction < IDLE_WINDOW_MS;
  }

  /** Requests a render; starts the loop if it is allowed to run. */
  invalidate(): void {
    if (!this.host.canRun() || this.running) return;
    this.running = true;
    this.lastFrame = -1;
    this.host.renderer().setAnimationLoop(now => this.frame(now));
  }

  bump(): void {
    this.lastInteraction = performance.now();
    this.invalidate();
  }

  stop(): void {
    if (!this.running) return;
    this.running = false;
    this.host.renderer().setAnimationLoop(null);
    this.budget.stopped();
  }

  private frame(now: number): void {
    if (!this.host.canRun()) {
      this.stop();
      return;
    }
    const dt = this.lastFrame < 0 ? 1 / 60 : Math.min((now - this.lastFrame) / 1000, 0.1);
    this.lastFrame = now;
    if (this.introUntil && now >= this.introUntil) {
      this.introUntil = 0;
      this.host.finishIntro();
    }
    const continuous = this.idleMotion() || !this.host.settled() || this.introUntil > 0;
    if (this.skips(now, continuous)) return;
    const workStart = performance.now();
    const settling = this.host.render(dt, now);
    const work = performance.now() - workStart;
    this.host.afterRender(now);
    if (continuous) this.adapt(now, work);
    else if (!settling) this.stop();
  }

  /** Settled idle frames render at 1/`frameDivisor` of the refresh rate. */
  private skips(now: number, continuous: boolean): boolean {
    this.frameCount++;
    const recentlyActive = now - this.lastInteraction < 300;
    return continuous && this.host.settled() && !recentlyActive && this.frameDivisor > 1 && this.frameCount % this.frameDivisor !== 0;
  }

  private adapt(now: number, work: number): void {
    const target = this.refreshMs * (this.host.settled() ? this.frameDivisor : 1);
    const decision = this.budget.record(now, work, target, this.dpr);
    if (decision === 'keep') return;
    if (decision === 'fail') {
      this.host.degrade();
      return;
    }
    this.host.renderer().setPixelRatio(this.dpr.value);
    this.host.resolutionChanged(decision);
    this.budget.reset();
  }
}
