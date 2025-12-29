# LiberTier Logo Design Brief

## 1. Project Overview

**App Name:** LiberTier (one word, capital L and T)

**What It Is:** A free, open-source tier list maker web application. Users create visual rankings (tier lists) by uploading images and dragging them into tiers labeled S, A, B, C, D, F.

**Tagline:** "Free Tier List Maker - No Login Required"

**Core Value Proposition:**

- 100% free, no ads, no watermarks
- No account/login required - works instantly
- Privacy-first: all data stays in user's browser (localStorage)
- Works offline as a PWA (Progressive Web App)
- Open source (MIT license)

## 2. Target Audience

**Primary:** Gamers, anime fans, pop culture enthusiasts (ages 16-35)

- Creating tier lists for video games, anime characters, movies, music
- Sharing rankings on social media (Twitter, Reddit, Discord)

**Secondary:** Content creators, streamers, educators

- Making engaging ranking content
- Quick visual comparisons for videos/streams

**Tertiary:** General internet users

- Anyone who wants to rank things visually
- People frustrated with TierMaker's login requirements and ads

## 3. Brand Philosophy & Values

**"Liber" = Latin for "Free"**

The name represents:

1. **Freedom from accounts** - No login walls, no Twitter permissions
2. **Freedom from tracking** - No analytics, no data collection
3. **Freedom from ads** - Clean, distraction-free experience
4. **Freedom to own your data** - Export/backup everything
5. **Open source freedom** - Transparent, community-driven

**Brand Personality:**

- Modern & clean (not cluttered or childish)
- Trustworthy & private (not corporate/big-tech)
- Playful but professional (fun tool, serious quality)
- Empowering (you control your data)

## 4. Competitor Comparison

**TierMaker (main competitor):**

- Requires Twitter login with invasive permissions
- Has ads and watermarks
- Generic, dated design
- Logo: Simple text "TierMaker" with tier blocks

**How LiberTier Differentiates:**

- No login, no tracking, no ads
- Modern PWA that works offline
- 50-step undo/redo (unique feature)
- Text-only items (no image required)
- Cleaner, more premium feel

## 5. Current Visual Identity

**Current Colors (tier levels):**

- S Tier: #FF7F7F (coral red)
- A Tier: #FFBF7F (orange)
- B Tier: #FFFF7F (yellow)
- C Tier: #7FFF7F (green)
- D Tier: #7FBFFF (light blue)
- F Tier: #FF7FFF (pink/magenta)

**App Theme:**

- Dark mode: #0a0a0a background (near black)
- Light mode: #ffffff background
- Primary accent: Coral/red (#FF7F7F or similar)
- Secondary: Navy blue (#1e3a5f)

**Typography:** Clean sans-serif (Roboto family)

## 6. Logo Requirements

### Must Have:

- Works as favicon (16x16, 32x32) - must be recognizable
- Works as PWA app icon (192x192, 512x512)
- Works on dark AND light backgrounds
- No text in the icon itself (text "LiberTier" appears separately)
- Distinctive - instantly different from TierMaker
- Modern, clean, minimal

### Should Communicate:

- Freedom/liberation concept
- Ranking/tiers concept
- Premium quality (not cheap/generic)
- Trust/privacy

### Should NOT Be:

- Generic tier blocks only (too similar to competitors)
- Overly complex (won't scale to small sizes)
- Childish/cartoonish
- Corporate/cold

## 7. Concept Directions to Explore

### Direction A: Liberation Symbol

- Bird/wings breaking free from tier grid
- Phoenix rising through tier levels
- Open padlock with tier elements
- Chains breaking with tier integration

### Direction B: Ascending Motion

- Arrow rising through horizontal tier lines
- Flame/torch with tier structure
- Staircase ascending upward
- Crown at top of tier pyramid

### Direction C: Minimalist Monogram

- "LT" lettermark with tier integration
- "L" formed by vertical tier rows
- Negative space creating tier structure
- Geometric, modern letterform

### Direction D: Abstract Freedom + Tiers

- Horizontal lines (tiers) with one element breaking free
- Circle/sphere escaping a grid
- Flowing lines suggesting both ranking and liberation
- Balance between structure (tiers) and freedom (breaking out)

## 8. Color Palette Recommendations

**Option 1: Current Palette (Safe)**

- Primary: #FF7F7F (coral red - matches S tier)
- Secondary: #1e3a5f (navy blue)
- Accent: Gradient from coral to navy

**Option 2: Premium Modern**

- Primary: #6366F1 (indigo/purple)
- Secondary: #F59E0B (amber/gold)
- Represents: Royalty + achievement

**Option 3: Fresh & Clean**

- Primary: #14B8A6 (teal)
- Secondary: #F97316 (coral orange)
- Represents: Modern, trustworthy

**Option 4: Bold Statement**

- Primary: #EF4444 (vibrant red)
- Secondary: #1F2937 (dark slate)
- Represents: Passion, power, ranking

## 9. Technical Specifications

**Deliverables Needed:**

1. Icon only (no text) - SVG source
2. PNG 512x512 (transparent background)
3. PNG 192x192 (transparent background)
4. PNG 40x40 (for header use)
5. ICO 32x32 (favicon)

**Format Requirements:**

- Simple enough to work at 16x16 pixels
- No gradients that break at small sizes (or use simple 2-color gradients)
- Clear silhouette/shape recognition
- Works in monochrome (for loading states)

## 10. Example Prompts for AI Tool

### Prompt 1: Freedom + Tiers

```
Design a minimalist logo icon for "LiberTier", a free tier list maker app.
The logo should combine freedom/liberation symbolism with tier ranking concept.
Show a bird or wings formed by ascending horizontal tier blocks.
Colors: coral red (#FF7F7F) and navy blue (#1e3a5f).
Style: Modern, clean, flat design with subtle depth.
Must work as a small favicon. No text in the icon.
```

### Prompt 2: Monogram

```
Design a modern "LT" monogram logo for "LiberTier" app.
The letter L should be formed by stacked horizontal lines representing tier rows.
The letter T should integrate as a structural element.
Style: Geometric, minimal, tech startup aesthetic.
Colors: Coral red gradient to navy blue.
Should work at very small sizes (16x16 pixels).
```

### Prompt 3: Abstract Rising

```
Create an abstract logo icon for a tier list ranking app called "LiberTier".
Show upward movement/ascension through horizontal tier levels.
One element should "break free" from the structured tiers - representing freedom.
Style: Minimal, modern, clean lines.
Color palette: Red/coral as primary, dark blue as secondary.
Must be recognizable as a small app icon.
```

### Prompt 4: Premium Tier Crown

```
Design a crown or achievement symbol logo for "LiberTier" tier list maker.
Integrate horizontal tier lines into the crown design.
Represents: ranking achievement + freedom (open source).
Style: Modern, elegant, not childish.
Colors: Gold/amber accent with dark slate base.
Simple enough for 32x32 favicon.
```

---

## Files to Update After New Logo

### Assets to Replace:

- `public/tier_list_logo.png` - main logo
- `public/icons/icon-192.png` - PWA icon
- `public/icons/icon-512.png` - PWA icon large
- `public/favicon.ico` - browser favicon
- `src/app/opengraph-image.png` - social preview
- `src/app/twitter-image.png` - Twitter card

### Code to Update (LibreTier → LiberTier):

- `src/app/layout.tsx`
- `src/app/manifest.ts`
- `src/app/page.tsx`
- `src/components/layout/Header.tsx`
- `src/components/ui/Logo.tsx`
- `src/components/landing/FAQSection.tsx`
- `README.md`
- `package.json`
