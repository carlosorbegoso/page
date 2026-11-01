import type { HudElements, IndexOpener } from './elements';

/** Chapter index dialog: closes on its button, a backdrop click or a link, and hands focus back to its opener. */
export function initIndexSheet({ sheet, indexButton, clock, toggle }: HudElements, opener: IndexOpener): void {
  if (!sheet) return;
  sheet.addEventListener('close', () => {
    indexButton?.setAttribute('aria-expanded', 'false');
    clock?.setAttribute('aria-expanded', 'false');
    (opener.current ?? toggle)?.focus();
    opener.current = null;
  });
  sheet.querySelector('[data-index-close]')?.addEventListener('click', () => sheet.close());
  sheet.addEventListener('click', event => {
    if (event.target === sheet) sheet.close();
  });
  for (const link of sheet.querySelectorAll('[data-index-link]')) {
    link.addEventListener('click', () => sheet.close());
  }
}
