import type { Group } from 'three';
import type { StationContext } from '../../contracts';
import type { Palette } from '../props';
import type { DeskFolders } from './folders';
import type { RoomMeshes } from './room';
import type { DeskScreens } from './screens';

export interface LateDeskOptions {
  context: StationContext;
  room: Group;
  meshes: RoomMeshes;
  palette: Palette;
  folders: DeskFolders;
  screens: DeskScreens;
  disposables: Array<{ dispose(): void }>;
}

/** Resolves once the stage has shown its first frame (immediately in capture mode, which must draw everything in one frame). */
function firstFrameShown(context: StationContext): Promise<void> {
  if (context.capture || document.querySelector('[data-stage][data-ready="true"]')) return Promise.resolve();
  return new Promise(resolve => window.addEventListener('stage:reveal', () => resolve(), { once: true }));
}

/**
 * Features nobody sees on the first frame — the folder taken out to read and the laptop's working
 * desktop — come in their own chunk once the scene is on screen, keeping the 3D boot within budget.
 * Until then the laptop shows its lock screen and the shelf folders simply can't be taken out yet.
 */
export async function mountLateDesk(options: LateDeskOptions): Promise<void> {
  const { context, room, meshes, palette, folders, screens, disposables } = options;
  await firstFrameShown(context);
  try {
    const late = await import('../deferred');
    const detail = late.createFolderDetail(context, meshes, palette);
    room.add(detail.object3D);
    disposables.push(detail);
    folders.detail = detail;
    screens.attachDesktop(late.createLaptopDesktop());
    context.invalidate();
  } catch (error) {
    console.error('[desk] late features failed', error);
  }
}
