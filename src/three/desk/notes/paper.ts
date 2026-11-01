import { CanvasTexture, Color, Mesh, MeshStandardMaterial, PlaneGeometry, SRGBColorSpace } from 'three';

export { wrap } from '../folder-detail/wrap';

export const PRINT_DENSITY = 4200;
export const PAPER_LEVEL = 0.8;

export interface PrintedFace {
  mesh: Mesh<PlaneGeometry, MeshStandardMaterial>;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  texture: CanvasTexture;
  scale: number;
  dispose(): void;
}

export interface PrintFonts {
  display: string;
  body: string;
  mono: string;
  hand: string;
}

export function printFonts(): PrintFonts {
  const root = getComputedStyle(document.documentElement);
  const read = (name: string, fallback: string) => root.getPropertyValue(name).trim() || fallback;
  return {
    display: read('--font-display', 'system-ui, sans-serif'),
    body: read('--font-sans', 'system-ui, sans-serif'),
    mono: read('--font-mono', 'ui-monospace, monospace'),
    hand: "'Bradley Hand', 'Segoe Print', 'Marker Felt', 'Comic Sans MS', cursive"
  };
}

export function printedFace(name: string, width: number, height: number, density = PRINT_DENSITY): PrintedFace {
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * density);
  canvas.height = Math.round(height * density);
  const context = canvas.getContext('2d')!;
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  const material = new MeshStandardMaterial({
    map: texture,
    color: new Color(PAPER_LEVEL, PAPER_LEVEL, PAPER_LEVEL),
    roughness: 0.95,
    metalness: 0,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2
  });
  const mesh = new Mesh(new PlaneGeometry(width, height), material);
  mesh.name = name;
  mesh.receiveShadow = true;
  mesh.raycast = () => undefined;
  return {
    mesh,
    canvas,
    context,
    texture,
    scale: density,
    dispose() {
      mesh.geometry.dispose();
      material.dispose();
      texture.dispose();
    }
  };
}

export function whenFontsReady(draw: () => void): void {
  draw();
  void document.fonts?.ready.then(draw);
}
