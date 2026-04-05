const CACHE_NAME = 'harsh_insta_v2';
const STATIC_CACHE = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js'
];

// --- INSTALL ---
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(STATIC_CACHE))
    );
});

// --- ACTIVATE ---
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) return caches.delete(key);
                })
            )
        )
    );
    self.clients.claim();
});

// --- FETCH STRATEGIES ---
self.addEventListener('fetch', (event) => {
    const req = event.request;

    // Fix: Only handle GET requests for caching
    if (req.method !== 'GET') return;

    // HTML -> Network First
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

    // MEDIA -> Cache First (Instagram style)
    if (['image', 'video', 'audio'].includes(req.destination)) {
        event.respondWith(
            caches.match(req).then(cached => {
                return cached || fetch(req).then(res => {
                    const copy = res.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(req, copy);
                        limitCacheSize(cache, 80); 
                    });
                    return res;
                });
            })
        );
        return;
    }

    // DEFAULT: Stale While Revalidate for JS/CSS
    event.respondWith(
        caches.match(req).then(cached => {
            const fetchPromise = fetch(req).then(res => {
                caches.open(CACHE_NAME).then(c => c.put(req, res.clone()));
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
