import type { Scroller } from './scroll';
import type { StoryNavHost } from './types';

function samePageHash(event: MouseEvent): string {
  const link = (event.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href*="#"]');
  return link && link.origin === location.origin && link.pathname === location.pathname ? link.hash.slice(1) : '';
}

/** In-page links to a chapter (#products, the index) travel to its first shot, not to the bare spacer. */
export function createAnchorClickHandler(host: StoryNavHost, scroller: Scroller): (event: MouseEvent) => void {
  return event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
    const hash = samePageHash(event);
    if (!hash) return;
    const index = host.shots().findIndex(shot => shot.chapter === hash);
    if (index < 0) return;
    event.preventDefault();
    history.replaceState(null, '', `#${hash}`);
    scroller.goToIndex(index);
  };
}
