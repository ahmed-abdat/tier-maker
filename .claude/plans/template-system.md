# Template System - Decision Document

## Status: NOT NEEDED FOR MVP

After researching competitors (TierMaker, OpenTierBoy, TierListMakerPro), templates are **not essential** for open sourcing.

## Research Summary

### How Competitors Handle Sharing

| App              | Templates    | Sharing         | Images        |
| ---------------- | ------------ | --------------- | ------------- |
| TierMaker        | Yes (server) | PNG only        | Server-stored |
| OpenTierBoy      | Optional     | URL + lz-string | CDN only      |
| TierListMakerPro | No           | PNG only        | Client-only   |

**Key insight:** Most apps share tier lists as **images (PNG)**, not data.

### Current Export System (Already Implemented)

- JSON export with Base64 images ✅
- 10MB import limit ✅
- Image compression (150x150, 0.7 quality) ✅
- Schema versioning ✅
- Duplicate handling ✅

**This is sufficient for open source MVP.**

## Future Enhancements (Phase 2)

If sharing becomes needed later:

### Option A: Lightweight JSON with Image Hosting

- Upload images to Catbox.moe (permanent, no auth)
- Export smaller JSON with URLs
- On import: Fetch URLs → convert to Base64

### Option B: URL Sharing with Compression

- Encode state in URL using lz-string
- Only works for small lists or template-based lists
- Similar to OpenTierBoy approach

### Option C: Template System

- Local templates in `/public/templates`
- See original plan below for implementation details

---

## Original Template Plan (Deferred)

<details>
<summary>Click to expand original implementation plan</summary>

### Architecture

```
/public/templates/
├── index.json
└── {id}/
    ├── meta.json
    └── images/*.webp
```

### Files to Create

- `src/features/tier-list/types/template.ts`
- `src/features/tier-list/services/template-service.ts`
- `src/features/tier-list/components/TemplateSelectModal.tsx`

### Files to Modify

- `src/features/tier-list/store/tier-store.ts`
- `src/features/tier-list/components/TierListGallery.tsx`

</details>

---

## Decision

**For open source MVP:** No changes needed. Current export system is sufficient.

**Revisit when:** Users request templates or sharing features.
