// worker.js - Fixed & Improved for your Instagram Clone

const CACHE_NAME = 'harsh-insta';

const STATIC_CACHE = [
  '/',
  '/index.html'
];

// Install
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(STATIC_CACHE))
            .catch(err => console.warn('Static cache warning:', err))
    );
});

// Activate - Clean old versions
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

// Main Fetch Logic - Cache First for Media
self.addEventListener('fetch', (event) => {
    const req = event.request;

    if (req.method !== 'GET') return;

    // Cache-First for all images, videos, and audio (this is what stores your media)
    if (['image', 'video', 'audio'].includes(req.destination)) {
        event.respondWith(
            caches.match(req).then(cached => {
                // Return from cache if available (fast + offline)
                if (cached) return cached;

                // Otherwise fetch from network and cache it
                return fetch(req).then(res => {
                    if (!res || res.status !== 200) return res;

                    const copy = res.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(req, copy);
                        limitCacheSize(cache, 200);   // Increased limit
                    });
                    return res;
                });
            })
        );
        return;
    }

    // For HTML - try network first, fallback to cache
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

    // Default for other files
    event.respondWith(
        caches.match(req).then(cached => cached || fetch(req))
    );
});

// Helper: Prevent cache from growing too big
async function limitCacheSize(cache, maxItems) {
    const keys = await cache.keys();
    if (keys.length > maxItems) {
        await cache.delete(keys[0]);
        await limitCacheSize(cache, maxItems);
    }
}
