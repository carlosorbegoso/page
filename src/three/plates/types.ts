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
  sub: number | null;
  wrapper: HTMLElement;
  object?: CSS3DObject;
  anchorName?: string;
  side?: 'left' | 'right';
  size?: { width: number; height: number };
  written: { opacity?: string; pointer?: string; transform?: string; surface?: string; clip?: string };
}

export interface PlateHost {
  surface(name: SurfaceName): PlateAnchor | null;
  anchor(name: string): Vector3 | null;
  scrollTo(chapter: ChapterId, sub: number): void;
  reduced(): boolean;
  invalidate(): void;
}

export interface Viewport {
  width: number;
  height: number;
}

export interface SafeInsets {
  top: number;
  bottom: number;
}
