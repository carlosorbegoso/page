import type { DeskVoice } from './desk-voices';
import { grain, ring, thump } from './synth';

export type BeatSound = 'invite' | 'yape' | 'ticket' | 'message';

const start = (context: BaseAudioContext) => context.currentTime + 0.005;

const invite: DeskVoice = (context, out, _noise, level, pitch) => {
  const at = start(context);
  [1568, 2093, 2637].forEach((hz, index) =>
    ring(context, out, at + index * 0.07, hz * pitch, level * (1 - index * 0.2), 0.45)
  );
};

const yape: DeskVoice = (context, out, _noise, level, pitch) => {
  const at = start(context);
  ring(context, out, at, 1319 * pitch, level, 0.32);
  ring(context, out, at + 0.11, 1976 * pitch, level * 0.9, 0.5);
};

const ticket: DeskVoice = (context, out, noise, level, pitch) => {
  const at = start(context);
  for (let i = 0; i < 14; i++)
    grain(context, out, noise, at + i * 0.024, {
      hz: 2400 * pitch,
      q: 6,
      level: level * 0.55,
      decay: 0.022
    });
  thump(context, out, at + 0.36, {
    from: 900 * pitch,
    to: 300,
    level: level * 0.35,
    decay: 0.05,
    type: 'square'
  });
};

const message: DeskVoice = (context, out, _noise, level, pitch) => {
  const at = start(context);
  thump(context, out, at, { from: 520 * pitch, to: 1040 * pitch, level, decay: 0.09 });
};

export const BEAT_VOICES: Record<BeatSound, DeskVoice> = { invite, yape, ticket, message };
export const BEAT_LEVEL: Record<BeatSound, number> = {
  invite: 0.06,
  yape: 0.08,
  ticket: 0.12,
  message: 0.1
};
