import { Matrix4, Quaternion, Vector3 } from 'three';
import { DESK, PRODUCT_FIGURES } from '../layout';

export interface FaceRect {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
}

export type ProductId = (typeof PRODUCT_FIGURES)[number];

const X = new Vector3(1, 0, 0);
const UP = new Vector3(0, 1, 0);
const ONE = new Vector3(1, 1, 1);

export const CORKBOARD = {
  base: new Vector3(0.33, DESK.top, -0.296),
  width: 0.34,
  height: 0.3,
  lean: 0.008,
  frame: 0.012,
  depth: 0.014
} as const;

export const BOARD_LAYOUT = {
  title: { x: 0.118, y: 0.236, width: 0.205, height: 0.05 },
  note: { x: 0.122, y: 0.142, width: 0.2, height: 0.086, rotation: -0.025 },
  alfa: { x: 0.246, y: 0.062, width: 0.082, height: 0.07, rotation: -0.04 },
  postits: {
    skymek: { x: 0.02, y: 0.212, width: 0.085, height: 0.07, rotation: 0.05 },
    parati: { x: 0.02, y: 0.137, width: 0.085, height: 0.07, rotation: -0.04 },
    ventixs: { x: 0.02, y: 0.062, width: 0.085, height: 0.07, rotation: 0.03 }
  }
} as const satisfies { title: FaceRect; note: FaceRect; alfa: FaceRect; postits: Record<ProductId, FaceRect> };

export function boardFaceMatrix(): Matrix4 {
  const lean = new Quaternion().setFromAxisAngle(X, -CORKBOARD.lean);
  const centreBottom = new Matrix4().compose(CORKBOARD.base, lean, ONE);
  return centreBottom.multiply(new Matrix4().makeTranslation(-CORKBOARD.width / 2, 0, 0));
}

export function boardPoint(x: number, y: number, lift = 0): Vector3 {
  return new Vector3(x, y, lift).applyMatrix4(boardFaceMatrix());
}

export const PRODUCT_CARD = {
  width: 0.1,
  height: 0.115,
  thickness: 0.0016,
  lean: 0.26
} as const;

export const CARD_PLACES: Record<ProductId, { hinge: Vector3; yaw: number }> = {
  skymek: { hinge: new Vector3(0.07, DESK.top, 0.03), yaw: -0.244 },
  ventixs: { hinge: new Vector3(0.3, DESK.top, 0.03), yaw: -0.105 },
  parati: { hinge: new Vector3(0.64, DESK.top, 0.03), yaw: -0.3 }
};

export function cardFaceMatrix(id: ProductId, raise: number): Matrix4 {
  const { hinge, yaw } = CARD_PLACES[id];
  const tilt = -(PRODUCT_CARD.lean + (1 - Math.min(Math.max(raise, 0), 1)) * (Math.PI / 2 - PRODUCT_CARD.lean));
  const rotation = new Quaternion().setFromAxisAngle(UP, yaw).multiply(new Quaternion().setFromAxisAngle(X, tilt));
  return new Matrix4().compose(hinge.clone().add(new Vector3(0, PRODUCT_CARD.thickness, 0)), rotation, ONE);
}

export function cardCorners(id: ProductId, raise = 1): Vector3[] {
  const frame = cardFaceMatrix(id, raise);
  const half = PRODUCT_CARD.width / 2;
  return [
    [-half, 0],
    [half, 0],
    [half, PRODUCT_CARD.height],
    [-half, PRODUCT_CARD.height]
  ].map(([x, y]) => new Vector3(x, y, 0).applyMatrix4(frame));
}

export function boardCorners(): Vector3[] {
  return [
    [0, 0],
    [CORKBOARD.width, 0],
    [CORKBOARD.width, CORKBOARD.height],
    [0, CORKBOARD.height]
  ].map(([x, y]) => boardPoint(x!, y!));
}
