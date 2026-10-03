# Studio Hub Rework Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn synapgeek.com into a multi-app studio hub (hub, Cerebrum app page, one page per game, About, Press) in English by default with French under `/fr`, built for SEO/GEO, without breaking a single contract URL.

**Architecture:** A typed page registry (`src/lib/routes.ts`) owns every URL per locale, including the frozen legal scheme, and feeds links, canonicals, hreflang, sitemap and JSON-LD. A typed content registry (`src/content/apps/`) holds app and game facts plus natively written FR/EN copy. Pages stay pure SSG under `[locale]`; the proxy rewrites unprefixed paths to `/en` (legal paths to `/fr`), `next.config.ts` holds the legacy redirects.

**Tech Stack:** Next.js 16.3.x App Router (SSG), React 19.2, TypeScript strict, Tailwind CSS 4 (CSS-first tokens in `src/app/globals.css`), `next/font/google` (Fredoka, Nunito), `next/og`, vitest 4, Vercel.

**Spec:** `docs/superpowers/specs/2026-10-01-studio-hub-rework-design.md` (read it first, with `PRODUCT.md` and the surface brief `.impeccable/surfaces/src-app-locale-page-tsx.md`).

## Global Constraints

- Contract URLs keep their exact behaviour (spec §5.2): `/privacy`, `/terms`, `/legal` serve FRENCH; `/en/privacy`, `/en/terms`, `/en/legal` serve English; `/fr/{privacy,terms,legal}` 308 to the unprefixed URL; `/account-deletion` (+ `/en/`, `/fr/`) 307 to `#account-deletion`; `/cerebrum/play` (+ `/play`, `/jouer` 307); `/.well-known/*`, `/app-ads.txt`, `/llms.txt`, `/robots.txt`, `/sitemap.xml` 200; `/` and `/fr` carry `id="contact"`; `/en` 308 to `/`.
- Pure SSG: no `revalidate`, `dynamicParams`, `runtime`, `"use cache"`, `cacheComponents`; exactly three files export `dynamic` (`src/app/cerebrum/play/page.tsx`, the two `.well-known` handlers); `generateStaticParams` on every `[locale]` segment; unknown segment → real `notFound()`; never `src/app/[locale]/cerebrum/play`.
- Every JSON-LD object is built in `src/lib/structured-data.ts`; no `aggregateRating`.
- No hardcoded user-facing text in components; no new `locale === "fr" ?` ternary (target: zero after Task 9); every internal link through the route helpers.
- Copy rules (spec §9): definition sentence of 150 to 250 characters right after the single H1; house game name next to its genre; no number of games or levels anywhere; "zéro pub imposée" / "no forced ads", never "sans pub" / "ad-free"; crystals are not gems; never Zip, Queens, Picross; no em dash (—) in visible copy; no word addressing children or families; French written natively, never translated; no price, no rating, no download count.
- Facts come only from `cerebrum-design-system/marketing/ASO/3.x.x/asc-metadata.md`, the iOS fact file `scratchpad/facts/faits-cerebrum-3.0.0-pour-site.md` (copy it into `docs/contrat/faits-cerebrum-3.0.0.md` in Task 1) and the dedicated sessions. Android availability of the four 3.0.0 games stays `null` until Adrien confirms the Play rollout.
- Visual: tokens only (no hex in components), WCAG 2.1 AA contrast (ink text on green), `prefers-reduced-motion` respected, images renamed when replaced (7-day cache on `/images/*`).
- Portfolio: never Word Search Trove, Maze Foundry or the unreleased app's code name.
- Models: implementers Sonnet; reviews and gates Opus. Every brief copies the skills to invoke, in order.
- Nothing is pushed to `main`; Adrien merges.

## Review Focus

- A French app user opening `/privacy`, `/terms` or `/#contact` from the installed app must land on French legal text, and on a working contact section (Task 4 and Task 5 tests pin it).
- `/en/<anything>` other than legal must never serve a duplicate English page (Task 5 pins the 308s; Task 6 pins sitemap uniqueness).
- A translated slug must never resolve in the other locale (`/fr/cerebrum/crossword` and `/cerebrum/mots-croises` are 404) (Task 3 and Task 4 tests).
- A game unavailable on Android must never render "Android" next to it (Task 7 test on the availability helper).
- Copy regressions (a count of games, an em dash, "sans pub", a forbidden word) must fail the build gate (Task 8 content guards).

---

## Amendments after the site-architect gate (2026-10-01, binding — they override the task texts below)

Verdict GO-avec-réserves. Where a task below disagrees with this section, this section wins.

1. **Security first (I1).** The Next/React/nodemailer upgrade ships as its own PR to `main` (lot 0d, branch `fix/security-deps`), not only inside the rework. Task 2 of this plan stays (the rework branch already carries it) and dedupes on rebase.
2. **One URL helper (B1, decision 3).** `pagePath(pageId: PageId, locale: Locale, hash?: string)` where `PageId = "home" | "cerebrum" | \`game:${GameId}\` | "about" | "press" | "privacy" | "terms" | "legal"` (a string union, serialisable to client leaves). The legal exception is data (`FROZEN_LEGAL_PATHS`), never a ternary. `getLocalePath`is removed and every caller rewired:`seo.ts`, `sitemap.ts`, `structured-data.ts`, `Footer.tsx`, `HeaderShell.tsx`, `FAQ.tsx`, `ConsentBanner.tsx`, `types.ts` (`FaqLink.path`becomes`{ page: PageId; hash?: string }`). A truth-table test covers every (page, locale) pair. CLAUDE.md's "tout lien interne passe par getLocalePath()" is rewritten.
3. **Frozen legal paths are data (decision 1).** `FROZEN_LEGAL_PATHS = ["/privacy", "/terms", "/legal"]` lives in a dependency-free module without `@/` imports (`src/lib/frozen-legal-paths.ts`), read by the proxy, `pagePath`, the sitemap and `next.config.ts` (relative import). No future page joins it.
4. **Proxy stays rewrite-only (decision 1).** Prefixed by `/en` or `/fr` → `next()`; unprefixed path equal to a frozen legal path → rewrite to `/fr<path>`; any other unprefixed path → rewrite to `/en<path>`. Matcher and `LOCALE_FREE_ROUTES` unchanged. Tested as a function with `isRewrite` / `getRewrittenUrl` from `next/experimental/testing/server`.
5. **Redirects: literal sources only, no regex, no lookahead, no catch-all (decision 1).** Order: the three `/account-deletion` (unchanged, `permanent: false`); `/play`, `/jouer` (unchanged); `/en` → `/` (`permanent: true`); then one literal `/en<path>` → `<path>` (`permanent: true`) per published non-legal EN page, generated in `next.config.ts` from the dependency-free slug registry (`/en/cerebrum`, `/en/cerebrum/<game>`, `/en/about`, `/en/press`). A catch-all would also redirect the OG image routes under `/en/…/opengraph-image-*`. **No `/fr/{privacy,terms,legal}` redirect in this PR**: they stay 200 with their canonical (follow-up PR, 307, after production proof). Redirects are tested with `unstable_getResponseFromNextConfig`.
6. **Routes (decision 2).** `src/app/[locale]/page.tsx` (hub); `src/app/[locale]/cerebrum/layout.tsx` (Smart App Banner metadata only, no `<html>`); `src/app/[locale]/cerebrum/page.tsx`; `src/app/[locale]/cerebrum/[game]/page.tsx`; `src/app/[locale]/[slug]/page.tsx` (about/press ⇄ a-propos/presse); legal folders unchanged; `src/app/[locale]/not-found.tsx` (localized) and `src/app/not-found.tsx` (root, English, own `<html>`); `src/app/cerebrum/play/page.tsx` unchanged. `generateStaticParams` per locale over **published** pages only; `notFound()` in both `generateMetadata` and the page for unknown, unpublished or other-locale slugs; never `dynamicParams`; never `loading.tsx` or Suspense around these pages; never `src/app/[locale]/cerebrum/play`; reserved slugs tested (`play` for games; `cerebrum, privacy, terms, legal, account-deletion, play, jouer, api, en, fr` for `[slug]`); never a `next/link` to `/cerebrum/play`.
7. **Registry (decision 3, T7 follow-up).** Store identifiers and URLs live in `src/lib/app.ts` and the registry imports them (not the reverse: client components must not pull the registry). Each game gains `published: boolean` and per-locale `updatedAt`; colors are referenced by token name, hex lives only in `globals.css`.
8. **JSON-LD (decision 4, I10).** Invariant `@id`s across locales (`https://synapgeek.com/#organization`, `/#website`, `/cerebrum#app`, `/cerebrum/<en slug>#game`); Organization and WebSite `url` = `https://synapgeek.com/`; ONE Organization node emitted by the locale layout on every page (Task 12 must NOT move it to the hub); `/about` adds an `AboutPage` referencing it; app `@type ["MobileApplication","VideoGame"]`; one `VideoGame` per game (`isPartOf` app, `publisher` org, `gamePlatform` from availability); `BreadcrumbList` and `FAQPage` read the same arrays as the visible breadcrumb and FAQ; `inLanguage` in BCP 47 (`en`, `fr`, and the 16 app languages for the app).
9. **Sitemap, robots, llms.txt, OG (decision 4).** Sitemap = published pages × 2 + frozen legal pages, alternates via `pagePath`, `lastModified` = the same field as "Updated on" and `dateModified` (never `new Date()`). robots: `allow: "/"` plus named AI bots, no `Disallow`. `llms.txt` stays static in `public/`, with a vitest guard: every synapgeek.com URL in it is in the sitemap and `/cerebrum/play` never is. OG images through `opengraph-image.tsx` per segment, no `dynamic`/`runtime`/`revalidate` export, committed TTF fonts read at module level, each OG route ●/○ in the build table; `buildOpenGraph` stops forcing `og-image.jpeg`.
10. **Anchors (B2).** Preserve and test `id="account-deletion"` and `id="website"` (privacy FR and EN; `website` is the target of the consent banner's "learn more" link) and `id="contact"` on `/` and `/fr`. `LegalPage` keeps `id`, `tabIndex={-1}` and a `scroll-margin-top` at least the height of the new fixed header; check `/privacy#account-deletion` on mobile and desktop.
11. **Language switch (B1, I6).** Alternates computed server-side from the page's `pageId`; the header switch and the permanent footer link are real `<a href hreflang lang>` in the initial HTML; the "French version" suggestion is a client leaf with a server-computed href and a dictionary label, generic over `LOCALES`, no redirect, no storage, no layout shift, absent from legal pages.
12. **Client boundaries (I6).** The hero tilt is a client leaf wrapping a server-rendered `next/image` (`children`), active only under `(pointer: fine)`, off under `prefers-reduced-motion`, ref + rAF or CSS variable, passive listeners, no `setState` per pointermove. No client provider around `{children}` in layouts. `LegalPage` and everything it imports stay server-only: extend the lot 0a guard to transitive imports.
13. **404 and `/cerebrum/play` (I3, I4).** Localized `[locale]/not-found.tsx` with a client `useParams()` leaf choosing among dictionary strings passed as props; root `not-found.tsx` in English with its fonts; fix the root layout default title (French with an em dash today). `/cerebrum/play` redirect logic unchanged to the character; the fallback page localizes by `Accept-Language`, its `<html lang>` follows, list via `Intl.ListFormat`, games from the registry.
14. **Contract docs in the same PR as the switch (I7).** CLAUDE.md and the three `.claude/agents/*.md` are updated in the routing wave (Tasks 3-6), and the tests encoding the old contract are rewritten BEFORE the code (they must fail on the old code first).
15. **Vercel proof (B3).** Before merging the rework: either (a) one protected CLI deployment `vercel deploy --prebuilt` (not `--prod`, not aliased) with `check:contract` against it — needs Adrien's explicit approval — or (b) an armed rollback: note the current production deployment id, run `check:contract` on apex and www right after the merge, Instant Rollback at the first deviation on legal, account-deletion, `#contact` or `/play`. `check:contract` gains the B3 cases (hubs, `/en` variants with query, legal `lang` + canonical + hreflang, anchors, `/play` matrix, unknown and other-locale slugs 404, one game per locale with canonical, hreflang and a 200 `image/png` og:image, sitemap without `/en/<page>`, `/fr/<legal>` or `/cerebrum/play`).
16. **Publication (I2).** `published` flag; an unpublished page appears nowhere (params, sitemap, alternates, llms.txt, links); FR and EN publish together. Ruling (controller): if wave 2 is not ready at merge, an unpublished game's hub card renders without a link.
17. **Fonts (M1).** Body text in **Figtree**, not Nunito (Maze Foundry uses Baloo 2 and Nunito; portfolio rule 1). Fredoka for display.
18. **Other (M2, M3, M8, M9, I9).** Zero locale ternaries; no hardcoded strings or hex (Footer `bg-[#1A1A2E]`, HeaderShell alt/aria, LanguageSwitcher labels); the pill is a `Button` variant; one source for the publisher identity (About, Press, JSON-LD) with a test matching the address and SIRET of `/legal`; contrast ≥ 4.5:1 for all ten game pairs; contact topics parity test against `CONTACT_TOPICS` of `src/app/api/contact/route.ts`.
19. **Models (M7).** Routing tasks (3 to 6) get an Opus task reviewer (Adrien: Opus for important reviews); implementers stay Sonnet, escalation to Opus from fix round 4.

## Phase A — Integration and foundations

### Task 1: Integrate the lot branches and record the facts

**Files:**

- Branch `feat/studio-hub-rework` rebuilt on top of `fix/site-facts-3.0.0` (which sits on `chore/claude-stack-from-wst`, which sits on `feat/cerebrum-play-route`).
- Create: `docs/contrat/faits-cerebrum-3.0.0.md` (copy of the iOS fact file)
- Modify: `.gitignore` (add `/.impeccable/questions/`)

- [ ] **Step 1:** Rebase the rework commits (spec, PRODUCT.md, surface brief) onto the stack top: `git -C <rework> rebase fix/site-facts-3.0.0`.
- [ ] **Step 2:** Copy the fact file and add its source line at the top: `> Copie du 2026-10-01 de la session App iOS (tag v3.0.0). Source de vérité des pages jeux avec asc-metadata.md.`
- [ ] **Step 3:** Run `npm ci && npm run lint && npx tsc --noEmit && npm test && npm run build`. Expected: all green (15+ tests).
- [ ] **Step 4:** Commit `chore: integrate lots 0a-0c and record the Cerebrum 3.0.0 facts`.

### Task 2: Upgrade Next.js to 16.3.x

**Files:** Modify `package.json`, `package-lock.json`; read `node_modules/next/dist/docs/` after install.

- [ ] **Step 1:** `npm view next@16.3 version` and `npm view eslint-config-next@16.3 version`; pick the highest 16.3.x published for both.
- [ ] **Step 2:** `npm install --save-exact next@<v> eslint-config-next@<v>` and the matching `react`/`react-dom` 19.2.x Next declares as peer (`npm view next@<v> peerDependencies`).
- [ ] **Step 3:** Read `node_modules/next/dist/docs/` for breaking changes between 16.1 and 16.3 (proxy, redirects, metadata, `next/og`, typegen). Write the findings in the commit body.
- [ ] **Step 4:** Run lint, `npx next typegen`, tsc, tests, build, then `npx next start -p 3110` and `npm run check:contract -- http://localhost:3110`. Expected: same results as before the upgrade.
- [ ] **Step 5:** Update CLAUDE.md "Stack technique" (version line) and commit `chore(deps): upgrade Next.js to 16.3.x`.

## Phase B — Routing and i18n core (TDD)

### Task 3: Page registry and path helpers

**Files:**

- Create: `src/lib/routes.ts`, `src/lib/routes.test.ts`
- Modify: `src/lib/i18n.ts` (`DEFAULT_LOCALE = "en"`, keep `LOCALES = ["en", "fr"]`)

**Interfaces:**

- Produces:
  - `type PageRef = { kind: "hub" } | { kind: "app"; app: AppSlug } | { kind: "game"; app: AppSlug; game: GameId } | { kind: "section"; id: "about" | "press" } | { kind: "legal"; id: "privacy" | "terms" | "legal" }`
  - `pagePath(page: PageRef, locale: Locale, anchor?: string): string` (relative URL, no trailing slash, `/` for the EN hub)
  - `absoluteUrl(page: PageRef, locale: Locale): string` (prefix `https://synapgeek.com`)
  - `alternatesFor(page: PageRef): { canonical: (l: Locale) => string; languages: Record<Locale | "x-default", string> }`
  - `allPages(): PageRef[]` (every indexable page, used by the sitemap)
  - `resolveSection(locale: Locale, slug: string): "about" | "press" | null`
- Consumes: `getApps()`, `getGames(app)`, `gameSlug(game, locale)` from Task 7 (until Task 7 lands, `routes.ts` reads a local constant; Task 7 replaces it — write the test against the final slugs now).

- [ ] **Step 1: Write the failing test** `src/lib/routes.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { pagePath, absoluteUrl, alternatesFor } from "./routes";

describe("pagePath — English default, French under /fr", () => {
  it.each([
    [{ kind: "hub" } as const, "en", "/"],
    [{ kind: "hub" } as const, "fr", "/fr"],
    [{ kind: "app", app: "cerebrum" } as const, "en", "/cerebrum"],
    [{ kind: "app", app: "cerebrum" } as const, "fr", "/fr/cerebrum"],
    [
      { kind: "game", app: "cerebrum", game: "crossword" } as const,
      "en",
      "/cerebrum/crossword",
    ],
    [
      { kind: "game", app: "cerebrum", game: "crossword" } as const,
      "fr",
      "/fr/cerebrum/mots-croises",
    ],
    [
      { kind: "game", app: "cerebrum", game: "minesweeper" } as const,
      "fr",
      "/fr/cerebrum/demineur",
    ],
    [
      { kind: "game", app: "cerebrum", game: "maze" } as const,
      "fr",
      "/fr/cerebrum/labyrinthe",
    ],
    [
      { kind: "game", app: "cerebrum", game: "word-search" } as const,
      "fr",
      "/fr/cerebrum/mots-meles",
    ],
    [{ kind: "section", id: "about" } as const, "fr", "/fr/a-propos"],
    [{ kind: "section", id: "press" } as const, "fr", "/fr/presse"],
  ])("%j in %s → %s", (page, locale, expected) => {
    expect(pagePath(page, locale as "en" | "fr")).toBe(expected);
  });

  it("keeps the frozen legal scheme (installed app, stores, UMP, Data Safety)", () => {
    expect(pagePath({ kind: "legal", id: "privacy" }, "fr")).toBe("/privacy");
    expect(pagePath({ kind: "legal", id: "privacy" }, "en")).toBe(
      "/en/privacy",
    );
    expect(pagePath({ kind: "legal", id: "terms" }, "fr")).toBe("/terms");
    expect(pagePath({ kind: "legal", id: "legal" }, "en")).toBe("/en/legal");
  });

  it("appends anchors without a slash", () => {
    expect(pagePath({ kind: "hub" }, "en", "contact")).toBe("/#contact");
    expect(pagePath({ kind: "hub" }, "fr", "contact")).toBe("/fr#contact");
  });

  it("builds absolute URLs without a trailing slash on the root", () => {
    expect(absoluteUrl({ kind: "hub" }, "en")).toBe("https://synapgeek.com");
    expect(absoluteUrl({ kind: "hub" }, "fr")).toBe("https://synapgeek.com/fr");
  });

  it("points x-default to English, legal included", () => {
    const legal = alternatesFor({ kind: "legal", id: "privacy" });
    expect(legal.languages).toEqual({
      en: "https://synapgeek.com/en/privacy",
      fr: "https://synapgeek.com/privacy",
      "x-default": "https://synapgeek.com/en/privacy",
    });
    const game = alternatesFor({
      kind: "game",
      app: "cerebrum",
      game: "minesweeper",
    });
    expect(game.languages["x-default"]).toBe(
      "https://synapgeek.com/cerebrum/minesweeper",
    );
  });
});
```

- [ ] **Step 2:** Run `npx vitest run src/lib/routes.test.ts`. Expected: FAIL (`routes.ts` missing).
- [ ] **Step 3: Implement** `src/lib/routes.ts`:

```ts
import { LOCALES, type Locale } from "./i18n";
import {
  getApps,
  getGames,
  gameSlug,
  type AppSlug,
  type GameId,
} from "@/content/apps";

export const BASE_URL = "https://synapgeek.com";
export const X_DEFAULT_LOCALE: Locale = "en";

export type LegalId = "privacy" | "terms" | "legal";
export type SectionId = "about" | "press";
export type PageRef =
  | { kind: "hub" }
  | { kind: "app"; app: AppSlug }
  | { kind: "game"; app: AppSlug; game: GameId }
  | { kind: "section"; id: SectionId }
  | { kind: "legal"; id: LegalId };

const SECTION_SLUGS: Record<SectionId, Record<Locale, string>> = {
  about: { en: "about", fr: "a-propos" },
  press: { en: "press", fr: "presse" },
};

function localePrefix(locale: Locale): string {
  return locale === "en" ? "" : `/${locale}`;
}

export function pagePath(
  page: PageRef,
  locale: Locale,
  anchor?: string,
): string {
  let path: string;
  switch (page.kind) {
    case "hub":
      path = localePrefix(locale) || "/";
      break;
    case "app":
      path = `${localePrefix(locale)}/${page.app}`;
      break;
    case "game":
      path = `${localePrefix(locale)}/${page.app}/${gameSlug(page.app, page.game, locale)}`;
      break;
    case "section":
      path = `${localePrefix(locale)}/${SECTION_SLUGS[page.id][locale]}`;
      break;
    case "legal":
      // Frozen scheme: French without prefix, English under /en (spec §5.2).
      path = locale === "fr" ? `/${page.id}` : `/en/${page.id}`;
      break;
  }
  if (!anchor) return path;
  return path === "/" ? `/#${anchor}` : `${path}#${anchor}`;
}

export function absoluteUrl(page: PageRef, locale: Locale): string {
  const path = pagePath(page, locale);
  return path === "/" ? BASE_URL : `${BASE_URL}${path}`;
}

export function alternatesFor(page: PageRef) {
  const languages = Object.fromEntries(
    LOCALES.map((l) => [l, absoluteUrl(page, l)]),
  ) as Record<Locale, string>;
  return {
    canonical: (locale: Locale) => absoluteUrl(page, locale),
    languages: {
      ...languages,
      "x-default": absoluteUrl(page, X_DEFAULT_LOCALE),
    },
  };
}

export function resolveSection(locale: Locale, slug: string): SectionId | null {
  const hit = (Object.keys(SECTION_SLUGS) as SectionId[]).find(
    (id) => SECTION_SLUGS[id][locale] === slug,
  );
  return hit ?? null;
}

export function allPages(): PageRef[] {
  const pages: PageRef[] = [{ kind: "hub" }];
  for (const app of getApps()) {
    pages.push({ kind: "app", app: app.slug });
    for (const game of getGames(app.slug))
      pages.push({ kind: "game", app: app.slug, game: game.id });
  }
  pages.push(
    { kind: "section", id: "about" },
    { kind: "section", id: "press" },
  );
  pages.push(
    { kind: "legal", id: "privacy" },
    { kind: "legal", id: "terms" },
    { kind: "legal", id: "legal" },
  );
  return pages;
}
```

- [ ] **Step 4:** Run the test. Expected: PASS once Task 7's registry exists; until then provide `src/content/apps/index.ts` with the Task 7 interface and the ten Cerebrum game ids and slugs below (Task 7 fills the rest). Slugs: `sudoku`/`sudoku`, `pandoku`/`pandoku`, `minesweeper`/`demineur`, `pixel-art`/`pixel-art`, `cross-math`/`cross-math`, `crossword`/`mots-croises`, `word-search`/`mots-meles`, `trace`/`trace`, `maze`/`labyrinthe`, `arrow-maze`/`arrow-maze` (en/fr).
- [ ] **Step 5:** Commit `feat(routes): typed page registry with per-locale paths and frozen legal scheme`.

### Task 4: Proxy rewrites for the English default

**Files:** Modify `src/proxy.ts`; extend `src/app/route-invariants.test.ts` (proxy guard).

- [ ] **Step 1: Write the failing guard** (in `route-invariants.test.ts`, proxy block) asserting `LOCALE_FREE_ROUTES` is `["/cerebrum/play"]`, `FROZEN_FR_PATHS` is `["/privacy", "/terms", "/legal"]`, `DEFAULT_LOCALE` imported from `@/lib/i18n` is `"en"`, and the matcher literal is unchanged.
- [ ] **Step 2:** Implement in `src/proxy.ts`:

```ts
const LOCALE_FREE_ROUTES = ["/cerebrum/play"];
// Spec §5.2: the installed app, the store listings, UMP and Data Safety open these
// unprefixed URLs expecting French. They keep their historical language.
const FROZEN_FR_PATHS = ["/privacy", "/terms", "/legal"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (
    LOCALE_FREE_ROUTES.some(
      (r) => pathname === r || pathname.startsWith(`${r}/`),
    )
  ) {
    return NextResponse.next();
  }
  const hasLocale = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (hasLocale) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = FROZEN_FR_PATHS.includes(pathname)
    ? `/fr${pathname}`
    : `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}
```

- [ ] **Step 3:** Run `npm test`. Expected: PASS.
- [ ] **Step 4:** Commit `feat(i18n): English by default, legal URLs keep their French scheme`.

### Task 5: Legacy redirects

**Files:** Modify `next.config.ts`; extend `route-invariants.test.ts` (redirects guard) and `scripts/check-contract-urls.mjs`.

- [ ] **Step 1: Write the failing guard** asserting `redirects()` contains, in this order: the three `account-deletion` rules (unchanged, `permanent: false`), `/play` and `/jouer` (unchanged), then `{ source: "/en", destination: "/", permanent: true }`, `{ source: "/en/:path((?!privacy$|terms$|legal$).+)", destination: "/:path", permanent: true }`, `{ source: "/fr/:legal(privacy|terms|legal)", destination: "/:legal", permanent: true }`.
- [ ] **Step 2:** Add those three rules after the existing ones in `next.config.ts`, each with a comment citing spec §5.2.
- [ ] **Step 3:** Extend `check-contract-urls.mjs` with the post-rework contract: `/` 200 English with `id="contact"`; `/fr` 200 French with `id="contact"`; `/en` 308 → `/`; `/en/cerebrum` 308 → `/cerebrum`; `/en/privacy` 200 English; `/privacy` 200 French (`<html lang="fr">`); `/fr/privacy` 308 → `/privacy`; `/fr/cerebrum/crossword` 404; `/cerebrum/mots-croises` 404; every game page 200 in both locales.
- [ ] **Step 4:** `npm run build && npx next start -p 3110` then `npm run check:contract -- http://localhost:3110`. Expected: all checks pass (the lookahead rule is verified here, not assumed). If Next rejects the lookahead, replace it with explicit rules for each EN page path from `allPages()` and record why in the comment.
- [ ] **Step 5:** `npx vercel build` (no deploy) and check `.vercel/output/config.json` routes contain the same redirects; report the diff if any. Commit `feat(routing): legacy /en and /fr legal redirects`.

### Task 6: Sitemap, robots and alternates from the registry

**Files:** Modify `src/app/sitemap.ts`, `src/app/robots.ts`, `src/lib/seo.ts` (keep `buildOpenGraph` but give it a `PageRef`; replace `getAlternates(locale, path)` by `getAlternates(page, locale)` built on `alternatesFor`; `X_DEFAULT_LOCALE` now lives in `src/lib/routes.ts`, so `seo.ts` re-exports it and every import is updated); extend `route-invariants.test.ts` (sitemap guard).

- [ ] **Step 1: Write the failing guard:** the sitemap URLs equal `allPages() × LOCALES` mapped through `absoluteUrl`, no duplicates, no `play`, each entry's `alternates.languages` equals `alternatesFor(page).languages`; `robots()` allows `/` for `*` and lists explicitly `OAI-SearchBot`, `ChatGPT-User`, `GPTBot`, `PerplexityBot`, `Perplexity-User`, `ClaudeBot`, `Claude-SearchBot`, `Claude-User`, `Google-Extended`, `Applebot-Extended`, `Bingbot` with `allow: "/"`, and has no `disallow`.
- [ ] **Step 2:** Implement: `sitemap()` iterates `allPages()`; `lastModified` comes from the page's copy `updatedAt` (legal from the existing dictionary dates; others from their copy module, Task 8); `changeFrequency` weekly for hub/app, monthly otherwise.
- [ ] **Step 3:** Replace every `getAlternates(locale, "/x")` call by `getAlternates(page, locale)`. Run tests. Expected: PASS.
- [ ] **Step 4:** Commit `feat(seo): sitemap, robots and hreflang derived from the page registry`.

## Phase C — Content model

### Task 7: Apps and games registry

**Files:**

- Create: `src/content/apps/types.ts`, `src/content/apps/index.ts`, `src/content/apps/cerebrum/app.ts`, `src/content/apps/cerebrum/games.ts`, `src/content/apps/registry.test.ts`
- Modify: `src/lib/app.ts` (re-export store constants from the registry, keep `APP_STORE_QR_URL`)

**Interfaces:**

- Produces:

```ts
export type AppSlug = "cerebrum";
export type GameId =
  | "sudoku"
  | "pandoku"
  | "minesweeper"
  | "pixel-art"
  | "cross-math"
  | "crossword"
  | "word-search"
  | "trace"
  | "maze"
  | "arrow-maze";
export type GameCategory = "logic-numbers" | "words" | "paths";
export type Difficulty = "easy" | "medium" | "hard" | "elite";
export interface PlatformAvailability {
  ios: string | null;
  android: string | null;
} // app version that shipped the game, null = not available
export interface GameEntry {
  id: GameId;
  category: GameCategory;
  slug: Record<Locale, string>;
  name: Record<Locale, string>; // in-app name (FR/EN)
  genre: Record<Locale, string | null>; // generic genre next to a house name, null for classics
  difficulties: readonly Difficulty[];
  lives: "three-hearts" | "three-lives" | "none" | "grid-defined";
  hasTutorial: boolean;
  availability: PlatformAvailability;
  contentLocales: "all" | readonly Locale[]; // crossword and word-search: ["fr", "en"]
  color: { wash: string; deep: string }; // from cerebrum-ios/docs/port/game-palette.json via design-system values
  icon: string; // /images/games/<id>-v3.webp
  screenshot: Record<Locale, string>; // /images/screens/v3/<id>-<locale>.webp
}
export interface AppEntry {
  slug: AppSlug;
  name: string;
  publisher: "Synapgeek";
  appStoreId: string;
  appStoreUrl: string;
  googlePlayUrl: string;
  platforms: { ios: { minOs: string }; android: { minOs: string | null } };
  languages: readonly string[];
  contentRating: { appStore: "4+" };
  icon: string;
  games: readonly GameId[];
}
export function getApps(): readonly AppEntry[];
export function getApp(slug: AppSlug): AppEntry;
export function getGames(app: AppSlug): readonly GameEntry[];
export function gameSlug(app: AppSlug, game: GameId, locale: Locale): string;
export function findGameBySlug(
  app: AppSlug,
  locale: Locale,
  slug: string,
): GameEntry | null;
export function platformsFor(
  game: GameEntry,
): Array<"iPhone" | "iPad" | "Android">;
```

- [ ] **Step 1: Write the failing test** `registry.test.ts`: ten games in the published order (Sudoku, Pandoku, Minesweeper, Pixel Art, Cross Math, Crossword, Word Search, Trace, Maze, Arrow Maze); slugs unique per locale and never one of `play`, `privacy`, `terms`, `legal`, `about`, `a-propos`, `press`, `presse`, `en`, `fr`; `findGameBySlug("cerebrum","fr","crossword")` is null and `findGameBySlug("cerebrum","en","mots-croises")` is null; difficulties: four for every game except crossword, word-search and arrow-maze (three, no elite); crossword and word-search `contentLocales` are `["fr","en"]`; `platformsFor` of pandoku returns `["iPhone","iPad"]` while `availability.android` is null, and adds `"Android"` when it is set; every `icon` and `screenshot` path exists under `public/`.
- [ ] **Step 2:** Run it. Expected: FAIL.
- [ ] **Step 3:** Implement the registry with the facts from `docs/contrat/faits-cerebrum-3.0.0.md` (difficulties, lives, tutorials) and these availabilities: the six 2.x games `{ ios: "2.0.0", android: "2.0.0" }`; pandoku, minesweeper, pixel-art, arrow-maze `{ ios: "3.0.0", android: null }`. Colors: read `cerebrum-ios/docs/port/game-palette.json` (read-only) and the wash/deep pairs given by the Design System session (Sudoku `#BFD9F7/#2F6FB5`, Mots croisés `#C6EBD3/#2F8A5B`, Mots mêlés `#FAD9C0/#C7692F`, Cross Math `#DCC8F5/#7C4DB8`, Trace `#F7C4DA/#C2185B`, Labyrinthe `#F6DFB5/#B8792A`, Pandoku `#BFEDE4/#2A8F80`, Démineur `#C9CDF2/#4F55C8`, Arrow Maze `#DDEFC0/#5C8A1E`, Pixel Art `#F2C6EE/#A23A9A`) and expose them as CSS custom properties in Task 10, never as hex in components.
- [ ] **Step 4:** Produce the assets the test requires: icons from `cerebrum-ios/Cerebrum/Assets.xcassets/Icons/Games/<name>-icon.imageset/<name>-icon@3x.png` (`zip` = Trace) to `public/images/games/<id>-v3.webp` at 512 px with `cwebp -q 90`; screenshots from `cerebrum-design-system/marketing/ASC-images/release-3.x.x/raw-screenshot/iphone/<concept>-{fr,en}.png` (concepts: sudoku, pandoku, minesweeper, pixelart-b, crossmath, crossword, wordsearch, trace, maze, arrowmaze) to `public/images/screens/v3/<id>-<locale>.webp`, 800 px wide.
- [ ] **Step 5:** Run tests. Expected: PASS. Commit `feat(content): Cerebrum apps and games registry with verified facts`.

### Task 8: Copy modules and content guards

**Files:**

- Create: `src/content/copy/types.ts`, `src/content/copy/en/{hub,about,press}.ts`, `src/content/copy/fr/{hub,about,press}.ts`, `src/content/apps/cerebrum/copy/{en,fr}.ts`, `src/content/content-guards.test.ts`
- Modify: `src/content/types.ts` (drop `landing.*`, keep `common`, `privacy`, `terms`, `legal`, `play`; add `common.a11y.skipToContent`, `common.languageSuggestion`)

**Interfaces:**

- Produces:

```ts
export interface DefinitionBlock {
  h1: string;
  definition: string;
} // definition: 150-250 chars
export interface FaqEntry {
  question: string;
  answer: string;
}
export interface GameCopy {
  updatedAt: string; // ISO date
  meta: { title: string; description: string }; // description <= 155 chars
  hero: DefinitionBlock;
  howToPlay: { title: string; steps: readonly string[] }; // 3 to 6 steps
  whatCerebrumAdds: {
    title: string;
    paragraphs: readonly string[];
    difficultyTable: {
      caption: string;
      rows: ReadonlyArray<{ difficulty: Difficulty; detail: string }>;
    };
  };
  tips: { title: string; items: readonly string[] }; // 3 to 5
  faq: { title: string; items: readonly FaqEntry[] }; // 3 to 6
}
export interface AppCopy {
  updatedAt: string;
  meta: { title: string; description: string };
  hero: DefinitionBlock;
  sections: {
    games: string;
    daily: { title: string; body: string };
    progress: { title: string; items: readonly string[] };
    goodToKnow: { title: string; items: readonly string[] };
    model: { title: string; items: readonly string[] };
  };
  faq: { title: string; items: readonly FaqEntry[] };
  games: Record<GameId, GameCopy>;
}
export interface HubCopy {
  updatedAt: string;
  meta: { title: string; description: string };
  hero: DefinitionBlock;
  apps: { title: string };
  games: { title: string; categories: Record<GameCategory, string> };
  facts: ReadonlyArray<{ value: string; label: string }>;
  studio: { title: string; body: string; cta: string };
  contact: { title: string };
}
export interface AboutCopy {
  updatedAt: string;
  meta: { title: string; description: string };
  hero: DefinitionBlock;
  sections: ReadonlyArray<{ title: string; body: string }>;
}
export interface PressCopy {
  updatedAt: string;
  meta: { title: string; description: string };
  hero: DefinitionBlock;
  factSheet: ReadonlyArray<{ label: string; value: string }>;
  downloads: ReadonlyArray<{ label: string; href: string }>;
  contact: string;
}
export function getHubCopy(locale: Locale): HubCopy;
export function getAppCopy(app: AppSlug, locale: Locale): AppCopy;
export function getAboutCopy(locale: Locale): AboutCopy;
export function getPressCopy(locale: Locale): PressCopy;
```

- [ ] **Step 1: Write the failing guards** `content-guards.test.ts`, walking every string of every copy module in both locales:

```ts
const FORBIDDEN: Array<[RegExp, string]> = [
  [/\b(six|dix|ten|10|6)\s+(jeux|games|puzzles?)\b/i, "no number of games"],
  [
    /\b\d[\d\s ]*\s*(niveaux|levels|grilles|puzzles)\b/i,
    "no number of levels or puzzles",
  ],
  [/—/, "no em dash in visible copy"],
  [/\b(sans pub|ad-free|no ads)\b/i, "say no forced ads, never ad-free"],
  [/\b(zip|queens|picross)\b/i, "never Zip, Queens, Picross"],
  [
    /\b(enfants?|kids?|children|famille|family|éducatif|educational|pour les petits)\b/i,
    "never address children or families",
  ],
  [/\b(classements?|leaderboards?)\b/i, "leaderboards are hidden in 3.0.0"],
  [/(€|\$|\bUSD\b|\bEUR\b)/, "no price"],
];
```

plus: every `hero.definition` is 150 to 250 characters; every `meta.description` ≤ 155 characters; FR and EN modules expose the same keys and the same number of FAQ items, steps and tips per game; every house game (`genre` not null) has its genre mentioned in its own `hero.definition`.

- [ ] **Step 2:** Run. Expected: PASS vacuously only for missing modules; create the modules with real copy in Tasks 12 to 16, the guards bite as each lands.
- [ ] **Step 3:** Move the shared UI strings: skip link text into `common.a11y.skipToContent` (removes the layout ternary), and the three legal `generateMetadata` descriptions into `privacy.metaDescription`, `terms.metaDescription`, `legal.metaDescription` (removes the three remaining ternaries); lower the ternary ratchet in `route-invariants.test.ts` to 0.
- [ ] **Step 4:** Run lint, tsc, tests. Commit `feat(content): typed copy modules, content guards, zero locale ternaries`.

## Phase D — Design system and shell (code-led, impeccable)

Skills for every task of this phase, in order: `design-references` (read `.agents/skills/design-references/SKILL.md`; moodboard + written "Parti pris" before code), `impeccable:impeccable` (craft floor: `reference/craft-floor.md`), `tailwind-design-system`, `vercel:react-best-practices`, `web-accessibility`, `emil-design-eng` for motion. The direction contract lives in `.impeccable/surfaces/src-app-locale-page-tsx.md`; the critique reference is `.impeccable/mocks/decision/canon.png`. An implementer follows the contract or stops and escalates; it never diverges.

### Task 9: Tokens, fonts and base styles

**Files:** Modify `src/app/globals.css` (rewrite the `@theme inline` block and base layer; move the iPhone-frame block to `src/components/ui/PhoneFrame.module.css`), `src/app/[locale]/layout.tsx` (fonts).

- [ ] **Step 1:** Tokens: `--color-ink: #1a1a2e`, `--color-canvas: #ffffff`, `--color-canvas-soft: #f7f7fb`, `--color-brand-green: #58cc02`, `--color-brand-green-ink: #2f6b00` (green text on white ≥ 4.5:1), `--color-brand-violet: #8549ba`, `--color-brand-violet-deep: #3b1f6e`, wash tints for the hero, the ten game pairs as `--game-<id>-wash` / `--game-<id>-deep`, radii (`--radius-card: 28px`, `--radius-pill: 9999px`), one shadow scale, spacing rhythm. Remove unused utilities (`gradient-*`, `coming-soon-card`, `store-pill`) after grepping their usages.
- [ ] **Step 2:** Fonts: `Fredoka` (600, 700) as `--font-display`, `Nunito` (400, 600, 700, 800) as `--font-body`, `subsets: ["latin", "latin-ext"]`, `display: "swap"`.
- [ ] **Step 3:** Verify contrast pairs with a small node script (ink on green, white on violet, deep on wash for each game) ≥ 4.5:1 for body text; record the table in the commit body.
- [ ] **Step 4:** Run lint, tsc, tests, build. Commit `feat(design): tokens, Fredoka and Nunito, contrast-checked pairs`.

### Task 10: Shell — header, footer, language, breadcrumbs

**Files:** Create `src/components/site/{SiteHeader,SiteFooter,LanguageSwitch,LanguageSuggestion,Breadcrumbs,SkipLink}.tsx`; modify `src/app/[locale]/layout.tsx`; delete the replaced `Header`, `HeaderShell`, `Footer`, `LanguageSwitcher` after migrating their tracking and consent hooks (`ReopenConsentLink`, `language_switched` event).

- [ ] **Step 1:** Header: logo + "Synapgeek" wordmark linking to the hub; nav items Games (hub `#games`), Cerebrum, About, Press from `pagePath`; language switch rendering the CURRENT page in the other locale (needs the `PageRef` of the page: pass it from each page via a `PageContext` server prop, never by parsing the URL); mobile menu as a disclosure (`<details>` or a minimal client island), keyboard and screen-reader complete.
- [ ] **Step 2:** Footer: legal links via `pagePath({kind:"legal"})`, permanent text link to the other-language version of the current page (crawlable), "Gérer mes cookies" (`ReopenConsentLink`), contact link to `pagePath({kind:"hub"}, locale, "contact")`, studio identity line.
- [ ] **Step 3:** `LanguageSuggestion`: client island shown only when `navigator.language` starts with `fr` on an English page (and vice versa), dismissible, stores the dismissal in `localStorage` (try/catch), links to the same page in the other locale; renders nothing on the server.
- [ ] **Step 4:** Smart App Banner: remove `itunes` from the locale layout; add it in the Cerebrum app and game pages' `generateMetadata` only.
- [ ] **Step 5:** Run lint, tsc, tests, build; screenshot `/`, `/fr`, `/privacy`, `/en/privacy` at 390 and 1440 (claude-in-chrome or Playwright) and check the header, footer, language links and skip link. Commit `feat(shell): header, footer, language switch and suggestion, breadcrumbs`.

### Task 11: Primitives

**Files:** Create in `src/components/ui/`: `PillButton.tsx` (replaces `Button`), `StoreBadges.tsx` (official badges, per-locale dimensions kept from `StoreButtons.tsx`, `app_store_click` tracking kept), `PhoneFrame.tsx` (+ module CSS; `next/image` screenshot, `priority` only on the hero), `GameCard.tsx` (poster 5:7, wash background, icon, name, genre, link; hover/focus lift), `AppCard.tsx`, `SectionBand.tsx` (tone: canvas | soft | violet-deep | game-wash), `FactStrip.tsx`, `StepList.tsx` (`<ol>`), `DifficultyTable.tsx` (`<table>` with caption), `FaqList.tsx` (`<details>`/`<summary>`, no JS), `TiltOnPointer.tsx` (client island, ±5°, off under reduced motion). Delete `Badge`, `Card`, `SectionHeading`, `Button`, `StoreButtons` once unused.

- [ ] **Step 1:** Write each component against the tokens only (grep: no `#` color literal in `src/components`).
- [ ] **Step 2:** Add a guard in `route-invariants.test.ts`: no hex color literal in `src/components/**` and `src/app/**/*.tsx`.
- [ ] **Step 3:** Do not ship an internal showcase page: each primitive is verified inside the real pages of Tasks 12 to 15 (screenshots at 390 and 1440).
- [ ] **Step 4:** Run lint, tsc, tests, build. Commit `feat(ui): primitives for the studio hub`.

## Phase E — Pages and wave-1 content

Skills for copy tasks, in order: `synapgeek-portfolio-rules`, `clean-code`, then read `docs/contrat/faits-cerebrum-3.0.0.md` and `asc-metadata.md` (writing rules). French is written natively in its own pass, never translated from English.

### Task 12: Hub page

**Files:** Modify `src/app/[locale]/page.tsx`; create `src/content/copy/{en,fr}/hub.ts`; delete `src/components/landing/*` once unused (keep `ContactForm` and the `/api/contact` route untouched).

- [ ] **Step 1:** Copy FR/EN: H1 "Synapgeek"; definition (EN example to adapt, then write FR natively): "Synapgeek is an independent French studio that makes mobile apps. Its first one, Cerebrum, brings classic and newer puzzle games together in a single offline app for iPhone, iPad and Android." (check 150-250 chars).
- [ ] **Step 2:** Page per the surface brief FIRST VIEWPORT: hero (H1, definition, StoreBadges, PhoneFrame with `homepage-<locale>` screenshot inside `TiltOnPointer`, Cerebrum icon overlap, pastel washes), AppCard (Cerebrum), `#games` grid of GameCards grouped by category, FactStrip (true facts only), studio band (violet-deep) linking to About, `#contact` section with the existing ContactForm.
- [ ] **Step 3:** JSON-LD: `organizationSchema` and `websiteSchema` move from the layout to the hub page only.
- [ ] **Step 4:** Run tests (content guards must pass), build; screenshots 390/1440 FR and EN. Commit `feat(pages): studio hub`.

### Task 13: Cerebrum app page

**Files:** Create `src/app/[locale]/[slug]/page.tsx` (app or section dispatch through `resolveSection` / app registry; unknown → `notFound()`), `src/content/apps/cerebrum/copy/{en,fr}.ts` (app part); modify `src/lib/structured-data.ts` (`mobileApplicationSchema(app, locale, copy)` co-typed `["MobileApplication","VideoGame"]`, `breadcrumbSchema(items)`; keep `faqPageSchema`).

- [ ] **Step 1:** `generateStaticParams`: for each locale, the app slugs plus the section slugs of that locale.
- [ ] **Step 2:** Copy FR/EN from `asc-metadata.md` facts: definition (H1 "Cerebrum"), categories with their games, daily challenge (one per day for the whole app, same grid for everyone, playable offline), progress (level path, stars, endless mode, leagues Bronze to Legend, avatar), good to know (offline, guest play, optional Apple/Google/Facebook sign-in, 16 languages, iPhone/iPad iOS 17+), free with or without Premium (ads model exactly as ASC, Premium removes forced ads and adds infinite lives, 5 hints a day per game, first mistake forgiven, daily gems, double gems after a win; theme packs Cinéma/Cuisine/Voyage not in Premium), FAQ (free? ads? offline? devices? languages? account deletion?).
- [ ] **Step 3:** Breadcrumbs (Synapgeek › Cerebrum), Smart App Banner metadata, `getAlternates({kind:"app",app})`.
- [ ] **Step 4:** Run tests, build, screenshots. Commit `feat(pages): Cerebrum app page`.

### Task 14: Game page template and wave-1 games

**Files:** Create `src/app/[locale]/[slug]/[game]/page.tsx`, `opengraph-image.tsx` at the same level (static at build, `next/og`, icon + name + genre on the game wash); extend `structured-data.ts` (`videoGameSchema(app, game, locale, copy)` with `gamePlatform`, `genre`, `isPartOf` the app, `publisher` the organization); copy for sudoku, pandoku, minesweeper, pixel-art, arrow-maze in both locales.

- [ ] **Step 1:** `generateStaticParams`: per locale, per app, the game slugs of that locale (`findGameBySlug` for resolution; unknown → `notFound()`).
- [ ] **Step 2:** Template per spec §7: breadcrumbs; H1 = in-app name; definition with genre; PhoneFrame screenshot on the game wash; "How to play" StepList (in-app tutorial wording where `hasTutorial`, otherwise the standard rules written plainly); "What Cerebrum adds" with DifficultyTable (real grid sizes from the fact file; no Trace star thresholds; Minesweeper first tap not guaranteed safe; Arrow Maze is relaxing, not a logic challenge; Cross Math respects operator precedence; each Word Search level is three grids); tips (original, adult); FAQ; other games of the same category; StoreBadges; "Updated on".
- [ ] **Step 3:** Copy for the five wave-1 games, FR then EN, each written from the facts; send each FR/EN pair to the App iOS session for a factual read (SendMessage to "App iOS - Q&A") and apply its corrections.
- [ ] **Step 4:** Run tests (content guards, registry, routes), build, `check:contract` locally, screenshots of two games at 390/1440. Commit `feat(pages): game page template and wave-1 games`.

### Task 15: About and Press

**Files:** `src/content/copy/{en,fr}/{about,press}.ts`; the `[slug]` page renders sections; `public/press/` (logo PNG/SVG, Cerebrum icon, 4 screenshots per locale, all renamed with `-v3`); `structured-data.ts` Organization enriched on About (`sameAs` = the two store developer pages only).

- [ ] **Step 1:** About copy: who (Synapgeek SAS, Frontenas, publisher of Cerebrum), what (mobile apps; the puzzle generation claim only once verified with the iOS session, otherwise omitted), how to reach us. No founder biography beyond the legal notice.
- [ ] **Step 2:** Press copy: fact sheet (name, publisher, platforms, languages, iOS release 2026-06-03, business model in one sentence, list of games with genres), downloads, `contact@synapgeek.com`.
- [ ] **Step 3:** Run tests, build, screenshots. Commit `feat(pages): About and Press`.

### Task 16: Legal pages, 404, store-redirect fallback, llms.txt, IndexNow

**Files:** Modify `src/components/LegalPage.tsx` (new styles; render consecutive `- ` lines of a paragraph as a `<ul>` without changing any legal text; keep it server-only), `src/app/not-found.tsx`, `src/app/cerebrum/play/page.tsx` (fallback styles, text from `Dictionary.play`), `public/llms.txt`; create `public/<indexnow-key>.txt`, `scripts/indexnow-ping.mjs`, npm script `indexnow`.

- [ ] **Step 1: Write the failing test** for the list rendering: a `formatText` unit test (`src/components/LegalPage.test.tsx` or a pure helper `src/lib/legal-format.ts` + test) turning `"Intro :\n- A\n- B"` into a paragraph plus a two-item list, and leaving text without dashes unchanged.
- [ ] **Step 2:** Implement, keep anchors (`id`, `tabIndex={-1}`), keep the URL truncation rule documented.
- [ ] **Step 3:** `llms.txt`: studio, app, every game page URL (EN and FR) with its definition sentence, honest model, legal URLs.
- [ ] **Step 4:** IndexNow: key file at the root, `scripts/indexnow-ping.mjs` posting the sitemap URLs to `https://api.indexnow.org/indexnow` (run manually after a production deploy, documented in CLAUDE.md).
- [ ] **Step 5:** Run tests, build, `check:contract`. Commit `feat: legal restyle with real lists, 404, llms.txt, IndexNow`.

## Phase F — Wave-2 content

### Task 17: Wave-2 games

**Files:** `src/content/apps/cerebrum/copy/{en,fr}.ts` (crossword, word-search, cross-math, trace, maze).

- [ ] **Step 1:** Write FR then EN for the five games from the facts (Crossword and Word Search: grids in French and English only; Trace: no star thresholds, no detailed Hard/Elite grids; Maze: crystals, bubble, rocket, Elite fog).
- [ ] **Step 2:** App iOS factual read, apply corrections.
- [ ] **Step 3:** Run tests, build. Commit `feat(content): wave-2 game pages`.

## Phase G — Verification, finish, documentation

### Task 18: Visual and technical verification

- [ ] **Step 1:** Full build, `next start`, `check:contract` local; `npx vercel build` and compare compiled redirects.
- [ ] **Step 2:** Screenshots desktop 1440 and mobile 390 of hub, app, two games, About, Press, privacy (FR), terms (EN), 404, into `.impeccable/review/`; validate each capture (no blank or half-loaded state).
- [ ] **Step 3:** Lighthouse mobile on hub, app and one game (targets: performance ≥ 90, accessibility 100, SEO 100); `impeccable detect --json` on changed UI files.
- [ ] **Step 4:** One fix batch, one confirmation round. Commit fixes.

### Task 19: Finish review and site review

- [ ] **Step 1:** Spawn `impeccable:impeccable-finish-reviewer` (fresh) with the request, the direction contract, the screenshots, the critique reference `.impeccable/mocks/decision/canon.png`, detector findings and `reference/craft-floor.md`; act on its disposition (recapture / rebuild / fix / ship).
- [ ] **Step 2:** `site-reviewer` (Opus) on the whole branch vs `origin/main`; fix rounds until mergeable.

### Task 20: DESIGN.md, CLAUDE.md restructure, PR

- [ ] **Step 1:** Spawn `impeccable:impeccable-documenter` to write `DESIGN.md` and `.impeccable/design.json` from the built site.
- [ ] **Step 2:** Restructure CLAUDE.md: a short root (what is true every session: contract URLs, rules, commands, process) plus `docs/contrat/{architecture,contenu,lancement}.md` and proximity `CLAUDE.md` in `src/app`, `src/content`, `src/components`; update the agent copies (`site-architect`, `site-reviewer`, `designer`).
- [ ] **Step 3:** Push `feat/studio-hub-rework`, open a PR stacked on the lot PRs, with the rollout checklist of spec §11 (owner per item: Adrien, App iOS session, Android session, Design System session). Never merge.
