export { FLUID_FRAGMENT_OFFSET, FLUID_PARS, FLUID_VERTEX_DISPLACE, FLUID_VERTEX_PARS } from './displace.glsl';
export type { FluidSettings, FluidStroke } from './field';
export { withFluidDisplacement, withFluidFragment } from './patch';
export { FluidPointerInput } from './pointer';
export {
  FLUID_DISPLACEMENT_SCALE,
  FLUID_IDLE_TEXTURE,
  FLUID_MAX_PX,
  fluidConsumerCount,
  fluidUniforms,
  registerFluidConsumer
} from './uniforms';
