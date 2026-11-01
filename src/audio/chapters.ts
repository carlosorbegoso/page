import type { ChapterId } from '../three/contracts';

export { isChapterId, type ChapterId } from '../three/contracts';

export interface ChapterPreset {
  /** MIDI notes of the pad chord, lowest first. */
  chord: readonly number[];
  /** Lowpass cutoff of the pad in Hz. */
  cutoff: number;
  /** 0..1 levels of the room tone layers. */
  rain: number;
  hum: number;
  city: number;
  /** 0..1 wet sends to the short room reverb and the longer dawn reverb. */
  room: number;
  hall: number;
  /** Seconds the move into this chapter takes. */
  crossfade: number;
}

const NIGHT = { rain: 1, hum: 1, city: 0.7, room: 0.55, hall: 0.12, crossfade: 3 } as const;

export const PRESETS: Record<ChapterId, ChapterPreset> = {
  intro: { ...NIGHT, chord: [50, 57, 61, 64], cutoff: 520, hum: 0.8, crossfade: 2 },
  hero: { ...NIGHT, chord: [50, 57, 61, 64], cutoff: 650 },
  about: { ...NIGHT, chord: [47, 54, 57, 62], cutoff: 760, hum: 1.25, city: 0.55 },
  company: { ...NIGHT, chord: [43, 50, 54, 61], cutoff: 900, rain: 0.85, hum: 0.8 },
  products: { ...NIGHT, chord: [52, 59, 62, 66], cutoff: 980, rain: 0.85, hum: 0.8 },
  experience: { ...NIGHT, chord: [45, 52, 59, 61], cutoff: 820, rain: 0.9, hum: 0.85 },
  contact: { ...NIGHT, chord: [50, 57, 64, 66], cutoff: 1050, rain: 0.8 },
  outro: {
    chord: [38, 50, 57, 64, 66, 69, 76],
    cutoff: 2600,
    rain: 0,
    hum: 0.2,
    city: 1,
    room: 0.2,
    hall: 0.7,
    crossfade: 6
  }
};

export function midiToHz(note: number): number {
  return 440 * 2 ** ((note - 69) / 12);
}
