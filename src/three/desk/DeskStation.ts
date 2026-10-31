import {
  BoxGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  PCFShadowMap,
  PlaneGeometry,
  PointLight,
  Quaternion,
  SpotLight,
  Vector3,
  type CanvasTexture,
  type Texture
} from 'three';
import type { PlateAnchor, StationCameraPose, StationContext, StationModule } from '../contracts';
import { tokenColor, tokenNumber } from '../tokens';
import { OBJECT_ID, PartBuilder } from './builder';
import { deskLayout, layoutFov, readingPose, samplePath, type DeskLayout, type PathKey } from './camera';
import { DESK, deskWorldMatrix, FIGURES, GLASS_Z, LAMP, MONITOR, ROOM, TELESCOPE, toLocal, WINDOW, WORLD_ALFA, WORLD_C } from './layout';
import {
  bakeNightEnvironment,
  createAtlasMaterial,
  createContactShadowTexture,
  createGlassTexture,
  createPickMaterial,
  createScreenTexture,
  drawScreen,
  type AtlasUniforms,
  type ScreenRect
} from './materials';
import {
  buildChair,
  buildContactShadows,
  buildDesk,
  buildFigures,
  buildLamp,
  buildMonitorHead,
  buildPlant,
  buildRoom,
  buildShelves,
  buildTelescope,
  buildWorkstation,
  readPalette
} from './props';

/** A navigable prop: the engine raycasts `object3D` and navigates to `target` on click. */
export interface DeskPick {
  readonly object3D: Object3D;
  readonly key: string;
  readonly label: { es: string; en: string };
  readonly target: string;
  readonly product?: 'parati' | 'ventixs';
}

/** Room-side phases of the hero progress (desk.md §6). */
export const DESK_PHASES = { liftOff: 0.25, window: 0.5, threshold: 0.75, space: 1 } as const;

const HERO_PLATE = 'hero';
const FALLBACK_PLATE = { desktop: [1000, 560], phone: [358, 560] } as const;
/**
 * Width (CSS px) given to the hero plate while it sits on the landscape monitor: the display
 * headline (up to ~92 px) needs a wide line to break in 2–3 lines instead of word by word.
 */
function landscapePlateWidth(viewportWidth: number): number {
  return Math.round(Math.min(1240, Math.max(760, viewportWidth * 0.82)));
}
const POINTER_DAMPING = 0.06;
/**
 * The light tokens are physical values (cd, lux); the renderer's ACES exposure (1.1) is tuned
 * for deep space, so the room scales them to keep desk.md's balance: a warm pool that does not
 * clip, a readable moon rim and a fill that keeps the walls off pure black. The monitor is a
 * soft cold point light in front of the glass (`--monitor-intensity` was written for a
 * RectAreaLight, whose LTC tables would triple the 3D chunk).
 */
const LIGHT_CALIBRATION = { lamp: 0.4, monitor: 0.16, moon: 3, fill: 5 } as const;
const HOVER_RATE = 10;
/** HDR gain of the screen picture so it stays luminous through ACES (with or without the FX composer). */
const SCREEN_HDR = 2.4;

interface Lights {
  lamp: SpotLight;
  monitor: PointLight;
  moon: DirectionalLight;
  fill: HemisphereLight;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
}

/**
 * The hero station: Carlos's desk at night. The monitor screen hosts the hero plate; the
 * camera leaves through the window towards the constellation (desk.md).
 */
export class DeskStation implements StationModule {
  readonly object3D = new Group();
  readonly picks: DeskPick[] = [];
  private context!: StationContext;
  private readonly room = new Group();
  private readonly lightRig = new Group();
  private readonly monitorPivot = new Group();
  private readonly monitorBezel = new Group();
  private lights!: Lights;
  private uniforms!: AtlasUniforms;
  private screen!: Mesh<PlaneGeometry, MeshBasicMaterial>;
  private screenTexture!: CanvasTexture;
  private environment: Texture | null = null;
  private readonly disposables: Array<{ dispose(): void }> = [];
  private layout: DeskLayout = 'desktop';
  private portrait = false;
  private plateSize: [number, number] = [...FALLBACK_PLATE.desktop];
  private plateElement: HTMLElement | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private readonly pointer = { x: 0, y: 0 };
  private hoverId = -1;
  private hoverMix = 0;
  private triangles = 0;
  private frameCache: { centre: Vector3; normal: Vector3; quaternion: Quaternion } | null = null;
  private lampIntensity = 28;
  private monitorIntensity = 5;
  private moonIntensity = 0.45;
  private fillIntensity = 0.08;
  private readonly onResize = () => this.syncLayout();

  constructor() {
    this.object3D.name = 'desk';
    this.object3D.matrixAutoUpdate = false;
    this.object3D.matrix.copy(deskWorldMatrix());
    this.object3D.add(this.room, this.lightRig);
  }

  async load(context: StationContext): Promise<void> {
    this.context = context;
    const high = context.tier === 'high';
    const q = high ? 1 : 0.6;
    const palette = readPalette();
    const { material, uniforms } = createAtlasMaterial(
      [ROOM.left, ROOM.right, ROOM.back, 0],
      [0, DESK.z, DESK.width / 2, DESK.depth / 2],
      DESK.top
    );
    this.uniforms = uniforms;
    this.environment = bakeNightEnvironment(context.renderer);
    material.envMap = this.environment;
    material.envMapIntensity = 1;
    this.disposables.push(material, this.environment);

    const statics = new PartBuilder();
    buildRoom(statics, palette);
    buildDesk(statics, palette, q);
    buildWorkstation(statics, palette, q);
    buildLamp(statics, palette, q);
    buildPlant(statics, palette, q);
    buildShelves(statics, palette, q);
    buildChair(statics, palette, q);
    buildFigures(statics, palette, q);
    const aim = toLocal(WORLD_ALFA).sub(new Vector3(TELESCOPE.foot.x, TELESCOPE.headHeight + 0.115, TELESCOPE.foot.z));
    const telescope = buildTelescope(statics, palette, q, aim);
    const staticGeometry = statics.build();
    const roomMesh = new Mesh(staticGeometry, material);
    roomMesh.name = 'desk-room';
    roomMesh.castShadow = high;
    roomMesh.receiveShadow = high;
    this.room.add(roomMesh);
    this.disposables.push(staticGeometry);

    const head = new PartBuilder();
    buildMonitorHead(head, palette, q);
    const headGeometry = head.build();
    const bezel = new Mesh(headGeometry, material);
    bezel.name = 'desk-monitor';
    bezel.castShadow = high;
    bezel.receiveShadow = high;
    this.monitorBezel.add(bezel);
    this.disposables.push(headGeometry);
    this.monitorPivot.position.copy(MONITOR.centre);
    this.monitorPivot.rotation.set(MONITOR.tilt, MONITOR.yaw, 0, 'YXZ');
    this.monitorPivot.add(this.monitorBezel);
    this.room.add(this.monitorPivot);

    this.screenTexture = createScreenTexture();
    const screenMaterial = new MeshBasicMaterial({ map: this.screenTexture });
    screenMaterial.color.setScalar(SCREEN_HDR);
    this.screen = new Mesh(new PlaneGeometry(MONITOR.screen.width, MONITOR.screen.height), screenMaterial);
    this.screen.name = 'desk-screen';
    this.screen.position.z = MONITOR.depth / 2 + 0.0006;
    this.monitorPivot.add(this.screen);
    this.disposables.push(screenMaterial, this.screenTexture);

    this.buildGlass();
    this.buildContactShadows();
    this.buildPicks(telescope.tubeCentre, aim);
    this.triangles = statics.triangleCount + head.triangleCount;

    this.lights = this.buildLights(high);
    if (high) {
      const renderer = context.renderer;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = PCFShadowMap;
      renderer.shadowMap.autoUpdate = false;
    }
    this.readTokens();
    this.watchPlate();
    addEventListener('resize', this.onResize, { passive: true });
    this.object3D.updateMatrixWorld(true);
    this.syncLayout(true);
  }

  private buildGlass(): void {
    const texture = createGlassTexture(
      tokenColor('--color-window-glass', '#0b1220'),
      tokenColor('--color-lamp', '#ffb566'),
      tokenColor('--color-moonlight', '#9db8e8'),
      0.12
    );
    const material = new MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false });
    const geometry = new PlaneGeometry(WINDOW.width - WINDOW.frame * 2, WINDOW.height - WINDOW.frame * 2);
    const glass = new Mesh(geometry, material);
    glass.name = 'desk-glass';
    glass.position.set(WINDOW.x, WINDOW.y, GLASS_Z);
    glass.raycast = () => undefined;
    this.room.add(glass);
    this.disposables.push(material, geometry, texture);
  }

  private buildContactShadows(): void {
    const texture = createContactShadowTexture();
    const geometry = buildContactShadows();
    const material = new MeshBasicMaterial({
      color: 0x000000,
      map: texture,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -2
    });
    const mesh = new Mesh(geometry, material);
    mesh.name = 'desk-contact-shadows';
    mesh.renderOrder = -1;
    mesh.raycast = () => undefined;
    this.room.add(mesh);
    this.disposables.push(texture, geometry, material);
  }

  private buildPicks(tubeCentre: Vector3, aim: Vector3): void {
    const material = createPickMaterial();
    const proxy = (name: string, size: [number, number, number], position: Vector3, quaternion?: Quaternion) => {
      const geometry = new BoxGeometry(...size);
      const mesh = new Mesh(geometry, material);
      mesh.name = name;
      mesh.position.copy(position);
      if (quaternion) mesh.quaternion.copy(quaternion);
      this.room.add(mesh);
      this.disposables.push(geometry);
      return mesh;
    };
    const top = DESK.top + 0.018;
    const telescope = new Group();
    telescope.name = 'desk-pick-telescope';
    const tube = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), aim.clone().normalize());
    telescope.add(
      proxy('telescope-tube', [0.14, 1.0, 0.14], tubeCentre, tube),
      proxy('telescope-legs', [0.5, TELESCOPE.headHeight, 0.5], new Vector3(TELESCOPE.foot.x, TELESCOPE.headHeight / 2, TELESCOPE.foot.z))
    );
    this.room.add(telescope);
    this.disposables.push(material);
    this.picks.push(
      {
        object3D: proxy('desk-pick-alfa', [0.11, 0.14, 0.1], new Vector3(FIGURES.alfa.x, top + 0.07, FIGURES.alfa.z)),
        key: 'desk:alfa',
        label: { es: 'Alfa · TUSOCIO IA', en: 'Alfa · TUSOCIO IA' },
        target: '#company'
      },
      {
        object3D: proxy('desk-pick-burbu', [0.12, 0.09, 0.08], new Vector3(FIGURES.burbu.x, top + 0.04, FIGURES.burbu.z)),
        key: 'desk:burbu',
        label: { es: 'Burbu · Ventixs', en: 'Burbu · Ventixs' },
        target: '#products',
        product: 'ventixs'
      },
      {
        object3D: proxy('desk-pick-gift', [0.08, 0.08, 0.08], new Vector3(FIGURES.gift.x, top + 0.035, FIGURES.gift.z)),
        key: 'desk:gift',
        label: { es: 'Caja de regalo · Parati', en: 'Gift box · Parati' },
        target: '#products',
        product: 'parati'
      },
      {
        object3D: telescope,
        key: 'desk:telescope',
        label: { es: 'Telescopio · Sobre mí', en: 'Telescope · About me' },
        target: '#about'
      }
    );
  }

  private buildLights(high: boolean): Lights {
    const lamp = new SpotLight(tokenColor('--color-lamp', '#ffb566'), 28, 0, 0.62, 0.75, 2);
    const aim = LAMP.aim.clone().sub(LAMP.head).normalize();
    lamp.position.copy(LAMP.head).addScaledVector(aim, 0.125);
    lamp.target.position.copy(LAMP.aim);
    if (high) {
      lamp.castShadow = true;
      lamp.shadow.mapSize.set(1024, 1024);
      lamp.shadow.radius = 4;
      lamp.shadow.bias = -0.0005;
      lamp.shadow.normalBias = 0.01;
      lamp.shadow.camera.near = 0.05;
      lamp.shadow.camera.far = 3;
    }
    const mount = new Group();
    mount.position.copy(MONITOR.centre);
    mount.rotation.copy(this.monitorPivot.rotation);
    const monitor = new PointLight(tokenColor('--color-monitor-glow', '#7fb8ff'), 0.6, 0, 2);
    monitor.position.z = 0.3;
    mount.add(monitor);
    const moon = new DirectionalLight(tokenColor('--color-moonlight', '#9db8e8'), 0.45);
    moon.position.set(WINDOW.x + 1.2, WINDOW.y + 1.6, ROOM.back - 3);
    moon.target.position.set(0, 0.6, 0.8);
    const fill = new HemisphereLight(0x1b2436, 0x0a0806, 0.08);
    this.lightRig.add(lamp, lamp.target, moon, moon.target, fill, mount);
    return { lamp, monitor, moon, fill };
  }

  private readTokens(): void {
    this.lampIntensity = tokenNumber('--lamp-intensity', 28) * LIGHT_CALIBRATION.lamp;
    this.lights.lamp.angle = tokenNumber('--lamp-angle', 0.62);
    this.lights.lamp.penumbra = tokenNumber('--lamp-penumbra', 0.75);
    this.monitorIntensity = tokenNumber('--monitor-intensity', 5) * LIGHT_CALIBRATION.monitor;
    this.moonIntensity = tokenNumber('--moonlight-intensity', 0.45) * LIGHT_CALIBRATION.moon;
    this.fillIntensity = tokenNumber('--desk-ambient-intensity', 0.08) * LIGHT_CALIBRATION.fill;
  }

  private watchPlate(): void {
    this.plateElement = document.querySelector<HTMLElement>(`[data-plate-id="${HERO_PLATE}"]`);
    if (!this.plateElement || typeof ResizeObserver === 'undefined') return;
    this.resizeObserver = new ResizeObserver(() => this.syncLayout());
    this.resizeObserver.observe(this.plateElement);
  }

  private viewport(): { width: number; height: number } {
    const canvas = this.context.renderer.domElement;
    return { width: canvas.clientWidth || innerWidth, height: canvas.clientHeight || innerHeight };
  }

  private measurePlate(): [number, number] {
    const fallback = this.layout === 'phone' ? FALLBACK_PLATE.phone : FALLBACK_PLATE.desktop;
    const element = this.plateElement;
    if (!element) return [...fallback];
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    return width > 40 && height > 40 ? [width, height] : [...fallback];
  }

  /** Screen size as displayed (portrait on phones: the head pivots 90° on its stand). */
  private displaySize(): [number, number] {
    const { width, height } = MONITOR.screen;
    return this.portrait ? [height, width] : [width, height];
  }

  /** World units per CSS px so the plate fits inside the screen with a margin. */
  private plateScale(): number {
    const [dw, dh] = this.displaySize();
    const [pw, ph] = this.plateSize;
    return Math.min((dw * 0.94) / pw, (dh * 0.92) / ph);
  }

  private syncLayout(force = false): void {
    if (!this.context) return;
    const { width } = this.viewport();
    const layout = deskLayout(width);
    const portrait = layout === 'phone';
    const orientationChanged = portrait !== this.portrait;
    this.layout = layout;
    this.portrait = portrait;
    const mounted = this.widenPlate(portrait ? null : landscapePlateWidth(width));
    const size = this.measurePlate();
    const sizeChanged = Math.abs(size[0] - this.plateSize[0]) > 1 || Math.abs(size[1] - this.plateSize[1]) > 1;
    this.plateSize = size;
    if (!force && !orientationChanged && !sizeChanged) return;
    this.monitorBezel.rotation.z = portrait ? Math.PI / 2 : 0;
    const [dw, dh] = this.displaySize();
    this.screen.geometry.dispose();
    this.screen.geometry = new PlaneGeometry(dw, dh);
    const scale = this.plateScale();
    const rect: ScreenRect = {
      width: (size[0] * scale) / dw,
      height: (size[1] * scale) / dh,
      x: 0,
      y: 0
    };
    rect.x = (1 - rect.width) / 2;
    rect.y = (1 - rect.height) / 2;
    drawScreen(this.screenTexture, dw / dh, mounted ? rect : null, tokenColor('--color-monitor-glow', '#7fb8ff'));
    this.bakeShadows();
    this.context.invalidate();
  }

  /**
   * Sets `--plate-width` on the CSS3D holder of the hero plate (the holder and the plate both
   * read it). Returns whether the plate is mounted in 3D, i.e. drawn over the screen.
   */
  private widenPlate(width: number | null): boolean {
    const holder = this.plateElement?.closest<HTMLElement>('[data-station-plates]');
    if (!holder || !document.documentElement.classList.contains('is-3d')) return false;
    const value = width === null ? '' : `${width}px`;
    if (holder.style.getPropertyValue('--plate-width') !== value) {
      if (width === null) holder.style.removeProperty('--plate-width');
      else holder.style.setProperty('--plate-width', value);
    }
    return true;
  }

  private bakeShadows(): void {
    if (this.context.tier !== 'high') return;
    this.context.renderer.shadowMap.needsUpdate = true;
  }

  /** World frame of the screen glass (static: the room never moves, only the bezel pivots). */
  private screenFrame(): { centre: Vector3; normal: Vector3; quaternion: Quaternion } {
    if (!this.frameCache) {
      this.object3D.updateMatrixWorld(true);
      const quaternion = this.monitorPivot.getWorldQuaternion(new Quaternion());
      const normal = new Vector3(0, 0, 1).applyQuaternion(quaternion);
      const centre = this.screen.getWorldPosition(new Vector3());
      this.frameCache = { centre, normal, quaternion };
    }
    const { centre, normal, quaternion } = this.frameCache;
    return { centre: centre.clone(), normal: normal.clone(), quaternion: quaternion.clone() };
  }

  getPlateAnchor(plateId: string): PlateAnchor | null {
    if (plateId !== HERO_PLATE || !this.context) return null;
    const { centre, normal, quaternion } = this.screenFrame();
    const scale = this.plateScale();
    if (!Number.isFinite(scale) || scale <= 0) return null;
    return { position: centre.addScaledVector(normal, 0.0015), quaternion, scale };
  }

  /** Opening shot (progress 0) for the current viewport. */
  private readingPose(): StationCameraPose | null {
    const { width, height } = this.viewport();
    const scale = this.plateScale();
    if (!Number.isFinite(scale) || scale <= 0 || height <= 0) return null;
    const { centre, normal } = this.screenFrame();
    return readingPose({
      layout: this.layout,
      width,
      height,
      scale,
      plateWidth: this.plateSize[0],
      plateHeight: this.plateSize[1],
      screenCentre: centre,
      screenNormal: normal,
      pointer: this.pointer
    });
  }

  /** Point just beyond the glass where the room hands the camera to the open sky. */
  exitPose(): StationCameraPose {
    const world = deskWorldMatrix();
    const position = new Vector3(WINDOW.x + 0.3, WINDOW.y + 0.02, GLASS_Z - 0.36).applyMatrix4(world);
    return { position, target: WORLD_C.clone(), fov: 30 };
  }

  private pathKeys(start: StationCameraPose): PathKey[] {
    const world = deskWorldMatrix();
    const local = (x: number, y: number, z: number) => new Vector3(x, y, z).applyMatrix4(world);
    const { normal } = this.screenFrame();
    const fov0 = start.fov ?? layoutFov(this.layout);
    const retreat = start.position.clone().addScaledVector(normal, 0.5).add(new Vector3(0, 0.06, 0));
    const windowCentre = local(WINDOW.x + 0.25, WINDOW.y, GLASS_Z);
    const exit = this.exitPose();
    const about = this.context.readingPose('about');
    return [
      { at: 0, position: start.position, target: start.target, fov: fov0 },
      { at: DESK_PHASES.liftOff, position: retreat, target: windowCentre, fov: fov0 },
      { at: DESK_PHASES.window, position: local(WINDOW.x + 0.2, WINDOW.y - 0.02, GLASS_Z + 0.9), target: WORLD_C.clone(), fov: 30 },
      { at: DESK_PHASES.threshold, position: exit.position, target: exit.target, fov: 30 },
      { at: DESK_PHASES.space, position: about.position.clone(), target: about.target.clone(), fov: about.fov ?? 30 }
    ];
  }

  getCameraPose(progress: number): StationCameraPose | null {
    if (!this.context || progress < 0) return null;
    const start = this.readingPose();
    if (!start) return null;
    if (progress === 0) return start;
    const pose = samplePath(this.pathKeys(start), Math.min(progress, 1));
    return Number.isFinite(pose.position.x) && Number.isFinite(pose.target.x) ? pose : null;
  }

  enter(): void {
    this.room.visible = true;
  }

  leave(): void {
    this.setHover(null);
  }

  /** Highlights a navigable prop (or clears with null). Accepts the pick's object or a descendant. */
  setHover(object: Object3D | null): void {
    const pick = object ? this.resolvePick(object) : null;
    const id = pick ? OBJECT_ID[pick.key.slice(5) as keyof typeof OBJECT_ID] : -1;
    if (id === this.hoverId) return;
    if (pick) {
      this.hoverId = id;
      this.uniforms.uHoverId.value = id;
      const accent: Record<string, string> = {
        'desk:alfa': '--color-alfa-signal',
        'desk:burbu': '--color-burbu-signal',
        'desk:gift': '--color-gift-ribbon',
        'desk:telescope': '--color-moonlight'
      };
      this.uniforms.uHoverColor.value.copy(tokenColor(accent[pick.key] ?? '--color-accent'));
    } else {
      this.hoverId = -1;
    }
    this.context?.invalidate();
  }

  /** Finds the pick an object belongs to (walking up the parents). */
  resolvePick(object: Object3D): DeskPick | null {
    let node: Object3D | null = object;
    while (node) {
      const pick = this.picks.find(item => item.object3D === node);
      if (pick) return pick;
      node = node.parent;
    }
    return null;
  }

  update(dt: number, _time: number, progress: number): boolean {
    if (!this.context) return false;
    let settling = false;
    const p = Math.max(progress, 0);

    const lampFade = 1 - smoothstep(DESK_PHASES.liftOff, DESK_PHASES.window, p) * (1 - 6 / 28);
    const out = 1 - smoothstep(DESK_PHASES.window, DESK_PHASES.threshold + 0.1, p);
    this.lights.lamp.intensity = this.lampIntensity * lampFade * (1 - smoothstep(DESK_PHASES.window + 0.05, DESK_PHASES.threshold + 0.1, p));
    this.lights.monitor.intensity = this.monitorIntensity * out;
    this.lights.moon.intensity = this.moonIntensity * out;
    this.lights.fill.intensity = this.fillIntensity * out;
    this.room.visible = p < DESK_PHASES.threshold + 0.1;

    const pointer = this.context.pointer;
    const allowed = pointer.active && pointer.enabled && this.context.motion() && p < DESK_PHASES.liftOff;
    const goalX = allowed ? pointer.ndc.x : 0;
    const goalY = allowed ? pointer.ndc.y : 0;
    const k = 1 - Math.pow(1 - POINTER_DAMPING, dt * 60);
    this.pointer.x += (goalX - this.pointer.x) * k;
    this.pointer.y += (goalY - this.pointer.y) * k;
    if (Math.abs(goalX - this.pointer.x) > 1e-3 || Math.abs(goalY - this.pointer.y) > 1e-3) settling = true;
    else {
      this.pointer.x = goalX;
      this.pointer.y = goalY;
    }

    const hoverGoal = this.hoverId > 0 ? 1 : 0;
    this.hoverMix += (hoverGoal - this.hoverMix) * Math.min(1, dt * HOVER_RATE);
    if (Math.abs(hoverGoal - this.hoverMix) > 0.01) settling = true;
    else this.hoverMix = hoverGoal;
    this.uniforms.uHoverMix.value = this.hoverMix;
    return settling;
  }

  /** Draw-call / triangle budget of the room (for debug overlays and docs). */
  stats(): { triangles: number; meshes: number } {
    let meshes = 0;
    this.room.traverse(node => {
      const mesh = node as Mesh;
      if (mesh.isMesh && (mesh.material as MeshBasicMaterial).visible !== false) meshes++;
    });
    return { triangles: this.triangles, meshes };
  }

  dispose(): void {
    removeEventListener('resize', this.onResize);
    this.resizeObserver?.disconnect();
    this.screen?.geometry.dispose();
    for (const item of this.disposables) item.dispose();
    this.disposables.length = 0;
    this.object3D.removeFromParent();
  }
}

