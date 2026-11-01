import {
  AddEquation,
  BufferAttribute,
  BufferGeometry,
  Color,
  CustomBlending,
  DoubleSide,
  Mesh,
  OneFactor,
  OneMinusSrcAlphaFactor,
  ShaderMaterial,
  Sphere,
  Vector2,
  Vector3
} from 'three';
import { withFluidDisplacement } from '../../fx/fluid';
import { MUG } from '../layout';
import { STEAM_FRAGMENT, STEAM_VERTEX } from './steam.glsl';

export interface SteamOptions {
  /** Billboard wisps rising from the cup (6 on `high`, 4 on `mid`). */
  wisps: number;
  /** Noise octaves per sample; fewer on `mid`. */
  octaves: number;
}

export interface Steam {
  mesh: Mesh<BufferGeometry, ShaderMaterial>;
  setTime(time: number): void;
  /** `level` 0..1 is the chapter's presence; `day` 0..1 switches to a paler grey veil that reads against the bright window. */
  setStrength(level: number, day?: number): void;
  dispose(): void;
}

const STEAM_SIZE = { width: 0.11, height: 0.2 } as const;
const STEAM_NIGHT = new Color(0.95, 0.88, 0.8);
const STEAM_DAY = new Color(1.0, 1.0, 1.0);

/**
 * Hot-coffee steam: camera-facing wisps that curl through advected noise, widen and fade with
 * height and drift slightly. Premultiplied blending: additive at night (`uOcclusion` ≈ 0), a
 * light veil by day. Linear HDR output, tone-mapped by the post chain; peaks stay below bloom.
 */
export function createSteam(options: SteamOptions = { wisps: 6, octaves: 3 }): Steam {
  const count = Math.max(1, options.wisps);
  const positions = new Float32Array(count * 4 * 3);
  const corners = new Float32Array(count * 4 * 2);
  const seeds = new Float32Array(count * 4);
  const index: number[] = [];
  for (let w = 0; w < count; w++) {
    const angle = w * 2.399 + 0.7;
    const radius = count > 1 ? 0.006 + 0.016 * ((w * 0.618) % 1) : 0;
    const seed = (w + 0.37) / count;
    const quad = [
      [-1, 0],
      [1, 0],
      [1, 1],
      [-1, 1]
    ];
    quad.forEach(([cx, cy], k) => {
      const v = w * 4 + k;
      positions.set([Math.cos(angle) * radius, 0, Math.sin(angle) * radius], v * 3);
      corners.set([cx!, cy!], v * 2);
      seeds[v] = seed;
    });
    const o = w * 4;
    index.push(o, o + 1, o + 2, o, o + 2, o + 3);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('corner', new BufferAttribute(corners, 2));
  geometry.setAttribute('seed', new BufferAttribute(seeds, 1));
  geometry.setIndex(index);
  geometry.boundingSphere = new Sphere(new Vector3(0, STEAM_SIZE.height / 2, 0), STEAM_SIZE.height);
  const color = STEAM_NIGHT.clone();
  const material = withFluidDisplacement(
    new ShaderMaterial({
      vertexShader: STEAM_VERTEX,
      fragmentShader: STEAM_FRAGMENT,
      defines: { STEAM_OCTAVES: Math.max(1, Math.round(options.octaves)) },
      uniforms: {
        uTime: { value: 0 },
        uStrength: { value: 0.5 },
        uOcclusion: { value: 0 },
        uColor: { value: color },
        uSize: { value: new Vector2(STEAM_SIZE.width, STEAM_SIZE.height) }
      },
      transparent: true,
      depthWrite: false,
      blending: CustomBlending,
      blendEquation: AddEquation,
      blendSrc: OneFactor,
      blendDst: OneMinusSrcAlphaFactor,
      side: DoubleSide
    })
  );
  const mesh = new Mesh(geometry, material);
  mesh.name = 'desk-steam';
  mesh.position.set(MUG.x, MUG.y + 0.088, MUG.z);
  mesh.renderOrder = 2;
  mesh.raycast = () => undefined;
  return {
    mesh,
    setTime: time => {
      material.uniforms.uTime!.value = time;
    },
    setStrength: (level, day = 0) => {
      color.copy(STEAM_NIGHT).lerp(STEAM_DAY, day);
      material.uniforms.uStrength!.value = level * (1 - 0.2 * day);
      material.uniforms.uOcclusion!.value = 0.35 * day;
    },
    dispose: () => {
      geometry.dispose();
      material.dispose();
    }
  };
}
