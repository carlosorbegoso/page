const SWIPE_SHARE = 0.3;
const SLOP_PX = 8;

interface Swipe {
  start: { x: number; y: number; id: number; scale: number } | null;
  dragging: boolean;
  offset: number;
}

function beginSwipe(screen: HTMLElement, swipe: Swipe, event: PointerEvent): void {
  if (event.button !== 0) return;
  if (event.pointerType === 'mouse' && (event.target as Element).closest('input, textarea'))
    return;
  const rect = screen.getBoundingClientRect();
  swipe.start = {
    x: event.clientX,
    y: event.clientY,
    id: event.pointerId,
    scale: rect.width / screen.offsetWidth || 1
  };
  swipe.dragging = false;
  swipe.offset = 0;
}

function followSwipe(screen: HTMLElement, swipe: Swipe, event: PointerEvent): void {
  const start = swipe.start;
  if (!start || event.pointerId !== start.id) return;
  const dx = event.clientX - start.x;
  const dy = event.clientY - start.y;
  if (!swipe.dragging) {
    if (Math.abs(dx) < SLOP_PX || dx < 0 || Math.abs(dx) < Math.abs(dy) * 1.4) {
      if (Math.abs(dy) > SLOP_PX * 1.5) swipe.start = null;
      return;
    }
    swipe.dragging = true;
    screen.setPointerCapture(event.pointerId);
    screen.toggleAttribute('data-dragging', true);
  }
  swipe.offset = Math.max(0, dx / start.scale);
  screen.style.transform = `translateX(${swipe.offset}px)`;
}

function endSwipe(screen: HTMLElement, swipe: Swipe, event: PointerEvent, onBack: () => void): void {
  if (!swipe.start || event.pointerId !== swipe.start.id) return;
  swipe.start = null;
  if (!swipe.dragging) return;
  swipe.dragging = false;
  screen.removeAttribute('data-dragging');
  if (swipe.offset > screen.offsetWidth * SWIPE_SHARE) onBack();
  else screen.style.transform = '';
}

/** Edge-free swipe right to go back: the screen follows the finger and closes past 30 % of its width. */
export function bindSwipeBack(screen: HTMLElement, onBack: () => void): void {
  const swipe: Swipe = { start: null, dragging: false, offset: 0 };
  screen.addEventListener('pointerdown', event => beginSwipe(screen, swipe, event));
  screen.addEventListener('pointermove', event => followSwipe(screen, swipe, event));
  const end = (event: PointerEvent) => endSwipe(screen, swipe, event, onBack);
  screen.addEventListener('pointerup', end);
  screen.addEventListener('pointercancel', end);
}
