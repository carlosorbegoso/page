import { Group, type PerspectiveCamera, type Texture } from 'three';
import type { DeskFrame } from '../set/frame';
import type { LightLevels } from '../set/levels';
import { createFrame } from './frame';
import { PortraitGlass } from './glass';
import { PortraitInspect } from './inspect';
import { PORTRAIT } from './layout';
import { PictureLight } from './light';
import { createPrint } from './photo';

/**
 * Carlos's framed photo on the wall: frame and contact shadow, the toned print in its mat, the glass
 * with its reflections and hover glint, the brass picture light for the night, and the click that
 * brings the camera closer.
 */
export class WallPortrait {
  readonly group = new Group();
  private readonly glass = new PortraitGlass();
  private readonly light: PictureLight;
  private readonly frame = createFrame();
  private readonly print: ReturnType<typeof createPrint>;
  private readonly inspect: PortraitInspect;

  constructor(camera: PerspectiveCamera, environment: Texture | null, invalidate: () => void) {
    this.print = createPrint(invalidate);
    this.light = new PictureLight(environment);
    this.inspect = new PortraitInspect(camera);
    const picture = new Group();
    picture.position.copy(PORTRAIT.centre);
    this.print.mesh.position.z = PORTRAIT.depth / 2 - 0.007;
    picture.add(this.frame.group, this.print.mesh, this.glass.mesh);
    picture.traverse(node => (node.raycast = () => undefined));
    this.group.add(picture, this.light.group);
    this.group.name = 'desk-portrait';
  }

  setHover(hovered: boolean): void {
    this.glass.setHover(hovered);
  }

  update(frame: DeskFrame): boolean {
    this.inspect.update(frame);
    return this.glass.update(frame);
  }

  apply(level: LightLevels): void {
    this.glass.apply(level);
    this.light.apply(level);
  }

  dispose(): void {
    this.inspect.dispose();
    this.print.dispose();
    this.frame.dispose();
    this.glass.dispose();
    this.light.dispose();
  }
}
