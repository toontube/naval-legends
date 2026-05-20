# Bravo Zulu SEO Agent

Automated SEO agent for brvzulu.com. Run daily to grow organic search traffic.

## How to run

```bash
cd ~/MOZUMA/naval-legends
claude -p scripts/seo-agent/daily-seo.md
```

Or schedule as a cron/Claude Code trigger.

## What it does

The agent runs a daily SEO workflow with 5 tasks:

1. **Publish staged story** — moves next story from staging/ to content/
2. **Keyword research** — finds new keyword opportunities based on trending naval history searches
3. **Content optimization** — picks one existing story and optimizes it (FAQ sections, internal links, meta improvements)
4. **Content creation** — writes one new story targeting a keyword gap (when queue is empty)
5. **Distribution** — drafts Reddit/Quora posts for recent stories

## Files

- `daily-seo.md` — The main agent prompt (run this)
- `keyword-tracker.md` — Tracked keywords and their status
- `content-queue.md` — Queue of articles to write
- `distribution-log.md` — Log of social posts drafted
