// Track Taka service worker — offline app shell.
//
// Hand-written on purpose: the app is a static prerender with all data in
// IndexedDB (RxDB), so there is no API to sync — only pages and assets to
// cache. Strategies:
//
//   navigations            network-first  → shell cache → /offline.html
//   /_next/static/**       cache-first    (content-hashed, immutable)
//   RSC payloads           network-first  → runtime cache (client-side
//   (RSC header)                            navigation works offline)
//   other same-origin GET  network-first  → runtime cache (images, screenshots)
//   non-GET / cross-origin never intercepted
//
// Bump VERSION whenever the precache list or the strategies change; it
// invalidates every cache on activate.

const VERSION = "v1"
const SHELL_CACHE = `track-taka-shell-${VERSION}`
const STATIC_CACHE = `track-taka-static-${VERSION}`
const RUNTIME_CACHE = `track-taka-runtime-${VERSION}`
const KNOWN_CACHES = [SHELL_CACHE, STATIC_CACHE, RUNTIME_CACHE]

const PRECACHE_URLS = ["/", "/dashboard", "/offline.html", "/manifest.webmanifest", "/icon.svg"]

const STATIC_LIMIT = 300
const RUNTIME_LIMIT = 120
/** Move on to the cached shell if the network is this slow (ms). */
const NAV_TIMEOUT = 7500

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      // The old shell keeps serving until the new worker activates, so a
      // failed precache must not take the current app down.
      .catch(() => undefined)
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Fetch the navigation in parallel while the worker starts up.
      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable().catch(() => undefined)
      }
      const names = await caches.keys()
      await Promise.all(
        names.filter((name) => name.startsWith("track-taka-") && !KNOWN_CACHES.includes(name)).map((name) => caches.delete(name))
      )
      await self.clients.claim()
    })()
  )
})

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting()
})

self.addEventListener("fetch", (event) => {
  const { request } = event
  if (request.method !== "GET") return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(event))
    return
  }

  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request, STATIC_CACHE, STATIC_LIMIT))
    return
  }

  // Full RSC payloads carry RSC: 1 without the prefetch marker; prefetch
  // responses are partial and must not be stored for real navigations.
  const isPrefetch = request.headers.get("Next-Router-Prefetch") === "1"
  const isRscNavigation = request.headers.get("RSC") === "1" && !isPrefetch
  if (isRscNavigation) {
    event.respondWith(networkFirst(request, RUNTIME_CACHE, RUNTIME_LIMIT))
    return
  }

  if (!isPrefetch && !url.searchParams.has("_rsc")) {
    event.respondWith(networkFirst(request, RUNTIME_CACHE, RUNTIME_LIMIT))
  }
})

/** Pages: fresh when online, the last-seen copy when offline, a branded
 * fallback when the page was never visited. */
async function handleNavigation(event) {
  const { request } = event
  try {
    const preloaded = await event.preloadResponse
    const response = await raceTimeout(preloaded || fetch(request), NAV_TIMEOUT)
    if (response.ok && response.type === "basic") {
      putCached(SHELL_CACHE, request, response.clone())
    }
    return response
  } catch {
    const cache = await caches.open(SHELL_CACHE)
    return (
      (await cache.match(request)) ||
      (await cache.match(stripSearch(request))) ||
      (await cache.match("/offline.html")) ||
      Response.error()
    )
  }
}

/** Immutable hashed assets: hit the cache, then the network once. */
async function cacheFirst(request, cacheName, limit) {
  const cached = await caches.match(request)
  if (cached) return cached
  const response = await fetch(request)
  if (response.ok && response.type === "basic") {
    putCached(cacheName, request, response.clone(), limit)
  }
  return response
}

/** Freshness first, cache as the offline fallback. */
async function networkFirst(request, cacheName, limit) {
  try {
    const response = await raceTimeout(fetch(request), NAV_TIMEOUT)
    if (response.ok && response.type === "basic") {
      putCached(cacheName, request, response.clone(), limit)
    }
    return response
  } catch {
    return (await caches.match(request)) || Response.error()
  }
}

/** Fire and forget: store, then keep the cache bounded. */
function putCached(cacheName, request, response, limit) {
  void caches
    .open(cacheName)
    .then((cache) => cache.put(request, response))
    .then(() => trimCache(cacheName, limit))
}

async function trimCache(cacheName, limit) {
  const cache = await caches.open(cacheName)
  const keys = await cache.keys()
  // keys() is in insertion order, so the oldest entries go first.
  await Promise.all(keys.slice(0, Math.max(0, keys.length - limit)).map((key) => cache.delete(key)))
}

/** Resolve with the fetch result, or reject after `ms` so the caller can
 * fall back to the cache. The fetch itself keeps running and still fills
 * the cache. */
function raceTimeout(fetchPromise, ms) {
  let fetchResult = fetchPromise
  // preloadResponse and fetch() can reject before anyone awaits the race.
  if (fetchResult && typeof fetchResult.catch === "function") {
    fetchResult = fetchPromise.catch(() => {
      throw new Error("request failed")
    })
  }
  return Promise.race([
    fetchResult,
    new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
  ])
}

function stripSearch(request) {
  const url = new URL(request.url)
  url.search = ""
  return new Request(url, { method: "GET" })
}
