import { BoxGeometry, Color, CylinderGeometry, Group, Mesh, MeshStandardMaterial, SpotLight, Vector3, type BufferGeometry, type Texture } from 'three';
import type { LightLevels } from '../set/levels';
import { PICTURE_LIGHT, PORTRAIT } from './layout';

/** Candela at night (the room scales its physical light tokens down, see `set/lighting.ts`). */
const NIGHT_INTENSITY = 0.16;
const WARM = new Color('#ffcf8f');
const BULB_EMISSION = 2.4;

function armGeometry(): BufferGeometry {
  const from = PICTURE_LIGHT.plate;
  const to = PICTURE_LIGHT.hood;
  const length = from.distanceTo(to);
  const geometry = new CylinderGeometry(0.003, 0.003, length, 8);
  geometry.rotateX(Math.atan2(to.z - from.z, to.y - from.y));
  return geometry.translate(0, (to.y - from.y) / 2, (to.z - from.z) / 2);
}

/**
 * A brass picture light over the frame. It switches on with the night (`level.day` → 0): the
 * strip under the hood glows and a short warm spot washes the print and the wall around it.
 */
export class PictureLight {
  readonly group = new Group();
  private readonly spot: SpotLight;
  private readonly strip: MeshStandardMaterial;
  private readonly materials: MeshStandardMaterial[];
  private readonly geometries: BufferGeometry[];

  constructor(environment: Texture | null) {
    const brass = new MeshStandardMaterial({ color: '#b58a46', metalness: 0.85, roughness: 0.32, envMap: environment, envMapIntensity: 1.2 });
    this.strip = new MeshStandardMaterial({ color: '#2a241c', roughness: 0.6, emissive: WARM.clone(), emissiveIntensity: 0 });
    const { plate, hood, hoodLength, hoodRadius } = PICTURE_LIGHT;
    const plateGeometry = new BoxGeometry(0.05, 0.03, 0.008);
    const arm = armGeometry();
    const hoodGeometry = new CylinderGeometry(hoodRadius, hoodRadius, hoodLength, 20).rotateZ(Math.PI / 2);
    const stripGeometry = new BoxGeometry(hoodLength - 0.01, 0.003, hoodRadius);
    const parts: Array<[BufferGeometry, MeshStandardMaterial, Vector3]> = [
      [plateGeometry, brass, plate],
      [arm, brass, plate],
      [hoodGeometry, brass, hood],
      [stripGeometry, this.strip, hood.clone().add(new Vector3(0, -hoodRadius * 0.92, 0))]
    ];
    for (const [geometry, material, at] of parts) {
      const mesh = new Mesh(geometry, material);
      mesh.position.copy(at);
      mesh.raycast = () => undefined;
      this.group.add(mesh);
    }
    this.spot = new SpotLight(WARM.clone(), 0, 0.9, 0.95, 0.85, 2);
    this.spot.position.copy(hood).add(new Vector3(0, -hoodRadius, 0.01));
    this.spot.target.position.copy(PORTRAIT.centre).add(new Vector3(0, -0.04, 0));
    this.group.add(this.spot, this.spot.target);
    this.group.name = 'desk-picture-light';
    this.materials = [brass, this.strip];
    this.geometries = [plateGeometry, arm, hoodGeometry, stripGeometry];
  }

  apply(level: LightLevels): void {
    const on = 1 - level.day;
    this.spot.intensity = NIGHT_INTENSITY * on;
    this.strip.emissiveIntensity = BULB_EMISSION * on;
  }

  dispose(): void {
    for (const material of this.materials) material.dispose();
    for (const geometry of this.geometries) geometry.dispose();
  }
}
