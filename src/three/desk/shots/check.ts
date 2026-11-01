import { CHAPTERS, type Shot } from '../../contracts';
import { framings } from './framings';
import { DEG } from './math';
import { toShot } from './projection';
import { SHOT_LIMITS } from './story';
import type { Framing, SurfaceFrame, Viewport } from './types';

export interface ShotCheck {
  from: string;
  to: string;
  yaw: number;
  pitch: number;
  angle: number;
  distance: number;
  ok: boolean;
}

function angles(shot: Shot): { heading: number; pitch: number } {
  const d = shot.target.clone().sub(shot.position).normalize();
  return { heading: Math.atan2(d.x, -d.z) / DEG, pitch: Math.asin(d.y) / DEG };
}

function storyOrder(all: ReturnType<typeof framings>): Array<[string, Framing]> {
  const order: Array<[string, Framing]> = [];
  for (const chapter of CHAPTERS.filter(id => id !== 'intro')) {
    all[chapter].forEach((framing, index) => order.push([all[chapter].length > 1 ? `${chapter}:${index}` : chapter, framing]));
  }
  return order;
}

function compare(fromName: string, fromFraming: Framing, toName: string, toFraming: Framing, view: Viewport): ShotCheck {
  const a = toShot(fromFraming, view);
  const b = toShot(toFraming, view);
  const angleA = angles(a);
  const angleB = angles(b);
  const yaw = Math.abs(angleB.heading - angleA.heading);
  const pitch = Math.abs(angleB.pitch - angleA.pitch);
  const distance = a.position.distanceTo(b.position);
  const da = a.target.clone().sub(a.position).normalize();
  const db = b.target.clone().sub(b.position).normalize();
  const angle = Math.acos(Math.min(1, Math.max(-1, da.dot(db)))) / DEG;
  return { from: fromName, to: toName, yaw, pitch, angle, distance, ok: angle <= SHOT_LIMITS.degrees && distance <= SHOT_LIMITS.metres };
}

export function checkShots(view: Viewport, phone: SurfaceFrame): ShotCheck[] {
  const order = storyOrder(framings(view, phone));
  const result: ShotCheck[] = [];
  for (let i = 1; i < order.length; i++) {
    const [fromName, fromFraming] = order[i - 1]!;
    const [toName, toFraming] = order[i]!;
    result.push(compare(fromName, fromFraming, toName, toFraming, view));
  }
  return result;
}
