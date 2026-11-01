import { isChapterId } from './contracts';
import { Stage, type CaptureOptions } from './Stage';
import { watchAssetLoads } from './stage/types';
import type { TierResult } from './tier';

export interface BootOptions {
  container: HTMLElement;
  tier: TierResult;
  params: URLSearchParams;
}

function captureOptions(params: URLSearchParams): CaptureOptions | undefined {
  const chapter = params.get('capture');
  if (!isChapterId(chapter)) return undefined;
  const sub = Number.parseInt(params.get('sub') ?? '0', 10);
  return { chapter, sub: Number.isFinite(sub) ? Math.max(0, sub) : 0 };
}

function debugRequested(params: URLSearchParams): boolean {
  if (params.has('debug')) return true;
  try {
    return localStorage.getItem('stage:debug') === '1';
  } catch {
    return false;
  }
}

export async function boot({ container, tier, params }: BootOptions): Promise<Stage> {
  const forced = params.get('chapter');
  const forcedSub = Number.parseInt(params.get('sub') ?? '0', 10);
  const stage = new Stage({
    container,
    tier,
    capture: captureOptions(params),
    forcedChapter: isChapterId(forced) ? forced : undefined,
    forcedSub: Number.isFinite(forcedSub) ? Math.max(0, forcedSub) : 0,
    debug: debugRequested(params)
  });
  window.__stage = stage;
  watchAssetLoads();
  await stage.start();
  return stage;
}
