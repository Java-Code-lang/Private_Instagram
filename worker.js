// sw.js - Service Worker for Instagram Clone (Caching images, videos, audio)

const CACHE_NAME = 'harsh-insta-v3';

const STATIC_CACHE = [
  '/',
  '/index.html'
];

// Install - Cache basic files
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(STATIC_CACHE))
    );
});

// Activate - Clean old caches
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

// Fetch - Cache First for media (Instagram style)
self.addEventListener('fetch', (event) => {
    const req = event.request;

    if (req.method !== 'GET') return;

    // Cache-First for images, videos, and audio
    if (['image', 'video', 'audio'].includes(req.destination)) {
        event.respondWith(
            caches.match(req).then(cached => {
                return cached || fetch(req).then(res => {
                    if (!res || res.status !== 200) return res;

                    const copy = res.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(req, copy);
                        limitCacheSize(cache, 150);   // Limit to ~150 media files
                    });
                    return res;
                });
            })
        );
        return;
    }

    // Network-First for HTML
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

    // Stale-While-Revalidate for other files
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

// Limit cache size to prevent storage overflow
async function limitCacheSize(cache, maxItems) {
    const keys = await cache.keys();
    if (keys.length > maxItems) {
        await cache.delete(keys[0]);
        await limitCacheSize(cache, maxItems);
    }
}
