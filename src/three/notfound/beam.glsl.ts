export const beamShader = {
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vView;
    void main() {
      vUv = uv;
      vec4 world = modelMatrix * vec4(position, 1.0);
      vNormal = normalize(mat3(modelMatrix) * normal);
      vView = cameraPosition - world.xyz;
      gl_Position = projectionMatrix * viewMatrix * world;
    }`,
  fragmentShader: /* glsl */ `
    uniform vec3 uColor;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vView;
    void main() {
      float facing = abs(dot(normalize(vNormal), normalize(vView)));
      float along = smoothstep(0.0, 0.85, vUv.y);
      gl_FragColor = vec4(uColor * pow(facing, 2.2) * along * 0.04, 1.0);
      #include <colorspace_fragment>
    }`
};
