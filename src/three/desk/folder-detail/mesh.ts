import { CanvasTexture, Color, Mesh, MeshBasicMaterial, PlaneGeometry, SRGBColorSpace, type Material } from 'three';
import type { Palette } from '../props';
import { SHEET_LEVEL, type ShelfFolder } from './constants';
import { CANVAS } from './sheet-canvas';
import { buildTwin } from './twin';

export type SheetMesh = Mesh<PlaneGeometry, MeshBasicMaterial>;

export interface TwinLook {
  material: Material;
  depthMaterial?: Material;
  shadows: boolean;
  palette: Palette;
}

function hideFromPointer(mesh: Mesh): void {
  mesh.matrixAutoUpdate = false;
  mesh.visible = false;
  mesh.raycast = () => undefined;
}

export function createTwinMesh(id: ShelfFolder, look: TwinLook): Mesh {
  const twin = new Mesh(buildTwin(id, look.palette).build(), look.material);
  twin.name = `desk-folder-twin-${id}`;
  twin.castShadow = look.shadows;
  twin.receiveShadow = look.shadows;
  if (look.depthMaterial) twin.customDepthMaterial = look.depthMaterial;
  hideFromPointer(twin);
  return twin;
}

export function createSheetTexture(canvas: HTMLCanvasElement): CanvasTexture {
  canvas.width = CANVAS.width;
  canvas.height = CANVAS.height;
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

export function createSheetMesh(name: string, texture: CanvasTexture, size: { width: number; height: number }, transparent: boolean): SheetMesh {
  const material = new MeshBasicMaterial({ map: texture, color: new Color(SHEET_LEVEL, SHEET_LEVEL, SHEET_LEVEL), transparent });
  const mesh = new Mesh(new PlaneGeometry(size.width, size.height), material);
  mesh.name = name;
  hideFromPointer(mesh);
  return mesh;
}
