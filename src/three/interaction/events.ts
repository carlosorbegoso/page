import type { StationPick } from '../contracts';

/**
 * Id of a pick in `desk:interact` events: its key without the `desk:` prefix (alfa, skymek, parati,
 * ventixs, mug, clock, phone, lamp), folders as `folder-<id>` (folder-tcs, folder-openFolder…).
 */
function interactId(pick: StationPick): string {
  const id = pick.key.startsWith('desk:') ? pick.key.slice(5) : pick.key;
  return pick.experience ? `folder-${id}` : id;
}

/**
 * Tells listeners (sound, analytics) that an object was hovered, pressed or activated. The lamp only
 * reports hover: its click already sounds through `desk:switch`.
 */
export function emitInteract(pick: StationPick, phase: 'hover' | 'press' | 'activate'): void {
  if (pick.action === 'lamp' && phase !== 'hover') return;
  window.dispatchEvent(new CustomEvent('desk:interact', { detail: { id: interactId(pick), phase } }));
}

export function labelOf(pick: StationPick): string {
  if (typeof pick.label === 'string') return pick.label;
  return document.documentElement.lang.startsWith('en') ? pick.label.en : pick.label.es;
}
