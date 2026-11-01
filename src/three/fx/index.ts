import { registerFx } from '../contracts';
import { createFxPipeline, type CinematicFx } from './pipeline';

export { createFxPipeline, type CinematicFx, type FxStats } from './pipeline';
export {
  FLUID_FRAGMENT_OFFSET,
  FLUID_PARS,
  FLUID_VERTEX_DISPLACE,
  FLUID_VERTEX_PARS,
  fluidUniforms,
  registerFluidConsumer,
  withFluidDisplacement,
  withFluidFragment
} from './fluid';

declare global {
  interface Window {
    __fx?: CinematicFx;
  }
}

const pipeline = createFxPipeline();
registerFx(pipeline);
if (new URLSearchParams(location.search).has('debug')) window.__fx = pipeline;

export default pipeline;
