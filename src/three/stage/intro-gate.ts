import type { StageLoop } from './frame-loop';

const OPEN_SAFETY_MS = 4000;

export function holdIntroForBoot(loop: StageLoop): () => void {
  const release = () => {
    if (loop.introUntil === Number.POSITIVE_INFINITY) {
      loop.introUntil = performance.now();
      loop.bump();
    }
    cleanup();
  };
  const timer = window.setTimeout(release, OPEN_SAFETY_MS);
  window.addEventListener('stage:boot-open', release);
  window.addEventListener('stage:skip', release);
  function cleanup(): void {
    clearTimeout(timer);
    window.removeEventListener('stage:boot-open', release);
    window.removeEventListener('stage:skip', release);
  }
  return cleanup;
}
