import {
  BoxGeometry,
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
  TorusGeometry,
  Vector3,
  type Material,
  type Object3D,
  type WebGLRenderer
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { OBJECT_ID, PartBuilder } from './builder';
import { FOLDER, FOLDERS, OPEN_FOLDER, SHELF, folderCentre, type FolderId } from './layout';
import type { Palette } from './props';
import { SPINE_LABEL, SPINE_TEXT } from './spines';

/**
 * Pull that parks a shelf box behind the left wall while its twin is in the visitor's hands: the
 * box is baked into the room atlas, which can only slide objects along +X, never turn them.
 */
export const FOLDER_PARK = -(FOLDER.depth + 0.04);

const DURATION = 0.6;
const SLIDE_END = 0.55;
const TURN_START = 0.4;
/** Lowest centre X at which a turned box clears the stack still on the shelf. */
const CLEAR_X = SHELF.x + SHELF.depth + FOLDER.depth / 2 + 0.012;
const LIFT = 0.03;
/** Share of the shot distance the box is brought towards the camera. */
const NEARER = 0.76;
const MAX_FORWARD = 0.36;
const FACE_TURN = 0.92;
const HOLD_LEAN = 0.06;

const SHEET = { width: FOLDER.depth * 0.84, height: FOLDER.height * 0.86 } as const;
const OPEN_SHEET = { width: SHEET.width * 0.78, height: SHEET.height * 0.78 } as const;
const OPEN_SHEET_LIFT = 0.012;
const OPEN_SHEET_FORWARD = 0.02;
/** Unlit like the archive cover: a lit sheet on a shelf face reads as a dark hole at night. */
const SHEET_LEVEL = 0.42;
const CANVAS = { width: 1024, height: Math.round((1024 * SHEET.height) / SHEET.width) } as const;
const MARGIN = 72;
const INK = '#1c2230';
const MUTED = '#5b6172';
const PAPER = '#ece5d3';
const MARK = '#8a5a2b';

type ShelfFolder = Exclude<FolderId, 'tcs'>;

interface SheetContent {
  company: string;
  years: string;
  role: string;
  highlightsTitle: string;
  highlights: string[];
  stackTitle: string;
  stack: string[];
}

function ease(t: number): number {
  const x = Math.min(Math.max(t, 0), 1);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function plainText(node: Element | null): string {
  if (!node) return '';
  const copy = node.cloneNode(true) as Element;
  for (const hidden of copy.querySelectorAll('[aria-hidden="true"]')) hidden.remove();
  return (copy.textContent ?? '').replace(/\s+/g, ' ').trim();
}

/** Reads the job's highlights and stack from its experience plate, so the sheet never drifts from the content. */
function readPlate(folder: FolderId, experience: string): SheetContent {
  const plate = document.querySelector<HTMLElement>(`[data-plate][data-experience="${CSS.escape(experience)}"]`);
  const [spineName, years] = SPINE_TEXT[folder];
  const english = document.documentElement.lang.startsWith('en');
  const items = (selector: string) => [...(plate?.querySelectorAll(selector) ?? [])].map(plainText).filter(Boolean);
  return {
    company: plainText(plate?.querySelector('h3') ?? null) || spineName,
    years,
    role: plainText(plate?.querySelector('h3 + p') ?? null),
    highlightsTitle: plainText(plate?.querySelector('p[id$="-highlights"]') ?? null) || (english ? 'Highlights' : 'Logros'),
    highlights: items('ul.list-disc > li').slice(0, 3),
    stackTitle: plainText(plate?.querySelector('p[id$="-stack"]') ?? null) || (english ? 'Tech' : 'Tecnologías'),
    stack: items('[data-kinetic-cascade] > li')
  };
}

function wrap(context: CanvasRenderingContext2D, text: string, width: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(' ')) {
    const next = line ? `${line} ${word}` : word;
    if (line && context.measureText(next).width > width) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

function drawSheet(canvas: HTMLCanvasElement, content: SheetContent): void {
  const context = canvas.getContext('2d')!;
  const root = getComputedStyle(document.documentElement);
  const display = root.getPropertyValue('--font-display').trim() || 'system-ui, sans-serif';
  const mono = root.getPropertyValue('--font-mono').trim() || 'ui-monospace, monospace';
  const { width, height } = canvas;
  const text = width - MARGIN * 2;
  context.fillStyle = PAPER;
  context.fillRect(0, 0, width, height);
  context.textBaseline = 'alphabetic';
  context.fillStyle = MUTED;
  context.font = `500 32px ${mono}`;
  context.textAlign = 'right';
  context.fillText(content.years, width - MARGIN, 104);
  context.textAlign = 'left';
  context.fillStyle = INK;
  context.font = `600 84px ${display}`;
  context.fillText(content.company, MARGIN, 190, text);
  let y = 190;
  if (content.role) {
    context.font = `500 40px ${display}`;
    for (const line of wrap(context, content.role, text).slice(0, 2)) context.fillText(line, MARGIN, (y += 56));
  }
  y += 34;
  context.fillRect(MARGIN, y, text, 3);
  y += 72;
  context.fillStyle = MUTED;
  context.font = `500 28px ${mono}`;
  context.fillText(content.highlightsTitle.toUpperCase(), MARGIN, y);
  y += 20;
  const bulletIndent = 40;
  const stackReserve = height - 250;
  context.font = `400 38px ${display}`;
  for (const highlight of content.highlights) {
    const lines = wrap(context, highlight, text - bulletIndent);
    if (y + 56 > stackReserve) break;
    context.fillStyle = MARK;
    context.fillRect(MARGIN + 4, y + 56 - 24, 12, 12);
    context.fillStyle = INK;
    for (const line of lines) {
      if (y + 56 > stackReserve) break;
      context.fillText(line, MARGIN + bulletIndent, (y += 52));
    }
    y += 22;
  }
  if (!content.stack.length) return;
  y = Math.max(y + 30, stackReserve);
  context.fillStyle = MUTED;
  context.font = `500 28px ${mono}`;
  context.fillText(content.stackTitle.toUpperCase(), MARGIN, y);
  context.fillStyle = INK;
  context.font = `500 32px ${mono}`;
  for (const line of wrap(context, content.stack.join(' · '), text).slice(0, 3)) context.fillText(line, MARGIN, (y += 48));
}

/** The shelf box twin: same atlas finish and object id, so glow and hover still reach it. */
function buildTwin(id: ShelfFolder, palette: Palette): PartBuilder {
  const builder = new PartBuilder();
  const centre = folderCentre(id);
  const objectId = OBJECT_ID[id];
  builder.add(new RoundedBoxGeometry(FOLDER.depth, FOLDER.height, FOLDER.spine, 2, 0.004), palette.folders[id], { position: centre.toArray() }, objectId);
  const spine = centre.x + FOLDER.depth / 2;
  builder.add(new BoxGeometry(0.003, SPINE_LABEL.length + 0.01, SPINE_LABEL.width), palette.label, { position: [spine + 0.0015, centre.y + SPINE_LABEL.lift, centre.z] }, objectId);
  builder.add(new TorusGeometry(0.012, 0.0025, 6, 16), palette.metal, { position: [spine + 0.002, centre.y - 0.07, centre.z], rotation: [0, Math.PI / 2, 0] }, objectId);
  return builder;
}

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

/** Makes an object ride along a held folder (`pose`), or hands it back to its own position. */
export function follow(object: Object3D, pose: Matrix4 | null, rest: Vector3): void {
  if (!pose) {
    object.matrixAutoUpdate = true;
    return;
  }
  object.matrixAutoUpdate = false;
  object.matrix.copy(pose).multiply(scratch.makeTranslation(rest.x, rest.y, rest.z));
  object.matrixWorldNeedsUpdate = true;
}
