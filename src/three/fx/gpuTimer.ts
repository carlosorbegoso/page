interface TimerExtension {
  TIME_ELAPSED_EXT: number;
  GPU_DISJOINT_EXT: number;
}

interface PendingQuery {
  label: string;
  query: WebGLQuery;
}

const MAX_PENDING = 48;
const SMOOTHING = 0.1;

export class GpuTimer {
  private readonly ext: TimerExtension | null;
  private readonly pending: PendingQuery[] = [];
  private active: PendingQuery | null = null;
  readonly ms = new Map<string, number>();
  private samples = 0;
  private readonly metal: boolean;

  constructor(private readonly gl: WebGL2RenderingContext) {
    this.ext = gl.getExtension('EXT_disjoint_timer_query_webgl2') as TimerExtension | null;
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
    this.metal = /metal/i.test(renderer);
  }

  get supported(): boolean {
    return this.ext !== null;
  }

  get trusted(): boolean {
    return this.ext !== null && !this.metal;
  }

  get sampleCount(): number {
    return this.samples;
  }

  begin(label: string): void {
    if (!this.ext || this.active || this.pending.length >= MAX_PENDING) return;
    const query = this.gl.createQuery();
    if (!query) return;
    this.gl.beginQuery(this.ext.TIME_ELAPSED_EXT, query);
    this.active = { label, query };
  }

  end(): void {
    if (!this.ext || !this.active) return;
    this.gl.endQuery(this.ext.TIME_ELAPSED_EXT);
    this.pending.push(this.active);
    this.active = null;
  }

  poll(): void {
    if (!this.ext || !this.pending.length) return;
    const disjoint = Boolean(this.gl.getParameter(this.ext.GPU_DISJOINT_EXT));
    let done = 0;
    for (const entry of this.pending) {
      if (!this.gl.getQueryParameter(entry.query, this.gl.QUERY_RESULT_AVAILABLE)) break;
      if (!disjoint) {
        const ms = Number(this.gl.getQueryParameter(entry.query, this.gl.QUERY_RESULT)) / 1e6;
        const previous = this.ms.get(entry.label);
        this.ms.set(entry.label, previous === undefined ? ms : previous + (ms - previous) * SMOOTHING);
        if (entry.label === 'composite') this.samples++;
      }
      this.gl.deleteQuery(entry.query);
      done++;
    }
    this.pending.splice(0, done);
  }

  reset(): void {
    this.ms.clear();
    this.samples = 0;
  }

  dispose(): void {
    if (this.active) this.end();
    for (const entry of this.pending) this.gl.deleteQuery(entry.query);
    this.pending.length = 0;
  }
}
