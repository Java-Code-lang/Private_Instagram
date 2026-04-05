const CACHE_NAME = 'harsh-archive-v1';

// Only core UI files need to be listed here
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/content.html',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// 1. Install - Save only the UI
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
  );
});

// 2. Activate - Clean old versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

// 3. The "Auto-Store" Logic
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      // IF ALREADY CACHED: Return immediately (Saves 100% Data)
      if (cachedResponse) {
        return cachedResponse;
      }

      // IF NOT CACHED: Download it, then Save it, then Show it
      return fetch(req).then((networkResponse) => {
        // Check if it's a file we actually want to store (Images, Videos, Audio, or Archive folders)
        const isArchiveFile = req.url.includes('/insta/') || 
                              req.url.includes('/comeback/') ||
                              ['image', 'video', 'audio'].includes(req.destination);

        if (networkResponse && networkResponse.status === 200 && isArchiveFile) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, responseToCache);
          });
        }

        return networkResponse;
      }).catch(() => {
        // Fallback for offline mode if file isn't in cache
        if (req.destination === 'document') return caches.match('/index.html');
      });
    })
  );
});
