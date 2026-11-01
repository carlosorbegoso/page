const VERSION = 'v1';
const IMMUTABLE_CACHE = `immutable-${VERSION}`;
const RUNTIME_CACHE = `runtime-${VERSION}`;
const IMMUTABLE_PATHS = ['_astro/'];
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

async function cacheFirst(request) {
  const hit = await caches.match(request);
  return hit ?? store(IMMUTABLE_CACHE, request, await fetch(request));
}

async function staleWhileRevalidate(event) {
  const hit = await caches.match(event.request);
  const network = fetch(event.request).then(response => store(RUNTIME_CACHE, event.request, response));
  if (!hit) return network;
  event.waitUntil(network.catch(() => undefined));
  return hit;
}

async function networkFirst(request) {
  try {
    return await store(RUNTIME_CACHE, request, await fetch(request));
  } catch (error) {
    const hit = await caches.match(request);
    if (hit) return hit;
    throw error;
  }
}

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET' || request.headers.has('range')) return;
  const strategy = strategyFor(request, new URL(request.url));
  if (strategy === 'cache-first') event.respondWith(cacheFirst(request));
  else if (strategy === 'stale-while-revalidate') event.respondWith(staleWhileRevalidate(event));
  else if (strategy === 'network-first') event.respondWith(networkFirst(request));
});
