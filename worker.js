const CACHE_NAME = 'harsh-archive-v1';

const CORE_ASSETS = [
  '/',
  '/index.html',
  '/content.html',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
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
  
  // LOGIC: For offline reliability, we check cache FIRST, then network.
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(req).then((networkResponse) => {
        // Only cache successful GET requests
        if (!networkResponse || networkResponse.status !== 200 || req.method !== 'GET') {
          return networkResponse;
        }

        const isArchiveFile = req.url.includes('/insta/') || 
                             req.url.includes('/comeback/') ||
                             ['image', 'video', 'audio'].includes(req.destination);

        if (isArchiveFile) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, responseToCache);
          });
        }

        return networkResponse;
      }).catch(() => {
        // If offline and not in cache, show main page
        if (req.destination === 'document') return caches.match('/index.html');
      });
    })
  );
});
