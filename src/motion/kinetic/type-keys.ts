const keyTimers = new WeakMap<HTMLElement, number[]>();

export function stopKeys(root: HTMLElement): void {
  for (const timer of keyTimers.get(root) ?? []) window.clearTimeout(timer);
  keyTimers.delete(root);
}

const msOf = (value: string) => Number.parseFloat(value) * (value.trim().endsWith('ms') ? 1 : 1000) || 0;

export function typeKeys(root: HTMLElement): void {
  stopKeys(root);
  const style = getComputedStyle(root);
  const delay = msOf(style.getPropertyValue('--k-delay'));
  const stagger = msOf(style.getPropertyValue('--k-stagger'));
  const count = root.querySelectorAll('.k-c').length;
  const timers: number[] = [];
  for (let i = 0; i < count; i++) {
    timers.push(window.setTimeout(() => window.dispatchEvent(new CustomEvent('desk:key')), delay + i * stagger));
  }
  keyTimers.set(root, timers);
}
