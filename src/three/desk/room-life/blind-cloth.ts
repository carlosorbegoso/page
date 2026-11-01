import { DataTexture, LinearFilter, LinearMipmapLinearFilter, PlaneGeometry, RepeatWrapping, SRGBColorSpace } from 'three';
import { seeded } from '../math';

const WEAVE_TEXELS = 32;
export const WEAVE_TILE = 0.12;

/**
 * Unit-length cloth hanging from y = 0 to y = -1 (scaled to the drop): shallow vertical ripples
 * and a soft belly towards the room, flattened where the tube and the bottom bar hold it.
 */
export function clothGeometry(width: number): PlaneGeometry {
  const geometry = new PlaneGeometry(width, 1, 64, 10).translate(0, -0.5, 0);
  const position = geometry.attributes.position!;
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const down = -position.getY(i);
    const across = (2 * x) / width;
    const held = Math.sin(Math.PI * down);
    const ripple = 0.0018 * Math.sin(x * 57 + 0.8 * Math.sin(x * 13));
    const belly = 0.006 * held * (1 - 0.6 * across * across);
    position.setZ(i, ripple * (0.3 + 0.7 * held) + belly);
  }
  geometry.computeVertexNormals();
  return geometry;
}

/** Linen weave: uneven warp threads (the vertical grain) over a faint alternating weft. */
export function weaveTexture(): DataTexture {
  const random = seeded(11);
  const warp = Array.from({ length: WEAVE_TEXELS }, () => 0.86 + 0.14 * random());
  const data = new Uint8Array(WEAVE_TEXELS * WEAVE_TEXELS * 4);
  for (let y = 0; y < WEAVE_TEXELS; y++) {
    for (let x = 0; x < WEAVE_TEXELS; x++) {
      const weft = (x + y) % 2 ? 0.96 : 1;
      const value = Math.round(255 * warp[x]! * weft * (0.96 + 0.04 * random()));
      data.set([value, value, value, 255], (y * WEAVE_TEXELS + x) * 4);
    }
  }
  const texture = new DataTexture(data, WEAVE_TEXELS, WEAVE_TEXELS);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.colorSpace = SRGBColorSpace;
  texture.magFilter = LinearFilter;
  texture.minFilter = LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}
