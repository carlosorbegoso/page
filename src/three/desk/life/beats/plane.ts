import {
  CanvasTexture,
  Color,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  SRGBColorSpace
} from 'three';
import { LATE_LAYER } from '../../../fx/late';
import { PAPER_LEVEL } from '../../notes/paper';

const DENSITY = 9000;
export const BEAT_MM = DENSITY / 1000;
const SCREEN_LEVEL = 0.92;
const PAD_MM = 3.2;
const SHADOW = { blur: 2.4, drop: 1.3, color: 'rgba(12, 9, 6, 0.55)' } as const;
const GRAIN_PER_PX = 1 / 80;

export interface BeatSize {
  width: number;
  height: number;
}

export interface BeatCanvas {
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
  mm: number;
}

function lateMaterial(texture: CanvasTexture, paper: boolean): MeshBasicMaterial {
  return new MeshBasicMaterial({
    map: texture,
    color: new Color().setScalar(paper ? PAPER_LEVEL : SCREEN_LEVEL),
    transparent: true,
    depthWrite: false,
    depthTest: false,
    alphaTest: 0.01
  });
}

function canvasOf(width: number, height: number): BeatCanvas {
  const element = document.createElement('canvas');
  element.width = Math.round(width);
  element.height = Math.round(height);
  return {
    context: element.getContext('2d')!,
    width: element.width,
    height: element.height,
    mm: BEAT_MM
  };
}

function addGrain(canvas: BeatCanvas): void {
  const { context, width, height } = canvas;
  context.save();
  context.globalCompositeOperation = 'source-atop';
  for (let i = Math.round(width * height * GRAIN_PER_PX); i > 0; i--) {
    context.fillStyle = Math.random() < 0.5 ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.06)';
    context.fillRect(Math.random() * width, Math.random() * height, 1.4, 1.4);
  }
  context.restore();
}

function withShadow(face: BeatCanvas): BeatCanvas {
  const pad = PAD_MM * BEAT_MM;
  const sheet = canvasOf(face.width + pad * 2, face.height + pad * 2);
  const { context } = sheet;
  context.shadowColor = SHADOW.color;
  context.shadowBlur = SHADOW.blur * BEAT_MM;
  context.shadowOffsetY = SHADOW.drop * BEAT_MM;
  context.drawImage(face.context.canvas, pad, pad);
  return sheet;
}

export class BeatPlane {
  readonly mesh: Mesh<PlaneGeometry, MeshBasicMaterial>;
  private readonly texture: CanvasTexture;

  constructor(size: BeatSize, paper: boolean, draw: (canvas: BeatCanvas) => void) {
    const face = canvasOf(size.width * DENSITY, size.height * DENSITY);
    draw(face);
    addGrain(face);
    const sheet = withShadow(face);
    this.texture = new CanvasTexture(sheet.context.canvas);
    this.texture.colorSpace = SRGBColorSpace;
    this.texture.anisotropy = 8;
    const pad = (PAD_MM * 2) / 1000;
    this.mesh = new Mesh(
      new PlaneGeometry(size.width + pad, size.height + pad),
      lateMaterial(this.texture, paper)
    );
    this.mesh.name = 'desk-beat';
    this.mesh.renderOrder = 6;
    this.mesh.layers.set(LATE_LAYER);
    this.mesh.matrixAutoUpdate = false;
    this.mesh.raycast = () => undefined;
  }

  set opacity(value: number) {
    this.mesh.material.opacity = value;
    this.mesh.visible = value > 0.001;
  }

  dispose(): void {
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.texture.dispose();
  }
}
