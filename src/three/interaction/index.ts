import type { StationPick } from '../contracts';
import { emitInteract, labelOf } from './events';
import { setupFolderKeys } from './folder-keys';
import { createPicker } from './picker';
import type { InteractionOptions, PickSource } from './types';

export type { InteractionOptions, PickSource } from './types';

type Picker = ReturnType<typeof createPicker>;

function createHover(source: PickSource, invalidate: () => void): (next: StationPick | null) => void {
  let hovered: StationPick | null = null;
  return next => {
    if (next?.key === hovered?.key) return;
    hovered = next;
    document.body.style.cursor = next ? 'pointer' : '';
    source.setHover(next?.object3D ?? null);
    window.dispatchEvent(new CustomEvent('scene:hover', { detail: { label: next ? labelOf(next) : null } }));
    if (next) emitInteract(next, 'hover');
    invalidate();
  };
}

function coalescedMove(pick: Picker, setHover: (next: StationPick | null) => void): (event: PointerEvent) => void {
  let pending: PointerEvent | null = null;
  return event => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
    const scheduled = pending !== null;
    pending = event;
    if (scheduled) return;
    requestAnimationFrame(() => {
      if (pending) setHover(pick(pending));
      pending = null;
    });
  };
}

export function setupInteraction(options: InteractionOptions): () => void {
  const pick = createPicker(options.source, options.camera, options.canvas);
  const setHover = createHover(options.source, options.invalidate);
  const onMove = coalescedMove(pick, setHover);
  const onLeave = () => setHover(null);
  const onDown = (event: PointerEvent) => {
    if (!event.isPrimary || event.button !== 0) return;
    const hit = pick(event);
    if (hit) emitInteract(hit, 'press');
  };
  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || getSelection()?.toString()) return;
    const hit = pick(event);
    if (!hit) return;
    emitInteract(hit, 'activate');
    options.navigate(hit);
    options.invalidate();
  };
  if (matchMedia('(pointer: fine)').matches) {
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
  }
  window.addEventListener('chapter:enter', onLeave);
  window.addEventListener('blur', onLeave);
  window.addEventListener('click', onClick);
  window.addEventListener('pointerdown', onDown, { passive: true });
  const releaseFolderKeys = setupFolderKeys();
  return () => {
    releaseFolderKeys();
    window.removeEventListener('pointermove', onMove);
    document.documentElement.removeEventListener('pointerleave', onLeave);
    window.removeEventListener('chapter:enter', onLeave);
    window.removeEventListener('blur', onLeave);
    window.removeEventListener('click', onClick);
    window.removeEventListener('pointerdown', onDown);
    document.body.style.cursor = '';
  };
}
