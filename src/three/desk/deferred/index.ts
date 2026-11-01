import type { StationContext } from '../../contracts';
import { FolderDetail } from '../folderDetail';
import type { Palette } from '../props';
import { LaptopDesktop } from '../screens/desktop';
import { DESKTOP_SIZE } from '../screens/laptopDisplay';
import type { RoomMeshes } from '../set/room';

/** The folder taken off the shelf to be read, precompiled before it is first shown. */
export function createFolderDetail(context: StationContext, meshes: RoomMeshes, palette: Palette): FolderDetail {
  const detail = new FolderDetail({
    material: meshes.material,
    depthMaterial: meshes.depthMaterial,
    shadows: context.tier === 'high',
    palette,
    renderer: context.renderer,
    camera: context.camera,
    onRedraw: () => context.invalidate()
  });
  void context.precompile?.(detail.object3D);
  return detail;
}

export function createLaptopDesktop(): LaptopDesktop {
  return new LaptopDesktop(DESKTOP_SIZE);
}
