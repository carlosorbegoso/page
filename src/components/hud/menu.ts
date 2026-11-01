import { requestTour, type HudElements, type IndexOpener } from './elements';

const HOVER_CLOSE_DELAY_MS = 250;

interface MenuControl {
  isOpen(): boolean;
  setOpen(open: boolean, options?: { restoreFocus?: boolean }): void;
  closeLater(): void;
}

function menuControl(toggle: HTMLButtonElement, menu: HTMLElement): MenuControl {
  let closeTimer: number | undefined;
  const isOpen = () => !menu.hidden;
  const setOpen = (open: boolean, { restoreFocus = false } = {}) => {
    window.clearTimeout(closeTimer);
    if (open === isOpen()) return;
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    if (!open && restoreFocus) toggle.focus();
  };
  const closeLater = () => {
    closeTimer = window.setTimeout(() => setOpen(false), HOVER_CLOSE_DELAY_MS);
  };
  return { isOpen, setOpen, closeLater };
}

/** Desktop hover opens the menu; the click that follows must not close it again. */
function bindHover(hud: HTMLElement, toggle: HTMLButtonElement, control: MenuControl): void {
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  let openedByHover = false;
  toggle.addEventListener('click', () => {
    if (openedByHover && control.isOpen()) {
      openedByHover = false;
      return;
    }
    control.setOpen(!control.isOpen());
  });
  hud.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'mouse' || !finePointer.matches || control.isOpen()) return;
    openedByHover = true;
    control.setOpen(true);
  });
  hud.addEventListener('pointerleave', event => {
    if (event.pointerType !== 'mouse' || !finePointer.matches) return;
    openedByHover = false;
    if (hud.contains(document.activeElement)) (document.activeElement as HTMLElement).blur();
    control.closeLater();
  });
}

/** Escape, focus leaving the HUD (unless into the index sheet) and a press outside close the menu. */
function bindDismiss(hud: HTMLElement, sheet: HTMLDialogElement | null, control: MenuControl): void {
  hud.addEventListener('keydown', event => {
    if (event.key === 'Escape' && control.isOpen()) {
      event.stopPropagation();
      control.setOpen(false, { restoreFocus: true });
    }
  });
  hud.addEventListener('focusout', event => {
    const next = event.relatedTarget;
    if (next instanceof Node && hud.contains(next)) return;
    if (sheet?.open) return;
    control.setOpen(false);
  });
  document.addEventListener('pointerdown', event => {
    if (control.isOpen() && event.target instanceof Node && !hud.contains(event.target)) control.setOpen(false);
  });
}

function bindMenuActions({ sheet, indexButton, clock, tourButton }: HudElements, opener: IndexOpener, control: MenuControl): void {
  for (const button of [indexButton, clock]) {
    button?.addEventListener('click', () => {
      if (!sheet) return;
      control.setOpen(false);
      opener.current = button === clock ? clock : null;
      sheet.showModal();
      button.setAttribute('aria-expanded', 'true');
    });
  }
  tourButton?.addEventListener('click', () => {
    const starting = tourButton.getAttribute('aria-pressed') !== 'true';
    requestTour(starting);
    if (starting) control.setOpen(false, { restoreFocus: true });
  });
}

/** HUD menu: opens on hover with a fine pointer or on click, closes on Escape, focus loss or an outside press. */
export function initMenu(elements: HudElements, opener: IndexOpener): void {
  const { hud, toggle, menu, sheet } = elements;
  if (!hud || !toggle || !menu) return;
  const control = menuControl(toggle, menu);
  bindHover(hud, toggle, control);
  bindDismiss(hud, sheet, control);
  bindMenuActions(elements, opener, control);
}
