import { Raycaster, Vector2, type PerspectiveCamera } from 'three';
import type { WorldHit, WorldScene } from './scenes/WorldScene';

const UI_SELECTOR = 'a, button, input, textarea, select, label, summary, [role="button"], [tabindex]:not([tabindex="-1"]), [contenteditable], [data-panel]';

export interface InteractionOptions {
  world: WorldScene;
  camera: PerspectiveCamera;
  canvas: HTMLCanvasElement;
  reducedMotion: () => boolean;
  invalidate: () => void;
}

function inViewport(el: Element | null): boolean {
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  return rect.top < innerHeight * 0.75 && rect.bottom > innerHeight * 0.25;
}

/**
 * Scene navigation by raycasting: hover shows a pointer cursor and emits `scene:hover`
 * (fine pointers only); click or tap navigates to the object's section.
 */
export function setupInteraction(options: InteractionOptions): () => void {
  const { world, camera, canvas } = options;
  const raycaster = new Raycaster();
  const ndc = new Vector2();
  const finePointer = matchMedia('(pointer: fine)').matches;
  let hovered: WorldHit | null = null;
  let pending: PointerEvent | null = null;

  const pick = (event: PointerEvent | MouseEvent): WorldHit | null => {
    const target = event.target as Element | null;
    if (target?.closest?.(UI_SELECTOR)) return null;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    ndc.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    for (const hit of raycaster.intersectObjects(world.pickables(), true)) {
      if (!hit.object.visible) continue;
      const meaning = world.resolve(hit.object, hit.instanceId);
      if (meaning) return meaning;
    }
    return null;
  };

  const setHover = (hit: WorldHit | null) => {
    if (hit?.key === hovered?.key) return;
    hovered = hit;
    document.body.style.cursor = hit ? 'pointer' : '';
    world.setHover(hit);
    window.dispatchEvent(new CustomEvent('scene:hover', { detail: { label: hit?.label ?? null } }));
    options.invalidate();
  };

  const onMove = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
    if (pending) {
      pending = event;
      return;
    }
    pending = event;
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
    const section = document.querySelector(hit.target);
    const behavior: ScrollBehavior = options.reducedMotion() ? 'auto' : 'smooth';
    const focusEvent = hit.product
      ? new CustomEvent('product:focus', { detail: { id: hit.product, source: 'scene' } })
      : hit.experience
        ? new CustomEvent('experience:focus', { detail: { id: hit.experience, source: 'scene' } })
        : null;
    if (focusEvent) {
      if (hit.product) world.focusProduct(hit.product);
      if (hit.experience) world.focusExperience(hit.experience);
      if (!inViewport(section)) section?.scrollIntoView({ behavior });
      window.dispatchEvent(focusEvent);
    } else {
      section?.scrollIntoView({ behavior });
    }
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
