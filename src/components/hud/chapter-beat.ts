import { beatFor, readBeats } from './beats';
import type { HudElements } from './elements';

const STATION_SELECTOR = '[data-station]';

function observeStations(stations: HTMLElement[], activate: (id: string) => void): void {
  if (!('IntersectionObserver' in window) || stations.length === 0) return;
  const visible = new Set<HTMLElement>();
  const observer = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        const target = entry.target as HTMLElement;
        if (entry.isIntersecting) visible.add(target);
        else visible.delete(target);
      }
      const current = stations.find(station => visible.has(station));
      if (current) activate(current.dataset.station ?? current.id);
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  for (const station of stations) observer.observe(station);
}

export function initChapterBeat({ chapter, clock }: HudElements): void {
  const indexLinks = [...document.querySelectorAll<HTMLAnchorElement>('[data-index-link]')];
  const stations = [...document.querySelectorAll<HTMLElement>(STATION_SELECTOR)];
  const beats = readBeats(chapter);
  let activeId: string | null = null;
  let activeSub = 0;

  function showBeat(id: string, sub: number) {
    activeSub = sub;
    const lines = beatFor(beats, id);
    if (!chapter || !lines?.length) return;
    chapter.textContent = lines[Math.min(Math.max(sub, 0), lines.length - 1)]!;
    chapter.dataset.ready = 'true';
    if (clock) clock.hidden = false;
  }

  function setActive(id: string | null, sub?: number) {
    if (!id || (id === activeId && sub === undefined)) return;
    showBeat(id, sub ?? 0);
    if (id === activeId) return;
    activeId = id;
    for (const link of indexLinks) {
      if (link.dataset.indexLink === id) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
    window.dispatchEvent(new CustomEvent('section:active', { detail: { id } }));
  }

  window.addEventListener('time:toggle', () => {
    if (activeId) showBeat(activeId, activeSub);
  });

  for (const type of ['station:enter', 'chapter:enter']) {
    window.addEventListener(type, event => {
      const detail = (event as CustomEvent<{ id?: string; subIndex?: number }>).detail;
      setActive(detail?.id ?? null, detail?.subIndex);
    });
  }

  observeStations(stations, id => setActive(id));

}
