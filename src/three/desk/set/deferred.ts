import type { Group, PointLight } from 'three';
import type { StationContext } from '../../contracts';
import type { StationPick } from '../../contracts';
import type { DeskLife } from '../life';
import type { ExploreHints } from './explore-hints';
import type { WallPortrait } from '../portrait';
import type { ClockWiring } from './clock-wiring';
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
  life: DeskLife | null;
  hints: ExploreHints;
  picks: readonly StationPick[];
  disposables: Array<{ dispose(): void }>;
  flashLight: () => PointLight | null;
  onClock: (wiring: ClockWiring) => void;
}

export function firstFrameShown(context: StationContext): Promise<void> {
  if (context.capture || document.querySelector('[data-stage][data-ready="true"]')) return Promise.resolve();
  return new Promise(resolve => window.addEventListener('stage:reveal', () => resolve(), { once: true }));
}

export async function mountLateDesk(options: LateDeskOptions): Promise<void> {
  const { context, room, meshes, palette, folders, screens, portrait, life, hints, picks, disposables, flashLight } = options;
  await firstFrameShown(context);
  try {
    const late = await import('../deferred');
    const clock = late.createClockWiring(context);
    room.add(clock.group);
    options.onClock(clock);
    const print = late.createOpenFolderPrint(context);
    room.add(print.object3D);
    disposables.push(print);
    folders.attachPrint(print);
    portrait?.attachInspect(late.createPortraitInspect(context.camera));
    life?.attachPokemon(parts => late.createPokemonLife(parts, flashLight()));
    const detail = late.createFolderDetail(context, meshes, palette);
    room.add(detail.object3D);
    disposables.push(detail);
    folders.detail = detail;
    screens.attachDesktop(late.createLaptopDesktop(), late.listenForTyping);
    portrait?.attachBioCard(late.createBioCard());
    life?.attachBeats(late.createStoryBeats());
    hints.attach(late.createHotspots(picks), room);
    disposables.push(late.createStackedPrints(room, () => context.invalidate()));
    const far = late.createRoomFar(context, meshes, palette);
    room.add(far.object3D);
    disposables.push(far);
    context.invalidate();
  } catch (error) {
    console.error('[desk] late features failed', error);
  }
}
