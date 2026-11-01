import { BoxGeometry, BufferGeometry, Color, CylinderGeometry, Group, Mesh, MeshStandardMaterial, SphereGeometry } from 'three';

export interface ClockParts {
  crown: Group;
  crownSpin: Group;
  hammer: Group;
  dispose(): void;
}

const CASE_RADIUS = 0.0655;
const DIAL_CENTER_Y = 0.0646;
const CASE_MID_DEPTH = 0.004;

interface PartKit {
  keep<T extends BufferGeometry>(geometry: T): T;
  metal: MeshStandardMaterial;
  dark: MeshStandardMaterial;
}

function addCrownRidges(crownSpin: Group, kit: PartKit): void {
  const ridge = kit.keep(new BoxGeometry(0.0016, 0.0062, 0.0016));
  const ridges = 12;
  for (let i = 0; i < ridges; i++) {
    const angle = (i / ridges) * Math.PI * 2;
    const mesh = new Mesh(ridge, i === 0 ? kit.dark : kit.metal);
    mesh.position.set(Math.cos(angle) * 0.0088, 0.009, Math.sin(angle) * 0.0088);
    mesh.rotation.y = -angle;
    crownSpin.add(mesh);
  }
}

function buildCrown(kit: PartKit): { crown: Group; crownSpin: Group } {
  const { keep, metal } = kit;
  const crown = new Group();
  crown.name = 'clock-crown';
  crown.position.set(CASE_RADIUS, DIAL_CENTER_Y, CASE_MID_DEPTH);
  crown.rotation.z = -Math.PI / 2;
  const crownSpin = new Group();
  crown.add(crownSpin);
  const stem = new Mesh(keep(new CylinderGeometry(0.0028, 0.0028, 0.007, 10)), metal);
  stem.position.y = 0.0035;
  const cap = new Mesh(keep(new CylinderGeometry(0.0085, 0.0085, 0.006, 20)), metal);
  cap.position.y = 0.009;
  const dome = new Mesh(keep(new SphereGeometry(0.0062, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2)), metal);
  dome.position.y = 0.012;
  dome.scale.y = 0.45;
  crownSpin.add(stem, cap, dome);
  addCrownRidges(crownSpin, kit);
  return { crown, crownSpin };
}

function buildHammer(kit: PartKit): Group {
  const hammer = new Group();
  hammer.name = 'clock-hammer';
  hammer.position.set(0, 0.116, -0.017);
  const arm = new Mesh(kit.keep(new CylinderGeometry(0.0011, 0.0011, 0.03, 6)), kit.dark);
  arm.position.y = 0.015;
  const head = new Mesh(kit.keep(new SphereGeometry(0.0042, 12, 8)), kit.metal);
  head.position.y = 0.031;
  hammer.add(arm, head);
  return hammer;
}

export function createClockParts(): ClockParts {
  const geometries: BufferGeometry[] = [];
  const keep = <T extends BufferGeometry>(geometry: T): T => {
    geometries.push(geometry);
    return geometry;
  };
  const metal = new MeshStandardMaterial({ color: new Color(0xd8d2c4), metalness: 0.45, roughness: 0.32, emissive: new Color(0xd8d2c4), emissiveIntensity: 0.1 });
  const dark = new MeshStandardMaterial({ color: new Color(0x3a3630), metalness: 0.3, roughness: 0.5, emissive: new Color(0x3a3630), emissiveIntensity: 0.08 });
  const kit: PartKit = { keep, metal, dark };
  const { crown, crownSpin } = buildCrown(kit);
  const hammer = buildHammer(kit);

  for (const group of [crown, hammer]) {
    group.traverse(object => {
      object.castShadow = true;
      object.receiveShadow = true;
    });
  }

  return {
    crown,
    crownSpin,
    hammer,
    dispose() {
      for (const geometry of geometries) geometry.dispose();
      metal.dispose();
      dark.dispose();
    }
  };
}
