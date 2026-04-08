const CACHE_NAME = 'harsh-archive-v1';

// Relative paths for GitHub Pages compatibility
const CORE_ASSETS = [
  'index.html',
  'content.html',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const asset of CORE_ASSETS) {
        try {
          await cache.add(asset);
          console.log('✅ Core Asset Cached:', asset);
        } catch (e) {
          console.warn('⚠️ Core Asset Failed:', asset);
        }
      }
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        // Auto-save media to cache as user browses
        const isArchive = req.url.includes('/insta/') || req.url.includes('/comeback/');
        if (res.status === 200 && isArchive) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
        }
        return res;
      }).catch(() => {
        if (req.destination === 'document') return caches.match('index.html');
      });
    })
  );
});
