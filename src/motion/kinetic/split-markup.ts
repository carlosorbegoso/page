import { graphemes, splitWords, type SplitMode } from '../split';

export function buildSplit(el: HTMLElement, mode: SplitMode): void {
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
export function enhanceSectionHeaders(): void {
  for (const title of document.querySelectorAll<HTMLElement>('[data-plate] header > h2:not([data-kinetic])')) {
    if (title.children.length === 0) buildSplit(title, 'chars');
  }
  for (const eyebrow of document.querySelectorAll<HTMLElement>(
    '[data-plate] header > p.uppercase:first-child:not([data-kinetic])'
  )) {
    if (eyebrow.children.length > 0) continue;
    buildSplit(eyebrow, 'chars');
    eyebrow.dataset.kineticVariant = 'type';
    eyebrow.dataset.kineticSilent = '';
    eyebrow.toggleAttribute('data-kinetic-cursor', true);
  }
}

export function indexCascades(): void {
  for (const list of document.querySelectorAll<HTMLElement>('[data-kinetic-cascade]')) {
    Array.from(list.children).forEach((child, i) => (child as HTMLElement).style.setProperty('--k-i', String(i)));
  }
}

/** Line index per word: staggers `lines` mode and gives each line its own depth in 3D. */
export function measureLines(root: HTMLElement): void {
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
