import type { HudElements } from './elements';

/** Story progress bar, shown with the tour controls only while story navigation is ready. */
export function initProgress({ tourButton, quickTour }: HudElements): void {
  const progressBar = document.querySelector<HTMLElement>('[data-hud-progress]');

  function setStoryNav(ready: boolean) {
    if (progressBar) progressBar.hidden = !ready;
    if (tourButton) tourButton.hidden = !ready;
    if (quickTour) quickTour.hidden = !ready;
  }

  window.addEventListener('story:ready', () => setStoryNav(true));
  window.addEventListener('story:disposed', () => setStoryNav(false));
  setStoryNav(document.documentElement.dataset.storyNav === 'ready');

  if (!progressBar) return;
  const fill = progressBar.querySelector<HTMLElement>('[data-hud-progress-fill]');
  const template = progressBar.dataset.valueTemplate ?? '{current} / {total}';
  let percent = -1;
  let shot = '';
  window.addEventListener('story:progress', event => {
    const { value, index, total } = (event as CustomEvent<{ value: number; index: number; total: number }>).detail;
    fill?.style.setProperty('--story-progress', value.toFixed(4));
    const nextPercent = Math.round(value * 100);
    if (nextPercent !== percent) {
      percent = nextPercent;
      progressBar.setAttribute('aria-valuenow', String(percent));
    }
    const nextShot = template.replace('{current}', String(index + 1)).replace('{total}', String(total));
    if (nextShot !== shot) {
      shot = nextShot;
      progressBar.setAttribute('aria-valuetext', shot);
    }
  });
}
