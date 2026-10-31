import { CanvasTexture, Mesh, MeshBasicMaterial, PlaneGeometry, SRGBColorSpace, type Texture } from 'three';
import { acquire, release } from '../assets';

const KEY = 'texture:contact-shadow';
let geometry: PlaneGeometry | undefined;

function bake(): Texture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(0,0,0,0.85)');
  gradient.addColorStop(0.45, 'rgba(0,0,0,0.4)');
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

/** Baked contact shadow (a transparent plane), shared texture with refcount. */
export async function createContactShadow(width: number, depth = width): Promise<{ mesh: Mesh; dispose: () => void }> {
  const texture = await acquire(KEY, async () => bake(), t => t.dispose());
  geometry ??= new PlaneGeometry(1, 1).rotateX(-Math.PI / 2);
  const material = new MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, opacity: 0.7 });
  const mesh = new Mesh(geometry, material);
  mesh.name = 'contact-shadow';
  mesh.scale.set(width, 1, depth);
  mesh.position.y = 0.002;
  mesh.renderOrder = -1;
  mesh.raycast = () => undefined;
  return {
    mesh,
    dispose: () => {
      material.dispose();
      release(KEY);
    }
  };
}
