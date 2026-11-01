import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
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
  Texture,
  Vector3,
  WebGLRenderer
} from 'three';
import { tokenColor } from '../tokens';
import { motionAllowed, readMotion, watchMotion } from '../motion';
import { beamShader } from './beam.glsl';
import { DEG, LAMP_HEAD, PAPER_H, PAPER_W, TARGET } from './constants';
import { dustShader } from './dust.glsl';
import { fontsReady } from './fonts';
import { ghostTexture, paperTexture } from './paper-texture';
import { rainShader } from './rain.glsl';
import { rod } from './rod';

export interface NotFoundOptions {
  container: HTMLElement;
  /** Label printed on the sheet, e.g. "No encontrado · Not found". */
  paperLabel: string;
  quality: 'mid' | 'high';
}

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
