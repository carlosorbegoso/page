import {
  BackSide,
  BoxGeometry,
  CanvasTexture,
  Color,
  Mesh,
  MeshBasicMaterial,
  MeshDepthMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  PMREMGenerator,
  RGBADepthPacking,
  Scene,
  SRGBColorSpace,
  Matrix3,
  Vector3,
  type Texture,
  type WebGLRenderer
} from 'three';
import { tokenColor } from '../tokens';
import { WALL_SPILL_ALBEDO, WALL_SPILL_DECLARATIONS, WALL_SPILL_LIGHT } from './screens/wallSpill';

/** Number of object ids the per-object arrays cover (ids 0 … OBJECT_SLOTS − 1). */
export const OBJECT_SLOTS = 12;
/** Figures animated in the vertex shader: object ids 1 … FIGURE_SLOTS. */
export const FIGURE_SLOTS = 4;

/** Uniforms the atlas shader exposes: hover, per-figure lift/turn and per-object light. */
export interface AtlasUniforms {
  uHoverId: { value: number };
  uHoverMix: { value: number };
  uHoverColor: { value: Color };
  /** Pivot (base centre) of each animated figure. */
  uFigPivot: { value: Vector3[] };
  uFigLift: { value: number[] };
  uFigYaw: { value: number[] };
  /** Multiplier of the baked emission (signal lines) per object id. */
  uSignal: { value: number[] };
  /** Extra self-illumination (albedo × value) per object id: folder labels, highlights. */
  uGlow: { value: number[] };
  /** 1 lit and in colour … 0 dim and grey: a figure waits in the dark until the story introduces it. */
  uPresence: { value: number[] };
  /** Metres an object slides out along +X (a folder pulled off the shelf). */
  uPull: { value: number[] };
  /** Rotation of the TCS folder's left board about its spine, and a point on that spine. */
  uHinge: { value: Matrix3 };
  uHingeOrigin: { value: Vector3 };
}

const VERTEX_DECLARATIONS = /* glsl */ `
uniform vec3 uFigPivot[${FIGURE_SLOTS}];
uniform float uFigLift[${FIGURE_SLOTS}];
uniform float uFigYaw[${FIGURE_SLOTS}];
uniform float uPull[${OBJECT_SLOTS}];
uniform mat3 uHinge;
uniform vec3 uHingeOrigin;
attribute vec4 pbr;
attribute float oid;
varying vec4 vPbr;
varying float vOid;
varying vec3 vRoomPosition;
varying vec3 vRoomNormal;
`;

const FIGURE_YAW = /* glsl */ `
int figure = int(oid + 0.5) - 1;
float figureYaw = figure >= 0 && figure < ${FIGURE_SLOTS} ? uFigYaw[figure] : 0.0;
float yawC = cos(figureYaw);
float yawS = sin(figureYaw);
`;

const FIGURE_TRANSFORM = /* glsl */ `
if (figure >= 0 && figure < ${FIGURE_SLOTS}) {
  vec3 pivot = uFigPivot[figure];
  vec3 q = transformed - pivot;
  transformed = vec3(yawC * q.x + yawS * q.z, q.y, -yawS * q.x + yawC * q.z) + pivot + vec3(0.0, uFigLift[figure], 0.0);
}
transformed.x += uPull[clamp(int(oid + 0.5), 0, ${OBJECT_SLOTS - 1})];
if (abs(oid - 11.0) < 0.5) transformed = uHinge * (transformed - uHingeOrigin) + uHingeOrigin;
`;

const FRAGMENT_DECLARATIONS = /* glsl */ `
varying vec4 vPbr;
varying float vOid;
varying vec3 vRoomPosition;
varying vec3 vRoomNormal;
uniform float uHoverId;
uniform float uHoverMix;
uniform vec3 uHoverColor;
uniform float uSignal[${OBJECT_SLOTS}];
uniform float uGlow[${OBJECT_SLOTS}];
uniform float uPresence[${OBJECT_SLOTS}];
uniform vec4 uRoomBounds;
uniform vec4 uDeskBounds;
uniform float uDeskTop;

float woodGrain(vec3 p) {
  float rings = p.z * 58.0 + p.y * 40.0 + sin(p.x * 4.3) * 1.7 + sin(p.x * 11.0 + p.z * 9.0) * 0.45;
  float figure = pow(max(0.5 + 0.5 * sin(rings), 0.0), 2.5);
  float pores = 0.5 + 0.5 * sin(p.x * 210.0 + sin(p.z * 70.0 + p.y * 50.0) * 2.4);
  return 0.78 + 0.3 * figure - 0.08 * pores;
}

float occlusion(float distance, float facing, float radius, float strength) {
  return 1.0 - strength * (1.0 - facing) * exp(-max(distance, 0.0) / radius);
}

float roomOcclusion(vec3 p, vec3 n) {
  float ao = occlusion(p.y, abs(n.y), 0.22, 0.55);
  ao *= occlusion(p.z - uRoomBounds.z, abs(n.z), 0.28, 0.45);
  ao *= occlusion(p.x - uRoomBounds.x, abs(n.x), 0.3, 0.4);
  ao *= occlusion(uRoomBounds.y - p.x, abs(n.x), 0.3, 0.4);
  vec2 overDesk = step(abs(p.xz - uDeskBounds.xy), uDeskBounds.zw);
  float onDesk = overDesk.x * overDesk.y;
  ao *= mix(1.0, occlusion(p.y - uDeskTop, abs(n.y), 0.035, 0.4), onDesk * step(uDeskTop - 0.005, p.y));
  float underDesk = onDesk * (1.0 - smoothstep(0.0, uDeskTop - 0.02, p.y));
  ao *= 1.0 - 0.35 * underDesk;
  return ao;
}

${WALL_SPILL_DECLARATIONS}`;

/**
 * The room's single "atlas" material: albedo from vertex colours, and per-vertex
 * roughness / metalness / emission / wood-grain (`pbr` attribute) plus an object id (`oid`)
 * for hover. Ambient occlusion is analytic (distance to floor, walls and desk top), which
 * reads like a baked AO pass without a second UV set.
 */
export function createAtlasMaterial(
  roomBounds: [number, number, number, number],
  deskBounds: [number, number, number, number],
  deskTop: number
): {
  material: MeshStandardMaterial;
  uniforms: AtlasUniforms;
} {
  const material = new MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 0 });
  const uniforms: AtlasUniforms = {
    uHoverId: { value: -1 },
    uHoverMix: { value: 0 },
    uHoverColor: { value: new Color(1, 1, 1) },
    uFigPivot: { value: Array.from({ length: FIGURE_SLOTS }, () => new Vector3()) },
    uFigLift: { value: new Array<number>(FIGURE_SLOTS).fill(0) },
    uFigYaw: { value: new Array<number>(FIGURE_SLOTS).fill(0) },
    uSignal: { value: new Array<number>(OBJECT_SLOTS).fill(1) },
    uGlow: { value: new Array<number>(OBJECT_SLOTS).fill(0) },
    uPresence: { value: new Array<number>(OBJECT_SLOTS).fill(1) },
    uPull: { value: new Array<number>(OBJECT_SLOTS).fill(0) },
    uHinge: { value: new Matrix3() },
    uHingeOrigin: { value: new Vector3() }
  };
  material.onBeforeCompile = shader => {
    Object.assign(shader.uniforms, {
      uHoverId: uniforms.uHoverId,
      uHoverMix: uniforms.uHoverMix,
      uHoverColor: uniforms.uHoverColor,
      uFigPivot: uniforms.uFigPivot,
      uFigLift: uniforms.uFigLift,
      uFigYaw: uniforms.uFigYaw,
      uSignal: uniforms.uSignal,
      uGlow: uniforms.uGlow,
      uPresence: uniforms.uPresence,
      uPull: uniforms.uPull,
      uHinge: uniforms.uHinge,
      uHingeOrigin: uniforms.uHingeOrigin,
      uRoomBounds: { value: roomBounds },
      uDeskBounds: { value: deskBounds },
      uDeskTop: { value: deskTop }
    });
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${VERTEX_DECLARATIONS}`)
      .replace(
        '#include <beginnormal_vertex>',
        `#include <beginnormal_vertex>
        ${FIGURE_YAW}
        objectNormal = vec3(yawC * objectNormal.x + yawS * objectNormal.z, objectNormal.y, -yawS * objectNormal.x + yawC * objectNormal.z);
        if (abs(oid - 11.0) < 0.5) objectNormal = uHinge * objectNormal;`
      )
      .replace('#include <begin_vertex>', `#include <begin_vertex>\n${FIGURE_TRANSFORM}`)
      .replace(
        '#include <color_vertex>',
        '#include <color_vertex>\nvPbr = pbr;\nvOid = oid;\nvRoomPosition = position;\nvRoomNormal = normal;'
      );
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\n${FRAGMENT_DECLARATIONS}`)
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        if (vPbr.w > 0.0) diffuseColor.rgb *= mix(1.0, woodGrain(vRoomPosition), vPbr.w);
        diffuseColor.rgb *= roomOcclusion(vRoomPosition, normalize(vRoomNormal));
        ${WALL_SPILL_ALBEDO}
        float presence = uPresence[clamp(int(vOid + 0.5), 0, ${OBJECT_SLOTS - 1})];
        diffuseColor.rgb = mix(vec3(dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722))), diffuseColor.rgb, presence) * (0.3 + 0.7 * presence);`
      )
      .replace(
        '#include <lights_fragment_end>',
        `#include <lights_fragment_end>\n${WALL_SPILL_LIGHT}`
      )
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = vPbr.x;')
      .replace('#include <metalnessmap_fragment>', '#include <metalnessmap_fragment>\nmetalnessFactor = vPbr.y;')
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        int objectId = clamp(int(vOid + 0.5), 0, ${OBJECT_SLOTS - 1});
        totalEmissiveRadiance += diffuseColor.rgb * (vPbr.z * uSignal[objectId] * uPresence[objectId] + uGlow[objectId]);
        float hovered = (1.0 - step(0.5, abs(vOid - uHoverId))) * step(0.5, vOid);
        float rim = pow(clamp(1.0 - abs(dot(normalize(normal), normalize(vViewPosition))), 0.0, 1.0), 2.5);
        totalEmissiveRadiance += uHoverColor * hovered * uHoverMix * (0.05 + 0.6 * rim);`
      );
  };
  material.customProgramCacheKey = () => 'desk-atlas-v6';
  return { material, uniforms };
}

/**
 * Shadow depth material for the atlas mesh: applies the same figure lift and turn, so the lamp's
 * shadow follows a lifted or turning figure instead of staying at its rest pose.
 */
export function createAtlasDepthMaterial(uniforms: AtlasUniforms): MeshDepthMaterial {
  const material = new MeshDepthMaterial({ depthPacking: RGBADepthPacking });
  material.onBeforeCompile = shader => {
    Object.assign(shader.uniforms, {
      uFigPivot: uniforms.uFigPivot,
      uFigLift: uniforms.uFigLift,
      uFigYaw: uniforms.uFigYaw,
      uPull: uniforms.uPull,
      uHinge: uniforms.uHinge,
      uHingeOrigin: uniforms.uHingeOrigin
    });
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
uniform vec3 uFigPivot[${FIGURE_SLOTS}];
uniform float uFigLift[${FIGURE_SLOTS}];
uniform float uFigYaw[${FIGURE_SLOTS}];
uniform float uPull[${OBJECT_SLOTS}];
uniform mat3 uHinge;
uniform vec3 uHingeOrigin;
attribute float oid;`
      )
      .replace('#include <begin_vertex>', `#include <begin_vertex>\n${FIGURE_YAW}\n${FIGURE_TRANSFORM}`);
  };
  material.customProgramCacheKey = () => 'desk-atlas-depth-v3';
  return material;
}

/** A material that renders nothing but still lets the raycaster hit its mesh. */
export function createPickMaterial(): MeshBasicMaterial {
  return new MeshBasicMaterial({ visible: false });
}

function canvasTexture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  draw(ctx);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

/** Soft blob used by the contact-shadow quads (alpha only, generated once). */
export function createContactShadowTexture(): CanvasTexture {
  return canvasTexture(128, 128, ctx => {
    const gradient = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(0,0,0,0.85)');
    gradient.addColorStop(0.45, 'rgba(0,0,0,0.45)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
  });
}

function rgb(color: Color): string {
  const srgb = color.clone().convertLinearToSRGB();
  return `${Math.round(srgb.r * 255)},${Math.round(srgb.g * 255)},${Math.round(srgb.b * 255)}`;
}

/**
 * The monitor's idle picture: near-black glass with a faint, out-of-focus editor (code lines) and
 * a soft brand-blue glow, so the screen is never a dead slab (fallback captures, between slides).
 * The CSS3D screen content covers it when the plate is mounted.
 */
export function drawScreen(texture: CanvasTexture, aspect: number, glow: Color): void {
  const canvas = texture.image as HTMLCanvasElement;
  const width = 768;
  const height = Math.round(width / aspect);
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#05080e';
  ctx.fillRect(0, 0, width, height);
  const halo = ctx.createRadialGradient(width * 0.5, height * 0.45, 0, width * 0.5, height * 0.45, width * 0.7);
  halo.addColorStop(0, `rgba(${rgb(glow)},0.16)`);
  halo.addColorStop(1, `rgba(${rgb(glow)},0.02)`);
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, width, height);
  drawCode(ctx, width, height, glow, 0.38);
  texture.needsUpdate = true;
}

/** Phone lock screen: dark gradient, clock and (optionally) one notification card. */
export function drawPhone(texture: CanvasTexture, notification: boolean, accent: Color): void {
  const canvas = texture.image as HTMLCanvasElement;
  const width = 260;
  const height = 560;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const background = ctx.createLinearGradient(0, 0, 0, height);
  background.addColorStop(0, '#0b0f16');
  background.addColorStop(1, '#141b28');
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = 'rgba(233,238,245,0.85)';
  ctx.fillRect(width * 0.3, height * 0.12, width * 0.4, height * 0.05);
  ctx.fillStyle = 'rgba(155,168,187,0.5)';
  ctx.fillRect(width * 0.36, height * 0.19, width * 0.28, height * 0.015);
  if (notification) {
    ctx.fillStyle = 'rgba(24,32,46,0.95)';
    ctx.beginPath();
    ctx.roundRect(width * 0.06, height * 0.3, width * 0.88, height * 0.1, 14);
    ctx.fill();
    ctx.fillStyle = `rgba(${rgb(accent)},0.95)`;
    ctx.beginPath();
    ctx.arc(width * 0.15, height * 0.35, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(233,238,245,0.8)';
    ctx.fillRect(width * 0.24, height * 0.325, width * 0.5, 8);
    ctx.fillStyle = 'rgba(155,168,187,0.6)';
    ctx.fillRect(width * 0.24, height * 0.355, width * 0.62, 6);
  }
  texture.needsUpdate = true;
}

export function createPhoneTexture(): CanvasTexture {
  return canvasTexture(260, 560, () => undefined);
}

function drawCode(ctx: CanvasRenderingContext2D, width: number, height: number, accent: Color, alpha: number): void {
  let seed = 41;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const palette = [`rgba(${rgb(accent)},${alpha})`, `rgba(155,168,187,${alpha * 0.8})`, `rgba(74,222,154,${alpha * 0.7})`, `rgba(255,226,189,${alpha * 0.6})`];
  const margin = width * 0.06;
  const line = height / 26;
  ctx.save();
  ctx.filter = `blur(${(width / 512).toFixed(1)}px)`;
  ctx.fillStyle = `rgba(155,168,187,${alpha * 0.25})`;
  ctx.fillRect(0, 0, width * 0.035, height);
  ctx.fillRect(0, 0, width, line * 0.9);
  let indent = 0;
  for (let y = line * 1.8; y < height - line; y += line) {
    if (random() < 0.12) {
      indent = Math.max(0, indent - 1);
      continue;
    }
    let x = margin + indent * width * 0.03;
    const tokens = 1 + Math.floor(random() * 5);
    for (let t = 0; t < tokens && x < width * 0.9; t++) {
      const w = width * (0.02 + random() * 0.09);
      ctx.fillStyle = palette[Math.floor(random() * palette.length)]!;
      ctx.fillRect(x, y, w, line * 0.38);
      x += w + width * 0.012;
    }
    if (random() < 0.25) indent = Math.min(4, indent + 1);
  }
  ctx.restore();
}

export function createScreenTexture(): CanvasTexture {
  return canvasTexture(768, 480, () => undefined);
}

/**
 * Bakes a tiny night-room environment once (dark slate walls, a warm lamp patch, the cool
 * monitor and the window) so reflections match the room instead of the studio RoomEnvironment.
 */
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
