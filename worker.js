const CACHE_NAME = 'harsh-archive-v1';

// 1. Updated Core Assets with full paths
const CORE_ASSETS = [
  './', 
  'index.html',
  'content.html',
  'worker.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.tailwindcss.com'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log('📥 Pre-caching Core Assets...');
      for (const url of CORE_ASSETS) {
        try {
          // Use 'no-cors' for external CDNs (Tailwind/FontAwesome) to avoid errors
          const request = url.startsWith('http') 
            ? new Request(url, { mode: 'no-cors' }) 
            : new Request(url);
          await cache.add(request);
        } catch (err) {
          console.warn(`Failed to cache: ${url}`, err);
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
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(async (cachedResponse) => {
      // 1. If found exactly, return it
      if (cachedResponse) return cachedResponse;

      const cache = await caches.open(CACHE_NAME);
      
      // 2. Case-Insensitive Search (Fixes "Post" vs "post")
      const keys = await cache.keys();
      const requestUrl = event.request.url.toLowerCase();
      const fuzzyMatch = keys.find(k => k.url.toLowerCase() === requestUrl);
      
      if (fuzzyMatch) {
          console.log('🎯 Fuzzy Match Found:', fuzzyMatch.url);
          return cache.match(fuzzyMatch);
      }

      // 3. Try Network
      return fetch(event.request).then((networkResponse) => {
        // Auto-cache successful media requests (insta/ or comeback/ folders)
        const isMedia = event.request.url.includes('/insta/') || 
                        event.request.url.includes('/comeback/') ||
                        event.request.url.includes('.mp4');

        if (networkResponse && networkResponse.status === 200 && isMedia) {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      }).catch(() => {
        // 4. Truly offline fallback
        // Only show the "File not found" message for media, not the main page
        if (event.request.mode === 'navigate') {
          return caches.match('index.html');
        }
        return new Response('Offline: File not found in archive', { 
            status: 404, 
            headers: { 'Content-Type': 'text/plain' } 
        });
      });
    })
  );
});
