export const SPARKS_VERTEX = /* glsl */ `
        attribute vec3 tint;
        attribute float fade;
        uniform float uScale;
        varying vec3 vTint;
        varying float vFade;
        void main() {
          vTint = tint;
          vFade = fade;
          vec4 view = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * view;
          gl_PointSize = max(1.0, 0.0055 * uScale / max(-view.z, 0.01)) * step(0.001, fade);
        }`;

export const SPARKS_FRAGMENT = /* glsl */ `
        varying vec3 vTint;
        varying float vFade;
        void main() {
          float d = length(gl_PointCoord - 0.5) * 2.0;
          float a = clamp(1.0 - d, 0.0, 1.0);
          if (a * vFade < 0.04) discard;
          gl_FragColor = vec4(vTint * 2.2 * a * vFade, a * vFade);
        }`;
