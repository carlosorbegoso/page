import type { WebGLRenderer } from 'three';
import { cacheSnapshot } from './assets';

/** Read-only view of the Stage the overlay needs. */
interface StageMetrics {
  readonly tierName: string;
  chapterLabel(): string;
  dprValue(): number;
  p75FrameMs(): number;
  refreshIntervalMs(): number;
}

export const METRICS_KEY = 'stage:metrics';

interface StationMetrics {
  calls: number;
  triangles: number;
  p75Ms: number;
  dpr: number;
}

/**
 * Minimal `?debug` overlay (replaces stats.js): FPS from the p75 frame time, DPR,
 * draw calls, triangles and GPU memory. Metrics per station are saved to localStorage
 * (`stage:metrics`) so they can be copied into docs/QA.md.
 */
export class DebugOverlay {
  private readonly el = document.createElement('pre');
  private lastPaint = 0;
  private notes: string[] = [];
  private readonly perStation: Record<string, StationMetrics> = {};

  constructor(
    private readonly renderer: WebGLRenderer,
    private readonly stage: StageMetrics
  ) {
    Object.assign(this.el.style, {
      position: 'fixed',
      right: '8px',
      bottom: '8px',
      zIndex: '2147483647',
      margin: '0',
      padding: '8px 10px',
      font: '11px/1.4 ui-monospace, Menlo, monospace',
      color: '#e9eef5',
      background: 'rgb(0 0 0 / 0.78)',
      borderRadius: '6px',
      pointerEvents: 'none',
      whiteSpace: 'pre'
    });
    this.el.setAttribute('aria-hidden', 'true');
    this.el.dataset.stageDebug = '';
    document.body.appendChild(this.el);
  }

  note(message: string): void {
    this.notes = [...this.notes.slice(-3), message];
  }

  /** Called after each rendered frame; repaints at most twice a second. */
  frame(now: number): void {
    const info = this.renderer.info;
    const station = this.stage.chapterLabel();
    const p75 = this.stage.p75FrameMs();
    const current = this.perStation[station] ?? { calls: 0, triangles: 0, p75Ms: 0, dpr: 0 };
    this.perStation[station] = {
      calls: Math.max(current.calls, info.render.calls),
      triangles: Math.max(current.triangles, info.render.triangles),
      p75Ms: p75 || current.p75Ms,
      dpr: this.stage.dprValue()
    };
    if (now - this.lastPaint < 500) return;
    this.lastPaint = now;
    const heap = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize;
    const lines = [
      `tier ${this.stage.tierName}  chapter ${station}`,
      `fps(p75) ${p75 ? (1000 / p75).toFixed(0) : '—'}  p75 ${p75.toFixed(1)} ms  refresh ${this.stage.refreshIntervalMs().toFixed(1)} ms`,
      `dpr ${this.stage.dprValue()}  calls ${info.render.calls}  tris ${info.render.triangles}`,
      `geo ${info.memory.geometries}  tex ${info.memory.textures}  programs ${info.programs?.length ?? 0}`,
      heap ? `heap ${(heap / 1048576).toFixed(1)} MB` : '',
      `cache ${JSON.stringify(cacheSnapshot())}`,
      ...this.notes
    ].filter(Boolean);
    this.el.textContent = lines.join('\n');
    try {
      localStorage.setItem(
        METRICS_KEY,
        JSON.stringify({
          at: new Date().toISOString(),
          userAgent: navigator.userAgent,
          viewport: `${innerWidth}x${innerHeight}@${devicePixelRatio}`,
          tier: this.stage.tierName,
          refreshMs: this.stage.refreshIntervalMs(),
          memory: { ...info.memory },
          heapMB: heap ? heap / 1048576 : null,
          stations: this.perStation
        })
      );
    } catch {
      /* storage can be unavailable (private mode); the overlay still works */
    }
  }

  dispose(): void {
    this.el.remove();
  }
}
