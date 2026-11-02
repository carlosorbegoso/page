import type { LookAround } from './look';

const DRAG_THRESHOLD_PX = 5;
export const OWNS_POINTER =
  'a, button, input, textarea, select, label, summary, dialog, header, [role="button"], [contenteditable], [data-plate], [data-plate-wrapper]';

interface LookInput {
  look: LookAround;
  wake(): void;
  enabled(): boolean;
}

export function swallowNextClick(): void {
  const swallow = (event: Event) => {
    event.stopImmediatePropagation();
    event.preventDefault();
  };
  window.addEventListener('click', swallow, { capture: true, once: true });
  setTimeout(() => window.removeEventListener('click', swallow, { capture: true }), 0);
}

class LookDrag {
  private start: { x: number; y: number; id: number } | null = null;
  private dragging = false;
  private readonly root = document.documentElement;

  constructor(private readonly input: LookInput) {}

  readonly down = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse' || event.button !== 0 || !this.input.enabled()) return;
    if (!(event.target instanceof Element) || event.target.closest(OWNS_POINTER)) return;
    this.start = { x: event.clientX, y: event.clientY, id: event.pointerId };
    this.dragging = false;
  };

  readonly move = (event: PointerEvent) => {
    if (!this.start || event.pointerId !== this.start.id) return;
    const travelled = Math.hypot(event.clientX - this.start.x, event.clientY - this.start.y);
    if (!this.dragging && travelled < DRAG_THRESHOLD_PX) return;
    if (!this.dragging) this.begin();
    this.input.look.drag(event.movementX, event.movementY);
    this.input.wake();
  };

  readonly up = (event: PointerEvent) => {
    if (!this.start || event.pointerId !== this.start.id) return;
    if (this.dragging) this.end();
    this.start = null;
    this.dragging = false;
  };

  private begin(): void {
    this.dragging = true;
    this.input.look.grab();
    this.root.dataset.looking = '';
  }

  private end(): void {
    this.input.look.release();
    delete this.root.dataset.looking;
    swallowNextClick();
    this.input.wake();
  }

  dispose(): void {
    delete this.root.dataset.looking;
  }
}

export function attachLookInput(input: LookInput): () => void {
  const drag = new LookDrag(input);
  const events = [
    ['pointerdown', drag.down],
    ['pointermove', drag.move],
    ['pointerup', drag.up],
    ['pointercancel', drag.up]
  ] as const;
  for (const [type, handler] of events) window.addEventListener(type, handler, { passive: true });
  return () => {
    for (const [type, handler] of events) window.removeEventListener(type, handler);
    drag.dispose();
  };
}
