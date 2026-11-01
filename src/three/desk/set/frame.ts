import type { ChapterId } from '../../contracts';

/** What every set module reads in `update`: the director's state plus this frame's clock. */
export interface DeskFrame {
  dt: number;
  /** `dt` while motion is allowed; a large step that lands every animation at once otherwise. */
  step: number;
  time: number;
  motion: boolean;
  day: boolean;
  chapter: ChapterId;
  subIndex: number;
  /** `storyRank(chapter, subIndex)`. */
  rank: number;
  /** Time the camera landed on this shot, or -1 while it still travels. */
  settledAt: number;
}
