export interface MotionState {
  reduced: boolean;
  paused: boolean;
}

const PAUSED_VALUES = new Set(['paused', 'reduced']);

export function readMotion(): MotionState {
  return {
    reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
    paused: PAUSED_VALUES.has(document.documentElement.dataset.motion ?? '')
  };
}

export function motionAllowed(state: MotionState): boolean {
  return !state.reduced && !state.paused;
}

export function watchMotion(listener: (state: MotionState) => void): () => void {
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const onMedia = () => listener(readMotion());
  const onToggle = (event: Event) => {
    const paused = (event as CustomEvent<{ paused?: boolean }>).detail?.paused;
    listener({ ...readMotion(), paused: typeof paused === 'boolean' ? paused : readMotion().paused });
  };
  media.addEventListener('change', onMedia);
  window.addEventListener('motion:toggle', onToggle);
  return () => {
    media.removeEventListener('change', onMedia);
    window.removeEventListener('motion:toggle', onToggle);
  };
}
