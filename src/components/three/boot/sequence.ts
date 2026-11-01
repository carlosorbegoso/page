import { RouteProgress } from './progress';
import {
  FAIL_EXIT,
  FAIL_REDIRECT_MS,
  FAST_EXIT,
  FAST_LOAD_MS,
  formatElapsed,
  HUD_AFTER_OPEN_MS,
  NORMAL_EXIT,
  STILL_EXIT,
  type BootPhase,
  type Cue
} from './timeline';

interface Point {
  x: number;
  y: number;
}

interface RevealDetail {
  intro: boolean;
  monitor?: Point | null;
}

const WARM_KEY = 'stage:warm';
const SAFETY_MS = 15000;
const NO_WEBGL_NOTICE_MS = 500;
const BOOT_STARTED = 0.3;
const UNSUPPORTED = new Set(['no-webgl2', 'software-renderer']);
const AUTOMATED = /bot|crawl|spider|slurp|lighthouse|headless/i;

export function warmVisit(): boolean {
  try {
    return sessionStorage.getItem(WARM_KEY) === '1';
  } catch {
    return false;
  }
}

function rememberWarm(): void {
  try {
    sessionStorage.setItem(WARM_KEY, '1');
  } catch {
    return;
  }
}

export class BootSequence {
  private readonly progress = new RouteProgress();
  private readonly nodes: HTMLElement[];
  private readonly tag: HTMLElement | null;
  private readonly response: HTMLElement | null;
  private readonly status: HTMLElement | null;
  private readonly observer: MutationObserver;
  private readonly timers: number[] = [];
  private bootStart = -1;
  private exiting = false;
  private released = false;

  constructor(
    private readonly root: HTMLElement,
    private readonly stage: HTMLElement | null
  ) {
    this.nodes = [...root.querySelectorAll<HTMLElement>('[data-boot-node]')];
    this.tag = root.querySelector('[data-boot-tag]');
    this.response = root.querySelector('[data-boot-response]');
    this.status = root.querySelector('[data-boot-status]');
    this.observer = new MutationObserver(() => this.checkStage());
  }

  start(): void {
    window.addEventListener('stage:progress', this.onProgress);
    window.addEventListener('stage:assets', this.onAssets);
    window.addEventListener('stage:reveal', this.onReveal);
    window.addEventListener('keydown', this.onKey);
    this.root.addEventListener('pointerdown', this.onPointer);
    if (this.stage)
      this.observer.observe(this.stage, {
        attributes: true,
        attributeFilter: ['data-tier', 'data-degraded']
      });
    if (document.readyState === 'complete') this.progress.phase(0.12);
    else window.addEventListener('load', this.onLoad, { once: true });
    this.later(() => this.release(), SAFETY_MS);
    if (document.documentElement.dataset.webgl === 'none')
      this.later(() => this.fail(), NO_WEBGL_NOTICE_MS);
    this.paint();
  }

  private readonly onLoad = () => {
    this.progress.phase(0.12);
    this.paint();
  };

  private readonly onProgress = (event: Event) => {
    const { value } = (event as CustomEvent<{ value: number }>).detail;
    if (value >= BOOT_STARTED && this.bootStart < 0) this.bootStart = performance.now();
    this.progress.phase(value);
    this.paint();
  };

  private readonly onAssets = (event: Event) => {
    const { loaded, total } = (event as CustomEvent<{ loaded: number; total: number }>).detail;
    this.progress.assets(loaded, total);
    this.paint();
  };

  private readonly onReveal = (event: Event) =>
    this.exit((event as CustomEvent<RevealDetail>).detail);

  private readonly onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && this.exiting) this.skip();
  };

  private readonly onPointer = () => {
    if (this.exiting) this.skip();
  };

  private paint(): void {
    if (this.exiting) return;
    const position = this.progress.position();
    this.root.style.setProperty('--boot-p', position.toFixed(4));
    this.nodes.forEach((node, i) =>
      node.toggleAttribute('data-lit', position >= i / (this.nodes.length - 1) - 0.01)
    );
    const count = this.progress.assetCount();
    if (this.tag) this.tag.textContent = count ? `GET /carlos · ${count}` : 'GET /carlos';
  }

  private checkStage(): void {
    if (this.exiting || !this.stage) return;
    const { tier, tierReason, degraded } = this.stage.dataset;
    if (degraded === 'error' || (tier === 'none' && UNSUPPORTED.has(tierReason ?? ''))) this.fail();
    else if (tier === 'none' || degraded) this.release();
  }

  private still(): boolean {
    return (
      matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.dataset.motion === 'paused'
    );
  }

  private exit(detail: RevealDetail): void {
    if (this.exiting) return;
    this.exiting = true;
    const elapsed = this.bootStart < 0 ? performance.now() : performance.now() - this.bootStart;
    if (this.response) this.response.textContent = `200 OK · ${formatElapsed(elapsed)}`;
    if (this.tag) this.tag.textContent = 'GET /carlos';
    this.aimAt(detail.monitor ?? null);
    this.nodes.forEach(node => node.setAttribute('data-lit', ''));
    const cues = this.still() ? STILL_EXIT : elapsed < FAST_LOAD_MS ? FAST_EXIT : NORMAL_EXIT;
    this.play(cues);
  }

  private aimAt(monitor: Point | null): void {
    const target = monitor ?? { x: innerWidth / 2, y: innerHeight / 2 };
    const style = this.root.style;
    style.setProperty('--boot-x', `${target.x}px`);
    style.setProperty('--boot-y', `${target.y}px`);
    style.setProperty('--boot-dx', `${target.x - innerWidth / 2}px`);
    style.setProperty('--boot-dy', `${target.y - innerHeight / 2}px`);
  }

  private play(cues: readonly Cue[]): void {
    for (const cue of cues) this.later(() => this.cue(cue), cue.at);
  }

  private cue(cue: Cue): void {
    if (cue.travel !== undefined) this.root.style.setProperty('--boot-travel', `${cue.travel}ms`);
    if (cue.position !== undefined) this.root.style.setProperty('--boot-p', String(cue.position));
    this.setPhase(cue.phase);
  }

  private setPhase(phase: BootPhase): void {
    this.root.dataset.phase = phase;
    if (phase === 'ok' && this.status) this.status.textContent = this.root.dataset.loaded ?? '';
    if (phase === 'open') this.open();
    if (phase === 'done') this.later(() => this.release(), 250);
  }

  private open(): void {
    window.dispatchEvent(new CustomEvent('stage:boot-open'));
    rememberWarm();
    this.later(() => document.documentElement.classList.remove('booting'), HUD_AFTER_OPEN_MS);
  }

  private skip(): void {
    this.clearTimers();
    window.dispatchEvent(new CustomEvent('stage:skip'));
    window.dispatchEvent(new CustomEvent('stage:boot-open'));
    rememberWarm();
    this.setPhase('done');
  }

  private fail(): void {
    if (this.exiting) return;
    this.exiting = true;
    if (this.response) this.response.textContent = this.root.dataset.unavailable ?? '';
    if (this.tag) this.tag.textContent = '503';
    if (this.status) this.status.textContent = this.root.dataset.failed ?? '';
    this.play(FAIL_EXIT);
    this.later(() => this.leaveForReading(), FAIL_REDIRECT_MS);
  }

  private leaveForReading(): void {
    const reading = this.root.dataset.reading;
    const testing = new URLSearchParams(location.search).has('tier');
    if (!reading || testing || navigator.webdriver || AUTOMATED.test(navigator.userAgent))
      this.release();
    else location.replace(reading);
  }

  private later(run: () => void, ms: number): void {
    this.timers.push(window.setTimeout(run, ms));
  }

  private clearTimers(): void {
    for (const timer of this.timers.splice(0)) clearTimeout(timer);
  }

  private release(): void {
    if (this.released) return;
    this.released = true;
    this.clearTimers();
    this.observer.disconnect();
    window.removeEventListener('stage:progress', this.onProgress);
    window.removeEventListener('stage:assets', this.onAssets);
    window.removeEventListener('stage:reveal', this.onReveal);
    window.removeEventListener('keydown', this.onKey);
    window.removeEventListener('load', this.onLoad);
    document.documentElement.classList.remove('booting', 'stage-pending');
    this.root.hidden = true;
  }
}
