import { Vector2, type DepthTexture, type PerspectiveCamera, type Scene, type WebGLRenderer } from 'three';

export const LATE_LAYER = 1;

export const lateUniforms = {
  tSceneDepth: { value: null as DepthTexture | null },
  uLateViewport: { value: new Vector2(1, 1) },
  uLateDepthTest: { value: 0 }
};

export const LATE_DEPTH_CHUNK = /* glsl */ `
uniform sampler2D tSceneDepth;
uniform vec2 uLateViewport;
uniform float uLateDepthTest;
bool lateOccluded() {
  if (uLateDepthTest < 0.5) return false;
  return texture2D(tSceneDepth, gl_FragCoord.xy / uLateViewport).x < gl_FragCoord.z;
}
`;

const drawingBuffer = new Vector2();

export function renderLateLayer(renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera, depth: DepthTexture | null): void {
  const mask = camera.layers.mask;
  const autoClear = renderer.autoClear;
  renderer.getDrawingBufferSize(drawingBuffer);
  lateUniforms.tSceneDepth.value = depth;
  lateUniforms.uLateViewport.value.copy(drawingBuffer);
  lateUniforms.uLateDepthTest.value = depth ? 1 : 0;
  const background = scene.background;
  scene.background = null;
  camera.layers.set(LATE_LAYER);
  renderer.autoClear = false;
  renderer.setRenderTarget(null);
  renderer.render(scene, camera);
  renderer.autoClear = autoClear;
  camera.layers.mask = mask;
  scene.background = background;
}
