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
  type Color,
  Matrix4,
  type Texture
} from 'three';
import { CHAPTERS, type ChapterId, type ChapterState, type PlateAnchor, type Shot, type ShotProvider, type StationContext, type StationPick, type SurfaceName } from '../contracts';
import { tokenColor, tokenNumber } from '../tokens';
import { createBackdrop, createRainGlass, createSteam, type Backdrop, type RainGlass, type Steam } from './atmosphere';
import { createLampBeam, type LampBeam } from './beam';
import { createSpineLabels } from './spines';
import { StoryClock, storyMinutes } from './clock';
import { OBJECT_ID, PartBuilder } from './builder';
import { DESK, FIGURE_HEIGHT, FIGURES, FOLDER, FOLDERS, GLASS_Z, LAMP, MONITOR, OPEN_FOLDER, PHONE, PRODUCT_FIGURES, ROOM, WINDOW, folderCentre, type FigureId, type FolderId } from './layout';
import {
  bakeNightEnvironment,
  createAtlasDepthMaterial,
  createAtlasMaterial,
  createContactShadowTexture,
  createPhoneTexture,
  createPickMaterial,
  createScreenTexture,
  drawPhone,
  drawScreen,
  type AtlasUniforms
} from './materials';
import {
  buildChair,
  buildContactShadows,
  buildDesk,
  buildFigures,
  buildLamp,
  buildMonitorHead,
  buildOpenFolder,
  buildPhone,
  buildPlant,
  buildRoom,
  buildShelves,
  buildTelescope,
  buildWorkstation,
  readPalette
} from './props';
import {
  EXPERIENCE_ORDER,
  experienceFolder,
  SUB_SHOTS,
  framings,
  monitorFrame,
  portraitMonitor,
  panelAnchor,
  phoneFrame,
  toShot,
  type Framing,
  type SurfaceFrame,
  type Viewport
} from './shots';

/**
 * The light tokens are physical values (cd, nits, lux); the renderer's ACES exposure is tuned
 * high, so the room scales them to keep desk.md's balance: a warm pool that does not clip, a
 * readable moon rim and a fill that keeps the walls off pure black. The monitor is a soft cold
 * point light in front of the glass (a RectAreaLight's LTC tables would triple the chunk).
 */
const LIGHT_CALIBRATION = { lamp: 0.4, monitor: 0.16, moon: 3, fill: 2.5, shelf: 9 } as const;
/** HDR gain of the screen pictures so they stay luminous through ACES / the FX composer. */
const SCREEN_HDR = 1.8;
/**
 * On phones the portrait monitor shows its content at 0.82 of 1:1: 17 px body text reads at
 * ~14 px and the screen gains ~22 % more CSS room, so the about slides fit without overflow.
 */
const PORTRAIT_SCREEN_PROJECTION = 0.82;

interface ChapterLight {
  lamp: number;
  monitor: number;
  moon: number;
  /** Moonlight through the window raking the shelf spines (experience only). */
  shelf: number;
}

/** Light per chapter (desk.md §5): lamp in cd, monitor in nits, window light in lux. */
const CHAPTER_LIGHT: Record<ChapterId, ChapterLight> = {
  intro: { lamp: 28, monitor: 5, moon: 0.7, shelf: 0 },
  hero: { lamp: 28, monitor: 5, moon: 0.7, shelf: 0 },
  about: { lamp: 18, monitor: 6, moon: 0.6, shelf: 0 },
  company: { lamp: 30, monitor: 1.5, moon: 0.6, shelf: 0 },
  products: { lamp: 26, monitor: 1.5, moon: 0.55, shelf: 0 },
  experience: { lamp: 5, monitor: 6, moon: 1.1, shelf: 1.25 },
  contact: { lamp: 20, monitor: 1, moon: 0.5, shelf: 0 },
  outro: { lamp: 0, monitor: 0.6, moon: 1.2, shelf: 0 }
};

/**
 * The day years are a memory lit by the monitor and the window; the night starts with the lamp
 * clicking on once the camera has landed on TUSOCIO IA, and ends with it clicking off at dawn.
 * Light never changes while the camera moves towards these chapters (one motion at a time).
 */
const LAMP_SWITCH: Partial<Record<ChapterId, number>> = { company: 0.3, outro: 0.4 };
/** How late the night is per chapter: city windows go dark as the story advances. */
const LATENESS: Record<ChapterId, number> = { intro: 0, hero: 0, about: 0.05, experience: 0.1, company: 0.25, products: 0.35, contact: 0.5, outro: 0.6 };

/** Where the story introduces each figure; before that it waits dim and grey on the plinth. */
const FIGURE_INTRO: Record<FigureId, [ChapterId, number]> = {
  alfa: ['company', 0],
  skymek: ['products', 0],
  parati: ['products', 1],
  ventixs: ['products', 2]
};
const DIM_PRESENCE = 0.18;
const FOLDER_OPENS_AT = storyRank('experience', EXPERIENCE_ORDER.length);
const FOLDER_OPEN_DELAY = 0.3;
const FOLDER_HINGE_AXIS = new Vector3(Math.sin(OPEN_FOLDER.yaw), 0, Math.cos(OPEN_FOLDER.yaw));
const FOLDER_HINGE_ORIGIN = OPEN_FOLDER.centre.clone().add(new Vector3(0, 0.009, 0));
/** Metres a folder slides off the shelf when its year is told (or under the pointer). */
const FOLDER_PULL = 0.03;
/** Seconds after the camera lands before a figure lights up, like a neon tube starting. */
const PRESENCE_DELAY = 0.2;

function storyRank(chapter: ChapterId, subIndex: number): number {
  return CHAPTERS.indexOf(chapter) * 10 + subIndex;
}

const FIGURE_ORDER: readonly FigureId[] = ['alfa', 'ventixs', 'parati', 'skymek'];
const ALFA_TURN = 20 * (Math.PI / 180);
const MAX_TURN_SPEED = 0.05;
const FIGURE_LIFT = 0.012;
/** Warm bounce on the focused figure (desk.md §5: +10 %), as self-illumination of its albedo. */
const FOCUS_BOUNCE = 0.03;

const LABELS: Record<string, { es: string; en: string }> = {
  alfa: { es: 'Alfa · TUSOCIO IA', en: 'Alfa · TUSOCIO IA' },
  skymek: { es: 'SkyMek', en: 'SkyMek' },
  parati: { es: 'Parati', en: 'Parati' },
  ventixs: { es: 'Ventixs', en: 'Ventixs' },
  tcs: { es: 'TCS · Experiencia', en: 'TCS · Experience' },
  intercorp: { es: 'Intercorp · Experiencia', en: 'Intercorp · Experience' },
  baufest: { es: 'Baufest · Experiencia', en: 'Baufest · Experience' },
  sysarp: { es: 'SYSARP · Experiencia', en: 'SYSARP · Experience' },
  phone: { es: 'Teléfono · Contacto', en: 'Phone · Contact' },
  lamp: { es: 'Lámpara · clic para apagarla o encenderla', en: 'Lamp · click to switch it' }
};

const EXPERIENCE_IDS: Record<string, string> = { tcs: 'tcs', intercorp: 'intercorp-retail', baufest: 'baufest', sysarp: 'sysarp' };

function damp(current: number, goal: number, rate: number, dt: number): number {
  return current + (goal - current) * (1 - Math.exp(-rate * dt));
}

/** A neon tube starting: one flash, a beat of dark, then a fast ramp to full. */
function neonStart(current: number, since: number, dt: number): number {
  if (since < 0.06) return 1;
  if (since < 0.18) return DIM_PRESENCE;
  return damp(current, 1, 9, dt);
}

/** A tungsten lamp switching: a short flicker, then the filament settles fast (no smooth fade). */
function filamentSwitch(current: number, goal: number, since: number, dt: number): number {
  if (goal > current && since < 0.14) return goal * (since < 0.06 ? 0.55 : 0.12);
  return damp(current, goal, 16, dt);
}

function towards(current: number, goal: number, maxStep: number): number {
  return current + Math.max(-maxStep, Math.min(maxStep, goal - current));
}

/** Intro power-on: two 60 ms flashes, the lamp ramps 0 → 1 in 0.5 s, then the monitor in 0.3 s. */
function introLevels(t: number): { lamp: number; monitor: number } {
  const flash = (start: number) => (t >= start && t < start + 0.06 ? 0.7 : 0);
  const ramp = Math.min(Math.max((t - 0.45) / 0.5, 0), 1);
  const lamp = Math.max(flash(0.15), flash(0.33), ramp * ramp * (3 - 2 * ramp));
  const monitor = Math.min(Math.max((t - 0.95) / 0.3, 0), 1);
  return { lamp, monitor };
}

/**
 * "Una noche en el escritorio": the whole set (room, props, collectibles, city and rain, lights)
 * plus the director's data — one fixed shot per chapter / sub-shot, the CSS3D surfaces and the
 * anchors of the 2D panels. Chapter actions (intro power-on, Alfa turning, figures lifting,
 * folders lighting, phone waking, dawn) run in `update` from the director's state.
 */
export class DeskSet implements ShotProvider {
  readonly object3D = new Group();
  readonly picks: StationPick[] = [];
  private context!: StationContext;
  private readonly room = new Group();
  private readonly lightRig = new Group();
  private uniforms!: AtlasUniforms;
  private screen!: Mesh<PlaneGeometry, MeshBasicMaterial>;
  private monitorHead!: Mesh;
  private portrait: boolean | null = null;
  private screenTexture!: CanvasTexture;
  private phoneScreen!: Mesh<PlaneGeometry, MeshBasicMaterial>;
  private phoneTexture!: CanvasTexture;
  private phoneMatrix!: Matrix4;
  private backdrop!: Backdrop;
  private glass!: RainGlass;
  private steam: Steam | null = null;
  private beam!: LampBeam;
  private environment: Texture | null = null;
  private readonly disposables: Array<{ dispose(): void }> = [];
  private readonly proxies = new Map<string, Mesh>();
  private lamp!: SpotLight;
  private monitorLight!: PointLight;
  private moon!: DirectionalLight;
  private fill!: HemisphereLight;
  private shelfLight!: SpotLight;
  private moonNight!: Color;
  private moonDawn!: Color;
  private triangles = 0;
  private chapter: ChapterId = 'intro';
  private subIndex = 0;
  private introStart = -1;
  private readonly level = { lamp: 0, monitor: 0, moon: 0.45, shelf: 0, dawn: 0, phone: 0, alfaSignal: 1, alfaYaw: 0, late: 0 };
  private settledAt = -1;
  private readonly presence = new Map<FigureId, number>(FIGURE_ORDER.map(id => [id, 1]));
  private readonly neonSince = new Map<FigureId, number>();
  private readonly figureLift = new Map<FigureId, number>(FIGURE_ORDER.map(id => [id, 0]));
  private readonly figureYaw = new Map<FigureId, number>(FIGURE_ORDER.map(id => [id, 0]));
  private readonly folderGlow = new Map<string, number>(FOLDERS.map(id => [id, 0]));
  private phoneNotified = false;
  private shadowPose = '';
  private hoverId = -1;
  private spineLabels = new Map<FolderId, Mesh>();
  private readonly folderPull = new Map<FolderId, number>(FOLDERS.map(id => [id, 0]));
  /** The visitor switched the lamp off by clicking it; the story switches it back on at the next chapter. */
  private lampOff = false;
  private lampToggledAt = -1;
  private storySwitched = false;
  private clockModel: StoryClock | null = null;
  private clockMinutes = 60;
  /** 0 closed … 1 open: the TCS folder stays shut until the story reaches today. */
  private folderOpen = 0;
  private readonly hingeMatrix = new Matrix4();
  private clock = 0;
  private readonly onAction = (event: Event) => {
    if ((event as CustomEvent<{ action?: string }>).detail?.action !== 'lamp') return;
    this.lampOff = !this.lampOff;
    this.lampToggledAt = this.clock;
    window.dispatchEvent(new CustomEvent('desk:switch', { detail: { on: !this.lampOff } }));
    this.context?.invalidate();
  };
  private hoverMix = 0;

  constructor() {
    this.object3D.name = 'desk';
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
    FIGURE_ORDER.forEach((id, index) => uniforms.uFigPivot.value[index]!.copy(FIGURES[id]));
    this.environment = bakeNightEnvironment(context.renderer);
    material.envMap = this.environment;
    material.envMapIntensity = 0.8;
    this.disposables.push(material, this.environment);

    const statics = new PartBuilder();
    buildRoom(statics, palette);
    buildDesk(statics, palette, q);
    buildWorkstation(statics, palette, q);
    const head = new PartBuilder();
    buildMonitorHead(head, palette, q);
    const headGeometry = head.build();
    this.monitorHead = new Mesh(headGeometry, material);
    this.monitorHead.name = 'desk-monitor';
    this.monitorHead.castShadow = high;
    this.monitorHead.receiveShadow = high;
    const pivot = monitorFrame();
    this.monitorHead.position.copy(MONITOR.centre);
    this.monitorHead.quaternion.copy(pivot.quaternion);
    this.room.add(this.monitorHead);
    this.disposables.push(headGeometry);
    buildLamp(statics, palette, q);
    buildPlant(statics, palette, q);
    buildShelves(statics, palette, q);
    buildChair(statics, palette, q);
    buildTelescope(statics, palette, q);
    buildOpenFolder(statics, palette);
    this.phoneMatrix = buildPhone(statics, palette);
    buildFigures(statics, palette, q);
    const geometry = statics.build();
    this.triangles = statics.triangleCount;
    const roomMesh = new Mesh(geometry, material);
    roomMesh.name = 'desk-room';
    roomMesh.castShadow = high;
    roomMesh.receiveShadow = high;
    if (high) {
      roomMesh.customDepthMaterial = createAtlasDepthMaterial(uniforms);
      this.disposables.push(roomMesh.customDepthMaterial);
    }
    this.room.add(roomMesh);
    this.disposables.push(geometry);

    this.buildScreens();
    this.backdrop = createBackdrop();
    this.glass = createRainGlass();
    this.room.add(this.backdrop.mesh, this.glass.mesh);
    this.disposables.push(this.backdrop, this.glass);
    const spines = createSpineLabels();
    this.spineLabels = spines.meshes;
    this.room.add(...spines.meshes.values());
    this.disposables.push(spines);
    window.addEventListener('desk:action', this.onAction);
    this.clockModel = new StoryClock(() => {
      this.clockModel?.show(this.clockMinutes);
      if (this.context) this.context.renderer.shadowMap.needsUpdate = true;
      this.context?.invalidate();
    });
    this.room.add(this.clockModel.group);
    if (high) {
      this.steam = createSteam();
      this.room.add(this.steam.mesh);
      this.disposables.push(this.steam);
    }
    this.buildContactShadows();
    this.buildPicks();
    this.buildLights(high);
    this.beam = createLampBeam({
      apex: this.lamp.position.clone(),
      aim: LAMP.aim.clone(),
      angle: tokenNumber('--lamp-angle', 0.62) * 0.55,
      color: tokenColor('--color-lamp', '#ffb566'),
      motes: high ? 160 : 0
    });
    this.room.add(this.beam.group);
    this.disposables.push(this.beam);
    if (high) {
      const renderer = context.renderer;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = PCFShadowMap;
      renderer.shadowMap.autoUpdate = false;
      renderer.shadowMap.needsUpdate = true;
    }
    this.applyLevels();
    context.invalidate();
  }

  private buildScreens(): void {
    const monitor = monitorFrame();
    this.screenTexture = createScreenTexture();
    drawScreen(this.screenTexture, MONITOR.screen.width / MONITOR.screen.height, tokenColor('--color-monitor-glow', '#7fb8ff'));
    const screenMaterial = new MeshBasicMaterial({ map: this.screenTexture });
    this.screen = new Mesh(new PlaneGeometry(MONITOR.screen.width, MONITOR.screen.height), screenMaterial);
    this.screen.name = 'desk-screen';
    this.screen.position.copy(monitor.centre);
    this.screen.quaternion.copy(monitor.quaternion);
    this.room.add(this.screen);

    this.phoneTexture = createPhoneTexture();
    drawPhone(this.phoneTexture, false, tokenColor('--color-accent', '#5aa9ff'));
    const phoneMaterial = new MeshBasicMaterial({ map: this.phoneTexture });
    const phone = this.phoneSurface();
    this.phoneScreen = new Mesh(new PlaneGeometry(phone.width, phone.height), phoneMaterial);
    this.phoneScreen.name = 'desk-phone-screen';
    this.phoneScreen.position.copy(phone.centre);
    this.phoneScreen.quaternion.copy(phone.quaternion);
    this.room.add(this.phoneScreen);
    this.disposables.push(screenMaterial, this.screenTexture, this.screen.geometry, phoneMaterial, this.phoneTexture, this.phoneScreen.geometry);
  }

  private phoneSurface(): SurfaceFrame {
    return phoneFrame(this.phoneMatrix, PHONE.screen.width, PHONE.screen.height);
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

  private buildPicks(): void {
    const material = createPickMaterial();
    this.disposables.push(material);
    const proxy = (key: string, size: [number, number, number], position: Vector3, quaternion?: Quaternion) => {
      const geometry = new BoxGeometry(...size);
      const mesh = new Mesh(geometry, material);
      mesh.name = `desk-pick-${key}`;
      mesh.position.copy(position);
      if (quaternion) mesh.quaternion.copy(quaternion);
      this.room.add(mesh);
      this.proxies.set(key, mesh);
      this.disposables.push(geometry);
      return mesh;
    };
    const figure = (id: FigureId, size: [number, number, number]) =>
      proxy(id, size, FIGURES[id].clone().add(new Vector3(0, FIGURE_HEIGHT[id] / 2, 0)));
    this.picks.push({ object3D: figure('alfa', [0.08, 0.13, 0.07]), key: 'desk:alfa', label: LABELS.alfa!, target: '#company' });
    for (const id of PRODUCT_FIGURES) {
      this.picks.push({ object3D: figure(id, [0.08, 0.08, 0.07]), key: `desk:${id}`, label: LABELS[id]!, target: '#products', product: id });
    }
    for (const id of FOLDERS) {
      this.picks.push({
        object3D: proxy(id, [0.29, 0.33, 0.085], folderCentre(id)),
        key: `desk:${id}`,
        label: LABELS[id]!,
        target: '#experience',
        experience: EXPERIENCE_IDS[id],
        sub: EXPERIENCE_ORDER.indexOf(id) + 1
      });
    }
    const lampHead = LAMP.head.clone().addScaledVector(LAMP.aim.clone().sub(LAMP.head).normalize(), 0.06);
    this.picks.push({ object3D: proxy('lamp', [0.16, 0.12, 0.16], lampHead), key: 'desk:lamp', label: LABELS.lamp!, target: '#company', action: 'lamp' });
    const phone = this.phoneSurface();
    this.picks.push({ object3D: proxy('phone', [0.08, 0.16, 0.03], phone.centre, phone.quaternion), key: 'desk:phone', label: LABELS.phone!, target: '#contact' });
  }

  private buildLights(high: boolean): void {
    this.lamp = new SpotLight(tokenColor('--color-lamp', '#ffb566'), 0, 0, tokenNumber('--lamp-angle', 0.62), tokenNumber('--lamp-penumbra', 0.75), 2);
    const aim = LAMP.aim.clone().sub(LAMP.head).normalize();
    this.lamp.position.copy(LAMP.head).addScaledVector(aim, 0.125);
    this.lamp.target.position.copy(LAMP.aim);
    if (high) {
      this.lamp.castShadow = true;
      this.lamp.shadow.mapSize.set(1024, 1024);
      this.lamp.shadow.radius = 4;
      this.lamp.shadow.bias = -0.0005;
      this.lamp.shadow.normalBias = 0.01;
      this.lamp.shadow.camera.near = 0.05;
      this.lamp.shadow.camera.far = 3;
    }
    const monitor = monitorFrame();
    this.monitorLight = new PointLight(tokenColor('--color-monitor-glow', '#7fb8ff'), 0, 0, 2);
    this.monitorLight.position.copy(monitor.centre).addScaledVector(monitor.normal, 0.3);
    this.moonNight = tokenColor('--color-moonlight', '#9db8e8');
    this.moonDawn = tokenColor('--color-dawn-low', '#e9a47a');
    this.moon = new DirectionalLight(this.moonNight.clone(), 0);
    this.moon.position.set(WINDOW.x + 1.2, WINDOW.y + 1.6, ROOM.back - 3);
    this.moon.target.position.set(0, 0.6, 0.8);
    this.fill = new HemisphereLight(0x1b2436, 0x0a0806, tokenNumber('--desk-ambient-intensity', 0.08) * LIGHT_CALIBRATION.fill);
    this.shelfLight = new SpotLight(this.moonNight.clone(), 0, 0, 0.42, 0.85, 2);
    this.shelfLight.position.set(WINDOW.x - 0.3, WINDOW.y + 0.35, GLASS_Z + 0.08);
    this.shelfLight.target.position.copy(folderCentre('intercorp')).add(new Vector3(FOLDER.depth / 2, 0, 0));
    this.lightRig.add(this.lamp, this.lamp.target, this.monitorLight, this.moon, this.moon.target, this.fill, this.shelfLight, this.shelfLight.target);
  }

  private viewport(): Viewport {
    const canvas = this.context.renderer.domElement;
    const width = canvas.clientWidth || innerWidth;
    const height = canvas.clientHeight || innerHeight;
    return { width, height, fov: this.context.fov?.() ?? (width < 1024 ? 40 : 30) };
  }

  private framing(chapter: ChapterId, subIndex = 0): Framing | null {
    const list = framings(this.viewport(), this.phoneSurface())[chapter];
    return list[Math.min(Math.max(subIndex, 0), list.length - 1)] ?? null;
  }

  getShot(chapter: ChapterId, subIndex = 0): Shot | null {
    if (!this.context) return null;
    const framing = this.framing(chapter, subIndex);
    return framing ? toShot(framing, this.viewport()) : null;
  }

  subShotCount(chapter: ChapterId): number {
    return SUB_SHOTS[chapter] ?? 1;
  }

  /**
   * CSS3D surface with a fixed `scale` (1 CSS px = 1 screen px from the shot that reads it:
   * `hero`/`about` for the monitor, `contact` for the phone) and its physical `size`, so the
   * engine can size the plate to the glass.
   */
  getSurface(name: SurfaceName): PlateAnchor | null {
    if (!this.context) return null;
    const frame = name === 'monitor' ? monitorFrame(portraitMonitor(this.viewport())) : this.phoneSurface();
    const reader: ChapterId = name === 'phone' ? 'contact' : this.chapter === 'about' ? 'about' : 'hero';
    const shot = this.getShot(reader, 0);
    const view = this.viewport();
    if (!shot || view.height <= 0) return null;
    const distance = shot.position.distanceTo(frame.centre);
    const projection = name === 'monitor' && portraitMonitor(view) ? PORTRAIT_SCREEN_PROJECTION : 1;
    const scale = (2 * distance * Math.tan((view.fov * Math.PI) / 360)) / view.height * projection;
    return {
      position: frame.centre.clone().addScaledVector(frame.normal, 0.0015),
      quaternion: frame.quaternion.clone(),
      scale,
      size: { width: frame.width, height: frame.height }
    };
  }

  getAnchor(name: string): Vector3 | null {
    if (!this.context) return null;
    const view = this.viewport();
    const all = framings(view, this.phoneSurface());
    for (const list of Object.values(all)) {
      for (const framing of list) {
        if (framing.panel?.name === name) return panelAnchor(framing, view);
      }
    }
    return null;
  }

  getFocus(chapter: ChapterId, subIndex: number): Vector3 | null {
    if (chapter === 'outro' || !this.context) return null;
    return this.framing(chapter, subIndex)?.focus.clone() ?? null;
  }

  /** Highlights a navigable prop (or clears with null). Accepts the pick's object or a descendant. */
  setHover(object: Object3D | null): void {
    const pick = object ? this.resolvePick(object) : null;
    const name = pick?.key.slice(5) as keyof typeof OBJECT_ID | undefined;
    const id = name && name in OBJECT_ID ? OBJECT_ID[name] : -1;
    if (id === this.hoverId) return;
    this.hoverId = id;
    if (pick && name) {
      this.uniforms.uHoverId.value = id;
      const accent: Partial<Record<keyof typeof OBJECT_ID, string>> = {
        alfa: '--color-alfa-signal',
        ventixs: '--color-burbu-signal',
        parati: '--color-gift-ribbon',
        skymek: '--color-tool-band',
        phone: '--color-accent'
      };
      this.uniforms.uHoverColor.value.copy(tokenColor(accent[name] ?? '--color-desk-paper'));
    }
    this.context?.invalidate();
  }

  /** Finds the pick an object belongs to (walking up the parents). */
  resolvePick(object: Object3D): StationPick | null {
    let node: Object3D | null = object;
    while (node) {
      const pick = this.picks.find(item => item.object3D === node);
      if (pick) return pick;
      node = node.parent;
    }
    return null;
  }

  update(dt: number, time: number, state: ChapterState): boolean {
    if (!this.context) return false;
    const motion = this.context.motion() && !this.context.capture;
    const step = motion ? dt : 10;
    if (state.id !== this.chapter || state.subIndex !== this.subIndex) {
      if (state.id === 'intro' && this.chapter !== 'intro') this.introStart = -1;
      if (state.id !== this.chapter) this.lampOff = false;
      this.chapter = state.id;
      this.subIndex = state.subIndex;
      this.settledAt = -1;
      this.lampToggledAt = -1;
      this.storySwitched = false;
    }
    this.clock = time;
    if (state.settled && this.settledAt < 0) this.settledAt = time;
    let settling = false;
    this.syncOrientation();
    const light = CHAPTER_LIGHT[this.chapter];
    const level = this.level;
    if (this.chapter === 'intro' && motion) {
      if (this.introStart < 0) this.introStart = time;
      const intro = introLevels(time - this.introStart);
      level.lamp = intro.lamp * light.lamp;
      level.monitor = intro.monitor * light.monitor;
      settling = time - this.introStart < 1.4;
    } else {
      const switchDelay = LAMP_SWITCH[this.chapter];
      if (this.lampToggledAt >= 0) {
        level.lamp = motion ? filamentSwitch(level.lamp, this.lampOff ? 0 : light.lamp, time - this.lampToggledAt, step) : this.lampOff ? 0 : light.lamp;
        settling ||= Math.abs(level.lamp - (this.lampOff ? 0 : light.lamp)) > 0.05;
      } else if (switchDelay === undefined || !motion) {
        level.lamp = damp(level.lamp, light.lamp, 4, step);
      } else if (this.settledAt >= 0 && time - this.settledAt >= switchDelay) {
        if (!this.storySwitched) {
          this.storySwitched = true;
          if (light.lamp > level.lamp ? level.lamp < light.lamp * 0.4 : light.lamp === 0 && level.lamp > 2) window.dispatchEvent(new CustomEvent('desk:switch', { detail: { on: light.lamp > level.lamp } }));
        }
        level.lamp = filamentSwitch(level.lamp, light.lamp, time - this.settledAt - switchDelay, step);
      }
      settling ||= switchDelay !== undefined && Math.abs(level.lamp - light.lamp) > 0.05;
      level.monitor = damp(level.monitor, light.monitor, 5, step);
    }
    level.late = damp(level.late, LATENESS[this.chapter], 1.2, step);
    const rank = storyRank(this.chapter, this.subIndex);
    const openGoal = rank >= FOLDER_OPENS_AT ? 1 : 0;
    const opening = motion && rank === FOLDER_OPENS_AT && openGoal > this.folderOpen;
    if (!opening || (this.settledAt >= 0 && time - this.settledAt >= FOLDER_OPEN_DELAY)) {
      this.folderOpen = damp(this.folderOpen, openGoal, opening ? 3.2 : motion ? 5 : 10, step);
      if (Math.abs(this.folderOpen - openGoal) < 0.001) this.folderOpen = openGoal;
    }
    settling ||= this.folderOpen !== openGoal;
    const minutesGoal = storyMinutes(this.chapter, this.subIndex);
    const minutes = damp(this.clockMinutes, minutesGoal, 1.6, step);
    if (Math.abs(minutes - this.clockMinutes) > 0.01 || Math.abs(minutes - minutesGoal) < 0.01) {
      this.clockMinutes = Math.abs(minutes - minutesGoal) < 0.05 ? minutesGoal : minutes;
      this.clockModel?.show(this.clockMinutes);
    }
    settling ||= this.clockMinutes !== minutesGoal;
    settling ||= Math.abs(level.late - LATENESS[this.chapter]) > 0.002;
    level.moon = damp(level.moon, light.moon, 1.6, step);
    level.shelf = damp(level.shelf, light.shelf, 3, step);
    settling ||= Math.abs(level.shelf - light.shelf) > 0.005;
    level.dawn = damp(level.dawn, this.chapter === 'outro' ? 1 : 0, 1.6, step);
    level.phone = damp(level.phone, this.chapter === 'contact' ? 1 : 0, 6, step);
    level.alfaSignal = damp(level.alfaSignal, this.chapter === 'company' ? 1.6 : 1, 2, step);
    const alfaGoal = this.chapter === 'company' || this.chapter === 'products' ? ALFA_TURN : 0;
    level.alfaYaw = motion ? towards(level.alfaYaw, alfaGoal, MAX_TURN_SPEED * dt * 2) : alfaGoal;
    settling ||= Math.abs(level.lamp - light.lamp) > 0.05 || Math.abs(level.dawn - (this.chapter === 'outro' ? 1 : 0)) > 0.002;
    settling ||= Math.abs(level.alfaYaw - alfaGoal) > 1e-3 || Math.abs(level.phone - (this.chapter === 'contact' ? 1 : 0)) > 0.002;

    for (const id of FIGURE_ORDER) {
      const [introChapter, introSub] = FIGURE_INTRO[id];
      const introRank = storyRank(introChapter, introSub);
      const goal = this.chapter === 'outro' || rank >= introRank ? 1 : DIM_PRESENCE;
      const current = this.presence.get(id)!;
      const ready = this.settledAt >= 0 && time - this.settledAt >= PRESENCE_DELAY;
      if (motion && rank === introRank && ready && current < 0.5 && !this.neonSince.has(id)) this.neonSince.set(id, time);
      if (rank !== introRank) this.neonSince.delete(id);
      const started = this.neonSince.get(id);
      let next = current;
      if (started !== undefined) next = neonStart(current, time - started, step);
      else if (!motion || rank !== introRank || goal < current) next = damp(current, goal, motion ? 4 : 10, step);
      this.presence.set(id, next);
      settling ||= Math.abs(next - goal) > 0.003;
    }

    const focused = this.chapter === 'products' ? PRODUCT_FIGURES[Math.min(this.subIndex, PRODUCT_FIGURES.length - 1)] : null;
    for (const id of PRODUCT_FIGURES) {
      const goal = id === focused || OBJECT_ID[id] === this.hoverId ? FIGURE_LIFT : 0;
      const lift = damp(this.figureLift.get(id)!, goal, 5, step);
      this.figureLift.set(id, lift);
      settling ||= Math.abs(lift - goal) > 1e-4;
      const yaw = this.figureYaw.get(id)!;
      this.figureYaw.set(id, id === focused && motion ? yaw + MAX_TURN_SPEED * dt : towards(yaw, 0, MAX_TURN_SPEED * step));
      if (id === focused && motion) settling = true;
    }
    if (this.context.tier === 'high') {
      const posed = this.figurePose();
      if (posed !== this.shadowPose) {
        this.shadowPose = posed;
        this.context.renderer.shadowMap.needsUpdate = true;
      }
    }
    const folder = this.chapter === 'experience' ? experienceFolder(this.subIndex) : null;
    for (const id of FOLDERS) {
      const pullGoal = id === folder ? FOLDER_PULL : OBJECT_ID[id] === this.hoverId ? FOLDER_PULL * 0.6 : 0;
      const pull = damp(this.folderPull.get(id)!, pullGoal, 7, step);
      this.folderPull.set(id, pull);
      settling ||= Math.abs(pull - pullGoal) > 1e-4;
      const goal = id === folder ? 1 : 0;
      const glow = damp(this.folderGlow.get(id)!, goal, 6, step);
      this.folderGlow.set(id, glow);
      settling ||= Math.abs(glow - goal) > 0.002;
    }
    const notify = level.phone > 0.5;
    if (notify !== this.phoneNotified) {
      this.phoneNotified = notify;
      drawPhone(this.phoneTexture, notify, tokenColor('--color-accent', '#5aa9ff'));
    }

    const hoverGoal = this.hoverId > 0 ? 1 : 0;
    this.hoverMix = damp(this.hoverMix, hoverGoal, 10, step);
    settling ||= Math.abs(hoverGoal - this.hoverMix) > 0.01;

    if (motion) {
      this.glass.setTime(time);
      this.backdrop.setTime(time);
      this.steam?.setTime(time);
      this.beam.setTime(time);
      settling = true;
    }
    this.applyLevels();
    return settling;
  }

  /** Rounded lift and turn of the figures: the lamp shadow is re-rendered only when it changes. */
  private figurePose(): string {
    const parts = [Math.round(this.level.alfaYaw * 200)];
    for (const id of PRODUCT_FIGURES) parts.push(Math.round((this.figureLift.get(id) ?? 0) * 2000), Math.round((this.figureYaw.get(id) ?? 0) * 200));
    return parts.join(',');
  }

  /** Pivots the monitor head (and its screen picture) to portrait on narrow viewports; re-bakes the shadow. */
  private syncOrientation(): void {
    const portrait = portraitMonitor(this.viewport());
    if (portrait === this.portrait) return;
    this.portrait = portrait;
    this.monitorHead.rotation.z = 0;
    this.monitorHead.quaternion.copy(monitorFrame().quaternion);
    if (portrait) this.monitorHead.rotateZ(Math.PI / 2);
    const frame = monitorFrame(portrait);
    this.screen.geometry.dispose();
    this.screen.geometry = new PlaneGeometry(frame.width, frame.height);
    drawScreen(this.screenTexture, frame.width / frame.height, tokenColor('--color-monitor-glow', '#7fb8ff'));
    if (this.context.tier === 'high') this.context.renderer.shadowMap.needsUpdate = true;
    this.context.invalidate();
  }

  private applyLevels(): void {
    const level = this.level;
    this.lamp.intensity = level.lamp * LIGHT_CALIBRATION.lamp;
    this.monitorLight.intensity = level.monitor * LIGHT_CALIBRATION.monitor;
    this.moon.intensity = level.moon * LIGHT_CALIBRATION.moon;
    this.shelfLight.intensity = level.shelf * LIGHT_CALIBRATION.shelf;
    this.moon.color.copy(this.moonNight).lerp(this.moonDawn, level.dawn * 0.7);
    this.fill.intensity = tokenNumber('--desk-ambient-intensity', 0.08) * LIGHT_CALIBRATION.fill * (1 + level.dawn * 1.5);
    this.screen.material.color.setScalar(SCREEN_HDR * Math.min(level.monitor / 5, 1.2));
    this.phoneScreen.material.color.setScalar(0.06 + level.phone * SCREEN_HDR * 0.9);
    this.backdrop.setDawn(level.dawn);
    this.backdrop.setLateness(level.late);
    this.glass.setLampReflection(Math.min(level.lamp / 28, 1));
    this.beam.setLevel(Math.min(level.lamp / 28, 1.2));
    this.beam.setPixelScale(this.context.renderer.domElement.height, this.viewport().fov);
    this.steam?.setStrength(this.chapter === 'hero' || this.chapter === 'about' || this.chapter === 'intro' ? 0.22 : 0.1);
    const uniforms = this.uniforms;
    FIGURE_ORDER.forEach((id, index) => {
      uniforms.uFigLift.value[index] = this.figureLift.get(id) ?? 0;
      uniforms.uFigYaw.value[index] = id === 'alfa' ? level.alfaYaw : (this.figureYaw.get(id) ?? 0);
    });
    uniforms.uSignal.value[OBJECT_ID.alfa] = level.alfaSignal;
    for (const id of FOLDERS) uniforms.uGlow.value[OBJECT_ID[id]] = (this.folderGlow.get(id) ?? 0) * 0.32;
    for (const id of PRODUCT_FIGURES) uniforms.uGlow.value[OBJECT_ID[id]] = ((this.figureLift.get(id) ?? 0) / FIGURE_LIFT) * FOCUS_BOUNCE;
    for (const id of FIGURE_ORDER) uniforms.uPresence.value[OBJECT_ID[id]] = this.presence.get(id) ?? 1;
    const closed = 1 - this.folderOpen;
    uniforms.uHinge.value.setFromMatrix4(this.hingeMatrix.makeRotationAxis(FOLDER_HINGE_AXIS, -Math.PI * 0.985 * (closed * closed * (3 - 2 * closed))));
    uniforms.uHingeOrigin.value.copy(FOLDER_HINGE_ORIGIN);
    for (const id of FOLDERS) {
      const pull = this.folderPull.get(id) ?? 0;
      uniforms.uPull.value[OBJECT_ID[id]] = pull;
      const label = this.spineLabels.get(id);
      if (label) label.position.x = pull;
    }
    uniforms.uGlow.value[OBJECT_ID.openFolder] = (this.folderGlow.get('tcs') ?? 0) * 0.25;
    uniforms.uHoverMix.value = this.hoverMix;
    for (const id of PRODUCT_FIGURES) {
      const proxy = this.proxies.get(id);
      if (proxy) proxy.position.y = FIGURES[id].y + FIGURE_HEIGHT[id] / 2 + (this.figureLift.get(id) ?? 0);
    }
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
    this.clockModel?.dispose();
    this.screen?.geometry.dispose();
    for (const item of this.disposables) item.dispose();
    this.disposables.length = 0;
    this.object3D.removeFromParent();
  }
}

