import { CanvasTexture, SRGBColorSpace, type Mesh, type MeshStandardMaterial, type Object3D, type Texture } from 'three';
import shorts from '../../../../content/product-shorts.json';
import { stackedLayout } from '../../../scenes/common';
import { PRODUCT_FIGURES } from '../../layout';
import { readProduct } from '../content';
import { drawBoard } from '../corkboard/print';
import { PRODUCT_CARD, stageCards, type ProductId } from '../layout';
import { PRINT_DENSITY, type PrintSurface } from '../paper';
import { drawStackedBoard } from './board';
import { drawStackedCard } from './card';
import { STACKED_CARDS } from './places';

const CARD_DENSITY = 8000;

type PrintMesh = Mesh<never, MeshStandardMaterial>;

interface CardPrint {
  id: ProductId;
  mesh: PrintMesh;
  wide: Texture | null;
  print: PrintSurface;
}

function surfaceOf(mesh: PrintMesh): PrintSurface {
  const texture = mesh.material.map as CanvasTexture;
  const canvas = texture.image as HTMLCanvasElement;
  return { canvas, context: canvas.getContext('2d')!, texture, scale: PRINT_DENSITY };
}

function cardSurface(): PrintSurface {
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(PRODUCT_CARD.width * CARD_DENSITY);
  canvas.height = Math.round(PRODUCT_CARD.height * CARD_DENSITY);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return { canvas, context: canvas.getContext('2d')!, texture, scale: CARD_DENSITY };
}

function printOn(mesh: PrintMesh, texture: Texture | null): void {
  mesh.material.map = texture;
  mesh.material.emissiveMap = texture;
}

function shortDescription(id: ProductId): string {
  const locale = document.documentElement.lang.startsWith('en') ? 'en' : 'es';
  return (shorts[locale] as Partial<Record<ProductId, string>>)[id] ?? readProduct(id).description;
}

export class StackedPrints {
  private readonly board: PrintSurface | null;
  private readonly cards: CardPrint[];
  private stacked = false;
  private cardsDrawn = false;
  private readonly onResize = (): void => {
    if (this.apply()) this.invalidate();
  };

  constructor(
    room: Object3D,
    private readonly invalidate: () => void
  ) {
    const board = room.getObjectByName('desk-corkboard-print') as PrintMesh | undefined;
    this.board = board ? surfaceOf(board) : null;
    this.cards = PRODUCT_FIGURES.flatMap(id => {
      const mesh = room.getObjectByName(`product-card-face-${id}`) as PrintMesh | undefined;
      return mesh ? [{ id, mesh, wide: null, print: cardSurface() }] : [];
    });
    if (this.apply()) invalidate();
    window.addEventListener('resize', this.onResize);
    void document.fonts?.ready.then(() => this.redraw());
  }

  private drawCards(): void {
    for (const card of this.cards) drawStackedCard(card.print, readProduct(card.id), shortDescription(card.id));
    this.cardsDrawn = true;
  }

  private redraw(): void {
    if (!this.stacked) return;
    if (this.board) drawStackedBoard(this.board);
    this.drawCards();
    this.invalidate();
  }

  private swapCards(): void {
    if (this.stacked && !this.cardsDrawn) this.drawCards();
    for (const card of this.cards) {
      card.wide ??= card.mesh.material.map;
      printOn(card.mesh, this.stacked ? card.print.texture : card.wide);
    }
  }

  apply(): boolean {
    const stacked = stackedLayout({ width: innerWidth, height: innerHeight });
    if (stacked === this.stacked) return false;
    this.stacked = stacked;
    stageCards(stacked ? STACKED_CARDS : null);
    if (this.board) (stacked ? drawStackedBoard : drawBoard)(this.board);
    this.swapCards();
    return true;
  }

  dispose(): void {
    window.removeEventListener('resize', this.onResize);
    stageCards(null);
    for (const card of this.cards) {
      if (card.wide) printOn(card.mesh, card.wide);
      card.print.texture.dispose();
    }
  }
}
