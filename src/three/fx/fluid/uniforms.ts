import { DataTexture, RGBAFormat, Vector2, type IUniform, type Texture } from 'three';

/** Velocity is stored in UV units per second; this maps it to a UV displacement before clamping. */
export const FLUID_DISPLACEMENT_SCALE = 0.006;
/** Maximum displacement of desk materials (rain on the glass, cup steam, window glass), in CSS px. */
export const FLUID_MAX_PX = 6;

/** Neutral 1×1 velocity bound while the field sleeps or is disabled. */
export const FLUID_IDLE_TEXTURE = new DataTexture(new Uint8Array(4), 1, 1, RGBAFormat);
FLUID_IDLE_TEXTURE.needsUpdate = true;

/**
 * Shared uniforms of the fluid field. Desk materials reference these objects (never copies),
 * so they follow the ping-pong texture without re-binding. See docs/3d/fx.md.
 */
export const fluidUniforms: {
  uFluidVelocity: IUniform<Texture>;
  uFluidScale: IUniform<number>;
  uFluidMax: IUniform<number>;
  uFluidActive: IUniform<number>;
  uFluidViewport: IUniform<Vector2>;
} = {
  uFluidVelocity: { value: FLUID_IDLE_TEXTURE },
  uFluidScale: { value: FLUID_DISPLACEMENT_SCALE },
  uFluidMax: { value: FLUID_MAX_PX / 900 },
  uFluidActive: { value: 0 },
  uFluidViewport: { value: new Vector2(1, 1) }
};

let consumers = 0;

/**
 * Declares that a material samples the field. The simulation only runs while at least one
 * consumer exists, so a page without rain/steam/glass pays nothing. Returns the release function.
 */
export function registerFluidConsumer(): () => void {
  consumers++;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    consumers--;
  };
}

export function fluidConsumerCount(): number {
  return consumers;
}
