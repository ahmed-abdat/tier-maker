# Fix: Drag Layout Shift Bug in TierRow

## Problem
Items in TierRow shift/jump to the right during drag operations, leaving gaps. Similar behavior occurs with keyboard navigation.

## Root Cause
**Strategy Mismatch:** `TierRow.tsx` uses `horizontalListSortingStrategy` with a `flex-wrap` CSS layout.

| Component | Current Strategy | CSS Layout | Issue |
|-----------|-----------------|------------|-------|
| TierRow | `horizontalListSortingStrategy` | `flex-wrap` | Strategy assumes single-line, but items wrap |
| ItemPool | `rectSortingStrategy` | `flex-wrap` | Works correctly |

`horizontalListSortingStrategy` assumes items stay in one horizontal line. When items wrap to new rows in flex-wrap, positions are calculated incorrectly, causing visual jumps.

## Solution

### Step 1: Change TierRow Strategy (PRIMARY FIX)

**File:** `src/features/tier-list/components/TierRow.tsx`

1. Add `rectSortingStrategy` to imports (line ~4):
```tsx
import {
  SortableContext,
  rectSortingStrategy,  // ADD
  useSortable
} from "@dnd-kit/sortable";
```

2. Change strategy in SortableContext (line ~363):
```tsx
// FROM:
<SortableContext items={itemIds} strategy={horizontalListSortingStrategy}>

// TO:
<SortableContext items={itemIds} strategy={rectSortingStrategy}>
```

3. Remove unused `horizontalListSortingStrategy` import

### Step 2: Switch to CSS Grid for Better 2D Support

**File:** `src/features/tier-list/components/TierRow.tsx` (line ~359)

```tsx
// FROM:
className="flex min-h-[5rem] flex-1 flex-wrap content-start items-start gap-2 bg-muted/20 p-2"

// TO:
className="grid grid-cols-[repeat(auto-fill,72px)] min-h-[5rem] flex-1 gap-2 content-start items-start bg-muted/20 p-2"
```

This gives more predictable 2D positioning during drag operations.

### Step 3: (If keyboard nav still has issues) Simplify Keyboard Coordinates

The custom `tierListKeyboardCoordinates.ts` has complex overlap calculations that may not work correctly with wrapped layouts. If issues persist, consider using DND Kit's built-in `sortableKeyboardCoordinates` as fallback.

## Files to Modify
- `src/features/tier-list/components/TierRow.tsx` - Change sorting strategy (required)
- `src/features/tier-list/components/TierRow.tsx` - Optional CSS grid change

## Testing
1. Add 10+ items to a single tier row (force wrapping)
2. Drag items within the row - should not jump/shift
3. Enable keyboard navigation and test arrow key movement
4. Test on different viewport widths

## Why This Works
- `rectSortingStrategy` handles 2D layouts (multi-line wrapping) correctly
- It calculates positions based on both X and Y coordinates, not just X
- ItemPool already uses this strategy and works correctly
