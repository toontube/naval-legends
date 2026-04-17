# Naval Legends

Naval history content site with swipeable daily story cards and long-form articles. Built with Astro, React, and Motion.

**Domain:** navallegends.co

## Setup

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # Static output in dist/
npm run preview  # Preview built site
```

## Deploy

Static site — deploy `dist/` to Vercel, Netlify, or Cloudflare Pages.

**Vercel:** Push to GitHub, import repo, auto-detected as Astro.

**Netlify:** Push to GitHub, set build command `npm run build`, publish dir `dist`.

## Content

### Daily Cards (`src/content/daily/*.md`)

```yaml
---
hook: "Your dramatic one-liner here."
year: 1864
ship: CSS Alabama
linkedStory: css-alabama-semmes  # slug of linked story, or "placeholder"
order: 1
---
```

### Full Articles (`src/content/stories/*.md`)

```yaml
---
title: "Full Article Title"
slug: css-alabama-semmes
date: 2026-04-16
summary: "One or two sentence summary."
tags: [civil-war, css-alabama]
readingTime: 4
---

Article body in markdown...
```

## Stack

- **Astro 6** — static site generator
- **React** — swipe card island only
- **Motion v12** — drag gestures and animations
- **@chenglou/pretext** — text measurement for CLS prevention on articles
- **Fonts:** Playfair Display, Lora, Inter (Google Fonts)
