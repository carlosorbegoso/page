import { isChapterId, type ChapterId } from '../three/contracts';

export { isChapterId, type ChapterId } from '../three/contracts';

export interface ChapterPreset {
  chord: readonly number[];
  cutoff: number;
  rain: number;
  hum: number;
  city: number;
  room: number;
  hall: number;
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

export function chapterFromDom(): ChapterId {
  const centre = innerHeight / 2;
  for (const section of document.querySelectorAll<HTMLElement>('[data-station]')) {
    const box = section.getBoundingClientRect();
    const id = section.dataset.station;
    if (box.top <= centre && box.bottom >= centre && isChapterId(id)) return id;
  }
  return 'hero';
}
