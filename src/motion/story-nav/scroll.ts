import { motionAllowed, readMotion } from '../../three/motion';
import type { NavState, StoryNavHost } from './types';

export const moves = () => motionAllowed(readMotion());

export interface Scroller {
  cancel(): void;
  scrollToY(y: number, index: number | null, onArrive?: () => void): void;
  /** Goes to a shot by index; -1 is the top of the page. */
  goToIndex(index: number, onArrive?: () => void): void;
}

const maxScroll = () => Math.max(0, document.documentElement.scrollHeight - innerHeight);

function tweenSeconds(top: number): number {
  const distance = Math.abs(top - scrollY) / Math.max(1, innerHeight);
  return Math.min(1.2, Math.max(0.35, 0.3 + distance * 0.35));
}

/** Smooth scrolling between shots; `onAutoKill` runs when the visitor takes the scroll over mid-tween. */
class TweenScroller implements Scroller {
  constructor(
    private readonly host: StoryNavHost,
    private readonly state: NavState,
    private readonly onAutoKill: () => void
  ) {}

  cancel(): void {
    this.state.tween?.kill();
    this.state.tween = null;
    this.state.targetIndex = null;
  }

  scrollToY(y: number, index: number | null, onArrive?: () => void): void {
    this.cancel();
    const top = Math.round(Math.min(Math.max(0, y), maxScroll()));
    if (Math.abs(top - scrollY) < 2) {
      onArrive?.();
      return;
    }
    if (!moves()) {
      scrollTo({ top, behavior: 'instant' });
      onArrive?.();
      return;
    }
    this.tweenTo(top, index, onArrive);
  }

  goToIndex(index: number, onArrive?: () => void): void {
    const shots = this.host.shots();
    if (index < 0) return this.scrollToY(0, null, onArrive);
    const shot = shots[Math.min(index, shots.length - 1)];
    if (shot) this.scrollToY(shot.top, index, onArrive);
  }

  private tweenTo(top: number, index: number | null, onArrive?: () => void): void {
    const { state } = this;
    state.targetIndex = index;
    state.tween = this.host.gsap.to(window, {
      duration: tweenSeconds(top),
      ease: 'power2.inOut',
      scrollTo: {
        y: top,
        autoKill: true,
        onAutoKill: () => {
          state.tween = null;
          state.targetIndex = null;
          this.onAutoKill();
        }
      },
      onComplete: () => {
        state.tween = null;
        state.targetIndex = null;
        onArrive?.();
      }
    });
  }
}

export function createScroller(host: StoryNavHost, state: NavState, onAutoKill: () => void): Scroller {
  return new TweenScroller(host, state, onAutoKill);
}
