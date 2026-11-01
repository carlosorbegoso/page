import { BoxGeometry, Mesh, Quaternion, Vector3, type Group, type Object3D } from 'three';
import type { StationPick } from '../../contracts';
import { tokenColor } from '../../tokens';
import { OBJECT_ID } from '../builder';
import { CLOCK_POSITION } from '../clock';
import { LAMP_SWITCH } from '../lamp';
import { FIGURE_HEIGHT, FIGURES, FOLDERS, GLASS_Z, LAMP, LAPTOP, MUG, OPEN_FOLDER, PLANT, PRODUCT_FIGURES, WINDOW, folderCentre, type FigureId } from '../layout';
import { createPickMaterial, type AtlasUniforms } from '../materials';
import { damp } from '../math';
import { EXPERIENCE_ORDER, type SurfaceFrame } from '../shots';
import { EXPERIENCE_IDS } from './story';

const LABELS: Record<string, { es: string; en: string }> = {
  alfa: { es: 'Alfa · TUSOCIO IA', en: 'Alfa · TUSOCIO IA' },
  skymek: { es: 'SkyMek', en: 'SkyMek' },
  parati: { es: 'Parati', en: 'Parati' },
  ventixs: { es: 'Ventixs', en: 'Ventixs' },
  tcs: { es: 'TCS · Experiencia', en: 'TCS · Experience' },
  intercorp: { es: 'Intercorp · Experiencia', en: 'Intercorp · Experience' },
  baufest: { es: 'Baufest · Experiencia', en: 'Baufest · Experience' },
  sysarp: { es: 'SYSARP · Experiencia', en: 'SYSARP · Experience' },
  phone: { es: 'Teléfono · Contacto', en: 'Phone · Contact' },
  lamp: { es: 'Lámpara', en: 'Lamp' },
  window: { es: 'Ventana', en: 'Window' },
  plant: { es: 'Planta', en: 'Plant' },
  mug: { es: 'Taza de café', en: 'Coffee mug' },
  laptop: { es: 'Laptop', en: 'Laptop' },
  clock: { es: 'Reloj · clic para que suene', en: 'Clock · click to ring it' }
};

const HOVER_ACCENT: Partial<Record<keyof typeof OBJECT_ID, string>> = {
  alfa: '--color-alfa-signal',
  ventixs: '--color-burbu-signal',
  parati: '--color-gift-ribbon',
  skymek: '--color-tool-band',
  phone: '--color-accent'
};

/** Invisible click proxies for the navigable props, and the hover highlight they drive. */
export class DeskPicks {
  readonly picks: StationPick[] = [];
  readonly proxies = new Map<string, Mesh>();
  hoverId = -1;
  private hoverMix = 0;

  build(room: Group, phone: SurfaceFrame, disposables: Array<{ dispose(): void }>): void {
    const material = createPickMaterial();
    disposables.push(material);
    const proxy = (key: string, size: [number, number, number], position: Vector3, quaternion?: Quaternion) => {
      const geometry = new BoxGeometry(...size);
      const mesh = new Mesh(geometry, material);
      mesh.name = `desk-pick-${key}`;
      mesh.position.copy(position);
      if (quaternion) mesh.quaternion.copy(quaternion);
      room.add(mesh);
      this.proxies.set(key, mesh);
      disposables.push(geometry);
      return mesh;
    };
    const figure = (id: FigureId, size: [number, number, number]) =>
      proxy(id, size, FIGURES[id].clone().add(new Vector3(0, FIGURE_HEIGHT[id] / 2, 0)));
    this.picks.push({ object3D: figure('alfa', [0.08, 0.13, 0.07]), key: 'desk:alfa', label: LABELS.alfa!, target: '#company' });
    for (const id of PRODUCT_FIGURES) {
      this.picks.push({ object3D: figure(id, [0.08, 0.08, 0.07]), key: `desk:${id}`, label: LABELS[id]!, target: '#products', product: id });
    }
    for (const id of FOLDERS) {
      this.picks.push({
        object3D: proxy(id, [0.29, 0.33, 0.085], folderCentre(id)),
        key: `desk:${id}`,
        label: LABELS[id]!,
        target: '#experience',
        experience: EXPERIENCE_IDS[id],
        sub: EXPERIENCE_ORDER.indexOf(id) + 1
      });
    }
    const openFolderTurn = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), OPEN_FOLDER.yaw);
    this.picks.push({
      object3D: proxy('openFolder', [OPEN_FOLDER.width, 0.03, OPEN_FOLDER.depth], OPEN_FOLDER.centre.clone().add(new Vector3(0, 0.015, 0)), openFolderTurn),
      key: 'desk:openFolder',
      label: LABELS.tcs!,
      target: '#experience',
      experience: EXPERIENCE_IDS.tcs,
      sub: EXPERIENCE_ORDER.indexOf('tcs') + 1
    });
    const lampHead = LAMP.head.clone().addScaledVector(LAMP.aim.clone().sub(LAMP.head).normalize(), 0.06);
    this.picks.push({ object3D: proxy('lamp', [0.16, 0.12, 0.16], lampHead), key: 'desk:lamp', label: LABELS.lamp!, target: '#company', action: 'lamp' });
    this.picks.push({ object3D: proxy('lampSwitch', [0.045, 0.03, 0.045], LAMP_SWITCH), key: 'desk:lamp', label: LABELS.lamp!, target: '#company', action: 'lamp' });
    this.addRoomToys(proxy);
    this.picks.push({ object3D: proxy('phone', [0.08, 0.16, 0.03], phone.centre, phone.quaternion), key: 'desk:phone', label: LABELS.phone!, target: '#contact' });
    this.addLaptop(proxy);
    this.picks.push({ object3D: proxy('mug', [0.1, 0.1, 0.09], MUG.clone().add(new Vector3(0.01, 0.05, 0))), key: 'desk:mug', label: LABELS.mug!, target: '#contact' });
    this.picks.push({ object3D: proxy('clock', [0.12, 0.14, 0.08], CLOCK_POSITION.clone().add(new Vector3(0, 0.07, 0))), key: 'desk:clock', label: LABELS.clock!, target: '#hero' });
  }

  /** The window (its panes clear of the monitor) lowers the blind; the plant rustles. Neither moves the camera. */
  private addRoomToys(proxy: (key: string, size: [number, number, number], position: Vector3) => Mesh): void {
    const left = WINDOW.x - WINDOW.width / 2;
    const right = WINDOW.x + WINDOW.width / 2;
    const top = WINDOW.y + WINDOW.height / 2;
    const clear = 0.3;
    const z = GLASS_Z + 0.06;
    const pane = proxy('window', [right - clear, WINDOW.height, 0.02], new Vector3((clear + right) / 2, WINDOW.y, z));
    const lintel = proxy('windowTop', [clear - left, 0.3, 0.02], new Vector3((left + clear) / 2, top - 0.15, z));
    for (const object3D of [pane, lintel]) this.picks.push({ object3D, key: 'desk:window', label: LABELS.window!, target: '#hero', action: 'blind' });
    const plant = proxy('plant', [0.24, 0.3, 0.2], PLANT.clone().add(new Vector3(0, 0.2, 0)));
    this.picks.push({ object3D: plant, key: 'desk:plant', label: LABELS.plant!, target: '#hero', action: 'plant' });
  }

  /** The MacBook: a click shuts or opens its lid; it never moves the camera. */
  private addLaptop(proxy: (key: string, size: [number, number, number], position: Vector3, quaternion?: Quaternion) => Mesh): void {
    const turn = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), LAPTOP.yaw);
    const centre = LAPTOP.centre.clone().add(new Vector3(0, 0.07, -0.02).applyQuaternion(turn));
    this.picks.push({ object3D: proxy('laptop', [LAPTOP.width, 0.15, LAPTOP.depth + 0.04], centre, turn), key: 'desk:laptop', label: LABELS.laptop!, target: '#hero', action: 'laptop' });
  }

  /** Finds the pick an object belongs to (walking up the parents). */
  resolve(object: Object3D): StationPick | null {
    let node: Object3D | null = object;
    while (node) {
      const pick = this.picks.find(item => item.object3D === node);
      if (pick) return pick;
      node = node.parent;
    }
    return null;
  }

  /** Points the highlight at a pick (or clears it); returns the hovered object's name and whether the id changed. */
  hover(object: Object3D | null, uniforms: AtlasUniforms): { name: keyof typeof OBJECT_ID | undefined; changed: boolean } {
    const pick = object ? this.resolve(object) : null;
    const name = pick?.key.slice(5) as keyof typeof OBJECT_ID | undefined;
    const id = name && name in OBJECT_ID ? OBJECT_ID[name] : -1;
    if (id === this.hoverId) return { name, changed: false };
    this.hoverId = id;
    if (pick && name) {
      uniforms.uHoverId.value = id;
      uniforms.uHoverColor.value.copy(tokenColor(HOVER_ACCENT[name] ?? '--color-desk-paper'));
    }
    return { name, changed: true };
  }

  update(step: number): boolean {
    const hoverGoal = this.hoverId > 0 ? 1 : 0;
    this.hoverMix = damp(this.hoverMix, hoverGoal, 10, step);
    return Math.abs(hoverGoal - this.hoverMix) > 0.01;
  }

  apply(uniforms: AtlasUniforms): void {
    uniforms.uHoverMix.value = this.hoverMix;
  }
}
