import { Group, IcosahedronGeometry, Mesh, TorusGeometry } from 'three';
import { surfaceMaterial, signalMaterial } from './materials';
import type { MascotRecipe } from './base';

const HOVER = 0.12;
const RADIUS = 0.45;
const STRETCH = 1.15;

function body() {
  const geometry = new IcosahedronGeometry(RADIUS, 1);
  const position = geometry.attributes.position!;
  for (let i = 0; i < position.count; i++) {
    const y = position.getY(i) * STRETCH;
    const taper = y < 0 ? 0.85 : 1;
    position.setXYZ(i, position.getX(i) * taper, y, position.getZ(i) * taper);
  }
  geometry.computeVertexNormals();
  return geometry.translate(0, RADIUS * STRETCH + HOVER, 0);
}

function visor() {
  return new TorusGeometry(0.43, 0.012, 6, 48)
    .rotateX(Math.PI / 2)
    .translate(0, RADIUS * STRETCH + HOVER + 0.1, 0);
}

export const alfaRecipe: MascotRecipe<{ body: IcosahedronGeometry; visor: TorusGeometry }> = {
  id: 'alfa',
  height: RADIUS * STRETCH * 2 + HOVER,
  shadowSize: 0.9,
  geometries: () => ({ body: body(), visor: visor() }),
  assemble: (g, root) => {
    const bodyMaterial = surfaceMaterial({
      color: '--color-alfa-body',
      roughness: '--alfa-roughness',
      metalness: '--alfa-metalness',
      flatShading: true
    });
    const visorMaterial = signalMaterial({ color: '--color-alfa-signal', intensity: '--alfa-signal-intensity' });
    const motion = new Group();
    motion.rotation.z = 0.12;
    motion.add(new Mesh(g.body, bodyMaterial), new Mesh(g.visor, visorMaterial));
    root.add(motion);
    return {
      motion,
      signals: [visorMaterial],
      materials: [bodyMaterial, visorMaterial],
      signalPulse: time => 1 + 0.125 * Math.sin((time / 4) * Math.PI * 2)
    };
  }
};
