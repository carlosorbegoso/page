import type { ChapterId, SurfaceName } from '../contracts';
import { Plates } from '../plates';
import type { Vector3 } from 'three';
import type { PlateAnchor } from '../contracts';

const STACKED_MODE = 'anchored';
const DISSOLVE_HALF_MS = 150;

export interface PlateHost {
  surface(name: SurfaceName): PlateAnchor | null;
  anchor(name: string): Vector3 | null;
  scrollTo(chapter: ChapterId, sub: number): void;
  reduced(): boolean;
  invalidate(): void;
}

function applyPlateModes(stacked: boolean): void {
  for (const plate of document.querySelectorAll<HTMLElement>('[data-plate-stacked]')) {
    plate.dataset.plateWide ??= plate.dataset.plateMode ?? '';
    plate.dataset.plateMode = stacked ? STACKED_MODE : plate.dataset.plateWide;
    plate.toggleAttribute('data-plate-printed', stacked && plate.dataset.plateStacked === 'printed');
  }
}

export function mountPlates(host: PlateHost, stacked: boolean, size: { width: number; height: number }): Plates | undefined {
  applyPlateModes(stacked);
  const plates = new Plates({
    surface: name => host.surface(name),
    anchor: name => host.anchor(name),
    scrollTo: (chapter, sub) => host.scrollTo(chapter, sub),
    reduced: () => host.reduced(),
    invalidate: () => host.invalidate()
  });
  if (!plates.mount()) return undefined;
  plates.setSize(size.width, size.height);
  return plates;
}

export function dissolve(layers: HTMLElement[], cut: () => void, invalidate: () => void): void {
  const fade = (direction: PlaybackDirection, fill: FillMode) =>
    layers.map(el => el.animate([{ filter: 'brightness(1)' }, { filter: 'brightness(0)' }], { duration: DISSOLVE_HALF_MS, fill, direction }));
  const out = fade('normal', 'forwards');
  void Promise.all(out.map(a => a.finished)).then(() => {
    cut();
    invalidate();
    requestAnimationFrame(() => {
      fade('reverse', 'none');
      for (const a of out) a.cancel();
    });
  });
}
