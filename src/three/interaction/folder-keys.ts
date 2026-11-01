import { en } from '../../i18n/ui.en';
import { es } from '../../i18n/ui.es';

const EXPERIENCE_PLATE = '[data-plate][data-experience]';

/**
 * The experience panel of the folder on screen takes focus, and Enter takes that folder off the
 * shelf (`desk:action` `folder`), the keyboard twin of clicking the folder you are looking at.
 */
export function setupFolderKeys(): () => void {
  const hint = document.documentElement.lang.startsWith('en') ? en['folderDetail.hint'] : es['folderDetail.hint'];
  let focusable: HTMLElement | null = null;
  const release = () => {
    if (!focusable) return;
    focusable.removeAttribute('tabindex');
    focusable.removeAttribute('aria-keyshortcuts');
    focusable.removeAttribute('aria-description');
    focusable = null;
  };
  const onEnter = (event: Event) => {
    const { id, subIndex } = (event as CustomEvent<{ id: string; subIndex: number }>).detail;
    const plate = id === 'experience' && subIndex > 0 ? document.querySelector<HTMLElement>(`${EXPERIENCE_PLATE}[data-plate-order="${subIndex - 1}"]`) : null;
    if (plate === focusable) return;
    release();
    if (!plate || plate.hasAttribute('tabindex')) return;
    plate.tabIndex = 0;
    plate.setAttribute('aria-keyshortcuts', 'Enter');
    plate.setAttribute('aria-description', hint);
    focusable = plate;
  };
  const onKey = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' || event.repeat || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    const plate = event.target instanceof HTMLElement && event.target.matches(EXPERIENCE_PLATE) ? event.target : null;
    if (!plate?.dataset.experience) return;
    event.preventDefault();
    window.dispatchEvent(new CustomEvent('desk:action', { detail: { action: 'folder', id: plate.dataset.experience } }));
  };
  window.addEventListener('chapter:enter', onEnter);
  window.addEventListener('keydown', onKey);
  return () => {
    window.removeEventListener('chapter:enter', onEnter);
    window.removeEventListener('keydown', onKey);
    release();
  };
}
