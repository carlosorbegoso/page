import { afterTransition, cloneTemplate, FOCUSABLE, focusQuietly, nextPaint } from './dom';

interface SheetHost {
  plate: HTMLElement;
  template: HTMLTemplateElement | null;
  covered(open: boolean): void;
}

/** Action sheet asked before leaving the site; its "Open" button is a real new-tab link. */
export function createSheet(host: SheetHost) {
  let dialog: HTMLDialogElement | null = null;
  let origin: HTMLElement | null = null;

  function trapFocus(event: KeyboardEvent): void {
    if (event.key !== 'Tab' || !dialog) return;
    const items = [...dialog.querySelectorAll<HTMLElement>(FOCUSABLE)];
    if (!items.length) return;
    const index = items.indexOf(document.activeElement as HTMLElement);
    event.preventDefault();
    event.stopPropagation();
    focusQuietly(items[(index + (event.shiftKey ? -1 : 1) + items.length) % items.length]);
  }

  function open(link: HTMLAnchorElement): void {
    if (dialog) return;
    const next = cloneTemplate<HTMLDialogElement>(host.template);
    const title = next?.querySelector<HTMLElement>('[data-phone-sheet-title]');
    const address = next?.querySelector<HTMLElement>('[data-phone-sheet-url]');
    const action = next?.querySelector<HTMLAnchorElement>('[data-phone-sheet-open]');
    if (!next || !title || !address || !action) return;
    const name = link.dataset.phoneName ?? link.textContent?.trim() ?? '';
    const url = new URL(link.href);
    title.textContent = name;
    address.textContent = `${url.host.replace(/^www\./, '')}${url.pathname.replace(/\/$/, '')}`;
    action.textContent = (next.dataset.openLabel ?? '{name}').replace('{name}', name);
    action.href = link.href;
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
    afterTransition(() => {
      leaving.close();
      leaving.remove();
    });
  }

  return { open, close, isOpen: () => dialog !== null };
}
