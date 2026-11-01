import { DirectionalLight, HemisphereLight, SpotLight, type Color, type Scene } from 'three';
import { tokenColor } from '../tokens';
import { DEG, LAMP_HEAD, TARGET } from './constants';
import type { NotFoundQuality } from './types';

export function addLampSpot(scene: Scene, color: Color, quality: NotFoundQuality): SpotLight {
  const spot = new SpotLight(color, 12, 7, 30 * DEG, 0.55, 2);
  spot.position.copy(LAMP_HEAD);
  spot.target.position.copy(TARGET);
  spot.castShadow = true;
  spot.shadow.mapSize.setScalar(quality === 'high' ? 1024 : 512);
  spot.shadow.bias = -0.0004;
  spot.shadow.radius = 4;
  scene.add(spot, spot.target);
  return spot;
}

export function addMoonlight(scene: Scene): void {
  const moon = new DirectionalLight(tokenColor('--color-moonlight', '#9db8e8'), 0.6);
  moon.position.set(2.5, 3, -2);
  scene.add(moon, new HemisphereLight(tokenColor('--color-moonlight', '#9db8e8'), tokenColor('--color-desk-floor'), 0.25));
}
