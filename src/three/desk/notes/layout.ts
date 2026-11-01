import { Matrix4, Quaternion, Vector3 } from 'three';
import { DESK, PRODUCT_FIGURES } from '../layout';

/** A rectangle on a printed face, in metres from its bottom-left corner, turned by `rotation` radians about its centre. */
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

/**
 * TUSOCIO's cork board, standing on the desk behind the plinth against the wall under the window
 * (the wall's room face is at z −0.35; the window recess starts at the sill, y 0.95). It stays left
 * of the clock (x ≥ 0.51) and the lamp base, and Alfa stands in front of its lower middle.
 */
export const CORKBOARD = {
  /** Centre of the bottom edge of the front face, on the desk. */
  base: new Vector3(0.33, DESK.top, -0.332),
  width: 0.34,
  height: 0.3,
  /** Lean back from vertical, radians. */
  lean: 0.008,
  /** Width of the wooden frame around the cork. */
  frame: 0.012,
  depth: 0.014
} as const;

/**
 * Where each piece is pinned on the board face (x right, y up). From the company shot Alfa covers the
 * lower middle, Burbu the lower right and the wrench the lower left corner, so the post-its run down
 * the left, the title and the note take the top right, and the Alfa card sits low right, by the robot.
 */
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

/** Board face frame: origin at the bottom-left corner of the front face, x right, y up the board, z out of it. */
export function boardFaceMatrix(): Matrix4 {
  const lean = new Quaternion().setFromAxisAngle(X, -CORKBOARD.lean);
  const centreBottom = new Matrix4().compose(CORKBOARD.base, lean, ONE);
  return centreBottom.multiply(new Matrix4().makeTranslation(-CORKBOARD.width / 2, 0, 0));
}

/** World point of (x, y) metres on the board face, `lift` metres in front of it. */
export function boardPoint(x: number, y: number, lift = 0): Vector3 {
  return new Vector3(x, y, lift).applyMatrix4(boardFaceMatrix());
}

/**
 * Product cards: a printed card per product lying flat on the desk in front of the plinth, which
 * stands up on its front edge to face the camera in that product's shot (and lies down again after),
 * so it never hides the figures in the other shots.
 */
export const PRODUCT_CARD = {
  width: 0.1,
  /** Height of the card when it stands (its length when it lies). */
  height: 0.115,
  thickness: 0.0016,
  /** Lean back from vertical when standing, about the shots' downward pitch, radians. */
  lean: 0.26
} as const;

/**
 * Front edge centre of each card on the desk, and its yaw: the card faces its shot's heading
 * (skymek 14°, parati −12°, ventixs 6°), screen-left of its figure and clear of it in every frontal view.
 */
export const CARD_PLACES: Record<ProductId, { hinge: Vector3; yaw: number }> = {
  skymek: { hinge: new Vector3(0.07, DESK.top, 0.03), yaw: -0.244 },
  ventixs: { hinge: new Vector3(0.33, DESK.top, 0.03), yaw: -0.105 },
  parati: { hinge: new Vector3(0.512, DESK.top, 0.03), yaw: 0.209 }
};

/**
 * Card face frame for a raise of 0 (lying, face up, reaching back towards the plinth) to 1 (standing):
 * origin at the centre of the front edge, x across the card, y up the card, z out of the printed face.
 */
export function cardFaceMatrix(id: ProductId, raise: number): Matrix4 {
  const { hinge, yaw } = CARD_PLACES[id];
  const tilt = -(PRODUCT_CARD.lean + (1 - Math.min(Math.max(raise, 0), 1)) * (Math.PI / 2 - PRODUCT_CARD.lean));
  const rotation = new Quaternion().setFromAxisAngle(UP, yaw).multiply(new Quaternion().setFromAxisAngle(X, tilt));
  return new Matrix4().compose(hinge.clone().add(new Vector3(0, PRODUCT_CARD.thickness, 0)), rotation, ONE);
}

/** The four corners of a card's face at a raise, for framing it in a shot. */
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

/** The four corners of the board face, for framing it in the company shot. */
export function boardCorners(): Vector3[] {
  return [
    [0, 0],
    [CORKBOARD.width, 0],
    [CORKBOARD.width, CORKBOARD.height],
    [0, CORKBOARD.height]
  ].map(([x, y]) => boardPoint(x!, y!));
}
