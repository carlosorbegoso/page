import { Mesh, type Group, type PointLight } from 'three';
import type { StationContext } from '../../contracts';
import { FolderDetail } from '../folderDetail';
import { StoryBeats } from '../life/beats';
import { PokemonLife } from '../life/pokemon';
import type { RigPart } from '../life/rig';
import { StackedPrints } from '../notes/stacked';
import { BioCard } from '../portrait/bio-card';
import type { Palette } from '../props';
import { buildRoomFar } from '../room-far';
import { RollerBlind } from '../room-life/blind';
import { LaptopDesktop } from '../screens/desktop';
import { DESKTOP_SIZE } from '../screens/laptopDisplay';
import { useStackedProductShot } from '../shots/printed-shots';
import { stackedProductShot } from '../shots/stacked-product-shot';
import type { RoomMeshes } from '../set/room';

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

export function createBioCard(): BioCard {
  return new BioCard();
}

export function createRollerBlind(): RollerBlind {
  return new RollerBlind();
}

export function createStoryBeats(): StoryBeats {
  return new StoryBeats();
}

export function createPokemonLife(parts: ReadonlyMap<string, RigPart>, flashLight: PointLight | null): PokemonLife {
  return new PokemonLife(parts, flashLight);
}

export function createStackedPrints(room: Group, invalidate: () => void): StackedPrints {
  useStackedProductShot(stackedProductShot);
  return new StackedPrints(room, invalidate);
}

export function createRoomFar(context: StationContext, meshes: RoomMeshes, palette: Palette): { object3D: Mesh; dispose(): void } {
  const high = context.tier === 'high';
  const geometry = buildRoomFar(palette, high ? 1 : 0.6);
  const mesh = new Mesh(geometry, meshes.material);
  mesh.name = 'desk-room-far';
  mesh.receiveShadow = high;
  mesh.raycast = () => undefined;
  void context.precompile?.(mesh);
  return { object3D: mesh, dispose: () => geometry.dispose() };
}
