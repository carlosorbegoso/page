import { AdditiveBlending, Color, Mesh, PlaneGeometry, ShaderMaterial } from 'three';
import { tokenColor } from '../../tokens';
import type { DeskFrame } from '../set/frame';
import type { LightLevels } from '../set/levels';
import { PORTRAIT, PORTRAIT_GLASS_Z } from './layout';
import { PORTRAIT_GLASS_FRAGMENT, PORTRAIT_GLASS_VERTEX } from './glass.glsl';

const GLINT_SECONDS = 0.85;
const GLINT_PEAK = 0.2;
/** Under reduced motion the hover shows a still sheen instead of the sweep. */
const STILL_GLINT = 0.12;
/** Level the story calls "on" for the desk lamp (cd). */
const FULL_LAMP = 28;
const DAYLIGHT = new Color('#e8eef6');

/** The glass over the print: faint window and lamp reflections, and a glint that sweeps on hover. */
export class PortraitGlass {
  readonly mesh: Mesh<PlaneGeometry, ShaderMaterial>;
  private readonly moon = tokenColor('--color-moonlight', '#9db8e8');
  private readonly lamp = tokenColor('--color-lamp', '#ffb566');
  private hovered = false;
  private sweep = -1;

  constructor() {
    const width = PORTRAIT.width - PORTRAIT.moulding * 2;
    const height = PORTRAIT.height - PORTRAIT.moulding * 2;
    const material = new ShaderMaterial({
      vertexShader: PORTRAIT_GLASS_VERTEX,
      fragmentShader: PORTRAIT_GLASS_FRAGMENT,
      uniforms: {
        uWindow: { value: new Color() },
        uLamp: { value: new Color() },
        uGlint: { value: 0 },
        uGlintStrength: { value: 0 },
        uAspect: { value: width / height }
      },
      blending: AdditiveBlending,
      transparent: true,
      depthWrite: false
    });
    this.mesh = new Mesh(new PlaneGeometry(width, height), material);
    this.mesh.position.z = PORTRAIT_GLASS_Z - PORTRAIT.centre.z;
    this.mesh.name = 'desk-portrait-glass';
  }

  setHover(hovered: boolean): void {
    if (hovered && !this.hovered) this.sweep = 0;
    this.hovered = hovered;
  }

  update(frame: DeskFrame): boolean {
    const uniforms = this.mesh.material.uniforms;
    if (!frame.motion) {
      this.sweep = -1;
      uniforms.uGlint!.value = 0.55;
      uniforms.uGlintStrength!.value = this.hovered ? STILL_GLINT : 0;
      return false;
    }
    if (this.sweep < 0) {
      uniforms.uGlintStrength!.value = 0;
      return false;
    }
    this.sweep = Math.min(this.sweep + frame.dt / GLINT_SECONDS, 1);
    uniforms.uGlint!.value = this.sweep;
    uniforms.uGlintStrength!.value = GLINT_PEAK * Math.sin(Math.PI * this.sweep);
    if (this.sweep >= 1) this.sweep = -1;
    return true;
  }

  apply(level: LightLevels): void {
    const uniforms = this.mesh.material.uniforms;
    const opening = 1 - 0.8 * level.blind;
    const pane = (uniforms.uWindow!.value as Color).copy(this.moon).lerp(DAYLIGHT, level.day);
    pane.multiplyScalar((0.035 * level.moon + 0.05 * level.day) * opening);
    (uniforms.uLamp!.value as Color).copy(this.lamp).multiplyScalar(0.22 * Math.min(level.lamp / FULL_LAMP, 1.2));
  }

  dispose(): void {
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}
