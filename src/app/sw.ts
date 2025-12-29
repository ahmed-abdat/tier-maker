import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import {
  Serwist,
  StaleWhileRevalidate,
  CacheFirst,
  ExpirationPlugin,
  CacheableResponsePlugin,
} from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const OFFLINE_CACHE = "offline-fallback-v1";
const OFFLINE_URL = "/offline.html";

// Cache offline page during install - this is critical for fallback to work
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(OFFLINE_CACHE);
      await cache.add(new Request(OFFLINE_URL, { cache: "reload" }));
    })()
  );
  // Force activation without waiting
  void self.skipWaiting();
});

// Claim clients immediately on activation
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

const NAVIGATION_CACHE = "navigation-cache-v1";

// CRITICAL: Manual fetch handler for navigation - must be BEFORE serwist.addEventListeners()
// Offline-first: serve from cache, update in background
self.addEventListener("fetch", (event) => {
  // Only handle navigation requests (HTML pages)
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        const cache = await caches.open(NAVIGATION_CACHE);

        // Try to get from cache first (offline-first)
        const cachedResponse = await cache.match(event.request);

        // Fetch from network in background
        const networkPromise = fetch(event.request)
          .then(async (networkResponse) => {
            // Cache the fresh response for next time
            if (networkResponse.ok) {
              await cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => null);

        // If we have a cached response, return it immediately
        if (cachedResponse) {
          // Update cache in background (don't await)
          void networkPromise;
          return cachedResponse;
        }

        // No cache - wait for network with timeout
        try {
          const networkResponse = await Promise.race([
            networkPromise,
            new Promise<null>((resolve) =>
              setTimeout(() => resolve(null), 5000)
            ),
          ]);

          if (networkResponse) {
            return networkResponse;
          }
        } catch {
          // Network failed
        }

        // Network failed - serve offline page
        const offlineCache = await caches.open(OFFLINE_CACHE);
        const offlineResponse = await offlineCache.match(OFFLINE_URL);
        if (offlineResponse) {
          return offlineResponse;
        }

        // Last resort
        return new Response(
          "<!DOCTYPE html><html><head><title>Offline</title></head><body><h1>You are offline</h1><p>Please check your connection.</p></body></html>",
          {
            status: 503,
            headers: { "Content-Type": "text/html" },
          }
        );
      })()
    );
    return;
  }
});

// Serwist configuration for non-navigation requests (assets, API, etc.)
const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: false,
  runtimeCaching: [
    // Handle RSC prefetch requests - StaleWhileRevalidate for instant response
    {
      matcher: ({ request, sameOrigin }) =>
        sameOrigin &&
        request.headers.get("RSC") === "1" &&
        request.headers.get("Next-Router-Prefetch") === "1",
      handler: new StaleWhileRevalidate({
        cacheName: "pages-rsc-prefetch",
        plugins: [
          new CacheableResponsePlugin({ statuses: [0, 200] }),
          new ExpirationPlugin({
            maxEntries: 200,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
          }),
        ],
      }),
    },
    // Handle RSC navigation requests - StaleWhileRevalidate for offline-first
    {
      matcher: ({ request, sameOrigin }) =>
        sameOrigin && request.headers.get("RSC") === "1",
      handler: new StaleWhileRevalidate({
        cacheName: "pages-rsc",
        plugins: [
          new CacheableResponsePlugin({ statuses: [0, 200] }),
          new ExpirationPlugin({
            maxEntries: 200,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
          }),
        ],
      }),
    },
    // Cache static assets (JS, CSS) with CacheFirst for offline-first
    {
      matcher: ({ request, sameOrigin }) =>
        sameOrigin &&
        (request.destination === "script" ||
          request.destination === "style" ||
          request.destination === "font"),
      handler: new CacheFirst({
        cacheName: "static-assets",
        plugins: [
          new CacheableResponsePlugin({ statuses: [0, 200] }),
          new ExpirationPlugin({
            maxEntries: 100,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          }),
        ],
      }),
    },
    // Cache images with StaleWhileRevalidate
    {
      matcher: ({ request, sameOrigin }) =>
        sameOrigin && request.destination === "image",
      handler: new StaleWhileRevalidate({
        cacheName: "images",
        plugins: [
          new CacheableResponsePlugin({ statuses: [0, 200] }),
          new ExpirationPlugin({
            maxEntries: 60,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          }),
        ],
      }),
    },
    ...defaultCache,
  ],
});

serwist.addEventListeners();
