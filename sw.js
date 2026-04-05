const CACHE_NAME = 'harsh-insta-v3';   // Change version when you update

// Pre-cache important files
const STATIC_CACHE = [
  '/',
  '/index.html'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_CACHE))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  if (req.method !== 'GET') return;

  // Cache-First strategy for media (images, video, audio) - Instagram style
  if (['image', 'video', 'audio'].includes(req.destination)) {
    event.respondWith(
      caches.match(req).then(cached => {
        return cached || fetch(req).then(res => {
          if (!res || res.status !== 200) return res;

          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(req, copy);
            limitCacheSize(cache, 120);   // Increased limit for many posts
          });
          return res;
        });
      })
    );
    return;
  }

  // Network-First for HTML (so you can update the app)
  if (req.destination === 'document') {
    event.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req) || caches.match('/index.html'))
    );
    return;
  }

  // Stale-While-Revalidate for everything else (CSS, JS, etc.)
  event.respondWith(
    caches.match(req).then(cached => {
      const fetchPromise = fetch(req).then(res => {
        if (res && res.status === 200) {
          caches.open(CACHE_NAME).then(c => c.put(req, res.clone()));
        }
        return res;
      });
      return cached || fetchPromise;
    })
  );
});

async function limitCacheSize(cache, maxItems) {
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    await cache.delete(keys[0]);
    await limitCacheSize(cache, maxItems);
  }
}
