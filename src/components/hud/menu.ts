import { requestTour, type HudElements, type IndexOpener } from './elements';

const HOVER_CLOSE_DELAY_MS = 250;

/** HUD menu: opens on hover with a fine pointer or on click, closes on Escape, focus loss or an outside press. */
export function initMenu({ hud, toggle, menu, sheet, indexButton, clock, tourButton }: HudElements, opener: IndexOpener): void {
  if (!hud || !toggle || !menu) return;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  let closeTimer: number | undefined;
  let openedByHover = false;

  const isOpen = () => !menu.hidden;

  function setOpen(open: boolean, { restoreFocus = false } = {}) {
    window.clearTimeout(closeTimer);
    if (open === isOpen()) return;
    menu!.hidden = !open;
    toggle!.setAttribute('aria-expanded', String(open));
    if (!open && restoreFocus) toggle!.focus();
  }

  /* Hover already opened the menu on desktop: the click that follows must not close it again. */
  toggle.addEventListener('click', () => {
    if (openedByHover && isOpen()) {
      openedByHover = false;
      return;
    }
    setOpen(!isOpen());
  });

  hud.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'mouse' || !finePointer.matches || isOpen()) return;
    openedByHover = true;
    setOpen(true);
  });
  hud.addEventListener('pointerleave', event => {
    if (event.pointerType !== 'mouse' || !finePointer.matches) return;
    openedByHover = false;
    if (hud.contains(document.activeElement)) (document.activeElement as HTMLElement).blur();
    closeTimer = window.setTimeout(() => setOpen(false), HOVER_CLOSE_DELAY_MS);
  });

  hud.addEventListener('keydown', event => {
    if (event.key === 'Escape' && isOpen()) {
      event.stopPropagation();
      setOpen(false, { restoreFocus: true });
    }
  });

  hud.addEventListener('focusout', event => {
    const next = event.relatedTarget;
    if (next instanceof Node && hud.contains(next)) return;
    if (sheet?.open) return;
    setOpen(false);
  });

  document.addEventListener('pointerdown', event => {
    if (isOpen() && event.target instanceof Node && !hud.contains(event.target)) setOpen(false);
  });

  for (const button of [indexButton, clock]) {
    button?.addEventListener('click', () => {
      if (!sheet) return;
      setOpen(false);
      opener.current = button === clock ? clock : null;
      sheet.showModal();
      button.setAttribute('aria-expanded', 'true');
    });
  }

  tourButton?.addEventListener('click', () => {
    const starting = tourButton.getAttribute('aria-pressed') !== 'true';
    requestTour(starting);
    if (starting) setOpen(false, { restoreFocus: true });
  });
}
