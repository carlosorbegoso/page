import { Color, Vector3, type PointLight } from 'three';

const FIRE_INTENSITY = 0.22;
const BOLT_INTENSITY = 0.36;
const BLEND_AT = 0.06;
const FIRE = new Color('#ff7a2a');
const BOLT = new Color('#b8d6ff');

export class FlashLight {
  private readonly restPosition = new Vector3();
  private readonly restColor = new Color();
  private readonly tint = new Color();
  private borrowed = false;

  constructor(private readonly light: PointLight | null) {}

  apply(fire: number, bolt: number, at: Vector3, time: number): void {
    const light = this.light;
    if (!light) return;
    const fireLight = fire * FIRE_INTENSITY * (0.8 + 0.2 * Math.sin(time * 37) * Math.sin(time * 23));
    const boltLight = bolt * BOLT_INTENSITY;
    const strength = fireLight + boltLight;
    if (strength <= 1e-4) return this.giveBack(light);
    if (!this.borrowed) {
      this.restPosition.copy(light.position);
      this.restColor.copy(light.color);
      this.borrowed = true;
    }
    const share = Math.min(1, strength / BLEND_AT);
    const weight = share * share * (3 - 2 * share);
    light.position.lerpVectors(this.restPosition, at, weight);
    this.tint.copy(FIRE).lerp(BOLT, boltLight / strength);
    light.color.copy(this.restColor).lerp(this.tint, weight);
    light.intensity = light.intensity * (1 - weight) + strength;
  }

  private giveBack(light: PointLight): void {
    if (!this.borrowed) return;
    light.position.copy(this.restPosition);
    light.color.copy(this.restColor);
    this.borrowed = false;
  }
}
