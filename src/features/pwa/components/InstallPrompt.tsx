"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { usePWAInstall } from "../hooks/usePWAInstall";

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3v11.25"
      />
    </svg>
  );
}

export function InstallPrompt() {
  const {
    isStandalone,
    isIOS,
    isIOSSafari,
    showPrompt,
    showIOSInstructions,
    canInstall,
    promptInstall,
    dismissPrompt,
    dismissIOSInstructions,
    isInstalling,
  } = usePWAInstall();

  if (isStandalone) {
    return null;
  }

  // iOS Safari: manual install instructions
  if (showIOSInstructions && isIOSSafari) {
    return (
      <div
        className={cn(
          "animate-in slide-in-from-bottom fixed right-0 bottom-0 left-0 z-50 duration-300",
          "bg-background/95 supports-backdrop-filter:bg-background/80 border-t backdrop-blur-md"
        )}
      >
        <div className="mx-auto max-w-lg px-4 py-3">
          <div className="flex items-start gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl">
              <Image
                src="/icons/icon-192.png"
                alt="LibreTier"
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold">Install LibreTier</h3>
              <p className="text-muted-foreground text-xs">
                Add to home screen for offline access
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-muted-foreground">Tap</span>
                <span className="bg-muted inline-flex items-center gap-1 rounded px-1.5 py-0.5">
                  <ShareIcon className="h-3.5 w-3.5" />
                </span>
                <span className="text-muted-foreground">then</span>
                <span className="bg-muted inline-flex items-center gap-1 rounded px-1.5 py-0.5">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span>Add to Home</span>
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={dismissIOSInstructions}
              className="h-8 w-8 shrink-0"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // iOS non-Safari: can't install
  if (isIOS && !isIOSSafari) {
    return null;
  }

  // Standard install prompt (Chrome, Edge, etc.)
  if (!showPrompt || !canInstall) {
    return null;
  }

  return (
    <div
      className={cn(
        "animate-in slide-in-from-bottom fixed right-0 bottom-0 left-0 z-50 duration-300",
        "bg-background/95 supports-backdrop-filter:bg-background/80 border-t backdrop-blur-md"
      )}
    >
      <div className="mx-auto max-w-lg px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl">
            <Image
              src="/icons/icon-192.png"
              alt="LibreTier"
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold">Install LibreTier</h3>
            <p className="text-muted-foreground text-xs">
              Quick access & offline support
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={dismissPrompt}
              className="h-8 px-3 text-xs"
            >
              Later
            </Button>
            <Button
              size="sm"
              onClick={() => void promptInstall()}
              disabled={isInstalling}
              className="h-8 px-3 text-xs"
            >
              {isInstalling ? "..." : "Install"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
