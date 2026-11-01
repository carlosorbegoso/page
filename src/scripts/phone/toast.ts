import { nextPaint, reducedMotion } from './dom';

const TOAST_MS = 1800;
const ERROR_MS = 3200;
const PROGRESS_MS = 1100;

export type ToastVariant = 'done' | 'progress' | 'error';
export type Toast = ReturnType<typeof createToast>;

export function createToast(el: HTMLElement, text: HTMLElement) {
  let timer: number | undefined;

  function hide(): void {
    window.clearTimeout(timer);
    el.removeAttribute('data-shown');
    el.removeAttribute('data-filling');
  }

  function show(
    message: string,
    variant: ToastVariant,
    duration = variant === 'error' ? ERROR_MS : TOAST_MS
  ): void {
    window.clearTimeout(timer);
    el.dataset.variant = variant;
    el.removeAttribute('data-filling');
    text.textContent = message;
    el.toggleAttribute('data-shown', true);
    if (duration > 0) timer = window.setTimeout(hide, duration);
  }

  function progress(message: string, done: () => void): void {
    const duration = reducedMotion() ? 300 : PROGRESS_MS;
    el.style.setProperty('--phone-progress', `${duration}ms`);
    show(message, 'progress', 0);
    nextPaint(() => el.toggleAttribute('data-filling', true));
    window.setTimeout(done, duration);
  }

  return { show, hide, progress, strings: el.dataset };
}

export function mirrorCopyStatus(
  status: HTMLElement | null,
  toast: Toast,
  enabled: () => boolean
): void {
  if (!status) return;
  new MutationObserver(() => {
    const message = status.textContent?.trim();
    if (!message || !enabled()) return;
    toast.show(message, status.classList.contains('text-danger') ? 'error' : 'done');
  }).observe(status, { childList: true, characterData: true, subtree: true });
}
