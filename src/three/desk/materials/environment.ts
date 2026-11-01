import {
  BackSide,
  BoxGeometry,
  Color,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  type Texture,
  type WebGLRenderer
} from 'three';
import { tokenColor } from '../../tokens';

export function bakeNightEnvironment(renderer: WebGLRenderer): Texture {
  const scene = new Scene();
  const disposables: Array<{ dispose(): void }> = [];
  const patch = (color: Color, intensity: number, size: [number, number], position: [number, number, number], lookAt: [number, number, number]) => {
    const geometry = new PlaneGeometry(size[0], size[1]);
    const material = new MeshBasicMaterial({ color: color.clone().multiplyScalar(intensity) });
    const mesh = new Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.lookAt(...lookAt);
    scene.add(mesh);
    disposables.push(geometry, material);
  };
  const shellGeometry = new BoxGeometry(6, 3, 6);
  const shellMaterial = new MeshBasicMaterial({ color: tokenColor('--color-moonlight', '#9db8e8').multiplyScalar(0.12), side: BackSide });
  scene.add(new Mesh(shellGeometry, shellMaterial));
  disposables.push(shellGeometry, shellMaterial);
  patch(tokenColor('--color-moonlight', '#9db8e8'), 3, [2.2, 1.4], [0.6, 0.4, -2.9], [0, 0, 0]);
  patch(tokenColor('--color-monitor-glow', '#7fb8ff'), 4, [0.7, 0.4], [-0.2, 0, -1.2], [0, 0, 0]);
  patch(tokenColor('--color-lamp', '#ffb566'), 8, [0.5, 0.5], [0.5, 1.4, -0.6], [0, 0, 0]);
  patch(tokenColor('--color-lamp', '#ffb566'), 0.25, [2, 2], [0, -1.49, 0], [0, 0, 0]);
  const generator = new PMREMGenerator(renderer);
  const target = generator.fromScene(scene, 0.04);
  generator.dispose();
  for (const item of disposables) item.dispose();
  return target.texture;
}
