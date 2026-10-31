import { Scene, Vector3, type PerspectiveCamera } from 'three';
import { CSS3DObject, CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';
import type { ChapterId, ChapterState, PlateAnchor, PlateMode, SurfaceName } from './contracts';
import { layoutKind } from './scenes/common';
import { chapterElement, isChapterId, SECTION_CHAPTERS } from './sections';

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
}

export interface PlateHost {
  surface(name: SurfaceName): PlateAnchor | null;
  anchor(name: string): Vector3 | null;
  /** Scrolls the page to a chapter / sub-shot (used when keyboard focus enters a plate). */
  scrollTo(chapter: ChapterId, sub: number): void;
  reduced(): boolean;
}

const MODES: readonly PlateMode[] = ['surface-monitor', 'surface-phone', 'anchored'];
const PANEL_GAP = 32;
const SAFE_LEFT = 24;
/** Keeps panels off the right edge (HUD / scrollbar). */
const SAFE_RIGHT = 120;
const SAFE_Y = 24;

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
  private readonly onFocusIn = (event: FocusEvent) => this.focusIn(event);

  constructor(private readonly host: PlateHost) {}

  /** Moves every moded plate into its layer. Returns false when the page has none. */
  mount(): boolean {
    const surfaceRoot = this.css3d.domElement;
    surfaceRoot.classList.add('stage-surfaces');
    surfaceRoot.dataset.stageSurfaces = '';
    this.panels.className = 'stage-panels';
    this.panels.dataset.stagePanels = '';
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
        const entry: PlateEntry = { el, chapter, mode, sub, wrapper };
        if (mode === 'anchored') {
          wrapper.className = 'stage-panels__panel';
          wrapper.style.cssText = 'position:absolute;left:0;top:0;width:var(--plate-width);will-change:transform';
          entry.anchorName = el.dataset.plateAnchor;
          const side = el.dataset.plateSide;
          entry.side = side === 'left' || side === 'right' ? side : undefined;
          this.panels.append(wrapper);
        } else {
          wrapper.className = 'stage-surfaces__plate';
          entry.object = new CSS3DObject(wrapper);
          this.scene.add(entry.object);
          cameraElement?.appendChild(wrapper);
        }
        this.entries.push(entry);
      });
      section.dataset.stationSpacer = '';
    }
    if (!this.entries.length) return false;
    const first = chapterElement(SECTION_CHAPTERS[0]!) ?? document.querySelector('main');
    first?.parentElement?.insertBefore(surfaceRoot, first);
    first?.parentElement?.insertBefore(this.panels, first);
    document.documentElement.classList.add('is-3d');
    surfaceRoot.addEventListener('focusin', this.onFocusIn);
    this.panels.addEventListener('focusin', this.onFocusIn);
    return true;
  }

  /** Puts every plate back where it was (degradation to the static page). */
  unmount(): void {
    for (const { plate, parent, next } of [...this.origins].reverse()) {
      plate.removeAttribute('data-active');
      plate.removeAttribute('data-dormant');
      plate.style.removeProperty('--surface-width');
      plate.style.removeProperty('--surface-height');
      parent.insertBefore(plate, next && next.parentNode === parent ? next : null);
    }
    for (const chapter of SECTION_CHAPTERS) {
      const section = chapterElement(chapter);
      if (section) delete section.dataset.stationSpacer;
    }
    this.css3d.domElement.remove();
    this.panels.remove();
    document.documentElement.classList.remove('is-3d');
  }

  /** Sub-shots implied by the plates of a chapter (explicit `data-plate-sub`, else one per plate). */
  subCount(chapter: ChapterId): number {
    const subs = this.entries.filter(e => e.chapter === chapter && e.sub !== null).map(e => e.sub!);
    return subs.length ? Math.max(...subs) + 1 : 1;
  }

  setSize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.css3d.setSize(width, height);
  }

  /** Visibility, flags and placement for the current chapter state. */
  update(camera: PerspectiveCamera, state: ChapterState, progress: number): void {
    const currentIndex = SECTION_CHAPTERS.indexOf(state.id);
    for (const entry of this.entries) {
      const current = entry.chapter === state.id && (entry.sub === null || entry.sub === state.subIndex);
      const gap = Math.abs(SECTION_CHAPTERS.indexOf(entry.chapter) - currentIndex);
      entry.el.toggleAttribute('data-active', current && state.settled);
      entry.el.toggleAttribute('data-dormant', !current && gap > 1);
      entry.wrapper.style.opacity = current ? '' : '0';
      entry.wrapper.style.pointerEvents = current && state.settled ? 'auto' : 'none';
      if (entry.mode === 'anchored') this.placePanel(entry, camera, current, progress);
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
      entry.el.style.setProperty('--surface-width', `${Math.round(anchor.size.width / scale)}px`);
      entry.el.style.setProperty('--surface-height', `${Math.round(anchor.size.height / scale)}px`);
    }
  }

  private placePanel(entry: PlateEntry, camera: PerspectiveCamera, current: boolean, progress: number): void {
    if (!current) return;
    const world = entry.anchorName ? this.host.anchor(entry.anchorName) : null;
    const width = entry.wrapper.offsetWidth || 480;
    const height = entry.wrapper.offsetHeight || 300;
    let x: number;
    let y: number;
    const projected = world ? world.clone().project(camera) : null;
    const ax = projected ? ((projected.x + 1) / 2) * this.width : this.width / 2;
    const ay = projected ? ((1 - projected.y) / 2) * this.height : this.height / 2;
    if (layoutKind(this.width) === 'desktop') {
      const side = entry.side ?? (ax > this.width / 2 ? 'left' : 'right');
      x = side === 'left' ? ax - PANEL_GAP - width : ax + PANEL_GAP;
      y = ay - height / 2;
      x = Math.min(Math.max(x, SAFE_LEFT), this.width - SAFE_RIGHT - width);
      const overflow = Math.max(height - (this.height - 2 * SAFE_Y), 0);
      y = Math.min(Math.max(y, SAFE_Y), this.height - SAFE_Y - height + overflow) - overflow * progress;
    } else {
      x = (this.width - width) / 2;
      const top = Math.max(ay + this.height * 0.1, this.height * 0.42);
      const overflow = Math.max(top + height - (this.height - SAFE_Y), 0);
      y = top - overflow * progress;
    }
    entry.wrapper.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
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
