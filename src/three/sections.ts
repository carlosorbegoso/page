/** Stations of the 3D world, in scroll order. Free of three so the initial bundle can use it. */
export const STATIONS = ['hero', 'about', 'company', 'products', 'experience', 'contact'] as const;

export type StationId = (typeof STATIONS)[number];

export function isStationId(value: string | null | undefined): value is StationId {
  return (STATIONS as readonly string[]).includes(value ?? '');
}

export function stationIndex(id: StationId): number {
  return STATIONS.indexOf(id);
}

/** Section element for a station: `[data-station="<id>"]`, falling back to `#<id>`. */
export function stationElement(id: StationId): HTMLElement | null {
  return document.querySelector<HTMLElement>(`[data-station="${id}"]`) ?? document.getElementById(id);
}

export type StationListener = (active: StationId | null) => void;

/** Tracks which station's section owns the viewport centre line. */
export class StationTracker {
  private readonly listeners = new Set<StationListener>();
  private readonly centre = new Set<Element>();
  private readonly stationOf = new Map<Element, StationId>();
  private readonly observer: IntersectionObserver;
  private forced: StationId | null = null;
  active: StationId | null = null;

  constructor() {
    this.observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) this.centre.add(entry.target);
          else this.centre.delete(entry.target);
        }
        this.emit();
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );
    for (const id of STATIONS) {
      const el = stationElement(id);
      if (!el) continue;
      this.stationOf.set(el, id);
      this.observer.observe(el);
    }
  }

  /** Pins one station regardless of scroll (capture and debug modes). */
  force(id: StationId | null): void {
    this.forced = id;
    this.emit();
  }

  subscribe(listener: StationListener): () => void {
    this.listeners.add(listener);
    listener(this.active);
    return () => this.listeners.delete(listener);
  }

  private emit(): void {
    let active: StationId | null = null;
    for (const el of this.centre) active = this.stationOf.get(el) ?? active;
    active = this.forced ?? active;
    if (active === this.active) return;
    this.active = active;
    for (const listener of this.listeners) listener(active);
  }
}
