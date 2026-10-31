const MAX_UNITS = 200;
const STIFFNESS = 170;
const DAMPING = 19;
const RIPPLE_RADIUS = 220;
const WAVE_COOLDOWN_MS = 900;

interface Profile {
  radius: number;
  lift: number;
  spread: number;
  scale: number;
}

/* No translateZ on purpose: a unit pushed off its layer's plane can sort behind the plate's dark pool on stations whose CSS3D matrix is mirrored. */
const CHARS: Profile = { radius: 90, lift: 4, spread: 2, scale: 0.08 };
/** Only short headlines react letter by letter; body text stays still so it can be read. */
const MAX_HEADLINE_CHARS = 32;

interface Unit {
  el: HTMLElement;
  /** Centre inside its word box, in layout px (transforms excluded). */
  ux: number;
  uy: number;
  f: number;
  v: number;
  dir: number;
  profile: Profile;
  written: boolean;
}

interface Word {
  el: HTMLElement;
  width: number;
  height: number;
  units: Unit[];
}

const html = document.documentElement;
const finePointer = matchMedia('(pointer: fine)');
const motionOn = () => html.classList.contains('k-armed') && !html.hasAttribute('data-chapter-moving');

let words: Word[] = [];
let pointerX = Number.POSITIVE_INFINITY;
let pointerY = Number.POSITIVE_INFINITY;
let lastMove = 0;
let frame = 0;
let lastTime = 0;
let stale = true;

function collect(): void {
  stale = false;
  for (const word of words) for (const unit of word.units) clear(unit);
  words = [];
  let budget = MAX_UNITS;
  const roots = Array.from(
    document.querySelectorAll<HTMLElement>(
      '[data-motion-live] .kinetic[data-kinetic="chars"]:not([data-kinetic-variant="type"])'
    )
  ).filter(root => root.querySelectorAll('.k-c').length <= MAX_HEADLINE_CHARS);
  for (const root of roots) {
    const profile = CHARS;
    for (const el of root.querySelectorAll<HTMLElement>('.k-w')) {
      const unitEls = Array.from(el.querySelectorAll<HTMLElement>('.k-i'));
      if (budget < unitEls.length) return;
      budget -= unitEls.length;
      words.push({
        el,
        width: el.offsetWidth || 1,
        height: el.offsetHeight || 1,
        units: unitEls.map(unit => ({
          el: unit,
          ux: unit.offsetLeft + unit.offsetWidth / 2,
          uy: unit.offsetTop + unit.offsetHeight / 2,
          f: 0,
          v: 0,
          dir: 0,
          profile,
          written: false
        }))
      });
    }
  }
}

function clear(unit: Unit): void {
  unit.f = 0;
  unit.v = 0;
  if (unit.written) unit.el.style.removeProperty('transform');
  unit.written = false;
}

/** Projected (CSS3D-aware) centres of every unit, read in one batch before any write. */
function centres(): Array<{ unit: Unit; x: number; y: number }> {
  const out: Array<{ unit: Unit; x: number; y: number }> = [];
  for (const word of words) {
    const rect = word.el.getBoundingClientRect();
    const sx = rect.width / word.width;
    const sy = rect.height / word.height;
    for (const unit of word.units) out.push({ unit, x: rect.left + unit.ux * sx, y: rect.top + unit.uy * sy });
  }
  return out;
}

function tick(now: number): void {
  frame = 0;
  const dt = Math.min((now - lastTime) / 1000 || 1 / 60, 1 / 30);
  lastTime = now;
  if (stale) collect();
  const tracking = finePointer.matches && motionOn() && now - lastMove < 4000;
  let moving = false;
  for (const { unit, x, y } of centres()) {
    const { radius } = unit.profile;
    let target = 0;
    if (tracking) {
      const distance = Math.hypot(x - pointerX, y - pointerY);
      const near = Math.max(0, 1 - distance / radius);
      target = near * near * (3 - 2 * near);
      if (target > 0) unit.dir = Math.max(-1, Math.min(1, (x - pointerX) / radius));
    }
    unit.v += ((target - unit.f) * STIFFNESS - unit.v * DAMPING) * dt;
    unit.f += unit.v * dt;
    if (Math.abs(unit.f) < 0.002 && Math.abs(unit.v) < 0.002 && target === 0) {
      clear(unit);
      continue;
    }
    moving = true;
    const { lift, spread, scale } = unit.profile;
    const f = unit.f;
    unit.el.style.transform = `translate(${(unit.dir * spread * f).toFixed(2)}px, ${(-lift * f).toFixed(2)}px) scale(${(1 + scale * f).toFixed(4)})`;
    unit.written = true;
  }
  if (moving || tracking) frame = requestAnimationFrame(tick);
}

function wake(): void {
  if (!frame) {
    lastTime = performance.now();
    frame = requestAnimationFrame(tick);
  }
}

function ripple(x: number, y: number): void {
  if (stale) collect();
  for (const { unit, x: ux, y: uy } of centres()) {
    const distance = Math.hypot(ux - x, uy - y);
    if (distance > RIPPLE_RADIUS) continue;
    const strength = 1 - distance / RIPPLE_RADIUS;
    unit.el.animate(
      [{ translate: '0 0' }, { translate: `0 ${(-0.16 * strength).toFixed(3)}em`, offset: 0.35 }, { translate: '0 0' }],
      { duration: 680, delay: distance * 1.6, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', composite: 'add' }
    );
  }
}

const waved = new WeakMap<HTMLElement, number>();

function wave(heading: HTMLElement): void {
  const now = performance.now();
  if (now - (waved.get(heading) ?? -Infinity) < WAVE_COOLDOWN_MS) return;
  waved.set(heading, now);
  heading.querySelectorAll<HTMLElement>('.kinetic[data-kinetic="chars"] .k-i').forEach((char, i) => {
    char.animate(
      [{ translate: '0 0' }, { translate: '0 -0.14em', offset: 0.4 }, { translate: '0 0' }],
      { duration: 620, delay: i * 28, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', composite: 'add' }
    );
  });
}

/** Called when the set of live plates changes. */
export function refreshProximity(): void {
  stale = true;
  if (words.length) wake();
}

window.addEventListener(
  'pointermove',
  event => {
    if (event.pointerType !== 'mouse') return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    lastMove = performance.now();
    if (motionOn() && finePointer.matches) wake();
  },
  { passive: true }
);

document.addEventListener('pointerout', event => {
  if (event.relatedTarget) return;
  pointerX = pointerY = Number.POSITIVE_INFINITY;
  wake();
});

document.addEventListener(
  'pointerdown',
  event => {
    if (event.pointerType === 'mouse' || !motionOn()) return;
    if (!(event.target as Element | null)?.closest('[data-motion-live]')) return;
    ripple(event.clientX, event.clientY);
  },
  { passive: true }
);

document.addEventListener('pointerover', event => {
  if (event.pointerType !== 'mouse' || !motionOn()) return;
  const heading = (event.target as Element | null)?.closest<HTMLElement>('[data-plate] :is(h2, h3)');
  if (heading && !heading.contains(event.relatedTarget as Node | null)) wave(heading);
});

window.addEventListener('resize', () => (stale = true), { passive: true });
window.addEventListener('motion:toggle', () => {
  for (const word of words) for (const unit of word.units) clear(unit);
  wake();
});
