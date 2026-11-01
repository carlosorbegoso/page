import {
  AdditiveBlending,
  BufferGeometry,
  CanvasTexture,
  Color,
  Float32BufferAttribute,
  Group,
  Points,
  ShaderMaterial,
  SRGBColorSpace,
  Vector3,
  type Sprite,
  type Texture
} from 'three';
import { tokenColor } from '../tokens';
import { glowSprite, mulberry32 } from './common';

const STAR_CLASSES = [
  { color: '#bfd6ff', share: 0.3, size: [0.8, 1.6], brightness: [0.7, 1] },
  { color: '#f3f6ff', share: 0.45, size: [0.6, 1.4], brightness: [0.5, 0.9] },
  { color: '#ffe2bd', share: 0.2, size: [0.8, 1.8], brightness: [0.5, 0.8] },
  { color: '#ffb98f', share: 0.05, size: [1.2, 2.4], brightness: [0.4, 0.6] }
] as const;

const VERTEX = /* glsl */ `
  attribute float size;
  attribute float twinkle;
  attribute vec3 color;
  uniform float time;
  uniform float pixelRatio;
  uniform float period;
  uniform float amplitude;
  varying vec3 vColor;
  void main() {
    float wave = twinkle > 0.0 ? 1.0 + amplitude * sin(6.2831853 * (time / period + twinkle)) : 1.0;
    vColor = color * wave;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = size * pixelRatio * 3.2;
  }
`;

const FRAGMENT = /* glsl */ `
  varying vec3 vColor;
  void main() {
    vec2 p = gl_PointCoord - 0.5;
    float d = dot(p, p) * 4.0;
    float core = exp(-d * 3.5);
    float halo = exp(-d * 1.2) * 0.3;
    gl_FragColor = vec4(vColor * (core + halo), 1.0);
  }
`;

function gradientTexture(top: Color, bottom: Color): Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 2;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createLinearGradient(0, 0, 0, 256);
  gradient.addColorStop(0, `#${top.getHexString()}`);
  gradient.addColorStop(1, `#${bottom.getHexString()}`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 2, 256);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

const DOME_RADIUS = 48;

interface StarField {
  positions: number[];
  sizes: number[];
  twinkles: number[];
  brightness: number[];
  classes: number[];
}

function pickStarClass(random: () => number): number {
  let pick = random();
  let index = 0;
  while (index < STAR_CLASSES.length - 1 && pick > STAR_CLASSES[index]!.share) pick -= STAR_CLASSES[index++]!.share;
  return index;
}

function scatterStars(count: number): StarField {
  const random = mulberry32(101);
  const band = new Vector3(1, 0.55, -0.3).normalize();
  const field: StarField = { positions: [], sizes: [], twinkles: [], brightness: [], classes: [] };
  for (let i = 0; i < count; i++) {
    let direction = new Vector3(random() * 2 - 1, random() * 2 - 1, random() * 2 - 1).normalize();
    if (random() < 0.38) direction = direction.lerp(band.clone().multiplyScalar(random() < 0.5 ? 1 : -1), 0.55).normalize();
    field.positions.push(direction.x * DOME_RADIUS, direction.y * DOME_RADIUS, direction.z * DOME_RADIUS);
    const index = pickStarClass(random);
    const starClass = STAR_CLASSES[index]!;
    const bias = random() ** 3;
    field.sizes.push(starClass.size[0] + (starClass.size[1] - starClass.size[0]) * bias);
    field.brightness.push(starClass.brightness[0] + (starClass.brightness[1] - starClass.brightness[0]) * random());
    field.classes.push(index);
    field.twinkles.push(random() < 0.15 ? random() + 0.001 : 0);
  }
  return field;
}

function createStarMaterial(): ShaderMaterial {
  return new ShaderMaterial({
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    uniforms: {
      time: { value: 0 },
      pixelRatio: { value: 1 },
      period: { value: 7 },
      amplitude: { value: 0.18 }
    },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending
  });
}

function placeNebulae(glow: Texture, nebulaCount: number): Sprite[] {
  const opacity = 0.14;
  const placements = [
    new Vector3(-0.55, 0.45, -0.7),
    new Vector3(-0.8, 0.1, -0.2),
    new Vector3(0.6, -0.1, -0.8)
  ];
  return placements.slice(0, nebulaCount).map((dir, i) => {
    const sprite = glowSprite(glow, 32 + i * 6, opacity * 2.2);
    sprite.position.copy(dir.normalize().multiplyScalar(DOME_RADIUS * 0.9));
    return sprite;
  });
}

export class Sky {
  readonly root = new Group();
  background: Texture | null = null;
  private readonly geometry = new BufferGeometry();
  private readonly material: ShaderMaterial;
  private readonly nebulae: Sprite[];
  private readonly classes: number[] = [];
  private readonly brightness: number[] = [];

  constructor(count: number, nebulaCount: number, glow: Texture) {
    const field = scatterStars(count);
    this.brightness.push(...field.brightness);
    this.classes.push(...field.classes);
    this.geometry.setAttribute('position', new Float32BufferAttribute(field.positions, 3));
    this.geometry.setAttribute('size', new Float32BufferAttribute(field.sizes, 1));
    this.geometry.setAttribute('twinkle', new Float32BufferAttribute(field.twinkles, 1));
    this.geometry.setAttribute('color', new Float32BufferAttribute(new Float32Array(count * 3), 3));
    this.material = createStarMaterial();
    const stars = new Points(this.geometry, this.material);
    stars.frustumCulled = false;
    stars.raycast = () => undefined;
    this.nebulae = placeNebulae(glow, nebulaCount);
    this.root.add(stars, ...this.nebulae);
    this.root.renderOrder = -10;
    this.applyTokens();
  }

  update(time: number, motion: boolean, camera: Vector3, pixelRatio: number): void {
    this.root.position.copy(camera);
    this.material.uniforms.time!.value = motion ? time : 0;
    this.material.uniforms.pixelRatio!.value = pixelRatio;
  }

  applyTokens(): void {
    const colors = STAR_CLASSES.map(c => new Color(c.color));
    const attribute = this.geometry.getAttribute('color') as Float32BufferAttribute;
    const color = new Color();
    this.classes.forEach((index, i) => {
      color.copy(colors[index]!).multiplyScalar(this.brightness[i]!);
      attribute.setXYZ(i, color.r, color.g, color.b);
    });
    attribute.needsUpdate = true;
    const tints = ['#1b3a6b', '#0e3a40', '#2b2150'];
    this.nebulae.forEach((sprite, i) => sprite.material.color.set(tints[i]!));
    this.background?.dispose();
    this.background = gradientTexture(tokenColor('--color-sky-zenith', '#04060b'), tokenColor('--color-sky-horizon', '#0a0e14'));
  }

  dispose(): void {
    this.geometry.dispose();
    this.material.dispose();
    for (const sprite of this.nebulae) sprite.material.dispose();
    this.background?.dispose();
  }
}
