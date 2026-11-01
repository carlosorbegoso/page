import { CanvasTexture, Group, Matrix4, Mesh, MeshStandardMaterial, PlaneGeometry, Quaternion, SRGBColorSpace, Vector3 } from 'three';
import { drawSheet, drawSummarySheet } from '../folder-detail/sheet-canvas';
import { readExperience, type SheetContent } from '../folder-detail/sheet-content';
import { OPEN_FOLDER } from '../layout';

/* Mirrors buildOpenFolder in props/openFolder.ts: its sheets are baked into the atlas, so the print is laid over them. */
const BOARD_ROLL = 0.02;
const BOARD_TOP = 0.004;
const BOARD_WIDTH = OPEN_FOLDER.width / 2 - 0.004;
const RIGHT_SHEET = { width: BOARD_WIDTH - 0.03, depth: OPEN_FOLDER.depth - 0.03, lift: BOARD_TOP + 0.0029, yaw: -0.008 } as const;
const LEFT_SHEET = { width: BOARD_WIDTH - 0.036, depth: OPEN_FOLDER.depth - 0.05, at: new Vector3(0.002, BOARD_TOP + 0.0018, 0.008), yaw: 0.035 } as const;
/** The pocket covers the tucked sheet from this depth (board frame) towards the visitor. */
const POCKET_TOP = 0.004;
const CANVAS_WIDTH = 1024;
const UP = new Vector3(0, 1, 0);
const ONE = new Vector3(1, 1, 1);

interface PrintedSheet {
  mesh: Mesh<PlaneGeometry, MeshStandardMaterial>;
  canvas: HTMLCanvasElement;
  texture: CanvasTexture;
  draw: (canvas: HTMLCanvasElement, content: SheetContent) => void;
}

function boardMatrix(side: -1 | 1): Matrix4 {
  const folder = new Matrix4().compose(OPEN_FOLDER.centre, new Quaternion().setFromAxisAngle(UP, OPEN_FOLDER.yaw), ONE);
  const roll = new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), -side * BOARD_ROLL);
  return folder.multiply(new Matrix4().compose(new Vector3((side * OPEN_FOLDER.width) / 4, 0, 0), roll, ONE));
}

function printedSheet(name: string, width: number, depth: number, draw: PrintedSheet['draw']): PrintedSheet {
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = Math.round((CANVAS_WIDTH * depth) / width);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  const material = new MeshStandardMaterial({ map: texture, roughness: 0.9, metalness: 0, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  const geometry = new PlaneGeometry(width, depth).rotateX(-Math.PI / 2);
  const mesh = new Mesh(geometry, material);
  mesh.name = name;
  mesh.matrixAutoUpdate = false;
  mesh.receiveShadow = true;
  mesh.raycast = () => undefined;
  return { mesh, canvas, texture, draw };
}

function rightRest(): Matrix4 {
  const turn = new Quaternion().setFromAxisAngle(UP, RIGHT_SHEET.yaw);
  return boardMatrix(1).multiply(new Matrix4().compose(new Vector3(0, RIGHT_SHEET.lift, 0), turn, ONE));
}

/** Only the part of the tucked sheet above the pocket is printed over. */
function leftRest(visibleDepth: number): Matrix4 {
  const turn = new Quaternion().setFromAxisAngle(UP, LEFT_SHEET.yaw);
  const sheet = new Matrix4().compose(LEFT_SHEET.at, turn, ONE);
  const top = -LEFT_SHEET.depth / 2;
  return boardMatrix(-1).multiply(sheet).multiply(new Matrix4().makeTranslation(0, 0, top + visibleDepth / 2));
}

/**
 * TCS's real job printed on the open folder's top sheets: the full sheet on the right board and a
 * cover letter (the summary) tucked in the left pocket, which swings with the left board's hinge.
 */
export class OpenFolderPrint {
  readonly object3D = new Group();
  private readonly right: PrintedSheet;
  private readonly left: PrintedSheet;
  private readonly leftRest: Matrix4;
  private readonly scratch = new Matrix4();

  constructor() {
    this.object3D.name = 'desk-open-folder-print';
    const leftVisible = POCKET_TOP - LEFT_SHEET.at.z + LEFT_SHEET.depth / 2;
    this.right = printedSheet('desk-open-folder-print-right', RIGHT_SHEET.width, RIGHT_SHEET.depth, drawSheet);
    this.left = printedSheet('desk-open-folder-print-left', LEFT_SHEET.width, leftVisible, drawSummarySheet);
    this.right.mesh.matrix.copy(rightRest());
    this.leftRest = leftRest(leftVisible);
    this.left.mesh.matrix.copy(this.leftRest);
    this.object3D.add(this.right.mesh, this.left.mesh);
    this.redraw();
    void document.fonts?.ready.then(() => this.redraw());
  }

  private redraw(): void {
    const content = readExperience('tcs');
    for (const sheet of [this.right, this.left]) {
      sheet.draw(sheet.canvas, content);
      sheet.texture.needsUpdate = true;
    }
  }

  /** The left board's swing (rotation about `origin`), the same one the atlas applies to it. */
  applyHinge(rotation: Matrix4, origin: Vector3): void {
    this.left.mesh.matrix
      .makeTranslation(origin.x, origin.y, origin.z)
      .multiply(rotation)
      .multiply(this.scratch.makeTranslation(-origin.x, -origin.y, -origin.z))
      .multiply(this.leftRest);
    this.left.mesh.matrixWorldNeedsUpdate = true;
  }

  dispose(): void {
    for (const sheet of [this.right, this.left]) {
      sheet.mesh.geometry.dispose();
      sheet.mesh.material.dispose();
      sheet.texture.dispose();
    }
    this.object3D.removeFromParent();
  }
}
