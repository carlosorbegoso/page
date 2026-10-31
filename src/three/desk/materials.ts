import {
  BackSide,
  BoxGeometry,
  CanvasTexture,
  Color,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  type Texture,
  type WebGLRenderer
} from 'three';
import { tokenColor } from '../tokens';

/** Uniforms the atlas shader exposes for hover highlighting. */
export interface AtlasUniforms {
  uHoverId: { value: number };
  uHoverMix: { value: number };
  uHoverColor: { value: Color };
}

const VERTEX_DECLARATIONS = /* glsl */ `
attribute vec4 pbr;
attribute float oid;
varying vec4 vPbr;
varying float vOid;
varying vec3 vRoomPosition;
varying vec3 vRoomNormal;
`;

const FRAGMENT_DECLARATIONS = /* glsl */ `
varying vec4 vPbr;
varying float vOid;
varying vec3 vRoomPosition;
varying vec3 vRoomNormal;
uniform float uHoverId;
uniform float uHoverMix;
uniform vec3 uHoverColor;
uniform vec4 uRoomBounds;
uniform vec4 uDeskBounds;
uniform float uDeskTop;

float woodGrain(vec3 p) {
  float rings = p.z * 58.0 + p.y * 40.0 + sin(p.x * 4.3) * 1.7 + sin(p.x * 11.0 + p.z * 9.0) * 0.45;
  float figure = pow(0.5 + 0.5 * sin(rings), 2.5);
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
`;

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
    uHoverColor: { value: new Color(1, 1, 1) }
  };
  material.onBeforeCompile = shader => {
    Object.assign(shader.uniforms, uniforms, {
      uRoomBounds: { value: roomBounds },
      uDeskBounds: { value: deskBounds },
      uDeskTop: { value: deskTop }
    });
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${VERTEX_DECLARATIONS}`)
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
        diffuseColor.rgb *= roomOcclusion(vRoomPosition, normalize(vRoomNormal));`
      )
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = vPbr.x;')
      .replace('#include <metalnessmap_fragment>', '#include <metalnessmap_fragment>\nmetalnessFactor = vPbr.y;')
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        totalEmissiveRadiance += diffuseColor.rgb * vPbr.z;
        float hovered = (1.0 - step(0.5, abs(vOid - uHoverId))) * step(0.5, vOid);
        float rim = pow(1.0 - abs(dot(normalize(normal), normalize(vViewPosition))), 2.5);
        totalEmissiveRadiance += uHoverColor * hovered * uHoverMix * (0.05 + 0.6 * rim);`
      );
  };
  material.customProgramCacheKey = () => 'desk-atlas-v1';
  return { material, uniforms };
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

/** Faint fake reflection on the window glass: a warm smear where the lamp would reflect. */
export function createGlassTexture(tint: Color, lamp: Color, moon: Color, opacity: number): CanvasTexture {
  return canvasTexture(256, 256, ctx => {
    ctx.fillStyle = `rgba(${rgb(tint)},${opacity})`;
    ctx.fillRect(0, 0, 256, 256);
    const sky = ctx.createLinearGradient(0, 0, 0, 256);
    sky.addColorStop(0, `rgba(${rgb(moon)},0.10)`);
    sky.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, 256, 256);
    const warm = ctx.createRadialGradient(40, 196, 2, 40, 196, 70);
    warm.addColorStop(0, `rgba(${rgb(lamp)},0.14)`);
    warm.addColorStop(1, `rgba(${rgb(lamp)},0)`);
    ctx.fillStyle = warm;
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = 'rgba(255,255,255,0.012)';
    ctx.lineWidth = 18;
    ctx.beginPath();
    ctx.moveTo(150, 0);
    ctx.lineTo(256, 120);
    ctx.stroke();
  });
}

function rgb(color: Color): string {
  const srgb = color.clone().convertLinearToSRGB();
  return `${Math.round(srgb.r * 255)},${Math.round(srgb.g * 255)},${Math.round(srgb.b * 255)}`;
}

/** Rect (in 0..1 screen UV, y down) where the hero plate sits; the screen stays black there. */
export interface ScreenRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Draws the monitor's picture: near-black glass with a faint, out-of-focus editor (code lines)
 * so the screen is never a dead black slab, and, when the hero plate floats over it, a soft dark
 * pool under the text plus a brand-blue halo around it.
 */
export function drawScreen(texture: CanvasTexture, aspect: number, rect: ScreenRect | null, glow: Color): void {
  const canvas = texture.image as HTMLCanvasElement;
  const width = 768;
  const height = Math.round(width / aspect);
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#03050a';
  ctx.fillRect(0, 0, width, height);
  drawCode(ctx, width, height, glow, rect ? 0.22 : 0.42);
  if (!rect) {
    texture.needsUpdate = true;
    return;
  }
  const cx = (rect.x + rect.width / 2) * width;
  const cy = (rect.y + rect.height / 2) * height;
  const radius = Math.max(width, height) * 0.75;
  const halo = ctx.createRadialGradient(cx, cy, Math.min(rect.width * width, rect.height * height) * 0.3, cx, cy, radius);
  halo.addColorStop(0, `rgba(${rgb(glow)},0.2)`);
  halo.addColorStop(0.5, `rgba(${rgb(glow)},0.07)`);
  halo.addColorStop(1, `rgba(${rgb(glow)},0.02)`);
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, width, height);
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale((rect.width * width) / 2, (rect.height * height) / 2);
  const pool = ctx.createRadialGradient(0, 0, 0.2, 0, 0, 1.25);
  pool.addColorStop(0, 'rgba(2,3,6,0.9)');
  pool.addColorStop(0.7, 'rgba(2,3,6,0.75)');
  pool.addColorStop(1, 'rgba(2,3,6,0)');
  ctx.fillStyle = pool;
  ctx.fillRect(-1.4, -1.4, 2.8, 2.8);
  ctx.restore();
  texture.needsUpdate = true;
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
  const shellMaterial = new MeshBasicMaterial({ color: tokenColor('--color-moonlight', '#9db8e8').multiplyScalar(0.35), side: BackSide });
  scene.add(new Mesh(shellGeometry, shellMaterial));
  disposables.push(shellGeometry, shellMaterial);
  patch(tokenColor('--color-moonlight', '#9db8e8'), 3, [2.2, 1.4], [0.6, 0.4, -2.9], [0, 0, 0]);
  patch(tokenColor('--color-monitor-glow', '#7fb8ff'), 4, [0.7, 0.4], [-0.2, 0, -1.2], [0, 0, 0]);
  patch(tokenColor('--color-lamp', '#ffb566'), 8, [0.5, 0.5], [-0.5, 1.4, -0.6], [0, 0, 0]);
  patch(tokenColor('--color-lamp', '#ffb566'), 0.25, [2, 2], [0, -1.49, 0], [0, 0, 0]);
  const generator = new PMREMGenerator(renderer);
  const target = generator.fromScene(scene, 0.04);
  generator.dispose();
  for (const item of disposables) item.dispose();
  return target.texture;
}
