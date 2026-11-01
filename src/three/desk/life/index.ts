import { Group, Matrix4, Vector3, type BufferGeometry, type Camera, type Material, type Mesh, type Object3D } from 'three';
import { FIGURES, MUG, type FigureId } from '../layout';
import type { AtlasUniforms } from '../materials';
import { OBJECT_ID } from '../builder';
import { ProductCards, productFocus } from '../notes/cards';
import type { ProductId } from '../notes/layout';
import type { Palette } from '../props';
import { AlfaLife } from './alfa';
import { BubbleLife, splitDots } from './bubble';
import { figureParts, mugPart } from './classify';
import { GiftLife } from './gift';
import { MugLife } from './mug';
import { PokemonLife, pokemonPart } from './pokemon';
import { STILL, type FigureOffset } from './motion';
import { PressPulse } from './press';
import { figureFrame, splitFigures, splitPart } from './rig';
import { WrenchLife } from './wrench';

export type LifeToy = FigureId | 'mug';

const SLOT: Record<FigureId, number> = { alfa: OBJECT_ID.alfa - 1, ventixs: OBJECT_ID.ventixs - 1, parati: OBJECT_ID.parati - 1, skymek: OBJECT_ID.skymek - 1 };
/** Hover lift of Alfa (the products lift theirs in DeskSet): a few millimetres, eased in ~180 ms. */
const HOVER_LIFT = 0.003;

export interface DeskLifeOptions {
  /** The figures and their plinth, built on their own. */
  geometry: BufferGeometry;
  /** The workstation (keyboard, mug…), built on its own so the mug can turn. */
  workstation: BufferGeometry;
  material: Material;
  depthMaterial?: Material;
  shadows: boolean;
  palette: Palette;
}

export interface LifeLook {
  ndc: { x: number; y: number };
  camera: Camera;
}

export interface LifeFrame {
  motion: boolean;
  look: LifeLook | null;
  pixelScale: number;
  /** The product whose sub-shot is on screen, if any. */
  focused: FigureId | null;
}

/**
 * The desk objects come alive: the figures geometry is split into its moving parts (Alfa's head,
 * eyes and antenna, Parati's lid, Ventixs's typing dots, SkyMek's wrench) and the mug out of the
 * workstation; each runs its idle life, its hover response and its click reaction. Call `update`
 * before the levels are applied and `pose` after.
 */
export class DeskLife {
  readonly object3D = new Group();
  readonly press = new PressPulse();
  private readonly alfa: AlfaLife | null;
  private readonly gift: GiftLife;
  private readonly bubble: BubbleLife;
  private readonly wrench: WrenchLife;
  private readonly mug: MugLife;
  private readonly pokemon: PokemonLife;
  private readonly cards = new ProductCards();
  private readonly frames = new Map<FigureId, Matrix4>((Object.keys(SLOT) as FigureId[]).map(id => [id, new Matrix4()]));
  private readonly disposables: Array<{ dispose(): void }> = [];
  private hovered: string | null = null;
  private alfaLift = 0;
  private time = 0;

  constructor(options: DeskLifeOptions) {
    const p = options.palette;
    const figures = splitFigures(options.geometry, figureParts(p), options);
    const workstation = splitFigures(options.workstation, info => mugPart(info) ?? pokemonPart(info), options);
    this.object3D.name = 'desk-life';
    this.object3D.add(figures.rest, workstation.rest);
    this.disposables.push(options.geometry, options.workstation);
    const parts = figures.parts;
    for (const [name, part] of [...parts, ...workstation.parts]) if (name !== 'bubbleDots') this.object3D.add(part.mesh);
    const head = parts.get('alfaHead');
    this.alfa = head
      ? new AlfaLife({ head, eyes: parts.get('alfaEyes'), antenna: parts.get('alfaAntenna'), neck: FIGURES.alfa.clone().add(new Vector3(0, 0.064, 0)), signal: p.alfaSignal.color })
      : null;
    if (this.alfa) {
      this.object3D.add(this.alfa.overlays);
      this.disposables.push(this.alfa);
    }
    this.gift = new GiftLife(parts.get('giftLid'), [p.giftRibbon.color, p.giftBody.color, p.alfaRing.color]);
    const dots = parts.get('bubbleDots');
    const dotParts = dots ? splitPart(dots, splitDots(dots), 3, options) : [];
    for (const dot of dotParts) this.object3D.add(dot.mesh);
    this.bubble = new BubbleLife(dotParts, p.burbuDots.color);
    this.wrench = new WrenchLife(parts.get('wrench'));
    this.mug = new MugLife(workstation.parts.get('mug'), MUG);
    this.pokemon = new PokemonLife(workstation.parts);
    this.object3D.add(this.pokemon.overlays);
    this.disposables.push(this.pokemon);
    this.object3D.add(this.gift.sparks.points, this.bubble.message);
    this.disposables.push(this.gift, this.bubble);
    this.object3D.add(this.cards.object3D);
    this.disposables.push(this.cards);
  }

  play(toy: LifeToy, time: number, motion: boolean): void {
    if (toy === 'alfa') this.alfa?.play(time, motion);
    else if (toy === 'parati') this.gift.play(time, motion);
    else if (toy === 'ventixs') this.bubble.play(time, motion);
    else if (toy === 'skymek') this.wrench.play(time, motion);
    else this.mug.play(time, motion);
  }

  /** Pikachu and Charizard fight (Pikachu only sparks when motion is reduced). */
  battle(time: number, motion: boolean): void {
    this.pokemon.battle(time, motion);
  }

  /** The pick under the pointer (its key without `desk:`), or null. */
  setHover(id: string | null): void {
    this.hovered = id;
    this.gift.setHover(id === 'parati');
    this.wrench.setHover(id === 'skymek');
    this.mug.setHover(id === 'mug');
  }

  /** Advances every object; returns true while one of them is moving. */
  update(dt: number, time: number, frame: LifeFrame): boolean {
    this.time = time;
    const { motion } = frame;
    const liftGoal = this.hovered === 'alfa' && motion ? HOVER_LIFT : 0;
    this.alfaLift += (liftGoal - this.alfaLift) * (1 - Math.exp(-14 * dt));
    this.bubble.setTyping(this.hovered === 'ventixs' || frame.focused === 'ventixs');
    const alfa = this.alfa?.update(dt, time, motion, frame.look ? { ...frame.look, frame: this.frames.get('alfa')! } : null) ?? false;
    const gift = this.gift.update(time, motion, frame.pixelScale, this.frames.get('parati')!);
    const bubble = this.bubble.update(dt, time, motion);
    const wrench = this.wrench.update(dt, time, motion);
    const mug = this.mug.update(dt, time, motion);
    const pokemon = this.pokemon.update(time, motion);
    const press = this.press.update(time);
    const cards = this.cards.update(dt, productFocus(frame.focused), motion);
    return alfa || gift || bubble || wrench || mug || pokemon || press || cards || Math.abs(liftGoal - this.alfaLift) > 1e-5;
  }

  offset(id: FigureId): FigureOffset {
    if (id === 'alfa') {
      const play = this.alfa?.offset(this.time) ?? STILL;
      return { lift: play.lift + this.alfaLift, yaw: play.yaw };
    }
    if (id === 'parati') return this.gift.offset(this.time);
    if (id === 'ventixs') return this.bubble.offset(this.time);
    return STILL;
  }

  /** Extra self-illumination of an object from its reaction or a press pulse. */
  glow(id: string): number {
    const own = id === 'parati' ? this.gift.glow(this.time) : id === 'ventixs' ? this.bubble.glow(this.time) : id === 'skymek' ? this.wrench.glow(this.time) : 0;
    return own + this.press.glow(id, this.time);
  }

  /** The invisible pick box over each product card's printed face. */
  cardTargets(): ReadonlyMap<ProductId, Object3D> {
    return this.cards.targets();
  }

  /** Whether a product card stands facing the camera (its link is clickable then). */
  cardRaised(id: ProductId): boolean {
    return this.cards.isRaised(id);
  }

  signalGain(): number {
    return this.alfa?.signalGain(this.time) ?? 1;
  }

  steamGain(): number {
    return this.mug.steamGain(this.time);
  }

  /** Writes the part matrices for the figure transforms the atlas shader applies this frame. */
  pose(uniforms: AtlasUniforms): void {
    for (const [id, frame] of this.frames) figureFrame(uniforms, SLOT[id], frame);
    this.alfa?.pose(this.time, this.frames.get('alfa')!);
    this.gift.pose(this.time, this.frames.get('parati')!);
    this.bubble.pose(this.time, this.frames.get('ventixs')!);
    this.wrench.pose(this.time, this.frames.get('skymek')!);
    this.mug.pose(this.time);
    this.pokemon.pose(this.time);
    this.cards.pose();
  }

  /** Changes whenever a part moves enough for the lamp shadow to need a new render. */
  poseKey(): string {
    return `${this.alfa?.poseKey() ?? ''}|${this.gift.poseKey(this.time)}|${this.wrench.poseKey(this.time)}|${this.mug.poseKey()}|${this.pokemon.poseKey()}|${this.cards.poseKey()}`;
  }

  dispose(): void {
    this.object3D.traverse(node => (node as Partial<Mesh>).geometry?.dispose());
    for (const item of this.disposables) item.dispose();
  }
}
