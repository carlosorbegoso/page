import { DataTexture, RGBAFormat, Vector2, type IUniform, type Texture } from 'three';

export const FLUID_DISPLACEMENT_SCALE = 0.006;
export const FLUID_MAX_PX = 6;

export const FLUID_IDLE_TEXTURE = new DataTexture(new Uint8Array(4), 1, 1, RGBAFormat);
FLUID_IDLE_TEXTURE.needsUpdate = true;

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
