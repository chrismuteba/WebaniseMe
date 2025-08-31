// Service Worker for AIniseFlow - Performance Caching
const CACHE_NAME = 'ainiseflow-v1.0';
const urlsToCache = [
  '/',
  '/styles.css',
  '/styles.min.css',
  '/scripts.js',
  '/AIniseFlow-Logo.png',
  '/ai-automation-services.html',
  '/ai-restaurant-solutions.html',
  '/ai-healthcare-solutions.html',
  '/ai-professional-services.html',
  '/ai-retail-solutions.html',
  '/web-design-addon.html',
  '/blog.html',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});