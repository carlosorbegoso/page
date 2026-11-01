import type { Vector3 } from 'three';
import type { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import type { ChapterId, PlateAnchor, PlateMode, SurfaceName } from '../contracts';

export interface Origin {
  plate: HTMLElement;
  parent: Node;
  next: Node | null;
}

export interface PlateEntry {
  el: HTMLElement;
  chapter: ChapterId;
  mode: PlateMode;
  /** Sub-shot the plate belongs to, or null = every sub-shot of its chapter. */
  sub: number | null;
  /** Wrapper the engine moves (CSS3DObject element or 2D panel); the plate itself is never transformed. */
  wrapper: HTMLElement;
  object?: CSS3DObject;
  anchorName?: string;
  side?: 'left' | 'right';
  /** Natural border-box size of an anchored plate, kept by a ResizeObserver so placement never reads layout. */
  size?: { width: number; height: number };
  /** Last values written, so a settled frame touches no style. */
  written: { opacity?: string; pointer?: string; transform?: string; surface?: string; clip?: string };
}

export interface PlateHost {
  surface(name: SurfaceName): PlateAnchor | null;
  anchor(name: string): Vector3 | null;
  /** Scrolls the page to a chapter / sub-shot (used when keyboard focus enters a plate). */
  scrollTo(chapter: ChapterId, sub: number): void;
  reduced(): boolean;
  /** Requests a frame (a panel changed size while the loop was idle). */
  invalidate(): void;
}

export interface Viewport {
  width: number;
  height: number;
}

/** `env(safe-area-inset-*)` in px. */
export interface SafeInsets {
  top: number;
  bottom: number;
}
