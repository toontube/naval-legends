# Lessons (brvzulu.com / naval-legends)

## 2026-10-14/15 SEO overhaul

- **Astro scoped styles stop at component boundaries.** Wrapping an `<img>` in a new component (`Picture.astro`) silently drops the parent's `.class` styles. Use `:global(.class)` in the parent, and screenshot the page after any wrapper change.
- **Shared page classes live in `src/styles/home.css`.** `.home-*` and `.stories-page` were page-scoped; new pages (topics, 404) rendered unstyled until the CSS moved to a shared file. Check new pages visually, not just the build.
- **Audit tools flag the `<noscript>` Google Fonts link as render-blocking.** It is not. Do not "fix" it.
- **Story agents must never send personal data in web requests.** One agent put the owner's email in a Wikimedia User-Agent. Every agent prompt now says: generic User-Agent, no emails or names.
- **Agent fact-checks find real errors in old content** (about 70 across 32 stories, e.g. Scapa Flow "drinking order" myth, Emden "all 50 made it home"). Fix the frontmatter summary and the daily card too, not only the body.
- **Agents report "unverified" claims; read the list.** Remove sources the agent could not open, hedge single-source dates, and check search titles for overclaims (Enterprise was "reported sunk", never sunk).
- **Re-running `optimize-images.mjs` must not recompress twice.** It skips files under 300 KB and 1600 px wide; keep that guard.
- **Direct pushes to master are blocked by the permission layer.** Ship via `gh pr create` + `gh pr merge --merge`.
- **Run `node scripts/indexnow.mjs` after each deploy** so Bing and other engines pick up new URLs.
