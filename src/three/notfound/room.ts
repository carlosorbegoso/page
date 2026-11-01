import { BoxGeometry, CylinderGeometry, Mesh, Object3D, PlaneGeometry, ShaderMaterial, type Scene } from 'three';
import { tokenColor } from '../tokens';
import type { RoomMaterials } from './materials';
import { rainShader } from './rain.glsl';
import type { TimedUniform } from './types';

const WINDOW_BARS: [number, number, number, number][] = [
  [2.74, 0.07, 0, 1.1],
  [2.74, 0.07, 0, -1.1],
  [0.07, 2.26, 1.33, 0],
  [0.07, 2.26, -1.33, 0],
  [0.04, 2.2, 0, 0]
];

function addDeskAndWall(scene: Scene, materials: RoomMaterials): void {
  const desk = new Mesh(new BoxGeometry(7, 0.12, 4), materials.wood);
  desk.position.set(0.4, -0.06, -0.2);
  desk.receiveShadow = true;
  scene.add(desk);

  const backWall = new Mesh(new PlaneGeometry(14, 8), materials.wall);
  backWall.position.set(0.4, 2, -2.2);
  backWall.receiveShadow = true;
  scene.add(backWall);
}

function createRainMaterial(): ShaderMaterial {
  return new ShaderMaterial({
    ...rainShader,
    uniforms: {
      uTime: { value: 0 },
      uGlass: { value: tokenColor('--color-window-glass', '#0b1220') },
      uSodium: { value: tokenColor('--color-city-sodium', '#e8a25a') },
      uLed: { value: tokenColor('--color-city-led', '#8fb4e8') },
      uRain: { value: tokenColor('--color-rain', '#9db8e8') }
    }
  });
}

function addRainyWindow(scene: Scene, frame: RoomMaterials['frame']): TimedUniform {
  const rainMaterial = createRainMaterial();
  const windowGroup = new Object3D();
  windowGroup.position.set(1.4, 1.25, -2.18);
  windowGroup.add(new Mesh(new PlaneGeometry(2.6, 2.2), rainMaterial));
  for (const [w, h, x, y] of WINDOW_BARS) {
    const bar = new Mesh(new BoxGeometry(w, h, 0.06), frame);
    bar.position.set(x, y, 0.03);
    windowGroup.add(bar);
  }
  scene.add(windowGroup);
  return rainMaterial.uniforms as unknown as TimedUniform;
}

function addMug(scene: Scene, ceramic: RoomMaterials['ceramic']): void {
  const mug = new Mesh(new CylinderGeometry(0.16, 0.14, 0.34, 24), ceramic);
  mug.position.set(1.75, 0.17, -0.75);
  mug.castShadow = true;
  scene.add(mug);
}

/** Desk, back wall, rainy window and mug; returns the rain's animated uniforms. */
export function buildRoom(scene: Scene, materials: RoomMaterials): TimedUniform {
  addDeskAndWall(scene, materials);
  const rain = addRainyWindow(scene, materials.frame);
  addMug(scene, materials.ceramic);
  return rain;
}
