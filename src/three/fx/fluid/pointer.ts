import { Vector2 } from 'three';
import type { FluidStroke } from './field';

export class FluidPointerInput {
  private readonly target = new Vector2();
  private readonly eased = new Vector2();
  private readonly previous = new Vector2();
  private readonly stroke: FluidStroke = { from: new Vector2(), to: new Vector2(), force: new Vector2() };
  private rect: DOMRect | null = null;
  private hasTarget = false;
  private snap = true;
  private readonly cleanups: Array<() => void> = [];

  constructor(
    private readonly canvas: () => HTMLElement | null,
    private readonly damping: number
  ) {
    const on = <K extends keyof WindowEventMap>(type: K, handler: (event: WindowEventMap[K]) => void) => {
      window.addEventListener(type, handler, { passive: true });
      this.cleanups.push(() => window.removeEventListener(type, handler));
    };
    on('pointermove', event => {
      if (event.pointerType === 'touch') return;
      this.point(event.clientX, event.clientY);
    });
    on('touchstart', event => {
      const touch = event.touches[0];
      if (!touch) return;
      this.snap = true;
      this.point(touch.clientX, touch.clientY);
    });
    on('touchmove', event => {
      const touch = event.touches[0];
      if (touch) this.point(touch.clientX, touch.clientY);
    });
    on('touchend', () => this.release());
    on('touchcancel', () => this.release());
    on('blur', () => this.release());
    on('resize', () => {
      this.rect = null;
    });
    const leave = () => this.release();
    document.documentElement.addEventListener('pointerleave', leave);
    this.cleanups.push(() => document.documentElement.removeEventListener('pointerleave', leave));
  }

  private point(x: number, y: number): void {
    const element = this.canvas();
    if (!element) return;
    this.rect ??= element.getBoundingClientRect();
    if (!this.rect.width || !this.rect.height) return;
    this.target.set((x - this.rect.left) / this.rect.width, 1 - (y - this.rect.top) / this.rect.height);
    if (!this.hasTarget) this.snap = true;
    this.hasTarget = true;
  }

  private release(): void {
    this.hasTarget = false;
  }

  invalidateRect(): void {
    this.rect = null;
  }

  consume(dt: number): FluidStroke | null {
    if (!this.hasTarget) return null;
    if (this.snap) {
      this.snap = false;
      this.eased.copy(this.target);
      this.previous.copy(this.target);
      return null;
    }
    const k = 1 - Math.pow(1 - this.damping, Math.max(dt, 1 / 240) * 60);
    this.previous.copy(this.eased);
    this.eased.lerp(this.target, k);
    const { from, to, force } = this.stroke;
    from.copy(this.previous);
    to.copy(this.eased);
    force.subVectors(to, from).divideScalar(Math.max(dt, 1 / 240));
    if (force.lengthSq() < 1e-6) return null;
    if (force.length() > 4) force.setLength(4);
    return this.stroke;
  }

  dispose(): void {
    for (const cleanup of this.cleanups) cleanup();
    this.cleanups.length = 0;
  }
}
