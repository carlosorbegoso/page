import type { Page } from '@playwright/test';

export interface PlateBox {
  id: string;
  chapter: string;
  active: boolean;
  printed: boolean;
  visible: boolean;
  standIn: boolean;
  width: number;
  height: number;
  left: number;
  top: number;
}

export function readPlates(page: Page): Promise<PlateBox[]> {
  return page.evaluate(() => {
    const shown = (el: Element | null) => !el || Number(getComputedStyle(el).opacity) > 0.01;
    return [...document.querySelectorAll<HTMLElement>('[data-plate]')].map(plate => {
      const box = plate.getBoundingClientRect();
      const wrapper = plate.closest<HTMLElement>('[data-plate-wrapper]');
      const printed = plate.hasAttribute('data-plate-printed');
      const clipped = getComputedStyle(plate).clipPath.startsWith('inset(50%');
      return {
        id: plate.dataset.plateId ?? '',
        chapter: wrapper?.dataset.plateChapter ?? '',
        active: plate.hasAttribute('data-active'),
        printed,
        visible: !printed && box.width > 2 && box.height > 2 && shown(plate) && shown(wrapper),
        standIn: clipped && box.width <= 2 && box.height <= 2,
        width: box.width,
        height: box.height,
        left: box.left,
        top: box.top
      };
    });
  });
}

function intersects(a: PlateBox, b: PlateBox): boolean {
  const overlapX = Math.min(a.left + a.width, b.left + b.width) - Math.max(a.left, b.left);
  const overlapY = Math.min(a.top + a.height, b.top + b.height) - Math.max(a.top, b.top);
  return overlapX > 1 && overlapY > 1;
}

export function overlappingPairs(plates: PlateBox[]): string[] {
  const visible = plates.filter(plate => plate.visible);
  return visible.flatMap((a, index) =>
    visible.slice(index + 1).filter(b => intersects(a, b)).map(b => `${a.id} × ${b.id}`)
  );
}
