import { allowed } from './env';

const SETTLE_FALLBACK_MS = 3200;

export const settleTimers = new WeakMap<HTMLElement, number>();

export function settle(root: HTMLElement): void {
  window.clearTimeout(settleTimers.get(root));
  settleTimers.delete(root);
  if (root.dataset.reveal === 'in') root.toggleAttribute('data-settled', true);
}

export function watchSettle(root: HTMLElement): void {
  if (root.dataset.kinetic === undefined) return;
  const units = root.querySelectorAll<HTMLElement>('.k-i');
  const last = units[units.length - 1];
  if (!last || !allowed()) return settle(root);
  const onEnd = (event: TransitionEvent) => {
    if (event.target !== last || event.propertyName !== 'opacity') return;
    last.removeEventListener('transitionend', onEnd);
    settle(root);
  };
  last.addEventListener('transitionend', onEnd);
  settleTimers.set(root, window.setTimeout(() => settle(root), SETTLE_FALLBACK_MS));
}
