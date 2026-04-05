const CACHE_NAME = 'harsh-archive-v4';

// Core files (instant load)
const STATIC_CACHE = [
  './',
  './index.html',
  './insta/logo.png'
];

// Install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_CACHE))
  );
  self.skipWaiting();
});

// Activate (clean old cache)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null)
      )
    )
  );
});

// Fetch handler
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = req.url;

  // 🎯 MEDIA FILES (VIDEOS, IMAGES, AUDIO)
  if (url.match(/\.(mp4|mp3|jpg|jpeg|png|webp)$/)) {
    
    event.respondWith(
      caches.open(CACHE_NAME).then(async cache => {
        const cached = await cache.match(req);

        // ✅ If already cached → INSTANT LOAD
        if (cached) return cached;

        try {
          // 🌐 Fetch from network
          const response = await fetch(req);

          if (response && response.status === 200) {
            // Save to cache for future
            cache.put(req, response.clone());
          }

          return response;

        } catch (err) {
          // ❌ Offline but not cached
          return new Response(null, { status: 200 });
        }
      })
    );

    return;
  }

  // 🎯 HTML / OTHER FILES → NETWORK FIRST (for updates)
  event.respondWith(
    fetch(req)
      .then(res => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(req, res.clone());
          return res;
        });
      })
      .catch(() => caches.match(req))
  );
});
const CACHE_NAME = 'insta-ultra-v1';

self.addEventListener('install', e => {
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    const req = event.request;

    // NETWORK FIRST (for API/html)
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

    // CACHE FIRST (images/videos)
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

    // DEFAULT
    event.respondWith(fetch(req));
});
*/


// -----------------------------
// 🔄 BACKGROUND PRE-CACHE
// -----------------------------

async function warmCache(mediaList) {
    if (!('caches' in window)) return;

    const cache = await caches.open('insta-ultra-v1');

    mediaList.forEach(async url => {
        try {
            const res = await fetch(url);
            await cache.put(url, res.clone());
        } catch {}
    });
}


// -----------------------------
// 🧠 INIT ENGINE
// -----------------------------

window.addEventListener("load", () => {
    enableGPUAcceleration();
    applyLazyLoading();

    console.log("🔥 Ultra Engine Ready");
});

