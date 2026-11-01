import { afterTransition, nextPaint } from './dom';

const BANNER_MS = 2500;

/** Lock-screen style notification; shown at most once per page load. */
export function createBanner(el: HTMLElement | null) {
  let timer: number | undefined;
  let used = false;

  function hide(): void {
    if (!el || el.hidden) return;
    window.clearTimeout(timer);
    el.removeAttribute('data-shown');
    afterTransition(() => {
      if (!el.hasAttribute('data-shown')) el.hidden = true;
    });
  }

  function show(): void {
    if (!el || used) return;
    used = true;
    el.hidden = false;
    nextPaint(() => el.toggleAttribute('data-shown', true));
    timer = window.setTimeout(hide, BANNER_MS);
  }

  return { show, hide, contains: (node: Node) => Boolean(el?.contains(node)) };
}
