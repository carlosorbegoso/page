import type { StationContext } from '../../contracts';
import { firstFrameShown } from '../set/deferred';
import type { BlindView } from './blind';

/** The roller blind arrives with the `deferred` chunk; until then the window shows only its cassette. */
export async function loadRollerBlind(context: StationContext): Promise<BlindView | null> {
  await firstFrameShown(context);
  try {
    const late = await import('../deferred');
    const blind = late.createRollerBlind();
    await context.precompile?.(blind.group);
    return blind;
  } catch (error) {
    console.error('[desk] roller blind failed', error);
    return null;
  }
}
