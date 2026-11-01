import {
  Group,
  Matrix4,
  Quaternion,
  Vector3,
  type CanvasTexture,
  type Mesh,
  type Material,
  type WebGLRenderer
} from 'three';
import { FOLDER, FOLDERS, OPEN_FOLDER, folderCentre, type FolderId } from '../layout';
import type { Palette } from '../props';
import {
  DURATION,
  FOLDER_PARK,
  OPEN_SHEET,
  OPEN_SHEET_FORWARD,
  OPEN_SHEET_LIFT,
  SHEET,
  type ShelfFolder
} from './constants';
import { aimOpenSheet, aimShelfFolder, shelfHoldPose } from './aim';
import { ease } from './ease';
import { drawSheet } from './sheet-canvas';
import { readPlate, type SheetContent } from './sheet-content';
import { createSheetMesh, createSheetTexture, createTwinMesh, type SheetMesh } from './mesh';

export interface FolderDetailOptions {
  material: Material;
  depthMaterial?: Material;
  shadows: boolean;
  palette: Palette;
  renderer: WebGLRenderer;
  onRedraw: () => void;
}

const scratch = new Matrix4();
const scratchQuaternion = new Quaternion();
const scratchPosition = new Vector3();
const ONE = new Vector3(1, 1, 1);

/**
 * Taking the folder you are looking at off the shelf: it slides out, turns its face to the camera
 * and shows a printed sheet with the job's highlights and stack. The TCS shot frames the open
 * folder on the desk instead, so there the sheet lifts off its right board.
 */
export class FolderDetail {
  readonly object3D = new Group();
  private readonly twins = new Map<ShelfFolder, Mesh>();
  private readonly canvas = document.createElement('canvas');
  private readonly texture: CanvasTexture;
  private readonly shelfSheet: SheetMesh;
  private readonly openSheet: SheetMesh;
  private readonly openFrame: Matrix4;
  /** The open-folder sheet hinges on its near edge, like a page lifted off the board. */
  private readonly openEdge = new Vector3(OPEN_FOLDER.width / 4, 0.0095, OPEN_SHEET.height / 2);
  private readonly openFlat = new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), -Math.PI / 2);
  private readonly openTaken = new Quaternion();
  private readonly openTakenEdge = new Vector3();
  private readonly targetAt = new Vector3();
  private readonly targetTurn = new Quaternion();
  private readonly pose = new Matrix4();
  private shown: FolderId | null = null;
  private content: SheetContent | null = null;
  private goal = 0;
  private progress = 0;

  constructor(private readonly options: FolderDetailOptions) {
    this.object3D.name = 'desk-folder-detail';
    for (const id of FOLDERS) {
      if (id === 'tcs') continue;
      const twin = createTwinMesh(id, options);
      this.twins.set(id, twin);
      this.object3D.add(twin);
    }
    this.texture = createSheetTexture(this.canvas);
    this.shelfSheet = createSheetMesh('desk-folder-sheet', this.texture, SHEET, false);
    this.openSheet = createSheetMesh('desk-open-folder-sheet', this.texture, OPEN_SHEET, true);
    this.object3D.add(this.shelfSheet, this.openSheet);
    this.openFrame = new Matrix4().compose(OPEN_FOLDER.centre, new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), OPEN_FOLDER.yaw), ONE);
    void document.fonts?.ready.then(() => this.redrawWithLoadedFonts());
  }

  private redrawWithLoadedFonts(): void {
    if (!this.content) return;
    drawSheet(this.canvas, this.content);
    this.texture.needsUpdate = true;
    this.options.onRedraw();
  }

  /** The folder out of the shelf (or on its way back), else null. */
  get active(): FolderId | null {
    return this.shown;
  }

  /** Takes the folder out, or puts it back when it is already out. `eye` is the shot's camera position. */
  toggle(id: FolderId, experience: string, eye: Vector3): void {
    if (this.shown === id) {
      this.goal = this.goal === 1 ? 0 : 1;
      return;
    }
    if (this.shown && this.progress > 0) return;
    this.shown = id;
    this.goal = 1;
    this.content = readPlate(id, experience);
    drawSheet(this.canvas, this.content);
    this.texture.needsUpdate = true;
    this.options.renderer.initTexture(this.texture);
    if (id === 'tcs') this.aimOpenSheet(eye);
    else aimShelfFolder(id, eye, this.targetAt, this.targetTurn);
  }

  close(): void {
    this.goal = 0;
  }

  /** Advances the 0.6 s take / return; instant without motion. Returns true while it moves. */
  update(dt: number, motion: boolean): boolean {
    if (!this.shown) return false;
    const before = this.progress;
    this.progress = motion ? Math.min(Math.max(this.progress + (this.goal ? dt : -dt) / DURATION, 0), 1) : this.goal;
    if (this.progress === 0 && this.goal === 0) {
      for (const twin of this.twins.values()) twin.visible = false;
      this.shelfSheet.visible = false;
      this.openSheet.visible = false;
      this.shown = null;
      return before !== 0;
    }
    if (this.shown === 'tcs') this.placeOpenSheet();
    return this.progress !== this.goal || before !== this.progress;
  }

  /** Changes only while the pose does, so the lamp shadow is re-rendered only then. */
  poseKey(): string {
    return this.shown && this.shown !== 'tcs' ? `${this.shown}:${Math.round(this.progress * 400)}` : '';
  }

  /**
   * World transform from the box's rest place to where the visitor holds it, or null when that box
   * sits on the shelf. Also places its twin and sheet.
   */
  shelfPose(id: FolderId, pull: number): Matrix4 | null {
    if (id !== this.shown || id === 'tcs' || this.progress === 0) return null;
    shelfHoldPose(id, this.progress, pull, this.targetAt, this.targetTurn, this.pose);
    this.placeTwinAndSheet(id);
    return this.pose;
  }

  private placeTwinAndSheet(id: ShelfFolder): void {
    const centre = folderCentre(id);
    const twin = this.twins.get(id)!;
    twin.matrix.copy(this.pose).multiply(scratch.makeTranslation(-FOLDER_PARK, 0, 0));
    twin.matrixWorldNeedsUpdate = true;
    twin.visible = true;
    this.shelfSheet.matrix
      .copy(this.pose)
      .multiply(scratch.makeTranslation(centre.x, centre.y - 0.004, centre.z + FOLDER.spine / 2 + 0.0025))
      .multiply(scratch.makeRotationZ(-0.012));
    this.shelfSheet.matrixWorldNeedsUpdate = true;
    this.shelfSheet.visible = true;
  }

  private aimOpenSheet(eye: Vector3): void {
    this.openTakenEdge.copy(this.openEdge).add(new Vector3(0, OPEN_SHEET_LIFT, OPEN_SHEET_FORWARD));
    aimOpenSheet(eye, this.openFrame, this.openTakenEdge, this.openFlat, this.openTaken);
  }

  private placeOpenSheet(): void {
    const t = ease(this.progress);
    const edge = scratchPosition.copy(this.openEdge).lerp(this.openTakenEdge, t);
    scratchQuaternion.copy(this.openFlat).slerp(this.openTaken, t);
    this.openSheet.matrix
      .multiplyMatrices(this.openFrame, scratch.compose(edge, scratchQuaternion, ONE))
      .multiply(scratch.makeTranslation(0, OPEN_SHEET.height / 2, 0));
    this.openSheet.matrixWorldNeedsUpdate = true;
    this.openSheet.material.opacity = Math.min(this.progress / 0.15, 1);
    this.openSheet.visible = true;
  }

  dispose(): void {
    for (const twin of this.twins.values()) twin.geometry.dispose();
    for (const sheet of [this.shelfSheet, this.openSheet]) {
      sheet.geometry.dispose();
      sheet.material.dispose();
    }
    this.texture.dispose();
    this.object3D.removeFromParent();
  }
}
