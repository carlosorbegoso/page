import { Quaternion, Vector3, type PerspectiveCamera } from 'three';
import { CSS3DObject, CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';
import { layoutKind, smoothstep, damp } from './scenes/common';
import { poseCamera, STATION_SPECS, type CameraPose } from './scenes/stations';
import { STATIONS, stationElement, stationIndex, type StationId } from './sections';
import { Scene } from 'three';

type Anchor = 'left' | 'right' | 'center';

interface StationPlates {
  id: StationId;
  index: number;
  section: HTMLElement;
  /** CSS3DObject element: a fixed-height window centred on the placement point. */
  holder: HTMLElement;
  /** Column inside the window that scrolls through the station's plates. */
  column: HTMLElement;
  plates: HTMLElement[];
  object: CSS3DObject;
  anchor: Anchor;
  columnHeight: number;
  windowHeight: number;
  hold: number;
  offset: number;
  activePlate: HTMLElement | null;
}

interface Origin {
  plate: HTMLElement;
  parent: Node;
  next: Node | null;
}

export interface PlateHost {
  camera: PerspectiveCamera;
  readingPose(id: StationId): CameraPose;
  stationValue(): number;
  instant(): boolean;
  onActivePlate(station: StationId, plate: HTMLElement): void;
  invalidate(): void;
}

const MIN_HOLD_VH = 0.35;

function plateAnchor(plate: HTMLElement | undefined, fallback: Anchor): Anchor {
  const value = plate?.dataset.plateAnchor;
  return value === 'left' || value === 'right' || value === 'center' ? value : fallback;
}

/**
 * Text plates in 3D (CSS3DRenderer, same camera as WebGL). Each station's `[data-plate]`
 * elements are moved, in DOM order, into one CSS3DObject column; the sections stay as empty
 * spacers whose height drives the scroll. At its station a column is glued to the camera at
 * 1 CSS px = 1 screen px; away from it the column stays in the world, tilts and fades.
 */
export class Plates {
  readonly renderer = new CSS3DRenderer();
  readonly scene = new Scene();
  private readonly stations: StationPlates[] = [];
  private readonly origins: Origin[] = [];
  private readonly resizeObserver: ResizeObserver;
  private width = 1;
  private height = 1;
  private readonly onFocusIn = (event: FocusEvent) => this.focusIn(event);

  constructor(private readonly host: PlateHost) {
    this.resizeObserver = new ResizeObserver(() => {
      this.measure();
      this.host.invalidate();
    });
  }

  /** True when there is at least one plate to host. */
  mount(): boolean {
    const root = this.renderer.domElement;
    root.dataset.stagePlates = '';
    root.classList.add('stage-plates');
    for (const id of STATIONS) {
      const section = stationElement(id);
      if (!section) continue;
      const plates = [...section.querySelectorAll<HTMLElement>('[data-plate]')];
      if (!plates.length) continue;
      for (const plate of plates) this.origins.push({ plate, parent: plate.parentNode!, next: plate.nextSibling });
      const holder = document.createElement('div');
      holder.dataset.stationPlates = id;
      holder.className = 'stage-plates__station';
      holder.style.width = 'var(--plate-width)';
      const column = document.createElement('div');
      column.className = 'stage-plates__column';
      column.style.cssText = 'display:flex;flex-direction:column;gap:var(--plate-gap);width:100%';
      const ordered = [...plates].sort(
        (a, b) => Number(a.dataset.plateOrder ?? 0) - Number(b.dataset.plateOrder ?? 0)
      );
      const keepDomOrder = ordered.every((plate, i) => plate === plates[i]);
      column.append(...(keepDomOrder ? plates : ordered));
      holder.append(column);
      const object = new CSS3DObject(holder);
      this.scene.add(object);
      const spec = STATION_SPECS[id];
      this.stations.push({
        id,
        index: stationIndex(id),
        section,
        holder,
        column,
        plates,
        object,
        anchor: plateAnchor(plates[0], spec.desktopSide === 'right' ? 'left' : 'right'),
        columnHeight: 0,
        windowHeight: 0,
        hold: 0,
        offset: 0,
        activePlate: null
      });
      this.resizeObserver.observe(column);
    }
    if (!this.stations.length) return false;
    const first = this.stations[0]!.section;
    first.parentElement?.insertBefore(root, first);
    for (const station of this.stations) {
      station.section.dataset.stationSpacer = '';
      this.renderer.domElement.firstElementChild?.firstElementChild?.appendChild(station.holder);
    }
    document.documentElement.classList.add('is-3d');
    root.addEventListener('focusin', this.onFocusIn);
    return true;
  }

  /** Puts every plate back where it was (degradation to the static page). */
  unmount(): void {
    this.resizeObserver.disconnect();
    this.renderer.domElement.removeEventListener('focusin', this.onFocusIn);
    for (const { plate, parent, next } of this.origins) {
      plate.removeAttribute('data-active');
      plate.removeAttribute('data-dormant');
      plate.style.removeProperty('opacity');
      parent.insertBefore(plate, next && next.parentNode === parent ? next : null);
    }
    for (const station of this.stations) {
      station.section.style.removeProperty('min-height');
      delete station.section.dataset.stationSpacer;
    }
    this.renderer.domElement.remove();
    document.documentElement.classList.remove('is-3d');
  }

  setSize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.renderer.setSize(width, height);
    this.measure();
  }

  /** Window (visible column) geometry for the current layout, in CSS px. */
  private windowFor(): { cy: number; height: number } {
    if (layoutKind(this.width) === 'desktop') return { cy: 0.5, height: this.height * 0.84 };
    return { cy: 0.705, height: this.height * 0.55 };
  }

  private measure(): void {
    const window = this.windowFor();
    for (const station of this.stations) {
      station.columnHeight = station.column.offsetHeight;
      station.windowHeight = window.height;
      station.holder.style.height = `${window.height}px`;
      station.hold = Math.max(station.columnHeight - window.height, this.height * MIN_HOLD_VH);
      station.section.style.minHeight = `${Math.round(this.height + station.hold)}px`;
    }
  }

  private sub(station: StationPlates): number {
    const top = station.section.getBoundingClientRect().top;
    return Math.min(Math.max(-top / station.hold, 0), 1);
  }

  private screenX(station: StationPlates): number {
    if (layoutKind(this.width) !== 'desktop') return this.width / 2;
    const fraction = station.anchor === 'left' ? 0.27 : station.anchor === 'right' ? 0.73 : 0.5;
    const half = (station.holder.offsetWidth || 576) / 2 + 24;
    return Math.min(Math.max(fraction * this.width, half), this.width - half);
  }

  /** Places, fades and scrolls every column; returns true while columns are still easing. */
  update(dt: number): boolean {
    const s = this.host.stationValue();
    const instant = this.host.instant();
    const window = this.windowFor();
    const camera = this.host.camera;
    let settling = false;
    for (const station of this.stations) {
      const distance = Math.abs(s - station.index);
      const sub = this.sub(station);
      const travel = Math.max(station.columnHeight - station.windowHeight, 0);
      const targetOffset = travel > 0 ? sub * travel : (station.columnHeight - station.windowHeight) / 2;
      station.offset = instant ? targetOffset : damp(station.offset, targetOffset, 14, dt);
      settling ||= Math.abs(station.offset - targetOffset) > 0.5;
      station.column.style.transform = `translate3d(0, ${(-station.offset).toFixed(1)}px, 0)`;

      const reading = poseCamera(camera, this.host.readingPose(station.id), this.width, this.height);
      const depth = reading.position.distanceTo(this.host.readingPose(station.id).target) * 0.82;
      const sx = this.screenX(station) / this.width;
      const fixed = this.place(reading, sx, window.cy, depth);
      const glued = this.place(camera, sx, window.cy, depth);
      const glue = instant ? (distance < 0.5 ? 1 : 0) : 1 - smoothstep(0, 0.6, distance);
      station.object.position.lerpVectors(fixed.position, glued.position, glue);
      station.object.quaternion.slerpQuaternions(fixed.quaternion, glued.quaternion, glue);
      if (!instant && layoutKind(this.width) === 'desktop') {
        const tilt = Math.max(-1, Math.min(1, s - station.index)) * (8 * Math.PI) / 180;
        station.object.rotateY(station.anchor === 'left' ? tilt : -tilt);
      }
      const unit = (2 * depth * Math.tan((camera.fov * Math.PI) / 360)) / this.height;
      station.object.scale.setScalar(unit);

      const opacity = instant ? (distance < 0.5 ? 1 : 0) : 1 - smoothstep(0.15, 0.7, distance);
      station.holder.style.opacity = opacity.toFixed(3);
      const active = distance < 0.35;
      station.holder.style.pointerEvents = active ? 'auto' : 'none';
      this.updatePlates(station, active, distance);
    }
    return settling;
  }

  private place(camera: PerspectiveCamera, sx: number, sy: number, depth: number): { position: Vector3; quaternion: Quaternion } {
    camera.updateMatrixWorld();
    const ndc = new Vector3(sx * 2 - 1, 1 - sy * 2, 0.5).unproject(camera);
    const origin = camera.getWorldPosition(new Vector3());
    const direction = ndc.sub(origin).normalize();
    const forward = camera.getWorldDirection(new Vector3());
    const position = origin.addScaledVector(direction, depth / Math.max(direction.dot(forward), 0.2));
    return { position, quaternion: camera.getWorldQuaternion(new Quaternion()) };
  }

  private updatePlates(station: StationPlates, active: boolean, distance: number): void {
    const centre = station.offset + station.windowHeight / 2;
    let closest: HTMLElement | null = null;
    let best = Infinity;
    for (const plate of station.plates) {
      const mid = plate.offsetTop + plate.offsetHeight / 2;
      const gap = Math.abs(mid - centre);
      if (gap < best) {
        best = gap;
        closest = plate;
      }
      const visible = plate.offsetTop + plate.offsetHeight > station.offset - 40 && plate.offsetTop < station.offset + station.windowHeight + 40;
      plate.toggleAttribute('data-dormant', distance > 1.5 || (active && !visible));
    }
    for (const plate of station.plates) plate.toggleAttribute('data-active', active && plate === closest);
    if (active && closest && closest !== station.activePlate) {
      station.activePlate = closest;
      this.host.onActivePlate(station.id, closest);
    }
    if (!active) station.activePlate = null;
  }

  /** Scroll position that centres `plateId` in its station window. */
  scrollTargetFor(plateId: string): number | null {
    for (const station of this.stations) {
      const plate = station.plates.find(p => p.dataset.plateId === plateId);
      if (!plate) continue;
      const travel = Math.max(station.columnHeight - station.windowHeight, 0);
      const wanted = plate.offsetTop + plate.offsetHeight / 2 - station.windowHeight / 2;
      const sub = travel > 0 ? Math.min(Math.max(wanted / travel, 0), 1) : 0;
      const top = station.section.getBoundingClientRect().top + scrollY;
      return top + sub * station.hold;
    }
    return null;
  }

  private focusIn(event: FocusEvent): void {
    const plate = (event.target as Element | null)?.closest<HTMLElement>('[data-plate]');
    const id = plate?.dataset.plateId;
    if (!id) return;
    const target = this.scrollTargetFor(id);
    if (target === null || Math.abs(target - scrollY) < 4) return;
    scrollTo({ top: target, behavior: this.host.instant() ? 'auto' : 'smooth' });
  }

  render(camera: PerspectiveCamera): void {
    this.renderer.render(this.scene, camera);
  }

  dispose(): void {
    this.unmount();
  }
}
