const CACHE_NAME = 'harsh-archive-v1';

// Improved Core Assets with both relative and absolute paths
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
          // IMPORTANT: Removed 'no-cors' for internal files like index/content 
          // to ensure they are fully saved. CDNs keep 'no-cors'.
          const isExternal = url.startsWith('http');
          const request = new Request(url, isExternal ? { mode: 'no-cors' } : {});
          
          const response = await fetch(request);
          if (response.ok || isExternal) {
            await cache.put(request, response);
            console.log(`✅ Cached successfully: ${url}`);
          }
        } catch (err) {
          console.warn(`⚠️ Failed to cache: ${url}`, err);
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
      
      // 2. Case-Insensitive Search (The "Fuzzy Match" logic you love)
      const keys = await cache.keys();
      const requestUrl = event.request.url.toLowerCase();
      const fuzzyMatch = keys.find(k => k.url.toLowerCase() === requestUrl);
      
      if (fuzzyMatch) {
          console.log('🎯 Fuzzy Match Found:', fuzzyMatch.url);
          return cache.match(fuzzyMatch);
      }

      // 3. Try Network
      return fetch(event.request).then((networkResponse) => {
        const isMedia = event.request.url.includes('/insta/') || 
                        event.request.url.includes('/comeback/') ||
                        event.request.url.includes('.mp4') ||
                        event.request.url.includes('.mp3'); // Added mp3 for diet music

        if (networkResponse && networkResponse.status === 200 && isMedia) {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      }).catch(() => {
        // 4. Truly offline fallback
        if (event.request.mode === 'navigate') {
          // If the user tries to go to content.html offline, we serve it from cache
          return caches.match('content.html') || caches.match('index.html');
        }
        return new Response('Offline: Media not in archive', { 
            status: 404, 
            headers: { 'Content-Type': 'text/plain' } 
        });
      });
    })
  );
});
