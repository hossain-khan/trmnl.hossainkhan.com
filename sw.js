/* ==========================================================================
   Service Worker — Image cache for TRMNL plugin screenshots & icons.
   Cache-first for S3-hosted images; network-first for everything else.
   ========================================================================== */

var CACHE_NAME = 'trmnl-img-v1';
var IMAGE_ORIGIN = 'https://trmnl-public.s3.us-east-2.amazonaws.com';

self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  // Purge old cache versions
  event.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(
        names.filter(function (name) {
          return name.startsWith('trmnl-img-') && name !== CACHE_NAME;
        }).map(function (name) {
          return caches.delete(name);
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (event) {
  var url = new URL(event.request.url);

  // Only cache images from the TRMNL S3 bucket
  if (url.origin !== IMAGE_ORIGIN) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.match(event.request).then(function (cached) {
        if (cached) return cached;

        return fetch(event.request).then(function (response) {
          // Only cache successful responses
          if (response.ok) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      });
    })
  );
});
