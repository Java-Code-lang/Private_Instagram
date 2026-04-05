/* HARSH ARCHIVE - OFFLINE ENGINE V2.2 */
const CACHE_NAME = 'harsh-archive-v2.2';

// Files to cache immediately
const PRE_CACHE = [
  './',
  './index.html',
  './content.html',
  './insta/logo.png'
];

// Install: Save UI to phone
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRE_CACHE))
  );
  self.skipWaiting();
});

// Activate: Clear old versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null)
    ))
  );
});

// Fetch: Serve from Cache first, then Network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).then(networkResponse => {
        // Cache new images/videos as you browse them
        if (networkResponse && networkResponse.status === 200) {
          const cacheCopy = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, cacheCopy);
          });
        }
        return networkResponse;
      });
    })
  );
});
