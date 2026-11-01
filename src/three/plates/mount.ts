import { CSS3DObject, type CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';
import type { ChapterId, PlateMode } from '../contracts';
import { chapterElement, SECTION_CHAPTERS } from '../sections';
import type { Origin, PlateEntry } from './types';

const MODES: readonly PlateMode[] = ['surface-monitor', 'surface-phone', 'anchored'];

/** Plates without a valid `data-plate-mode` are anchored (same default as plates.css). */
function plateMode(el: HTMLElement): PlateMode {
  const value = el.dataset.plateMode as PlateMode | undefined;
  return value && MODES.includes(value) ? value : 'anchored';
}

/** Explicit `data-plate-sub` (absent = every sub-shot) when any plate of the chapter has one, else one sub-shot per plate. */
function plateSub(el: HTMLElement, index: number, explicitSubs: boolean): number | null {
  if (!explicitSubs) return index;
  return el.dataset.plateSub === undefined ? null : Number(el.dataset.plateSub);
}

export function styleLayers(surfaceRoot: HTMLElement, panels: HTMLElement): void {
  surfaceRoot.classList.add('stage-surfaces');
  surfaceRoot.dataset.stageSurfaces = '';
  panels.className = 'stage-panels';
  panels.dataset.stagePanels = '';
  for (const layer of [surfaceRoot, panels]) {
    Object.assign(layer.style, { position: 'fixed', inset: '0', zIndex: 'var(--z-content)', pointerEvents: 'none' });
  }
  panels.style.overflow = 'hidden';
}

/** Wraps a plate in the element the engine moves, remembering where the plate came from. */
export function wrapPlate(el: HTMLElement, chapter: ChapterId, sub: number | null, origins: Origin[]): PlateEntry {
  origins.push({ plate: el, parent: el.parentNode!, next: el.nextSibling });
  const wrapper = document.createElement('div');
  wrapper.dataset.plateWrapper = el.dataset.plateId ?? '';
  wrapper.dataset.plateChapter = chapter;
  wrapper.append(el);
  return { el, chapter, mode: plateMode(el), sub, wrapper, written: {} };
}

export function prepareAnchoredPanel(entry: PlateEntry): void {
  entry.wrapper.className = 'stage-panels__panel';
  entry.wrapper.style.cssText = 'position:absolute;left:0;top:0;width:var(--plate-width);will-change:transform';
  entry.anchorName = entry.el.dataset.plateAnchor;
  const side = entry.el.dataset.plateSide;
  entry.side = side === 'left' || side === 'right' ? side : undefined;
}

export function prepareSurfacePlate(entry: PlateEntry, css3d: CSS3DRenderer): CSS3DObject {
  entry.wrapper.className = 'stage-surfaces__plate';
  entry.object = new CSS3DObject(entry.wrapper);
  css3d.domElement.firstElementChild?.firstElementChild?.appendChild(entry.wrapper);
  return entry.object;
}

/** Each section with plates, its plates and their sub-shots, in story order. */
export function sectionPlates(): { chapter: ChapterId; section: HTMLElement; plates: { el: HTMLElement; sub: number | null }[] }[] {
  const found = [];
  for (const chapter of SECTION_CHAPTERS) {
    const section = chapterElement(chapter);
    if (!section) continue;
    const els = [...section.querySelectorAll<HTMLElement>('[data-plate]')];
    if (!els.length) continue;
    const explicitSubs = els.some(el => el.dataset.plateSub !== undefined);
    found.push({ chapter, section, plates: els.map((el, index) => ({ el, sub: plateSub(el, index, explicitSubs) })) });
  }
  return found;
}

export function restorePlates(origins: readonly Origin[]): void {
  for (const { plate, parent, next } of [...origins].reverse()) {
    plate.removeAttribute('data-active');
    plate.removeAttribute('data-dormant');
    plate.style.removeProperty('--surface-width');
    plate.style.removeProperty('--surface-height');
    parent.insertBefore(plate, next && next.parentNode === parent ? next : null);
  }
}

export function releaseSpacers(): void {
  for (const chapter of SECTION_CHAPTERS) {
    const section = chapterElement(chapter);
    if (!section) continue;
    delete section.dataset.stationSpacer;
    section.style.removeProperty('scroll-margin-top');
  }
}
