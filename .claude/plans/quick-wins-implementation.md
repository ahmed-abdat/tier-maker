# Quick Wins Implementation Plan

> **Status**: ✅ 4/5 FEATURES COMPLETE (URL Sharing removed)
> **Created**: 2025-12-27
> **Updated**: 2025-12-28
> **Effort**: ~2-3 days total
> **Priority**: High impact, low effort features to differentiate from competitors

## Implementation Status (Verified 2025-12-28)

| Feature         | Status     | Evidence                                                                 |
| --------------- | ---------- | ------------------------------------------------------------------------ |
| Clipboard Paste | ✅ DONE    | `ImageUpload.tsx:213-245`                                                |
| Text-Only Items | ✅ DONE    | `TextItemInput.tsx` integrated                                           |
| PWA Manifest    | ✅ DONE    | `src/app/manifest.ts` + icons                                            |
| Docker Support  | ✅ DONE    | `Dockerfile` + `docker-compose.yml`                                      |
| URL Sharing     | ❌ REMOVED | Removed - images not included causes confusion. Use JSON export instead. |

---

## Already Implemented (Uncommitted)

### ImgBB Shareable Export (on `feature/lightweight-json-export` branch)

**Status**: ✅ IMPLEMENTED (needs commit)

Already have a full shareable export system:

- `ExportShareableButton.tsx` - UI with progress dialog
- `src/lib/services/imgbb.ts` - Upload service with rate limiting
- `src/app/api/upload/route.ts` - API route to proxy ImgBB
- `.env.example` - API key configuration

**How it works**:

1. User clicks "Share" button
2. Images uploaded to ImgBB (500ms delay between uploads)
3. JSON exported with image URLs instead of Base64
4. Much smaller file size for sharing

---

## Decision: Hybrid Sharing Approach

Based on project philosophy ("no account required", "privacy-first", "open source"):

### Strategy

```
┌─────────────────────────────────────────────────────────┐
│                    Share Dialog                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📋 Copy Link (URL Sharing)          ← DEFAULT          │
│     Instant link, no images                             │
│     Works without configuration                         │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  📤 Export with Images (ImgBB)       ← OPTIONAL         │
│     Uploads images to cloud                             │
│     Only visible if API key configured                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Rationale

| Priority     | Feature      | Why                                            |
| ------------ | ------------ | ---------------------------------------------- |
| **Primary**  | URL Sharing  | Zero config, self-host friendly, privacy-first |
| **Optional** | ImgBB Export | Power users who need images, hosted version    |

### Benefits

- **Self-hosters**: `docker run` works out of the box
- **Privacy users**: No 3rd party uploads required
- **Hosted version**: Can pre-configure ImgBB API key
- **Power users**: Can add API key for full features

---

## Overview - Remaining Quick Wins

Four quick wins identified from competitive analysis:

| Feature                    | Effort | Impact | Competitor Gap                               |
| -------------------------- | ------ | ------ | -------------------------------------------- |
| 1. URL Sharing (no images) | Medium | Medium | OpenTierBoy has it, complements ImgBB export |
| 2. Clipboard Paste         | Low    | Medium | Requested in OpenTierBoy #107, #146          |
| 3. Text-Only Items         | Low    | Medium | Reddit complaint about TierMaker             |
| 4. PWA Manifest            | Low    | Medium | None have installable PWA                    |
| 5. Docker Support          | Low    | Medium | Requested in OpenTierBoy #180                |

**Note**: URL sharing (lz-string) is now **complementary** to ImgBB export:

- **ImgBB Export**: Full tier list with images → shareable JSON file
- **URL Sharing**: Tier structure + names only → shareable URL (no file download)

---

## Feature 1: URL Sharing (lz-string compression)

### Goal

Allow users to share tier lists via URL without a backend or file download. State is compressed into the URL itself.

**When to use URL sharing vs ImgBB export**:
| Use Case | URL Sharing | ImgBB Export |
|----------|-------------|--------------|
| Quick share, no images | ✅ Best | Overkill |
| Share with images | ❌ Images excluded | ✅ Best |
| No API key configured | ✅ Works | ❌ Fails |
| Large tier lists (30+ items) | ❌ URL too long | ✅ Works |
| Recipient imports directly | ✅ Auto-import | Manual file import |

### Technical Approach

**Library**: `lz-string` (~5KB gzipped) - same as OpenTierBoy

- Compresses JSON to ~10-20% of original size
- URL-safe encoding via `compressToEncodedURIComponent`

**Limitations**:

- URLs have ~2000 char limit (safe cross-browser)
- Base64 images are too large - must exclude them
- Works best for: tier structure + item names (no images)
- For images: show placeholder or allow re-upload

### Implementation

#### 1.1 Install lz-string

```bash
pnpm add lz-string
pnpm add -D @types/lz-string
```

#### 1.2 Create URL Encoding Utilities

**File**: `src/features/tier-list/utils/url-share.ts`

```typescript
import LZString from "lz-string";
import type { TierList } from "../index";

// Version for future compatibility
const SHARE_VERSION = 1;

// Shareable state - minimal data, no images
interface ShareableState {
  v: number; // version
  t: string; // title
  r: Array<{
    n: string; // name
    c: string; // color (hex without #)
    i: string[]; // item names
  }>;
  u: string[]; // unassigned item names
}

/**
 * Compress tier list to URL-safe string
 * Strips images to keep URL short
 */
export function compressTierListToURL(tierList: TierList): string | null {
  const state: ShareableState = {
    v: SHARE_VERSION,
    t: tierList.title.slice(0, 50), // Truncate for URL
    r: tierList.rows.map((row) => ({
      n: (row.name || row.level).slice(0, 10),
      c: row.color.replace("#", ""),
      i: row.items.map((item) => item.name.slice(0, 30)),
    })),
    u: tierList.unassignedItems.map((item) => item.name.slice(0, 30)),
  };

  const json = JSON.stringify(state);
  const compressed = LZString.compressToEncodedURIComponent(json);

  // Check URL length - reject if too long
  if (compressed.length > 1800) {
    return null; // Too large for safe URL
  }

  return compressed;
}

/**
 * Decompress URL string back to tier list data
 */
export function decompressURLToTierList(
  compressed: string
): Omit<
  TierList,
  "id" | "createdBy" | "isPublic" | "createdAt" | "updatedAt"
> | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(compressed);
    if (!json) return null;

    const state: ShareableState = JSON.parse(json);

    // Version check
    if (state.v !== SHARE_VERSION) return null;

    const now = new Date();
    return {
      title: state.t || "Shared Tier List",
      rows: state.r.map((row, index) => ({
        id: `row-${index}`,
        level: "C" as const, // Default level
        name: row.n,
        color: `#${row.c}`,
        items: row.i.map((name, i) => ({
          id: `item-${index}-${i}`,
          name,
          createdAt: now,
          updatedAt: now,
        })),
      })),
      unassignedItems: state.u.map((name, i) => ({
        id: `unassigned-${i}`,
        name,
        createdAt: now,
        updatedAt: now,
      })),
    };
  } catch {
    return null;
  }
}

/**
 * Generate shareable URL
 */
export function generateShareURL(tierList: TierList): string | null {
  const compressed = compressTierListToURL(tierList);
  if (!compressed) return null;

  // Use current origin for flexibility
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/share?d=${compressed}`;
}

/**
 * Check if a tier list can be shared via URL
 * (not too many items)
 */
export function canShareViaURL(tierList: TierList): boolean {
  const totalItems =
    tierList.rows.reduce((acc, row) => acc + row.items.length, 0) +
    tierList.unassignedItems.length;

  // Rough estimate: ~50 chars per item on average
  return totalItems <= 30 && tierList.rows.length <= 10;
}
```

#### 1.3 Create Share Page

**File**: `src/app/share/page.tsx`

```typescript
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { decompressURLToTierList } from "@/features/tier-list/utils/url-share";
import { useTierStore } from "@/features/tier-list/store";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";
import Link from "next/link";
import { toast } from "sonner";

function SharePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const importList = useTierStore((state) => state.importList);

  useEffect(() => {
    const data = searchParams.get("d");

    if (!data) {
      setStatus("error");
      setErrorMessage("No tier list data found in URL");
      return;
    }

    const tierListData = decompressURLToTierList(data);

    if (!tierListData) {
      setStatus("error");
      setErrorMessage("Invalid or corrupted tier list data");
      return;
    }

    // Import the tier list
    const newId = importList({
      ...tierListData,
      createdBy: "shared",
      isPublic: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    setStatus("success");
    toast.success("Tier list imported!");

    // Redirect to editor
    router.push(`/editor/${newId}`);
  }, [searchParams, importList, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading shared tier list...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
        <Logo size={64} className="opacity-50" />
        <h1 className="text-2xl font-bold">Invalid Share Link</h1>
        <p className="text-center text-muted-foreground">{errorMessage}</p>
        <Button asChild>
          <Link href="/">Go to Home</Link>
        </Button>
      </div>
    );
  }

  return null;
}

export default function SharePage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    }>
      <SharePageContent />
    </Suspense>
  );
}
```

#### 1.4 Create Unified Share Dialog

**File**: `src/features/tier-list/components/ShareDialog.tsx`

This replaces the existing `ExportShareableButton.tsx` with a unified dialog:

```typescript
"use client";

import { useState, useCallback } from "react";
import { Share2, Copy, Check, AlertCircle, Link2, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import type { TierList } from "../index";
import { generateShareURL, canShareViaURL } from "../utils/url-share";
import {
  downloadShareableTierListAsJSON,
  formatFileSize,
  getItemsWithBase64Images,
} from "../utils/json-export";
import { uploadImages, type BatchUploadProgress } from "@/lib/services/imgbb";

interface ShareDialogProps {
  tierList: TierList | null;
  isMobile?: boolean;
}

// Check if ImgBB is configured (API route will fail without key)
const IMGBB_ENABLED = process.env.NEXT_PUBLIC_IMGBB_ENABLED === "true";

export function ShareDialog({ tierList, isMobile = false }: ShareDialogProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareURL, setShareURL] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<BatchUploadProgress | null>(null);

  const canShare = tierList ? canShareViaURL(tierList) : false;
  const hasImages = tierList?.rows.some((row) =>
    row.items.some((item) => item.imageUrl)
  ) || tierList?.unassignedItems.some((item) => item.imageUrl);

  // URL Sharing
  const handleGenerateLink = useCallback(() => {
    if (!tierList) return;
    const url = generateShareURL(tierList);
    setShareURL(url);
  }, [tierList]);

  const handleCopyLink = async () => {
    if (!shareURL) return;
    try {
      await navigator.clipboard.writeText(shareURL);
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  // ImgBB Export
  const handleExportWithImages = useCallback(async () => {
    if (!tierList) return;

    const itemsWithImages = getItemsWithBase64Images(tierList);
    if (itemsWithImages.length === 0) {
      const result = downloadShareableTierListAsJSON(tierList, new Map());
      if (result.success) {
        toast.success(`Exported! (${formatFileSize(result.fileSizeBytes)})`);
      }
      return;
    }

    setIsUploading(true);
    setUploadProgress({ current: 0, total: itemsWithImages.length, completed: [] });

    try {
      const imageUrlMap = await uploadImages(itemsWithImages, setUploadProgress);
      const result = downloadShareableTierListAsJSON(tierList, imageUrlMap);

      if (result.success) {
        const failedCount = itemsWithImages.length - imageUrlMap.size;
        if (failedCount > 0) {
          toast.success(`Exported! ${failedCount} image(s) kept as base64`);
        } else {
          toast.success(`Exported with images! (${formatFileSize(result.fileSizeBytes)})`);
        }
        setOpen(false);
      }
    } catch {
      toast.error("Export failed");
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  }, [tierList]);

  const progressPercent = uploadProgress
    ? Math.round((uploadProgress.current / uploadProgress.total) * 100)
    : 0;

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (o) handleGenerateLink(); }}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              disabled={!tierList}
              className={isMobile ? "h-11 px-4" : "h-10 px-3"}
            >
              <Share2 className="h-4 w-4" />
              <span className={isMobile ? "ml-2" : "ml-2 hidden sm:inline"}>Share</span>
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Share tier list</TooltipContent>
      </Tooltip>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Tier List</DialogTitle>
          <DialogDescription>
            Choose how to share your tier list
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* URL Sharing - Always Available */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Copy Link</span>
              <span className="text-xs text-muted-foreground">(instant, no images)</span>
            </div>

            {!canShare ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Too many items for URL sharing. Use export below.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="flex gap-2">
                <Input value={shareURL || ""} readOnly className="font-mono text-xs" />
                <Button onClick={handleCopyLink} size="icon" variant="outline">
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            )}

            {hasImages && canShare && (
              <p className="text-xs text-muted-foreground">
                Note: Images not included in link. Recipients see text only.
              </p>
            )}
          </div>

          {/* ImgBB Export - Only if configured */}
          {IMGBB_ENABLED && hasImages && (
            <>
              <Separator />

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Export with Images</span>
                  <span className="text-xs text-muted-foreground">(uploads to cloud)</span>
                </div>

                {isUploading ? (
                  <div className="space-y-2">
                    <Progress value={progressPercent} className="h-2" />
                    <p className="text-xs text-center text-muted-foreground">
                      Uploading {uploadProgress?.current}/{uploadProgress?.total} images...
                    </p>
                  </div>
                ) : (
                  <Button
                    onClick={() => void handleExportWithImages()}
                    variant="secondary"
                    className="w-full"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Export JSON with Images
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

**Note**: Add `NEXT_PUBLIC_IMGBB_ENABLED=true` to `.env` when ImgBB API key is configured.

#### 1.5 Integrate Share Dialog

**Modify**: `src/features/tier-list/components/TierListEditor.tsx`

- Replace `ExportShareableButton` import with `ShareDialog`
- Use unified dialog instead of separate buttons

**Modify**: `src/features/tier-list/components/index.ts`

- Export `ShareDialog`

**Modify**: `.env.example`

- Add `NEXT_PUBLIC_IMGBB_ENABLED=true`

### Files Summary

| Action | File                                                                                    |
| ------ | --------------------------------------------------------------------------------------- |
| Create | `src/features/tier-list/utils/url-share.ts`                                             |
| Create | `src/app/share/page.tsx`                                                                |
| Create | `src/features/tier-list/components/ShareDialog.tsx`                                     |
| Delete | `src/features/tier-list/components/ExportShareableButton.tsx` (merged into ShareDialog) |
| Modify | `src/features/tier-list/components/TierListEditor.tsx`                                  |
| Modify | `src/features/tier-list/components/index.ts`                                            |
| Modify | `.env.example`                                                                          |

---

## Feature 2: Clipboard Paste Images

### Goal

Allow users to paste images directly from clipboard (Ctrl+V) instead of only drag-drop/file picker.

### Technical Approach

- Listen for `paste` event on the upload zone or globally in editor
- Use `navigator.clipboard.read()` or `clipboardData` from paste event
- Process clipboard items with `image/*` MIME type
- Reuse existing `processImage` function

### Implementation

#### 2.1 Add Clipboard Handler to ImageUpload

**Modify**: `src/features/tier-list/components/ImageUpload.tsx`

Add to existing component:

```typescript
// Add to imports
import { useEffect, useRef } from "react";

// Inside ImageUpload component, after existing hooks:
const containerRef = useRef<HTMLDivElement>(null);

// Clipboard paste handler
const handlePaste = useCallback(
  async (e: ClipboardEvent) => {
    const currentList = getCurrentList();
    if (!currentList) return;

    const items = e.clipboardData?.items;
    if (!items) return;

    const imageFiles: File[] = [];

    for (const item of Array.from(items)) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          imageFiles.push(file);
        }
      }
    }

    if (imageFiles.length > 0) {
      e.preventDefault();
      await onDrop(imageFiles);
    }
  },
  [getCurrentList, onDrop]
);

// Add paste listener
useEffect(() => {
  const handleGlobalPaste = (e: ClipboardEvent) => {
    // Only handle if not in an input/textarea
    const target = e.target as HTMLElement;
    if (
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.isContentEditable
    ) {
      return;
    }
    handlePaste(e);
  };

  document.addEventListener("paste", handleGlobalPaste);
  return () => document.removeEventListener("paste", handleGlobalPaste);
}, [handlePaste]);
```

Also update the UI hint:

```typescript
// In the render section, update the helper text:
<p className="text-xs text-muted-foreground">
  PNG, JPG, GIF, WebP supported. Paste from clipboard with Ctrl+V
</p>
```

### Files Summary

| Action | File                                                |
| ------ | --------------------------------------------------- |
| Modify | `src/features/tier-list/components/ImageUpload.tsx` |

---

## Feature 3: Text-Only Items

### Goal

Allow adding items without images - just text. Useful for quick brainstorming or when users don't have images.

### Technical Approach

- TierItem already renders text fallback when `imageUrl` is undefined (lines 98-102)
- Need a UI to add text-only items
- Options:
  1. Add "Add Text Item" button next to upload zone
  2. Add input field in ImageUpload component
  3. Quick add dialog

### Implementation

#### 3.1 Create TextItemInput Component

**File**: `src/features/tier-list/components/TextItemInput.tsx`

```typescript
"use client";

import { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTierStore } from "../store";
import { toast } from "sonner";

interface TextItemInputProps {
  className?: string;
}

export function TextItemInput({ className }: TextItemInputProps) {
  const [value, setValue] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const addItem = useTierStore((state) => state.addItem);
  const getCurrentList = useTierStore((state) => state.getCurrentList);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const currentList = getCurrentList();
      if (!currentList) {
        toast.error("Please create a tier list first");
        return;
      }

      const trimmed = value.trim();
      if (!trimmed) {
        toast.error("Please enter a name");
        return;
      }

      if (trimmed.length > 50) {
        toast.error("Name must be 50 characters or less");
        return;
      }

      addItem({ name: trimmed });
      setValue("");
      toast.success(`Added "${trimmed}"`);
    },
    [value, addItem, getCurrentList]
  );

  if (!isExpanded) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsExpanded(true)}
        className={className}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Text Item
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Item name..."
        maxLength={50}
        autoFocus
        onBlur={() => {
          if (!value.trim()) setIsExpanded(false);
        }}
        className="h-9"
      />
      <Button type="submit" size="sm" disabled={!value.trim()}>
        Add
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => {
          setValue("");
          setIsExpanded(false);
        }}
      >
        Cancel
      </Button>
    </form>
  );
}
```

#### 3.2 Integrate into Editor

**Modify**: `src/features/tier-list/components/TierListEditor.tsx`

Add after ImageUpload component:

```typescript
import { TextItemInput } from "./TextItemInput";

// In the render, after <ImageUpload />:
<div className="flex items-center gap-4">
  <div className="h-px flex-1 bg-border" />
  <span className="text-xs text-muted-foreground">or</span>
  <div className="h-px flex-1 bg-border" />
</div>
<TextItemInput />
```

#### 3.3 Export Component

**Modify**: `src/features/tier-list/components/index.ts`

```typescript
export { TextItemInput } from "./TextItemInput";
```

### Files Summary

| Action | File                                                   |
| ------ | ------------------------------------------------------ |
| Create | `src/features/tier-list/components/TextItemInput.tsx`  |
| Modify | `src/features/tier-list/components/TierListEditor.tsx` |
| Modify | `src/features/tier-list/components/index.ts`           |

---

## Feature 4: PWA Manifest

### Goal

Make the app installable as a Progressive Web App for better mobile experience and offline access.

### Technical Approach

- Create `manifest.json` with app metadata
- Add to Next.js metadata in layout
- Add necessary icons in multiple sizes
- Consider basic service worker for offline caching (optional)

### Implementation

#### 4.1 Create Web Manifest

**File**: `public/manifest.json`

```json
{
  "name": "Tier List Maker",
  "short_name": "Tier List",
  "description": "Create beautiful tier lists with drag-and-drop. No account required.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0a",
  "theme_color": "#0a0a0a",
  "orientation": "any",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "categories": ["utilities", "entertainment"],
  "screenshots": [
    {
      "src": "/screenshots/desktop.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    },
    {
      "src": "/screenshots/mobile.png",
      "sizes": "390x844",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ]
}
```

#### 4.2 Create PWA Icons

**Required files** (generate from existing logo):

- `public/icons/icon-192.png` (192x192)
- `public/icons/icon-512.png` (512x512)
- `public/icons/apple-touch-icon.png` (180x180)

Use tool like [PWA Asset Generator](https://github.com/nicholasadamou/pwa-asset-generator) or manually resize.

#### 4.3 Update Layout Metadata

**Modify**: `src/app/layout.tsx`

```typescript
export const metadata: Metadata = {
  metadataBase: new URL("https://tier-maker-nine.vercel.app"),
  title: "Tier List - Create Beautiful Tier Lists",
  description:
    "Rank anything with customizable tier lists. Upload images, drag to organize, and export to share with friends.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tier List",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
  },
  // ... rest of metadata
};
```

#### 4.4 Add Theme Color Meta Tag

**Modify**: `src/app/layout.tsx`

In the `<head />` section, Next.js will automatically add theme-color from manifest, but for dynamic theme support:

```typescript
// In the head, add viewport meta for PWA
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
```

### Files Summary

| Action | File                                |
| ------ | ----------------------------------- |
| Create | `public/manifest.json`              |
| Create | `public/icons/icon-192.png`         |
| Create | `public/icons/icon-512.png`         |
| Create | `public/icons/apple-touch-icon.png` |
| Modify | `src/app/layout.tsx`                |

---

## Feature 5: Docker Support

### Goal

Allow self-hosting via Docker for privacy-conscious users and developers.

### Technical Approach

- Multi-stage Dockerfile for optimized image size
- Use Next.js standalone output mode
- Include `.dockerignore` for faster builds
- Add docker-compose for easy local development

### Implementation

#### 5.1 Enable Standalone Output

**Modify**: `next.config.mjs`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    staleTimes: {
      dynamic: 30 * 60,
      static: 24 * 60 * 60,
    },
  },
};

export default nextConfig;
```

#### 5.2 Create Dockerfile

**File**: `Dockerfile`

```dockerfile
# syntax=docker/dockerfile:1

# ---- Base ----
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ---- Builder ----
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm build

# ---- Runner ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

#### 5.3 Create .dockerignore

**File**: `.dockerignore`

```
# Dependencies
node_modules
.pnpm-store

# Build outputs
.next
out
dist
build

# Dev/test files
.git
.gitignore
*.md
LICENSE
.env*
.eslintcache

# IDE
.vscode
.idea
*.swp
*.swo

# Testing
coverage
e2e
*.spec.ts
*.test.ts
playwright-report
test-results

# Docker
Dockerfile*
docker-compose*
.dockerignore

# Misc
.DS_Store
*.log
```

#### 5.4 Create docker-compose.yml

**File**: `docker-compose.yml`

```yaml
version: "3.8"

services:
  tier-maker:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

#### 5.5 Update README

Add Docker section to README.md:

````markdown
## Docker

### Build and Run

```bash
# Build the image
docker build -t tier-maker .

# Run the container
docker run -p 3000:3000 tier-maker
```
````

### Using Docker Compose

```bash
# Start
docker-compose up -d

# Stop
docker-compose down
```

The app will be available at http://localhost:3000

```

### Files Summary

| Action | File |
|--------|------|
| Modify | `next.config.mjs` (add standalone output) |
| Create | `Dockerfile` |
| Create | `.dockerignore` |
| Create | `docker-compose.yml` |
| Modify | `README.md` (add Docker section) |

---

## Implementation Order

Recommended order based on dependencies and testing:

### Day 1: Foundation
1. **PWA Manifest** (30 min) - No code changes, just assets
2. **Docker Support** (1 hour) - Independent, can test immediately
3. **Clipboard Paste** (1 hour) - Simple addition to existing component

### Day 2: Core Features
4. **Text-Only Items** (1-2 hours) - New component + integration
5. **URL Sharing** (3-4 hours) - Most complex, new route + utilities

### Day 3: Testing & Polish
- Test all features on mobile
- Test Docker build
- Test PWA installation
- Test URL sharing edge cases
- Update documentation

---

## Testing Checklist

### Clipboard Paste
- [ ] Paste image from browser (right-click copy image)
- [ ] Paste screenshot from system clipboard
- [ ] Paste in editor (should work)
- [ ] Paste in title input (should NOT intercept)
- [ ] Paste non-image (should be ignored)

### Text-Only Items
- [ ] Add text item with valid name
- [ ] Reject empty name
- [ ] Respect 50 char limit
- [ ] Items display correctly in tiers
- [ ] Items export/import correctly (JSON)

### URL Sharing
- [ ] Generate URL for small tier list
- [ ] Reject URL for large tier list
- [ ] Copy URL to clipboard
- [ ] Open URL in new browser - imports correctly
- [ ] Handle invalid/corrupted URL gracefully
- [ ] Warning shown when images won't be included

### PWA
- [ ] Manifest loads (check DevTools > Application)
- [ ] Install prompt appears (Chrome)
- [ ] App installs and launches
- [ ] Icons display correctly
- [ ] Works offline (basic navigation)

### Docker
- [ ] `docker build` succeeds
- [ ] `docker run` starts server
- [ ] App accessible at localhost:3000
- [ ] All features work in container
- [ ] Image size is reasonable (<500MB)

---

## Unresolved Questions

1. **URL Sharing UI**: Should URL sharing be a separate button, or integrated into the existing Share button with a dropdown/dialog?
2. **Clipboard paste scope**: Global (anywhere in editor) or only when upload zone is focused?
3. **PWA offline**: Should we add a service worker for full offline support, or just installability?
4. **Docker base image**: Alpine vs Debian - Alpine is smaller but may have compatibility issues?
5. **ImgBB fallback**: What happens when ImgBB API key is not configured? Should we auto-fall back to URL sharing?

---

## Future Enhancements (Out of Scope)

- [ ] QR code for share URLs
- [ ] Service worker for offline caching
- [ ] Image compression before URL sharing
- [ ] Batch text item input
- [ ] Docker ARM64 build for M1/M2 Macs
```
