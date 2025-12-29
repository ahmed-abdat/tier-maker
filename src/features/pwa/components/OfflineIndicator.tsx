"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { WifiOff, Wifi } from "lucide-react";
import { useNetworkStatus } from "../hooks/useNetworkStatus";

/**
 * Shows toast notifications when network status changes
 * Tier lists are saved locally, so offline mode is fully functional
 */
export function OfflineIndicator() {
  const { isOnline, isOffline } = useNetworkStatus();
  const previousStatus = useRef<boolean | null>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    // Skip initial render to avoid toast on page load
    if (!isInitialized.current) {
      isInitialized.current = true;
      previousStatus.current = isOnline;
      return;
    }

    // Only show toast if status actually changed
    if (previousStatus.current === isOnline) {
      return;
    }

    const wasOffline = previousStatus.current === false;
    previousStatus.current = isOnline;

    if (isOffline) {
      toast.warning("You're offline", {
        description: "Your tier lists are saved locally and still accessible.",
        icon: <WifiOff className="h-5 w-5" />,
        duration: 4000,
        id: "offline-indicator",
      });
    } else if (wasOffline) {
      toast.dismiss("offline-indicator");

      toast.success("Back online", {
        icon: <Wifi className="h-5 w-5" />,
        duration: 2000,
        id: "online-indicator",
      });
    }
  }, [isOnline, isOffline]);

  return null;
}
