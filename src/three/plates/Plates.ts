import { Scene, type PerspectiveCamera } from 'three';
import { CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';
import type { ChapterId, ChapterState, SurfaceName } from '../contracts';
import { chapterElement, isChapterId, SECTION_CHAPTERS } from '../sections';
import { placePanelBox, placeSurfacePlate } from './anchoring';
import { prepareAnchoredPanel, prepareSurfacePlate, releaseSpacers, restorePlates, sectionPlates, styleLayers, wrapPlate } from './mount';
import { clipPanel, markScrollEdge } from './overflow';
import { measureSafeArea, panelRoom } from './safe-area';
import { tabInStoryOrder } from './tab-order';
import type { Origin, PlateEntry, PlateHost, SafeInsets } from './types';

/**
 * Text in 3D mode, in two layers (PLAN, final direction):
 * - `surface-*` plates: CSS3D on the monitor / phone surface, frontal, 1:1, never animated.
 * - `anchored` plates: HTML panels in a fixed 2D layer, translated (never rotated or scaled) to the
 *   screen projection of their anchor.
 * Plates of the current chapter get `data-active` once the camera settles. Neighbouring chapters
 * stay focusable but transparent (Tab into them scrolls there); the rest get `data-dormant`.
 * Section elements stay as scroll spacers (`data-station-spacer`).
 */
export class Plates {
  readonly css3d = new CSS3DRenderer();
  readonly scene = new Scene();
  readonly panels = document.createElement('div');
  private readonly entries: PlateEntry[] = [];
  private readonly origins: Origin[] = [];
  private width = 1;
  private height = 1;
  private safe: SafeInsets = { top: 0, bottom: 0 };
  private readonly sizes = new ResizeObserver(records => this.resized(records));
  private readonly byPlate = new Map<Element, PlateEntry>();
  private readonly onFocusIn = (event: FocusEvent) => this.focusIn(event);
  private readonly onKeyDown = (event: KeyboardEvent) => tabInStoryOrder(event, this.entries, (chapter, sub) => this.host.scrollTo(chapter, sub));

  constructor(private readonly host: PlateHost) {}

  /** Moves every moded plate into its layer. Returns false when the page has none. */
  mount(): boolean {
    this.safe = measureSafeArea();
    styleLayers(this.css3d.domElement, this.panels);
    for (const { chapter, section, plates } of sectionPlates()) {
      for (const { el, sub } of plates) this.adopt(wrapPlate(el, chapter, sub, this.origins));
      section.dataset.stationSpacer = '';
      section.style.scrollMarginTop = '0px';
    }
    if (!this.entries.length) return false;
    this.insertLayers();
    return true;
  }

  private adopt(entry: PlateEntry): void {
    if (entry.mode === 'anchored') {
      prepareAnchoredPanel(entry);
      this.panels.append(entry.wrapper);
      this.byPlate.set(entry.el, entry);
      this.sizes.observe(entry.el);
      entry.wrapper.addEventListener('scroll', () => markScrollEdge(entry.wrapper), { passive: true });
    } else {
      this.scene.add(prepareSurfacePlate(entry, this.css3d));
    }
    this.entries.push(entry);
  }

  private insertLayers(): void {
    const surfaceRoot = this.css3d.domElement;
    const first = chapterElement(SECTION_CHAPTERS[0]!) ?? document.querySelector('main');
    first?.parentElement?.insertBefore(surfaceRoot, first);
    first?.parentElement?.insertBefore(this.panels, first);
    document.documentElement.classList.add('is-3d');
    document.documentElement.style.scrollPaddingTop = '0px';
    for (const layer of [surfaceRoot, this.panels]) layer.addEventListener('focusin', this.onFocusIn);
    for (const layer of [surfaceRoot, this.panels]) layer.addEventListener('keydown', this.onKeyDown);
  }

  /** Puts every plate back where it was (degradation to the static page). */
  unmount(): void {
    this.sizes.disconnect();
    this.byPlate.clear();
    restorePlates(this.origins);
    releaseSpacers();
    this.css3d.domElement.remove();
    this.panels.remove();
    document.documentElement.classList.remove('is-3d');
    document.documentElement.style.removeProperty('scroll-padding-top');
  }

  /** Sub-shots implied by the plates of a chapter (explicit `data-plate-sub`, else one per plate). */
  subCount(chapter: ChapterId): number {
    const subs = this.entries.filter(e => e.chapter === chapter && e.sub !== null).map(e => e.sub!);
    return subs.length ? Math.max(...subs) + 1 : 1;
  }

  setSize(width: number, height: number): void {
    if (width === this.width && height === this.height) return;
    const first = this.width === 1 && this.height === 1;
    this.width = width;
    this.height = height;
    if (!first) this.safe = measureSafeArea();
    this.css3d.setSize(width, height);
  }

  private resized(records: ResizeObserverEntry[]): void {
    for (const record of records) {
      const entry = this.byPlate.get(record.target);
      if (!entry) continue;
      const box = record.borderBoxSize?.[0];
      entry.size = box
        ? { width: Math.round(box.inlineSize), height: Math.round(box.blockSize) }
        : { width: entry.el.offsetWidth, height: entry.el.offsetHeight };
    }
    this.host.invalidate();
  }

  /** Visibility, flags and placement for the current chapter state. */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Stage still passes the chapter progress; panels no longer scroll with it.
  update(camera: PerspectiveCamera, state: ChapterState, _progress?: number): void {
    const currentIndex = SECTION_CHAPTERS.indexOf(state.id);
    for (const entry of this.entries) {
      if (entry.mode === 'anchored' && !entry.size) entry.size = { width: entry.el.offsetWidth, height: entry.el.offsetHeight };
    }
    for (const entry of this.entries) {
      const current = entry.chapter === state.id && (entry.sub === null || entry.sub === state.subIndex);
      const gap = Math.abs(SECTION_CHAPTERS.indexOf(entry.chapter) - currentIndex);
      this.flag(entry, current, current && state.settled, gap);
      if (entry.mode === 'anchored') this.placePanel(entry, camera, current);
      else this.placeSurface(entry, camera);
    }
  }

  private flag(entry: PlateEntry, current: boolean, active: boolean, gap: number): void {
    const { written } = entry;
    entry.el.toggleAttribute('data-active', active);
    entry.el.toggleAttribute('data-dormant', !current && gap > 1);
    const opacity = current ? '' : '0';
    if (written.opacity !== opacity) entry.wrapper.style.opacity = written.opacity = opacity;
    const pointer = active ? 'auto' : 'none';
    if (written.pointer !== pointer) entry.wrapper.style.pointerEvents = written.pointer = pointer;
  }

  private placeSurface(entry: PlateEntry, camera: PerspectiveCamera): void {
    const name: SurfaceName = entry.mode === 'surface-phone' ? 'phone' : 'monitor';
    placeSurfacePlate(entry, this.host.surface(name), camera, this.height);
  }

  private placePanel(entry: PlateEntry, camera: PerspectiveCamera, current: boolean): void {
    if (!current) return;
    const world = entry.anchorName ? this.host.anchor(entry.anchorName) : null;
    const view = { width: this.width, height: this.height };
    const { x, y, shown, overflow } = placePanelBox(entry, world, camera, view, panelRoom(view, this.safe));
    const inset = overflow > 0 ? Math.round(x) : 0;
    const transform = `translate3d(${Math.round(x) - inset}px, ${Math.round(y)}px, 0)`;
    if (entry.written.transform !== transform) entry.wrapper.style.transform = entry.written.transform = transform;
    clipPanel(entry, overflow > 0 ? Math.floor(shown) : 0, inset, this.width);
  }

  private focusIn(event: FocusEvent): void {
    const wrapper = (event.target as Element | null)?.closest<HTMLElement>('[data-plate-wrapper]');
    const chapter = wrapper?.dataset.plateChapter;
    if (!wrapper || !isChapterId(chapter)) return;
    const entry = this.entries.find(e => e.wrapper === wrapper);
    this.host.scrollTo(chapter, entry?.sub ?? 0);
  }

  render(camera: PerspectiveCamera): void {
    this.css3d.render(this.scene, camera);
  }

  dispose(): void {
    this.unmount();
  }
}
