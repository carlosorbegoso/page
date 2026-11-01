import type { StationContext } from '../../contracts';
import { PRODUCT_FIGURES } from '../layout';
import type { DeskLife, LifeToy } from '../life';
import { readProduct } from '../notes/content';
import type { ProductId } from '../notes/layout';
import type { RoomLife } from '../room-life';
import type { DeskLevels } from './levels';
import type { DeskScreens } from './screens';

const LIFE_TOYS: readonly string[] = ['alfa', 'skymek', 'parati', 'ventixs', 'mug'];

export interface DeskActionHost {
  clock(): number;
  context(): StationContext | undefined;
  life(): DeskLife | null;
  roomLife(): RoomLife | null;
  screens(): DeskScreens;
  levels: DeskLevels;
  folderAction(action: 'folder' | 'folder-close', id?: string): void;
}

function visit(host: DeskActionHost, id: string | undefined): void {
  const product = id?.replace(/^visit-/, '') as ProductId | undefined;
  if (!product || !PRODUCT_FIGURES.includes(product) || !host.life()?.cardRaised(product)) return;
  window.open(readProduct(product).url, '_blank', 'noopener,noreferrer');
}

export function createActionListener(host: DeskActionHost): (event: Event) => void {
  return event => {
    const detail = (event as CustomEvent<{ action?: string; id?: string }>).detail;
    const context = host.context();
    if (detail?.action === 'play' && detail.id && LIFE_TOYS.includes(detail.id)) {
      host.life()?.play(detail.id as LifeToy, host.clock(), Boolean(context?.motion()) && !context?.capture);
      context?.invalidate();
      return;
    }
    if (detail?.action === 'battle') {
      host.life()?.battle(host.clock(), Boolean(context?.motion()) && !context?.capture);
      context?.invalidate();
      return;
    }
    if (detail?.action === 'folder' || detail?.action === 'folder-close') {
      host.folderAction(detail.action, detail.id);
      return;
    }
    if (detail?.action === 'time') {
      host.levels.followMode(host.clock());
      context?.invalidate();
      return;
    }
    if (detail?.action === 'visit') return visit(host, detail.id);
    if (detail?.action === 'laptop') {
      host.screens().toggleLaptop(host.clock());
      return;
    }
    if (host.roomLife()?.action(detail?.action, host.clock())) {
      context?.invalidate();
      return;
    }
    if (detail?.action !== 'lamp') return;
    const on = host.levels.toggleLamp(host.clock());
    window.dispatchEvent(new CustomEvent('desk:switch', { detail: { on } }));
    context?.invalidate();
  };
}
