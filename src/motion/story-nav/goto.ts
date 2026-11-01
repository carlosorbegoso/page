import type { Scroller } from './scroll';
import { stepIndex } from './shot-index';
import type { NavState, StoryGotoDetail, StoryNavHost } from './types';

export interface Navigator {
  step(direction: 1 | -1): void;
  goto(detail: StoryGotoDetail | undefined): void;
}

export function createNavigator(host: StoryNavHost, state: NavState, scroller: Scroller): Navigator {
  function step(direction: 1 | -1): void {
    const shots = host.shots();
    if (!shots.length) return;
    scroller.goToIndex(stepIndex(shots, direction, host.activeIndex(), state.targetIndex));
  }

  function goto(detail: StoryGotoDetail | undefined): void {
    if (!detail) return;
    if ('step' in detail) return step(detail.step);
    if ('edge' in detail)
      return detail.edge === 'start' ? scroller.goToIndex(-1) : scroller.goToIndex(host.shots().length - 1);
    const shots = host.shots();
    const index = shots.findIndex(
      shot => shot.chapter === detail.chapter && shot.sub === (detail.sub ?? 0)
    );
    if (index >= 0) scroller.goToIndex(index);
  }

  return { step, goto };
}
