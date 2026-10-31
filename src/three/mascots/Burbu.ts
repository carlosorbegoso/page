import { CapsuleGeometry, ConeGeometry, Group, Mesh, type BufferGeometry } from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { surfaceMaterial, signalMaterial } from './materials';
import type { MascotRecipe } from './base';

const LIFT = 0.25;
const DEPTH_SCALE = 0.55;

function body(): BufferGeometry {
  const capsule = new CapsuleGeometry(0.2, 0.25, 8, 16).rotateZ(Math.PI / 2).scale(1, 1, DEPTH_SCALE);
  const tail = new ConeGeometry(0.07, 0.12, 12)
    .scale(1, 1, DEPTH_SCALE)
    .rotateZ(2.4)
    .translate(-0.2, -0.17, 0);
  const merged = mergeGeometries([capsule, tail])!;
  capsule.dispose();
  tail.dispose();
  return merged.translate(0, LIFT, 0);
}

function dot(): BufferGeometry {
  return new CapsuleGeometry(0.018, 0.04, 4, 8).rotateZ(Math.PI / 2);
}

/** Burbu, Ventixs' mascot: a flattened chat bubble with three "typing" signal slots. */
export const burbuRecipe: MascotRecipe<{ body: BufferGeometry; dot: BufferGeometry }> = {
  id: 'burbu',
  height: LIFT + 0.2,
  shadowSize: 0.75,
  geometries: () => ({ body: body(), dot: dot() }),
  assemble: (g, root) => {
    const bodyMaterial = surfaceMaterial({
      color: '--color-burbu-body',
      roughness: '--burbu-roughness',
      metalness: '--burbu-metalness'
    });
    const dots = [0, 1, 2].map(() =>
      signalMaterial({ color: '--color-burbu-signal', intensity: '--burbu-signal-intensity' })
    );
    const motion = new Group();
    motion.rotation.z = -0.1;
    motion.add(new Mesh(g.body, bodyMaterial));
    dots.forEach((material, index) => {
      const mesh = new Mesh(g.dot, material);
      mesh.position.set((index - 1) * 0.09, LIFT, 0.2 * DEPTH_SCALE - 0.004);
      motion.add(mesh);
    });
    root.add(motion);
    return {
      motion,
      signals: dots,
      materials: [bodyMaterial, ...dots],
      signalPulse: (time, index) => {
        const phase = Math.floor(time / 0.4) % 4;
        return phase === index ? 1.6 : 0.55;
      }
    };
  }
};
