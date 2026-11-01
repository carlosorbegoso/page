const SWIPE_SHARE = 0.3;
const SLOP_PX = 8;

/** Edge-free swipe right to go back: the screen follows the finger and closes past 30 % of its width. */
export function bindSwipeBack(screen: HTMLElement, onBack: () => void): void {
  let start: { x: number; y: number; id: number; scale: number } | null = null;
  let dragging = false;
  let offset = 0;

  screen.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    if (event.pointerType === 'mouse' && (event.target as Element).closest('input, textarea'))
      return;
    const rect = screen.getBoundingClientRect();
    start = {
      x: event.clientX,
      y: event.clientY,
      id: event.pointerId,
      scale: rect.width / screen.offsetWidth || 1
    };
    dragging = false;
    offset = 0;
  });

  screen.addEventListener('pointermove', event => {
    if (!start || event.pointerId !== start.id) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (!dragging) {
      if (Math.abs(dx) < SLOP_PX || dx < 0 || Math.abs(dx) < Math.abs(dy) * 1.4) {
        if (Math.abs(dy) > SLOP_PX * 1.5) start = null;
        return;
      }
      dragging = true;
      screen.setPointerCapture(event.pointerId);
      screen.toggleAttribute('data-dragging', true);
    }
    offset = Math.max(0, dx / start.scale);
    screen.style.transform = `translateX(${offset}px)`;
  });

  const end = (event: PointerEvent) => {
    if (!start || event.pointerId !== start.id) return;
    start = null;
    if (!dragging) return;
    dragging = false;
    screen.removeAttribute('data-dragging');
    if (offset > screen.offsetWidth * SWIPE_SHARE) onBack();
    else screen.style.transform = '';
  };
  screen.addEventListener('pointerup', end);
  screen.addEventListener('pointercancel', end);
}
