import type { WebGLRenderer } from 'three';
import type { GLTF } from 'three/addons/loaders/GLTFLoader.js';

interface Entry<T> {
  promise: Promise<T>;
  refs: number;
  dispose: (value: T) => void;
  timer: ReturnType<typeof setTimeout> | undefined;
}

const GRACE_MS = 5000;
const cache = new Map<string, Entry<unknown>>();

export function acquire<T>(key: string, create: () => Promise<T>, dispose: (value: T) => void): Promise<T> {
  let entry = cache.get(key) as Entry<T> | undefined;
  if (!entry) {
    entry = { promise: create(), refs: 0, dispose, timer: undefined };
    cache.set(key, entry as Entry<unknown>);
    entry.promise.catch(() => cache.delete(key));
  }
  if (entry.timer) {
    clearTimeout(entry.timer);
    entry.timer = undefined;
  }
  entry.refs++;
  return entry.promise;
}

export function release(key: string, graceMs = GRACE_MS): void {
  const entry = cache.get(key);
  if (!entry) return;
  entry.refs = Math.max(0, entry.refs - 1);
  if (entry.refs > 0 || entry.timer) return;
  entry.timer = setTimeout(() => {
    if (entry.refs > 0) return;
    cache.delete(key);
    entry.promise.then(value => entry.dispose(value)).catch(() => undefined);
  }, graceMs);
}

export function cacheSnapshot(): Record<string, number> {
  return Object.fromEntries([...cache].map(([key, entry]) => [key, entry.refs]));
}

let loaderPromise: Promise<(url: string) => Promise<GLTF>> | undefined;
let rendererForLoaders: WebGLRenderer | undefined;

export function bindRenderer(renderer: WebGLRenderer): void {
  rendererForLoaders = renderer;
}

function gltfLoader(): Promise<(url: string) => Promise<GLTF>> {
  loaderPromise ??= (async () => {
    const [{ GLTFLoader }, { KTX2Loader }, { MeshoptDecoder }] = await Promise.all([
      import('three/addons/loaders/GLTFLoader.js'),
      import('three/addons/loaders/KTX2Loader.js'),
      import('three/addons/libs/meshopt_decoder.module.js')
    ]);
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    const ktx2 = new KTX2Loader().setTranscoderPath(`${import.meta.env.BASE_URL.replace(/\/?$/, '/')}decoders/basis/`);
    if (rendererForLoaders) ktx2.detectSupport(rendererForLoaders);
    loader.setKTX2Loader(ktx2);
    return (url: string) => loader.loadAsync(url);
  })();
  return loaderPromise;
}

export function acquireGltf(url: string): Promise<GLTF> {
  return acquire(
    url,
    async () => (await gltfLoader())(url),
    gltf => {
      gltf.scene.traverse(object => {
        const mesh = object as import('three').Mesh;
        if (!mesh.isMesh) return;
        mesh.geometry.dispose();
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        for (const material of materials) {
          for (const value of Object.values(material)) {
            if (value && typeof value === 'object' && 'isTexture' in value) (value as import('three').Texture).dispose();
          }
          material.dispose();
        }
      });
    }
  );
}
