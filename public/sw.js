// HabitLoop Service Worker
// Caches the shell so the app loads offline

const CACHE_NAME = 'habitloop-v1'
const SHELL_URLS = [
  '/',
  '/dashboard',
  '/manifest.json',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL_URLS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  // Only cache GET requests
  if (event.request.method !== 'GET') return

  // Network-first for API calls
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() =>
        new Response(JSON.stringify({ error: 'Offline' }), {
          headers: { 'Content-Type': 'application/json' }
        })
      )
    )
    return
  }

  // Cache-first for everything else (shell, fonts, etc.)
  event.respondWith(
    caches.match(event.request).then(cached =>
      cached || fetch(event.request).then(response => {
        const clone = response.clone()
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone))
        return response
      })
    )
  )
})

// Push notification handler
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {}
  event.waitUntil(
    self.registration.showNotification(data.title ?? 'HabitLoop', {
      body:  data.body ?? "Time to check your habits.",
      icon:  '/icon-192.png',
      badge: '/icon-192.png',
      data:  data,
      actions: [
        { action: 'done',   title: '✓ Done' },
        { action: 'snooze', title: '⏱ Snooze 1hr' },
      ],
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  if (event.action === 'done') {
    // Log habit as done directly from notification (future feature)
    return
  }
  event.waitUntil(
    clients.openWindow('/dashboard')
  )
})
