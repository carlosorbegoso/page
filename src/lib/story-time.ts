import type { ChapterId } from '../three/contracts';

const NIGHT_START = 22 * 60;
const DAY_START = 10 * 60;

const STORY_MINUTES: Record<ChapterId, number[]> = {
  intro: [60],
  hero: [60],
  about: [80, 90],
  experience: [100, 105, 110, 115, 120],
  company: [150],
  products: [210, 240, 270],
  contact: [330],
  outro: [478]
};

const STORY_MINUTES_DAY: Record<ChapterId, number[]> = {
  intro: [0],
  hero: [0],
  about: [20, 40],
  experience: [60, 65, 70, 75, 80],
  company: [490],
  products: [500, 510, 520],
  contact: [530],
  outro: [545]
};

export function storyMinutes(chapter: ChapterId, subIndex: number, day = false): number {
  const table = day ? STORY_MINUTES_DAY : STORY_MINUTES;
  const list = table[chapter] ?? table.hero;
  return list[Math.min(Math.max(subIndex, 0), list.length - 1)]!;
}

export function clockText(minutes: number, day: boolean): string {
  const total = ((day ? DAY_START : NIGHT_START) + Math.round(minutes)) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

export function storyClock(chapter: ChapterId, subIndex: number, day = false): string {
  return clockText(storyMinutes(chapter, subIndex, day), day);
}

export function storyClocks(day: boolean): Record<ChapterId, string[]> {
  const table = day ? STORY_MINUTES_DAY : STORY_MINUTES;
  const entries = Object.entries(table).map(([id, list]) => [id, list.map(minutes => clockText(minutes, day))]);
  return Object.fromEntries(entries) as Record<ChapterId, string[]>;
}
