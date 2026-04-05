/* HARSH ARCHIVE - OFFLINE ENGINE V2.5 (AUDIO FIX) */
const CACHE_NAME = 'harsh-archive-v2.5';

const PRE_CACHE = [
  './',
  './index.html',
  './insta/logo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRE_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => (key !== CACHE_NAME ? caches.delete(key) : null))
    ))
  );
});

self.addEventListener('fetch', (event) => {
  // Fix for potential range request issues with audio/video
  const isMedia = event.request.url.match(/\.(mp4|mp3|wav|mov)$/);

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const cacheCopy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, cacheCopy);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // SILENT FAIL: This prevents the red "Rejected" errors in console
          return new Response("Offline mode: Media not cached.", {
            status: 503,
            statusText: "Service Unavailable"
          });
        });
    })
  );
});
