import type { StationPick } from '../contracts';

function interactId(pick: StationPick): string {
  const id = pick.key.startsWith('desk:') ? pick.key.slice(5) : pick.key;
  return pick.experience ? `folder-${id}` : id;
}

export function emitInteract(pick: StationPick, phase: 'hover' | 'press' | 'activate'): void {
  if (pick.action === 'lamp' && phase !== 'hover') return;
  window.dispatchEvent(new CustomEvent('desk:interact', { detail: { id: interactId(pick), phase } }));
}

export function labelOf(pick: StationPick): string {
  if (typeof pick.label === 'string') return pick.label;
  return document.documentElement.lang.startsWith('en') ? pick.label.en : pick.label.es;
}
