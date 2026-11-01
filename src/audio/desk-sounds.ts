import { DESK_VOICES, type DeskSound } from './desk-voices';
import { vary } from './synth';

type Phase = 'hover' | 'press' | 'activate';

const LEVEL: Record<DeskSound, number> = {
  clock: 0.07,
  laptop: 0.16,
  keyboard: 0.09,
  folder: 0.18,
  chat: 0.12,
  gift: 0.28,
  mug: 0.1,
  wrench: 0.1,
  toy: 0.14,
  phone: 0.13,
  blind: 0.4
};

const DEFAULT_GAP_MS = 350;
const GAP_MS: Partial<Record<DeskSound, number>> = { clock: 1200, phone: 500, blind: 600, gift: 500 };
const CONTACT_BUZZ_GAP_MS = 6000;
const PITCH_SPREAD = 0.05;

const BY_PREFIX: readonly (readonly [string, DeskSound | null])[] = [
  ['folder', 'folder'],
  ['paper', 'folder'],
  ['skymek', 'wrench'],
  ['wrench', 'wrench'],
  ['ventixs', 'chat'],
  ['chat', 'chat'],
  ['parati', 'gift'],
  ['gift', 'gift'],
  ['alfa', 'toy'],
  ['clock', 'clock'],
  ['mug', 'mug'],
  ['laptop', 'laptop'],
  ['macbook', 'laptop'],
  ['keyboard', 'keyboard'],
  ['window', 'blind'],
  ['blind', 'blind'],
  ['phone', 'phone'],
  ['lamp', null]
];

/** Maps an interaction id (`folder-acme`, `desk:skymek`, `chat`…) to its sound; unknown ids stay silent. */
export function soundFor(id: unknown): DeskSound | null {
  if (typeof id !== 'string') return null;
  const key = id.toLowerCase().replace(/^desk:/, '');
  return BY_PREFIX.find(([prefix]) => key.startsWith(prefix))?.[1] ?? null;
}

interface Options {
  context: AudioContext;
  output: AudioNode;
  noise: AudioBuffer;
  canPlay: () => boolean;
  signal: AbortSignal;
}

/**
 * Per-object foley. Several events can describe the same click (`desk:interact`, `desk:action`,
 * `desk:clock`), so every sound goes through one gate with a minimum interval per sound.
 */
export function listenDeskSounds({ context, output, noise, canPlay, signal }: Options): void {
  const lastPlayed = new Map<DeskSound, number>();
  let lastContactBuzz = -Infinity;
  const on = <T>(type: string, handler: (detail: T | undefined) => void) =>
    window.addEventListener(type, event => handler((event as CustomEvent<T>).detail), { signal });

  const play = (sound: DeskSound | null) => {
    if (!sound || !canPlay()) return;
    const now = performance.now();
    if (now - (lastPlayed.get(sound) ?? -Infinity) < (GAP_MS[sound] ?? DEFAULT_GAP_MS)) return;
    lastPlayed.set(sound, now);
    DESK_VOICES[sound](context, output, noise, LEVEL[sound], vary(1, PITCH_SPREAD));
  };

  on<{ id?: string; phase?: Phase }>('desk:interact', detail => {
    if (detail?.phase === 'press' || detail?.phase === 'activate') play(soundFor(detail.id));
  });
  on<{ action?: string; id?: string }>('desk:action', detail => {
    if (detail?.action === 'play') play(soundFor(detail.id));
    else if (detail?.action === 'folder' || detail?.action === 'folder-close') play('folder');
  });
  on<unknown>('desk:clock', () => play('clock'));
  on<{ id?: string }>('chapter:enter', detail => {
    if (detail?.id !== 'contact' || performance.now() - lastContactBuzz < CONTACT_BUZZ_GAP_MS) return;
    lastContactBuzz = performance.now();
    play('phone');
  });
}
