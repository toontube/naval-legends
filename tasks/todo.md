# Bravo Zulu plan (2026-10-13)

Live code: ~/MOZUMA/naval-legends (Astro). brvzulu-preview is a mockup, port pieces into Astro, never deploy it.

## Phase 1: UI fixes on live (small, no product risk)
- [ ] Optimize images: 28MB in public/images (8.2MB new-orleans, 6.9MB pueblo). Move to astro:assets, WebP, srcset, lazy load; DailyCard bg-image -> <img>
- [ ] Remove stale Cruisers KS block + sticky CTA from stories/[...slug].astro (campaign closed)
- [ ] Add h1 on homepage + skip link
- [ ] Nav: add About (+ Submit)
- [ ] Stories index: thumbnails, readable tag labels, clickable tag filters
- [ ] Tag contrast/size to WCAG AA (global.css)
- [ ] Remove duplicate blocking Google Fonts request
- [ ] Tablet/desktop breakpoints

## Phase 2: Search
- [ ] Site search v1: Pagefind (static, free) over stories + daily, aliases/hull numbers in frontmatter
- [ ] Ships collection (ship entity, links stories <-> ships)
- [ ] Jev eval first: hand-label ~50 candidates/claims, compare Jev (needs TypeSafe early-access key)
- [ ] If eval passes: Jev rerank on top of Pagefind (edge fn), "find my grandfather's ship" fuzzy matcher
- [ ] Story pipeline: persistent backlog, Jev scoring (surprise/specificity/sourceability), semantic dedupe, claim-level fact-check gate in /new-story

## Phase 3: Community hub (JTBD, hypothesis)
Target segment: descendants keeping a relative's service alive (certainty > connection > low effort).
- [ ] 5-10 interviews with people who paid Fold3/Ancestry/ordered records
- [ ] RAT: seed 3 ships with public muster rolls, post in 3 FB ship groups. Pass: >=10% claim, >=30% of claims shared, 2 weeks
- [ ] Only if pass: ship pages + claim flow + "another family joined" alerts + memorial print, needs a backend
