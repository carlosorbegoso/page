import {
  CanvasTexture,
  Color,
  Euler,
  Group,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Quaternion,
  SRGBColorSpace,
  Vector3,
  type Material,
  type WebGLRenderer
} from 'three';
import { FOLDER, FOLDERS, OPEN_FOLDER, folderCentre, type FolderId } from '../layout';
import type { Palette } from '../props';
import {
  CLEAR_X,
  DURATION,
  FACE_TURN,
  FOLDER_PARK,
  HOLD_LEAN,
  LIFT,
  MAX_FORWARD,
  NEARER,
  OPEN_SHEET,
  OPEN_SHEET_FORWARD,
  OPEN_SHEET_LIFT,
  SHEET,
  SHEET_LEVEL,
  SLIDE_END,
  TURN_START,
  type ShelfFolder
} from './constants';
import { ease } from './ease';
import { CANVAS, drawSheet } from './sheet-canvas';
import { readPlate, type SheetContent } from './sheet-content';
import { buildTwin } from './twin';

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
const IDENTITY = new Quaternion();
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
  private readonly shelfSheet: Mesh<PlaneGeometry, MeshBasicMaterial>;
  private readonly openSheet: Mesh<PlaneGeometry, MeshBasicMaterial>;
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
      const geometry = buildTwin(id, options.palette).build();
      const twin = new Mesh(geometry, options.material);
      twin.name = `desk-folder-twin-${id}`;
      twin.castShadow = options.shadows;
      twin.receiveShadow = options.shadows;
      if (options.depthMaterial) twin.customDepthMaterial = options.depthMaterial;
      twin.matrixAutoUpdate = false;
      twin.visible = false;
      twin.raycast = () => undefined;
      this.twins.set(id, twin);
      this.object3D.add(twin);
    }
    this.canvas.width = CANVAS.width;
    this.canvas.height = CANVAS.height;
    this.texture = new CanvasTexture(this.canvas);
    this.texture.colorSpace = SRGBColorSpace;
    this.texture.anisotropy = 8;
    const sheet = (size: { width: number; height: number }, transparent: boolean) => {
      const material = new MeshBasicMaterial({ map: this.texture, color: new Color(SHEET_LEVEL, SHEET_LEVEL, SHEET_LEVEL), transparent });
      const mesh = new Mesh(new PlaneGeometry(size.width, size.height), material);
      mesh.matrixAutoUpdate = false;
      mesh.visible = false;
      mesh.raycast = () => undefined;
      this.object3D.add(mesh);
      return mesh;
    };
    this.shelfSheet = sheet(SHEET, false);
    this.shelfSheet.name = 'desk-folder-sheet';
    this.openSheet = sheet(OPEN_SHEET, true);
    this.openSheet.name = 'desk-open-folder-sheet';
    this.openFrame = new Matrix4().compose(OPEN_FOLDER.centre, new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), OPEN_FOLDER.yaw), ONE);
    void document.fonts?.ready.then(() => {
      if (!this.content) return;
      drawSheet(this.canvas, this.content);
      this.texture.needsUpdate = true;
      options.onRedraw();
    });
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
    else this.aimShelfFolder(id, eye);
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
    const centre = folderCentre(id);
    const slide = ease(this.progress / SLIDE_END);
    const turn = ease((this.progress - TURN_START) / (1 - TURN_START));
    const fromX = centre.x + pull;
    scratchPosition.set(
      fromX + (this.targetAt.x - fromX) * slide,
      centre.y + (this.targetAt.y - centre.y) * slide,
      centre.z + (this.targetAt.z - centre.z) * turn
    );
    scratchQuaternion.copy(IDENTITY).slerp(this.targetTurn, turn);
    this.pose.compose(scratchPosition, scratchQuaternion, ONE).multiply(scratch.makeTranslation(-centre.x, -centre.y, -centre.z));
    const twin = this.twins.get(id as ShelfFolder)!;
    twin.matrix.copy(this.pose).multiply(scratch.makeTranslation(-FOLDER_PARK, 0, 0));
    twin.matrixWorldNeedsUpdate = true;
    twin.visible = true;
    this.shelfSheet.matrix
      .copy(this.pose)
      .multiply(scratch.makeTranslation(centre.x, centre.y - 0.004, centre.z + FOLDER.spine / 2 + 0.0025))
      .multiply(scratch.makeRotationZ(-0.012));
    this.shelfSheet.matrixWorldNeedsUpdate = true;
    this.shelfSheet.visible = true;
    return this.pose;
  }

  private aimShelfFolder(id: FolderId, eye: Vector3): void {
    const centre = folderCentre(id);
    const forward = scratchPosition.copy(folderCentre(id)).setX(centre.x + FOLDER.depth / 2).sub(eye).setY(0);
    const distance = forward.length();
    forward.normalize();
    const x = Math.max(CLEAR_X, centre.x);
    const nearer = distance * NEARER;
    const z = Math.abs(forward.z) > 0.3 ? eye.z + (nearer - (x - eye.x) * forward.x) / forward.z : centre.z;
    this.targetAt.set(x, centre.y + LIFT, centre.z + Math.min(Math.max(z - centre.z, 0), MAX_FORWARD));
    const toEye = eye.clone().sub(this.targetAt);
    const yaw = Math.atan2(toEye.x, toEye.z) * FACE_TURN;
    const elevation = Math.asin(Math.min(Math.max(toEye.y / toEye.length(), -1), 1));
    this.targetTurn.setFromEuler(new Euler(-elevation * FACE_TURN - HOLD_LEAN, yaw, 0, 'YXZ'));
  }

  private aimOpenSheet(eye: Vector3): void {
    this.openTakenEdge.copy(this.openEdge).add(new Vector3(0, OPEN_SHEET_LIFT, OPEN_SHEET_FORWARD));
    const local = eye.clone().applyMatrix4(scratch.copy(this.openFrame).invert()).sub(this.openTakenEdge).normalize();
    const facing = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), local);
    this.openTaken.copy(IDENTITY).slerp(facing, 0.85).multiply(this.openFlat);
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
