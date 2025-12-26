# JSON Import/Export Implementation Plan

> **Status**: ✅ COMPLETED
> **Effort**: 2-3 days (completed in 1 session)
> **Created**: 2025-12-26
> **Completed**: 2025-12-26

---

## Overview

Add JSON export/import functionality to allow users to:
- Backup tier lists as JSON files
- Transfer tier lists between devices/browsers
- Share editable tier list data (not just images)

---

## Architecture Decision

### Approach: Native Browser APIs + Zod Validation

| Component | Choice | Reason |
|-----------|--------|--------|
| Export | Native Blob API | Already used in ExportButton, 0KB overhead |
| Import | FileReader + react-dropzone | Already have dropzone for images |
| Validation | Zod | Type-safe, good errors, ~12KB |
| Sanitization | Manual (no DOMPurify) | Overkill for text-only fields |

**No new dependencies needed** - Zod is optional (can use manual validation).

---

## Export Schema (v1)

```typescript
interface TierListExport {
  version: 1;
  exportedAt: string; // ISO date
  tierList: {
    title: string;
    description?: string;
    rows: TierRow[];
    unassignedItems: TierItem[];
    createdAt: string; // ISO date
    updatedAt: string; // ISO date
    tags?: string[];
  };
}
```

**Note**: `id`, `createdBy`, `isPublic` excluded - regenerated on import.

---

## Implementation Tasks

### Phase 1: Export (Day 1)

#### 1.1 Create Export Utility

**File**: `src/features/tier-list/utils/json-export.ts`

```typescript
import type { TierList } from "../store/tier-store";

export interface TierListExport {
  version: 1;
  exportedAt: string;
  tierList: Omit<TierList, "id" | "createdBy" | "isPublic">;
}

export function exportTierListToJSON(tierList: TierList): void {
  const exportData: TierListExport = {
    version: 1,
    exportedAt: new Date().toISOString(),
    tierList: {
      title: tierList.title,
      description: tierList.description,
      rows: tierList.rows,
      unassignedItems: tierList.unassignedItems,
      createdAt: tierList.createdAt.toISOString(),
      updatedAt: tierList.updatedAt.toISOString(),
      tags: tierList.tags,
    },
  };

  const json = JSON.stringify(exportData, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const filename = tierList.title
    .replace(/[^a-z0-9]/gi, "-")
    .replace(/-+/g, "-")
    .toLowerCase();

  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.tierlist.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
```

#### 1.2 Add Export JSON Button

**File**: `src/features/tier-list/components/ExportJSONButton.tsx`

- Copy pattern from ExportButton.tsx
- Simpler (no html2canvas, no theme handling)
- Icon: `FileJson` from lucide-react
- Place next to existing Export button in editor toolbar

```typescript
interface ExportJSONButtonProps {
  tierList: TierList | null;
  isMobile?: boolean;
}
```

#### 1.3 Update TierListEditor.tsx

- Import ExportJSONButton
- Add to toolbar next to PNG export button
- Add to FloatingActionBar for mobile

---

### Phase 2: Import Validation (Day 1-2)

#### 2.1 Create Validation Schema

**File**: `src/features/tier-list/utils/json-import.ts`

```typescript
// Manual validation (no Zod dependency)
export interface ImportValidationResult {
  success: boolean;
  data?: TierListExport;
  error?: string;
}

export function validateTierListImport(json: unknown): ImportValidationResult {
  // 1. Check root structure
  if (!json || typeof json !== "object") {
    return { success: false, error: "Invalid JSON structure" };
  }

  const data = json as Record<string, unknown>;

  // 2. Check version
  if (data.version !== 1) {
    return { success: false, error: "Unsupported file version" };
  }

  // 3. Check tierList exists
  if (!data.tierList || typeof data.tierList !== "object") {
    return { success: false, error: "Missing tier list data" };
  }

  const tierList = data.tierList as Record<string, unknown>;

  // 4. Validate required fields
  if (typeof tierList.title !== "string" || !tierList.title.trim()) {
    return { success: false, error: "Missing or invalid title" };
  }

  if (!Array.isArray(tierList.rows)) {
    return { success: false, error: "Missing or invalid rows" };
  }

  if (!Array.isArray(tierList.unassignedItems)) {
    return { success: false, error: "Missing or invalid unassigned items" };
  }

  // 5. Validate rows
  for (const row of tierList.rows) {
    if (!isValidTierRow(row)) {
      return { success: false, error: "Invalid tier row structure" };
    }
  }

  // 6. Validate items
  for (const item of tierList.unassignedItems) {
    if (!isValidTierItem(item)) {
      return { success: false, error: "Invalid item structure" };
    }
  }

  return { success: true, data: json as TierListExport };
}

function isValidTierRow(row: unknown): boolean {
  if (!row || typeof row !== "object") return false;
  const r = row as Record<string, unknown>;

  // Check level is valid
  const validLevels = ["S", "A", "B", "C", "D", "F"];
  if (!validLevels.includes(r.level as string)) return false;

  // Check color is valid hex
  if (typeof r.color !== "string" || !/^#[0-9A-Fa-f]{6}$/.test(r.color)) {
    return false;
  }

  // Check items array
  if (!Array.isArray(r.items)) return false;

  for (const item of r.items) {
    if (!isValidTierItem(item)) return false;
  }

  return true;
}

function isValidTierItem(item: unknown): boolean {
  if (!item || typeof item !== "object") return false;
  const i = item as Record<string, unknown>;

  if (typeof i.name !== "string") return false;
  if (i.imageUrl !== undefined && typeof i.imageUrl !== "string") return false;

  return true;
}
```

#### 2.2 Create Import Function

```typescript
import { v4 as uuidv4 } from "uuid";

export function transformImportToTierList(data: TierListExport): Omit<TierList, "id"> {
  const now = new Date();

  return {
    title: data.tierList.title.slice(0, 200), // Enforce max length
    description: data.tierList.description?.slice(0, 1000),
    rows: data.tierList.rows.map(row => ({
      ...row,
      id: uuidv4(), // New ID to prevent conflicts
      name: row.name?.slice(0, 100),
      items: row.items.map(item => ({
        ...item,
        id: uuidv4(),
        name: item.name.slice(0, 200),
        createdAt: parseDate(item.createdAt),
        updatedAt: now,
      })),
    })),
    unassignedItems: data.tierList.unassignedItems.map(item => ({
      ...item,
      id: uuidv4(),
      name: item.name.slice(0, 200),
      createdAt: parseDate(item.createdAt),
      updatedAt: now,
    })),
    createdBy: "local-user",
    isPublic: false,
    createdAt: parseDate(data.tierList.createdAt) || now,
    updatedAt: now,
    tags: data.tierList.tags?.slice(0, 10),
  };
}

function parseDate(dateStr: unknown): Date {
  if (!dateStr) return new Date();
  const date = new Date(dateStr as string);
  return isNaN(date.getTime()) ? new Date() : date;
}
```

---

### Phase 3: Import UI (Day 2)

#### 3.1 Add Store Action

**File**: `src/features/tier-list/store/tier-store.ts`

```typescript
// Add to TierStore interface
importList: (tierListData: Omit<TierList, "id">) => string;

// Implementation
importList: (tierListData) => {
  const newList: TierList = {
    ...tierListData,
    id: uuidv4(),
  };

  set((state) => ({
    tierLists: [...state.tierLists, newList],
    currentListId: newList.id,
  }));

  return newList.id;
},
```

#### 3.2 Create Import Button Component

**File**: `src/features/tier-list/components/ImportJSONButton.tsx`

```typescript
interface ImportJSONButtonProps {
  onImportSuccess?: (listId: string) => void;
}
```

Features:
- Hidden file input triggered by button click
- Accept only `.json` files
- Max size: 10MB
- Loading state during processing
- Toast feedback (success/error)
- Redirect to editor on success

#### 3.3 Update Gallery Page

**File**: `src/features/tier-list/components/TierListGallery.tsx`

- Add Import button next to "Create New" button
- Same styling pattern

---

### Phase 4: Polish & Edge Cases (Day 2-3)

#### 4.1 File Size Warning

For exports > 1MB, show toast warning:
```typescript
if (blob.size > 1024 * 1024) {
  toast.warning("Large file! Consider removing some images to reduce size.");
}
```

#### 4.2 Duplicate Detection

Before import, check if title already exists:
```typescript
const existingList = tierLists.find(l => l.title === importData.title);
if (existingList) {
  // Append "(Imported)" to title
  importData.title = `${importData.title} (Imported)`;
}
```

#### 4.3 Storage Quota Check

```typescript
// Estimate size before import
const estimatedSize = JSON.stringify(importData).length;
const currentUsage = JSON.stringify(localStorage).length;
const QUOTA_LIMIT = 5 * 1024 * 1024; // 5MB typical

if (currentUsage + estimatedSize > QUOTA_LIMIT * 0.9) {
  toast.warning("Storage almost full. Consider deleting old tier lists.");
}
```

#### 4.4 Keyboard Shortcut (Optional)

- Ctrl+E: Export current list
- Ctrl+I: Open import dialog

---

## File Changes Summary

### New Files
| File | Purpose |
|------|---------|
| `src/features/tier-list/utils/json-export.ts` | Export utility |
| `src/features/tier-list/utils/json-import.ts` | Import + validation |
| `src/features/tier-list/components/ExportJSONButton.tsx` | Export button |
| `src/features/tier-list/components/ImportJSONButton.tsx` | Import button |

### Modified Files
| File | Changes |
|------|---------|
| `tier-store.ts` | Add `importList` action |
| `TierListEditor.tsx` | Add ExportJSONButton to toolbar |
| `TierListGallery.tsx` | Add ImportJSONButton |
| `FloatingActionBar.tsx` | Add mobile export option |
| `index.ts` | Export new components |

---

## Testing Checklist

### Export Tests
- [ ] Export empty tier list (only default rows)
- [ ] Export tier list with items
- [ ] Export tier list with Base64 images
- [ ] Export tier list with custom tier names/colors
- [ ] Verify filename sanitization
- [ ] Verify JSON structure matches schema

### Import Tests
- [ ] Import valid JSON file
- [ ] Reject non-JSON file
- [ ] Reject oversized file (>10MB)
- [ ] Reject invalid JSON syntax
- [ ] Reject missing required fields
- [ ] Reject invalid tier levels
- [ ] Reject invalid hex colors
- [ ] Handle duplicate titles
- [ ] Verify new UUIDs generated
- [ ] Verify dates parsed correctly
- [ ] Verify redirect to editor after import

### E2E Tests
- [ ] Full export → import round trip
- [ ] Export on desktop, import on mobile
- [ ] Import file exported from older version (future-proofing)

---

## UI Mockup

### Editor Toolbar (Desktop)
```
[Title] [Undo] [Redo] | [Export PNG ▼] [Export JSON] | [Settings]
                           └─ Dropdown with PNG/JSON options (alternative)
```

### Gallery Page
```
Your Tier Lists                    [Import JSON] [Create New]
─────────────────────────────────────────────────────────────
[Card] [Card] [Card] ...
```

### Mobile (FloatingActionBar)
```
                    [JSON] [PNG] [Settings]
```

---

## Rollout Plan

1. **Day 1**: Export functionality (1.1 - 1.3)
2. **Day 2**: Import validation + UI (2.1 - 3.3)
3. **Day 3**: Polish, edge cases, testing (4.1 - 4.4)

---

## Future Enhancements (Out of Scope)

- [ ] Export multiple lists at once
- [ ] Import from URL (paste link)
- [ ] Compact export option (without images)
- [ ] Export to clipboard
- [ ] Drag-drop import zone on gallery page
