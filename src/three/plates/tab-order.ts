import type { ChapterId } from '../contracts';
import type { PlateEntry } from './types';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
const FOCUS_WAIT_MS = 2500;

type ScrollTo = (chapter: ChapterId, sub: number) => void;

function focusWhenVisible(el: HTMLElement): void {
  const started = performance.now();
  const waitAndFocus = () => {
    if (el.checkVisibility({ visibilityProperty: true })) el.focus({ preventScroll: true });
    else if (performance.now() - started < FOCUS_WAIT_MS) requestAnimationFrame(waitAndFocus);
  };
  requestAnimationFrame(waitAndFocus);
}

export function tabInStoryOrder(event: KeyboardEvent, entries: readonly PlateEntry[], scrollTo: ScrollTo): void {
  if (event.key !== 'Tab' || event.altKey || event.ctrlKey || event.metaKey) return;
  const focusables = entries.flatMap(entry => [...entry.el.querySelectorAll<HTMLElement>(FOCUSABLE)].map(el => ({ el, entry })));
  const index = focusables.findIndex(item => item.el === document.activeElement);
  if (index < 0) return;
  const next = focusables[index + (event.shiftKey ? -1 : 1)];
  if (!next) return;
  event.preventDefault();
  if (next.el.checkVisibility({ visibilityProperty: true })) {
    next.el.focus();
    return;
  }
  scrollTo(next.entry.chapter, next.entry.sub ?? 0);
  focusWhenVisible(next.el);
}
