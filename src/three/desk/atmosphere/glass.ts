import { Mesh, PlaneGeometry, ShaderMaterial } from 'three';
import { withFluidFragment } from '../../fx/fluid';
import { tokenColor } from '../../tokens';
import { GLASS_Z, WINDOW } from '../layout';
import { GLASS_FRAGMENT, GLASS_VERTEX } from './glass.glsl';

export interface RainGlass {
  mesh: Mesh<PlaneGeometry, ShaderMaterial>;
  setTime(time: number): void;
  setLampReflection(level: number): void;
  setDay(value: number): void;
  dispose(): void;
}

function glassMaterial(aspect: number): ShaderMaterial {
  return withFluidFragment(
    new ShaderMaterial({
      vertexShader: GLASS_VERTEX,
      fragmentShader: GLASS_FRAGMENT,
      uniforms: {
        uTint: { value: tokenColor('--color-window-glass', '#0b1220') },
        uRain: { value: tokenColor('--color-rain', '#9db8e8') },
        uLamp: { value: tokenColor('--color-lamp', '#ffb566') },
        uTime: { value: 0 },
        uAspect: { value: aspect },
        uLampReflection: { value: 1 },
        uDay: { value: 0 },
        uTintDay: { value: tokenColor('--color-window-glass-day', '#dfe6ec') }
      },
      transparent: true,
      depthWrite: false
    })
  );
}

export function createRainGlass(): RainGlass {
  const width = WINDOW.width - WINDOW.frame * 2;
  const height = WINDOW.height - WINDOW.frame * 2;
  const geometry = new PlaneGeometry(width, height);
  const material = glassMaterial(width / height);
  const mesh = new Mesh(geometry, material);
  mesh.name = 'desk-glass';
  mesh.position.set(WINDOW.x, WINDOW.y, GLASS_Z);
  mesh.raycast = () => undefined;
  return {
    mesh,
    setTime: time => {
      material.uniforms.uTime!.value = time;
    },
    setLampReflection: level => {
      material.uniforms.uLampReflection!.value = level;
    },
    setDay: value => {
      material.uniforms.uDay!.value = value;
    },
    dispose: () => {
      geometry.dispose();
      material.dispose();
    }
  };
}
