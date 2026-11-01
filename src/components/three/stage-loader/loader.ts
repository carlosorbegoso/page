import { CANVAS_FADE_S, clamp01, LAMP_RAMP, POSTERS, posterToScreen, smooth, type Point, type RevealDetail } from './frame';
import { createMotes, Painter } from './paint';
import { FIRST_CHECKPOINT, LoadProgress } from './progress';
import { paintBootLine, paintDay, paintNight, type LoaderFrame } from './scene';
import type { LoaderStatus } from './status';

const SKIP_AFTER_VISIBLE_MS = 20000;
const POLL_MS = 250;

/**
 * Pre-three loader: a canvas 2D overlay on the hero poster while the 3D chunk downloads. At night the
 * lamp filament warms up with the progress and dust drifts in its cone while the room dims towards the
 * dark first frame of the `intro` power-on; by day a morning haze and a sunbeam take its place. A thin
 * boot line runs along the bottom of the monitor. On `stage:reveal` the overlay fades with the canvas
 * fade-in and the filament glides onto the projected 3D lamp, fading as the real lamp ramps up.
 */
export class StageLoader {
  private readonly root = document.documentElement;
  private readonly reducedQuery = matchMedia('(prefers-reduced-motion: reduce)');
  private readonly painter: Painter;
  private readonly progress = new LoadProgress();
  private width = 0;
  private height = 0;
  private poster = POSTERS[2]!;
  private lamp: Point = { x: 0, y: 0 };
  private lampGoal: Point | null = null;
  private shown = 0;
  private visibleMs = 0;
  private last = performance.now();
  private handoff: { at: number; intro: boolean } | null = null;
  private frame = 0;
  private finished = false;
  private veil = -1;
  /* Kept from scroll events: reading scrollY in every tick, after the status text was written, forces a style recalc. */
  private atTop = scrollY < 4;
  private interval = 0;
  private readonly observer: MutationObserver;

  constructor(
    private readonly container: HTMLElement,
    private readonly canvas: HTMLCanvasElement,
    private readonly status: LoaderStatus,
    context: CanvasRenderingContext2D
  ) {
    this.painter = new Painter(context, createMotes());
    this.observer = new MutationObserver(() => this.finishIfDegraded());
  }

  private readonly still = () => this.reducedQuery.matches || this.root.dataset.motion === 'paused';
  private readonly day = () => this.root.dataset.time === 'day';

  start(): void {
    this.interval = window.setInterval(() => this.poll(), POLL_MS);
    this.listen();
    if (document.readyState === 'complete') this.progress.set(0.12);
    else {
      this.progress.set(FIRST_CHECKPOINT);
      window.addEventListener('load', this.onLoad, { once: true });
    }
    this.measure();
    this.canvas.hidden = false;
    this.status.element.hidden = false;
    this.tick(performance.now());
    if (!this.still()) this.schedule();
  }

  private measure(): void {
    this.painter.scale = Math.min(window.devicePixelRatio || 1, 1.5);
    this.width = this.container.clientWidth || innerWidth;
    this.height = this.container.clientHeight || innerHeight;
    this.canvas.width = Math.round(this.width * this.painter.scale);
    this.canvas.height = Math.round(this.height * this.painter.scale);
    this.poster = POSTERS.find(p => matchMedia(p.media).matches) ?? this.poster;
    if (!this.lampGoal) this.lamp = posterToScreen(this.poster.lamp, this.poster, this.width, this.height);
  }

  private frameInputs(time: number, since: number): LoaderFrame {
    const { handoff } = this;
    const scene = handoff ? 1 - clamp01(since / CANVAS_FADE_S) : 1;
    const light = handoff ? (handoff.intro && !this.day() ? 1 - smooth(LAMP_RAMP[0], LAMP_RAMP[1], since) : scene) : 1;
    return { width: this.width, height: this.height, time, moving: !this.still(), warm: smooth(0, 1, this.shown), scene, light };
  }

  private easeVeil(f: LoaderFrame, dt: number): number {
    const intro = this.handoff ? this.handoff.intro : this.atTop && f.moving;
    const veilGoal = intro ? 0.22 + 0.64 * f.warm : f.moving ? 0.16 + 0.1 * f.warm : 0.12;
    this.veil = this.veil < 0 || !f.moving ? veilGoal : this.veil + (veilGoal - this.veil) * (1 - Math.exp(-3 * dt));
    return this.veil;
  }

  private draw(time: number, since: number, dt: number): void {
    const f = this.frameInputs(time, since);
    const { ctx } = this.painter;
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.day()) paintDay(this.painter, f);
    else paintNight(this.painter, f, this.easeVeil(f, dt), this.lamp, this.poster.cone);
    paintBootLine(this.painter, f, this.poster, this.shown);
  }

  private advance(now: number, dt: number): void {
    const target = this.handoff ? 1 : this.progress.goal(now);
    this.shown = this.still() ? target : this.shown + (target - this.shown) * (1 - Math.exp(-4 * dt));
    if (!this.lampGoal) return;
    const k = this.still() ? 1 : 1 - Math.exp(-10 * dt);
    this.lamp = { x: this.lamp.x + (this.lampGoal.x - this.lamp.x) * k, y: this.lamp.y + (this.lampGoal.y - this.lamp.y) * k };
  }

  private tick(now: number): void {
    this.frame = 0;
    if (this.finished) return;
    const dt = Math.min((now - this.last) / 1000, 0.1);
    this.last = now;
    this.advance(now, dt);
    const { handoff } = this;
    const since = handoff ? (now - handoff.at) / 1000 : 0;
    this.draw(now / 1000, since, dt);
    this.status.write(this.shown, this.day());
    const done = handoff && (this.still() || since > (handoff.intro && !this.day() ? LAMP_RAMP[1] : CANVAS_FADE_S));
    if (done) this.finish(true);
    else if (!this.still() || handoff) this.schedule();
  }

  private schedule(): void {
    if (!this.frame && !this.finished && document.visibilityState === 'visible') this.frame = requestAnimationFrame(now => this.tick(now));
  }

  private poll(): void {
    const now = performance.now();
    if (document.visibilityState === 'visible') this.visibleMs += POLL_MS;
    if (this.visibleMs > SKIP_AFTER_VISIBLE_MS && !this.handoff) this.finish(false);
    else if (this.still()) this.tick(now);
  }

  private finishIfDegraded(): void {
    const tier = this.container.dataset.tier;
    if (this.container.dataset.degraded || tier === 'none' || tier === 'low') this.finish(false);
  }

  private readonly onProgress = (event: Event) => {
    this.progress.set((event as CustomEvent<{ value: number }>).detail.value);
    this.schedule();
  };
  private readonly onReveal = (event: Event) => {
    const detail = (event as CustomEvent<RevealDetail>).detail;
    this.handoff = { at: performance.now(), intro: detail.intro };
    if (detail.lamp) this.lampGoal = detail.lamp;
    this.progress.set(1);
    this.schedule();
  };
  private readonly onVisibility = () => {
    this.last = performance.now();
    this.schedule();
  };
  private readonly onLoad = () => this.progress.set(0.12);
  private readonly onScroll = () => {
    this.atTop = scrollY < 4;
  };
  private readonly onResize = () => {
    this.measure();
    this.schedule();
  };

  private listen(): void {
    window.addEventListener('stage:progress', this.onProgress);
    window.addEventListener('stage:reveal', this.onReveal);
    window.addEventListener('resize', this.onResize, { passive: true });
    window.addEventListener('scroll', this.onScroll, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibility);
    this.observer.observe(this.container, { attributes: true, attributeFilter: ['data-tier', 'data-degraded'] });
  }

  private unlisten(): void {
    this.observer.disconnect();
    window.removeEventListener('stage:progress', this.onProgress);
    window.removeEventListener('stage:reveal', this.onReveal);
    window.removeEventListener('load', this.onLoad);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('scroll', this.onScroll);
    document.removeEventListener('visibilitychange', this.onVisibility);
  }

  private finish(loaded: boolean): void {
    if (this.finished) return;
    this.finished = true;
    cancelAnimationFrame(this.frame);
    clearInterval(this.interval);
    this.unlisten();
    this.canvas.dataset.leaving = '';
    this.status.element.dataset.leaving = '';
    if (loaded) this.status.label.textContent = this.status.element.dataset.done ?? '';
    window.setTimeout(() => {
      this.canvas.remove();
      this.status.element.hidden = true;
    }, loaded ? 2500 : 600);
  }
}
