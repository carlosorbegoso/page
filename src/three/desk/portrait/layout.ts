import { Vector3 } from 'three';
import { ROOM } from '../layout';

/** Photo hung in the frame, cropped to 4:5 around its upper third: point this at another image to change the picture. */
export const PORTRAIT_PHOTO = `${import.meta.env.BASE_URL.replace(/\/?$/, '/')}images/profile.jpeg`;

const FRAME_DEPTH = 0.022;

/**
 * Carlos's framed photo on the back wall, left of the window and above the laptop: a 27 × 34 cm
 * matte black frame (4:5) with an off-white mat, hung low enough to peek out left of the monitor in
 * the hero and to sit beside it in the about shot.
 */
export const PORTRAIT = {
  centre: new Vector3(-0.645, 1.16, ROOM.back + FRAME_DEPTH / 2 + 0.004),
  width: 0.27,
  height: 0.34,
  depth: FRAME_DEPTH,
  /** Width of the moulding. */
  moulding: 0.017,
  /** Photo window cut in the mat (4:5). */
  photo: { width: 0.16, height: 0.2 }
} as const;

/** Front face of the glass (what the camera reads and the pick box covers). */
export const PORTRAIT_GLASS_Z = PORTRAIT.centre.z + PORTRAIT.depth / 2 - 0.004;

/** Brass picture light over the frame: wall plate, arm reaching out and the hood that lights the picture. */
export const PICTURE_LIGHT = {
  plate: new Vector3(PORTRAIT.centre.x, PORTRAIT.centre.y + PORTRAIT.height / 2 + 0.05, ROOM.back + 0.004),
  hood: new Vector3(PORTRAIT.centre.x, PORTRAIT.centre.y + PORTRAIT.height / 2 + 0.07, ROOM.back + 0.11),
  hoodLength: 0.17,
  hoodRadius: 0.014
} as const;
