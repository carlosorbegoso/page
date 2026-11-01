import type { FolderId } from '../layout';
import { SPINE_TEXT } from '../spines';

export interface SheetContent {
  company: string;
  years: string;
  role: string;
  highlightsTitle: string;
  highlights: string[];
  stackTitle: string;
  stack: string[];
}

function plainText(node: Element | null): string {
  if (!node) return '';
  const copy = node.cloneNode(true) as Element;
  for (const hidden of copy.querySelectorAll('[aria-hidden="true"]')) hidden.remove();
  return (copy.textContent ?? '').replace(/\s+/g, ' ').trim();
}

/** Reads the job's highlights and stack from its experience plate, so the sheet never drifts from the content. */
export function readPlate(folder: FolderId, experience: string): SheetContent {
  const plate = document.querySelector<HTMLElement>(`[data-plate][data-experience="${CSS.escape(experience)}"]`);
  const [spineName, years] = SPINE_TEXT[folder];
  const english = document.documentElement.lang.startsWith('en');
  const items = (selector: string) => [...(plate?.querySelectorAll(selector) ?? [])].map(plainText).filter(Boolean);
  return {
    company: plainText(plate?.querySelector('h3') ?? null) || spineName,
    years,
    role: plainText(plate?.querySelector('h3 + p') ?? null),
    highlightsTitle: plainText(plate?.querySelector('p[id$="-highlights"]') ?? null) || (english ? 'Highlights' : 'Logros'),
    highlights: items('ul.list-disc > li').slice(0, 3),
    stackTitle: plainText(plate?.querySelector('p[id$="-stack"]') ?? null) || (english ? 'Tech' : 'Tecnologías'),
    stack: items('[data-kinetic-cascade] > li')
  };
}
