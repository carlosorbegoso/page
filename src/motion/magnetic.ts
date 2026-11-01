const MAX_X = 6;
const MAX_Y = 4;

const html = document.documentElement;
const finePointer = matchMedia('(pointer: fine)');
const reducedQuery = matchMedia('(prefers-reduced-motion: reduce)');
const enabled = () => finePointer.matches && !reducedQuery.matches && html.dataset.motion !== 'paused';

function bind(button: HTMLElement): void {
  const inner = button.querySelector<HTMLElement>('[data-magnetic-inner]');
  if (!inner) return;
  let rect: DOMRect | null = null;
  let frame = 0;
  let x = 0;
  let y = 0;

  const write = () => {
    frame = 0;
    if (!rect) return;
    const dx = Math.max(-1, Math.min(1, (x - (rect.left + rect.width / 2)) / (rect.width / 2)));
    const dy = Math.max(-1, Math.min(1, (y - (rect.top + rect.height / 2)) / (rect.height / 2)));
    inner.style.setProperty('--mx', `${(dx * MAX_X).toFixed(2)}px`);
    inner.style.setProperty('--my', `${(dy * MAX_Y).toFixed(2)}px`);
  };

  const release = () => {
    rect = null;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    inner.style.removeProperty('--mx');
    inner.style.removeProperty('--my');
  };

  button.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'mouse' || !enabled()) return;
    rect = button.getBoundingClientRect();
  });
  button.addEventListener('pointermove', event => {
    if (!rect) return;
    x = event.clientX;
    y = event.clientY;
    if (!frame) frame = requestAnimationFrame(write);
  });
  button.addEventListener('pointerleave', release);
  window.addEventListener('motion:toggle', release);
}

for (const button of document.querySelectorAll<HTMLElement>('[data-magnetic]')) bind(button);
