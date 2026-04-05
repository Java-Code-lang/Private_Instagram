/* HARSH ARCHIVE - SMART-FIX ENGINE V3.1 */
const CACHE_NAME = 'harsh-archive-v3.1';

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
  const requestUrl = event.request.url;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // 1. If we already have it in our 317MB vault, use it!
      if (cachedResponse) return cachedResponse;

      // 2. If not in cache, try the network
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const cacheCopy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, cacheCopy);
          });
          return networkResponse;
        }
        
        // 3. CASE-SENSITIVITY HACK: 
        // If "Post 30" fails (404), try "post 30" automatically
        if (networkResponse.status === 404 && requestUrl.includes('Post')) {
           const fallbackUrl = requestUrl.replace('Post', 'post');
           return fetch(fallbackUrl);
        }

        return networkResponse;
      }).catch(() => {
        // 4. OFFLINE SAFETY: Return an empty 200 instead of 503
        // This stops the "NotSupportedError" in the video player
        if (requestUrl.match(/\.(mp4|mp3|jpeg|jpg|png)$/)) {
          return new Response(null, { status: 200, statusText: 'OK' });
        }
      });
    })
  );
});
