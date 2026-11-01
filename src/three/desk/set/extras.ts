import type { Group } from 'three';
import type { StationContext } from '../../contracts';
import { FolderDetail } from '../folderDetail';
import { DeskLife } from '../life';
import type { Palette } from '../props';
import { createSpineLabels } from '../spines';
import type { DeskFolders } from './folders';
import type { RoomMeshes } from './room';

type Disposables = Array<{ dispose(): void }>;

/** The animated collectibles and the mug, split out of the static room so they can move. */
export function addDeskLife(room: Group, meshes: RoomMeshes, palette: Palette, high: boolean, disposables: Disposables): DeskLife {
  const { material, depthMaterial } = meshes;
  const life = new DeskLife({ geometry: meshes.figures.build(), workstation: meshes.workstation.build(), material, depthMaterial, shadows: high, palette });
  room.add(life.object3D);
  disposables.push(life);
  return life;
}

/** The folder taken off the shelf to be read, precompiled before it is first shown. */
export function addFolderDetail(room: Group, context: StationContext, meshes: RoomMeshes, palette: Palette, disposables: Disposables): FolderDetail {
  const detail = new FolderDetail({
    material: meshes.material,
    depthMaterial: meshes.depthMaterial,
    shadows: context.tier === 'high',
    palette,
    renderer: context.renderer,
    onRedraw: () => context.invalidate()
  });
  void context.precompile?.(detail.object3D);
  room.add(detail.object3D);
  disposables.push(detail);
  return detail;
}

export function addSpines(room: Group, folders: DeskFolders, disposables: Disposables): void {
  const spines = createSpineLabels();
  room.add(...spines.meshes.values(), spines.cover);
  folders.attachSpines(spines.meshes, spines.cover);
  disposables.push(spines);
}
