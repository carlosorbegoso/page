import type { ChapterId } from '../contracts';
import type { TierResult } from '../tier';

export interface CaptureOptions {
  chapter: ChapterId;
  sub: number;
}

export interface StageOptions {
  container: HTMLElement;
  tier: TierResult;
  capture?: CaptureOptions;
  /** Fixes one chapter without scroll (`?chapter=`). */
  forcedChapter?: ChapterId;
  /** Sub-shot of the forced chapter (`?sub=`). */
  forcedSub?: number;
  debug?: boolean;
}

/** Boot milestones for the pre-three loader in StageCanvas (0…1). */
export function reportProgress(value: number): void {
  window.dispatchEvent(new CustomEvent('stage:progress', { detail: { value } }));
}
