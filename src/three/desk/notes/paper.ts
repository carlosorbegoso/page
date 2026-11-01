import { CanvasTexture, Color, Mesh, MeshStandardMaterial, PlaneGeometry, SRGBColorSpace } from 'three';

export { wrap } from '../folder-detail/wrap';

/** Texels per metre: the board and the cards are read up close, so their ink stays crisp at 2× DPR. */
export const PRINT_DENSITY = 4200;
/** The desk lamp washes lit paper out; printed faces are darkened a little so the ink keeps its contrast. */
export const PAPER_LEVEL = 0.8;

export interface PrintedFace {
  mesh: Mesh<PlaneGeometry, MeshStandardMaterial>;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  texture: CanvasTexture;
  /** Canvas pixels per metre of the face. */
  scale: number;
  dispose(): void;
}

export interface PrintFonts {
  display: string;
  body: string;
  mono: string;
  /** Marker handwriting for the board's title and the post-its (system hand fonts, then cursive). */
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

/**
 * A flat printed face of `width` × `height` metres in the XY plane (facing +Z, origin at its centre)
 * with a canvas texture to draw on at `density` texels per metre. Not pickable: clicks go through
 * the desk's pick proxies.
 */
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

/** Redraws once the page's web fonts are ready, so the first print never falls back to system fonts. */
export function whenFontsReady(draw: () => void): void {
  draw();
  void document.fonts?.ready.then(draw);
}
