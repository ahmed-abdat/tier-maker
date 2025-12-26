# Fix: Drag Layout Shift Bug in TierRow

**STATUS: ✅ COMPLETED**

## Problem
Items in TierRow shift/jump to the right during drag operations, leaving gaps.

## Root Cause
Strategy mismatch: `horizontalListSortingStrategy` with `flex-wrap` layout.

## Solution Applied

### Step 1: Changed Strategy ✅
- TierRow now uses `rectSortingStrategy` (matches ItemPool)
- Handles 2D wrapped layouts correctly

### Step 2: CSS Grid Layout ✅
- Changed from `flex flex-wrap` to CSS Grid
- `grid grid-cols-[repeat(auto-fill,72px)]`
- More predictable positioning during drag

## Commits
- `fa58aa6` fix: use rectSortingStrategy and CSS Grid to prevent drag layout shifts
- `0428579` fix: show drag overlay even when animations disabled
