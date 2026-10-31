import { isChapterId } from './contracts';
import { Stage, type CaptureOptions } from './Stage';
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

/** Entry point of the 3D chunk, imported dynamically by StageCanvas. */
export async function boot({ container, tier, params }: BootOptions): Promise<Stage> {
  const forced = params.get('chapter');
  const stage = new Stage({
    container,
    tier,
    capture: captureOptions(params),
    forcedChapter: isChapterId(forced) ? forced : undefined,
    debug: debugRequested(params)
  });
  window.__stage = stage;
  await stage.start();
  return stage;
}
