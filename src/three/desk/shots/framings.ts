import type { ChapterId } from '../../contracts';
import { shotContext } from './context';
import { experienceShots } from './experience-shots';
import { companyShot, productShots } from './figure-shots';
import { aboutShot, contactShot, heroDistance, heroShot, outroShot, stackedMonitorShots } from './monitor-shots';
import type { Framing, SurfaceFrame, Viewport } from './types';

let cached: { key: string; value: Record<ChapterId, Framing[]> } | null = null;

export function framings(view: Viewport, phone: SurfaceFrame): Record<ChapterId, Framing[]> {
  const key = `${view.width}x${view.height}@${view.fov}:${phone.centre.toArray().join()}:${phone.normal.toArray().join()}`;
  if (cached?.key !== key) cached = { key, value: computeFramings(view, phone) };
  return cached.value;
}

function computeFramings(view: Viewport, phone: SurfaceFrame): Record<ChapterId, Framing[]> {
  const ctx = shotContext(view, phone);
  const distance = heroDistance(ctx);
  const hero = heroShot(ctx, distance);
  const story = { company: [companyShot(ctx)], products: productShots(ctx), experience: experienceShots(ctx), contact: [contactShot(ctx)] };
  if (ctx.stacked) {
    const shots = stackedMonitorShots(ctx);
    return { intro: [shots.hero], hero: [shots.hero], about: shots.about, outro: [shots.outro], ...story };
  }
  const about = aboutShot(ctx, distance);
  return { intro: [hero], hero: [hero], about: [about, about], outro: [outroShot(ctx, hero, distance)], ...story };
}
