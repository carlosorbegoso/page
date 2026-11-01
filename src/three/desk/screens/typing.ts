/** Keys story navigation, focus and dialogs own: never pressed on the laptop, never prevented. */
const RESERVED = new Set([' ', 'Tab', 'Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End']);
const UI = 'a, button, input, textarea, select, label, summary, dialog, [role="button"], [role="menu"], [role="listbox"], [role="slider"], [contenteditable], [tabindex]:not([tabindex="-1"])';
const SOUND_GAP_MS = 110;

/** A printable key or Backspace / Enter, with the physical key that was pressed. */
export interface TypedKey {
  code: string;
  key: string;
}

function typingAllowed(event: KeyboardEvent): boolean {
  if (event.defaultPrevented || event.isComposing || event.ctrlKey || event.metaKey || event.altKey) return false;
  if (RESERVED.has(event.key)) return false;
  if (event.key.length !== 1 && event.key !== 'Backspace' && event.key !== 'Enter') return false;
  const html = document.documentElement;
  if (!html.classList.contains('is-3d') || html.matches(':has(dialog[open])')) return false;
  const target = event.target instanceof Element ? event.target : null;
  const focused = document.activeElement;
  if (target?.closest(UI) || (focused && focused !== document.body && focused.closest(UI))) return false;
  return true;
}

/**
 * Listens for keys typed while nothing on the page has focus and hands them to `onKey`; reports
 * them as `desk:interact` `keyboard` presses, at most one every ~110 ms so the clack does not machine-gun.
 * Navigation keys and shortcuts pass through untouched. Returns the cleanup.
 */
export function listenForTyping(onKey: (typed: TypedKey) => boolean): () => void {
  let soundedAt = -Infinity;
  const typed: TypedKey = { code: '', key: '' };
  const onKeyDown = (event: KeyboardEvent) => {
    if (!typingAllowed(event)) return;
    typed.code = event.code;
    typed.key = event.key;
    if (!onKey(typed)) return;
    const now = performance.now();
    if (now - soundedAt < SOUND_GAP_MS) return;
    soundedAt = now;
    window.dispatchEvent(new CustomEvent('desk:interact', { detail: { id: 'keyboard', phase: 'press' } }));
  };
  window.addEventListener('keydown', onKeyDown);
  return () => window.removeEventListener('keydown', onKeyDown);
}
