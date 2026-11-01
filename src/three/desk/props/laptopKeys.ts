const KEY_PITCH = 0.0178;
const KEY_GAP = 0.0024;
const KEY_UNITS = 14.5;
const FUNCTION_KEYS = ['Escape', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'Power'];
const letters = (row: string) => [...row].map(letter => `Key${letter}`);

const KEY_ROWS: readonly (readonly (readonly [number, string])[])[] = [
  FUNCTION_KEYS.map((code, index) => [index === 0 ? 1.5 : 1, code] as const),
  [
    [1, 'Backquote'],
    ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(digit => [1, `Digit${digit}`] as const),
    [1, 'Minus'],
    [1, 'Equal'],
    [1.5, 'Backspace']
  ],
  [[1.5, 'Tab'], ...letters('QWERTYUIOP').map(code => [1, code] as const), [1, 'BracketLeft'], [1, 'BracketRight'], [1, 'Backslash']],
  [[1.75, 'CapsLock'], ...letters('ASDFGHJKL').map(code => [1, code] as const), [1, 'Semicolon'], [1, 'Quote'], [1.75, 'Enter']],
  [[2.25, 'ShiftLeft'], ...letters('ZXCVBNM').map(code => [1, code] as const), [1, 'Comma'], [1, 'Period'], [1, 'Slash'], [2.25, 'ShiftRight']],
  [
    [1, 'Fn'],
    [1, 'ControlLeft'],
    [1, 'AltLeft'],
    [1.25, 'MetaLeft'],
    [5, 'Space'],
    [1.25, 'MetaRight'],
    [1, 'AltRight']
  ]
];

export interface LaptopKey {
  code: string;
  x: number;
  z: number;
  width: number;
  depth: number;
}

export const LAPTOP_KEYBOARD = { width: KEY_UNITS * KEY_PITCH, depth: 5.5 * KEY_PITCH, capHeight: 0.0012 } as const;

export function laptopKeys(): LaptopKey[] {
  const keys: LaptopKey[] = [];
  const add = (code: string, x: number, z: number, width: number, depth: number) => keys.push({ code, x, z, width: width - KEY_GAP, depth: depth - KEY_GAP });
  let rowZ = -LAPTOP_KEYBOARD.depth / 2;
  KEY_ROWS.forEach((row, index) => {
    const rowDepth = (index === 0 ? 0.5 : 1) * KEY_PITCH;
    const z = rowZ + rowDepth / 2;
    let x = -LAPTOP_KEYBOARD.width / 2;
    for (const [units, code] of row) {
      const width = units * KEY_PITCH;
      add(code, x + width / 2, z, width, rowDepth);
      x += width;
    }
    if (index === KEY_ROWS.length - 1) {
      const half = KEY_PITCH / 2;
      add('ArrowLeft', x + half, z + half / 2, KEY_PITCH, half);
      add('ArrowUp', x + KEY_PITCH + half, z - half / 2, KEY_PITCH, half);
      add('ArrowDown', x + KEY_PITCH + half, z + half / 2, KEY_PITCH, half);
      add('ArrowRight', x + 2 * KEY_PITCH + half, z + half / 2, KEY_PITCH, half);
    }
    rowZ += rowDepth;
  });
  return keys;
}
