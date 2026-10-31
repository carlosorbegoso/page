import { refreshProximity } from './proximity';
import { graphemes, splitWords, type SplitMode } from './split';

declare global {
  interface Window {
    __kinetic?: boolean;
  }
}

const ROOTS = '[data-kinetic], [data-kinetic-cascade], [data-kinetic-count]';
const COUNT_MS = 1400;
const COUNT_DELAY_MS = 220;
const SETTLE_FALLBACK_MS = 3200;

const html = document.documentElement;
const reducedQuery = matchMedia('(prefers-reduced-motion: reduce)');
const allowed = () => !reducedQuery.matches && html.dataset.motion !== 'paused';
const is3d = () => html.classList.contains('is-3d');

function buildSplit(el: HTMLElement, mode: SplitMode): void {
  const words = splitWords(el.textContent ?? '');
  if (!words.length) return;
  const label = document.createElement('span');
  label.className = 'sr-only select-none';
  label.textContent = words.map(w => w.text).join(' ');
  const visual = document.createElement('span');
  visual.className = 'kinetic__visual';
  visual.setAttribute('aria-hidden', 'true');
  let charStart = 0;
  words.forEach((word, index) => {
    const wrap = document.createElement('span');
    wrap.className = 'k-w';
    wrap.style.setProperty('--k-i', String(index));
    const parts = mode === 'chars' ? graphemes(word.text) : [word.text];
    parts.forEach((part, c) => {
      const unit = document.createElement('span');
      unit.className = mode === 'chars' ? 'k-i k-c' : 'k-i';
      if (mode === 'chars') {
        unit.style.setProperty('--k-c', String(charStart + c));
        unit.style.setProperty('--k-ci', String(c));
      }
      unit.textContent = part;
      wrap.append(unit);
    });
    charStart += parts.length;
    visual.append(wrap);
    if (index < words.length - 1) visual.append(' ');
  });
  el.classList.add('kinetic');
  el.dataset.kinetic = mode;
  el.replaceChildren(label, visual);
}

/** SectionHeader is owned by the UI layer, so its title and eyebrow are split here with the same markup KineticText emits. */
function enhanceSectionHeaders(): void {
  for (const title of document.querySelectorAll<HTMLElement>('[data-plate] header > h2:not([data-kinetic])')) {
    if (title.children.length === 0) buildSplit(title, 'chars');
  }
  for (const eyebrow of document.querySelectorAll<HTMLElement>(
    '[data-plate] header > p.uppercase:first-child:not([data-kinetic])'
  )) {
    if (eyebrow.children.length > 0) continue;
    buildSplit(eyebrow, 'chars');
    eyebrow.dataset.kineticVariant = 'type';
    eyebrow.toggleAttribute('data-kinetic-cursor', true);
  }
}

function indexCascades(): void {
  for (const list of document.querySelectorAll<HTMLElement>('[data-kinetic-cascade]')) {
    Array.from(list.children).forEach((child, i) => (child as HTMLElement).style.setProperty('--k-i', String(i)));
  }
}

/** Line index per word: staggers `lines` mode and gives each line its own depth in 3D. */
function measureLines(root: HTMLElement): void {
  const words = Array.from(root.querySelectorAll<HTMLElement>('.k-w'));
  const tops = words.map(word => word.offsetTop);
  const byLine = root.dataset.kinetic === 'lines';
  let line = -1;
  let previous = Number.NEGATIVE_INFINITY;
  tops.forEach((top, i) => {
    if (top > previous + 2) {
      line += 1;
      previous = top;
    }
    words[i]!.style.setProperty('--k-line', String(line));
    if (byLine) words[i]!.style.setProperty('--k-i', String(line));
  });
}

const counters = new WeakMap<HTMLElement, number>();

function finishCount(el: HTMLElement): void {
  const frame = counters.get(el);
  if (frame) cancelAnimationFrame(frame);
  counters.delete(el);
  el.textContent = el.dataset.kineticCount ?? el.textContent;
}

function runCount(el: HTMLElement): void {
  const target = Number(el.dataset.kineticCount);
  if (!Number.isFinite(target) || !allowed()) return finishCount(el);
  const start = performance.now() + COUNT_DELAY_MS;
  el.textContent = '0';
  const tick = (now: number) => {
    const t = Math.min(Math.max((now - start) / COUNT_MS, 0), 1);
    const eased = 1 - Math.pow(1 - t, 4);
    el.textContent = String(Math.round(target * eased));
    if (t < 1) counters.set(el, requestAnimationFrame(tick));
    else finishCount(el);
  };
  counters.set(el, requestAnimationFrame(tick));
}

const settleTimers = new WeakMap<HTMLElement, number>();

function settle(root: HTMLElement): void {
  window.clearTimeout(settleTimers.get(root));
  settleTimers.delete(root);
  if (root.dataset.reveal === 'in') root.toggleAttribute('data-settled', true);
}

function watchSettle(root: HTMLElement): void {
  if (root.dataset.kinetic === undefined) return;
  const units = root.querySelectorAll<HTMLElement>('.k-i');
  const last = units[units.length - 1];
  if (!last || !allowed()) return settle(root);
  const onEnd = (event: TransitionEvent) => {
    if (event.target !== last || event.propertyName !== 'opacity') return;
    last.removeEventListener('transitionend', onEnd);
    settle(root);
  };
  last.addEventListener('transitionend', onEnd);
  settleTimers.set(root, window.setTimeout(() => settle(root), SETTLE_FALLBACK_MS));
}

function revealRoot(root: HTMLElement, animate: boolean): void {
  if (root.dataset.reveal === 'in') return;
  if (root.dataset.kinetic && root.dataset.kinetic !== 'block') measureLines(root);
  root.dataset.reveal = 'in';
  if (root.dataset.kineticCount !== undefined) {
    if (animate) runCount(root);
    else finishCount(root);
  }
  if (animate) watchSettle(root);
  else settle(root);
}

function resetRoot(root: HTMLElement): void {
  if (root.dataset.reveal !== 'in') return;
  window.clearTimeout(settleTimers.get(root));
  delete root.dataset.reveal;
  root.removeAttribute('data-settled');
  if (root.dataset.kineticCount !== undefined) finishCount(root);
}

const groups = new Map<HTMLElement, HTMLElement[]>();

function collect(): void {
  for (const root of document.querySelectorAll<HTMLElement>(ROOTS)) {
    const owner = root.closest<HTMLElement>('[data-plate]') ?? root;
    const list = groups.get(owner) ?? [];
    list.push(root);
    groups.set(owner, list);
  }
}

function setLive(owner: HTMLElement, live: boolean): void {
  if (owner.hasAttribute('data-motion-live') === live) return;
  owner.toggleAttribute('data-motion-live', live);
  refreshProximity();
}

function setPlate(owner: HTMLElement, revealed: boolean, live: boolean): void {
  setLive(owner, live && allowed());
  const animate = allowed();
  for (const root of groups.get(owner) ?? []) {
    if (revealed) revealRoot(root, animate);
    else if (animate) resetRoot(root);
  }
}

function evaluate3d(owner: HTMLElement): void {
  const dormant = owner.hasAttribute('data-dormant');
  const active = owner.hasAttribute('data-active');
  const siblings = owner.parentElement ? Array.from(owner.parentElement.children) : [];
  const stationActive = active || siblings.some(el => el.hasAttribute('data-active'));
  if (dormant) setPlate(owner, false, false);
  else if (stationActive) setPlate(owner, true, active);
  else setLive(owner, false);
}

const intersection = new IntersectionObserver(
  entries => {
    if (is3d()) return;
    for (const entry of entries) {
      const owner = entry.target as HTMLElement;
      if (entry.isIntersecting) setPlate(owner, true, true);
      else setLive(owner, false);
    }
  },
  { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
);

const plateObserver = new MutationObserver(records => {
  if (!is3d()) return;
  const touched = new Set<HTMLElement>();
  for (const record of records) {
    const owner = record.target as HTMLElement;
    touched.add(owner);
    for (const sibling of owner.parentElement?.children ?? []) {
      if (groups.has(sibling as HTMLElement)) touched.add(sibling as HTMLElement);
    }
  }
  for (const owner of touched) if (groups.has(owner)) evaluate3d(owner);
});

let mode: '3d' | 'flat' | null = null;

function applyMode(): void {
  const next = is3d() ? '3d' : 'flat';
  if (next === mode) return;
  mode = next;
  for (const owner of groups.keys()) intersection.unobserve(owner);
  if (next === '3d') {
    for (const owner of groups.keys()) evaluate3d(owner);
  } else {
    for (const owner of groups.keys()) intersection.observe(owner);
  }
}

function revealEverything(): void {
  for (const [owner, roots] of groups) {
    setLive(owner, false);
    for (const root of roots) revealRoot(root, false);
  }
}

function syncMotion(): void {
  if (allowed()) {
    html.classList.add('k-armed');
    mode = null;
    applyMode();
  } else {
    html.classList.remove('k-armed');
    revealEverything();
  }
}

function boot(): void {
  window.__kinetic = true;
  const armedBeforePaint = html.classList.contains('k-armed');
  enhanceSectionHeaders();
  indexCascades();
  collect();
  if (!armedBeforePaint || !allowed()) revealEverything();
  syncMotion();

  for (const owner of groups.keys()) {
    if (owner.hasAttribute('data-plate')) {
      plateObserver.observe(owner, { attributes: true, attributeFilter: ['data-active', 'data-dormant'] });
    }
  }
  new MutationObserver(applyMode).observe(html, { attributes: true, attributeFilter: ['class'] });
  window.addEventListener('motion:toggle', syncMotion);
  reducedQuery.addEventListener('change', syncMotion);
}

boot();
