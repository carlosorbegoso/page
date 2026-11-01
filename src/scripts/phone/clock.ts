import { currentStoryClock, STORY_CLOCK_EVENT } from '../story-clock';

export function createClock(el: HTMLElement | null) {
  let running = false;

  function render(): void {
    if (el && running) el.textContent = currentStoryClock();
  }

  window.addEventListener(STORY_CLOCK_EVENT, render);

  return {
    start(): void {
      running = true;
      render();
    },
    stop(): void {
      running = false;
    }
  };
}
