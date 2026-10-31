import {
  ACESFilmicToneMapping,
  BufferAttribute,
  BufferGeometry,
  Color,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer
} from 'three';
import { CSS3DObject, CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';
import type { PointerField, StationCameraPose, StationContext, Tier } from '../contracts';
import { DeskStation } from './DeskStation';
import { deskWorldMatrix, WORLD_ALFA, WORLD_C } from './layout';

export interface DeskPreviewOptions {
  tier?: Tier;
  /** Clone of this element is shown as the hero plate (defaults to `[data-plate-id="hero"]`). */
  plate?: HTMLElement | null;
}

export interface DeskPreview {
  station: DeskStation;
  renderer: WebGLRenderer;
  setProgress(progress: number): { calls: number; triangles: number };
  /** Renders from an arbitrary room-local eye/target (close-ups for review). */
  renderLocal(eye: [number, number, number], target: [number, number, number], fov?: number): void;
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

/**
 * Stand-alone render of the desk station (own renderer, a stand-in sky with markers at the C
 * and Alfa, and the hero plate through CSS3D) to check framing without the engine.
 */
export async function mountDeskPreview(container: HTMLElement, options: DeskPreviewOptions = {}): Promise<DeskPreview> {
  const width = container.clientWidth;
  const height = container.clientHeight;
  const renderer = new WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
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
  const camera = new PerspectiveCamera(30, width / height, 0.05, 60);
  const sky = starField();
  scene.add(sky, ...markers());

  const station = new DeskStation();
  const about: StationCameraPose = {
    target: new Vector3(5, 0.8, -7),
    position: new Vector3(5, 0.8, -7).addScaledVector(new Vector3(0.35, 0.2, 1).normalize(), 7),
    fov: 30
  };
  let frame = 0;
  const context: StationContext = {
    tier: options.tier ?? 'high',
    renderer,
    camera,
    scene,
    pointer: stillPointer,
    capture: true,
    motion: () => false,
    readingPose: () => about,
    invalidate: () => undefined
  };
  await station.load(context);
  scene.add(station.object3D);

  const source = options.plate ?? document.querySelector<HTMLElement>('[data-plate-id="hero"]');
  let plate: CSS3DObject | null = null;
  if (source) {
    const clone = source.cloneNode(true) as HTMLElement;
    clone.removeAttribute('data-plate');
    clone.style.width = getComputedStyle(source).width;
    plate = new CSS3DObject(clone);
    cssScene.add(plate);
  }

  return {
    station,
    renderer,
    setProgress(progress: number) {
      station.update(1 / 60, frame++ / 60, progress);
      const pose = station.getCameraPose(progress);
      if (pose) {
        camera.fov = pose.fov ?? 30;
        camera.aspect = width / height;
        camera.position.copy(pose.position);
        camera.lookAt(pose.target);
        camera.updateProjectionMatrix();
      }
      sky.position.copy(camera.position);
      const anchor = station.getPlateAnchor('hero');
      if (plate && anchor) {
        plate.position.copy(anchor.position);
        plate.quaternion.copy(anchor.quaternion);
        plate.scale.setScalar(anchor.scale ?? 1);
        plate.element.style.opacity = progress < 0.3 ? '1' : '0';
      }
      css.domElement.style.visibility = 'visible';
      renderer.info.reset();
      renderer.info.autoReset = false;
      renderer.render(scene, camera);
      css.render(cssScene, camera);
      return { calls: renderer.info.render.calls, triangles: renderer.info.render.triangles };
    },
    renderLocal(eye, target, fov = 30) {
      const world = deskWorldMatrix();
      camera.fov = fov;
      camera.position.set(...eye).applyMatrix4(world);
      camera.lookAt(new Vector3(...target).applyMatrix4(world));
      camera.updateProjectionMatrix();
      css.domElement.style.visibility = 'hidden';
      renderer.render(scene, camera);
    },
    dispose() {
      station.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      css.domElement.remove();
    }
  };
}

function starField(): Points {
  const count = 3000;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const v = new Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).normalize().multiplyScalar(40);
    positions.set([v.x, v.y, v.z], i * 3);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  return new Points(geometry, new PointsMaterial({ color: 0xdfe8ff, size: 1.6, sizeAttenuation: false, transparent: true, depthWrite: false }));
}

function markers(): Mesh[] {
  const alfa = new Mesh(new SphereGeometry(0.45, 24, 16), new MeshBasicMaterial({ color: new Color('#bfe0ff').multiplyScalar(3) }));
  alfa.position.copy(WORLD_ALFA);
  const c: Mesh[] = [];
  for (let i = 0; i < 9; i++) {
    const a = ((40 + i * 35) * Math.PI) / 180;
    const star = new Mesh(new SphereGeometry(0.06, 8, 6), new MeshBasicMaterial({ color: 0xffffff }));
    star.position.set(WORLD_C.x + Math.cos(a) * 2.2, WORLD_C.y + Math.sin(a) * 2.2, WORLD_C.z);
    c.push(star);
  }
  return [alfa, ...c];
}
