const CACHE_NAME = 'harsh_insta_v2';
const STATIC_CACHE = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js'
];

// --- INSTALL (PRECACHE CORE FILES) ---
self.addEventListener('install', (event) => {
    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(STATIC_CACHE))
    );
});

// --- ACTIVATE (CLEAR OLD CACHE) ---
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            )
        )
    );

    self.clients.claim();
});


// --- FETCH STRATEGIES ---
self.addEventListener('fetch', (event) => {
    const req = event.request;

    // 🔹 HTML → NETWORK FIRST (fresh content)
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

    // 🔹 MEDIA (IMAGE/VIDEO/AUDIO) → CACHE FIRST (Instagram behavior)
    if (['image', 'video', 'audio'].includes(req.destination)) {
        event.respondWith(
            caches.match(req).then(cached => {
                if (cached) return cached;

                return fetch(req).then(res => {
                    const copy = res.clone();

                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(req, copy);
                        limitCacheSize(cache, 80); // 🔥 limit media cache
                    });

                    return res;
                });
            })
        );
        return;
    }

    // 🔹 JS/CSS → STALE WHILE REVALIDATE
    if (['script', 'style'].includes(req.destination)) {
        event.respondWith(
            caches.match(req).then(cached => {
                const fetchPromise = fetch(req).then(res => {
                    caches.open(CACHE_NAME).then(c => c.put(req, res.clone()));
                    return res;
                });

                return cached || fetchPromise;
            })
        );
        return;
    }

    // 🔹 DEFAULT
    event.respondWith(fetch(req));
});


// --- CACHE SIZE LIMIT (IMPORTANT FOR VIDEOS) ---
async function limitCacheSize(cache, maxItems) {
    const keys = await cache.keys();

    if (keys.length > maxItems) {
        cache.delete(keys[0]).then(() => limitCacheSize(cache, maxItems));
    }
}
