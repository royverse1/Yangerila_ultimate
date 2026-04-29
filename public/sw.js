const CACHE_NAME = 'yangerila-timeline-v1';
const IMAGE_ROUTE_PATTERN = /assets\/y_scroll\/.*\.jpg/;

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    // Only intercept requests for the timeline JPEG sequence
    if (IMAGE_ROUTE_PATTERN.test(event.request.url)) {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse) {
                    // Return from cache instantly
                    return cachedResponse;
                }

                // If not in cache, fetch from network and cache it for next time
                return fetch(event.request).then((networkResponse) => {
                    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                        return networkResponse;
                    }

                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });

                    return networkResponse;
                });
            })
        );
    }
});