# LibreTier Launch Guide

**Live Demo:** https://libretier.vercel.app
**GitHub:** https://github.com/ahmed-abdat/LibreTier

---

## Step 1: Create Demo Video

### Recommended: Screen Studio

**Download:** https://screen.studio ($9/mo annual)

**Record this flow (20-30 seconds):**

1. Show empty tier list
2. Drag & drop images to upload
3. Drag item from Unassigned → S tier
4. Drag item between tiers
5. Change tier color
6. Click Export → show PNG

**Export:** MP4 for social, GIF for GitHub (under 10MB)

### Free Alternative: Kap

**Download:** https://getkap.co

---

## Step 2: Launch Platforms (Priority Order)

### 1. Hacker News (Show HN) - HIGHEST PRIORITY

**URL:** https://news.ycombinator.com/submit
**Best Time:** Tuesday-Thursday, 9 AM - 12 PM PST

**Title:**

```
Show HN: LibreTier – Open-source tier list maker, no account needed
```

**URL field:**

```
https://github.com/ahmed-abdat/LibreTier
```

**First Comment (post immediately):**

```
Hey HN! I built LibreTier because existing tier list makers frustrated me - they require accounts, show ads, and upload images without consent.

LibreTier is:
- 100% client-side (localStorage, no backend required)
- PWA that works offline
- Privacy-first (images stay in your browser unless you choose to share)
- MIT licensed

Tech stack: Next.js 16, React 19, TypeScript (strict), Zustand + Zundo for undo/redo, @dnd-kit for accessible drag-and-drop.

Live demo: https://libretier.vercel.app

Would love feedback on the drag-and-drop UX and any features you'd want to see.
```

---

### 2. Reddit r/SideProject

**URL:** https://www.reddit.com/r/SideProject/submit
**Best Time:** Monday/Wednesday, 5-10 PM CET

**Title:**

```
I built an open-source tier list maker that doesn't require an account or upload your images anywhere
```

**Body:**

```
After getting annoyed by tier list sites with mandatory sign-ups, intrusive ads, and my images being uploaded without consent, I built **LibreTier** - a privacy-first, open-source alternative.

## Features

- Drag & drop everything
- Works offline (PWA)
- Export to PNG
- Undo/Redo (Ctrl+Z)
- Dark/Light mode
- No account required

## Privacy

All data stays in your browser (localStorage). Images only uploaded if YOU choose to share.

**Try it:** https://libretier.vercel.app
**GitHub:** https://github.com/ahmed-abdat/LibreTier

This is v1.0.0 - feedback welcome!
```

---

### 3. Reddit r/opensource

**URL:** https://www.reddit.com/r/opensource/submit

**Title:**

```
LibreTier: Privacy-first tier list maker - MIT licensed, works offline
```

**Body:**

```
Just released v1.0.0 of **LibreTier** - an open-source tier list maker.

## Why I built this

Existing options like TierMaker require accounts and upload your images without consent. I wanted something privacy-first that works offline.

## Tech Stack

- Next.js 16 (App Router)
- TypeScript (strict mode)
- Zustand + Zundo (undo/redo)
- @dnd-kit (accessible DnD)
- Serwist (PWA)

## Contributing

- Detailed CONTRIBUTING.md
- GitHub Actions CI
- E2E tests with Playwright

**GitHub:** https://github.com/ahmed-abdat/LibreTier
**Demo:** https://libretier.vercel.app
```

---

### 4. Twitter/X Thread

**URL:** https://twitter.com/compose/tweet

**Tweet 1:**

```
🚀 Just launched LibreTier - an open-source tier list maker

No account. No ads. No tracking. Your images never leave your browser.

Try it: libretier.vercel.app

🧵
```

**Tweet 2:**

```
Features:
✅ Drag & drop everything
✅ Works offline (PWA)
✅ Export to PNG
✅ Undo/Redo
✅ Dark mode

All data stored locally.
```

**Tweet 3:**

```
Tech: Next.js 16, React 19, TypeScript, Zustand, @dnd-kit

Fully open source (MIT)
github.com/ahmed-abdat/LibreTier

#opensource #webdev #reactjs
```

---

### 5. Reddit r/webdev (Saturday Only)

**URL:** https://www.reddit.com/r/webdev
**When:** Find the pinned "Showoff Saturday" thread

**Comment:**

```
**LibreTier** - Open-source tier list maker

Privacy-first alternative to TierMaker. No account, works offline.

**Stack:** Next.js 16, React 19, TypeScript, Zustand, @dnd-kit

**Demo:** https://libretier.vercel.app
**Code:** https://github.com/ahmed-abdat/LibreTier
```

---

## Launch Checklist

- [ ] Create demo video (Screen Studio or Kap)
- [ ] Post to Hacker News (Show HN) - **do this first**
- [ ] Post to r/SideProject (1-2 days later)
- [ ] Post to r/opensource
- [ ] Post Twitter thread
- [ ] Saturday: Comment in r/webdev Showoff Saturday

---

## Tips

1. **Respond to every comment** - shows active maintenance
2. **Don't ask friends to upvote** - platforms detect this
3. **Space out posts** - wait 1-2 days between platforms
