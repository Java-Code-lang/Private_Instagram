const CACHE_NAME = 'harsh-insta-v7';

// Assets that must be saved immediately on first load
const STATIC_CACHE = [
  '/',
  '/index.html',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// --- INSTALL: Save Core Files ---
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_CACHE))
  );
});

// --- ACTIVATE: Clean Old Cache ---
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

// --- FETCH: Smart Data Management ---
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only handle GET requests
  if (req.method !== 'GET') return;

  // 1. DATA-SAVER STRATEGY: MEDIA & SCRIPTS (Images, Videos, MP3s, CDNs)
  // If it's in the cache, use it. Do NOT go to the network again.
  if (['image', 'video', 'audio', 'script', 'style'].includes(req.destination) || req.url.includes('/insta/')) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) {
          // Found in cache! No download needed.
          return cached; 
        }
        
        // Not in cache, download it ONCE and save it forever
        return fetch(req).then((res) => {
          if (!res || res.status !== 200) return res;
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
          return res;
        }).catch(() => {
            // Offline fallback for media
            return new Response('Media offline', { status: 404 });
        });
      })
    );
    return;
  }

  // 2. FRESHNESS STRATEGY: HTML
  // Try network first so you see code updates, but use cache if offline.
  if (req.destination === 'document') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req) || caches.match('/index.html'))
    );
  }
});
