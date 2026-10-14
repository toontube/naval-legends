# Bravo Zulu story guide

How every story on brvzulu.com is written. Used by people and by the scheduled story agent.

## Files per story

- `src/content/stories/<slug>.md`: the article.
- `src/content/daily/<name>.md`: the daily card. `order` = highest existing order + 1.
- Optional image: `public/images/<slug>.jpg` (public domain or CC only, credit CC in a `<figure><figcaption>`), then run `node scripts/optimize-images.mjs` (makes the 480px and WebP copies).
- Add the slug to every matching hub in `src/lib/topics.ts` (by era and by navy). The build fails if a hub lists an unknown slug.

## Story frontmatter

```yaml
---
title: "Descriptive, specific title"
seoTitle: "Ship or event name first: short hook"   # max 47 chars; becomes <title> + " | Bravo Zulu"
slug: kebab-case-slug
date: YYYY-MM-DD
summary: "1-2 sentences, whole sentences, ideally under 160 characters"
image: /images/<slug>.jpg   # optional
tags: [3-5, lowercase, hyphenated]
readingTime: 5               # words / 230
---
```

## Daily card frontmatter

```yaml
---
hook: "One sentence: a specific question the reader needs answered"
reveal: "2-3 sentences with the punchline, ending on something concrete that still exists"
year: 1942
ship: Ship name
image: /images/<slug>.jpg   # optional
linkedStory: <story slug>
order: <next number>
---
```
`specs` is optional; if present it needs all five fields: type, displacement, armament, speed, built.

## Find a story

Use WebSearch to find a surprising, little-known warship fact. Try queries like:

- `"TIL warship" OR "TIL naval" site:reddit.com`
- `unusual naval history facts cruiser`
- `strangest ship design failures`
- `naval battles nobody knows about`
- `warship engineering disaster`
- `[specific ship class] problems history`

Pick the strongest candidate yourself.

**The barbecue test:** Would a 40-year-old guy who builds model ships interrupt a conversation to share this? If not, find a different story.

## Fact-check

Verify every claim against at least 2 independent sources. Get specific:
- Full names with ranks
- Exact dates
- Tonnage, calibers, distances
- Casualty numbers
- What happened after (court-martial results, ship's fate, wreck location)

If you can't verify a claim, cut it.

## Write the daily card
### Writing rules

- 800-1200 words. 4-6 minute read.
- Short paragraphs. One idea each. Some are one sentence.
- Specific numbers: tonnage, calibers, distances, times to the minute.
- Name everyone: full name, rank, position.
- No inflation. Not "devastating"; say "82 dead." Numbers carry weight.
- Dry humor through facts. Don't write jokes. Let absurd details speak for themselves.
- End with something concrete that still exists today. Not a summary. A place you can visit, a wreck you can find on Google Maps, a museum artifact.
- Question the accepted story. If the standard account blames one person, ask who else was responsible.
- Use primary sources. Quote ship logs, memoir passages, court-martial records. Point out where sources contradict each other.

### Banned words

Never use: legendary, epic, heroic, dramatic, fateful, ill-fated, doomed, tragic, remarkable, pivotal, crucial, testament, showcasing, delve, landscape, tapestry, underscores, robust, comprehensive, cutting-edge, seamless, game-changer, remarkable, unprecedented.

### Banned phrases

Never use: "little did they know", "what happened next would change everything", "it was a turning point", "in the annals of history", "a testament to", "it's worth noting", "the future looks bright."

### Sources section

End with a `---` divider and a `## Sources` section (bullet links) with 3-5 sources, as the last thing in the file. Use Wikipedia for at most one of them. Prefer:
1. Wikipedia (reliable, always accessible)
2. National museum sites
3. Naval history society sites
4. Books (author, title, publisher, year, no URL needed)

Verify every URL actually works before including it.

## House rules

- 1,000 to 1,300 words in the body, 3 to 5 `##` headings.
- Every claim checked against two independent sources you actually opened. Cut what you cannot verify. Where sources disagree, say so in the text.
- `## Sources` is the last section: 3 to 5 sources, only URLs you opened, at most one Wikipedia.
- 3 to 5 inline links to related existing stories as `/stories/<slug>/` (trailing slash).
- Never use em-dashes.
- Never put personal data (emails, names) in web requests or User-Agent headers.
- Do not edit `public/llms.txt`: it is generated.
- Check `npm run build` passes before shipping.
