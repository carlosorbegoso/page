import {
  Group,
  Matrix4,
  Quaternion,
  Vector3,
  type CanvasTexture,
  type Mesh,
  type MeshBasicMaterial,
  type Material,
  type PlaneGeometry,
  type PerspectiveCamera,
  type WebGLRenderer
} from 'three';
import { FOLDER, FOLDERS, folderCentre, type FolderId } from '../layout';
import type { Palette } from '../props';
import { DURATION, FLAP_THICKNESS, FOLDER_PARK, OPEN_SHEET, SHEET, type ShelfFolder } from './constants';
import { aimShelfFolder, shelfHoldPose } from './aim';
import { ease } from './ease';
import { createFlapMesh, flapPose, placeFlap } from './flap';
import { createFlapInside } from './flap-inside';
import { createSheetMesh, createSheetTexture, createTwinMesh, type SheetMesh } from './mesh';
import { listenOutsideClick } from './outside-click';
import { OPEN_SHEET_EDGE, OPEN_SHEET_FLAT, OPEN_SHEET_TAKEN_EDGE, sheetMatrix, takenSheetTurn } from './open-sheet-pose';
import { stackedLayout } from '../../scenes/common';
import { drawSheet } from './sheet-canvas';
import { drawStackedSheet } from './sheet-stacked';
import { readExperience, type SheetContent } from './sheet-content';

export interface FolderDetailOptions {
  material: Material;
  depthMaterial?: Material;
  shadows: boolean;
  palette: Palette;
  renderer: WebGLRenderer;
  camera: PerspectiveCamera;
  onRedraw: () => void;
}

const scratch = new Matrix4();
const scratchQuaternion = new Quaternion();
const scratchPosition = new Vector3();

function disposeInside(flap: Mesh): void {
  for (const child of flap.children as Mesh<PlaneGeometry, MeshBasicMaterial>[]) {
    child.geometry.dispose();
    child.material.map?.dispose();
    child.material.dispose();
  }
}

export class FolderDetail {
  readonly object3D = new Group();
  private readonly twins = new Map<ShelfFolder, Mesh>();
  private readonly flaps = new Map<ShelfFolder, Mesh>();
  private readonly flapMatrix = new Matrix4();
  private readonly stopOutsideClick: () => void;
  private toggledAt = -Infinity;
  private readonly canvas = document.createElement('canvas');
  private readonly texture: CanvasTexture;
  private readonly shelfSheet: SheetMesh;
  private readonly openSheet: SheetMesh;
  private readonly openTaken = new Quaternion();
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
      const flap = createFlapMesh(id, options);
      flap.add(createFlapInside(id, options.palette));
      this.twins.set(id, twin);
      this.flaps.set(id, flap);
      this.object3D.add(twin, flap);
    }
    this.texture = createSheetTexture(this.canvas);
    this.shelfSheet = createSheetMesh('desk-folder-sheet', this.texture, SHEET, false);
    this.openSheet = createSheetMesh('desk-open-folder-sheet', this.texture, OPEN_SHEET, true);
    this.object3D.add(this.shelfSheet, this.openSheet);
    void document.fonts?.ready.then(() => this.redrawWithLoadedFonts());
    this.stopOutsideClick = listenOutsideClick({
      isOut: () => this.shown !== null && this.goal === 1,
      lastToggle: () => this.toggledAt,
      close: () => {
        this.close();
        this.options.onRedraw();
      }
    });
  }

  private redrawWithLoadedFonts(): void {
    if (!this.content) return;
    this.drawContent(this.content);
    this.options.onRedraw();
  }

  private drawContent(content: SheetContent): void {
    const stacked = this.shown === 'tcs' && stackedLayout({ width: innerWidth, height: innerHeight });
    (stacked ? drawStackedSheet : drawSheet)(this.canvas, content);
    this.texture.needsUpdate = true;
  }

  get active(): FolderId | null {
    return this.shown;
  }

  get heldFocus(): Vector3 | null {
    return this.shown && this.shown !== 'tcs' && this.goal === 1 ? this.targetAt : null;
  }

  toggle(id: FolderId, eye: Vector3): void {
    this.toggledAt = performance.now();
    if (this.shown === id) {
      this.goal = this.goal === 1 ? 0 : 1;
      return;
    }
    if (this.shown && this.progress > 0) return;
    this.shown = id;
    this.goal = 1;
    this.content = readExperience(id);
    this.drawContent(this.content);
    this.options.renderer.initTexture(this.texture);
    if (id === 'tcs') takenSheetTurn(eye, this.openTaken);
    else aimShelfFolder(id, this.options.camera, this.targetAt, this.targetTurn);
  }

  close(): void {
    this.goal = 0;
  }

  update(dt: number, motion: boolean): boolean {
    if (!this.shown) return false;
    const before = this.progress;
    this.progress = motion ? Math.min(Math.max(this.progress + (this.goal ? dt : -dt) / DURATION, 0), 1) : this.goal;
    if (this.progress === 0 && this.goal === 0) {
      for (const twin of this.twins.values()) twin.visible = false;
      for (const flap of this.flaps.values()) flap.visible = false;
      this.shelfSheet.visible = false;
      this.openSheet.visible = false;
      this.shown = null;
      return before !== 0;
    }
    if (this.shown === 'tcs') this.placeOpenSheet();
    return this.progress !== this.goal || before !== this.progress;
  }

  poseKey(): string {
    return this.shown && this.shown !== 'tcs' ? `${this.shown}:${Math.round(this.progress * 400)}` : '';
  }

  shelfPose(id: FolderId, pull: number): Matrix4 | null {
    if (id !== this.shown || id === 'tcs' || this.progress === 0) return null;
    shelfHoldPose(id, this.progress, pull, this.targetAt, this.targetTurn, this.pose);
    this.placeTwinAndSheet(id);
    return this.pose;
  }

  coverPose(id: FolderId): Matrix4 | null {
    if (id !== this.shown || id === 'tcs' || this.progress === 0) return null;
    return flapPose(id, this.progress, this.pose, this.flapMatrix);
  }

  private placeTwinAndSheet(id: ShelfFolder): void {
    const centre = folderCentre(id);
    const twin = this.twins.get(id)!;
    twin.matrix.copy(this.pose).multiply(scratch.makeTranslation(-FOLDER_PARK, 0, 0));
    twin.matrixWorldNeedsUpdate = true;
    twin.visible = true;
    placeFlap(this.flaps.get(id)!, flapPose(id, this.progress, this.pose, this.flapMatrix));
    this.shelfSheet.matrix
      .copy(this.pose)
      .multiply(scratch.makeTranslation(centre.x, centre.y - 0.004, centre.z + FOLDER.spine / 2 + FLAP_THICKNESS * 0.4))
      .multiply(scratch.makeRotationZ(-0.012));
    this.shelfSheet.matrixWorldNeedsUpdate = true;
    this.shelfSheet.visible = true;
  }

  private placeOpenSheet(): void {
    const t = ease(this.progress);
    const edge = scratchPosition.copy(OPEN_SHEET_EDGE).lerp(OPEN_SHEET_TAKEN_EDGE, t);
    sheetMatrix(edge, scratchQuaternion.copy(OPEN_SHEET_FLAT).slerp(this.openTaken, t), this.openSheet.matrix);
    this.openSheet.matrixWorldNeedsUpdate = true;
    this.openSheet.material.opacity = Math.min(this.progress / 0.15, 1);
    this.openSheet.visible = true;
  }

  dispose(): void {
    this.stopOutsideClick();
    for (const mesh of [...this.twins.values(), ...this.flaps.values()]) mesh.geometry.dispose();
    for (const flap of this.flaps.values()) disposeInside(flap);
    for (const sheet of [this.shelfSheet, this.openSheet]) {
      sheet.geometry.dispose();
      sheet.material.dispose();
    }
    this.texture.dispose();
    this.object3D.removeFromParent();
  }
}
