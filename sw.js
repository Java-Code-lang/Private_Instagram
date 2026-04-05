const CACHE_NAME = 'harsh_intsa';

// Install
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// Activate
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null)
            )
        )
    );
    self.clients.claim();
});

// Fetch
self.addEventListener('fetch', (event) => {
    const req = event.request;

    // HTML → Network first
    if (req.destination === 'document') {
        event.respondWith(
            fetch(req)
                .then(res => {
                    const copy = res.clone();
                    caches.open(CACHE_NAME).then(c => c.put(req, copy));
                    return res;
                })
                .catch(() => caches.match(req))
        );
        return;
    }

    // MEDIA → Cache first (Instagram style)
    if (req.destination === 'image' || req.destination === 'video' || req.destination === 'audio') {
        event.respondWith(
            caches.match(req).then(cached => {
                return cached || fetch(req).then(res => {
                    const copy = res.clone();
                    caches.open(CACHE_NAME).then(c => c.put(req, copy));
                    return res;
                });
            })
        );
        return;
    }

    // Default
    event.respondWith(fetch(req));
});
