const CONTROLS = 'a, button, input, select, textarea, summary, [role="button"], [role="menu"], [role="dialog"]';
/** A click on the held folder toggles it through `desk:action` in the same task; this window lets that win. */
const TOGGLE_WINDOW_MS = 80;

export interface OutsideClickHost {
  isOut(): boolean;
  lastToggle(): number;
  close(): void;
}

/**
 * Puts the held folder back when the visitor clicks or taps anywhere but a control or the folder
 * itself (which toggles on its own). Returns the cleanup.
 */
export function listenOutsideClick(host: OutsideClickHost): () => void {
  const onClick = (event: MouseEvent) => {
    if (!host.isOut() || event.button !== 0) return;
    if (event.target instanceof Element && event.target.closest(CONTROLS)) return;
    const clickedAt = performance.now();
    window.setTimeout(() => {
      if (host.lastToggle() >= clickedAt - TOGGLE_WINDOW_MS) return;
      if (host.isOut()) host.close();
    }, 0);
  };
  window.addEventListener('click', onClick);
  return () => window.removeEventListener('click', onClick);
}
