// Femine service worker — v1.
//
// Caching strategies (best practice for a static site):
// - HTML navigations: network-first, then the cached copy, then /offline/.
//   HTML is never cache-first: a stale page can point at deleted hashed assets.
// - Fingerprinted assets (/_astro/, /fonts/): cache-first — the filename
//   changes whenever the content does, so a cached copy is never stale.
// - Images: stale-while-revalidate — instant repeat loads, fresh in background.
// - Other same-origin GETs (manifest, sitemap): network-first, cache fallback.
// - Cross-origin requests: never intercepted, network only.
// Cache names are versioned: bump VERSION on a breaking change and old
// caches are deleted on activate. skipWaiting + clients.claim apply the
// update immediately — safe here because HTML is network-first.
const VERSION = 'v1';
const CACHE_STATIC = `femine-static-${VERSION}`;
const CACHE_PAGES = `femine-pages-${VERSION}`;
const CACHE_IMAGES = `femine-images-${VERSION}`;
const OFFLINE_URL = '/offline/';
const PRECACHE = [OFFLINE_URL, '/favicon.svg', '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_STATIC)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => ![CACHE_STATIC, CACHE_PAGES, CACHE_IMAGES].includes(k))
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Navigations: network-first, cached copy, then the offline page.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_PAGES).then((c) => c.put(request, copy));
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached || caches.match(OFFLINE_URL);
        }),
    );
    return;
  }

  // Fingerprinted static assets: cache-first.
  if (url.pathname.startsWith('/_astro/') || url.pathname.startsWith('/fonts/')) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            const copy = res.clone();
            caches.open(CACHE_STATIC).then((c) => c.put(request, copy));
            return res;
          }),
      ),
    );
    return;
  }

  // Images: stale-while-revalidate.
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then((cached) => {
        const network = fetch(request)
          .then((res) => {
            const copy = res.clone();
            caches.open(CACHE_IMAGES).then((c) => c.put(request, copy));
            return res;
          })
          .catch(() => cached);
        return cached || network;
      }),
    );
    return;
  }

  // Other same-origin GETs: network-first, cache fallback.
  event.respondWith(
    fetch(request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE_STATIC).then((c) => c.put(request, copy));
        return res;
      })
      .catch(() => caches.match(request)),
  );
});
