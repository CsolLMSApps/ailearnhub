// AILearnHub Service Worker
// Caches static assets and key pages for fast load and basic offline support

const CACHE_NAME = 'ailearnhub-v1';

const STATIC_ASSETS = [
  '/',
  '/courses',
  '/pricing',
  '/about',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

// Install — pre-cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate — clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch — network-first for API/auth, cache-first for static assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Never cache: API routes, auth, admin, Stripe, Supabase
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/auth/') ||
    url.pathname.startsWith('/admin/') ||
    url.pathname.startsWith('/learn/') ||
    url.pathname.startsWith('/dashboard') ||
    url.hostname !== self.location.hostname
  ) {
    event.respondWith(fetch(request));
    return;
  }

  // Cache-first for static assets (images, fonts, icons)
  if (
    request.destination === 'image' ||
    request.destination === 'font' ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.ico')
  ) {
    event.respondWith(
      caches.match(request).then((cached) =>
        cached ||
        fetch(request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
      )
    );
    return;
  }

  // Network-first for pages — fall back to cache if offline
  event.respondWith(
    fetch(request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return response;
      })
      .catch(() => caches.match(request))
  );
});
