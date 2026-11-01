import { BoxGeometry, Color, InstancedMesh, Matrix4, Quaternion, Vector3, type Material } from 'three';
import { PartBuilder } from '../builder';
import { laptopKeyboardMatrix, laptopKeys, LAPTOP_KEYBOARD, type LaptopKey } from '../props';

const TRAVEL = 0.00085;
const DOWN_SECONDS = 0.035;
const HOLD_SECONDS = 0.06;
const UP_SECONDS = 0.16;
const PRESS_SECONDS = DOWN_SECONDS + HOLD_SECONDS + UP_SECONDS;
const FALLBACK_CODES = 'KeyFKeyJKeyDKeyKKeySKeyLKeyAKeyGKeyH'.match(/Key./g)!;

/**
 * The laptop keycaps as one instanced mesh, so a single key can sink when the matching key is
 * pressed on the real keyboard (`press`). Unknown codes press a home-row key picked from the code,
 * so every key the visitor types still moves something.
 */
export class LaptopKeycaps {
  readonly mesh: InstancedMesh;
  private readonly keys: LaptopKey[];
  private readonly index = new Map<string, number>();
  private readonly pressedAt: Float32Array;
  private readonly frame = laptopKeyboardMatrix();
  private readonly matrix = new Matrix4();
  private readonly position = new Vector3();
  private readonly scale = new Vector3();
  private readonly turn = new Quaternion();
  private active = 0;

  constructor(material: Material, shadows: boolean) {
    this.keys = laptopKeys();
    this.keys.forEach((key, i) => this.index.set(key.code, i));
    this.pressedAt = new Float32Array(this.keys.length).fill(-10);
    const builder = new PartBuilder();
    builder.add(new BoxGeometry(1, LAPTOP_KEYBOARD.capHeight, 1), { color: new Color('#0a0b0d'), roughness: 0.92, metalness: 0 });
    this.mesh = new InstancedMesh(builder.build(), material, this.keys.length);
    this.mesh.name = 'desk-laptop-keys';
    this.mesh.castShadow = shadows;
    this.mesh.receiveShadow = shadows;
    this.mesh.raycast = () => undefined;
    for (let i = 0; i < this.keys.length; i++) this.place(i, 0);
    this.mesh.computeBoundingSphere();
  }

  /** Sinks the key for a `KeyboardEvent.code`; returns false when nothing was pressed. */
  press(code: string, time: number): boolean {
    const i = this.index.get(code) ?? this.index.get(fallbackCode(code));
    if (i === undefined) return false;
    this.pressedAt[i] = time;
    return true;
  }

  /** Moves the pressed keys; returns true while one is still travelling. */
  update(time: number): boolean {
    let moving = 0;
    for (let i = 0; i < this.keys.length; i++) {
      const since = time - this.pressedAt[i]!;
      if (since < 0 || since > PRESS_SECONDS + 0.05) continue;
      this.place(i, since > PRESS_SECONDS ? 0 : depth(since));
      moving++;
    }
    if (moving > 0 || this.active > 0) this.mesh.instanceMatrix.needsUpdate = true;
    this.active = moving;
    return moving > 0;
  }

  private place(i: number, sink: number): void {
    const key = this.keys[i]!;
    this.position.set(key.x, -sink, key.z);
    this.scale.set(key.width, 1, key.depth);
    this.matrix.compose(this.position, this.turn.identity(), this.scale).premultiply(this.frame);
    this.mesh.setMatrixAt(i, this.matrix);
  }

  dispose(): void {
    this.mesh.geometry.dispose();
    this.mesh.dispose();
  }
}

function depth(since: number): number {
  if (since < DOWN_SECONDS) return TRAVEL * (since / DOWN_SECONDS);
  if (since < DOWN_SECONDS + HOLD_SECONDS) return TRAVEL;
  const t = (since - DOWN_SECONDS - HOLD_SECONDS) / UP_SECONDS;
  return TRAVEL * (1 - t) * (1 - t);
}

function fallbackCode(code: string): string {
  let hash = 0;
  for (let i = 0; i < code.length; i++) hash = (hash * 31 + code.charCodeAt(i)) | 0;
  return FALLBACK_CODES[Math.abs(hash) % FALLBACK_CODES.length]!;
}
