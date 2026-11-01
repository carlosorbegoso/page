export const rainShader = {
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  fragmentShader: /* glsl */ `
    uniform float uTime;
    uniform vec3 uGlass;
    uniform vec3 uSodium;
    uniform vec3 uLed;
    uniform vec3 uRain;
    varying vec2 vUv;
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    void main() {
      vec3 color = uGlass * (0.7 + 0.6 * vUv.y);
      vec2 grid = vUv * vec2(24.0, 10.0);
      vec2 cell = floor(grid);
      float h = hash(cell);
      vec2 center = vec2(hash(cell + 3.1), hash(cell + 7.7)) * 0.6 + 0.2;
      float bokeh = smoothstep(0.24, 0.0, length(fract(grid) - center)) * step(0.55, h) * (1.0 - vUv.y);
      color += mix(uSodium, uLed, step(0.8, h)) * bokeh * 0.09;
      float column = floor(vUv.x * 90.0);
      float ch = hash(vec2(column, 1.0));
      float y = fract(vUv.y * 1.4 + uTime * (0.18 + ch * 0.22) + ch * 10.0);
      float streak = smoothstep(0.5, 0.0, abs(fract(vUv.x * 90.0) - 0.5) * 2.0 - 0.1);
      streak *= smoothstep(0.0, 0.1, y) * smoothstep(0.35, 0.1, y) * step(0.62, ch);
      color += uRain * streak * 0.1;
      gl_FragColor = vec4(color, 1.0);
      #include <colorspace_fragment>
    }`
};
