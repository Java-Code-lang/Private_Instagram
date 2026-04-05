/* HARSH ARCHIVE - NATIVE ENGINE V2.0 */
const CACHE_NAME = 'harsh-archive-cache-v2';

// Core UI files to cache immediately on install
const PRE_CACHE_RESOURCES = [
  './',
  './index.html',
  './content.html',
  './insta/logo.png'
];

// 1. Installation: Save the core UI to the phone
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRE_CACHE_RESOURCES);
    })
  );
  self.skipWaiting();
});

// 2. Activation: Clean up old versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// 3. Fetch Strategy: "Cache First, then Network"
// This ensures that if a file (image/video) is in the cache, it uses 0% data.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // Return from phone memory
      }

      return fetch(event.request).then((networkResponse) => {
        // If it's a valid asset (image, video, script), save it for next time
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      });
    })
  );
});
