import { DoubleSide, MeshStandardMaterial } from 'three';
import { tokenColor } from '../tokens';

export interface RoomMaterials {
  wood: MeshStandardMaterial;
  wall: MeshStandardMaterial;
  metal: MeshStandardMaterial;
  shade: MeshStandardMaterial;
  folder: MeshStandardMaterial;
  ceramic: MeshStandardMaterial;
  frame: MeshStandardMaterial;
}

export function createMaterials(): RoomMaterials {
  return {
    wood: new MeshStandardMaterial({ color: tokenColor('--color-desk-wood'), roughness: 0.78 }),
    wall: new MeshStandardMaterial({ color: tokenColor('--color-desk-wall'), roughness: 0.95 }),
    metal: new MeshStandardMaterial({ color: tokenColor('--color-desk-metal'), roughness: 0.45, metalness: 0.6 }),
    shade: new MeshStandardMaterial({ color: tokenColor('--color-lamp-shade'), roughness: 0.5, metalness: 0.4, side: DoubleSide }),
    folder: new MeshStandardMaterial({ color: tokenColor('--color-folder-intercorp'), roughness: 0.9 }),
    ceramic: new MeshStandardMaterial({ color: tokenColor('--color-desk-ceramic'), roughness: 0.4 }),
    frame: new MeshStandardMaterial({ color: tokenColor('--color-window-frame'), roughness: 0.7 })
  };
}
