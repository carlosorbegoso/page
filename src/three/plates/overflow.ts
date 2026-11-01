import type { PlateEntry } from './types';

export function markScrollEdge(wrapper: HTMLElement): void {
  if (!wrapper.style.maxHeight) return;
  const end = wrapper.scrollHeight - wrapper.clientHeight;
  const edge = wrapper.scrollTop <= 1 ? 'start' : wrapper.scrollTop >= end - 1 ? 'end' : 'middle';
  if (wrapper.dataset.plateOverflow !== edge) wrapper.dataset.plateOverflow = edge;
}

/**
 * A panel taller than the room between the HUD and the bottom edge is clipped to that room and
 * scrolls inside it (the page snaps from shot to shot, so page scroll can never reveal it), so it
 * never slides under the HUD. The clipped wrapper spans the full width (plate kept in place by
 * `inset`) so the side edges of the text pool are not cut.
 */
export function clipPanel(entry: PlateEntry, maxHeight: number, inset: number, viewWidth: number): void {
  const { wrapper, written } = entry;
  const clip = maxHeight ? `${maxHeight}px ${inset}px` : '';
  if (written.clip === clip) return;
  written.clip = clip;
  Object.assign(wrapper.style, {
    maxHeight: maxHeight ? `${maxHeight}px` : '',
    width: maxHeight ? `${viewWidth}px` : 'var(--plate-width)',
    paddingLeft: maxHeight ? `${inset}px` : ''
  });
  if (clip) markScrollEdge(wrapper);
  else delete wrapper.dataset.plateOverflow;
}
