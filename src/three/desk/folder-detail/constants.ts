import { FOLDER, SHELF, type FolderId } from '../layout';

/**
 * Pull that parks a shelf box behind the left wall while its twin is in the visitor's hands: the
 * box is baked into the room atlas, which can only slide objects along +X, never turn them.
 */
export const FOLDER_PARK = -(FOLDER.depth + 0.04);

export const DURATION = 0.6;
export const SLIDE_END = 0.55;
export const TURN_START = 0.4;
/** Lowest centre X at which a turned box clears the stack still on the shelf. */
export const CLEAR_X = SHELF.x + SHELF.depth + FOLDER.depth / 2 + 0.012;
export const LIFT = 0.03;
/** Share of the shot distance the box is brought towards the camera. */
export const NEARER = 0.88;
export const MAX_FORWARD = 0.36;
export const FACE_TURN = 0.92;
export const HOLD_LEAN = 0.06;

export const SHEET = { width: FOLDER.depth * 0.84, height: FOLDER.height * 0.86 } as const;
export const OPEN_SHEET = { width: SHEET.width * 0.78, height: SHEET.height * 0.78 } as const;
export const OPEN_SHEET_LIFT = 0.012;
export const OPEN_SHEET_FORWARD = 0.02;
/** Unlit like the archive cover: a lit sheet on a shelf face reads as a dark hole at night. */
export const SHEET_LEVEL = 0.42;

export type ShelfFolder = Exclude<FolderId, 'tcs'>;
