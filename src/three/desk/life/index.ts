import { Group, Matrix4, Vector3, type BufferGeometry, type Camera, type Material, type Mesh, type Object3D } from 'three';
import { FIGURE_HEIGHT, FIGURES, MUG, type FigureId } from '../layout';
import type { AtlasUniforms } from '../materials';
import { OBJECT_ID } from '../builder';
import { ProductCards, productFocus } from '../notes/cards';
import type { ProductId } from '../notes/layout';
import type { Palette } from '../props';
import { AlfaLife } from './alfa';
import type { StoryBeats } from './beats';
import { BubbleLife, splitDots } from './bubble';
import { figureParts, mugPart } from './classify';
import { GiftLife } from './gift';
import { MugLife } from './mug';
import type { PokemonLife } from './pokemon';
import { pokemonPart } from './pokemon/parts';
import { STILL, type FigureOffset } from './motion';
import { PressPulse } from './press';
import { figureFrame, splitFigures, splitPart, type RigPart } from './rig';
import { WrenchLife } from './wrench';

export type LifeToy = FigureId | 'mug';

const SLOT: Record<FigureId, number> = { alfa: OBJECT_ID.alfa - 1, ventixs: OBJECT_ID.ventixs - 1, parati: OBJECT_ID.parati - 1, skymek: OBJECT_ID.skymek - 1 };
const HOVER_LIFT = 0.003;
const TOY_SECONDS: Record<LifeToy, number> = { alfa: 1.6, parati: 2, ventixs: 1.2, skymek: 1.3, mug: 1.2 };

export interface DeskLifeOptions {
  geometry: BufferGeometry;
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
  focused: FigureId | null;
  shot: string;
}

export class DeskLife {
  readonly object3D = new Group();
  readonly press = new PressPulse();
  private readonly alfa: AlfaLife | null;
  private readonly gift: GiftLife;
  private readonly bubble: BubbleLife;
  private readonly wrench: WrenchLife;
  private readonly mug: MugLife;
  private pokemon: PokemonLife | null = null;
  private readonly pokemonParts: ReadonlyMap<string, RigPart>;
  private battleQueued = false;
  private readonly cards = new ProductCards();
  private readonly frames = new Map<FigureId, Matrix4>((Object.keys(SLOT) as FigureId[]).map(id => [id, new Matrix4()]));
  private readonly disposables: Array<{ dispose(): void }> = [];
  private hovered: string | null = null;
  private readonly hoverLift = new Map<FigureId, number>();
  private readonly busyUntil = new Map<LifeToy, number>();
  private beats: StoryBeats | null = null;
  private focused: FigureId | null = null;
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
    this.bubble = new BubbleLife(dotParts);
    this.wrench = new WrenchLife(parts.get('wrench'));
    this.mug = new MugLife(workstation.parts.get('mug'), MUG);
    this.pokemonParts = workstation.parts;
    this.object3D.add(this.gift.sparks.points);
    this.disposables.push(this.gift);
    this.object3D.add(this.cards.object3D);
    this.disposables.push(this.cards);
  }

  attachBeats(beats: StoryBeats): void {
    this.beats = beats;
    this.object3D.add(beats.object3D);
  }

  play(toy: LifeToy, time: number, motion: boolean): void {
    if (time < (this.busyUntil.get(toy) ?? -1)) return;
    const told = toy === 'mug' ? 0 : (this.beats?.play(toy, time, motion, this.anchor(toy), this.focused) ?? 0);
    this.busyUntil.set(toy, time + Math.max(TOY_SECONDS[toy], told));
    this.animate(toy, time, motion);
  }

  private anchor(id: FigureId): Vector3 {
    return FIGURES[id].clone().setY(FIGURES[id].y + FIGURE_HEIGHT[id]);
  }

  private animate(toy: LifeToy, time: number, motion: boolean): void {
    if (toy === 'alfa') this.alfa?.play(time, motion);
    else if (toy === 'parati') this.gift.play(time, motion);
    else if (toy === 'ventixs') this.bubble.play(time, motion);
    else if (toy === 'skymek') this.wrench.play(time, motion);
    else this.mug.play(time, motion);
  }

  attachPokemon(create: (parts: ReadonlyMap<string, RigPart>) => PokemonLife): void {
    const pokemon = (this.pokemon = create(this.pokemonParts));
    this.object3D.add(pokemon.overlays);
    this.disposables.push(pokemon);
    if (this.battleQueued) pokemon.battle();
    this.battleQueued = false;
  }

  battle(): void {
    if (this.pokemon) this.pokemon.battle();
    else this.battleQueued = true;
  }

  setHover(id: string | null): void {
    this.hovered = id;
    this.mug.setHover(id === 'mug');
  }

  update(dt: number, time: number, frame: LifeFrame): boolean {
    this.time = time;
    const { motion } = frame;
    this.focused = frame.focused;
    const lifting = this.updateHoverLift(dt, motion);
    const beats = this.beats?.update(time, frame.shot, frame.focused) ?? false;
    const alfa = this.alfa?.update(dt, time, motion, frame.look ? { ...frame.look, frame: this.frames.get('alfa')! } : null) ?? false;
    const gift = this.gift.update(time, frame.pixelScale, this.frames.get('parati')!);
    const bubble = this.bubble.update(time);
    const wrench = this.wrench.update(time);
    const mug = this.mug.update(dt, time, motion);
    const pokemon = this.pokemon?.update(time, motion, frame.pixelScale) ?? false;
    const press = this.press.update(time);
    const cards = this.cards.update(dt, productFocus(frame.focused), motion);
    return alfa || gift || bubble || wrench || mug || pokemon || press || cards || lifting || beats;
  }

  private updateHoverLift(dt: number, motion: boolean): boolean {
    let moving = false;
    for (const id of Object.keys(SLOT) as FigureId[]) {
      const goal = this.hovered === id && motion ? HOVER_LIFT : 0;
      const lift = this.hoverLift.get(id) ?? 0;
      const next = Math.abs(goal - lift) < 1e-5 ? goal : lift + (goal - lift) * (1 - Math.exp(-14 * dt));
      this.hoverLift.set(id, next);
      moving ||= next !== goal;
    }
    return moving;
  }

  offset(id: FigureId): FigureOffset {
    const play = this.playOffset(id);
    return { lift: play.lift + (this.hoverLift.get(id) ?? 0), yaw: play.yaw };
  }

  private playOffset(id: FigureId): FigureOffset {
    if (id === 'alfa') return this.alfa?.offset(this.time) ?? STILL;
    if (id === 'parati') return this.gift.offset(this.time);
    if (id === 'ventixs') return this.bubble.offset(this.time);
    return STILL;
  }

  glow(id: string): number {
    return id in SLOT || id === 'mug' ? 0 : this.press.glow(id, this.time);
  }

  cardTargets(): ReadonlyMap<ProductId, Object3D> {
    return this.cards.targets();
  }

  cardRaised(id: ProductId): boolean {
    return this.cards.isRaised(id);
  }

  signalGain(): number {
    return this.alfa?.signalGain(this.time) ?? 1;
  }

  steamGain(): number {
    return this.mug.steamGain(this.time);
  }

  pose(uniforms: AtlasUniforms): void {
    for (const [id, frame] of this.frames) figureFrame(uniforms, SLOT[id], frame);
    this.alfa?.pose(this.time, this.frames.get('alfa')!);
    this.gift.pose(this.time, this.frames.get('parati')!);
    this.bubble.pose(this.time, this.frames.get('ventixs')!);
    this.wrench.pose(this.time, this.frames.get('skymek')!);
    this.mug.pose(this.time);
    this.pokemon?.pose(this.time);
    this.cards.pose();
  }

  poseKey(): string {
    return `${this.alfa?.poseKey() ?? ''}|${this.gift.poseKey(this.time)}|${this.bubble.poseKey(this.time)}|${this.wrench.poseKey(this.time)}|${this.mug.poseKey()}|${this.pokemon?.poseKey() ?? ''}|${this.cards.poseKey()}`;
  }

  dispose(): void {
    this.object3D.traverse(node => (node as Partial<Mesh>).geometry?.dispose());
    for (const item of this.disposables) item.dispose();
  }
}
