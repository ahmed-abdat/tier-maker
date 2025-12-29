"use client";

import { useCallback, useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface UsePWAInstallReturn {
  canInstall: boolean;
  isIOS: boolean;
  isIOSSafari: boolean;
  isStandalone: boolean;
  showPrompt: boolean;
  showIOSInstructions: boolean;
  promptInstall: () => Promise<void>;
  dismissPrompt: () => void;
  dismissIOSInstructions: () => void;
  isInstalling: boolean;
}

const STORAGE_KEYS = {
  dismissed: "pwa-install-dismissed",
  dismissCount: "pwa-dismiss-count",
  iosDismissed: "ios-install-dismissed",
  visits: "pwa-visits",
} as const;

/**
 * Get delay period based on dismissal count (exponential backoff)
 */
function getDelayPeriod(dismissCount: number): number {
  if (dismissCount === 0) return 0;
  if (dismissCount === 1) return 24 * 60 * 60 * 1000; // 1 day
  if (dismissCount === 2) return 3 * 24 * 60 * 60 * 1000; // 3 days
  if (dismissCount === 3) return 7 * 24 * 60 * 60 * 1000; // 1 week
  if (dismissCount === 4) return 14 * 24 * 60 * 60 * 1000; // 2 weeks
  return 30 * 24 * 60 * 60 * 1000; // 1 month
}

export function usePWAInstall(): UsePWAInstallReturn {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isIOSSafari, setIsIOSSafari] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Check if app is already installed
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true;
    setIsStandalone(standalone);

    if (standalone) return;

    // Check iOS
    const ua = navigator.userAgent;
    const ios =
      /iPad|iPhone|iPod/.test(ua) &&
      !(window as Window & { MSStream?: unknown }).MSStream;
    const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);

    setIsIOS(ios);
    setIsIOSSafari(ios && isSafari);

    const controller = new AbortController();

    // Handle beforeinstallprompt event (Chrome, Edge, etc.)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      const dismissed = localStorage.getItem(STORAGE_KEYS.dismissed);
      const dismissedTime = dismissed ? parseInt(dismissed, 10) : 0;
      const dismissCount = parseInt(
        localStorage.getItem(STORAGE_KEYS.dismissCount) ?? "0",
        10
      );

      const delayPeriod = getDelayPeriod(dismissCount);

      if (!dismissed || Date.now() - dismissedTime > delayPeriod) {
        const showDelay = dismissCount === 0 ? 3000 : 10000;
        setTimeout(() => {
          setShowPrompt(true);
        }, showDelay);
      }
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setShowPrompt(false);
      setIsStandalone(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt, {
      signal: controller.signal,
    });

    window.addEventListener("appinstalled", handleAppInstalled, {
      signal: controller.signal,
    });

    // iOS Safari: show instructions after a few visits
    if (ios && isSafari) {
      const visits =
        parseInt(localStorage.getItem(STORAGE_KEYS.visits) ?? "0", 10) + 1;
      localStorage.setItem(STORAGE_KEYS.visits, visits.toString());

      if (visits >= 2) {
        const iosDismissed = localStorage.getItem(STORAGE_KEYS.iosDismissed);
        const dismissedTime = iosDismissed ? parseInt(iosDismissed, 10) : 0;
        const threeDays = 3 * 24 * 60 * 60 * 1000;

        if (!iosDismissed || Date.now() - dismissedTime > threeDays) {
          setTimeout(() => {
            setShowIOSInstructions(true);
          }, 5000);
        }
      }
    }

    return () => {
      controller.abort();
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return;

    setIsInstalling(true);
    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome === "accepted") {
        setDeferredPrompt(null);
        setShowPrompt(false);
      } else {
        // User dismissed - track it
        localStorage.setItem(STORAGE_KEYS.dismissed, Date.now().toString());
        const dismissCount = parseInt(
          localStorage.getItem(STORAGE_KEYS.dismissCount) ?? "0",
          10
        );
        localStorage.setItem(
          STORAGE_KEYS.dismissCount,
          (dismissCount + 1).toString()
        );
      }
    } finally {
      setIsInstalling(false);
    }
  }, [deferredPrompt]);

  const dismissPrompt = useCallback(() => {
    setShowPrompt(false);
    const dismissCount = parseInt(
      localStorage.getItem(STORAGE_KEYS.dismissCount) ?? "0",
      10
    );
    localStorage.setItem(STORAGE_KEYS.dismissed, Date.now().toString());
    localStorage.setItem(
      STORAGE_KEYS.dismissCount,
      (dismissCount + 1).toString()
    );
  }, []);

  const dismissIOSInstructions = useCallback(() => {
    setShowIOSInstructions(false);
    localStorage.setItem(STORAGE_KEYS.iosDismissed, Date.now().toString());
  }, []);

  if (!isClient) {
    return {
      canInstall: false,
      isIOS: false,
      isIOSSafari: false,
      isStandalone: false,
      showPrompt: false,
      showIOSInstructions: false,
      promptInstall: async () => {},
      dismissPrompt: () => {},
      dismissIOSInstructions: () => {},
      isInstalling: false,
    };
  }

  return {
    canInstall: !!deferredPrompt,
    isIOS,
    isIOSSafari,
    isStandalone,
    showPrompt: showPrompt && !!deferredPrompt,
    showIOSInstructions: showIOSInstructions && isIOSSafari && !isStandalone,
    promptInstall,
    dismissPrompt,
    dismissIOSInstructions,
    isInstalling,
  };
}
