type IdleCallback = (deadline: { timeRemaining(): number; didTimeout: boolean }) => void;

export function onIdle(callback: IdleCallback, timeout = 2000): void {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback, { timeout });
    return;
  }
  const start = performance.now();
  setTimeout(
    () => callback({ didTimeout: false, timeRemaining: () => Math.max(0, 50 - (performance.now() - start)) }),
    1
  );
}

export function yieldToMain(): Promise<void> {
  const scheduler = (globalThis as { scheduler?: { yield?: () => Promise<void> } }).scheduler;
  if (scheduler?.yield) return scheduler.yield();
  return new Promise(resolve => setTimeout(resolve, 0));
}

export function idle(timeout = 2000): Promise<void> {
  return new Promise(resolve => onIdle(() => resolve(), timeout));
}
