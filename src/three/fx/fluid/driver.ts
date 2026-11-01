import type { Vector2, WebGLRenderer } from 'three';
import type { GpuTimer } from '../gpuTimer';
import type { TierProfile } from '../settings';
import type { FluidField } from './field';
import { FluidPointerInput } from './pointer';
import { FLUID_IDLE_TEXTURE, FLUID_MAX_PX, fluidUniforms } from './uniforms';

export class FluidDriver {
  private field: FluidField | null = null;
  private fieldClass: typeof FluidField | null = null;
  private fieldLoading = false;
  private readonly input: FluidPointerInput;
  private cssHeight = 0;

  constructor(canvas: () => HTMLElement | null, damping: number) {
    this.input = new FluidPointerInput(canvas, damping);
  }

  get awake(): boolean {
    return Boolean(this.field?.awake);
  }

  resize(cssHeight: number): void {
    this.cssHeight = cssHeight;
    this.input.invalidateRect();
  }

  step(renderer: WebGLRenderer, dt: number, running: boolean, profile: TierProfile, bufferSize: Vector2, timer: GpuTimer | null): void {
    if (!running) {
      this.input.consume(dt);
      if (this.field) this.field.clear(renderer);
      fluidUniforms.uFluidActive.value = 0;
      return;
    }
    if (!this.field) {
      if (!this.fieldClass) return this.loadField(dt);
      this.field = new this.fieldClass({ size: profile.fluidSize, iterations: profile.pressureIterations, vorticity: profile.vorticity });
    }
    const stroke = this.input.consume(dt);
    if (!stroke && !this.field.awake) {
      fluidUniforms.uFluidActive.value = 0;
      return;
    }
    timer?.begin('fluid');
    this.field.step(renderer, dt, bufferSize.x / Math.max(1, bufferSize.y), stroke);
    timer?.end();
    fluidUniforms.uFluidVelocity.value = this.field.texture;
    fluidUniforms.uFluidActive.value = this.field.awake ? 1 : 0;
    fluidUniforms.uFluidMax.value = FLUID_MAX_PX / this.viewportHeight(renderer, bufferSize);
    fluidUniforms.uFluidViewport.value.set(bufferSize.x, bufferSize.y);
  }

  private loadField(dt: number): void {
    this.input.consume(dt);
    fluidUniforms.uFluidActive.value = 0;
    if (this.fieldLoading) return;
    this.fieldLoading = true;
    import('./field')
      .then(module => (this.fieldClass = module.FluidField))
      .catch(error => console.error('[fx] fluid failed', error));
  }

  private viewportHeight(renderer: WebGLRenderer, bufferSize: Vector2): number {
    if (this.cssHeight > 0) return this.cssHeight;
    return Math.max(1, renderer.domElement.clientHeight || bufferSize.y / renderer.getPixelRatio());
  }

  reset(): void {
    this.field?.dispose();
    this.field = null;
    fluidUniforms.uFluidActive.value = 0;
    fluidUniforms.uFluidVelocity.value = FLUID_IDLE_TEXTURE;
  }

  dispose(): void {
    this.input.dispose();
    this.reset();
  }
}
