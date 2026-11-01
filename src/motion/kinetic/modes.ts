import { html, is3d } from './env';
import { groups, setLive, setPlate, stationOf } from './groups';

export const chapterState = { events: false, settled: null as string | null };

function chapterOf(owner: HTMLElement): string | undefined {
  return stationOf.get(owner) ?? owner.closest<HTMLElement>('[data-station-plates]')?.dataset.stationPlates;
}

export function evaluate3d(owner: HTMLElement): void {
  const dormant = owner.hasAttribute('data-dormant');
  const active = owner.hasAttribute('data-active');
  if (chapterState.events) {
    if (dormant) setPlate(owner, false, false);
    else if (chapterState.settled !== null && chapterOf(owner) === chapterState.settled) setPlate(owner, true, active);
    else setLive(owner, false);
    return;
  }
  const siblings = owner.parentElement ? Array.from(owner.parentElement.children) : [];
  const stationActive = active || siblings.some(el => el.hasAttribute('data-active'));
  if (dormant) setPlate(owner, false, false);
  else if (stationActive) setPlate(owner, true, active);
  else setLive(owner, false);
}

const intersection = new IntersectionObserver(
  entries => {
    if (is3d()) return;
    for (const entry of entries) {
      const owner = entry.target as HTMLElement;
      if (entry.isIntersecting) setPlate(owner, true, true);
      else setLive(owner, false);
    }
  },
  { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
);

export const plateObserver = new MutationObserver(records => {
  if (!is3d()) return;
  const touched = new Set<HTMLElement>();
  for (const record of records) {
    const owner = record.target as HTMLElement;
    touched.add(owner);
    for (const sibling of owner.parentElement?.children ?? []) {
      if (groups.has(sibling as HTMLElement)) touched.add(sibling as HTMLElement);
    }
  }
  for (const owner of touched) if (groups.has(owner)) evaluate3d(owner);
});

let mode: '3d' | 'flat' | null = null;

export function resetMode(): void {
  mode = null;
}

export function applyMode(): void {
  const next = is3d() ? '3d' : 'flat';
  if (next === mode) return;
  mode = next;
  for (const owner of groups.keys()) intersection.unobserve(owner);
  if (next === '3d') {
    for (const owner of groups.keys()) evaluate3d(owner);
  } else {
    html.removeAttribute('data-chapter-moving');
    for (const owner of groups.keys()) intersection.observe(owner);
  }
}
