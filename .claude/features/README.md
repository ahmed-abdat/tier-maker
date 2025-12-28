# Tier Maker - Feature Ideas & Roadmap

> This folder contains all feature ideas, their validation status, and detailed specs.

## Feature Status Overview

| ID  | Feature                 | Priority | Feasibility         | Status  | Spec                                             |
| --- | ----------------------- | -------- | ------------------- | ------- | ------------------------------------------------ |
| F1  | Undo/Redo System        | HIGH     | ✅ Validated        | ✅ Done | [undo-redo.md](./undo-redo.md)                   |
| F2  | Keyboard Navigation     | HIGH     | ✅ Validated        | ✅ Done | [keyboard-nav.md](./keyboard-nav.md)             |
| F3  | Template System         | HIGH     | ✅ Validated        | Planned | [templates.md](./templates.md)                   |
| F4  | JSON Import/Export      | HIGH     | ✅ Validated        | ✅ Done | [json-import-export.md](./json-import-export.md) |
| F5  | Image Crop/Resize       | LOW      | ⚠️ Needs validation | Backlog | -                                                |
| F6  | Color Presets           | LOW      | ✅ Easy             | Backlog | -                                                |
| F7  | Multiple Export Formats | LOW      | ✅ Easy             | Backlog | -                                                |
| F8  | Storybook Docs          | LOW      | ✅ Easy             | Backlog | -                                                |

---

## High Priority Features (Sprint 1 ✅, Sprint 2-3 Pending)

### F1: Undo/Redo System ✅ COMPLETE

**Problem:** Users accidentally move items and can't undo
**Solution:** Add history tracking with Ctrl+Z / Ctrl+Shift+Z
**Implementation:** zundo v2.3.0, 50-step history, pauses during drag
**[Full Spec →](./undo-redo.md)**

### F2: Keyboard Navigation ✅ COMPLETE

**Problem:** Drag-and-drop is mouse-only, accessibility issue
**Solution:** Custom KeyboardSensor with arrow key navigation
**Implementation:** Space/Enter to grab, arrows to move, help text in footer
**[Full Spec →](./keyboard-nav.md)**

### F3: Template System

**Problem:** Users start from scratch every time
**Solution:** Pre-built templates for popular categories
**Effort:** 3-5 days
**Categories:** Games, Anime, Movies, Music, Food
**[Full Spec →](./templates.md)**

### F4: JSON Import/Export ✅ COMPLETE

**Problem:** Can't transfer tier lists between devices
**Solution:** Export as JSON file, import from file
**Implementation:** Schema v1, full validation, new UUIDs on import
**[Full Spec →](./json-import-export.md)**

---

## Medium Priority Features (Backlog)

### F5: Image Crop/Resize

**Problem:** Users upload images that don't fit well
**Solution:** Add crop/resize before adding to tier list
**Effort:** 3-4 days
**Library:** react-image-crop or similar
**Status:** Deprioritized - users can crop externally

### F6: Custom Tier Color Presets

**Problem:** Limited color customization
**Solution:** Add preset themes (pastel, dark, neon)
**Effort:** 1-2 days
**Status:** Already have color picker + 9 presets

### F7: Multiple Export Formats

**Problem:** Only PNG export available
**Solution:** Add JPEG, WebP options
**Effort:** 1-2 days
**Status:** PNG covers 90% of use cases

### F8: Storybook Documentation

**Problem:** Developers need component docs
**Solution:** Add Storybook for visual component testing
**Effort:** 2-3 days
**Status:** Developer-only, no user impact

---

## Future Ideas (Not Validated)

### URL Sharing (Deferred)

- Share tier lists via URL
- Options: Base64 encoding or backend storage
- Deferred until core features complete

### Real-time Collaboration (Not Planned)

- Edit tier lists together
- Requires backend (Supabase)
- User chose local-only architecture

### Mobile PWA

- Install as mobile app
- Add manifest.json, service worker
- Low effort, good for adoption

### Tier List Gallery

- Browse public tier lists
- Requires backend
- Phase 2 feature

### Text-only Items

- Add items without images
- Just text labels
- Quick addition option

### Duplicate Items

- Copy item to another tier
- Right-click → Duplicate

### Batch Delete

- Select multiple items
- Delete all at once

### Drag-to-reorder Tiers

- Reorder tiers by dragging
- Already implemented! ✅

---

## Competitor Features Comparison

| Feature          | TierMaker | Canva | Us  | Status             |
| ---------------- | --------- | ----- | --- | ------------------ |
| 1M+ Templates    | ✅        | ✅    | ❌  | Planned (F3)       |
| Undo/Redo        | Limited   | ✅    | ✅  | ✅ Done!           |
| JSON Export      | ❌        | ❌    | ✅  | ✅ Done! (Unique!) |
| Real-time Collab | ❌        | ✅    | ❌  | Not planned        |
| Ads              | ✅        | ❌    | ❌  | Never!             |

---

## Our Competitive Advantages

Things we do better than competitors:

1. **100% Free** - No ads, no paywall, no limits
2. **Privacy-first** - All data stays local
3. **No login required** - Zero friction
4. **Open source** - Transparent, customizable
5. **Modern stack** - Fast, responsive, dark mode
6. **Batch upload** - Add multiple images at once

---

## Implementation Order

### Sprint 1: Core UX ✅ COMPLETE

1. ~~F1: Undo/Redo~~ ✅ Done
2. ~~F2: Keyboard Navigation~~ ✅ Done

### Sprint 2: Data Portability ✅ COMPLETE

3. ~~F4: JSON Import/Export~~ ✅ Done

### Sprint 3: Quick Start

4. F3: Templates (5 starter templates)

### Backlog

- F5-F8 as time permits
- Future ideas based on user feedback
