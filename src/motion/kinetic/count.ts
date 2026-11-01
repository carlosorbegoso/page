import { allowed } from './env';

const COUNT_MS = 1400;
const COUNT_DELAY_MS = 220;

const counters = new WeakMap<HTMLElement, number>();

export function finishCount(el: HTMLElement): void {
  const frame = counters.get(el);
  if (frame) cancelAnimationFrame(frame);
  counters.delete(el);
  el.textContent = el.dataset.kineticCount ?? el.textContent;
}

export function runCount(el: HTMLElement): void {
  const target = Number(el.dataset.kineticCount);
  if (!Number.isFinite(target) || !allowed()) return finishCount(el);
  const start = performance.now() + COUNT_DELAY_MS;
  el.textContent = '0';
  const tick = (now: number) => {
    const t = Math.min(Math.max((now - start) / COUNT_MS, 0), 1);
    const eased = 1 - Math.pow(1 - t, 4);
    el.textContent = String(Math.round(target * eased));
    if (t < 1) counters.set(el, requestAnimationFrame(tick));
    else finishCount(el);
  };
  counters.set(el, requestAnimationFrame(tick));
}
