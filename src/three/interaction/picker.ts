import { Raycaster, Vector2, type PerspectiveCamera } from 'three';
import type { StationPick } from '../contracts';
import type { PickSource } from './types';

const UI_SELECTOR =
  'a, button, input, textarea, select, label, summary, [role="button"], [tabindex]:not([tabindex="-1"]), [contenteditable], [data-panel], [data-plate], [data-plate-wrapper]';

export function createPicker(source: PickSource, camera: PerspectiveCamera, canvas: HTMLCanvasElement): (event: PointerEvent | MouseEvent) => StationPick | null {
  const raycaster = new Raycaster();
  const ndc = new Vector2();
  return event => {
    const target = event.target as Element | null;
    if (target?.closest?.(UI_SELECTOR)) return null;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    ndc.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const objects = source.picks().map(p => p.object3D);
    for (const hit of raycaster.intersectObjects(objects, true)) {
      const meaning = source.resolvePick(hit.object);
      if (meaning) return meaning;
    }
    return null;
  };
}
