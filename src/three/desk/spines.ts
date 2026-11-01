import { CanvasTexture, Matrix4, Mesh, MeshStandardMaterial, PlaneGeometry, SRGBColorSpace, Vector3 } from 'three';
import { FOLDER, FOLDERS, folderCentre, type FolderId } from './layout';

/** What an archive box says on its paper label: the company and its years, read bottom to top. */
const SPINE_TEXT: Record<FolderId, [string, string]> = {
  sysarp: ['SYSARP', '2020 – 2021'],
  baufest: ['BAUFEST', '2022 – 2024'],
  intercorp: ['INTERCORP', '2024 – 2025'],
  tcs: ['TCS · BCP', '2025 →']
};

/** Paper label on each spine, matching `buildShelf` in props.ts. */
export const SPINE_LABEL = { length: 0.15, width: FOLDER.spine * 0.62, lift: 0.055 } as const;

const ROW = 256;
const WIDTH = 1024;

function drawLabels(canvas: HTMLCanvasElement): void {
  const context = canvas.getContext('2d')!;
  const root = getComputedStyle(document.documentElement);
  const display = root.getPropertyValue('--font-display').trim() || 'system-ui, sans-serif';
  const mono = root.getPropertyValue('--font-mono').trim() || 'ui-monospace, monospace';
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#1c2230';
  context.textBaseline = 'middle';
  FOLDERS.forEach((id, row) => {
    const [name, years] = SPINE_TEXT[id];
    const y = row * ROW + ROW / 2;
    context.font = `600 120px ${display}`;
    context.fillText(name, 48, y + 6, 600);
    context.font = `500 54px ${mono}`;
    context.textAlign = 'right';
    context.fillText(years, WIDTH - 48, y + 6);
    context.textAlign = 'left';
  });
}

export interface SpineLabels {
  /** One mesh per folder so a label slides out with its box. */
  meshes: Map<FolderId, Mesh>;
  dispose(): void;
}

/** Printed text over the paper labels of the four folders, sharing one texture. */
export function createSpineLabels(): SpineLabels {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = ROW * FOLDERS.length;
  drawLabels(canvas);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  void document.fonts?.ready.then(() => {
    drawLabels(canvas);
    texture.needsUpdate = true;
  });
  const textUp = new Matrix4().makeBasis(new Vector3(0, 1, 0), new Vector3(0, 0, 1), new Vector3(1, 0, 0));
  const material = new MeshStandardMaterial({ map: texture, transparent: true, roughness: 0.85, metalness: 0, depthWrite: false });
  const meshes = new Map<FolderId, Mesh>();
  FOLDERS.forEach((id, row) => {
    const plane = new PlaneGeometry(SPINE_LABEL.length, SPINE_LABEL.width);
    const uv = plane.getAttribute('uv');
    for (let i = 0; i < uv.count; i++) uv.setY(i, 1 - (row + 1 - uv.getY(i)) / FOLDERS.length);
    const centre = folderCentre(id);
    const at = new Vector3(centre.x + FOLDER.depth / 2 + 0.0032, centre.y + SPINE_LABEL.lift, centre.z);
    plane.applyMatrix4(new Matrix4().copy(textUp).setPosition(at));
    const mesh = new Mesh(plane, material);
    mesh.name = `desk-spine-label-${id}`;
    mesh.raycast = () => undefined;
    meshes.set(id, mesh);
  });
  return {
    meshes,
    dispose: () => {
      for (const mesh of meshes.values()) mesh.geometry.dispose();
      material.dispose();
      texture.dispose();
    }
  };
}
