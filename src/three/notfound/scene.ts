import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  SpotLight,
  SRGBColorSpace,
  Texture,
  Vector3,
  WebGLRenderer
} from 'three';
import { tokenColor } from '../tokens';
import { motionAllowed, readMotion, watchMotion } from '../motion';

export interface NotFoundOptions {
  container: HTMLElement;
  /** Label printed on the sheet, e.g. "No encontrado · Not found". */
  paperLabel: string;
  quality: 'mid' | 'high';
}

const DEG = Math.PI / 180;
const TARGET = new Vector3(0.35, 0.05, -0.05);
const LAMP_HEAD = new Vector3(-0.55, 1.55, -0.55);
const PAPER_W = 0.86;
const PAPER_H = 1.16;

function css(name: string, fallback: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

async function fontsReady(): Promise<void> {
  const loads = Promise.all([
    document.fonts.load('700 320px Geist'),
    document.fonts.load('500 40px "Geist Mono"')
  ]).then(() => undefined);
  await Promise.race([loads, new Promise(resolve => setTimeout(resolve, 1500))]).catch(() => undefined);
}

function limaTime(): string {
  try {
    return new Intl.DateTimeFormat('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'America/Lima'
    }).format(new Date());
  } catch {
    return '02:14';
  }
}

function paperTexture(label: string): CanvasTexture {
  const w = 860;
  const h = 1160;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const g = canvas.getContext('2d')!;
  const ink = '#1c2331';
  const mono = '"Geist Mono", "Geist Mono Fallback", monospace';
  const sans = 'Geist, "Geist Fallback", sans-serif';

  g.fillStyle = css('--color-desk-paper', '#d8d2c4');
  g.fillRect(0, 0, w, h);
  const grain = g.createRadialGradient(w * 0.55, h * 0.4, 50, w * 0.5, h * 0.5, h * 0.75);
  grain.addColorStop(0, 'rgba(255,250,240,0.35)');
  grain.addColorStop(1, 'rgba(90,70,40,0.18)');
  g.fillStyle = grain;
  g.fillRect(0, 0, w, h);

  g.strokeStyle = 'rgba(60,80,110,0.16)';
  g.lineWidth = 2;
  for (let y = 560; y < h - 60; y += 46) {
    g.beginPath();
    g.moveTo(70, y);
    g.lineTo(w - 70, y);
    g.stroke();
  }

  g.fillStyle = ink;
  g.globalAlpha = 0.7;
  g.font = `500 26px ${mono}`;
  g.fillText('EXP. 404', 70, 96);
  g.textAlign = 'right';
  g.fillText(`LIMA · ${limaTime()}`, w - 70, 96);
  g.textAlign = 'left';
  g.globalAlpha = 1;

  g.font = `700 300px ${sans}`;
  g.fillText('404', 58, 400);

  g.font = `500 30px ${mono}`;
  g.fillText(label.toUpperCase(), 70, 478);

  const path = decodeURIComponent(location.pathname).slice(0, 34);
  g.globalAlpha = 0.55;
  g.font = `400 26px ${mono}`;
  g.fillText(path, 70, 640);
  g.fillRect(70, 631, Math.min(g.measureText(path).width, w - 140), 3);
  g.globalAlpha = 1;

  g.save();
  g.translate(w - 200, h - 210);
  g.rotate(-14 * DEG);
  g.strokeStyle = css('--color-accent', '#5aa9ff');
  g.fillStyle = g.strokeStyle;
  g.globalAlpha = 0.6;
  g.lineWidth = 6;
  g.beginPath();
  g.arc(0, 0, 112, 0, Math.PI * 2);
  g.stroke();
  g.lineWidth = 2;
  g.beginPath();
  g.arc(0, 0, 96, 0, Math.PI * 2);
  g.stroke();
  g.textAlign = 'center';
  g.font = `600 64px ${mono}`;
  g.fillText('?', 0, 22);
  g.restore();

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function ghostTexture(): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 344;
  const g = canvas.getContext('2d')!;
  g.strokeStyle = 'rgba(255,236,210,0.5)';
  g.lineWidth = 3;
  g.setLineDash([14, 10]);
  g.strokeRect(6, 6, 244, 332);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

function rod(from: Vector3, to: Vector3, radius: number, material: MeshStandardMaterial): Mesh {
  const length = from.distanceTo(to);
  const mesh = new Mesh(new CylinderGeometry(radius, radius, length, 12), material);
  mesh.position.copy(from).lerp(to, 0.5);
  mesh.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), to.clone().sub(from).normalize());
  mesh.castShadow = true;
  return mesh;
}

const beamShader = {
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

const dustShader = {
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

const rainShader = {
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

/** Mounts the decorative 404 scene into `container` and returns a disposer. */
export async function mountNotFound({ container, paperLabel, quality }: NotFoundOptions): Promise<() => void> {
  await fontsReady();
  const renderer = new WebGLRenderer({ antialias: quality === 'high', powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  const canvas = renderer.domElement;
  canvas.dataset.nfCanvas = '';
  canvas.setAttribute('aria-hidden', 'true');
  container.append(canvas);

  const scene = new Scene();
  const background = tokenColor('--color-sky-zenith', '#04060b');
  scene.background = background;

  const camera = new PerspectiveCamera(32, 1, 0.1, 30);
  const wood = new MeshStandardMaterial({ color: tokenColor('--color-desk-wood'), roughness: 0.78 });
  const wall = new MeshStandardMaterial({ color: tokenColor('--color-desk-wall'), roughness: 0.95 });
  const metal = new MeshStandardMaterial({ color: tokenColor('--color-desk-metal'), roughness: 0.45, metalness: 0.6 });
  const shade = new MeshStandardMaterial({ color: tokenColor('--color-lamp-shade'), roughness: 0.5, metalness: 0.4, side: DoubleSide });
  const folderMat = new MeshStandardMaterial({ color: tokenColor('--color-folder-intercorp'), roughness: 0.9 });
  const ceramic = new MeshStandardMaterial({ color: tokenColor('--color-desk-ceramic'), roughness: 0.4 });
  const frameMat = new MeshStandardMaterial({ color: tokenColor('--color-window-frame'), roughness: 0.7 });

  const desk = new Mesh(new BoxGeometry(7, 0.12, 4), wood);
  desk.position.set(0.4, -0.06, -0.2);
  desk.receiveShadow = true;
  scene.add(desk);

  const backWall = new Mesh(new PlaneGeometry(14, 8), wall);
  backWall.position.set(0.4, 2, -2.2);
  backWall.receiveShadow = true;
  scene.add(backWall);

  const rainMaterial = new ShaderMaterial({
    ...rainShader,
    uniforms: {
      uTime: { value: 0 },
      uGlass: { value: tokenColor('--color-window-glass', '#0b1220') },
      uSodium: { value: tokenColor('--color-city-sodium', '#e8a25a') },
      uLed: { value: tokenColor('--color-city-led', '#8fb4e8') },
      uRain: { value: tokenColor('--color-rain', '#9db8e8') }
    }
  });
  const windowGroup = new Object3D();
  windowGroup.position.set(1.4, 1.25, -2.18);
  windowGroup.add(new Mesh(new PlaneGeometry(2.6, 2.2), rainMaterial));
  for (const [w, h, x, y] of [
    [2.74, 0.07, 0, 1.1],
    [2.74, 0.07, 0, -1.1],
    [0.07, 2.26, 1.33, 0],
    [0.07, 2.26, -1.33, 0],
    [0.04, 2.2, 0, 0]
  ]) {
    const bar = new Mesh(new BoxGeometry(w, h, 0.06), frameMat);
    bar.position.set(x, y, 0.03);
    windowGroup.add(bar);
  }
  scene.add(windowGroup);

  const folder = new Object3D();
  folder.position.copy(TARGET).setY(0.006);
  folder.rotation.y = -7 * DEG;
  const coverGeometry = new BoxGeometry(0.98, 0.012, 1.3);
  for (const x of [-0.5, 0.5]) {
    const cover = new Mesh(coverGeometry, folderMat);
    cover.position.x = x;
    cover.receiveShadow = true;
    cover.castShadow = true;
    folder.add(cover);
  }
  const tab = new Mesh(new BoxGeometry(0.34, 0.012, 0.1), folderMat);
  tab.position.set(0.7, 0, -0.69);
  folder.add(tab);

  const paperGeometry = new PlaneGeometry(PAPER_W, PAPER_H, 12, 1);
  const positions = paperGeometry.attributes.position as BufferAttribute;
  for (let i = 0; i < positions.count; i++) {
    const u = positions.getX(i) / PAPER_W + 0.5;
    positions.setZ(i, Math.pow(u, 3) * 0.035);
  }
  paperGeometry.computeVertexNormals();
  const paperMap = paperTexture(paperLabel);
  const paper = new Mesh(paperGeometry, new MeshStandardMaterial({ map: paperMap, roughness: 0.92 }));
  paper.rotation.set(-Math.PI / 2, 0, 3 * DEG);
  paper.position.set(0.5, 0.014, 0.02);
  paper.castShadow = true;
  paper.receiveShadow = true;
  folder.add(paper);

  const ghost = new Mesh(
    new PlaneGeometry(PAPER_W * 0.98, PAPER_H * 0.98),
    new MeshBasicMaterial({ map: ghostTexture(), transparent: true, opacity: 0.35, depthWrite: false })
  );
  ghost.rotation.x = -Math.PI / 2;
  ghost.position.set(-0.5, 0.0125, 0);
  folder.add(ghost);
  scene.add(folder);

  const mug = new Mesh(new CylinderGeometry(0.16, 0.14, 0.34, 24), ceramic);
  mug.position.set(1.75, 0.17, -0.75);
  mug.castShadow = true;
  scene.add(mug);

  const lampBase = new Vector3(-1.35, 0.03, -1.05);
  const elbow = new Vector3(-1.2, 1.25, -1.15);
  const base = new Mesh(new CylinderGeometry(0.24, 0.27, 0.06, 32), metal);
  base.position.copy(lampBase);
  base.castShadow = true;
  scene.add(base, rod(lampBase, elbow, 0.022, metal), rod(elbow, LAMP_HEAD, 0.02, metal));

  const beamDirection = TARGET.clone().sub(LAMP_HEAD).normalize();
  const down = new Vector3(0, -1, 0);
  const headGeometry = new ConeGeometry(0.2, 0.3, 32, 1, true);
  headGeometry.translate(0, -0.15, 0);
  const head = new Mesh(headGeometry, shade);
  head.position.copy(LAMP_HEAD).addScaledVector(beamDirection, -0.08);
  head.quaternion.setFromUnitVectors(down, beamDirection);
  scene.add(head);

  const lampColor = tokenColor('--color-lamp', '#ffb566');
  const bulb = new Mesh(new SphereGeometry(0.06, 16, 12), new MeshBasicMaterial({ color: new Color(lampColor).multiplyScalar(2) }));
  bulb.position.copy(LAMP_HEAD).addScaledVector(beamDirection, 0.02);
  scene.add(bulb);

  const spot = new SpotLight(lampColor, 12, 7, 30 * DEG, 0.55, 2);
  spot.position.copy(LAMP_HEAD);
  spot.target.position.copy(TARGET);
  spot.castShadow = true;
  spot.shadow.mapSize.setScalar(quality === 'high' ? 1024 : 512);
  spot.shadow.bias = -0.0004;
  spot.shadow.radius = 4;
  scene.add(spot, spot.target);

  const moon = new DirectionalLight(tokenColor('--color-moonlight', '#9db8e8'), 0.6);
  moon.position.set(2.5, 3, -2);
  scene.add(moon, new HemisphereLight(tokenColor('--color-moonlight', '#9db8e8'), tokenColor('--color-desk-floor'), 0.25));

  const beamLength = LAMP_HEAD.distanceTo(TARGET) * 1.02;
  const beamGeometry = new ConeGeometry(Math.tan(30 * DEG) * beamLength, beamLength, 40, 1, true);
  beamGeometry.translate(0, -beamLength / 2, 0);
  const beamMaterial = new ShaderMaterial({
    ...beamShader,
    uniforms: { uColor: { value: lampColor } },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    side: DoubleSide
  });
  const beam = new Mesh(beamGeometry, beamMaterial);
  beam.position.copy(LAMP_HEAD);
  beam.quaternion.setFromUnitVectors(down, beamDirection);
  scene.add(beam);

  const dustCount = quality === 'high' ? 320 : 160;
  const dustPositions = new Float32Array(dustCount * 3);
  const seeds = new Float32Array(dustCount);
  const local = new Vector3();
  for (let i = 0; i < dustCount; i++) {
    const t = 0.15 + Math.random() * 0.8;
    const radius = Math.sqrt(Math.random()) * Math.tan(26 * DEG) * beamLength * t;
    const angle = Math.random() * Math.PI * 2;
    local.set(Math.cos(angle) * radius, -t * beamLength, Math.sin(angle) * radius).applyQuaternion(beam.quaternion).add(LAMP_HEAD);
    local.toArray(dustPositions, i * 3);
    seeds[i] = Math.random();
  }
  const dustGeometry = new BufferGeometry();
  dustGeometry.setAttribute('position', new BufferAttribute(dustPositions, 3));
  dustGeometry.setAttribute('aSeed', new BufferAttribute(seeds, 1));
  const dustMaterial = new ShaderMaterial({
    ...dustShader,
    uniforms: { uTime: { value: 0 }, uPixel: { value: 1 }, uColor: { value: new Color(lampColor).lerp(new Color('#ffffff'), 0.4) } },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending
  });
  scene.add(new Points(dustGeometry, dustMaterial));

  const baseOffset = new Vector3();
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let portrait = false;

  function layout(): void {
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    renderer.setSize(width, height, false);
    portrait = height > width;
    camera.aspect = width / height;
    camera.fov = portrait ? 46 : 34;
    const distance = portrait ? 4.9 : 4.2;
    baseOffset.set(0.12, 0.44, 0.89).normalize().multiplyScalar(distance);
    // The HTML copy sits left on landscape and below on portrait; shifting the projection keeps the sheet clear of it.
    if (portrait) camera.setViewOffset(width, height, width * 0.14, height * 0.23, width, height);
    else camera.setViewOffset(width, height, -width * 0.2, -height * 0.06, width, height);
    camera.updateProjectionMatrix();
    dustMaterial.uniforms.uPixel.value = (height * renderer.getPixelRatio()) / 900;
  }

  const spherical = new Vector3();
  function placeCamera(time: number): void {
    pointer.x += (pointer.tx - pointer.x) * 0.04;
    pointer.y += (pointer.ty - pointer.y) * 0.04;
    const yaw = pointer.x * 2 * DEG + Math.sin(time * 0.21) * 0.4 * DEG;
    const pitch = pointer.y * 1.2 * DEG + Math.sin(time * 0.33) * 0.25 * DEG;
    spherical.copy(baseOffset).applyAxisAngle(new Vector3(0, 1, 0), yaw);
    const side = new Vector3(spherical.z, 0, -spherical.x).normalize();
    spherical.applyAxisAngle(side, pitch);
    spherical.multiplyScalar(1 + Math.sin(time * 0.17) * 0.006);
    camera.position.copy(TARGET).add(spherical);
    camera.up.set(0, 1, 0);
    camera.lookAt(TARGET);
  }

  let frame = 0;
  let running = false;
  let motion = motionAllowed(readMotion());
  const start = performance.now();

  function render(time: number): void {
    rainMaterial.uniforms.uTime.value = time;
    dustMaterial.uniforms.uTime.value = time;
    placeCamera(time);
    renderer.render(scene, camera);
  }

  function tick(): void {
    frame = requestAnimationFrame(tick);
    render((performance.now() - start) / 1000);
  }

  function play(): void {
    if (running || document.hidden || !motion) return;
    running = true;
    frame = requestAnimationFrame(tick);
  }

  function stop(): void {
    running = false;
    cancelAnimationFrame(frame);
  }

  function still(): void {
    pointer.x = pointer.tx = 0;
    pointer.y = pointer.ty = 0;
    render(12);
  }

  const onPointer = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    pointer.tx = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.ty = (event.clientY / window.innerHeight) * 2 - 1;
  };
  const onTilt = (event: DeviceOrientationEvent) => {
    if (event.gamma === null || event.beta === null) return;
    pointer.tx = Math.max(-1, Math.min(1, event.gamma / 30));
    pointer.ty = Math.max(-1, Math.min(1, (event.beta - 45) / 30));
  };
  const onResize = () => {
    layout();
    if (!running) still();
  };
  const onVisibility = () => (document.hidden ? stop() : play());
  const unwatch = watchMotion(state => {
    motion = motionAllowed(state);
    if (motion) play();
    else {
      stop();
      still();
    }
  });
  const onContextLost = (event: Event) => {
    event.preventDefault();
    stop();
    container.dataset.degraded = 'context-lost';
  };

  window.addEventListener('pointermove', onPointer, { passive: true });
  window.addEventListener('deviceorientation', onTilt, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  canvas.addEventListener('webglcontextlost', onContextLost);

  layout();
  still();
  renderer.shadowMap.autoUpdate = false;
  container.dataset.ready = 'true';
  play();

  let disposed = false;
  return () => {
    if (disposed) return;
    disposed = true;
    stop();
    unwatch();
    window.removeEventListener('pointermove', onPointer);
    window.removeEventListener('deviceorientation', onTilt);
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVisibility);
    canvas.removeEventListener('webglcontextlost', onContextLost);
    const geometries = new Set<BufferGeometry>();
    const materials = new Set<MeshStandardMaterial | MeshBasicMaterial | ShaderMaterial>();
    scene.traverse(object => {
      const mesh = object as Mesh;
      if (mesh.geometry) geometries.add(mesh.geometry);
      if (mesh.material) materials.add(mesh.material as MeshStandardMaterial);
    });
    geometries.forEach(geometry => geometry.dispose());
    materials.forEach(material => {
      if ('map' in material && material.map instanceof Texture) material.map.dispose();
      material.dispose();
    });
    spot.shadow.map?.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
    delete container.dataset.ready;
  };
}
