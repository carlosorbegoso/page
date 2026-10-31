import { BoxGeometry, Group, Mesh, OctahedronGeometry, type BufferGeometry } from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { surfaceMaterial, signalMaterial } from './materials';
import type { MascotRecipe } from './base';

const BODY_H = 0.48;
const LID_H = 0.12;
const SEAM = 0.012;
const LID_Y = BODY_H + SEAM + LID_H / 2;

function merge(parts: BufferGeometry[]): BufferGeometry {
  const flat = parts.map(part => (part.index ? part.toNonIndexed() : part));
  const merged = mergeGeometries(flat)!;
  for (const part of [...parts, ...flat]) part.dispose();
  return merged;
}

type GiftGeometries = {
  body: BufferGeometry;
  bodyRibbon: BufferGeometry;
  seam: BufferGeometry;
  lid: BufferGeometry;
  lidRibbon: BufferGeometry;
};

function geometries(): GiftGeometries {
  const bodyRibbon = merge([
    new BoxGeometry(0.08, BODY_H + 0.004, 0.62).translate(0, BODY_H / 2, 0),
    new BoxGeometry(0.62, BODY_H + 0.004, 0.08).translate(0, BODY_H / 2, 0)
  ]);
  const lidRibbon = merge([
    new BoxGeometry(0.08, LID_H + 0.006, 0.66),
    new BoxGeometry(0.66, LID_H + 0.006, 0.08),
    new OctahedronGeometry(0.07, 0).scale(1.4, 0.6, 0.8).rotateZ(0.35).translate(-0.075, LID_H / 2 + 0.03, 0),
    new OctahedronGeometry(0.07, 0).scale(1.4, 0.6, 0.8).rotateZ(-0.35).translate(0.075, LID_H / 2 + 0.03, 0)
  ]);
  return {
    body: new RoundedBoxGeometry(0.6, BODY_H, 0.6, 3, 0.05).translate(0, BODY_H / 2, 0),
    bodyRibbon,
    seam: new BoxGeometry(0.61, 0.008, 0.61).translate(0, BODY_H + SEAM / 2, 0),
    lid: new RoundedBoxGeometry(0.64, LID_H, 0.64, 3, 0.04),
    lidRibbon
  };
}

/** Parati's gift box: rounded box, separate lid over a glowing seam, flat cross ribbon. */
export const giftRecipe: MascotRecipe<GiftGeometries> = {
  id: 'gift',
  height: LID_Y + LID_H / 2 + 0.05,
  shadowSize: 0.95,
  geometries,
  assemble: (g, root) => {
    const body = surfaceMaterial({
      color: '--color-gift-body',
      roughness: '--gift-roughness',
      metalness: '--gift-metalness',
      flatShading: true
    });
    const ribbon = surfaceMaterial({
      color: '--color-gift-ribbon',
      roughness: '--gift-ribbon-roughness',
      metalness: '--gift-ribbon-metalness'
    });
    const seam = signalMaterial({ color: '--color-gift-ribbon', intensity: '--alfa-signal-intensity', scale: 0.4 });
    const motion = new Group();
    const lid = new Group();
    lid.position.y = LID_Y;
    lid.add(new Mesh(g.lid, body), new Mesh(g.lidRibbon, ribbon));
    motion.add(new Mesh(g.body, body), new Mesh(g.bodyRibbon, ribbon), new Mesh(g.seam, seam), lid);
    motion.rotation.y = -0.35;
    root.add(motion);
    return {
      motion,
      signals: [seam],
      materials: [body, ribbon, seam],
      focus: weight => {
        lid.position.y = LID_Y + weight * 0.025;
      }
    };
  }
};
