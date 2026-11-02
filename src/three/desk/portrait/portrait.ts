import { Group, type Texture } from 'three';
import type { DeskFrame } from '../set/frame';
import type { LightLevels } from '../set/levels';
import type { BioCard } from './bio-card';
import { createFrame } from './frame';
import { PortraitGlass } from './glass';
import type { PortraitInspect } from './inspect';
import { PORTRAIT } from './layout';
import { PictureLight } from './light';
import { createPrint } from './photo';

export class WallPortrait {
  readonly group = new Group();
  private readonly glass = new PortraitGlass();
  private readonly light: PictureLight;
  private readonly frame = createFrame();
  private readonly print: ReturnType<typeof createPrint>;
  private inspect: PortraitInspect | null = null;
  private bioCard: BioCard | null = null;

  constructor(environment: Texture | null, invalidate: () => void) {
    this.print = createPrint(invalidate);
    this.light = new PictureLight(environment);
    const picture = new Group();
    picture.position.copy(PORTRAIT.centre);
    this.print.mesh.position.z = PORTRAIT.depth / 2 - 0.007;
    picture.add(this.frame.group, this.print.mesh, this.glass.mesh);
    picture.traverse(node => (node.raycast = () => undefined));
    this.group.add(picture, this.light.group);
    this.group.name = 'desk-portrait';
  }

  attachInspect(inspect: PortraitInspect): void {
    this.inspect = inspect;
  }

  attachBioCard(card: BioCard): void {
    this.bioCard = card;
    this.group.add(card.group);
  }

  setHover(hovered: boolean): void {
    this.glass.setHover(hovered);
  }

  update(frame: DeskFrame): boolean {
    this.inspect?.update(frame);
    this.bioCard?.update();
    return this.glass.update(frame);
  }

  apply(level: LightLevels): void {
    this.glass.apply(level);
    this.light.apply(level);
  }

  dispose(): void {
    this.inspect?.dispose();
    this.print.dispose();
    this.bioCard?.dispose();
    this.frame.dispose();
    this.glass.dispose();
    this.light.dispose();
  }
}
