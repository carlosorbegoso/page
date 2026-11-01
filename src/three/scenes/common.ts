import { AdditiveBlending, CanvasTexture, Sprite, SpriteMaterial, SRGBColorSpace, type Texture } from 'three';
import { acquire, release } from '../assets';

export function damp(current: number, target: number, lambda: number, dt: number): number {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
}

/** GSAP's power2.inOut. */
export function power2InOut(t: number): number {
  const x = Math.min(Math.max(t, 0), 1);
  return x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2;
}

export type LayoutKind = 'desktop' | 'tablet' | 'phone';

export function layoutKind(width: number): LayoutKind {
  if (width >= 1024) return 'desktop';
  if (width >= 768) return 'tablet';
  return 'phone';
}

/**
 * A phone held upright: the room fills the top of the frame like a film shot and every chapter's
 * text sits under it as a 2D panel, the monitor chapters included (the phone surface stays).
 */
export function stackedLayout(view: { width: number; height: number }): boolean {
  return layoutKind(view.width) === 'phone' && view.width < view.height;
}

export function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const GLOW_KEY = 'texture:glow';

function bakeGlow(): Texture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.18, 'rgba(255,255,255,0.55)');
  gradient.addColorStop(0.5, 'rgba(255,255,255,0.12)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

/** Soft radial glow, shared with refcount. */
export function acquireGlow(): Promise<Texture> {
  return acquire(GLOW_KEY, async () => bakeGlow(), texture => texture.dispose());
}

export function releaseGlow(): void {
  release(GLOW_KEY);
}

/** Additive camera-facing glow sprite. */
export function glowSprite(texture: Texture, size: number, opacity: number): Sprite {
  const sprite = new Sprite(
    new SpriteMaterial({ map: texture, blending: AdditiveBlending, depthWrite: false, transparent: true, opacity, fog: false })
  );
  sprite.scale.setScalar(size);
  sprite.raycast = () => undefined;
  return sprite;
}
