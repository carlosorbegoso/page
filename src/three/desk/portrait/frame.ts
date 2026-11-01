import { BoxGeometry, CanvasTexture, Group, Mesh, MeshBasicMaterial, MeshStandardMaterial, PlaneGeometry, type BufferGeometry, type Material } from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { ROOM } from '../layout';
import { PORTRAIT } from './layout';

/** How far the shadow reaches past the frame, and how far it drops (the picture light is above). */
const SHADOW_SPREAD = 0.05;
const SHADOW_DROP = 0.018;

/** Four mitred-looking bars of matte black wood, plus a thin back board the mat rests on. */
function mouldingGeometry(): BufferGeometry {
  const { width, height, depth, moulding } = PORTRAIT;
  const bars = [
    new BoxGeometry(width, moulding, depth).translate(0, (height - moulding) / 2, 0),
    new BoxGeometry(width, moulding, depth).translate(0, -(height - moulding) / 2, 0),
    new BoxGeometry(moulding, height - moulding * 2, depth).translate(-(width - moulding) / 2, 0, 0),
    new BoxGeometry(moulding, height - moulding * 2, depth).translate((width - moulding) / 2, 0, 0),
    new BoxGeometry(width - moulding, height - moulding, 0.003).translate(0, 0, -depth / 2 + 0.0015)
  ];
  const merged = mergeGeometries(bars, false)!;
  for (const bar of bars) bar.dispose();
  return merged;
}

/** A soft dark halo drawn with the canvas shadow blur (the rectangle itself stays off-canvas). */
function shadowTexture(widthPx: number, heightPx: number, blur: number): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = widthPx;
  canvas.height = heightPx;
  const context = canvas.getContext('2d')!;
  context.shadowColor = 'rgba(0,0,0,0.85)';
  context.shadowBlur = blur;
  context.shadowOffsetX = widthPx;
  context.fillStyle = '#000';
  context.fillRect(blur - widthPx, blur, widthPx - blur * 2, heightPx - blur * 2);
  return new CanvasTexture(canvas);
}

/** The frame itself and its contact shadow on the wall. */
export function createFrame(): { group: Group; dispose(): void } {
  const group = new Group();
  const geometry = mouldingGeometry();
  const wood = new MeshStandardMaterial({ color: '#16130f', roughness: 0.62, metalness: 0 });
  const frame = new Mesh(geometry, wood);
  frame.name = 'desk-portrait-frame';
  const shadowWidth = PORTRAIT.width + SHADOW_SPREAD * 2;
  const shadowHeight = PORTRAIT.height + SHADOW_SPREAD * 2;
  const texture = shadowTexture(128, Math.round((128 * shadowHeight) / shadowWidth), 18);
  const shadowGeometry = new PlaneGeometry(shadowWidth, shadowHeight);
  const shade = new MeshBasicMaterial({ color: 0x000000, map: texture, transparent: true, opacity: 0.7, depthWrite: false });
  const shadow = new Mesh(shadowGeometry, shade);
  shadow.position.set(0, -SHADOW_DROP, ROOM.back + 0.0015 - PORTRAIT.centre.z);
  shadow.name = 'desk-portrait-shadow';
  group.add(shadow, frame);
  const disposables: Array<BufferGeometry | Material | CanvasTexture> = [geometry, wood, texture, shadowGeometry, shade];
  return { group, dispose: () => disposables.forEach(item => item.dispose()) };
}
