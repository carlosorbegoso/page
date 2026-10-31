import { Raycaster, Vector2, type Object3D, type PerspectiveCamera } from 'three';
import type { StationPick } from './contracts';

const UI_SELECTOR =
  'a, button, input, textarea, select, label, summary, [role="button"], [tabindex]:not([tabindex="-1"]), [contenteditable], [data-panel], [data-plate], [data-plate-wrapper]';

export interface PickSource {
  picks(): readonly StationPick[];
  resolvePick(object: Object3D): StationPick | null;
  setHover(object: Object3D | null): void;
}

export interface InteractionOptions {
  source: PickSource;
  camera: PerspectiveCamera;
  canvas: HTMLCanvasElement;
  navigate: (pick: StationPick) => void;
  invalidate: () => void;
}

function labelOf(pick: StationPick): string {
  if (typeof pick.label === 'string') return pick.label;
  return document.documentElement.lang.startsWith('en') ? pick.label.en : pick.label.es;
}

/**
 * Scene navigation by raycasting the desk's picks: hover shows a pointer cursor and emits
 * `scene:hover` (fine pointers only); click or tap navigates to the pick's chapter.
 */
export function setupInteraction(options: InteractionOptions): () => void {
  const { source, camera, canvas } = options;
  const raycaster = new Raycaster();
  const ndc = new Vector2();
  const finePointer = matchMedia('(pointer: fine)').matches;
  let hovered: StationPick | null = null;
  let pending: PointerEvent | null = null;

  const pick = (event: PointerEvent | MouseEvent): StationPick | null => {
    const target = event.target as Element | null;
    if (target?.closest?.(UI_SELECTOR)) return null;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    ndc.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const objects = source.picks().map(p => p.object3D);
    for (const hit of raycaster.intersectObjects(objects, true)) {
      const meaning = source.resolvePick(hit.object);
      if (meaning) return meaning;
    }
    return null;
  };

  const setHover = (next: StationPick | null) => {
    if (next?.key === hovered?.key) return;
    hovered = next;
    document.body.style.cursor = next ? 'pointer' : '';
    source.setHover(next?.object3D ?? null);
    window.dispatchEvent(new CustomEvent('scene:hover', { detail: { label: next ? labelOf(next) : null } }));
    options.invalidate();
  };

  const onMove = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
    const scheduled = pending !== null;
    pending = event;
    if (scheduled) return;
    requestAnimationFrame(() => {
      if (pending) setHover(pick(pending));
      pending = null;
    });
  };

  const onLeave = () => setHover(null);

  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || getSelection()?.toString()) return;
    const hit = pick(event);
    if (!hit) return;
    options.navigate(hit);
    options.invalidate();
  };

  if (finePointer) {
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
  }
  window.addEventListener('click', onClick);
  return () => {
    window.removeEventListener('pointermove', onMove);
    document.documentElement.removeEventListener('pointerleave', onLeave);
    window.removeEventListener('click', onClick);
    document.body.style.cursor = '';
  };
}
