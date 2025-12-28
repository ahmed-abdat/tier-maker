# CLAUDE.md

## Project Overview

Tier Maker is a client-side web app for creating and sharing tier-based rankings. Users can:
- Upload images via drag-and-drop or file picker
- Organize items into customizable tiers (S, A, B, C, D, F)
- Add text-only items without images
- Reorder tiers and customize tier names/colors
- Export as PNG image
- Share via URL (compressed) or JSON export
- Undo/redo actions

**Status**: MVP - Fully functional, no backend required. Uses localStorage for persistence.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript (strict mode)
- **State**: Zustand + Zundo (undo/redo) + persist middleware (localStorage with pako compression)
- **DnD**: @dnd-kit/core, @dnd-kit/sortable
- **Styling**: Tailwind CSS + shadcn/ui components
- **Animations**: Framer Motion
- **Export**: html2canvas (PNG)
- **Image Hosting**: imgbb API (for shareable JSON exports)
- **Testing**: Vitest + React Testing Library (unit), Playwright (E2E)

## Commands

```bash
pnpm dev           # Dev server with Turbopack (assume already running)
pnpm build         # Production build
pnpm lint          # ESLint with caching
pnpm lint:fix      # Auto-fix lint issues
pnpm lint:strict   # Zero warnings (CI mode)
pnpm format        # Format with Prettier
pnpm test          # Unit tests (watch mode)
pnpm test:run      # Unit tests once
pnpm test:e2e      # E2E tests (Playwright)
pnpm test:e2e:ui   # E2E tests with UI
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Landing page (/)
│   ├── editor/[id]/        # Tier list editor (/editor/[id])
│   ├── tiers/              # Gallery of saved lists (/tiers)
│   ├── share/              # Shared tier list view (/share)
│   └── api/upload/         # Image upload endpoint
├── features/tier-list/     # Core feature module
│   ├── components/         # UI components
│   ├── hooks/              # useTierListDnd, useShareableExport, useAutoResizeTextarea
│   ├── store/              # Zustand stores (tier-store, drag-store, settings-store)
│   └── utils/              # json-export, json-import
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── layout/             # Header, navigation
│   └── providers/          # Theme provider
└── lib/
    ├── utils.ts            # cn(), getContrastColor()
    └── services/           # imgbb integration
e2e/                        # Playwright E2E tests
```

## Architecture

### Data Flow
```
Images → Base64 compression → Zustand store → localStorage (pako compressed)
Sharing → JSON export with imgbb URLs (shareable mode)
DnD → @dnd-kit → moveItem/reorderItemsInContainer → state update
Export → html2canvas → PNG download
```

### Stores
- **tier-store**: Main state (tierLists, currentListId) + all CRUD actions + undo/redo
- **drag-store**: Lightweight drag UI state (isDragging, draggedItemId)
- **settings-store**: User preferences (keyboard nav, animations)

### Key Types
```typescript
TierItem: { id, name, imageUrl?, description?, createdAt, updatedAt }
TierRow: { id, level, color, items[], name? }
TierList: { id, title, rows[], unassignedItems[], createdAt, updatedAt }
TierLevel: "S" | "A" | "B" | "C" | "D" | "F"
```

## Testing

### Unit Tests (Vitest)
- Location: `*.test.ts` files next to source
- Run: `pnpm test:run`
- Coverage: `pnpm test:coverage`
- Focus on store logic and utility functions

### E2E Tests (Playwright)
- Location: `e2e/` directory
- Run: `pnpm test:e2e` (headless) or `pnpm test:e2e:ui` (with UI)
- Tests: navigation, tier list creation, editor interactions, gallery, persistence
- Install browsers: `pnpm exec playwright install`

## Code Conventions

### File Organization
- Feature-based modules under `src/features/`
- Shared UI components in `src/components/ui/` (shadcn)
- One component per file, named exports

### State Management
- Use granular Zustand selectors (avoid subscribing to full state)
- All tier list mutations go through `tier-store.ts` actions
- Don't create new stores - extend existing ones

### Styling
- Tailwind CSS utility classes
- Use `cn()` from `lib/utils` for conditional classes
- Dark mode via `next-themes` (use `dark:` variants)

### TypeScript
- Strict mode enabled
- Use `import type` for type-only imports
- Prefer `??` over `||` for nullish coalescing

### Exports
- Backup export: Full JSON with base64 images (large, offline use)
- Shareable export: JSON with imgbb URLs (smaller, requires upload)

## Key Patterns

- **DnD**: Uses @dnd-kit with custom `useTierListDnd` hook for multi-container sorting
- **Persistence**: Zustand persist middleware with pako compression (~60-70% size reduction)
- **Undo/Redo**: Zundo middleware with 50-step limit
- **Image handling**: Client-side Base64 compression before storing
