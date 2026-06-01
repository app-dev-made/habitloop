// HabitLoop Service Worker v2
// Full offline support, background sync, push notifications

const CACHE_NAME = 'habitloop-v2'
const STATIC_CACHE = 'habitloop-static-v2'
const API_CACHE = 'habitloop-api-v2'

const SHELL_URLS = [
  '/',
  '/dashboard',
  '/auth/login',
  '/manifest.json',
  '/offline',
]

// Install — cache shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      return cache.addAll(SHELL_URLS).catch(() => {})
    })
  )
  self.skipWaiting()
})

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME && k !== STATIC_CACHE && k !== API_CACHE)
          .map(k => caches.delete(k))
      )
    )
  )
  self.clients.claim()
})

// Fetch strategy
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET
  if (request.method !== 'GET') return

  // Skip chrome extensions
  if (url.protocol === 'chrome-extension:') return

  // API — network first, fallback to cache
  if (url.pathname.startsWith('/api/') || url.hostname.includes('supabase')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone()
          caches.open(API_CACHE).then(cache => cache.put(request, clone))
          return response
        })
        .catch(() => caches.match(request))
    )
    return
  }

  // Static assets — cache first
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached
      return fetch(request).then(response => {
        if (response.ok) {
          const clone = response.clone()
          caches.open(STATIC_CACHE).then(cache => cache.put(request, clone))
        }
        return response
      }).catch(() => {
        // Offline fallback for navigation
        if (request.mode === 'navigate') {
          return caches.match('/offline') || caches.match('/')
        }
      })
    })
  )
})

// Background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-habit-logs') {
    event.waitUntil(syncPendingLogs())
  }
})

async function syncPendingLogs() {
  // Sync any queued offline logs
  const cache = await caches.open('habitloop-pending')
  const keys = await cache.keys()
  for (const key of keys) {
    const response = await cache.match(key)
    const data = await response.json()
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      await cache.delete(key)
    } catch (e) {}
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {}
  const options = {
    body: data.body ?? 'Time to check your habits.',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-96.png',
    image: data.image,
    vibrate: [100, 50, 100],
    data: { url: data.url ?? '/dashboard', habitId: data.habitId },
    actions: [
      { action: 'done',   title: '✓ Done',     icon: '/icons/icon-48.png' },
      { action: 'snooze', title: '⏱ 1hr',      icon: '/icons/icon-48.png' },
      { action: 'open',   title: '→ Open App', icon: '/icons/icon-48.png' },
    ],
    requireInteraction: false,
    silent: false,
    tag: data.tag ?? 'habitloop-reminder',
    renotify: true,
  }
  event.waitUntil(
    self.registration.showNotification(data.title ?? 'HabitLoop', options)
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const { action, notification } = event
  const url = action === 'done' ? `/api/logs/quick?habitId=${notification.data.habitId}&status=done`
    : notification.data.url ?? '/dashboard'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes('/dashboard') && 'focus' in client) {
          return client.focus()
        }
      }
      return clients.openWindow(url)
    })
  )
})

// Periodic background sync
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'daily-reminder') {
    event.waitUntil(checkAndNotify())
  }
})

async function checkAndNotify() {
  self.registration.showNotification('HabitLoop', {
    body: "Don't forget to log your habits today!",
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-96.png',
    tag: 'daily-reminder',
  })
}
