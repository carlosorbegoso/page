import { Vector3 } from 'three';
import type { ChapterId, PlateAnchor, Shot, StationContext, SurfaceName } from '../../contracts';
import { framings, monitorFrame, panelAnchor, toShot, type Framing, type SurfaceFrame, type Viewport } from '../shots';

export class DeskFraming {
  private size: { width: number; height: number } | null = null;
  private observer: ResizeObserver | null = null;
  private readonly onViewportChange = () => {
    this.size = null;
  };

  constructor(
    private readonly context: StationContext,
    private readonly phoneSurface: () => SurfaceFrame
  ) {}

  viewport(): Viewport {
    const canvas = this.context.renderer.domElement;
    if (!this.observer) {
      this.observer = new ResizeObserver(() => {
        this.size = this.read(canvas);
      });
      this.observer.observe(canvas);
      window.addEventListener('resize', this.onViewportChange, { capture: true, passive: true });
      window.addEventListener('orientationchange', this.onViewportChange, { capture: true, passive: true });
    }
    this.size ??= this.read(canvas);
    const { width, height } = this.size;
    return { width, height, fov: this.context.fov?.() ?? (width < 1024 ? 40 : 30) };
  }

  private read(canvas: HTMLCanvasElement): { width: number; height: number } {
    return { width: canvas.clientWidth || innerWidth, height: canvas.clientHeight || innerHeight };
  }

  framing(chapter: ChapterId, subIndex = 0): Framing | null {
    const list = framings(this.viewport(), this.phoneSurface())[chapter];
    return list[Math.min(Math.max(subIndex, 0), list.length - 1)] ?? null;
  }

  shot(chapter: ChapterId, subIndex = 0): Shot | null {
    const framing = this.framing(chapter, subIndex);
    return framing ? toShot(framing, this.viewport()) : null;
  }

  surface(name: SurfaceName, chapter: ChapterId): PlateAnchor | null {
    const frame = name === 'monitor' ? monitorFrame() : this.phoneSurface();
    const reader: ChapterId = name === 'phone' ? 'contact' : chapter === 'about' ? 'about' : 'hero';
    const shot = this.shot(reader, reader === 'about' ? 1 : 0);
    const view = this.viewport();
    if (!shot || view.height <= 0) return null;
    const distance = shot.position.distanceTo(frame.centre);
    const scale = (2 * distance * Math.tan((view.fov * Math.PI) / 360)) / view.height;
    return {
      position: frame.centre.clone().addScaledVector(frame.normal, 0.0015),
      quaternion: frame.quaternion.clone(),
      scale,
      size: { width: frame.width, height: frame.height }
    };
  }

  panel(name: string): Vector3 | null {
    const view = this.viewport();
    const all = framings(view, this.phoneSurface());
    for (const list of Object.values(all)) {
      for (const framing of list) {
        if (framing.panel?.name === name) return panelAnchor(framing, view);
      }
    }
    return null;
  }

  dispose(): void {
    this.observer?.disconnect();
    this.observer = null;
    this.size = null;
    window.removeEventListener('resize', this.onViewportChange, { capture: true });
    window.removeEventListener('orientationchange', this.onViewportChange, { capture: true });
  }
}
