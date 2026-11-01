import { Scene, type SpotLight, type WebGLRenderer } from 'three';
import { tokenColor } from '../tokens';
import { createCameraRig, type CameraRig } from './camera-rig';
import { disposeSceneGraph } from './dispose';
import { addDust, type DustUniforms } from './dust';
import { buildFolder } from './folder';
import { fontsReady } from './fonts';
import { listenNotFound } from './input';
import { buildLamp } from './lamp';
import { addLampSpot, addMoonlight } from './lights';
import { createFrameLoop } from './loop';
import { createMaterials } from './materials';
import { createRenderer } from './renderer';
import { buildRoom } from './room';
import type { NotFoundOptions, NotFoundQuality, TimedUniform } from './types';

export type { NotFoundOptions } from './types';

interface NotFoundSet {
  scene: Scene;
  spot: SpotLight;
  dust: DustUniforms;
  timed: TimedUniform[];
}

function buildSet(paperLabel: string, quality: NotFoundQuality): NotFoundSet {
  const scene = new Scene();
  scene.background = tokenColor('--color-sky-zenith', '#04060b');
  const materials = createMaterials();
  const rain = buildRoom(scene, materials);
  scene.add(buildFolder(materials.folder, paperLabel));
  const beam = buildLamp(scene, materials);
  const spot = addLampSpot(scene, beam.color, quality);
  addMoonlight(scene);
  const dust = addDust(scene, beam, quality);
  return { scene, spot, dust, timed: [rain, dust] };
}

function relayout(container: HTMLElement, renderer: WebGLRenderer, rig: CameraRig, dust: DustUniforms): void {
  dust.uPixel.value = rig.layout(container, renderer) / 900;
}

/** Mounts the decorative 404 scene into `container` and returns a disposer. */
export async function mountNotFound({ container, paperLabel, quality }: NotFoundOptions): Promise<() => void> {
  await fontsReady();
  const renderer = createRenderer(container, quality);
  const canvas = renderer.domElement;
  const { scene, spot, dust, timed } = buildSet(paperLabel, quality);
  const rig = createCameraRig();
  const loop = createFrameLoop(renderer, scene, rig, timed);
  const detach = listenNotFound({
    container,
    canvas,
    pointer: rig.pointer,
    loop,
    relayout: () => relayout(container, renderer, rig, dust)
  });

  relayout(container, renderer, rig, dust);
  loop.still();
  // The lamp never moves: the shadow map is drawn once by the still frame above and then frozen.
  renderer.shadowMap.autoUpdate = false;
  container.dataset.ready = 'true';
  loop.play();

  let disposed = false;
  return () => {
    if (disposed) return;
    disposed = true;
    loop.stop();
    detach();
    disposeSceneGraph(scene);
    spot.shadow.map?.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
    delete container.dataset.ready;
  };
}
