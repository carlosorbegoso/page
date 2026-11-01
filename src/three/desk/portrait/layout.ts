import { Vector3 } from 'three';
import { ROOM } from '../layout';

export const PORTRAIT_PHOTO = `${import.meta.env.BASE_URL.replace(/\/?$/, '/')}images/profile.jpeg`;

const FRAME_DEPTH = 0.022;

export const PORTRAIT = {
  centre: new Vector3(-0.645, 1.16, ROOM.back + FRAME_DEPTH / 2 + 0.004),
  width: 0.27,
  height: 0.34,
  depth: FRAME_DEPTH,
  moulding: 0.017,
  photo: { width: 0.16, height: 0.2 }
} as const;

export const PORTRAIT_GLASS_Z = PORTRAIT.centre.z + PORTRAIT.depth / 2 - 0.004;

export const PICTURE_LIGHT = {
  plate: new Vector3(PORTRAIT.centre.x, PORTRAIT.centre.y + PORTRAIT.height / 2 + 0.05, ROOM.back + 0.004),
  hood: new Vector3(PORTRAIT.centre.x, PORTRAIT.centre.y + PORTRAIT.height / 2 + 0.07, ROOM.back + 0.11),
  hoodLength: 0.17,
  hoodRadius: 0.014
} as const;
