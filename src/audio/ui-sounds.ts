import { playKey, playTock } from './voices';

const LEVELS = { key: 0.1, tockHover: 0.09, tockClick: 0.18 } as const;
const KEY_GAP_MS = 28;
const TOCK_GAP_MS = 250;

interface Options {
  context: AudioContext;
  output: AudioNode;
  noise: AudioBuffer;
  canPlay: () => boolean;
  signal: AbortSignal;
}

export function listenUiSounds({ context, output, noise, canPlay, signal }: Options): void {
  let lastKey = 0;
  let lastTock = 0;
  let lastHoverLabel: string | null = null;
  const on = <T>(type: string, handler: (detail: T | undefined) => void) =>
    window.addEventListener(type, event => handler((event as CustomEvent<T>).detail), { signal });

  const tock = (level: number) => {
    if (!canPlay()) return;
    const now = performance.now();
    if (now - lastTock < TOCK_GAP_MS) return;
    lastTock = now;
    playTock(context, output, level);
  };

  on<{ label?: string | null }>('scene:hover', detail => {
    const label = detail?.label ?? null;
    const changed = label !== lastHoverLabel;
    lastHoverLabel = label;
    if (label && changed) tock(LEVELS.tockHover);
  });
  for (const type of ['product:focus', 'experience:focus']) {
    on<{ source?: string }>(type, detail => {
      if (detail?.source === 'scene') tock(LEVELS.tockClick);
    });
  }
  on<unknown>('desk:key', () => {
    if (!canPlay()) return;
    const now = performance.now();
    if (now - lastKey < KEY_GAP_MS) return;
    lastKey = now;
    playKey(context, output, noise, LEVELS.key);
  });
}
