export const SURFACE_DECLARATIONS = /* glsl */ `
float surfaceHash(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.zyx + 31.32);
  return fract((p.x + p.y) * p.z);
}

float surfaceNoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  vec2 e = vec2(1.0, 0.0);
  return mix(
    mix(mix(surfaceHash(i), surfaceHash(i + e.xyy), f.x), mix(surfaceHash(i + e.yxy), surfaceHash(i + e.xxy), f.x), f.y),
    mix(mix(surfaceHash(i + e.yyx), surfaceHash(i + e.xyx), f.x), mix(surfaceHash(i + e.yxx), surfaceHash(i + e.xxx), f.x), f.y),
    f.z
  );
}

float surfaceFade(float footprint, float frequency) {
  return 1.0 - smoothstep(0.25, 0.6, footprint * frequency);
}

vec3 woodDetail(vec3 p, float amount, float footprint) {
  float fibre = surfaceNoise(p * vec3(14.0, 300.0, 300.0)) - 0.5;
  float fade = surfaceFade(footprint, 300.0);
  return vec3(1.0 + 0.1 * fibre * amount, 0.1 * fibre * amount * fade, 0.00006 * fibre * amount * fade);
}

vec3 plasterDetail(vec3 p, float amount, float footprint) {
  float mottle = surfaceNoise(p * 9.0) * 0.6 + surfaceNoise(p * 37.0) * 0.4 - 0.5;
  float stipple = surfaceNoise(p * 380.0) - 0.5;
  float fade = surfaceFade(footprint, 380.0);
  float height = (0.00012 * mottle + 0.00022 * stipple * fade) * amount;
  return vec3(1.0 + 0.07 * mottle * amount, 0.06 * stipple * fade * amount, height);
}

vec3 weaveDetail(vec3 p, vec3 n, float amount, float footprint) {
  vec3 a = abs(n);
  vec2 uv = a.x > a.y && a.x > a.z ? p.zy : a.y > a.z ? p.xz : p.xy;
  float frequency = 6.2832 / mix(0.0045, 0.0016, amount);
  float threads = sin(uv.x * frequency) * sin(uv.y * frequency);
  float slub = surfaceNoise(vec3(uv * frequency * 0.08, 0.0)) - 0.5;
  float fade = surfaceFade(footprint, frequency / 6.2832);
  return vec3(1.0 + (0.05 * threads * fade + 0.08 * slub), 0.0, 0.00012 * (0.5 + 0.5 * threads) * fade);
}

vec3 brushedDetail(vec3 p, float amount, float footprint) {
  float streak = surfaceNoise(p * vec3(700.0, 18.0, 700.0)) - 0.5;
  float scratch = smoothstep(0.86, 1.0, surfaceNoise(p * vec3(40.0, 900.0, 900.0)));
  float smudge = surfaceNoise(p * 24.0) - 0.5;
  float fade = surfaceFade(footprint, 700.0);
  return vec3(1.0, (0.08 * streak * fade + 0.16 * scratch * fade + 0.1 * smudge) * amount, 0.0);
}

vec3 surfaceDetail(vec3 p, vec3 n, float code, float footprint) {
  float kind = floor(code * 0.5);
  float amount = code - 2.0 * kind;
  if (kind < 0.5) return woodDetail(p, amount, footprint);
  if (kind < 1.5) return plasterDetail(p, amount, footprint);
  if (kind < 2.5) return weaveDetail(p, n, amount, footprint);
  return brushedDetail(p, amount, footprint);
}

vec3 surfaceBump(vec3 n, float height) {
  vec3 dx = dFdx(-vViewPosition);
  vec3 dy = dFdy(-vViewPosition);
  vec3 r1 = cross(dy, n);
  vec3 r2 = cross(n, dx);
  float det = dot(dx, r1);
  vec3 bumped = abs(det) * n - sign(det) * (dFdx(height) * r1 + dFdy(height) * r2);
  float length2 = dot(bumped, bumped);
  return length2 > 1e-30 ? bumped * inversesqrt(length2) : n;
}
`;
