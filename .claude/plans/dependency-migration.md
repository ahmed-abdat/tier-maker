# Tier Maker - Dependency Migration Plan

**STATUS: ✅ COMPLETED**

## Overview

**Scope:** Moderate updates - Next.js 16, skip Tailwind 4, remove unused deps, consolidate Radix UI.
**Created:** 2025-12-07
**Completed:** 2025-12-26

---

## Phase 1: Remove Unused Dependencies ✅

Already completed in prior session - zod, react-hook-form, @hookform/resolvers were removed.

---

## Phase 2: Update Next.js to v16 ✅

Already on Next.js 16.0.10, React 19.2.1.

---

## Phase 3: Consolidate Radix UI ✅

### Changes Made

- Installed unified `radix-ui` package (1.4.3)
- Removed 19 individual `@radix-ui/react-*` packages
- Updated 21 UI component imports
- Fixed `Slot` usage → `Slot.Root` for button and breadcrumb

**Import pattern:**

```typescript
// Before
import * as DialogPrimitive from "@radix-ui/react-dialog";

// After
import { Dialog as DialogPrimitive } from "radix-ui";
```

---

## Phase 4: Update Other Dependencies ✅

Most already updated in prior work. Current versions:

- date-fns: 4.1.0
- sonner: 2.0.7
- zustand: 5.0.9
- lucide-react: 0.556.0
- uuid: 13.0.0

**NOT upgraded:**

- tailwind-merge stays at 2.6.0 (v3 requires Tailwind CSS v4)

---

## Phase 5: Post-Update Fixes ✅

No fixes needed - Sonner v2 API compatible, tailwind-merge v2 kept.

---

## Phase 6: Verification ✅

- [x] Lint passes (warnings only)
- [x] Build passes
- [x] Unit tests pass (26/26)

---

## Summary

| Before                | After              | Savings        |
| --------------------- | ------------------ | -------------- |
| 19 @radix-ui packages | 1 radix-ui package | -18 deps       |
| ~740 packages total   | ~720 packages      | tree-shakeable |

---

## Not In Scope (Future)

- **Tailwind CSS 4** - Wait for stable shadcn/ui support
- **tailwind-merge v3** - Requires Tailwind v4
