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
  forcedChapter?: ChapterId;
  forcedSub?: number;
  debug?: boolean;
}

export function reportProgress(value: number): void {
  window.dispatchEvent(new CustomEvent('stage:progress', { detail: { value } }));
}
