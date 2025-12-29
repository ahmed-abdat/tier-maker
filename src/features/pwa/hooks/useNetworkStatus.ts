"use client";

import { useState, useEffect, useCallback } from "react";

interface NetworkStatus {
  isOnline: boolean;
  isOffline: boolean;
}

/**
 * Hook to track online/offline network status in real-time
 */
export function useNetworkStatus(): NetworkStatus {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      return navigator.onLine;
    }
    return true;
  });

  const handleOnline = useCallback(() => {
    setIsOnline(true);
  }, []);

  const handleOffline = useCallback(() => {
    setIsOnline(false);
  }, []);

  useEffect(() => {
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [handleOnline, handleOffline]);

  return {
    isOnline,
    isOffline: !isOnline,
  };
}

/**
 * Check if an error is likely due to being offline
 */
export function isNetworkError(error: Error | null | undefined): boolean {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return true;
  }

  if (!error?.message) {
    return false;
  }

  const networkErrorPatterns = [
    "Failed to fetch",
    "NetworkError",
    "Network request failed",
    "Load failed",
    "fetch failed",
    "net::ERR_",
    "TypeError: Failed to fetch",
    "ChunkLoadError",
  ];

  return networkErrorPatterns.some((pattern) =>
    error.message.toLowerCase().includes(pattern.toLowerCase())
  );
}

/**
 * Check if the browser is currently offline (SSR-safe)
 */
export function isBrowserOffline(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }
  return !navigator.onLine;
}
