import { afterTransition, cloneTemplate, FOCUSABLE, focusQuietly, nextPaint } from './dom';

interface SheetHost {
  plate: HTMLElement;
  template: HTMLTemplateElement | null;
  covered(open: boolean): void;
}

function trapFocusIn(dialog: HTMLDialogElement | null, event: KeyboardEvent): void {
  if (event.key !== 'Tab' || !dialog) return;
  const items = [...dialog.querySelectorAll<HTMLElement>(FOCUSABLE)];
  if (!items.length) return;
  const index = items.indexOf(document.activeElement as HTMLElement);
  event.preventDefault();
  event.stopPropagation();
  focusQuietly(items[(index + (event.shiftKey ? -1 : 1) + items.length) % items.length]);
}

function fillSheet(next: HTMLDialogElement | null, link: HTMLAnchorElement): HTMLAnchorElement | null {
  const title = next?.querySelector<HTMLElement>('[data-phone-sheet-title]');
  const address = next?.querySelector<HTMLElement>('[data-phone-sheet-url]');
  const action = next?.querySelector<HTMLAnchorElement>('[data-phone-sheet-open]');
  if (!next || !title || !address || !action) return null;
  const name = link.dataset.phoneName ?? link.textContent?.trim() ?? '';
  const url = new URL(link.href);
  title.textContent = name;
  address.textContent = `${url.host.replace(/^www\./, '')}${url.pathname.replace(/\/$/, '')}`;
  action.textContent = (next.dataset.openLabel ?? '{name}').replace('{name}', name);
  action.href = link.href;
  return action;
}

function closeAfterTransition(leaving: HTMLDialogElement): void {
  afterTransition(() => {
    leaving.close();
    leaving.remove();
  });
}

/** Action sheet asked before leaving the site; its "Open" button is a real new-tab link. */
export function createSheet(host: SheetHost) {
  let dialog: HTMLDialogElement | null = null;
  let origin: HTMLElement | null = null;
  const trapFocus = (event: KeyboardEvent) => trapFocusIn(dialog, event);

  function open(link: HTMLAnchorElement): void {
    if (dialog) return;
    const next = cloneTemplate<HTMLDialogElement>(host.template);
    const action = fillSheet(next, link);
    if (!next || !action) return;
    dialog = next;
    origin = link;
    next.addEventListener('keydown', trapFocus);
    next.addEventListener('click', event => {
      if (event.target === next) close();
    });
    host.plate.append(next);
    host.covered(true);
    next.show();
    focusQuietly(action);
    nextPaint(() => next.toggleAttribute('data-shown', true));
  }

  function close(restoreFocus = true): void {
    const leaving = dialog;
    if (!leaving) return;
    dialog = null;
    leaving.removeAttribute('data-shown');
    host.covered(false);
    if (restoreFocus) focusQuietly(origin);
    origin = null;
    closeAfterTransition(leaving);
  }

  return { open, close, isOpen: () => dialog !== null };
}
