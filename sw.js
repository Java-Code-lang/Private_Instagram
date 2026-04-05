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
