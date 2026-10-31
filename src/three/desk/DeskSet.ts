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
  type Matrix4,
  type Texture
} from 'three';
import type { ChapterId, ChapterState, PlateAnchor, Shot, ShotProvider, StationContext, StationPick, SurfaceName } from '../contracts';
import { tokenColor, tokenNumber } from '../tokens';
import { createBackdrop, createRainGlass, createSteam, type Backdrop, type RainGlass, type Steam } from './atmosphere';
import { OBJECT_ID, PartBuilder } from './builder';
import { DESK, FIGURE_HEIGHT, FIGURES, FOLDERS, LAMP, MONITOR, PHONE, PRODUCT_FIGURES, ROOM, WINDOW, folderCentre, type FigureId } from './layout';
import {
  bakeNightEnvironment,
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
  SUB_SHOTS,
  framings,
  monitorFrame,
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
const LIGHT_CALIBRATION = { lamp: 0.4, monitor: 0.16, moon: 3, fill: 5 } as const;
/** HDR gain of the screen pictures so they stay luminous through ACES / the FX composer. */
const SCREEN_HDR = 1.8;

interface ChapterLight {
  lamp: number;
  monitor: number;
  moon: number;
}

/** Light per chapter (desk.md §5): lamp in cd, monitor in nits, window light in lux. */
const CHAPTER_LIGHT: Record<ChapterId, ChapterLight> = {
  intro: { lamp: 28, monitor: 5, moon: 0.45 },
  hero: { lamp: 28, monitor: 5, moon: 0.45 },
  about: { lamp: 18, monitor: 6, moon: 0.45 },
  company: { lamp: 32, monitor: 2, moon: 0.45 },
  products: { lamp: 32, monitor: 2, moon: 0.45 },
  experience: { lamp: 22, monitor: 2, moon: 0.45 },
  contact: { lamp: 20, monitor: 1, moon: 0.45 },
  outro: { lamp: 0, monitor: 0.6, moon: 1.2 }
};

const FIGURE_ORDER: readonly FigureId[] = ['alfa', 'ventixs', 'parati', 'skymek'];
const ALFA_TURN = 20 * (Math.PI / 180);
const MAX_TURN_SPEED = 0.05;
const FIGURE_LIFT = 0.02;
/** Warm bounce on the focused figure (desk.md §5: +10 %), as self-illumination of its albedo. */
const FOCUS_BOUNCE = 0.12;

const LABELS: Record<string, { es: string; en: string }> = {
  alfa: { es: 'Alfa · TUSOCIO IA', en: 'Alfa · TUSOCIO IA' },
  skymek: { es: 'SkyMek', en: 'SkyMek' },
  parati: { es: 'Parati', en: 'Parati' },
  ventixs: { es: 'Ventixs', en: 'Ventixs' },
  tcs: { es: 'TCS · Experiencia', en: 'TCS · Experience' },
  intercorp: { es: 'Intercorp · Experiencia', en: 'Intercorp · Experience' },
  baufest: { es: 'Baufest · Experiencia', en: 'Baufest · Experience' },
  sysarp: { es: 'SYSARP · Experiencia', en: 'SYSARP · Experience' },
  phone: { es: 'Teléfono · Contacto', en: 'Phone · Contact' }
};

const EXPERIENCE_IDS: Record<string, string> = { tcs: 'tcs', intercorp: 'intercorp-retail', baufest: 'baufest', sysarp: 'sysarp' };

function damp(current: number, goal: number, rate: number, dt: number): number {
  return current + (goal - current) * (1 - Math.exp(-rate * dt));
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
  private screenTexture!: CanvasTexture;
  private phoneScreen!: Mesh<PlaneGeometry, MeshBasicMaterial>;
  private phoneTexture!: CanvasTexture;
  private phoneMatrix!: Matrix4;
  private backdrop!: Backdrop;
  private glass!: RainGlass;
  private steam: Steam | null = null;
  private environment: Texture | null = null;
  private readonly disposables: Array<{ dispose(): void }> = [];
  private readonly proxies = new Map<string, Mesh>();
  private lamp!: SpotLight;
  private monitorLight!: PointLight;
  private moon!: DirectionalLight;
  private fill!: HemisphereLight;
  private moonNight!: Color;
  private moonDawn!: Color;
  private triangles = 0;
  private chapter: ChapterId = 'intro';
  private subIndex = 0;
  private introStart = -1;
  private readonly level = { lamp: 0, monitor: 0, moon: 0.45, dawn: 0, phone: 0, alfaSignal: 1, alfaYaw: 0 };
  private readonly figureLift = new Map<FigureId, number>(FIGURE_ORDER.map(id => [id, 0]));
  private readonly figureYaw = new Map<FigureId, number>(FIGURE_ORDER.map(id => [id, 0]));
  private readonly folderGlow = new Map<string, number>(FOLDERS.map(id => [id, 0]));
  private phoneNotified = false;
  private hoverId = -1;
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
    this.room.add(roomMesh);
    this.disposables.push(geometry);

    this.buildScreens();
    this.backdrop = createBackdrop();
    this.glass = createRainGlass();
    this.room.add(this.backdrop.mesh, this.glass.mesh);
    this.disposables.push(this.backdrop, this.glass);
    if (high) {
      this.steam = createSteam();
      this.room.add(this.steam.mesh);
      this.disposables.push(this.steam);
    }
    this.buildContactShadows();
    this.buildPicks();
    this.buildLights(high);
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
        experience: EXPERIENCE_IDS[id]
      });
    }
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
    this.lightRig.add(this.lamp, this.lamp.target, this.monitorLight, this.moon, this.moon.target, this.fill);
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
    const frame = name === 'monitor' ? monitorFrame() : this.phoneSurface();
    const reader: ChapterId = name === 'phone' ? 'contact' : this.chapter === 'about' ? 'about' : 'hero';
    const shot = this.getShot(reader, 0);
    const view = this.viewport();
    if (!shot || view.height <= 0) return null;
    const distance = shot.position.distanceTo(frame.centre);
    const scale = (2 * distance * Math.tan((view.fov * Math.PI) / 360)) / view.height;
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
    const id = name ? OBJECT_ID[name] : -1;
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
      this.chapter = state.id;
      this.subIndex = state.subIndex;
    }
    let settling = false;
    const light = CHAPTER_LIGHT[this.chapter];
    const level = this.level;
    if (this.chapter === 'intro' && motion) {
      if (this.introStart < 0) this.introStart = time;
      const intro = introLevels(time - this.introStart);
      level.lamp = intro.lamp * light.lamp;
      level.monitor = intro.monitor * light.monitor;
      settling = time - this.introStart < 1.4;
    } else {
      level.lamp = damp(level.lamp, light.lamp, this.chapter === 'outro' ? 2.5 : 4, step);
      level.monitor = damp(level.monitor, light.monitor, 5, step);
    }
    level.moon = damp(level.moon, light.moon, 1.6, step);
    level.dawn = damp(level.dawn, this.chapter === 'outro' ? 1 : 0, 1.6, step);
    level.phone = damp(level.phone, this.chapter === 'contact' ? 1 : 0, 6, step);
    level.alfaSignal = damp(level.alfaSignal, this.chapter === 'company' ? 1.6 : 1, 2, step);
    const alfaGoal = this.chapter === 'company' || this.chapter === 'products' ? ALFA_TURN : 0;
    level.alfaYaw = motion ? towards(level.alfaYaw, alfaGoal, MAX_TURN_SPEED * dt * 2) : alfaGoal;
    settling ||= Math.abs(level.lamp - light.lamp) > 0.05 || Math.abs(level.dawn - (this.chapter === 'outro' ? 1 : 0)) > 0.002;
    settling ||= Math.abs(level.alfaYaw - alfaGoal) > 1e-3 || Math.abs(level.phone - (this.chapter === 'contact' ? 1 : 0)) > 0.002;

    const focused = this.chapter === 'products' ? PRODUCT_FIGURES[Math.min(this.subIndex, PRODUCT_FIGURES.length - 1)] : null;
    for (const id of PRODUCT_FIGURES) {
      const goal = id === focused ? FIGURE_LIFT : 0;
      const lift = damp(this.figureLift.get(id)!, goal, 5, step);
      this.figureLift.set(id, lift);
      settling ||= Math.abs(lift - goal) > 1e-4;
      const yaw = this.figureYaw.get(id)!;
      this.figureYaw.set(id, id === focused && motion ? yaw + MAX_TURN_SPEED * dt : towards(yaw, 0, MAX_TURN_SPEED * step));
      if (id === focused && motion) settling = true;
    }
    const folder = this.chapter === 'experience' ? EXPERIENCE_ORDER[Math.min(this.subIndex, EXPERIENCE_ORDER.length - 1)] : null;
    for (const id of FOLDERS) {
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
      settling = true;
    }
    this.applyLevels();
    return settling;
  }

  private applyLevels(): void {
    const level = this.level;
    this.lamp.intensity = level.lamp * LIGHT_CALIBRATION.lamp;
    this.monitorLight.intensity = level.monitor * LIGHT_CALIBRATION.monitor;
    this.moon.intensity = level.moon * LIGHT_CALIBRATION.moon;
    this.moon.color.copy(this.moonNight).lerp(this.moonDawn, level.dawn * 0.7);
    this.fill.intensity = tokenNumber('--desk-ambient-intensity', 0.08) * LIGHT_CALIBRATION.fill * (1 + level.dawn * 1.5);
    this.screen.material.color.setScalar(SCREEN_HDR * Math.min(level.monitor / 5, 1.2));
    this.phoneScreen.material.color.setScalar(0.06 + level.phone * SCREEN_HDR * 0.9);
    this.backdrop.setDawn(level.dawn);
    this.glass.setLampReflection(Math.min(level.lamp / 28, 1));
    this.steam?.setStrength(this.chapter === 'hero' || this.chapter === 'about' || this.chapter === 'intro' ? 0.22 : 0.1);
    const uniforms = this.uniforms;
    FIGURE_ORDER.forEach((id, index) => {
      uniforms.uFigLift.value[index] = this.figureLift.get(id) ?? 0;
      uniforms.uFigYaw.value[index] = id === 'alfa' ? level.alfaYaw : (this.figureYaw.get(id) ?? 0);
    });
    uniforms.uSignal.value[OBJECT_ID.alfa] = level.alfaSignal;
    for (const id of FOLDERS) uniforms.uGlow.value[OBJECT_ID[id]] = (this.folderGlow.get(id) ?? 0) * 0.55;
    for (const id of PRODUCT_FIGURES) uniforms.uGlow.value[OBJECT_ID[id]] = ((this.figureLift.get(id) ?? 0) / FIGURE_LIFT) * FOCUS_BOUNCE;
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
    for (const item of this.disposables) item.dispose();
    this.disposables.length = 0;
    this.object3D.removeFromParent();
  }
}

