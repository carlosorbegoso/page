import { FOLDER, SHELF, type FolderId } from '../layout';

export const FOLDER_PARK = -(FOLDER.depth + 0.04);

export const DURATION = 0.6;
export const SLIDE_END = 0.55;
export const TURN_START = 0.4;
export const CLEAR_X = SHELF.x + SHELF.depth + FOLDER.depth / 2 + 0.012;

export const SHEET = { width: FOLDER.depth * 0.84, height: FOLDER.height * 0.86 } as const;
export const OPEN_SHEET = { width: SHEET.width * 0.78, height: SHEET.height * 0.78 } as const;
export const SHEET_LEVEL = 0.42;

export type ShelfFolder = Exclude<FolderId, 'tcs'>;
