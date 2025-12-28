import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import {
  Serwist,
  NetworkFirst,
  StaleWhileRevalidate,
  ExpirationPlugin,
} from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

// URLs to cache during service worker install
const CRITICAL_URLS = ["/offline.html", "/", "/tiers"] as const;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  // Disable navigationPreload - it can interfere with offline fallbacks
  navigationPreload: false,
  runtimeCaching: [
    // Handle RSC prefetch requests (Next.js App Router)
    {
      matcher: ({ request, sameOrigin }) =>
        sameOrigin &&
        request.headers.get("RSC") === "1" &&
        request.headers.get("Next-Router-Prefetch") === "1",
      handler: new StaleWhileRevalidate({
        cacheName: "pages-rsc-prefetch",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 200,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          }),
        ],
      }),
    },
    // Handle RSC navigation requests
    {
      matcher: ({ request, sameOrigin }) =>
        sameOrigin && request.headers.get("RSC") === "1",
      handler: new NetworkFirst({
        cacheName: "pages-rsc",
        networkTimeoutSeconds: 10, // 10 seconds for mobile networks
        plugins: [
          new ExpirationPlugin({
            maxEntries: 200,
            maxAgeSeconds: 24 * 60 * 60,
          }),
        ],
      }),
    },
    // Handle document navigation requests
    {
      matcher: ({ request }) => request.mode === "navigate",
      handler: new NetworkFirst({
        cacheName: "pages-cache",
        networkTimeoutSeconds: 10, // 10 seconds for slow mobile networks
        plugins: [
          new ExpirationPlugin({
            maxEntries: 50,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          }),
        ],
      }),
    },
    ...defaultCache,
  ],
  fallbacks: {
    entries: [
      {
        // Use static HTML for most reliable offline fallback
        url: "/offline.html",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

// Manually cache critical pages during install for guaranteed offline access
self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all(
      CRITICAL_URLS.map(async (url) => {
        try {
          const response = await fetch(url);
          if (response.ok) {
            const cache = await caches.open("pages-cache");
            await cache.put(url, response);
          }
        } catch {
          // Silently fail - precache manifest will handle this
        }
      })
    )
  );
});

serwist.addEventListeners();
