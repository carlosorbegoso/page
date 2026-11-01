import type { Navigator } from './goto';
import type { Scroller } from './scroll';
import { dialogOpen, type NavState, type StoryNavHost } from './types';

const FORM_FIELD = 'input, textarea, select, [contenteditable]:not([contenteditable="false"])';
const NATIVE_SPACE =
  'button, a[href], summary, [role="button"], [role="checkbox"], [role="switch"]';
const OWNS_KEYS = `${FORM_FIELD}, dialog, [data-hud-menu], [role="menu"], [role="listbox"], [role="slider"]`;

const NEXT_KEYS = new Set(['ArrowDown', 'PageDown']);
const PREV_KEYS = new Set(['ArrowUp', 'PageUp']);
const NATIVE_SCROLL_KEYS = new Set([
  'ArrowDown',
  'ArrowUp',
  'PageDown',
  'PageUp',
  'Home',
  'End',
  ' '
]);

function hasModifier(event: KeyboardEvent): boolean {
  return event.defaultPrevented || event.isComposing || event.altKey || event.ctrlKey || event.metaKey;
}

/** A field, menu, dialog or native control owns this key, so the page must not step. */
function keyOwnedElsewhere(event: KeyboardEvent): boolean {
  const target = event.target instanceof Element ? event.target : null;
  return (
    dialogOpen() ||
    Boolean(target?.closest(OWNS_KEYS)) ||
    (event.key === ' ' && Boolean(target?.closest(NATIVE_SPACE)))
  );
}

function keyAction(event: KeyboardEvent, host: StoryNavHost, navigator: Navigator, scroller: Scroller): (() => void) | null {
  const key = event.key;
  if (NEXT_KEYS.has(key) || (key === ' ' && !event.shiftKey)) return () => navigator.step(1);
  if (PREV_KEYS.has(key) || (key === ' ' && event.shiftKey)) return () => navigator.step(-1);
  if (key === 'Home') return () => scroller.goToIndex(-1);
  if (key === 'End') return () => scroller.goToIndex(host.shots().length - 1);
  return null;
}

/** Arrow, Page, Space, Home and End step shot by shot instead of scrolling the page natively. */
export function createKeyHandler(
  host: StoryNavHost,
  state: NavState,
  navigator: Navigator,
  scroller: Scroller,
  interrupt: (event: Event) => void
): (event: KeyboardEvent) => void {
  return event => {
    interrupt(event);
    if (hasModifier(event)) return;
    if (!NATIVE_SCROLL_KEYS.has(event.key)) return;
    if (keyOwnedElsewhere(event)) {
      state.lastNativeKey = performance.now();
      return;
    }
    const action = keyAction(event, host, navigator, scroller);
    if (!action) return;
    event.preventDefault();
    if (event.repeat) return;
    action();
  };
}
