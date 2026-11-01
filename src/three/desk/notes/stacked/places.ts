import { Vector3 } from 'three';
import { DESK, FIGURES } from '../../layout';
import type { CardStage, ProductId } from '../layout';

const inFrontOf = (id: ProductId, z: number) => ({ hinge: new Vector3(FIGURES[id].x, DESK.top, z), yaw: 0 });

export const STACKED_CARDS: CardStage = {
  places: {
    skymek: inFrontOf('skymek', 0.1),
    ventixs: inFrontOf('ventixs', 0.12),
    parati: inFrontOf('parati', 0.1)
  },
  lean: 0.52
};
