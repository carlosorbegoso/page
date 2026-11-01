const MOTION_QUERY = matchMedia('(prefers-reduced-motion: reduce)');
const TRANSITION_MS = 400;

export const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled])';

export function reducedMotion(): boolean {
  return MOTION_QUERY.matches || document.documentElement.dataset.motion === 'paused';
}

/** Runs after a screen transition (immediately when motion is reduced). */
export function afterTransition(fn: () => void): void {
  window.setTimeout(fn, reducedMotion() ? 0 : TRANSITION_MS);
}

/** Two frames, so a freshly inserted element paints its start state before the transition. */
export function nextPaint(fn: () => void): void {
  requestAnimationFrame(() => requestAnimationFrame(fn));
}

export function cloneTemplate<T extends HTMLElement>(
  template: HTMLTemplateElement | null
): T | null {
  const node = template?.content.firstElementChild?.cloneNode(true);
  return node instanceof HTMLElement ? (node as T) : null;
}

/** Focus inside a CSS3D surface must never scroll the page or the 3D layer. */
export function focusQuietly(el: Element | null | undefined): void {
  if (el instanceof HTMLElement) el.focus({ preventScroll: true });
}

const SETTLE_POLL_MS = 250;
const SETTLE_GIVE_UP_MS = 15000;

/**
 * Runs `delay` ms after `el` is actually on screen: the stage has revealed, the loader is gone and
 * the CSS3D layer has drawn the plate (headless or slow GPUs can take seconds after `data-ready`).
 */
export function whenShown(el: HTMLElement, fn: () => void, delay: number): void {
  const started = performance.now();
  const shown = () => {
    const stage = document.querySelector<HTMLElement>('[data-stage]');
    const box = el.getBoundingClientRect();
    return (!stage || stage.dataset.ready === 'true') && box.width > 0 && box.bottom > 0 && box.top < innerHeight;
  };
  const poll = () => {
    if (shown()) window.setTimeout(fn, delay);
    else if (performance.now() - started < SETTLE_GIVE_UP_MS) window.setTimeout(poll, SETTLE_POLL_MS);
  };
  poll();
}
