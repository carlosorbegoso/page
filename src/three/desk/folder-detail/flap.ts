import { BoxGeometry, Matrix4, Mesh } from 'three';
import { OBJECT_ID, PartBuilder } from '../builder';
import { FOLDER, folderCentre } from '../layout';
import { FLAP_THICKNESS, FOLDER_PARK, type ShelfFolder } from './constants';
import { ease } from './ease';
import type { TwinLook } from './mesh';

export const FLAP_OPEN = 2.8;
const FLAP_START = 0.62;

const scratch = new Matrix4();
const turn = new Matrix4();

export function createFlapMesh(id: ShelfFolder, look: TwinLook): Mesh {
  const centre = folderCentre(id);
  const builder = new PartBuilder();
  const position: [number, number, number] = [centre.x, centre.y, centre.z + FOLDER.spine / 2 + FLAP_THICKNESS / 2];
  builder.add(new BoxGeometry(FOLDER.depth, FOLDER.height, FLAP_THICKNESS), look.palette.folders[id], { position }, OBJECT_ID[id]);
  const flap = new Mesh(builder.build(), look.material);
  flap.name = `desk-folder-flap-${id}`;
  flap.castShadow = look.shadows;
  flap.receiveShadow = look.shadows;
  if (look.depthMaterial) flap.customDepthMaterial = look.depthMaterial;
  flap.matrixAutoUpdate = false;
  flap.visible = false;
  flap.raycast = () => undefined;
  return flap;
}

export function flapPose(id: ShelfFolder, progress: number, pose: Matrix4, out: Matrix4): Matrix4 {
  const centre = folderCentre(id);
  const hingeX = centre.x - FOLDER.depth / 2;
  const hingeZ = centre.z + FOLDER.spine / 2;
  const angle = -ease((progress - FLAP_START) / (1 - FLAP_START)) * FLAP_OPEN;
  return out
    .copy(pose)
    .multiply(scratch.makeTranslation(hingeX, 0, hingeZ))
    .multiply(turn.makeRotationY(angle))
    .multiply(scratch.makeTranslation(-hingeX, 0, -hingeZ));
}

export function placeFlap(flap: Mesh, pose: Matrix4): void {
  flap.matrix.copy(pose).multiply(scratch.makeTranslation(-FOLDER_PARK, 0, 0));
  flap.matrixWorldNeedsUpdate = true;
  flap.visible = true;
}
