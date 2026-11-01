import { allowed, html, is3d, reducedQuery } from './env';
import { collect, groups, revealEverything } from './groups';
import { applyMode, chapterState, evaluate3d, plateObserver, resetMode } from './modes';
import { enhanceSectionHeaders, indexCascades } from './split-markup';

declare global {
  interface Window {
    __kinetic?: boolean;
  }
}


function syncMotion(): void {
  if (allowed()) {
    html.classList.add('k-armed');
    resetMode();
    applyMode();
  } else {
    html.classList.remove('k-armed');
    revealEverything();
  }
}

export function boot(): void {
  window.__kinetic = true;
  const armedBeforePaint = html.classList.contains('k-armed');
  enhanceSectionHeaders();
  indexCascades();
  collect();
  if (!armedBeforePaint || !allowed()) revealEverything();
  syncMotion();

  for (const owner of groups.keys()) {
    if (owner.hasAttribute('data-plate')) {
      plateObserver.observe(owner, { attributes: true, attributeFilter: ['data-active', 'data-dormant'] });
    }
  }
  new MutationObserver(applyMode).observe(html, { attributes: true, attributeFilter: ['class'] });
  window.addEventListener('motion:toggle', syncMotion);
  window.addEventListener('chapter:enter', () => {
    chapterState.events = true;
    chapterState.settled = null;
    html.toggleAttribute('data-chapter-moving', true);
    if (is3d()) for (const owner of groups.keys()) evaluate3d(owner);
  });
  window.addEventListener('chapter:settled', event => {
    chapterState.events = true;
    chapterState.settled = (event as CustomEvent<{ id?: string }>).detail?.id ?? null;
    html.removeAttribute('data-chapter-moving');
    if (is3d()) for (const owner of groups.keys()) evaluate3d(owner);
  });
  reducedQuery.addEventListener('change', syncMotion);
}
