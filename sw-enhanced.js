// Enhanced Service Worker for AIniseFlow
// Aggressive caching for ultra-fast repeat visits

const CACHE_VERSION = 'ainiseflow-v2.0';
const CACHE_STATIC = `${CACHE_VERSION}-static`;
const CACHE_DYNAMIC = `${CACHE_VERSION}-dynamic`;
const CACHE_IMAGES = `${CACHE_VERSION}-images`;

// Resources to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/AIniseFlow-Logo.webp',
    '/AIniseFlow-Logo.png',
    '/styles-critical.css',
    '/performance-enhanced.js',
    '/manifest.json'
];

// Dynamic cache patterns
const CACHE_PATTERNS = {
    images: /\.(png|jpg|jpeg|webp|svg|gif|ico)$/i,
    styles: /\.(css)$/i,
    scripts: /\.(js)$/i,
    fonts: /\.(woff|woff2|ttf|eot)$/i,
    api: /\/api\//i
};

// Cache strategies
const STRATEGIES = {
    CACHE_FIRST: 'cache-first',
    NETWORK_FIRST: 'network-first', 
    STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

// Install event - cache static assets
self.addEventListener('install', event => {
    console.log('[SW] Installing...');
    
    event.waitUntil(
        caches.open(CACHE_STATIC)
            .then(cache => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('[SW] Static assets cached');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('[SW] Cache installation failed:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('[SW] Activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(cacheName => {
                            return cacheName.startsWith('ainiseflow-') && 
                                   cacheName !== CACHE_STATIC && 
                                   cacheName !== CACHE_DYNAMIC &&
                                   cacheName !== CACHE_IMAGES;
                        })
                        .map(cacheName => {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                console.log('[SW] Old caches cleaned');
                return self.clients.claim();
            })
    );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') return;
    
    // Skip Chrome extension and dev tools
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return;
    
    // Determine cache strategy based on request
    if (isStaticAsset(request)) {
        event.respondWith(handleStaticAsset(request));
    } else if (isImage(request)) {
        event.respondWith(handleImage(request));
    } else if (isStylesheet(request)) {
        event.respondWith(handleStylesheet(request));
    } else if (isScript(request)) {
        event.respondWith(handleScript(request));
    } else if (isFont(request)) {
        event.respondWith(handleFont(request));
    } else if (isAPIRequest(request)) {
        event.respondWith(handleAPI(request));
    } else {
        event.respondWith(handleDefault(request));
    }
});

// Cache strategy implementations
async function handleStaticAsset(request) {
    return cacheFirst(request, CACHE_STATIC);
}

async function handleImage(request) {
    return cacheFirst(request, CACHE_IMAGES, { 
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        maxEntries: 100 
    });
}

async function handleStylesheet(request) {
    return staleWhileRevalidate(request, CACHE_STATIC);
}

async function handleScript(request) {
    return staleWhileRevalidate(request, CACHE_STATIC);
}

async function handleFont(request) {
    return cacheFirst(request, CACHE_STATIC, {
        maxAge: 365 * 24 * 60 * 60 * 1000 // 1 year
    });
}

async function handleAPI(request) {
    return networkFirst(request, CACHE_DYNAMIC, {
        timeout: 3000,
        maxAge: 5 * 60 * 1000 // 5 minutes
    });
}

async function handleDefault(request) {
    return staleWhileRevalidate(request, CACHE_DYNAMIC);
}

// Cache-first strategy
async function cacheFirst(request, cacheName, options = {}) {
    try {
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            // Check if cache is expired
            if (options.maxAge) {
                const cacheDate = new Date(cachedResponse.headers.get('sw-cache-date'));
                if (Date.now() - cacheDate.getTime() > options.maxAge) {
                    // Cache expired, fetch new version
                    return fetchAndCache(request, cache, options);
                }
            }
            return cachedResponse;
        }
        
        return fetchAndCache(request, cache, options);
    } catch (error) {
        console.error('[SW] Cache-first error:', error);
        return fetch(request);
    }
}

// Network-first strategy
async function networkFirst(request, cacheName, options = {}) {
    try {
        const cache = await caches.open(cacheName);
        
        // Try network with timeout
        const networkPromise = fetch(request).then(response => {
            if (response.ok) {
                cache.put(request, response.clone());
            }
            return response;
        });
        
        if (options.timeout) {
            const timeoutPromise = new Promise((resolve, reject) => {
                setTimeout(() => reject(new Error('Network timeout')), options.timeout);
            });
            
            try {
                return await Promise.race([networkPromise, timeoutPromise]);
            } catch (error) {
                // Network failed, try cache
                const cachedResponse = await cache.match(request);
                if (cachedResponse) return cachedResponse;
                throw error;
            }
        }
        
        return await networkPromise;
    } catch (error) {
        console.error('[SW] Network-first error:', error);
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(request);
        if (cachedResponse) return cachedResponse;
        throw error;
    }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request, cacheName) {
    try {
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(request);
        
        // Fetch in background to update cache
        const fetchPromise = fetch(request).then(response => {
            if (response.ok) {
                cache.put(request, response.clone());
            }
            return response;
        }).catch(error => {
            console.warn('[SW] Background fetch failed:', error);
        });
        
        // Return cached version immediately if available
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // If no cache, wait for network
        return await fetchPromise;
    } catch (error) {
        console.error('[SW] Stale-while-revalidate error:', error);
        return fetch(request);
    }
}

// Utility functions
async function fetchAndCache(request, cache, options = {}) {
    try {
        const response = await fetch(request);
        
        if (response.ok) {
            const responseClone = response.clone();
            
            // Add cache timestamp
            const headers = new Headers(responseClone.headers);
            headers.set('sw-cache-date', new Date().toISOString());
            
            const modifiedResponse = new Response(responseClone.body, {
                status: responseClone.status,
                statusText: responseClone.statusText,
                headers: headers
            });
            
            await cache.put(request, modifiedResponse);
            
            // Cleanup old entries if maxEntries specified
            if (options.maxEntries) {
                await cleanupCache(cache, options.maxEntries);
            }
        }
        
        return response;
    } catch (error) {
        console.error('[SW] Fetch and cache error:', error);
        throw error;
    }
}

async function cleanupCache(cache, maxEntries) {
    try {
        const requests = await cache.keys();
        if (requests.length > maxEntries) {
            const entriesToDelete = requests.slice(0, requests.length - maxEntries);
            await Promise.all(entriesToDelete.map(request => cache.delete(request)));
        }
    } catch (error) {
        console.error('[SW] Cache cleanup error:', error);
    }
}

// Request type detection
function isStaticAsset(request) {
    const url = new URL(request.url);
    return STATIC_ASSETS.includes(url.pathname) || url.pathname === '/';
}

function isImage(request) {
    return CACHE_PATTERNS.images.test(request.url);
}

function isStylesheet(request) {
    return CACHE_PATTERNS.styles.test(request.url);
}

function isScript(request) {
    return CACHE_PATTERNS.scripts.test(request.url);
}

function isFont(request) {
    return CACHE_PATTERNS.fonts.test(request.url);
}

function isAPIRequest(request) {
    return CACHE_PATTERNS.api.test(request.url);
}

// Background sync for offline actions
self.addEventListener('sync', event => {
    console.log('[SW] Background sync:', event.tag);
    
    if (event.tag === 'form-submission') {
        event.waitUntil(handleFormSync());
    }
});

async function handleFormSync() {
    // Handle offline form submissions
    try {
        const requests = await getStoredRequests('form-submissions');
        for (const requestData of requests) {
            await fetch(requestData.url, requestData.options);
            await removeStoredRequest('form-submissions', requestData.id);
        }
    } catch (error) {
        console.error('[SW] Form sync error:', error);
    }
}

// Utility functions for background sync
async function getStoredRequests(storeName) {
    // Implementation depends on IndexedDB usage
    return [];
}

async function removeStoredRequest(storeName, id) {
    // Implementation depends on IndexedDB usage
}

console.log('[SW] Enhanced service worker loaded');