import { Vector3 } from 'three';
import { FIGURE_HEIGHT, FIGURES, FOLDER, FOLDERS, OPEN_FOLDER, PHONE, folderCentre, type FigureId, type FolderId } from '../layout';

/** Footprints of the collectibles (pick proxies, SkyMek's wrench spans more), lifted while focused. */
const FIGURE_BOX: Record<FigureId, [number, number, number]> = {
  alfa: [0.08, 0.133, 0.07],
  skymek: [0.13, 0.08, 0.08],
  parati: [0.08, 0.08, 0.07],
  ventixs: [0.08, 0.08, 0.07]
};
const FIGURE_LIFT = 0.012;
/** Hover / current pull of a shelf box along +X (DeskSet `FOLDER_PULL`). */
export const FOLDER_PULL = 0.03;

function boxCorners(min: Vector3, max: Vector3): Vector3[] {
  const corners: Vector3[] = [];
  for (const x of [min.x, max.x]) for (const y of [min.y, max.y]) for (const z of [min.z, max.z]) corners.push(new Vector3(x, y, z));
  return corners;
}

export function figurePoints(id: FigureId): Vector3[] {
  const [width, height, depth] = FIGURE_BOX[id];
  const base = FIGURES[id];
  return boxCorners(
    new Vector3(base.x - width / 2, base.y, base.z - depth / 2),
    new Vector3(base.x + width / 2, base.y + Math.max(height, FIGURE_HEIGHT[id]) + FIGURE_LIFT, base.z + depth / 2)
  );
}

export function folderPoints(id: FolderId, pull: number): Vector3[] {
  const centre = folderCentre(id);
  return boxCorners(
    new Vector3(centre.x - FOLDER.depth / 2, centre.y - FOLDER.height / 2, centre.z - FOLDER.spine / 2),
    new Vector3(centre.x + FOLDER.depth / 2 + pull, centre.y + FOLDER.height / 2, centre.z + FOLDER.spine / 2)
  );
}

/** The archive cover sheet on the first box's outer face (spines.ts), slid out with its box. */
export function coverPoints(pull: number): Vector3[] {
  const first = folderCentre(FOLDERS[0]);
  const z = first.z + FOLDER.spine / 2;
  const halfWidth = (FOLDER.depth * 0.72) / 2;
  const halfHeight = (FOLDER.height * 0.72) / 2;
  return boxCorners(new Vector3(first.x - halfWidth, first.y + 0.005 - halfHeight, z), new Vector3(first.x + halfWidth + pull, first.y + 0.005 + halfHeight, z));
}

export function openFolderPoints(): Vector3[] {
  const { centre, width, depth, yaw } = OPEN_FOLDER;
  const across = new Vector3(Math.cos(yaw), 0, -Math.sin(yaw)).multiplyScalar(width / 2);
  const along = new Vector3(Math.sin(yaw), 0, Math.cos(yaw)).multiplyScalar(depth / 2);
  const corners: Vector3[] = [];
  for (const a of [-1, 1]) for (const b of [-1, 1]) for (const y of [0, 0.02]) corners.push(centre.clone().addScaledVector(across, a).addScaledVector(along, b).setY(centre.y + y));
  return corners;
}

export function centreOf(points: Vector3[]): Vector3 {
  const min = points[0]!.clone();
  const max = points[0]!.clone();
  for (const point of points) {
    min.min(point);
    max.max(point);
  }
  return min.add(max).multiplyScalar(0.5);
}

/** Every collectible except `ids`, each as its own group of points. */
export function othersThan(...ids: FigureId[]): Vector3[][] {
  return (Object.keys(FIGURES) as FigureId[]).filter(id => !ids.includes(id)).map(figurePoints);
}

/** Foreground props that must not stand in front of the subjects: the phone on its stand. */
export const OCCLUDERS: Vector3[][] = [
  boxCorners(new Vector3(PHONE.base.x - 0.05, PHONE.base.y, PHONE.base.z - 0.05), new Vector3(PHONE.base.x + 0.05, PHONE.base.y + 0.16, PHONE.base.z + 0.05))
];
