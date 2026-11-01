const VERSION = 'v1';
const IMMUTABLE_CACHE = `immutable-${VERSION}`;
const RUNTIME_CACHE = `runtime-${VERSION}`;
const IMMUTABLE_PATHS = ['_astro/'];
const IMMUTABLE_MAX_ENTRIES = 160;
const REVALIDATE_PATHS = ['models/', 'audio/', 'fonts/', 'decoders/', 'images/', 'cv/', 'favicon.svg', 'manifest.json'];

const base = new URL(self.registration.scope).pathname;

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', event => {
  const current = new Set([IMMUTABLE_CACHE, RUNTIME_CACHE]);
  event.waitUntil(
    caches
      .keys()
      .then(keys => Promise.all(keys.filter(key => !current.has(key)).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

function strategyFor(request, url) {
  if (url.origin !== self.location.origin || !url.pathname.startsWith(base)) return null;
  if (request.mode === 'navigate') return 'network-first';
  const path = url.pathname.slice(base.length);
  if (IMMUTABLE_PATHS.some(prefix => path.startsWith(prefix))) return 'cache-first';
  if (REVALIDATE_PATHS.some(prefix => path.startsWith(prefix))) return 'stale-while-revalidate';
  return null;
}

async function store(cacheName, request, response) {
  if (response.ok && response.type === 'basic') {
    const cache = await caches.open(cacheName);
    await cache.put(request, response.clone());
  }
  return response;
}

async function trim(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  await Promise.all(keys.slice(0, Math.max(0, keys.length - maxEntries)).map(key => cache.delete(key)));
}

async function cacheFirst(event) {
  const hit = await caches.match(event.request);
  if (hit) return hit;
  const response = await store(IMMUTABLE_CACHE, event.request, await fetch(event.request));
  event.waitUntil(trim(IMMUTABLE_CACHE, IMMUTABLE_MAX_ENTRIES));
  return response;
}

async function staleWhileRevalidate(event) {
  const hit = await caches.match(event.request);
  const network = fetch(event.request).then(response => store(RUNTIME_CACHE, event.request, response));
  if (!hit) return network;
  event.waitUntil(network.catch(() => undefined));
  return hit;
}

function documentKey(url) {
  return `${url.origin}${url.pathname}`;
}

async function networkFirst(request) {
  const key = documentKey(new URL(request.url));
  try {
    return await store(RUNTIME_CACHE, key, await fetch(request));
  } catch (error) {
    const hit = await caches.match(key);
    if (hit) return hit;
    throw error;
  }
}

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET' || request.headers.has('range')) return;
  const strategy = strategyFor(request, new URL(request.url));
  if (strategy === 'cache-first') event.respondWith(cacheFirst(event));
  else if (strategy === 'stale-while-revalidate') event.respondWith(staleWhileRevalidate(event));
  else if (strategy === 'network-first') event.respondWith(networkFirst(request));
});
