import { BoxGeometry, Group, Mesh, MeshBasicMaterial, MeshStandardMaterial, type Object3D } from 'three';
import { PRODUCT_FIGURES } from '../../layout';
import { readProduct } from '../content';
import { cardFaceMatrix, PRODUCT_CARD, type ProductId } from '../layout';
import { PAPER_LEVEL, printedFace, whenFontsReady, type PrintedFace } from '../paper';
import { drawProductCard } from './print';

/** Angular frequency of the raise spring, critically damped: it settles in about half a second. */
const OMEGA = 11;
const RAISED = 0.9;

interface Card {
  id: ProductId;
  group: Group;
  face: PrintedFace;
  pick: Mesh;
  raise: number;
  speed: number;
}

/** The product a focused figure stands for, or null when the focus isn't a product. */
export function productFocus(id: string | null): ProductId | null {
  return (PRODUCT_FIGURES as readonly string[]).includes(id ?? '') ? (id as ProductId) : null;
}

/** A lying card's link isn't offered: its pick box ignores the raycaster until the card stands. */
const skipRaycast = (): void => undefined;

function placed<T extends Object3D>(object: T, z: number): T {
  object.position.set(0, PRODUCT_CARD.height / 2, z);
  object.updateMatrix();
  object.matrixAutoUpdate = false;
  return object;
}

/**
 * The three product cards: printed paper lying on the desk in front of the plinth, each standing up
 * on its front edge to face the camera during its own product's shot and lying down again after.
 */
export class ProductCards {
  readonly object3D = new Group();
  private readonly cards: Card[];
  private readonly bodyGeometry = new BoxGeometry(PRODUCT_CARD.width, PRODUCT_CARD.height, PRODUCT_CARD.thickness);
  private readonly pickGeometry = new BoxGeometry(PRODUCT_CARD.width, PRODUCT_CARD.height, PRODUCT_CARD.thickness * 2);
  private readonly bodyMaterial = new MeshStandardMaterial({ color: 0xece5d3, roughness: 0.95, metalness: 0 });
  private readonly pickMaterial = new MeshBasicMaterial({ colorWrite: false, depthWrite: false });
  private readonly picks = new Map<ProductId, Object3D>();

  constructor() {
    this.object3D.name = 'product-cards';
    this.bodyMaterial.color.multiplyScalar(PAPER_LEVEL);
    this.cards = PRODUCT_FIGURES.map(id => this.build(id));
    this.pose();
  }

  private build(id: ProductId): Card {
    const group = new Group();
    group.name = `product-card-${id}`;
    group.matrixAutoUpdate = false;
    const face = printedFace(`product-card-face-${id}`, PRODUCT_CARD.width, PRODUCT_CARD.height);
    const body = placed(new Mesh(this.bodyGeometry, this.bodyMaterial), 0);
    body.castShadow = true;
    body.receiveShadow = true;
    const pick = placed(new Mesh(this.pickGeometry, this.pickMaterial), PRODUCT_CARD.thickness / 2);
    pick.name = `product-card-pick-${id}`;
    group.add(body, placed(face.mesh, PRODUCT_CARD.thickness / 2), pick);
    this.object3D.add(group);
    this.picks.set(id, pick);
    whenFontsReady(() => drawProductCard(face, readProduct(id)));
    return { id, group, face, pick, raise: 0, speed: 0 };
  }

  /** Eases each card up while its product is focused and down otherwise; true while one moves. */
  update(dt: number, focused: ProductId | null, motion: boolean): boolean {
    let moving = false;
    for (const card of this.cards) {
      const goal = card.id === focused ? 1 : 0;
      if (!motion) {
        card.raise = goal;
        card.speed = 0;
        continue;
      }
      const offset = card.raise - goal;
      const carry = (card.speed + OMEGA * offset) * dt;
      const decay = Math.exp(-OMEGA * dt);
      card.speed = (card.speed - OMEGA * carry) * decay;
      card.raise = goal + (offset + carry) * decay;
      if (Math.abs(card.raise - goal) < 1e-4 && Math.abs(card.speed) < 1e-3) {
        card.raise = goal;
        card.speed = 0;
      } else moving = true;
    }
    return moving;
  }

  /** Writes each card's matrix for its current raise, and lets its pick box be hit only while it stands. */
  pose(): void {
    for (const card of this.cards) {
      card.group.matrix.copy(cardFaceMatrix(card.id, card.raise));
      card.group.matrixWorldNeedsUpdate = true;
      card.pick.raycast = card.raise > RAISED ? Mesh.prototype.raycast : skipRaycast;
    }
  }

  isRaised(id: ProductId): boolean {
    return (this.cards.find(card => card.id === id)?.raise ?? 0) > RAISED;
  }

  /** One invisible box per card over its printed face, which the raycaster hits. */
  targets(): ReadonlyMap<ProductId, Object3D> {
    return this.picks;
  }

  /** Changes whenever a card moves enough for the lamp shadow to need a new render. */
  poseKey(): string {
    return this.cards.map(card => card.raise.toFixed(2)).join(',');
  }

  dispose(): void {
    for (const card of this.cards) card.face.dispose();
    this.bodyGeometry.dispose();
    this.pickGeometry.dispose();
    this.bodyMaterial.dispose();
    this.pickMaterial.dispose();
  }
}
