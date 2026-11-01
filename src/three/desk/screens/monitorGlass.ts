import { Color, Mesh, MeshStandardMaterial, PlaneGeometry, type CanvasTexture, type Group, type Texture } from 'three';
import { MONITOR } from '../layout';
import { monitorFrame } from '../shots';

/** HDR gain of the picture so it stays luminous through ACES / the FX composer. */
const SCREEN_HDR = 1.8;
const BREATH = 0.035;

/**
 * The monitor glass: the idle picture is emitted, while the glass itself is a glossy dielectric
 * that reflects the baked room (window, lamp) through the environment map, so the reflection slides
 * as the camera moves. The emission breathes very slightly, like a panel's backlight.
 */
export class MonitorGlass {
  readonly mesh: Mesh<PlaneGeometry, MeshStandardMaterial>;
  private breath = 1;

  constructor(room: Group, picture: CanvasTexture, environment: Texture | null) {
    const material = new MeshStandardMaterial({
      color: new Color('#030406'),
      roughness: 0.14,
      metalness: 0,
      emissive: new Color(1, 1, 1),
      emissiveMap: picture,
      envMap: environment,
      envMapIntensity: 0.55
    });
    this.mesh = new Mesh(new PlaneGeometry(MONITOR.screen.width, MONITOR.screen.height), material);
    this.mesh.name = 'desk-screen';
    const frame = monitorFrame();
    this.mesh.position.copy(frame.centre);
    this.mesh.quaternion.copy(frame.quaternion);
    room.add(this.mesh);
  }

  /** Slow backlight drift with a faint flutter; still when motion is off. */
  update(time: number, motion: boolean): void {
    this.breath = motion ? 1 + BREATH * Math.sin(time * 0.8) + BREATH * 0.35 * Math.sin(time * 5.3 + Math.sin(time * 1.7)) : 1;
  }

  apply(monitorLevel: number): void {
    this.mesh.material.emissiveIntensity = SCREEN_HDR * Math.min(monitorLevel / 5, 1.2) * this.breath;
  }

  dispose(): void {
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}
