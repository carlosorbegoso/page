import type { ChapterId, StationPick } from '../contracts';
import type { CameraDirector } from '../director';
import type { Plates } from '../plates';
import { setupChapterScroll, type ChapterScroll } from '../scroll';
import { chapterElement } from '../sections';
import type { World } from '../world';
import type { StageLoop } from './frame-loop';
import { PickNavigator } from './navigate';
import { dissolve, mountPlates } from './plates-mount';
import { DEFAULT_SUBS, type StageLayout } from './shots';

export interface ChaptersHost {
  director: CameraDirector;
  layout: StageLayout;
  loop: StageLoop;
  world(): World;
  canvas(): HTMLCanvasElement;
  movesAllowed(): boolean;
  invalidate(): void;
}

/** Scroll ↔ chapter: the plates, the scroll driver, chapter requests (held during the intro) and clicks that travel. */
export class StageChapters {
  plates: Plates | undefined;
  readonly progress = new Map<ChapterId, number>();
  private scroll: ChapterScroll | undefined;
  private pending: { id: ChapterId; sub: number } | null = null;
  private readonly navigator: PickNavigator;

  constructor(private readonly host: ChaptersHost) {
    this.navigator = new PickNavigator({
      state: () => host.director.state(),
      movesAllowed: () => host.movesAllowed(),
      scrollToChapter: (chapter, sub) => this.scrollTo(chapter, sub)
    });
  }

  navigate(pick: StationPick): void {
    this.navigator.navigate(pick);
  }

  subCount(chapter: ChapterId): number {
    const fromPlates = this.plates?.subCount(chapter) ?? 1;
    return Math.max(1, this.host.world().subShotCount(chapter, Math.max(fromPlates, DEFAULT_SUBS[chapter] ?? 1)));
  }

  /** Scroll selected a chapter (or sub-shot): the director moves, or cuts under reduced motion. */
  request(id: ChapterId, sub: number): void {
    const { director, layout, loop } = this.host;
    if (performance.now() < loop.introUntil) {
      this.pending = { id, sub };
      return;
    }
    director.request({ id, subIndex: sub, shot: layout.shot(this.host.world(), id, sub) }, this.host.movesAllowed() ? 'move' : 'cut');
    loop.bump();
  }

  /** The intro ended: go where the visitor scrolled meanwhile, or to the hero. */
  finishIntro(): void {
    const next = this.pending ?? { id: 'hero' as ChapterId, sub: 0 };
    this.pending = null;
    this.request(next.id, next.sub);
  }

  dissolve(cut: () => void): void {
    const layers = [this.host.canvas(), this.plates?.css3d.domElement, this.plates?.panels].filter(Boolean) as HTMLElement[];
    dissolve(layers, cut, () => this.host.invalidate());
  }

  mountPlates(): void {
    const world = this.host.world();
    const host = {
      surface: (name: Parameters<World['surface']>[0]) => world.surface(name),
      anchor: (name: string) => world.anchor(name),
      scrollTo: (chapter: ChapterId, sub: number) => this.scrollTo(chapter, sub),
      reduced: () => !this.host.movesAllowed(),
      invalidate: () => this.host.invalidate()
    };
    const plates = mountPlates(host, this.host.layout.stacked, this.host.layout.size);
    if (plates) this.plates = plates;
  }

  /** Plates choose their layer at mount, so crossing the stacked breakpoint remounts them. */
  remountPlates(): void {
    if (!this.plates) return;
    this.plates.unmount();
    this.plates = undefined;
    this.mountPlates();
  }

  scrollTo(chapter: ChapterId, sub: number): void {
    const target = this.scroll?.positionOf(chapter, sub);
    const behavior: ScrollBehavior = this.host.movesAllowed() ? 'smooth' : 'auto';
    if (target !== null && target !== undefined) {
      if (Math.abs(target - scrollY) > 4) scrollTo({ top: target, behavior });
      return;
    }
    chapterElement(chapter)?.scrollIntoView({ behavior });
  }

  async startScroll(): Promise<void> {
    this.scroll = await setupChapterScroll({
      subCount: id => this.subCount(id),
      onChapter: (id, sub) => this.request(id, sub),
      onProgress: (id, progress) => {
        this.progress.set(id, progress);
        window.dispatchEvent(new CustomEvent('chapter:progress', { detail: { id, progress } }));
        this.host.loop.bump();
      }
    });
  }

  refreshScroll(): void {
    this.scroll?.refresh();
  }

  /** Back to the plain page: scroll driver off, plates back in the document. */
  teardown(): void {
    this.scroll?.dispose();
    this.scroll = undefined;
    this.plates?.unmount();
    this.plates = undefined;
  }

  dispose(): void {
    this.scroll?.dispose();
    this.plates?.dispose();
  }
}
