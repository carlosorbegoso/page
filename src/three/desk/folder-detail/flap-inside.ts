import { CanvasTexture, Color, Mesh, MeshBasicMaterial, PlaneGeometry, SRGBColorSpace } from 'three';
import { FOLDER, folderCentre } from '../layout';
import type { Palette } from '../props';
import { SPINE_TEXT } from '../spines';
import { sheetFonts } from './sheet-canvas';
import { FOLDER_PARK, SHEET_LEVEL, type ShelfFolder } from './constants';
import { readExperience } from './sheet-content';
import { wrap } from './wrap';

const WIDTH = 512;
const HEIGHT = Math.round((WIDTH * FOLDER.height) / FOLDER.depth);
const POCKET_TOP = 0.62;
const LABEL = '#e4ddcc';
const INK = '#1c2230';
const INSET = 0.0004;

function boardColour(palette: Palette, id: ShelfFolder, shade: number): string {
  return `#${palette.folders[id].color.clone().multiplyScalar(shade).getHexString()}`;
}

function drawPocket(context: CanvasRenderingContext2D, palette: Palette, id: ShelfFolder): void {
  const top = HEIGHT * POCKET_TOP;
  context.fillStyle = boardColour(palette, id, 0.9);
  context.beginPath();
  context.moveTo(0, top + 40);
  context.lineTo(WIDTH * 0.72, top);
  context.lineTo(WIDTH, top + 18);
  context.lineTo(WIDTH, HEIGHT);
  context.lineTo(0, HEIGHT);
  context.closePath();
  context.fill();
  context.strokeStyle = 'rgba(0, 0, 0, 0.45)';
  context.lineWidth = 4;
  context.beginPath();
  context.moveTo(0, top + 40);
  context.lineTo(WIDTH * 0.72, top);
  context.lineTo(WIDTH, top + 18);
  context.stroke();
}

function drawIndexLabel(context: CanvasRenderingContext2D, id: ShelfFolder): void {
  const fonts = sheetFonts();
  const [name, years] = SPINE_TEXT[id];
  const x = 56;
  const y = 64;
  context.fillStyle = LABEL;
  context.fillRect(x, y, WIDTH - x * 2, 150);
  context.fillStyle = INK;
  context.font = `500 22px ${fonts.mono}`;
  context.fillText('ARCHIVO · EXPERIENCIA', x + 24, y + 42);
  context.fillRect(x + 24, y + 58, WIDTH - x * 2 - 48, 2);
  context.font = `600 46px ${fonts.display}`;
  context.fillText(name, x + 24, y + 112, WIDTH - x * 2 - 48);
  context.font = `500 22px ${fonts.mono}`;
  context.fillText(years, x + 24, y + 138);
}

function drawStackLabel(context: CanvasRenderingContext2D, id: ShelfFolder): void {
  const { stackTitle, stack } = readExperience(id);
  if (!stack.length) return;
  const fonts = sheetFonts();
  const x = 56;
  const width = WIDTH - x * 2 - 48;
  context.font = `500 21px ${fonts.mono}`;
  const lines = wrap(context, stack.join(' · '), width).slice(0, 3);
  const top = 244;
  context.fillStyle = LABEL;
  context.fillRect(x, top, WIDTH - x * 2, 58 + lines.length * 30);
  context.fillStyle = INK;
  context.font = `600 18px ${fonts.mono}`;
  context.fillText(stackTitle.toUpperCase(), x + 24, top + 34);
  context.font = `500 21px ${fonts.mono}`;
  lines.forEach((line, index) => context.fillText(line, x + 24, top + 66 + index * 30));
}

function drawInside(canvas: HTMLCanvasElement, palette: Palette, id: ShelfFolder): void {
  const context = canvas.getContext('2d')!;
  context.textBaseline = 'alphabetic';
  context.textAlign = 'left';
  context.fillStyle = boardColour(palette, id, 0.62);
  context.fillRect(0, 0, WIDTH, HEIGHT);
  drawPocket(context, palette, id);
  drawIndexLabel(context, id);
  drawStackLabel(context, id);
}

export function createFlapInside(id: ShelfFolder, palette: Palette): Mesh<PlaneGeometry, MeshBasicMaterial> {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  drawInside(canvas, palette, id);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  void document.fonts?.ready.then(() => {
    drawInside(canvas, palette, id);
    texture.needsUpdate = true;
  });
  const level = SHEET_LEVEL * 1.6;
  const material = new MeshBasicMaterial({ map: texture, color: new Color(level, level, level) });
  const inside = new Mesh(new PlaneGeometry(FOLDER.depth * 0.98, FOLDER.height * 0.98), material);
  const centre = folderCentre(id);
  inside.name = `desk-folder-flap-inside-${id}`;
  inside.position.set(centre.x + FOLDER_PARK, centre.y, centre.z + FOLDER.spine / 2 - INSET);
  inside.rotation.y = Math.PI;
  inside.raycast = () => undefined;
  return inside;
}
