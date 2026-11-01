export const dustShader = {
  vertexShader: /* glsl */ `
    uniform float uTime;
    uniform float uPixel;
    attribute float aSeed;
    varying float vAlpha;
    void main() {
      vec3 p = position;
      float s = aSeed * 6.2831;
      p += vec3(sin(uTime * 0.11 + s) * 0.05, sin(uTime * 0.07 + s * 1.7) * 0.06, cos(uTime * 0.09 + s * 1.3) * 0.05);
      vec4 view = modelViewMatrix * vec4(p, 1.0);
      gl_Position = projectionMatrix * view;
      gl_PointSize = uPixel * (0.6 + aSeed) * 12.0 / -view.z;
      vAlpha = 0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * 0.6 + s * 3.0));
    }`,
  fragmentShader: /* glsl */ `
    uniform vec3 uColor;
    varying float vAlpha;
    void main() {
      float d = length(gl_PointCoord - 0.5);
      float a = smoothstep(0.5, 0.0, d) * vAlpha * 0.55;
      gl_FragColor = vec4(uColor * a, 1.0);
      #include <colorspace_fragment>
    }`
};
