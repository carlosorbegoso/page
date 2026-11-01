import { BOARD_LAYOUT, type FaceRect } from '../layout';

export interface PinSpot {
  x: number;
  y: number;
  color: string;
}

const PIN_INSET = 0.007;

function topCentre(rect: FaceRect): { x: number; y: number } {
  const rotation = rect.rotation ?? 0;
  const reach = rect.height / 2 - PIN_INSET;
  return {
    x: rect.x + rect.width / 2 - Math.sin(rotation) * reach,
    y: rect.y + rect.height / 2 + Math.cos(rotation) * reach
  };
}

/** Push pins holding the note, the Alfa card and each post-it, in board-face metres. */
export function pinSpots(): PinSpot[] {
  const { note, alfa, postits } = BOARD_LAYOUT;
  return [
    { ...topCentre(note), color: '#c8423b' },
    { ...topCentre(alfa), color: '#3a6fc4' },
    { ...topCentre(postits.skymek), color: '#e9e4d8' },
    { ...topCentre(postits.parati), color: '#e2b23a' },
    { ...topCentre(postits.ventixs), color: '#c8423b' }
  ];
}
