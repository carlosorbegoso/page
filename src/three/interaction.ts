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
  const releaseFolderKeys = setupFolderKeys();
  return () => {
    releaseFolderKeys();
    window.removeEventListener('pointermove', onMove);
    document.documentElement.removeEventListener('pointerleave', onLeave);
    window.removeEventListener('click', onClick);
    document.body.style.cursor = '';
  };
}
