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
  /** Settles a chapter's actions and renders its shot. */
  show(chapter: ChapterId, subIndex?: number): { calls: number; triangles: number };
  /** Renders from an arbitrary eye/target (close-ups for review). */
  renderFrom(eye: [number, number, number], target: [number, number, number], fov?: number): void;
  /** Shows a sample HTML block on a CSS3D surface at 1:1 (or hides it with null). */
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

/** Stand-alone render of the desk set (own renderer, no engine) to review shots and actions. */
export async function mountDeskPreview(container: HTMLElement, options: DeskPreviewOptions = {}): Promise<DeskPreview> {
  const width = container.clientWidth;
  const height = container.clientHeight;
  const fov = width < 1024 ? 40 : 30;
  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(width, height);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.outputColorSpace = SRGBColorSpace;
  container.append(renderer.domElement);
  const css = new CSS3DRenderer();
  css.setSize(width, height);
  css.domElement.style.cssText = 'position:absolute;inset:0;pointer-events:none';
  container.append(css.domElement);
  const cssScene = new Scene();

  const scene = new Scene();
  scene.background = new Color('#04060b');
  const camera = new PerspectiveCamera(fov, width / height, 0.05, 60);
  const set = new DeskSet();
  const context: StationContext = {
    tier: options.tier ?? 'high',
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
  await set.load(context);
  scene.add(set.object3D);
  let time = 0;
  let plate: CSS3DObject | null = null;

  const render = () => {
    renderer.info.reset();
    renderer.info.autoReset = false;
    renderer.render(scene, camera);
    css.render(cssScene, camera);
    return { calls: renderer.info.render.calls, triangles: renderer.info.render.triangles };
  };

  return {
    set,
    renderer,
    show(chapter, subIndex = 0) {
      for (let i = 0; i < 240; i++) {
        time += 1 / 30;
        set.update(1 / 30, time, { id: chapter, subIndex, from: null, transition: 1, settled: true });
      }
      const shot = set.getShot(chapter, subIndex);
      if (shot) {
        camera.fov = fov;
        camera.position.copy(shot.position);
        camera.lookAt(shot.target);
        camera.updateProjectionMatrix();
      }
      return render();
    },
    renderFrom(eye, target, fovOverride = fov) {
      camera.fov = fovOverride;
      camera.position.set(...eye);
      camera.lookAt(new Vector3(...target));
      camera.updateProjectionMatrix();
      render();
    },
    surface(name, html = '') {
      if (plate) cssScene.remove(plate);
      plate = null;
      if (!name) return;
      const anchor = set.getSurface(name);
      if (!anchor) return;
      const element = document.createElement('div');
      element.innerHTML = html;
      const scale = anchor.scale ?? 0.001;
      const size = anchor.size ?? { width: 0.5, height: 0.3 };
      element.style.cssText = `width:${Math.round(size.width / scale)}px;height:${Math.round(size.height / scale)}px;color:#e9eef5;font-family:Geist,system-ui;background:#0b0f16;padding:24px;box-sizing:border-box;overflow:hidden`;
      plate = new CSS3DObject(element);
      plate.position.copy(anchor.position);
      plate.quaternion.copy(anchor.quaternion);
      plate.scale.setScalar(scale);
      cssScene.add(plate);
    },
    checks: () => checkShots({ width, height, fov }, set['phoneSurface']()),
    dispose() {
      set.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      css.domElement.remove();
    }
  };
}
