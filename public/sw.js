// Service Worker required for PWA functionality
const CACHE_NAME = 'promptme-cache-v1';
const urlsToCache = [
  '/manifest.webmanifest',
  '/admin-manifest.json',
  '/icon.svg',
  '/wtf-logo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  // Respond with cached items if matched, otherwise fetch from network
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
