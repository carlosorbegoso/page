import { requestTour, type HudElements } from './elements';

const TOUR_BADGE_PAUSED_MS = 4000;

type TourState = 'playing' | 'paused' | 'finished';

/** The quick tour button beside the menu mirrors the tour state and toggles it without opening the menu. */
export function initQuickTour({ quickTour }: HudElements): void {
  quickTour?.addEventListener('click', event => {
    event.stopPropagation();
    requestTour(quickTour.getAttribute('aria-pressed') !== 'true');
  });
  window.addEventListener('story:tour-state', event => {
    const state = (event as CustomEvent<{ state?: string }>).detail?.state;
    quickTour?.setAttribute('aria-pressed', String(state === 'playing'));
  });
}

/** Menu tour button, its live status text and the corner badge that lingers a few seconds after a pause. */
export function initTourBadge({ tourButton }: HudElements): void {
  const tourBadge = document.querySelector<HTMLElement>('[data-hud-tour-badge]');
  const tourStatus = document.querySelector<HTMLElement>('[data-story-tour-status]');
  let badgeTimer: number | undefined;
  window.addEventListener('story:tour-state', event => {
    const { state } = (event as CustomEvent<{ state: TourState }>).detail;
    const playing = state === 'playing';
    tourButton?.setAttribute('aria-pressed', String(playing));
    if (tourStatus) {
      const key = `label${state[0]!.toUpperCase()}${state.slice(1)}`;
      tourStatus.textContent = tourStatus.dataset[key] ?? '';
    }
    if (!tourBadge) return;
    window.clearTimeout(badgeTimer);
    const dot = tourBadge.querySelector<HTMLElement>('[data-hud-tour-dot]');
    const text = tourBadge.querySelector<HTMLElement>('[data-hud-tour-text]');
    if (dot) dot.dataset.state = state;
    if (text) text.textContent = (playing ? tourBadge.dataset.labelPlaying : tourBadge.dataset.labelPaused) ?? '';
    tourBadge.hidden = state === 'finished';
    if (!playing) badgeTimer = window.setTimeout(() => (tourBadge.hidden = true), TOUR_BADGE_PAUSED_MS);
  });
}
