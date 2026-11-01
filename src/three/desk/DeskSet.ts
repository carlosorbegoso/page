import { Group, PCFShadowMap, Vector3, type Matrix4, type Mesh, type MeshBasicMaterial, type Object3D } from 'three';
import type { ChapterId, ChapterState, PlateAnchor, Shot, ShotProvider, StationContext, StationPick, SurfaceName } from '../contracts';
import type { DeskLife } from './life';
import { PHONE } from './layout';
import type { AtlasUniforms } from './materials';
import { readPalette } from './props';
import { SUB_SHOTS, phoneFrame, type SurfaceFrame } from './shots';
import { createActionListener } from './set/actions';
import { ClockWiring } from './set/clock-wiring';
import { addDeskLife, addSpines } from './set/extras';
import { DeskFigures } from './set/figures';
import { DeskFolders } from './set/folders';
import type { DeskFrame } from './set/frame';
import { DeskFraming } from './set/framing';
import { mountLateDesk } from './set/deferred';
import { DeskLevels } from './set/levels';
import { LightRig } from './set/lighting';
import { DeskPicks } from './set/picks';
import { addContactShadows, buildRoomMeshes } from './set/room';
import { DeskScreens } from './set/screens';
import { focusedFigure, shotObject, storyRank } from './set/story';
import { DeskWeather } from './set/weather';
import { WallPortrait } from './portrait';
import { RoomLife } from './room-life';

/** Chapters where Alfa is on screen and its head follows the pointer. */
const ALFA_LOOKS: readonly ChapterId[] = ['company', 'products'];

/**
 * "Una noche en el escritorio": the whole set (room, props, collectibles, city and rain, lights)
 * plus the director's data — one fixed shot per chapter / sub-shot, the CSS3D surfaces and the
 * anchors of the 2D panels. Chapter actions run in `update` from the director's state; each
 * concern lives in `set/*` and reports whether it still moves.
 */
export class DeskSet implements ShotProvider {
  readonly object3D = new Group();
  private readonly pickSet = new DeskPicks();
  readonly picks: StationPick[] = this.pickSet.picks;
  private context!: StationContext;
  private readonly room = new Group();
  private readonly lightRig = new Group();
  private uniforms!: AtlasUniforms;
  private phoneMatrix!: Matrix4;
  private readonly disposables: Array<{ dispose(): void }> = [];
  private readonly levels = new DeskLevels();
  private readonly figures = new DeskFigures();
  private readonly folders = new DeskFolders();
  private readonly weather = new DeskWeather();
  private lights!: LightRig;
  private screens!: DeskScreens;
  private clockWiring: ClockWiring | null = null;
  private framing!: DeskFraming;
  private life: DeskLife | null = null;
  private roomLife: RoomLife | null = null;
  private portrait: WallPortrait | null = null;
  private triangles = 0;
  private chapter: ChapterId = 'intro';
  private subIndex = 0;
  private settledAt = -1;
  private shadowPose = '';
  private clock = 0;
  private readonly coarsePointer = matchMedia('(pointer: coarse)');
  private readonly onAction = createActionListener({
    clock: () => this.clock,
    context: () => this.context,
    life: () => this.life,
    roomLife: () => this.roomLife,
    screens: () => this.screens,
    levels: this.levels,
    folderAction: (action, id) => this.onFolderAction(action, id)
  });
  private readonly shotEye = () => this.framing.framing(this.chapter, this.subIndex)?.eye ?? this.context.camera.position;
  private readonly onInteract = (event: Event) => {
    const detail = (event as CustomEvent<{ id?: string; phase?: string }>).detail;
    if (detail?.phase !== 'activate' || !detail.id) return;
    this.life?.press.pulse(detail.id.replace(/^folder-/, ''), this.clock);
    this.folders.requestFolder(detail.id, this.shotEye);
    this.context?.invalidate();
  };
  private readonly onFolderKey = (event: KeyboardEvent) => {
    if (event.key !== 'Escape' || !this.folders.detail?.active) return;
    this.onFolderAction('folder-close');
  };

  constructor() {
    this.object3D.name = 'desk';
    this.object3D.add(this.room, this.lightRig);
  }

  async load(context: StationContext): Promise<void> {
    this.context = context;
    this.framing = new DeskFraming(context, () => this.phoneSurface());
    const high = context.tier === 'high';
    const palette = readPalette();
    const meshes = buildRoomMeshes(this.room, context, palette, this.disposables);
    this.uniforms = meshes.uniforms;
    this.figures.setPivots(meshes.uniforms);
    this.phoneMatrix = meshes.phoneMatrix;
    this.triangles = meshes.triangles;
    this.life = addDeskLife(this.room, meshes, palette, high, this.disposables);
    this.roomLife = new RoomLife(context, this.levels);
    this.roomLife.build(this.room, { material: meshes.material, depthMaterial: meshes.depthMaterial, palette });
    this.disposables.push(this.roomLife);
    this.portrait = new WallPortrait(context.camera, meshes.material.envMap, () => context.invalidate());
    this.room.add(this.portrait.group);
    this.disposables.push(this.portrait);
    window.addEventListener('keydown', this.onFolderKey);
    this.screens = new DeskScreens(context, { room: this.room, phone: this.phoneSurface(), material: meshes.material, depthMaterial: meshes.depthMaterial, disposables: this.disposables });
    const late = mountLateDesk({ context, room: this.room, meshes, palette, folders: this.folders, screens: this.screens, disposables: this.disposables });
    this.weather.addWindow(this.room, this.disposables);
    addSpines(this.room, this.folders, this.disposables);
    window.addEventListener('desk:action', this.onAction);
    window.addEventListener('desk:interact', this.onInteract);
    this.clockWiring = new ClockWiring(context);
    this.room.add(this.clockWiring.group);
    this.weather.addSteam(this.room, context.tier, this.disposables);
    addContactShadows(this.room, this.disposables);
    this.pickSet.build(this.room, this.phoneSurface(), this.disposables, this.life?.cardTargets());
    this.lights = new LightRig(this.lightRig, high);
    this.weather.addBeam(this.room, this.lights.lamp.position, high, this.disposables);
    if (high) this.enableShadows();
    this.applyLevels();
    if (context.capture) await late;
    context.invalidate();
  }

  private enableShadows(): void {
    const renderer = this.context.renderer;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFShadowMap;
    renderer.shadowMap.autoUpdate = false;
    renderer.shadowMap.needsUpdate = true;
  }

  private phoneSurface(): SurfaceFrame {
    return phoneFrame(this.phoneMatrix, PHONE.screen.width, PHONE.screen.height);
  }

  getShot(chapter: ChapterId, subIndex = 0): Shot | null {
    if (!this.context) return null;
    return this.framing.shot(chapter, subIndex);
  }

  subShotCount(chapter: ChapterId): number {
    return SUB_SHOTS[chapter] ?? 1;
  }

  getSurface(name: SurfaceName): PlateAnchor | null {
    if (!this.context) return null;
    return this.framing.surface(name, this.chapter);
  }

  getAnchor(name: string): Vector3 | null {
    if (!this.context) return null;
    if (name === 'lamp') return this.lights.lamp.getWorldPosition(new Vector3());
    return this.framing.panel(name);
  }

  getFocus(chapter: ChapterId, subIndex: number): Vector3 | null {
    if (chapter === 'outro' || !this.context) return null;
    return this.framing.framing(chapter, subIndex)?.focus.clone() ?? null;
  }

  /** Highlights a navigable prop (or clears with null). Accepts the pick's object or a descendant. */
  setHover(object: Object3D | null): void {
    const { name, changed } = this.pickSet.hover(object, this.uniforms);
    this.life?.setHover(name ?? null);
    this.screens?.setHover(name ?? null);
    this.roomLife?.setHover(object ? (this.resolvePick(object)?.key.slice(5) ?? null) : null);
    this.portrait?.setHover(object ? this.resolvePick(object)?.key === 'desk:portrait' : false);
    if (changed) this.context?.invalidate();
  }

  /** Finds the pick an object belongs to (walking up the parents). */
  resolvePick(object: Object3D): StationPick | null {
    return this.pickSet.resolve(object);
  }

  update(dt: number, time: number, state: ChapterState): boolean {
    if (!this.context) return false;
    const frame = this.beginFrame(dt, time, state);
    let settling = false;
    const lighting = this.levels.update(frame);
    settling ||= lighting;
    const hinge = this.folders.updateHinge(frame);
    settling ||= hinge;
    const hands = this.clockWiring?.update(frame) ?? false;
    settling ||= hands;
    const presence = this.figures.update(frame);
    settling ||= presence;
    const focused = focusedFigure(this.chapter, this.subIndex);
    const living = this.updateLife(frame, focused);
    settling ||= living;
    const lifting = this.figures.updateLift(frame, focused, this.pickSet.hoverId);
    settling ||= lifting;
    const posing = this.updateShadows(frame);
    settling ||= posing;
    const screening = this.screens.update(frame, this.levels.level);
    settling ||= screening;
    const hovering = this.pickSet.update(frame.step);
    settling ||= hovering;
    const toys = this.roomLife?.update(frame) ?? false;
    settling ||= toys;
    const glinting = this.portrait?.update(frame) ?? false;
    settling ||= glinting;
    if (frame.motion) {
      this.weather.setTime(time);
      settling = true;
    }
    this.applyLevels();
    return settling;
  }

  private beginFrame(dt: number, time: number, state: ChapterState): DeskFrame {
    const motion = this.context.motion() && !this.context.capture;
    if (state.id !== this.chapter || state.subIndex !== this.subIndex) this.enterShot(state, time);
    this.clock = time;
    if (state.settled && this.settledAt < 0) this.settledAt = time;
    const day = document.documentElement.dataset.time === 'day';
    const { chapter, subIndex, settledAt } = this;
    return { dt, step: motion ? dt : 10, time, motion, day, chapter, subIndex, rank: storyRank(chapter, subIndex), settledAt };
  }

  private enterShot(state: ChapterState, time: number): void {
    this.levels.enterShot(state.id, this.chapter);
    this.chapter = state.id;
    this.subIndex = state.subIndex;
    this.settledAt = -1;
    const introduced = this.coarsePointer.matches ? shotObject(state.id, state.subIndex) : null;
    if (introduced) this.life?.press.introduce(introduced, time);
  }

  private updateLife(frame: DeskFrame, focused: ReturnType<typeof focusedFigure>): boolean {
    const { pointer, camera, renderer } = this.context;
    const look = frame.motion && ALFA_LOOKS.includes(this.chapter) && pointer.active && pointer.enabled ? { ndc: pointer.ndc, camera } : null;
    const pixelScale = renderer.domElement.height / (2 * Math.tan((camera.fov * Math.PI) / 360));
    return this.life?.update(frame.dt, frame.time, { motion: frame.motion, look, pixelScale, focused }) ?? false;
  }

  /** Clock ringing, figure poses and the held folder: the lamp shadow map is re-rendered only when one of them changes. Returns whether anything still moves. */
  private updateShadows(frame: DeskFrame): boolean {
    const high = this.context.tier === 'high';
    const ringing = this.clockWiring?.ring(frame) ?? false;
    let redraw = ringing && high;
    if (high) {
      const posed = this.figures.poseKey(this.levels.level, this.life);
      if (posed !== this.shadowPose) {
        this.shadowPose = posed;
        redraw = true;
      }
    }
    const shelf = this.folders.updateShelf(frame, this.pickSet.hoverId, this.shotEye);
    if (shelf.posed && high) redraw = true;
    if (redraw) this.context.renderer.shadowMap.needsUpdate = true;
    return ringing || shelf.settling;
  }

  private applyLevels(): void {
    const level = this.levels.level;
    this.lights.apply(level);
    this.roomLife?.apply(level);
    this.portrait?.apply(level);
    this.screens.apply(level);
    this.weather.apply(level, this.chapter, this.life, this.context.renderer.domElement.height, this.framing.viewport().fov);
    this.figures.apply(this.uniforms, level, this.life);
    this.folders.apply(this.uniforms, this.life, this.pickSet.proxies);
    this.pickSet.apply(this.uniforms);
    this.life?.pose(this.uniforms);
    this.figures.applyProxies(this.pickSet.proxies);
  }

  private onFolderAction(action: 'folder' | 'folder-close', id?: string): void {
    if (!this.context) return;
    if (this.folders.action(action, id, this.chapter, this.subIndex, this.shotEye)) this.context.invalidate();
  }

  /** Room triangle count and visible meshes (debug overlay, docs). */
  stats(): { triangles: number; meshes: number } {
    let meshes = 0;
    this.object3D.traverse(node => {
      const mesh = node as Mesh;
      if (mesh.isMesh && (mesh.material as MeshBasicMaterial).visible !== false) meshes++;
    });
    return { triangles: this.triangles, meshes };
  }

  dispose(): void {
    window.removeEventListener('desk:action', this.onAction);
    window.removeEventListener('desk:interact', this.onInteract);
    window.removeEventListener('keydown', this.onFolderKey);
    this.framing?.dispose();
    this.clockWiring?.dispose();
    this.screens?.screen.geometry.dispose();
    for (const item of this.disposables) item.dispose();
    this.disposables.length = 0;
    this.object3D.removeFromParent();
  }
}
