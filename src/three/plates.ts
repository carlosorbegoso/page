import { Quaternion, Scene, Vector3, type PerspectiveCamera } from 'three';
import { CSS3DObject, CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';
import type { PlateAnchor } from './contracts';
import { damp, layoutKind, smoothstep } from './scenes/common';
import { poseCamera, STATION_SPECS, type CameraPose } from './scenes/stations';
import { STATIONS, stationElement, stationIndex, type StationId } from './sections';

type Anchor = 'left' | 'right' | 'center';

/** One CSS3DObject: a window (holder) with a scrolling column of one or more plates. */
interface PlateUnit {
  holder: HTMLElement;
  column: HTMLElement;
  plates: HTMLElement[];
  object: CSS3DObject;
  columnHeight: number;
  offset: number;
  /** Sequence stations: 0..1 weight of being the plate in front of the camera. */
  presence: number;
}

interface StationPlates {
  id: StationId;
  index: number;
  section: HTMLElement;
  plates: HTMLElement[];
  units: PlateUnit[];
  /** One plate at a time, each resting next to its body (products). */
  sequence: boolean;
  anchor: Anchor;
  windowHeight: number;
  hold: number;
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
  /** Idle motion allowed (false under reduced motion, pause or capture). */
  motion(): boolean;
  /** Seconds since boot. */
  time(): number;
  /** Normalised pointer (-1..1, +Y down), zero when not a fine pointer. */
  pointer(): { x: number; y: number };
  /** Module-provided anchor for a plate (desk monitor, …). */
  anchorFor(station: StationId, plateId: string): PlateAnchor | null;
  /** World body a plate rests next to in sequence stations (moons, Alfa). */
  bodyFor(plateId: string): Vector3 | null;
  onActivePlate(station: StationId, plate: HTMLElement): void;
  /** Section heights changed (plate content resized): scroll triggers must be refreshed. */
  onLayoutChange(): void;
  invalidate(): void;
}

const MIN_HOLD_VH = 0.35;
const SEQUENCE_STEP_VH = 0.8;
const SEQUENCE_STATIONS: ReadonlySet<StationId> = new Set(['products']);
/** Desktop right-edge safety margin: the star-map rail lives there. */
const RIGHT_SAFE_PX = 120;
const LEFT_SAFE_PX = 24;

function plateAnchor(plate: HTMLElement | undefined, fallback: Anchor): Anchor {
  const value = plate?.dataset.plateAnchor;
  return value === 'left' || value === 'right' || value === 'center' ? value : fallback;
}

function createUnit(id: StationId, plates: HTMLElement[]): PlateUnit {
  const holder = document.createElement('div');
  holder.dataset.stationPlates = id;
  holder.className = 'stage-plates__station';
  holder.style.width = 'var(--plate-width)';
  const column = document.createElement('div');
  column.className = 'stage-plates__column';
  column.style.cssText = 'display:flex;flex-direction:column;gap:var(--plate-gap);width:100%';
  column.append(...plates);
  holder.append(column);
  return { holder, column, plates, object: new CSS3DObject(holder), columnHeight: 0, offset: 0, presence: 0 };
}

/**
 * Text plates in 3D (CSS3DRenderer, same camera as WebGL). Each station's `[data-plate]`
 * elements are moved, in DOM order, into CSS3DObjects; the sections stay as empty spacers whose
 * height drives the scroll. At its station a plate is glued to the camera at 1 CSS px = 1 screen
 * px; away from it, it stays in the world, tilts and fades. Products run as a sequence: one plate
 * in front at a time while the others rest next to their moons.
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
      this.host.onLayoutChange();
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
      const ordered = [...plates].sort((a, b) => Number(a.dataset.plateOrder ?? 0) - Number(b.dataset.plateOrder ?? 0));
      const list = ordered.every((plate, i) => plate === plates[i]) ? plates : ordered;
      const sequence = SEQUENCE_STATIONS.has(id) && list.length > 1;
      const units = sequence ? list.map(plate => createUnit(id, [plate])) : [createUnit(id, list)];
      const spec = STATION_SPECS[id];
      this.stations.push({
        id,
        index: stationIndex(id),
        section,
        plates: list,
        units,
        sequence,
        anchor: plateAnchor(list[0], spec.desktopSide === 'right' ? 'left' : 'right'),
        windowHeight: 0,
        hold: 0,
        activePlate: null
      });
    }
    if (!this.stations.length) return false;
    const first = this.stations[0]!.section;
    first.parentElement?.insertBefore(root, first);
    const cameraElement = root.firstElementChild?.firstElementChild;
    for (const station of this.stations) {
      station.section.dataset.stationSpacer = '';
      for (const unit of station.units) {
        this.scene.add(unit.object);
        cameraElement?.appendChild(unit.holder);
        this.resizeObserver.observe(unit.column);
      }
    }
    document.documentElement.classList.add('is-3d');
    root.addEventListener('focusin', this.onFocusIn);
    return true;
  }

  /** Puts every plate back where it was (degradation to the static page). */
  unmount(): void {
    this.resizeObserver.disconnect();
    this.renderer.domElement.removeEventListener('focusin', this.onFocusIn);
    for (const { plate, parent, next } of [...this.origins].reverse()) {
      plate.removeAttribute('data-active');
      plate.removeAttribute('data-dormant');
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

  /** Visible window for the plate column, in CSS px. */
  private windowFor(): { cy: number; height: number } {
    if (layoutKind(this.width) === 'desktop') return { cy: 0.5, height: this.height * 0.84 };
    return { cy: 0.705, height: this.height * 0.55 };
  }

  private measure(): void {
    const window = this.windowFor();
    for (const station of this.stations) {
      station.windowHeight = window.height;
      for (const unit of station.units) {
        unit.columnHeight = unit.column.offsetHeight;
        unit.holder.style.height = `${window.height}px`;
      }
      if (station.sequence) {
        const overflow = station.units.reduce((sum, unit) => sum + Math.max(unit.columnHeight - window.height, 0), 0);
        station.hold = station.units.length * this.height * SEQUENCE_STEP_VH + overflow;
      } else {
        const column = station.units[0]!.columnHeight;
        station.hold = Math.max(column - window.height, this.height * MIN_HOLD_VH);
      }
      station.section.style.minHeight = `${Math.round(this.height + station.hold)}px`;
    }
  }

  private sub(station: StationPlates): number {
    const top = station.section.getBoundingClientRect().top;
    return Math.min(Math.max(-top / station.hold, 0), 1);
  }

  /** Index of the plate in front and the progress inside its segment (sequence stations). */
  private segment(station: StationPlates, sub: number): { index: number; local: number } {
    const count = station.units.length;
    const scaled = Math.min(sub * count, count - 1e-6);
    const index = Math.floor(scaled);
    return { index, local: scaled - index };
  }

  private screenX(station: StationPlates, unit: PlateUnit): number {
    if (layoutKind(this.width) !== 'desktop') return this.width / 2;
    const fraction = station.anchor === 'left' ? 0.27 : station.anchor === 'right' ? 0.71 : 0.5;
    const half = (unit.holder.offsetWidth || 576) / 2;
    return Math.min(Math.max(fraction * this.width, half + LEFT_SAFE_PX), this.width - half - RIGHT_SAFE_PX);
  }

  /** Places, fades and scrolls every plate; returns true while something is still easing. */
  update(dt: number): boolean {
    const s = this.host.stationValue();
    const instant = this.host.instant();
    let settling = false;
    for (const station of this.stations) {
      const distance = Math.abs(s - station.index);
      const sub = this.sub(station);
      const readingPose = this.host.readingPose(station.id);
      const reading = poseCamera(this.host.camera, readingPose, this.width, this.height);
      if (station.sequence) settling = this.updateSequence(station, distance, sub, s, reading, readingPose, dt, instant) || settling;
      else settling = this.updateColumn(station, distance, sub, s, reading, readingPose, dt, instant) || settling;
    }
    return settling;
  }

  private updateColumn(
    station: StationPlates,
    distance: number,
    sub: number,
    s: number,
    reading: PerspectiveCamera,
    readingPose: CameraPose,
    dt: number,
    instant: boolean
  ): boolean {
    const unit = station.units[0]!;
    const travel = Math.max(unit.columnHeight - station.windowHeight, 0);
    const targetOffset = travel > 0 ? sub * travel : (unit.columnHeight - station.windowHeight) / 2;
    const settling = this.scrollColumn(unit, targetOffset, dt, instant);
    const anchor = this.host.anchorFor(station.id, station.plates[0]?.dataset.plateId ?? '');
    const glue = instant ? (distance < 0.5 ? 1 : 0) : 1 - smoothstep(0, 0.6, distance);
    let unitScale: number;
    if (anchor) {
      unit.object.position.copy(anchor.position);
      unit.object.quaternion.copy(anchor.quaternion);
      unitScale = anchor.scale ?? this.pixelUnit(anchor.position.distanceTo(reading.position), reading.fov);
    } else {
      const depth = reading.position.distanceTo(readingPose.target) * 0.82;
      this.placeGlued(unit, station, reading, depth, glue);
      unitScale = this.pixelUnit(depth, this.host.camera.fov);
      if (!instant) this.choreograph(unit, station, s - station.index, unitScale);
    }
    this.finish(unit, station, distance < 0.35, unitScale, instant);
    unit.holder.style.opacity = this.stationOpacity(distance, instant).toFixed(3);
    unit.holder.style.pointerEvents = distance < 0.35 ? 'auto' : 'none';
    this.flagColumn(station, unit, distance);
    return settling;
  }

  private updateSequence(
    station: StationPlates,
    distance: number,
    sub: number,
    s: number,
    reading: PerspectiveCamera,
    readingPose: CameraPose,
    dt: number,
    instant: boolean
  ): boolean {
    const { index, local } = this.segment(station, sub);
    const stationOpacity = this.stationOpacity(distance, instant);
    const depth = reading.position.distanceTo(readingPose.target) * 0.82;
    const unitScale = this.pixelUnit(depth, this.host.camera.fov);
    const near = distance < 0.6;
    let settling = false;
    station.units.forEach((unit, k) => {
      const front = k === index;
      const target = front ? 1 : 0;
      unit.presence = instant ? target : damp(unit.presence, target, 5, dt);
      settling ||= Math.abs(unit.presence - target) > 0.002;
      const travel = Math.max(unit.columnHeight - station.windowHeight, 0);
      const targetOffset = travel > 0 ? (front ? local : k < index ? 1 : 0) * travel : (unit.columnHeight - station.windowHeight) / 2;
      settling = this.scrollColumn(unit, targetOffset, dt, instant) || settling;

      const glue = instant ? (distance < 0.5 ? 1 : 0) : 1 - smoothstep(0, 0.6, distance);
      this.placeGlued(unit, station, reading, depth, glue * unit.presence);
      const body = this.host.bodyFor(unit.plates[0]?.dataset.plateId ?? '');
      if (body && unit.presence < 0.999) this.restNear(unit, body, reading, unitScale, 1 - unit.presence, station);
      const restScale = 0.4 + 0.6 * unit.presence;
      if (!instant) this.choreograph(unit, station, s - station.index, unitScale);
      this.finish(unit, station, front && distance < 0.35, unitScale * restScale, instant);

      const resting = index === 0 && layoutKind(this.width) === 'desktop' ? 0.35 : 0;
      unit.holder.style.opacity = (stationOpacity * (resting + (1 - resting) * unit.presence)).toFixed(3);
      unit.holder.style.pointerEvents = front && distance < 0.35 ? 'auto' : 'none';
      for (const plate of unit.plates) {
        plate.toggleAttribute('data-active', front && near);
        plate.toggleAttribute('data-dormant', distance > 1.5);
      }
    });
    const activePlate = station.units[index]?.plates[0] ?? null;
    if (distance < 0.35 && activePlate && activePlate !== station.activePlate) {
      station.activePlate = activePlate;
      this.host.onActivePlate(station.id, activePlate);
    }
    if (distance >= 0.35) station.activePlate = null;
    return settling;
  }

  private scrollColumn(unit: PlateUnit, targetOffset: number, dt: number, instant: boolean): boolean {
    unit.offset = instant ? targetOffset : damp(unit.offset, targetOffset, 14, dt);
    unit.column.style.transform = `translate3d(0, ${(-unit.offset).toFixed(1)}px, 0)`;
    return Math.abs(unit.offset - targetOffset) > 0.5;
  }

  private pixelUnit(depth: number, fov: number): number {
    return (2 * depth * Math.tan((fov * Math.PI) / 360)) / this.height;
  }

  private placeGlued(unit: PlateUnit, station: StationPlates, reading: PerspectiveCamera, depth: number, glue: number): void {
    const sx = this.screenX(station, unit) / this.width;
    const cy = this.windowFor().cy;
    const fixed = this.place(reading, sx, cy, depth);
    const glued = this.place(this.host.camera, sx, cy, depth);
    unit.object.position.lerpVectors(fixed.position, glued.position, glue);
    unit.object.quaternion.slerpQuaternions(fixed.quaternion, glued.quaternion, glue);
  }

  /** Blends a sequence plate towards a resting spot beside its body, facing the reading camera. */
  private restNear(unit: PlateUnit, body: Vector3, reading: PerspectiveCamera, unitScale: number, weight: number, station: StationPlates): void {
    const right = new Vector3(1, 0, 0).applyQuaternion(reading.quaternion);
    const width = (unit.holder.offsetWidth || 576) * unitScale * 0.55;
    const side = station.anchor === 'left' ? -1 : 1;
    const rest = body.clone().addScaledVector(right, side * (width * 0.5 + 0.35));
    rest.y += 0.25;
    unit.object.position.lerp(rest, weight);
    unit.object.quaternion.slerp(reading.quaternion, weight);
  }

  private finish(unit: PlateUnit, station: StationPlates, active: boolean, scale: number, instant: boolean): void {
    if (!instant && this.host.motion()) this.animateLife(unit, station, active, scale);
    unit.object.scale.setScalar(scale * this.breath(station, active));
  }

  private stationOpacity(distance: number, instant: boolean): number {
    return instant ? (distance < 0.5 ? 1 : 0) : 1 - smoothstep(0.15, 0.7, distance);
  }

  /** Arrival/departure: plates fly in from depth, turn and settle; leaving they tilt and recede. */
  private choreograph(unit: PlateUnit, station: StationPlates, offset: number, scale: number): void {
    const amount = Math.min(Math.abs(offset), 1);
    if (amount < 1e-3) return;
    const eased = amount * amount * (3 - 2 * amount);
    const side = station.anchor === 'left' ? 1 : -1;
    const direction = Math.sign(offset) || 1;
    unit.object.translateZ(-eased * 900 * scale);
    unit.object.translateY(-direction * eased * 120 * scale);
    unit.object.rotateY(side * direction * eased * 0.42);
    unit.object.rotateX(direction * eased * 0.12);
  }

  /** Idle life: slow bob/drift and 1–3° sway with phase per plate, plus a pointer tilt. */
  private animateLife(unit: PlateUnit, station: StationPlates, active: boolean, scale: number): void {
    const t = this.host.time();
    const phase = station.index * 1.7 + station.units.indexOf(unit) * 2.3;
    const pointer = this.host.pointer();
    unit.object.translateY(Math.sin(t * 0.55 + phase) * 7 * scale);
    unit.object.translateX(Math.sin(t * 0.37 + phase * 1.3) * 5 * scale);
    const strength = active ? 1 : 0.5;
    unit.object.rotateX(Math.sin(t * 0.43 + phase) * 0.018 + pointer.y * 0.05 * strength);
    unit.object.rotateY(Math.sin(t * 0.31 + phase * 0.7) * 0.026 + pointer.x * 0.07 * strength);
    unit.object.rotateZ(Math.sin(t * 0.27 + phase * 1.9) * 0.01);
  }

  private breath(station: StationPlates, active: boolean): number {
    if (!active || this.host.instant() || !this.host.motion()) return 1;
    return 1 + Math.sin((this.host.time() / 6) * Math.PI * 2 + station.index) * 0.006;
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

  /**
   * Column stations: the plate nearest the window centre is `data-active` (also while the camera
   * arrives, so in-plate reveals play); plates more than 1.5 stations away are `data-dormant`.
   */
  private flagColumn(station: StationPlates, unit: PlateUnit, distance: number): void {
    const near = distance < 0.6;
    const centre = unit.offset + station.windowHeight / 2;
    let closest: HTMLElement | null = null;
    let best = Infinity;
    for (const plate of unit.plates) {
      const mid = plate.offsetTop + plate.offsetHeight / 2;
      const gap = Math.abs(mid - centre);
      if (gap < best) {
        best = gap;
        closest = plate;
      }
      const visible =
        plate.offsetTop + plate.offsetHeight > unit.offset - 40 && plate.offsetTop < unit.offset + station.windowHeight + 40;
      plate.toggleAttribute('data-dormant', distance > 1.5 || (near && !visible));
    }
    for (const plate of unit.plates) plate.toggleAttribute('data-active', near && plate === closest);
    const active = distance < 0.35;
    if (active && closest && closest !== station.activePlate) {
      station.activePlate = closest;
      this.host.onActivePlate(station.id, closest);
    }
    if (!active) station.activePlate = null;
  }

  /** Scroll position that brings `plateId` in front of the camera. */
  scrollTargetFor(plateId: string): number | null {
    for (const station of this.stations) {
      const k = station.plates.findIndex(p => p.dataset.plateId === plateId);
      if (k < 0) continue;
      const top = station.section.getBoundingClientRect().top + scrollY;
      if (station.sequence) {
        const unitIndex = station.units.findIndex(unit => unit.plates.includes(station.plates[k]!));
        return top + ((unitIndex + 0.5) / station.units.length) * station.hold;
      }
      const unit = station.units[0]!;
      const plate = station.plates[k]!;
      const travel = Math.max(unit.columnHeight - station.windowHeight, 0);
      const wanted = plate.offsetTop + plate.offsetHeight / 2 - station.windowHeight / 2;
      const sub = travel > 0 ? Math.min(Math.max(wanted / travel, 0), 1) : 0;
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
