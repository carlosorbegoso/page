import { BoxGeometry, ExtrudeGeometry, Group, Mesh, Path, Shape, type BufferGeometry } from 'three';
import { surfaceMaterial, signalMaterial } from './materials';
import type { MascotRecipe } from './base';

const THICKNESS = 0.06;
const BEVEL = 0.01;
const HEAD_X = 0.235;
const HEAD_R = 0.09;
const JAW_R = 0.05;
const RING_X = -0.25;
const RING_R = 0.065;
const HANDLE_HALF = 0.03;
const TILT = Math.PI / 2 - Math.PI / 6;

function profile(): Shape[] {
  const head = new Shape();
  const open = (35 * Math.PI) / 180;
  head.absarc(HEAD_X, 0, HEAD_R, open, Math.PI * 2 - open, false);
  for (const deg of [300, 240, 180, 120, 60]) {
    const a = (deg * Math.PI) / 180;
    head.lineTo(HEAD_X + Math.cos(a) * JAW_R, Math.sin(a) * JAW_R);
  }
  head.closePath();

  const ring = new Shape();
  ring.absarc(RING_X, 0, RING_R, 0, Math.PI * 2, false);
  const hole = new Path();
  hole.absarc(RING_X, 0, 0.035, 0, Math.PI * 2, true);
  ring.holes.push(hole);

  const handle = new Shape();
  const left = RING_X + 0.05;
  const right = HEAD_X - 0.07;
  handle.moveTo(left, -HANDLE_HALF);
  handle.lineTo(right, -HANDLE_HALF * 1.2);
  handle.lineTo(right, HANDLE_HALF * 1.2);
  handle.lineTo(left, HANDLE_HALF);
  handle.closePath();
  return [head, ring, handle];
}

type ToolGeometries = { body: BufferGeometry; band: BufferGeometry; groove: BufferGeometry };

function geometries(): ToolGeometries {
  const body = new ExtrudeGeometry(profile(), {
    depth: THICKNESS,
    bevelEnabled: true,
    bevelSize: BEVEL,
    bevelThickness: BEVEL,
    bevelSegments: 2,
    curveSegments: 20
  }).translate(-RING_X, 0, -THICKNESS / 2);
  const bandX = -RING_X - 0.01;
  return {
    body,
    band: new BoxGeometry(0.12, 0.078, THICKNESS + 0.03).translate(bandX, 0, 0),
    groove: new BoxGeometry(0.3, 0.007, THICKNESS + 0.022).translate(bandX, 0, 0)
  };
}

/** SkyMek's tool: a stylised combination wrench resting on its ring, tilted 30°. */
export const toolRecipe: MascotRecipe<ToolGeometries> = {
  id: 'tool',
  height: Math.sin(TILT) * (HEAD_X - RING_X + HEAD_R) + RING_R,
  shadowSize: 0.6,
  geometries,
  assemble: (g, root) => {
    const steel = surfaceMaterial({ color: '--color-tool-body', roughness: '--tool-roughness', metalness: '--tool-metalness' });
    const band = surfaceMaterial({
      color: '--color-tool-band',
      roughness: '--tool-band-roughness',
      metalness: '--tool-band-metalness'
    });
    const groove = signalMaterial({ color: '--color-tool-band', intensity: '--alfa-signal-intensity', scale: 0.7 });
    const motion = new Group();
    const tilt = new Group();
    tilt.position.y = RING_R + BEVEL;
    tilt.rotation.z = TILT;
    const spin = new Group();
    spin.add(new Mesh(g.body, steel), new Mesh(g.band, band), new Mesh(g.groove, groove));
    tilt.add(spin);
    motion.add(tilt);
    root.add(motion);
    return {
      motion,
      signals: [groove],
      materials: [steel, band, groove],
      idle: time => {
        spin.rotation.x = time * 0.25;
      }
    };
  }
};
