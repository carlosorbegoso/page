import { refreshProximity } from '../proximity';
import { allowed } from './env';
import { resetRoot, revealRoot } from './reveal';
import { stopKeys } from './type-keys';

const ROOTS = '[data-kinetic], [data-kinetic-cascade], [data-kinetic-count]';

export const groups = new Map<HTMLElement, HTMLElement[]>();

export const stationOf = new Map<HTMLElement, string>();

export function collect(): void {
  for (const root of document.querySelectorAll<HTMLElement>(ROOTS)) {
    const owner = root.closest<HTMLElement>('[data-plate]') ?? root;
    const station = owner.closest<HTMLElement>('[data-station]')?.dataset.station;
    if (station) stationOf.set(owner, station);
    const list = groups.get(owner) ?? [];
    list.push(root);
    groups.set(owner, list);
  }
}

export function setLive(owner: HTMLElement, live: boolean): void {
  if (owner.hasAttribute('data-motion-live') === live) return;
  owner.toggleAttribute('data-motion-live', live);
  refreshProximity();
}

export function setPlate(owner: HTMLElement, revealed: boolean, live: boolean): void {
  setLive(owner, live && allowed());
  const animate = allowed();
  for (const root of groups.get(owner) ?? []) {
    if (revealed) revealRoot(root, animate);
    else if (animate) resetRoot(root);
  }
}

export function revealEverything(): void {
  for (const [owner, roots] of groups) {
    setLive(owner, false);
    for (const root of roots) {
      stopKeys(root);
      revealRoot(root, false);
    }
  }
}
