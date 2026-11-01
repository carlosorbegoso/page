import { Color, DirectionalLight, HemisphereLight, PointLight, SpotLight, Vector3, type Group } from 'three';
import { tokenColor, tokenNumber } from '../../tokens';
import { FOLDER, GLASS_Z, LAMP, ROOM, WINDOW, folderCentre } from '../layout';
import { monitorFrame } from '../shots';
import type { LightLevels } from './levels';

/**
 * The light tokens are physical values (cd, nits, lux); the renderer's ACES exposure is tuned
 * high, so the room scales them to keep desk.md's balance: a warm pool that does not clip, a
 * readable moon rim and a fill that keeps the walls off pure black. The monitor is a soft cold
 * point light in front of the glass (a RectAreaLight's LTC tables would triple the chunk).
 */
const LIGHT_CALIBRATION = { lamp: 0.4, monitor: 0.16, moon: 3, fill: 2.5, shelf: 9 } as const;
const SUN_COLOR = '#fff1dc';
const SKY_FILL = '#dfe8f2';
const GROUND_FILL = '#a08c72';
/** Hemisphere gain by day: overcast light fills the whole room. */
const DAY_FILL_GAIN = 14;
/** Share of the window light (moon or sun, its wall spill, the shelf rake) a lowered blind holds back. */
const BLIND_SHADE = 0.85;
/** Share of the daylight fill that came through the window. */
const BLIND_FILL_SHADE = 0.6;
/** With the window covered the lamp reads brighter against the room. */
const BLIND_LAMP_GAIN = 0.2;

/** Lamp, monitor glow, moon (the sun by day), hemisphere fill and the shelf rake. */
export class LightRig {
  readonly lamp: SpotLight;
  private readonly monitorLight: PointLight;
  private readonly moon: DirectionalLight;
  private readonly fill: HemisphereLight;
  private readonly shelfLight: SpotLight;
  private readonly ambientIntensity: number;
  private readonly moonNight: Color;
  private readonly moonDawn: Color;
  private readonly sunColor = new Color(SUN_COLOR);
  private readonly nightSky = new Color(0x1b2436);
  private readonly nightGround = new Color(0x0a0806);
  private readonly daySky = new Color(SKY_FILL);
  private readonly dayGround = new Color(GROUND_FILL);
  private readonly moonAt: Vector3;
  private readonly sunAt = new Vector3();

  constructor(parent: Group, high: boolean) {
    this.lamp = new SpotLight(tokenColor('--color-lamp', '#ffb566'), 0, 0, tokenNumber('--lamp-angle', 0.62), tokenNumber('--lamp-penumbra', 0.75), 2);
    const aim = LAMP.aim.clone().sub(LAMP.head).normalize();
    this.lamp.position.copy(LAMP.head).addScaledVector(aim, 0.125);
    this.lamp.target.position.copy(LAMP.aim);
    if (high) {
      this.lamp.castShadow = true;
      this.lamp.shadow.mapSize.set(1024, 1024);
      this.lamp.shadow.radius = 4;
      this.lamp.shadow.bias = -0.0005;
      this.lamp.shadow.normalBias = 0.01;
      this.lamp.shadow.camera.near = 0.05;
      this.lamp.shadow.camera.far = 3;
    }
    const monitor = monitorFrame();
    this.monitorLight = new PointLight(tokenColor('--color-monitor-glow', '#7fb8ff'), 0, 0, 2);
    this.monitorLight.position.copy(monitor.centre).addScaledVector(monitor.normal, 0.3);
    this.moonNight = tokenColor('--color-moonlight', '#9db8e8');
    this.moonDawn = tokenColor('--color-dawn-low', '#e9a47a');
    this.moon = new DirectionalLight(this.moonNight.clone(), 0);
    this.moon.position.set(WINDOW.x + 1.2, WINDOW.y + 1.6, ROOM.back - 3);
    this.moonAt = this.moon.position.clone();
    this.sunAt.set(WINDOW.x - 1.6, WINDOW.y + 3.4, ROOM.back - 3);
    this.moon.target.position.set(0, 0.6, 0.8);
    this.ambientIntensity = tokenNumber('--desk-ambient-intensity', 0.08);
    this.fill = new HemisphereLight(0x1b2436, 0x0a0806, this.ambientIntensity * LIGHT_CALIBRATION.fill);
    this.shelfLight = new SpotLight(this.moonNight.clone(), 0, 0, 0.42, 0.85, 2);
    this.shelfLight.position.set(WINDOW.x - 0.3, WINDOW.y + 0.35, GLASS_Z + 0.08);
    this.shelfLight.target.position.copy(folderCentre('intercorp')).add(new Vector3(FOLDER.depth / 2, 0, 0));
    parent.add(this.lamp, this.lamp.target, this.monitorLight, this.moon, this.moon.target, this.fill, this.shelfLight, this.shelfLight.target);
  }

  apply(level: LightLevels): void {
    const opening = 1 - BLIND_SHADE * level.blind;
    this.lamp.intensity = level.lamp * LIGHT_CALIBRATION.lamp * (1 + BLIND_LAMP_GAIN * level.blind);
    this.monitorLight.intensity = level.monitor * LIGHT_CALIBRATION.monitor * (1 - 0.8 * level.day);
    this.moon.intensity = level.moon * LIGHT_CALIBRATION.moon * opening;
    this.shelfLight.intensity = level.shelf * LIGHT_CALIBRATION.shelf * opening;
    this.moon.color.copy(this.moonNight).lerp(this.sunColor, level.day).lerp(this.moonDawn, level.dawn * 0.7);
    this.moon.position.copy(this.moonAt).lerp(this.sunAt, level.day);
    this.fill.color.copy(this.nightSky).lerp(this.daySky, level.day);
    this.fill.groundColor.copy(this.nightGround).lerp(this.dayGround, level.day);
    const daylight = level.day * DAY_FILL_GAIN * (1 - BLIND_FILL_SHADE * level.blind);
    this.fill.intensity = this.ambientIntensity * LIGHT_CALIBRATION.fill * (1 + level.dawn * 1.5 * opening + daylight);
  }
}
