import { reducedMotion } from './dom';

const LIFETIME_MS = 900;

export function ripple(event: PointerEvent, root: HTMLElement): void {
  if (reducedMotion() || event.button !== 0) return;
  const target = (event.target as Element).closest<HTMLElement>('a[href], button');
  if (!target || !root.contains(target)) return;
  const rect = target.getBoundingClientRect();
  const scale = rect.width / target.offsetWidth || 1;
  const size = Math.max(target.offsetWidth, target.offsetHeight) * 2;
  const wave = document.createElement('span');
  wave.className = 'phone-ripple';
  wave.setAttribute('aria-hidden', 'true');
  Object.assign(wave.style, {
    width: `${size}px`,
    height: `${size}px`,
    left: `${(event.clientX - rect.left) / scale - size / 2}px`,
    top: `${(event.clientY - rect.top) / scale - size / 2}px`
  });
  target.append(wave);
  wave.addEventListener('animationend', () => wave.remove(), { once: true });
  window.setTimeout(() => wave.remove(), LIFETIME_MS);
}
