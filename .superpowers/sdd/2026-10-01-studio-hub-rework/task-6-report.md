# Task 6 report: sitemap, robots, llms.txt guard, JSON-LD invariants, contract docs

BASE 0d6bd610069b06e4c1fcbf9b5f7e3bd87d432129, HEAD 9d6977a557dc7dc73cad01bf0d4de5ca5228d2c2

## Implemented
- `src/lib/routes.ts`: `renderedPageIds()` (published AND in `RENDERED_PAGE_IDS`, today home + 3 legal), single source of truth for the sitemap.
- `src/app/sitemap.ts`: iterates `renderedPageIds()` x LOCALES via `absoluteUrl`, alternates `alternatesFor`; legal dates from dictionaries, home one dated constant; throws for a rendered page without a date (no invented date); weekly for home/app/games, monthly otherwise.
- `src/app/robots.ts`: `*` plus the 11 named crawlers, each `allow: "/"`, no disallow, sitemap line.
- `public/llms.txt`: Pages section rewritten (EN `https://synapgeek.com`, FR `/fr`, legal FR unprefixed + `/en/` EN). Rest unchanged.
- `src/lib/structured-data.ts`: ids `/#organization`, `/#website`, `/cerebrum#app`; Organization and WebSite url `https://synapgeek.com/`; `inLanguage` = "en"/"fr" (was en_US/fr_FR); `organizationSchema()` takes no locale (one node, layout keeps emitting it).
- `scripts/check-contract-urls.mjs`: every sitemap `<loc>` is requested on the checked base and must answer 200 (local run: 44/44).
- Docs: CLAUDE.md (Langues, Structure des routes, Architecture i18n, SEO, pagePath rule, contract files list, Smart App Banner note), three `.claude/agents/*.md`, `.prettierignore` with `docs/contrat/`.
- Already done by earlier tasks and verified, not redone: `getAlternates(pageId, locale)` on `alternatesFor`, `X_DEFAULT_LOCALE` in routes.ts (no importer left in seo.ts, so no re-export added), `buildOpenGraph` url from `absoluteUrl`.

## TDD
RED: `npx vitest run` after writing tests only: 6 failed + `route-invariants.test.ts` failing at import (`renderedPageIds is not a function`), structured-data failures: `expected 'https://synapgeek.com/#cerebrum' to be '.../cerebrum#app'`, `'https://synapgeek.com' to be '.../'`, `'en_US' to be 'en'`. Expected: features absent.
Intermediate: after code, 4 failures (robots not named, llms URLs wrong, QR guard). Fixed robots/llms. QR guard regex was too loose (matched `play.google.com`); anchored on `synapgeek.com`.
GREEN: `npx vitest run` 7 files, 167 tests passed.

## Gates
lint clean; `next typegen` + `tsc --noEmit` clean; `npm test` 167 pass; `npm run build` OK (17 pages, 3 dynamic markers unchanged); `prettier --check` on CLAUDE.md, agents, src, scripts clean; `next start -p 3116` + `check:contract http://localhost:3116` 44/44, PID 8282 killed.

## Concerns / notes
- SoftwareApplication `@id` is `/cerebrum#app` but its `url` is still the home (the /cerebrum page does not exist yet, Task 8+); switch `url` to `absoluteUrl("cerebrum")` when that page ships.
- Sitemap `lastModified` for home is still a constant (Task 8 per ruling).
- `/fr/<legal>` documented as transitional 200 (code reality); the 308 is not in next.config yet.
- llms.txt still lists 10 games / content from earlier tasks; not touched.
- Deviation from the brief: `organizationSchema` lost its `locale` parameter (identical node in both locales).
- No mutation proof run (RED/GREEN above is the evidence).

## Fix round 1

BASE 9d6977a557dc7dc73cad01bf0d4de5ca5228d2c2

### Finding 1 (sitemap changeFrequency): fixed
- `src/app/sitemap.ts`: `isFrequentlyUpdated` is now `home || cerebrum` (the `game:*` clause is removed); games are monthly like every other page.
- `src/app/route-invariants.test.ts`: the changeFrequency test now encodes the same rule (weekly for home and cerebrum in both locales, monthly for the rest), so implementation and test no longer drift when cerebrum joins `RENDERED_PAGE_IDS`.
- Covering test: `src/app/route-invariants.test.ts` ("changeFrequency : hebdomadaire pour le hub et l'app, mensuelle pour le reste").

### Finding 2 (llms.txt Pages section): not applied, finding judged not actionable
The diff is the minimum the binding rules require. (a) The bidirectional guard (every sitemap URL in llms.txt) forces the EN legal entries, since `/en/privacy`, `/en/terms`, `/en/legal` are in the sitemap. (b) `/privacy`, `/terms`, `/legal` and `/fr` are now French pages: keeping the old English labels ("Privacy Policy" etc.) on a French URL would state a false fact to LLM readers, so relabelling the FR entries is part of "fix the URLs the switch made wrong". The rest of the file is untouched. Reverting would break the guard or mislabel pages.

### Gates
- `npx vitest run src/app/route-invariants.test.ts`: 52 passed
- `npm run lint`: clean; `next typegen` + `tsc --noEmit`: exit 0; `npm test`: 7 files, 167 passed; `npm run build`: OK; `prettier --check` on touched files: clean.
