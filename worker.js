const CACHE_NAME = 'harsh-archive-v1';

// 1. Install Event: High-priority files to cache immediately
const CORE_ASSETS = [
  'index.html',
  'content.html',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Force the new version to take over immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        CORE_ASSETS.map(asset => cache.add(asset))
      );
    })
  );
});

// 2. Activate Event: Clean up old cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  self.clients.claim(); // Take control of the page without a manual refresh
});

// 3. Fetch Event: Your smart logic for offline and case-sensitivity
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(async (cachedResponse) => {
      // Return exact match if found
      if (cachedResponse) return cachedResponse;

      const cache = await caches.open(CACHE_NAME);
      
      // Case-Insensitive Search (Fixes "Post" vs "post")
      const keys = await cache.keys();
      const requestUrl = event.request.url.toLowerCase();
      const fuzzyMatch = keys.find(k => k.url.toLowerCase() === requestUrl);
      
      if (fuzzyMatch) {
          console.log('🎯 Fuzzy Match Found:', fuzzyMatch.url);
          return cache.match(fuzzyMatch);
      }

      // If not in cache, try network
      return fetch(event.request).then((networkResponse) => {
        // Auto-cache successful media requests (insta/ or comeback/ folders)
        const isMedia = event.request.url.includes('/insta/') || event.request.url.includes('/comeback/');
        if (networkResponse && networkResponse.status === 200 && isMedia) {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      }).catch(() => {
        // Return custom 404 if truly offline and not cached
        return new Response('Offline: File not found in archive', { 
            status: 404, 
            headers: { 'Content-Type': 'text/plain' } 
        });
      });
    })
  );
});
