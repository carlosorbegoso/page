import { clamp01, type Point } from './frame';

const MOTES = 34;

export interface Mote {
  u: number;
  v: number;
  phase: number;
  speed: number;
}

/** Light cone or dust stream: from `origin` along `direction`, `length` long and `spread` wide (CSS px). */
export interface Ray {
  origin: Point;
  direction: Point;
  length: number;
  spread: number;
}

export function createMotes(): Mote[] {
  return Array.from({ length: MOTES }, (_, i) => ({ u: Math.random(), v: Math.random() * 2 - 1, phase: i * 2.399, speed: 0.4 + Math.random() * 0.8 }));
}

/** Canvas 2D primitives of the loader, drawn in CSS px scaled by `scale`. */
export class Painter {
  constructor(
    readonly ctx: CanvasRenderingContext2D,
    private readonly motes: Mote[],
    public scale = 1
  ) {}

  motesAlong(ray: Ray, rgb: string, strength: number, time: number): void {
    const { ctx, scale } = this;
    const norm = Math.hypot(ray.direction.x, ray.direction.y);
    const dx = ray.direction.x / norm;
    const dy = ray.direction.y / norm;
    ctx.fillStyle = `rgb(${rgb})`;
    for (const mote of this.motes) {
      const u = (mote.u + Math.sin(time * 0.05 * mote.speed + mote.phase) * 0.04 + 1) % 1;
      const v = mote.v + Math.sin(time * 0.3 * mote.speed + mote.phase) * 0.15;
      const along = 0.08 + u * 0.92;
      const x = ray.origin.x + dx * along * ray.length - dy * v * along * ray.spread;
      const y = ray.origin.y + dy * along * ray.length + dx * v * along * ray.spread;
      const twinkle = 0.55 + 0.45 * Math.sin(time * 1.7 * mote.speed + mote.phase);
      ctx.globalAlpha = clamp01(strength * twinkle * (1 - u * 0.7) * (1 - Math.abs(v) * 0.6));
      const size = (0.8 + mote.speed) * scale;
      ctx.fillRect(x * scale, y * scale, size, size);
    }
    ctx.globalAlpha = 1;
  }

  cone(ray: Ray, rgb: string, alpha: number): void {
    const { ctx, scale } = this;
    const { origin, length, spread } = ray;
    const norm = Math.hypot(ray.direction.x, ray.direction.y);
    const dx = (ray.direction.x / norm) * length;
    const dy = (ray.direction.y / norm) * length;
    const px = (-dy / length) * spread;
    const py = (dx / length) * spread;
    const gradient = ctx.createRadialGradient(origin.x * scale, origin.y * scale, 0, origin.x * scale, origin.y * scale, length * scale);
    gradient.addColorStop(0, `rgba(${rgb},${alpha})`);
    gradient.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(origin.x * scale, origin.y * scale);
    ctx.lineTo((origin.x + dx + px) * scale, (origin.y + dy + py) * scale);
    ctx.lineTo((origin.x + dx - px) * scale, (origin.y + dy - py) * scale);
    ctx.closePath();
    ctx.fill();
  }

  glow(at: Point, radius: number, rgb: string, alpha: number): void {
    const { ctx, scale } = this;
    const gradient = ctx.createRadialGradient(at.x * scale, at.y * scale, 0, at.x * scale, at.y * scale, radius * scale);
    gradient.addColorStop(0, `rgba(${rgb},${alpha})`);
    gradient.addColorStop(0.35, `rgba(${rgb},${alpha * 0.35})`);
    gradient.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = gradient;
    ctx.fillRect((at.x - radius) * scale, (at.y - radius) * scale, radius * 2 * scale, radius * 2 * scale);
  }
}
