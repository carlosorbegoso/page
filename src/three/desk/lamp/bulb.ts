import { AdditiveBlending, CanvasTexture, CircleGeometry, Color, Group, Mesh, MeshStandardMaterial, PointLight, Quaternion, Sprite, SpriteMaterial, Vector3 } from 'three';
import { tokenColor } from '../../tokens';
import { LAMP } from '../layout';

/** Mouth of the shade along the lamp's aim, matching `buildLamp` (shade 13 cm, diffuser 3.5 cm inside the rim). */
const DIFFUSER_OFFSET = 0.13 - 0.035 + 0.0012;
const DIFFUSER_RADIUS = 0.067;
/** Level the story calls "on" (cd), used to normalise the lamp's level to 0…1. */
const FULL_LAMP = 28;
/** Emission of the frosted diffuser at full power: clears the bloom threshold so the bulb blooms softly. */
const BULB_EMISSION = 4.2;
/** Warm bounce from the bulb onto what sits around it (figures, clock, monitor glass), in cd per lamp cd. */
const BULB_SPILL = 0.01;
const SPILL_RANGE = 0.9;

function haloTexture(): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  const g = canvas.getContext('2d')!;
  const gradient = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255,255,255,0.9)');
  gradient.addColorStop(0.35, 'rgba(255,255,255,0.25)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gradient;
  g.fillRect(0, 0, 64, 64);
  return new CanvasTexture(canvas);
}

/**
 * The bulb behind the shade's diffuser. The merged room bakes the diffuser as always glowing, so a
 * frosted disc sits just in front of it: cold grey glass when the lamp is off, warm and blooming when
 * it is on, with a soft halo at the rim and a short-range point light for the warm spill nearby.
 */
export class LampBulb {
  readonly group = new Group();
  private readonly glass: MeshStandardMaterial;
  private readonly disc: Mesh;
  private readonly halo: Sprite;
  private readonly haloMaterial: SpriteMaterial;
  private readonly spill: PointLight;
  private readonly warm: Color;

  constructor() {
    this.warm = tokenColor('--color-lamp', '#ffb566');
    const aim = LAMP.aim.clone().sub(LAMP.head).normalize();
    const mouth = LAMP.head.clone().addScaledVector(aim, DIFFUSER_OFFSET);
    this.glass = new MeshStandardMaterial({ color: 0x8d8a84, roughness: 0.55, metalness: 0, emissive: this.warm.clone(), emissiveIntensity: 0 });
    const disc = new Mesh(new CircleGeometry(DIFFUSER_RADIUS, 32), this.glass);
    this.disc = disc;
    disc.position.copy(mouth);
    disc.quaternion.copy(new Quaternion().setFromUnitVectors(new Vector3(0, 0, 1), aim));
    disc.raycast = () => undefined;
    this.haloMaterial = new SpriteMaterial({ map: haloTexture(), color: this.warm.clone(), blending: AdditiveBlending, depthWrite: false, transparent: true, opacity: 0 });
    this.halo = new Sprite(this.haloMaterial);
    this.halo.position.copy(mouth).addScaledVector(aim, 0.004);
    this.halo.scale.setScalar(0.2);
    this.halo.raycast = () => undefined;
    this.spill = new PointLight(this.warm.clone(), 0, SPILL_RANGE, 2);
    this.spill.position.copy(mouth).addScaledVector(aim, 0.05);
    this.group.name = 'desk-lamp-bulb';
    this.group.add(disc, this.halo, this.spill);
  }

  /** `lamp` in cd (the light rig's level); `day` 0…1 dims the halo against a bright room. */
  apply(lamp: number, day: number): void {
    const power = Math.min(lamp / FULL_LAMP, 1.2);
    this.glass.emissiveIntensity = BULB_EMISSION * power;
    this.haloMaterial.opacity = Math.min(power, 1) * (0.55 - 0.25 * day);
    this.halo.visible = power > 0.01;
    this.spill.intensity = lamp * BULB_SPILL;
  }

  dispose(): void {
    this.disc.geometry.dispose();
    this.glass.dispose();
    this.haloMaterial.map?.dispose();
    this.haloMaterial.dispose();
  }
}
