import { ACESFilmicToneMapping, Color, PerspectiveCamera, Scene, SRGBColorSpace, Vector2, Vector3, WebGLRenderer } from 'three';
import { CSS3DObject, CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';
import type { ChapterId, PointerField, StationCameraPose, StationContext, SurfaceName, Tier } from '../contracts';
import { DeskSet } from './DeskSet';
import { checkShots, type ShotCheck } from './shots';

export interface DeskPreviewOptions {
  tier?: Tier;
}

export interface DeskPreview {
  set: DeskSet;
  renderer: WebGLRenderer;
  show(chapter: ChapterId, subIndex?: number): { calls: number; triangles: number };
  renderFrom(eye: [number, number, number], target: [number, number, number], fov?: number): void;
  surface(name: SurfaceName | null, html?: string): void;
  checks(): ShotCheck[];
  dispose(): void;
}

const stillPointer: PointerField = {
  ndc: new Vector2(),
  screen: new Vector2(),
  velocity: new Vector2(),
  world: null,
  active: false,
  enabled: false,
  onPointer: () => () => undefined
};

function createPreviewRenderer(container: HTMLElement, width: number, height: number): WebGLRenderer {
  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(width, height);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.outputColorSpace = SRGBColorSpace;
  container.append(renderer.domElement);
  return renderer;
}

function createCssLayer(container: HTMLElement, width: number, height: number): CSS3DRenderer {
  const css = new CSS3DRenderer();
  css.setSize(width, height);
  css.domElement.style.cssText = 'position:absolute;inset:0;pointer-events:none';
  container.append(css.domElement);
  return css;
}

function previewContext(
  tier: Tier,
  renderer: WebGLRenderer,
  camera: PerspectiveCamera,
  scene: Scene,
  fov: number
): StationContext {
  return {
    tier,
    renderer,
    camera,
    scene,
    pointer: stillPointer,
    capture: false,
    motion: () => true,
    fov: () => fov,
    readingPose: (): StationCameraPose => ({ position: new Vector3(), target: new Vector3(0, 0, -1) }),
    invalidate: () => undefined
  };
}

function aimAtShot(camera: PerspectiveCamera, set: DeskSet, chapter: ChapterId, subIndex: number, fov: number): void {
  const shot = set.getShot(chapter, subIndex);
  if (!shot) return;
  camera.fov = fov;
  camera.position.copy(shot.position);
  camera.lookAt(shot.target);
  camera.updateProjectionMatrix();
}

function samplePlate(set: DeskSet, name: SurfaceName, html: string): CSS3DObject | null {
  const anchor = set.getSurface(name);
  if (!anchor) return null;
  const element = document.createElement('div');
  element.innerHTML = html;
  const scale = anchor.scale ?? 0.001;
  const size = anchor.size ?? { width: 0.5, height: 0.3 };
  element.style.cssText = `width:${Math.round(size.width / scale)}px;height:${Math.round(size.height / scale)}px;color:#e9eef5;font-family:Geist,system-ui;background:#0b0f16;padding:24px;box-sizing:border-box;overflow:hidden`;
  const plate = new CSS3DObject(element);
  plate.position.copy(anchor.position);
  plate.quaternion.copy(anchor.quaternion);
  plate.scale.setScalar(scale);
  return plate;
}

interface PreviewRig {
  set: DeskSet;
  renderer: WebGLRenderer;
  css: CSS3DRenderer;
  cssScene: Scene;
  scene: Scene;
  camera: PerspectiveCamera;
}

function renderRig(rig: PreviewRig): { calls: number; triangles: number } {
  const { renderer } = rig;
  renderer.info.reset();
  renderer.info.autoReset = false;
  renderer.render(rig.scene, rig.camera);
  rig.css.render(rig.cssScene, rig.camera);
  return { calls: renderer.info.render.calls, triangles: renderer.info.render.triangles };
}

function settleChapter(set: DeskSet, chapter: ChapterId, subIndex: number, time: number): number {
  for (let i = 0; i < 240; i++) {
    time += 1 / 30;
    set.update(1 / 30, time, { id: chapter, subIndex, from: null, transition: 1, settled: true });
  }
  return time;
}

function previewApi(rig: PreviewRig, width: number, height: number, fov: number): DeskPreview {
  const { set, renderer, camera, cssScene } = rig;
  let time = 0;
  let plate: CSS3DObject | null = null;
  return {
    set,
    renderer,
    show(chapter, subIndex = 0) {
      time = settleChapter(set, chapter, subIndex, time);
      aimAtShot(camera, set, chapter, subIndex, fov);
      return renderRig(rig);
    },
    renderFrom(eye, target, fovOverride = fov) {
      camera.fov = fovOverride;
      camera.position.set(...eye);
      camera.lookAt(new Vector3(...target));
      camera.updateProjectionMatrix();
      renderRig(rig);
    },
    surface(name, html = '') {
      if (plate) cssScene.remove(plate);
      plate = name ? samplePlate(set, name, html) : null;
      if (plate) cssScene.add(plate);
    },
    checks: () => checkShots({ width, height, fov }, set['phoneSurface']()),
    dispose() {
      set.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      rig.css.domElement.remove();
    }
  };
}

export async function mountDeskPreview(container: HTMLElement, options: DeskPreviewOptions = {}): Promise<DeskPreview> {
  const width = container.clientWidth;
  const height = container.clientHeight;
  const fov = width < 1024 ? 40 : 30;
  const renderer = createPreviewRenderer(container, width, height);
  const css = createCssLayer(container, width, height);
  const cssScene = new Scene();

  const scene = new Scene();
  scene.background = new Color('#04060b');
  const camera = new PerspectiveCamera(fov, width / height, 0.05, 60);
  const set = new DeskSet();
  await set.load(previewContext(options.tier ?? 'high', renderer, camera, scene, fov));
  scene.add(set.object3D);
  return previewApi({ set, renderer, css, cssScene, scene, camera }, width, height, fov);
}
