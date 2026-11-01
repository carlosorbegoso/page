import type { PerspectiveCamera, Vector3 } from 'three';
import type { PlateAnchor } from '../contracts';
import type { PanelRoom } from './safe-area';
import type { PlateEntry, Viewport } from './types';

const PANEL_GAP = 32;
const SAFE_LEFT = 24;
/** Keeps panels off the right edge (HUD / scrollbar). */
const SAFE_RIGHT = 120;
const FALLBACK_SIZE = { width: 480, height: 300 };

/** Where an anchored panel goes and how much of it fits (`shown`); `overflow` > 0 means it must be clipped. */
export interface PanelPlacement {
  x: number;
  y: number;
  shown: number;
  overflow: number;
}

function screenPoint(world: Vector3 | null, camera: PerspectiveCamera, view: Viewport): { ax: number; ay: number } {
  const projected = world ? world.clone().project(camera) : null;
  return {
    ax: projected ? ((projected.x + 1) / 2) * view.width : view.width / 2,
    ay: projected ? ((1 - projected.y) / 2) * view.height : view.height / 2
  };
}

/** Beside the anchor on desktop (on the side with more room), centred below it on touch. */
export function placePanelBox(entry: PlateEntry, world: Vector3 | null, camera: PerspectiveCamera, view: Viewport, room: PanelRoom): PanelPlacement {
  const width = entry.size?.width || FALLBACK_SIZE.width;
  const height = entry.size?.height || FALLBACK_SIZE.height;
  const { ax, ay } = screenPoint(world, camera, view);
  const { top, bottom } = room;
  const shown = Math.min(height, Math.max(bottom - top, 0));
  const overflow = height - shown;
  if (room.desktop) {
    const side = entry.side ?? (ax > view.width / 2 ? 'left' : 'right');
    const beside = side === 'left' ? ax - PANEL_GAP - width : ax + PANEL_GAP;
    const x = Math.min(Math.max(beside, SAFE_LEFT), view.width - SAFE_RIGHT - width);
    const y = Math.min(Math.max(ay - height / 2, top), bottom - shown);
    return { x, y, shown, overflow };
  }
  const preferred = Math.max(ay + view.height * 0.1, view.height * 0.42);
  return { x: (view.width - width) / 2, y: Math.max(Math.min(preferred, bottom - shown), top), shown, overflow };
}

/** Pins a surface plate 1:1 onto the monitor or phone; hides it when that surface is missing. */
export function placeSurfacePlate(entry: PlateEntry, anchor: PlateAnchor | null, camera: PerspectiveCamera, viewHeight: number): void {
  const object = entry.object!;
  if (!anchor) {
    object.visible = false;
    return;
  }
  object.visible = true;
  object.position.copy(anchor.position);
  object.quaternion.copy(anchor.quaternion);
  const distance = anchor.position.distanceTo(camera.position);
  const scale = anchor.scale ?? (2 * distance * Math.tan((camera.fov * Math.PI) / 360)) / viewHeight;
  object.scale.setScalar(scale);
  if (anchor.size) writeSurfaceSize(entry, anchor.size, scale);
}

function writeSurfaceSize(entry: PlateEntry, size: { width: number; height: number }, scale: number): void {
  const width = `${Math.round(size.width / scale)}px`;
  const height = `${Math.round(size.height / scale)}px`;
  const surface = `${width} ${height}`;
  if (entry.written.surface === surface) return;
  entry.written.surface = surface;
  entry.el.style.setProperty('--surface-width', width);
  entry.el.style.setProperty('--surface-height', height);
}
