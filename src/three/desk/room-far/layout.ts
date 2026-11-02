import { ROOM } from '../layout';

export const FRONT_FACE = ROOM.front;

export const DOOR = { x: -0.62, width: 0.84, height: 2.04, casing: 0.07, leaf: 0.04 } as const;

export const LIGHT_SWITCH = { x: DOOR.x + DOOR.width / 2 + DOOR.casing + 0.14, y: 1.1 } as const;

export const COAT_RAIL = { x: 0.78, y: 1.74, length: 0.62 } as const;

export const CABINET = { z: 2.25, length: 0.96, depth: 0.32, height: 0.8, board: 0.022 } as const;

export const POSTER = { z: 2.3, y: 1.55, width: 0.66, height: 0.88, depth: 0.025 } as const;

export const RUG = { x: -0.25, z: 1.75, width: 1.8, length: 1.3, height: 0.01 } as const;

export const CEILING_LIGHT = { x: (ROOM.left + ROOM.right) / 2, z: (ROOM.back + ROOM.front) / 2 + 0.2, radius: 0.2 } as const;

export const CORNICE = { size: 0.045 } as const;
