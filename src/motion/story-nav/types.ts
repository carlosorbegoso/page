import type { gsap as Gsap } from 'gsap';
import type { ChapterId } from '../../three/contracts';

export interface StoryShot {
  chapter: ChapterId;
  sub: number;
  top: number;
}

export interface StoryNavHost {
  gsap: typeof Gsap;
  shots(): StoryShot[];
  activeIndex(): number;
}

export type StoryGotoDetail =
  { chapter: ChapterId; sub?: number } | { step: 1 | -1 } | { edge: 'start' | 'end' };
export type StoryTourState = 'playing' | 'paused' | 'finished';

export type SettledShot = { id: ChapterId; subIndex: number };

export interface NavState {
  tween: ReturnType<(typeof Gsap)['to']> | null;
  targetIndex: number | null;
  snapTimer: number;
  lastWheel: number;
  wheelSum: number;
  wheelStepped: boolean;
  lastNativeKey: number;
  touches: number;
  pointerHeld: boolean;
  settled: SettledShot | null;
}

export function createNavState(): NavState {
  return {
    tween: null,
    targetIndex: null,
    snapTimer: 0,
    lastWheel: 0,
    wheelSum: 0,
    wheelStepped: false,
    lastNativeKey: 0,
    touches: 0,
    pointerHeld: false,
    settled: null
  };
}

export const dialogOpen = () => document.documentElement.matches(':has(dialog[open])');
