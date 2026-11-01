import type { ChapterId } from '../../contracts';

export interface DeskFrame {
  dt: number;
  step: number;
  time: number;
  motion: boolean;
  day: boolean;
  chapter: ChapterId;
  subIndex: number;
  rank: number;
  settledAt: number;
}
