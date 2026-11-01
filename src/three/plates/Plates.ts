import { Scene, Vector3, type PerspectiveCamera } from 'three';
import { CSS3DObject, CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';
import type { ChapterId, ChapterState, PlateAnchor, PlateMode, SurfaceName } from '../contracts';
import { layoutKind } from '../scenes/common';
import { chapterElement, isChapterId, SECTION_CHAPTERS } from '../sections';

interface Origin {
  plate: HTMLElement;
  parent: Node;
  next: Node | null;
}

interface PlateEntry {
  el: HTMLElement;
  chapter: ChapterId;
  mode: PlateMode;
  /** Sub-shot the plate belongs to, or null = every sub-shot of its chapter. */
  sub: number | null;
  /** Wrapper the engine moves (CSS3DObject element or 2D panel); the plate itself is never transformed. */
  wrapper: HTMLElement;
  object?: CSS3DObject;
  anchorName?: string;
  side?: 'left' | 'right';
  /** Natural border-box size of an anchored plate, kept by a ResizeObserver so placement never reads layout. */
  size?: { width: number; height: number };
  /** Last values written, so a settled frame touches no style. */
  written: { opacity?: string; pointer?: string; transform?: string; surface?: string; clip?: string };
}

export interface PlateHost {
  surface(name: SurfaceName): PlateAnchor | null;
  anchor(name: string): Vector3 | null;
  /** Scrolls the page to a chapter / sub-shot (used when keyboard focus enters a plate). */
  scrollTo(chapter: ChapterId, sub: number): void;
  reduced(): boolean;
  /** Requests a frame (a panel changed size while the loop was idle). */
  invalidate(): void;
}

const MODES: readonly PlateMode[] = ['surface-monitor', 'surface-phone', 'anchored'];
const PANEL_GAP = 32;
const SAFE_LEFT = 24;
/** Keeps panels off the right edge (HUD / scrollbar). */
const SAFE_RIGHT = 120;
const SAFE_Y = 24;
/** Clear of the HUD row and the top letterbox bar: a panel never starts under the story clock. */
const SAFE_TOP_MIN = 84;
const SAFE_TOP_SHARE = 0.11;
/** Touch HUD: tap-sized row at max(0.5rem, safe-area-inset-top), plus a breathing gap below it. */
const HUD_TOP_TOUCH = 8;
const HUD_CLEARANCE_TOUCH = 62;

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

/** Plates without a valid `data-plate-mode` are anchored (same default as plates.css). */
function plateMode(el: HTMLElement): PlateMode {
  const value = el.dataset.plateMode as PlateMode | undefined;
  return value && MODES.includes(value) ? value : 'anchored';
}

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
  private safeBottom = 0;
  private safeTop = 0;
  private readonly sizes = new ResizeObserver(records => this.resized(records));
  private readonly byPlate = new Map<Element, PlateEntry>();
  private readonly onFocusIn = (event: FocusEvent) => this.focusIn(event);
  private readonly onKeyDown = (event: KeyboardEvent) => this.tabInStoryOrder(event);

  constructor(private readonly host: PlateHost) {}

  /** Moves every moded plate into its layer. Returns false when the page has none. */
  mount(): boolean {
    this.measureSafeArea();
    const surfaceRoot = this.css3d.domElement;
    surfaceRoot.classList.add('stage-surfaces');
    surfaceRoot.dataset.stageSurfaces = '';
    this.panels.className = 'stage-panels';
    this.panels.dataset.stagePanels = '';
    for (const layer of [surfaceRoot, this.panels]) {
      Object.assign(layer.style, { position: 'fixed', inset: '0', zIndex: 'var(--z-content)', pointerEvents: 'none' });
    }
    this.panels.style.overflow = 'hidden';
    const cameraElement = surfaceRoot.firstElementChild?.firstElementChild;
    for (const chapter of SECTION_CHAPTERS) {
      const section = chapterElement(chapter);
      if (!section) continue;
      const plates = [...section.querySelectorAll<HTMLElement>('[data-plate]')];
      if (!plates.length) continue;
      const explicitSubs = plates.some(el => el.dataset.plateSub !== undefined);
      plates.forEach((el, index) => {
        const mode = plateMode(el);
        this.origins.push({ plate: el, parent: el.parentNode!, next: el.nextSibling });
        const sub = explicitSubs
          ? el.dataset.plateSub === undefined
            ? null
            : Number(el.dataset.plateSub)
          : index;
        const wrapper = document.createElement('div');
        wrapper.dataset.plateWrapper = el.dataset.plateId ?? '';
        wrapper.dataset.plateChapter = chapter;
        wrapper.append(el);
        const entry: PlateEntry = { el, chapter, mode, sub, wrapper, written: {} };
        if (mode === 'anchored') {
          wrapper.className = 'stage-panels__panel';
          wrapper.style.cssText = 'position:absolute;left:0;top:0;width:var(--plate-width);will-change:transform';
          entry.anchorName = el.dataset.plateAnchor;
          const side = el.dataset.plateSide;
          entry.side = side === 'left' || side === 'right' ? side : undefined;
          this.panels.append(wrapper);
          this.byPlate.set(el, entry);
          this.sizes.observe(el);
          wrapper.addEventListener('scroll', () => this.markScrollEdge(wrapper), { passive: true });
        } else {
          wrapper.className = 'stage-surfaces__plate';
          entry.object = new CSS3DObject(wrapper);
          this.scene.add(entry.object);
          cameraElement?.appendChild(wrapper);
        }
        this.entries.push(entry);
      });
      section.dataset.stationSpacer = '';
      section.style.scrollMarginTop = '0px';
    }
    if (!this.entries.length) return false;
    const first = chapterElement(SECTION_CHAPTERS[0]!) ?? document.querySelector('main');
    first?.parentElement?.insertBefore(surfaceRoot, first);
    first?.parentElement?.insertBefore(this.panels, first);
    document.documentElement.classList.add('is-3d');
    document.documentElement.style.scrollPaddingTop = '0px';
    surfaceRoot.addEventListener('focusin', this.onFocusIn);
    this.panels.addEventListener('focusin', this.onFocusIn);
    surfaceRoot.addEventListener('keydown', this.onKeyDown);
    this.panels.addEventListener('keydown', this.onKeyDown);
    return true;
  }

  /** Puts every plate back where it was (degradation to the static page). */
  unmount(): void {
    this.sizes.disconnect();
    this.byPlate.clear();
    for (const { plate, parent, next } of [...this.origins].reverse()) {
      plate.removeAttribute('data-active');
      plate.removeAttribute('data-dormant');
      plate.style.removeProperty('--surface-width');
      plate.style.removeProperty('--surface-height');
      parent.insertBefore(plate, next && next.parentNode === parent ? next : null);
    }
    for (const chapter of SECTION_CHAPTERS) {
      const section = chapterElement(chapter);
      if (!section) continue;
      delete section.dataset.stationSpacer;
      section.style.removeProperty('scroll-margin-top');
    }
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
    if (!first) this.measureSafeArea();
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
      const { written } = entry;
      const active = current && state.settled;
      entry.el.toggleAttribute('data-active', active);
      entry.el.toggleAttribute('data-dormant', !current && gap > 1);
      const opacity = current ? '' : '0';
      if (written.opacity !== opacity) entry.wrapper.style.opacity = written.opacity = opacity;
      const pointer = active ? 'auto' : 'none';
      if (written.pointer !== pointer) entry.wrapper.style.pointerEvents = written.pointer = pointer;
      if (entry.mode === 'anchored') this.placePanel(entry, camera, current);
      else this.placeSurface(entry, camera);
    }
  }

  private placeSurface(entry: PlateEntry, camera: PerspectiveCamera): void {
    const name: SurfaceName = entry.mode === 'surface-phone' ? 'phone' : 'monitor';
    const anchor = this.host.surface(name);
    const object = entry.object!;
    if (!anchor) {
      object.visible = false;
      return;
    }
    object.visible = true;
    object.position.copy(anchor.position);
    object.quaternion.copy(anchor.quaternion);
    const distance = anchor.position.distanceTo(camera.position);
    const scale = anchor.scale ?? (2 * distance * Math.tan((camera.fov * Math.PI) / 360)) / this.height;
    object.scale.setScalar(scale);
    if (anchor.size) {
      const width = `${Math.round(anchor.size.width / scale)}px`;
      const height = `${Math.round(anchor.size.height / scale)}px`;
      const surface = `${width} ${height}`;
      if (entry.written.surface !== surface) {
        entry.written.surface = surface;
        entry.el.style.setProperty('--surface-width', width);
        entry.el.style.setProperty('--surface-height', height);
      }
    }
  }

  private placePanel(entry: PlateEntry, camera: PerspectiveCamera, current: boolean): void {
    if (!current) return;
    const world = entry.anchorName ? this.host.anchor(entry.anchorName) : null;
    const width = entry.size?.width || 480;
    const height = entry.size?.height || 300;
    let x: number;
    let y: number;
    const projected = world ? world.clone().project(camera) : null;
    const ax = projected ? ((projected.x + 1) / 2) * this.width : this.width / 2;
    const ay = projected ? ((1 - projected.y) / 2) * this.height : this.height / 2;
    const desktop = layoutKind(this.width) === 'desktop';
    const top = desktop
      ? Math.max(SAFE_TOP_MIN, this.height * SAFE_TOP_SHARE)
      : Math.max(HUD_TOP_TOUCH, this.safeTop) + HUD_CLEARANCE_TOUCH;
    const bottom = desktop
      ? this.height - Math.max(SAFE_Y * 2, this.height * 0.06, SAFE_Y + this.safeBottom)
      : this.height - SAFE_Y - this.safeBottom;
    const room = Math.max(bottom - top, 0);
    const shown = Math.min(height, room);
    const overflow = height - shown;
    if (desktop) {
      const side = entry.side ?? (ax > this.width / 2 ? 'left' : 'right');
      x = side === 'left' ? ax - PANEL_GAP - width : ax + PANEL_GAP;
      x = Math.min(Math.max(x, SAFE_LEFT), this.width - SAFE_RIGHT - width);
      y = Math.min(Math.max(ay - height / 2, top), bottom - shown);
    } else {
      x = (this.width - width) / 2;
      const preferred = Math.max(ay + this.height * 0.1, this.height * 0.42);
      y = Math.max(Math.min(preferred, bottom - shown), top);
    }
    const inset = overflow > 0 ? Math.round(x) : 0;
    const transform = `translate3d(${Math.round(x) - inset}px, ${Math.round(y)}px, 0)`;
    if (entry.written.transform !== transform) entry.wrapper.style.transform = entry.written.transform = transform;
    this.clipPanel(entry, overflow > 0 ? Math.floor(shown) : 0, inset);
  }

  /**
   * A panel taller than the room between the HUD and the bottom edge is clipped to that room and
   * scrolls inside it (the page snaps from shot to shot, so page scroll can never reveal it), so it
   * never slides under the HUD. The clipped wrapper spans the full width (plate kept in place by
   * `inset`) so the side edges of the text pool are not cut.
   */
  private clipPanel(entry: PlateEntry, maxHeight: number, inset: number): void {
    const { wrapper, written } = entry;
    const clip = maxHeight ? `${maxHeight}px ${inset}px` : '';
    if (written.clip !== clip) {
      written.clip = clip;
      Object.assign(wrapper.style, {
        maxHeight: maxHeight ? `${maxHeight}px` : '',
        width: maxHeight ? `${this.width}px` : 'var(--plate-width)',
        paddingLeft: maxHeight ? `${inset}px` : ''
      });
      if (clip) this.markScrollEdge(wrapper);
      else delete wrapper.dataset.plateOverflow;
    }
  }

  private markScrollEdge(wrapper: HTMLElement): void {
    if (!wrapper.style.maxHeight) return;
    const end = wrapper.scrollHeight - wrapper.clientHeight;
    const edge = wrapper.scrollTop <= 1 ? 'start' : wrapper.scrollTop >= end - 1 ? 'end' : 'middle';
    if (wrapper.dataset.plateOverflow !== edge) wrapper.dataset.plateOverflow = edge;
  }

  /** `env(safe-area-inset-top/bottom)` in px (notch, home indicator on iOS), resolved by style alone: no layout pass. */
  private measureSafeArea(): void {
    const probe = document.createElement('div');
    probe.style.cssText =
      'position:fixed;top:0;padding-top:env(safe-area-inset-top, 0px);padding-bottom:env(safe-area-inset-bottom, 0px);visibility:hidden;pointer-events:none';
    document.body.append(probe);
    const style = getComputedStyle(probe);
    this.safeTop = Number.parseFloat(style.paddingTop) || 0;
    this.safeBottom = Number.parseFloat(style.paddingBottom) || 0;
    probe.remove();
  }

  /**
   * The monitor and phone plates live in the CSS3D layer and the rest in the panel layer, so the
   * DOM alone would tab through every surface first. Tab follows the chapters instead (WCAG 2.4.3).
   */
  private tabInStoryOrder(event: KeyboardEvent): void {
    if (event.key !== 'Tab' || event.altKey || event.ctrlKey || event.metaKey) return;
    const focusables = this.entries.flatMap(entry =>
      [...entry.el.querySelectorAll<HTMLElement>(FOCUSABLE)].map(el => ({ el, entry }))
    );
    const index = focusables.findIndex(item => item.el === document.activeElement);
    if (index < 0) return;
    const next = focusables[index + (event.shiftKey ? -1 : 1)];
    if (!next) return;
    event.preventDefault();
    if (next.el.checkVisibility({ visibilityProperty: true })) {
      next.el.focus();
      return;
    }
    /* Far chapters are dormant (visibility: hidden): travel there first, then focus once it shows. */
    this.host.scrollTo(next.entry.chapter, next.entry.sub ?? 0);
    const started = performance.now();
    const waitAndFocus = () => {
      if (next.el.checkVisibility({ visibilityProperty: true })) next.el.focus({ preventScroll: true });
      else if (performance.now() - started < 2500) requestAnimationFrame(waitAndFocus);
    };
    requestAnimationFrame(waitAndFocus);
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
