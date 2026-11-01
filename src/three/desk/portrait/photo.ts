import { CanvasTexture, Mesh, MeshStandardMaterial, PlaneGeometry, SRGBColorSpace } from 'three';
import { PORTRAIT, PORTRAIT_PHOTO } from './layout';

const PIXELS_PER_METRE = 2300;
const MAT = '#d3ccbc';
/** Where the face sits in the source photo: crop around 30 % from the top, like `object-position`. */
const FOCUS_Y = 0.3;

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

function matSize(): { width: number; height: number } {
  return { width: PORTRAIT.width - PORTRAIT.moulding * 2, height: PORTRAIT.height - PORTRAIT.moulding * 2 };
}

function photoBox(canvas: HTMLCanvasElement): Box {
  const width = Math.round(PORTRAIT.photo.width * PIXELS_PER_METRE);
  const height = Math.round(PORTRAIT.photo.height * PIXELS_PER_METRE);
  /* A mat is cut with a slightly heavier bottom border, as framers do. */
  return { x: Math.round((canvas.width - width) / 2), y: Math.round((canvas.height - height) / 2 - canvas.height * 0.015), width, height };
}

function drawMat(context: CanvasRenderingContext2D, box: Box): void {
  const { width, height } = context.canvas;
  context.fillStyle = MAT;
  context.fillRect(0, 0, width, height);
  const bevel = 5;
  context.fillStyle = '#e2dccf';
  context.fillRect(box.x - bevel, box.y - bevel, box.width + bevel * 2, box.height + bevel * 2);
  context.fillStyle = '#bdb5a5';
  context.fillRect(box.x - bevel, box.y - bevel, box.width + bevel * 2, bevel * 0.6);
  context.fillStyle = '#5c5850';
  context.fillRect(box.x, box.y, box.width, box.height);
}

/** Black and white with a slight warm tone and a touch of contrast, so the print matches the room's grade. */
function gradePhoto(context: CanvasRenderingContext2D, box: Box): void {
  const image = context.getImageData(box.x, box.y, box.width, box.height);
  const data = image.data;
  for (let i = 0; i < data.length; i += 4) {
    const luma = (0.2126 * data[i]! + 0.7152 * data[i + 1]! + 0.0722 * data[i + 2]!) / 255;
    const toned = Math.min(Math.max((luma - 0.5) * 1.12 + 0.5, 0), 1);
    data[i] = Math.min(255, toned * 255 * 1.04 + 4);
    data[i + 1] = toned * 255 * 0.99 + 2;
    data[i + 2] = toned * 255 * 0.88;
  }
  context.putImageData(image, box.x, box.y);
}

function drawPhoto(context: CanvasRenderingContext2D, box: Box, image: HTMLImageElement): void {
  const aspect = box.width / box.height;
  const sourceAspect = image.naturalWidth / image.naturalHeight;
  const sw = sourceAspect > aspect ? image.naturalHeight * aspect : image.naturalWidth;
  const sh = sourceAspect > aspect ? image.naturalHeight : image.naturalWidth / aspect;
  const sx = (image.naturalWidth - sw) / 2;
  const sy = (image.naturalHeight - sh) * FOCUS_Y;
  context.drawImage(image, sx, sy, sw, sh, box.x, box.y, box.width, box.height);
  gradePhoto(context, box);
}

/**
 * The mat and the print as one canvas texture. The mat is drawn at once with a neutral print; the
 * photo is drawn into the same texture when it arrives, so the material never changes program.
 */
export function createPrint(onReady: () => void): { mesh: Mesh<PlaneGeometry, MeshStandardMaterial>; dispose(): void } {
  const size = matSize();
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(size.width * PIXELS_PER_METRE);
  canvas.height = Math.round(size.height * PIXELS_PER_METRE);
  const context = canvas.getContext('2d', { willReadFrequently: true })!;
  const box = photoBox(canvas);
  drawMat(context, box);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  const material = new MeshStandardMaterial({ map: texture, roughness: 0.82, metalness: 0 });
  const mesh = new Mesh(new PlaneGeometry(size.width, size.height), material);
  mesh.name = 'desk-portrait-print';
  const image = new Image();
  image.decoding = 'async';
  image.onload = () => {
    drawPhoto(context, box, image);
    texture.needsUpdate = true;
    onReady();
  };
  image.src = PORTRAIT_PHOTO;
  return {
    mesh,
    dispose: () => {
      image.onload = null;
      mesh.geometry.dispose();
      material.dispose();
      texture.dispose();
    }
  };
}
