const RESERVED = new Set([' ', 'Tab', 'Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End']);
const UI = 'a, button, input, textarea, select, label, summary, dialog, [role="button"], [role="menu"], [role="listbox"], [role="slider"], [contenteditable], [tabindex]:not([tabindex="-1"])';
const SOUND_GAP_MS = 110;

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
