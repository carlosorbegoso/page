import { PlaneGeometry, type BufferGeometry } from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import {
  CHAIR,
  CHARIZARD,
  DESK,
  FIGURES,
  KEYBOARD,
  LAMP,
  MONITOR,
  MUG,
  OPEN_FOLDER,
  PHONE,
  PIKACHU,
  PLINTH,
  SUCCULENT,
  TELESCOPE
} from '../layout';
import { CORKBOARD } from '../notes/layout';

export function contactShadowSpots(): Array<{ x: number; y: number; z: number; w: number; d: number; yaw?: number }> {
  const top = DESK.top + 0.0012;
  const plinthTop = PLINTH.centre.y + PLINTH.height + 0.0012;
  const { centre, yaw } = MONITOR;
  return [
    { x: centre.x, y: top, z: centre.z - 0.03, w: 0.36, d: 0.26, yaw },
    { x: KEYBOARD.x, y: top, z: KEYBOARD.z, w: 0.44, d: 0.19 },
    { x: KEYBOARD.trackpadX, y: top, z: KEYBOARD.z, w: 0.17, d: 0.14 },
    { x: OPEN_FOLDER.centre.x, y: top, z: OPEN_FOLDER.centre.z, w: OPEN_FOLDER.width + 0.06, d: OPEN_FOLDER.depth + 0.05, yaw: OPEN_FOLDER.yaw },
    { x: MUG.x, y: top, z: MUG.z, w: 0.13, d: 0.13 },
    { x: PIKACHU.base.x, y: PIKACHU.base.y + 0.0012, z: PIKACHU.base.z, w: 0.06, d: 0.06 },
    { x: CHARIZARD.base.x, y: CHARIZARD.base.y + 0.0012, z: CHARIZARD.base.z - 0.01, w: 0.07, d: 0.075 },
    { x: SUCCULENT.x, y: top, z: SUCCULENT.z, w: 0.1, d: 0.1 },
    { x: PHONE.base.x, y: top, z: PHONE.base.z, w: 0.14, d: 0.12, yaw: PHONE.yaw },
    { x: CORKBOARD.base.x, y: top, z: CORKBOARD.base.z - CORKBOARD.depth / 2, w: CORKBOARD.width + 0.03, d: 0.045 },
    { x: LAMP.base.x, y: top, z: LAMP.base.z, w: 0.2, d: 0.2 },
    { x: PLINTH.centre.x, y: top, z: PLINTH.centre.z, w: PLINTH.width + 0.07, d: PLINTH.depth + 0.06 },
    { x: FIGURES.alfa.x, y: plinthTop, z: FIGURES.alfa.z, w: 0.065, d: 0.06 },
    { x: FIGURES.skymek.x, y: plinthTop, z: FIGURES.skymek.z, w: 0.12, d: 0.042, yaw: -0.35 },
    { x: FIGURES.parati.x, y: plinthTop, z: FIGURES.parati.z, w: 0.082, d: 0.082, yaw: -0.2 },
    { x: FIGURES.ventixs.x, y: plinthTop, z: FIGURES.ventixs.z, w: 0.074, d: 0.04, yaw: -0.26 },
    { x: TELESCOPE.foot.x, y: 0.0012, z: TELESCOPE.foot.z, w: 0.8, d: 0.8 },
    { x: CHAIR.x, y: 0.0012, z: CHAIR.z, w: 0.75, d: 0.75 },
    { x: -(DESK.width / 2 - 0.07), y: 0.0012, z: 0, w: 0.12, d: 0.8 },
    { x: DESK.width / 2 - 0.07, y: 0.0012, z: 0, w: 0.12, d: 0.8 }
  ];
}

export function buildContactShadows(): BufferGeometry {
  const quads = contactShadowSpots().map(spot =>
    new PlaneGeometry(spot.w, spot.d).rotateX(-Math.PI / 2).rotateY(spot.yaw ?? 0).translate(spot.x, spot.y, spot.z)
  );
  const merged = mergeGeometries(quads, false)!;
  for (const quad of quads) quad.dispose();
  return merged;
}
