import { PerspectiveCamera, Ray, Vector3 } from 'three';
import type { Shot } from '../../contracts';
import { DEG, eyeFor } from './math';
import type { Framing, Place, Region, ScreenPoint, Setup, Viewport } from './types';

interface ScreenBox {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export function toShot(framing: Framing, view: Viewport): Shot {
  const tan = Math.tan((view.fov * DEG) / 2);
  const aspect = view.width / view.height;
  const forward = (framing.aim ?? framing.focus).clone().sub(framing.eye);
  const distance = forward.length();
  forward.normalize();
  const right = forward.clone().cross(new Vector3(0, 1, 0)).normalize();
  const up = right.clone().cross(forward).normalize();
  const dir = forward
    .clone()
    .addScaledVector(right, (0.5 - framing.sx) * 2 * aspect * tan)
    .addScaledVector(up, (framing.sy - 0.5) * 2 * tan)
    .normalize();
  return { position: framing.eye.clone(), target: framing.eye.clone().addScaledVector(dir, distance), fov: view.fov };
}

function shotCamera(shot: Shot, view: Viewport, near: number): PerspectiveCamera {
  const camera = new PerspectiveCamera(view.fov, view.width / view.height, near, 60);
  camera.position.copy(shot.position);
  camera.lookAt(shot.target);
  camera.updateMatrixWorld();
  return camera;
}

export function projector(framing: Framing, view: Viewport): (point: Vector3) => ScreenPoint | null {
  const camera = shotCamera(toShot(framing, view), view, 0.02);
  const projected = new Vector3();
  return point => {
    projected.copy(point).project(camera);
    return projected.z < 1 ? { x: (projected.x + 1) / 2, y: (1 - projected.y) / 2 } : null;
  };
}

export function inside(at: ScreenPoint | null, region: Region): boolean {
  return !!at && at.x >= region.left && at.x <= region.right && at.y >= region.top && at.y <= region.bottom;
}

export function screenBox(points: Array<ScreenPoint | null>): ScreenBox | null {
  const seen = points.filter((point): point is ScreenPoint => !!point);
  if (!seen.length) return null;
  const xs = seen.map(point => point.x);
  const ys = seen.map(point => point.y);
  return { left: Math.min(...xs), right: Math.max(...xs), top: Math.min(...ys), bottom: Math.max(...ys) };
}

export function overlaps(a: ScreenBox | null, b: ScreenBox | null): boolean {
  return !!a && !!b && a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
}

function fitsInside(framing: Framing, points: Vector3[], region: Region, view: Viewport): boolean {
  const project = projector(framing, view);
  return points.every(point => inside(project(point), region));
}

export function fitDistance(aim: Vector3, setup: Omit<Setup, 'distance'>, place: Place, points: Vector3[], region: Region, view: Viewport, nearest: number): number {
  const at = (distance: number): Framing => ({ eye: eyeFor(aim, setup.heading, setup.pitch, distance), focus: aim, ...place });
  if (fitsInside(at(nearest), points, region, view)) return nearest;
  let near = nearest;
  let far = nearest;
  while (far < 4) {
    far *= 1.25;
    if (fitsInside(at(far), points, region, view)) break;
    near = far;
  }
  for (let i = 0; i < 12; i++) {
    const mid = (near + far) / 2;
    if (fitsInside(at(mid), points, region, view)) far = mid;
    else near = mid;
  }
  return far;
}

export function panelAnchor(framing: Framing, view: Viewport): Vector3 | null {
  if (!framing.panel) return null;
  const shot = toShot(framing, view);
  const camera = shotCamera(shot, view, 0.05);
  const point = new Vector3(framing.panel.sx * 2 - 1, 1 - framing.panel.sy * 2, 0.5).unproject(camera);
  const ray = new Ray(shot.position.clone(), point.sub(shot.position).normalize());
  if (framing.panel.plane) {
    const hit = ray.intersectPlane(framing.panel.plane, new Vector3());
    if (hit) return hit;
  }
  const forward = shot.target.clone().sub(shot.position).normalize();
  const depth = (framing.aim ?? framing.focus).clone().sub(shot.position).dot(forward);
  return ray.at(depth / Math.max(ray.direction.dot(forward), 0.2), new Vector3());
}
