import { seeded } from '../math';
import type { PaneRect } from './editor';

const SAMPLES = 64;
const SAMPLE_SECONDS = 0.45;
const COLOR = { page: '#111217', panel: '#181b1f', border: '#2a2d33', title: '#ccccdc', dim: '#8e8e9e', green: '#73bf69', yellow: '#fade2a', orange: '#ff9830', blue: '#5794f2', red: '#f2495c' } as const;
const STAT_FONT = '600 30px ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';
const TRAFFIC_COLORS = [COLOR.green];
const LATENCY_COLORS = [COLOR.yellow, COLOR.orange];
const integers: string[] = [];

function rect(): PaneRect {
  return { x: 0, y: 0, width: 0, height: 0 };
}

function place(target: PaneRect, x: number, y: number, width: number, height: number): PaneRect {
  target.x = x;
  target.y = y;
  target.width = width;
  target.height = height;
  return target;
}
const hundredths: string[] = [];

function integerText(value: number): string {
  const n = Math.max(0, Math.round(value));
  return (integers[n] ??= String(n));
}

function hundredthText(value: number): string {
  const n = Math.max(0, Math.round(value * 100));
  return (hundredths[n] ??= (n / 100).toFixed(2));
}

class Series {
  readonly values = new Float32Array(SAMPLES);
  head = 0;

  push(value: number): void {
    this.values[this.head] = value;
    this.head = (this.head + 1) % SAMPLES;
  }

  latest(): number {
    return this.values[(this.head + SAMPLES - 1) % SAMPLES]!;
  }

  at(i: number): number {
    return this.values[(this.head + i) % SAMPLES]!;
  }
}

export class LaptopDashboard {
  private readonly rps = new Series();
  private readonly p95 = new Series();
  private readonly p99 = new Series();
  private readonly errors = new Series();
  private readonly heap = new Series();
  private readonly noise = seeded(7);
  private readonly traffic = [this.rps];
  private readonly latency = [this.p95, this.p99];
  private readonly rects = { left: rect(), right: rect(), bottom: rect(), tile: rect() };
  private sampledAt = -1;

  constructor() {
    for (let i = 0; i < SAMPLES; i++) this.sample((i - SAMPLES) * SAMPLE_SECONDS);
  }

  private sample(t: number): void {
    const n = this.noise() - 0.5;
    const rps = 1240 + 160 * Math.sin(t * 0.21) + 70 * Math.sin(t * 1.3) + 90 * n;
    const p95 = 176 + 26 * Math.sin(t * 0.37 + 1) + 18 * n;
    this.rps.push(rps);
    this.p95.push(p95);
    this.p99.push(p95 * 1.55 + 30 * Math.abs(n));
    this.errors.push(0.18 + 0.08 * Math.sin(t * 0.5) + 0.06 * n);
    this.heap.push(0.42 + 0.3 * ((t * 0.06) % 1));
  }

  draw(ctx: CanvasRenderingContext2D, pane: PaneRect, time: number): void {
    if (this.sampledAt < 0 || time - this.sampledAt > SAMPLES * SAMPLE_SECONDS) this.sampledAt = time;
    while (time - this.sampledAt >= SAMPLE_SECONDS) {
      this.sampledAt += SAMPLE_SECONDS;
      this.sample(this.sampledAt);
    }
    const { x, y, width } = pane;
    ctx.fillStyle = COLOR.page;
    ctx.fillRect(x, y, width, pane.height);
    ctx.fillStyle = COLOR.title;
    ctx.fillText('Grafana  /  ventixs-api · production', x + 12, y + 17);
    ctx.fillStyle = COLOR.dim;
    ctx.fillText('Last 15 minutes  ⟳ 5s', x + width - 150, y + 17);
    const gap = 8;
    const tile = (width - gap * 4) / 3;
    this.stat(ctx, x + gap, y + 28, tile, 'Requests / s', integerText(this.rps.latest()), '', COLOR.green);
    this.stat(ctx, x + gap * 2 + tile, y + 28, tile, 'Latency p95', integerText(this.p95.latest()), 'ms', COLOR.yellow);
    this.stat(ctx, x + gap * 3 + tile * 2, y + 28, tile, 'Error rate', hundredthText(this.errors.latest()), '%', COLOR.green);
    const half = (width - gap * 3) / 2;
    const chartTop = y + 104;
    const { left, right, bottom } = this.rects;
    this.chart(ctx, place(left, x + gap, chartTop, half, 190), 'HTTP requests', this.traffic, TRAFFIC_COLORS, 900, 1600);
    this.chart(ctx, place(right, x + gap * 2 + half, chartTop, half, 190), 'Latency p95 / p99', this.latency, LATENCY_COLORS, 100, 360);
    this.gauge(ctx, place(bottom, x + gap, chartTop + 198, width - gap * 2, pane.height - 310), time);
  }

  private panel(ctx: CanvasRenderingContext2D, rect: PaneRect, title: string): void {
    ctx.fillStyle = COLOR.panel;
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    ctx.strokeStyle = COLOR.border;
    ctx.strokeRect(rect.x + 0.5, rect.y + 0.5, rect.width - 1, rect.height - 1);
    ctx.fillStyle = COLOR.title;
    ctx.fillText(title, rect.x + 10, rect.y + 16);
  }

  private stat(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, title: string, value: string, unit: string, color: string): void {
    this.panel(ctx, place(this.rects.tile, x, y, width, 68), title);
    const font = ctx.font;
    ctx.font = STAT_FONT;
    ctx.fillStyle = color;
    ctx.fillText(value, x + 12, y + 56);
    const valueWidth = ctx.measureText(value).width;
    ctx.font = font;
    ctx.fillText(unit, x + 18 + valueWidth, y + 56);
  }

  private chart(ctx: CanvasRenderingContext2D, rect: PaneRect, title: string, series: readonly Series[], colors: readonly string[], low: number, high: number): void {
    this.panel(ctx, rect, title);
    const left = rect.x + 10;
    const top = rect.y + 26;
    const width = rect.width - 20;
    const height = rect.height - 36;
    ctx.strokeStyle = COLOR.border;
    ctx.beginPath();
    for (let g = 0; g <= 3; g++) {
      ctx.moveTo(left, top + (height * g) / 3);
      ctx.lineTo(left + width, top + (height * g) / 3);
    }
    ctx.stroke();
    ctx.lineWidth = 1.6;
    for (let index = 0; index < series.length; index++) {
      const s = series[index]!;
      ctx.strokeStyle = colors[index]!;
      ctx.beginPath();
      for (let i = 0; i < SAMPLES; i++) {
        const px = left + (width * i) / (SAMPLES - 1);
        const py = top + height * (1 - (s.at(i) - low) / (high - low));
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    ctx.lineWidth = 1;
  }

  private gauge(ctx: CanvasRenderingContext2D, rect: PaneRect, time: number): void {
    this.panel(ctx, rect, 'JVM heap · pods');
    const used = this.heap.latest();
    const barWidth = rect.width * 0.55;
    const barY = rect.y + 30;
    ctx.fillStyle = COLOR.border;
    ctx.fillRect(rect.x + 10, barY, barWidth, 16);
    ctx.fillStyle = used > 0.68 ? COLOR.orange : COLOR.green;
    ctx.fillRect(rect.x + 10, barY, barWidth * used, 16);
    ctx.fillStyle = COLOR.title;
    ctx.fillText(integerText(used * 100), rect.x + 18 + barWidth, barY + 12);
    for (let pod = 0; pod < 6; pod++) {
      const blink = pod === 4 && Math.floor(time) % 7 === 0;
      ctx.fillStyle = blink ? COLOR.yellow : COLOR.green;
      ctx.beginPath();
      ctx.arc(rect.x + rect.width * 0.62 + 10 + pod * 26, barY + 8, 7, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

