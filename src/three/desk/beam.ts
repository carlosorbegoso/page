import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  ConeGeometry,
  DoubleSide,
  Group,
  Mesh,
  Points,
  Quaternion,
  ShaderMaterial,
  Vector3
} from 'three';
import { seeded } from './math';

const CONE_VERTEX = /* glsl */ `
varying float vAlong;
varying vec3 vWorld;
varying vec3 vNormal;
void main() {
  vAlong = 1.0 - uv.y;
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorld = world.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const CONE_FRAGMENT = /* glsl */ `
uniform vec3 uColor;
uniform float uStrength;
uniform float uTime;
varying float vAlong;
varying vec3 vWorld;
varying vec3 vNormal;
float hash(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453); }
float noise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash(i), hash(i + vec3(1, 0, 0)), u.x), mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), u.x), u.y),
    mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), u.x), mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), u.x), u.y),
    u.z
  );
}
void main() {
  vec3 view = normalize(cameraPosition - vWorld);
  // A thin cone looks densest through its core: weight by how square-on the surface faces the eye.
  float core = pow(abs(dot(normalize(vNormal), view)), 1.6);
  float falloff = (1.0 - 0.75 * vAlong) * smoothstep(0.0, 0.08, vAlong) * smoothstep(1.0, 0.8, vAlong);
  float haze = 0.65 + 0.35 * noise(vWorld * 9.0 + vec3(0.0, -uTime * 0.03, uTime * 0.02));
  gl_FragColor = vec4(uColor * core * falloff * haze * uStrength, 1.0);
}
`;

const MOTES_VERTEX = /* glsl */ `
uniform float uTime;
uniform float uPixelScale;
uniform vec3 uApex;
uniform vec3 uAxis;
uniform float uLength;
uniform float uTan;
attribute vec4 seed;
varying float vLit;
void main() {
  vec3 drift = vec3(
    sin(uTime * 0.11 + seed.x * 6.28) * 0.012,
    -mod(uTime * 0.004 + seed.y, 1.0) * 0.03 + sin(uTime * 0.07 + seed.z * 6.28) * 0.006,
    cos(uTime * 0.09 + seed.w * 6.28) * 0.012
  );
  vec3 p = position + drift;
  vec3 rel = p - uApex;
  float along = dot(rel, uAxis);
  float radial = length(rel - uAxis * along);
  float inside = smoothstep(uTan * along, uTan * along * 0.55, radial);
  vLit = inside * smoothstep(0.02, 0.12, along) * smoothstep(uLength, uLength * 0.7, along) * (0.4 + 0.6 * seed.w);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = uPixelScale * (0.0011 + 0.0012 * seed.z) / -mv.z;
  gl_Position = projectionMatrix * mv;
}
`;

const MOTES_FRAGMENT = /* glsl */ `
uniform vec3 uColor;
uniform float uStrength;
varying float vLit;
void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float disc = smoothstep(1.0, 0.2, d);
  gl_FragColor = vec4(uColor * disc * vLit * uStrength, 1.0);
}
`;

export interface LampBeam {
  group: Group;
  setTime(time: number): void;
  /** Lamp level 0…1 (the beam follows the intro flicker and the outro switch-off). */
  setLevel(level: number): void;
  /** Drawing-buffer height in px, so the motes keep their size across DPR. */
  setPixelScale(height: number, fov: number): void;
  dispose(): void;
}

export interface LampBeamOptions {
  apex: Vector3;
  aim: Vector3;
  /** Half angle of the visible shaft (radians), narrower than the light's own cone. */
  angle: number;
  color: Color;
  /** 0 for no dust motes (mid tier). */
  motes: number;
}


/**
 * The lamp's visible shaft of light: an open additive cone from the bulb to the desk with slow
 * haze, plus dust motes that only glow while they drift inside it. Static without `setTime`
 * (reduced motion, capture).
 */
export function createLampBeam(options: LampBeamOptions): LampBeam {
  const { apex, aim, angle, color, motes } = options;
  const axis = aim.clone().sub(apex);
  const length = axis.length();
  axis.normalize();
  const tan = Math.tan(angle);
  const group = new Group();
  group.name = 'desk-lamp-beam';

  const coneGeometry = new ConeGeometry(length * tan, length, 40, 1, true).translate(0, -length / 2, 0);
  const coneMaterial = new ShaderMaterial({
    vertexShader: CONE_VERTEX,
    fragmentShader: CONE_FRAGMENT,
    uniforms: { uColor: { value: color.clone() }, uStrength: { value: 0 }, uTime: { value: 0 } },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    side: DoubleSide
  });
  const cone = new Mesh(coneGeometry, coneMaterial);
  cone.position.copy(apex);
  cone.quaternion.copy(new Quaternion().setFromUnitVectors(new Vector3(0, -1, 0), axis));
  cone.raycast = () => undefined;
  group.add(cone);

  let dust: Points<BufferGeometry, ShaderMaterial> | null = null;
  if (motes > 0) {
    const random = seeded(29);
    const positions = new Float32Array(motes * 3);
    const seeds = new Float32Array(motes * 4);
    const side = new Vector3(1, 0, 0).cross(axis).normalize();
    const other = axis.clone().cross(side).normalize();
    const point = new Vector3();
    for (let i = 0; i < motes; i++) {
      const along = (0.08 + 0.9 * random()) * length;
      const radius = Math.sqrt(random()) * along * tan * 1.1;
      const theta = random() * Math.PI * 2;
      point.copy(apex).addScaledVector(axis, along).addScaledVector(side, Math.cos(theta) * radius).addScaledVector(other, Math.sin(theta) * radius);
      point.toArray(positions, i * 3);
      seeds.set([random(), random(), random(), random()], i * 4);
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(positions, 3));
    geometry.setAttribute('seed', new BufferAttribute(seeds, 4));
    const material = new ShaderMaterial({
      vertexShader: MOTES_VERTEX,
      fragmentShader: MOTES_FRAGMENT,
      uniforms: {
        uColor: { value: color.clone() },
        uStrength: { value: 0 },
        uTime: { value: 0 },
        uPixelScale: { value: 1000 },
        uApex: { value: apex.clone() },
        uAxis: { value: axis.clone() },
        uLength: { value: length },
        uTan: { value: tan * 1.1 }
      },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending
    });
    dust = new Points(geometry, material);
    dust.frustumCulled = false;
    dust.raycast = () => undefined;
    group.add(dust);
  }

  return {
    group,
    setTime: time => {
      coneMaterial.uniforms.uTime!.value = time;
      if (dust) dust.material.uniforms.uTime!.value = time;
    },
    setLevel: level => {
      coneMaterial.uniforms.uStrength!.value = level * 0.05;
      if (dust) dust.material.uniforms.uStrength!.value = level * 0.9;
      group.visible = level > 0.002;
    },
    setPixelScale: (height, fov) => {
      if (dust) dust.material.uniforms.uPixelScale!.value = height / (2 * Math.tan((fov * Math.PI) / 360));
    },
    dispose: () => {
      coneGeometry.dispose();
      coneMaterial.dispose();
      dust?.geometry.dispose();
      dust?.material.dispose();
    }
  };
}
