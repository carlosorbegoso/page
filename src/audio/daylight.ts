import type { ChapterId, ChapterPreset } from './chapters';

/** `html[data-time]` is only day or night; the last chapters of a day visit read as dusk. */
export type TimeOfDay = 'day' | 'dusk' | 'night';

export interface RoomMix {
  rain: number;
  hum: number;
  city: number;
  passes: number;
}

const DUSK_CHAPTERS: readonly ChapterId[] = ['contact', 'outro'];

const SCALE: Record<TimeOfDay, RoomMix> = {
  day: { rain: 0, hum: 0.35, city: 1.5, passes: 1 },
  dusk: { rain: 0, hum: 0.6, city: 0.9, passes: 0.35 },
  night: { rain: 1, hum: 1, city: 1, passes: 0.12 }
};

/** Day brightens the pad a little: the room is lit by the window, not the lamp. */
const CUTOFF_SCALE: Record<TimeOfDay, number> = { day: 1.35, dusk: 1.1, night: 1 };

export function timeOfDay(chapter: ChapterId): TimeOfDay {
  if (document.documentElement.dataset.time !== 'day') return 'night';
  return DUSK_CHAPTERS.includes(chapter) ? 'dusk' : 'day';
}

export function roomMix(chapter: ChapterId, preset: ChapterPreset): RoomMix {
  const scale = SCALE[timeOfDay(chapter)];
  return {
    rain: preset.rain * scale.rain,
    hum: preset.hum * scale.hum,
    city: Math.min(1.6, preset.city * scale.city),
    passes: scale.passes
  };
}

export function padCutoff(chapter: ChapterId, preset: ChapterPreset): number {
  return preset.cutoff * CUTOFF_SCALE[timeOfDay(chapter)];
}
