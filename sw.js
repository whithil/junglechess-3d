const CACHE_NAME = 'jungle-chess-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './title.js',
    './hero.svg',
    './logo.svg',
    'https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/peerjs/1.5.2/peerjs.min.js',
    'https://cdn.jsdelivr.net/npm/opentype.js@1.3.4/dist/opentype.min.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(name => {
                    return name !== CACHE_NAME;
                }).map(name => {
                    return caches.delete(name);
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response; // Cache hit
                }
                return fetch(event.request).then(
                    function (response) {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // IMPORTANT: Clone the response. A response is a stream
                        // and because we want the browser to consume the response
                        // as well as the cache consuming the response, we need
                        // to clone it so we have two streams.
                        var responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(function (cache) {
                                // Ignore caching some third party or specific assets if needed
                                if (event.request.url.startsWith('http')) {
                                    cache.put(event.request, responseToCache);
                                }
                            });

                        return response;
                    }
                );
            })
    );
});
