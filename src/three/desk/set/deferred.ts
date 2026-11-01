import type { Group } from 'three';
import type { StationContext } from '../../contracts';
import type { WallPortrait } from '../portrait';
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
  portrait: WallPortrait | null;
  disposables: Array<{ dispose(): void }>;
}

function firstFrameShown(context: StationContext): Promise<void> {
  if (context.capture || document.querySelector('[data-stage][data-ready="true"]')) return Promise.resolve();
  return new Promise(resolve => window.addEventListener('stage:reveal', () => resolve(), { once: true }));
}

export async function mountLateDesk(options: LateDeskOptions): Promise<void> {
  const { context, room, meshes, palette, folders, screens, portrait, disposables } = options;
  await firstFrameShown(context);
  try {
    const late = await import('../deferred');
    const detail = late.createFolderDetail(context, meshes, palette);
    room.add(detail.object3D);
    disposables.push(detail);
    folders.detail = detail;
    screens.attachDesktop(late.createLaptopDesktop());
    portrait?.attachBioCard(late.createBioCard());
    context.invalidate();
  } catch (error) {
    console.error('[desk] late features failed', error);
  }
}
