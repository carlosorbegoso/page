import { createAnchorClickHandler } from './anchors';
import { createGestureHandlers } from './gestures';
import { createNavigator, type Navigator } from './goto';
import { createKeyHandler } from './keys';
import { createScroller, type Scroller } from './scroll';
import { createSnapper, type Snapper } from './snap';
import { createTour, type Tour } from './tour';
import { createNavState, type NavState, type SettledShot, type StoryGotoDetail, type StoryNavHost } from './types';
import { createWheelHandler } from './wheel';

const TOUR_TOGGLE = '[data-story-tour], [data-story-tour-quick]';

type Listener = [EventTarget, string, EventListener, AddEventListenerOptions];

const fromTourToggle = (event: Event) =>
  event.target instanceof Element && event.target.closest(TOUR_TOGGLE) !== null;

function tourAndChapterListeners(state: NavState, tour: Tour): Listener[] {
  const onTour = (event: Event) => {
    const action =
      (event as CustomEvent<{ action?: 'toggle' | 'start' | 'stop' }>).detail?.action ?? 'toggle';
    if (action === 'stop' || (action === 'toggle' && tour.playing)) tour.stop('paused');
    else tour.start();
  };
  const onChapterEnter = () => {
    state.settled = null;
  };
  const onChapterSettled = (event: Event) => {
    state.settled = (event as CustomEvent<SettledShot>).detail ?? null;
  };
  const onVisibility = () => {
    if (document.visibilityState === 'hidden') tour.stop('paused');
  };
  return [
    [window, 'story:tour', onTour, {}],
    [window, 'chapter:enter', onChapterEnter, {}],
    [window, 'chapter:settled', onChapterSettled, {}],
    [document, 'visibilitychange', onVisibility, {}]
  ];
}

interface InputParts {
  scroller: Scroller;
  navigator: Navigator;
  snapper: Snapper;
  interrupt: (event: Event) => void;
}

function inputListeners(host: StoryNavHost, state: NavState, { scroller, navigator, snapper, interrupt }: InputParts): Listener[] {
  const gestures = createGestureHandlers(state, snapper, interrupt);
  const onScroll = () => {
    if (!state.tween) snapper.schedule();
  };
  const onGoto = (event: Event) => navigator.goto((event as CustomEvent<StoryGotoDetail>).detail);
  return [
    [document, 'click', createAnchorClickHandler(host, scroller) as EventListener, {}],
    [window, 'keydown', createKeyHandler(host, state, navigator, scroller, interrupt) as EventListener, {}],
    [window, 'scroll', onScroll, { passive: true }],
    [window, 'wheel', createWheelHandler(state, interrupt) as EventListener, { passive: false, capture: true }],
    [window, 'touchstart', gestures.onTouchStart as EventListener, { passive: true, capture: true }],
    [window, 'touchend', gestures.onTouchEnd as EventListener, { passive: true, capture: true }],
    [window, 'touchcancel', gestures.onTouchEnd as EventListener, { passive: true, capture: true }],
    [window, 'pointerdown', gestures.onPointerDown as EventListener, { passive: true, capture: true }],
    [window, 'pointerup', gestures.onPointerUp, { passive: true, capture: true }],
    [window, 'pointercancel', gestures.onPointerUp, { passive: true, capture: true }],
    [window, 'story:goto', onGoto, {}]
  ];
}

export function setupStoryNav(host: StoryNavHost): () => void {
  const html = document.documentElement;
  const state = createNavState();
  const scroller = createScroller(host, state, () => tour.stop('paused'));
  const tour = createTour(host, state, scroller);
  const navigator = createNavigator(host, state, scroller);
  const snapper = createSnapper(host, state, scroller);
  const interrupt = (event: Event) => {
    if (tour.playing && !fromTourToggle(event)) tour.stop('paused');
  };
  const listeners = [
    ...inputListeners(host, state, { scroller, navigator, snapper, interrupt }),
    ...tourAndChapterListeners(state, tour)
  ];
  for (const [target, type, listener, options] of listeners)
    target.addEventListener(type, listener, options);
  html.dataset.storyNav = 'ready';
  window.dispatchEvent(new CustomEvent('story:ready', { detail: { total: host.shots().length } }));

  return () => {
    tour.stop('paused');
    scroller.cancel();
    window.clearTimeout(state.snapTimer);
    for (const [target, type, listener, options] of listeners)
      target.removeEventListener(type, listener, options);
    delete html.dataset.storyNav;
    window.dispatchEvent(new CustomEvent('story:disposed'));
  };
}
