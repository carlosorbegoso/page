import { Raycaster, Vector2, type Object3D, type PerspectiveCamera } from 'three';
import type { StationPick } from './contracts';
import { en } from '../i18n/ui.en';
import { es } from '../i18n/ui.es';

const EXPERIENCE_PLATE = '[data-plate][data-experience]';

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

/**
 * Id of a pick in `desk:interact` events: its key without the `desk:` prefix (alfa, skymek, parati,
 * ventixs, mug, clock, phone, lamp), folders as `folder-<id>` (folder-tcs, folder-openFolder…).
 */
function interactId(pick: StationPick): string {
  const id = pick.key.startsWith('desk:') ? pick.key.slice(5) : pick.key;
  return pick.experience ? `folder-${id}` : id;
}

/**
 * Tells listeners (sound, analytics) that an object was hovered, pressed or activated. The lamp only
 * reports hover: its click already sounds through `desk:switch`.
 */
function emitInteract(pick: StationPick, phase: 'hover' | 'press' | 'activate'): void {
  if (pick.action === 'lamp' && phase !== 'hover') return;
  window.dispatchEvent(new CustomEvent('desk:interact', { detail: { id: interactId(pick), phase } }));
}

function labelOf(pick: StationPick): string {
  if (typeof pick.label === 'string') return pick.label;
  return document.documentElement.lang.startsWith('en') ? pick.label.en : pick.label.es;
}

/**
 * The experience panel of the folder on screen takes focus, and Enter takes that folder off the
 * shelf (`desk:action` `folder`), the keyboard twin of clicking the folder you are looking at.
 */
function setupFolderKeys(): () => void {
  const hint = document.documentElement.lang.startsWith('en') ? en['folderDetail.hint'] : es['folderDetail.hint'];
  let focusable: HTMLElement | null = null;
  const release = () => {
    if (!focusable) return;
    focusable.removeAttribute('tabindex');
    focusable.removeAttribute('aria-keyshortcuts');
    focusable.removeAttribute('aria-description');
    focusable = null;
  };
  const onEnter = (event: Event) => {
    const { id, subIndex } = (event as CustomEvent<{ id: string; subIndex: number }>).detail;
    const plate = id === 'experience' && subIndex > 0 ? document.querySelector<HTMLElement>(`${EXPERIENCE_PLATE}[data-plate-order="${subIndex - 1}"]`) : null;
    if (plate === focusable) return;
    release();
    if (!plate || plate.hasAttribute('tabindex')) return;
    plate.tabIndex = 0;
    plate.setAttribute('aria-keyshortcuts', 'Enter');
    plate.setAttribute('aria-description', hint);
    focusable = plate;
  };
  const onKey = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' || event.repeat || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    const plate = event.target instanceof HTMLElement && event.target.matches(EXPERIENCE_PLATE) ? event.target : null;
    if (!plate?.dataset.experience) return;
    event.preventDefault();
    window.dispatchEvent(new CustomEvent('desk:action', { detail: { action: 'folder', id: plate.dataset.experience } }));
  };
  window.addEventListener('chapter:enter', onEnter);
  window.addEventListener('keydown', onKey);
  return () => {
    window.removeEventListener('chapter:enter', onEnter);
    window.removeEventListener('keydown', onKey);
    release();
  };
}

/**
 * Scene interaction by raycasting the desk's picks: hover shows a pointer cursor, lights the object
 * itself and emits `scene:hover` with its name for the polite live region (fine pointers only; no
 * floating label); click or tap hands the pick to `navigate`, which plays with it and/or moves on.
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
    if (next) emitInteract(next, 'hover');
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

  if (finePointer) {
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
