import type { WebGLRenderer } from 'three';
import { cacheSnapshot } from './assets';

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

  frame(now: number): void {
    const station = this.stage.chapterLabel();
    const p75 = this.stage.p75FrameMs();
    this.recordStation(station, p75);
    if (now - this.lastPaint < 500) return;
    this.lastPaint = now;
    const heap = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize;
    this.el.textContent = this.overlayLines(station, p75, heap).join('\n');
    this.saveMetrics(heap);
  }

  private recordStation(station: string, p75: number): void {
    const info = this.renderer.info;
    const current = this.perStation[station] ?? { calls: 0, triangles: 0, p75Ms: 0, dpr: 0 };
    this.perStation[station] = {
      calls: Math.max(current.calls, info.render.calls),
      triangles: Math.max(current.triangles, info.render.triangles),
      p75Ms: p75 || current.p75Ms,
      dpr: this.stage.dprValue()
    };
  }

  private overlayLines(station: string, p75: number, heap: number | undefined): string[] {
    const info = this.renderer.info;
    return [
      `tier ${this.stage.tierName}  chapter ${station}`,
      `fps(p75) ${p75 ? (1000 / p75).toFixed(0) : '—'}  p75 ${p75.toFixed(1)} ms  refresh ${this.stage.refreshIntervalMs().toFixed(1)} ms`,
      `dpr ${this.stage.dprValue()}  calls ${info.render.calls}  tris ${info.render.triangles}`,
      `geo ${info.memory.geometries}  tex ${info.memory.textures}  programs ${info.programs?.length ?? 0}`,
      heap ? `heap ${(heap / 1048576).toFixed(1)} MB` : '',
      `cache ${JSON.stringify(cacheSnapshot())}`,
      ...this.notes
    ].filter(Boolean);
  }

  private saveMetrics(heap: number | undefined): void {
    try {
      localStorage.setItem(
        METRICS_KEY,
        JSON.stringify({
          at: new Date().toISOString(),
          userAgent: navigator.userAgent,
          viewport: `${innerWidth}x${innerHeight}@${devicePixelRatio}`,
          tier: this.stage.tierName,
          refreshMs: this.stage.refreshIntervalMs(),
          memory: { ...this.renderer.info.memory },
          heapMB: heap ? heap / 1048576 : null,
          stations: this.perStation
        })
      );
    } catch {
    }
  }

  dispose(): void {
    this.el.remove();
  }
}
