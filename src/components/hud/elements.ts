export interface HudElements {
  hud: HTMLElement | null;
  toggle: HTMLButtonElement | null;
  menu: HTMLElement | null;
  chapter: HTMLElement | null;
  sheet: HTMLDialogElement | null;
  indexButton: HTMLButtonElement | null;
  clock: HTMLButtonElement | null;
  tourButton: HTMLButtonElement | null;
  quickTour: HTMLButtonElement | null;
}

/** The sheet's opener when it was not the index button, so focus returns to the right control on close. */
export interface IndexOpener {
  current: HTMLButtonElement | null;
}

export function queryHud(): HudElements {
  return {
    hud: document.querySelector<HTMLElement>('[data-hud]'),
    toggle: document.querySelector<HTMLButtonElement>('[data-hud-toggle]'),
    menu: document.querySelector<HTMLElement>('[data-hud-menu]'),
    chapter: document.querySelector<HTMLElement>('[data-hud-chapter]'),
    sheet: document.querySelector<HTMLDialogElement>('[data-index]'),
    indexButton: document.querySelector<HTMLButtonElement>('[data-index-open]'),
    clock: document.querySelector<HTMLButtonElement>('[data-hud-clock]'),
    tourButton: document.querySelector<HTMLButtonElement>('[data-story-tour]'),
    quickTour: document.querySelector<HTMLButtonElement>('[data-story-tour-quick]')
  };
}

export function requestTour(starting: boolean): void {
  window.dispatchEvent(new CustomEvent('story:tour', { detail: { action: starting ? 'start' : 'stop' } }));
}
