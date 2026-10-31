import { setupScroll } from './scroll';
import { isStationId, type StationTracker } from './sections';
import { Stage, type CaptureOptions } from './Stage';
import type { TierResult } from './tier';

export interface BootOptions {
  container: HTMLElement;
  tier: TierResult;
  tracker: StationTracker;
  params: URLSearchParams;
}

function captureOptions(params: URLSearchParams): CaptureOptions | undefined {
  const station = params.get('capture');
  if (!isStationId(station)) return undefined;
  const progress = Number.parseFloat(params.get('progress') ?? '1');
  return { station, progress: Number.isFinite(progress) ? Math.min(Math.max(progress, 0), 1) : 1 };
}

/** Entry point of the 3D chunk, imported dynamically by StageCanvas. */
export async function boot({ container, tier, tracker, params }: BootOptions): Promise<Stage> {
  const capture = captureOptions(params);
  const forced = params.get('station');
  if (!capture && isStationId(forced)) tracker.force(forced);
  const stage = new Stage({
    container,
    tier,
    tracker,
    capture,
    debug: params.has('debug') || (() => {
      try {
        return localStorage.getItem('stage:debug') === '1';
      } catch {
        return false;
      }
    })()
  });
  window.__stage = stage;
  await stage.start();
  if (!capture && !isStationId(forced)) await setupScroll(stage);
  return stage;
}
