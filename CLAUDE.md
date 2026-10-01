# Synapgeek Website

> Dernière vérification complète contre le code : 2026-09-12. Révisé le 2026-10-01
> (sections Commandes, Sous-agents, Skills auto-chargés, Variables d'environnement,
> Langues, Structure des routes, Architecture i18n, SEO : bascule sur l'anglais par défaut)
> sans re-vérification complète des autres. Quand ce fichier et le code divergent,
> **le code fait foi** — et cette ligne devient une tâche, pas une excuse.
> Les fichiers qui font contrat : `src/proxy.ts`, `src/lib/i18n.ts`, `src/lib/seo.ts`,
> `src/lib/app.ts`, `src/content/index.ts`, `src/content/types.ts`, `src/app/sitemap.ts`,
> `src/lib/routes.ts`, `src/lib/frozen-legal-paths.ts`, `src/lib/page-slugs.ts`,
> `next.config.ts`, `vercel.json`, et `docs/contrat/` (faits Cerebrum vérifiés, hors
> formatage Prettier).

## Contexte

Site web de Synapgeek, studio indie français développant **Cerebrum** (app de puzzles,
iOS **et** Android). Le site sert de landing page, héberge les trois pages légales
(Privacy Policy, CGU/EULA, mentions légales françaises), et fournit les URLs référencées
dans App Store Connect, dans la Play Console (formulaire Data Safety) et dans la config
AdMob consent (UMP).

## Stack technique

- **Framework** : Next.js `16.3.8` (App Router, `src/`) — version épinglée exactement,
  comme `eslint-config-next`. React épinglé à `19.2.8`.
- **Style** : Tailwind CSS 4.x (CSS-first, `@import "tailwindcss"` + `@theme inline {}`
  dans `src/app/globals.css`, pas de `tailwind.config.js`). Ce fichier de 1006 lignes EST
  le design system : tokens `--color-primary` (#58CC02), `--color-secondary` (#8549BA),
  `accent-blue/yellow/orange/coral/teal`, `text-primary/secondary/tertiary`, les 3
  variables de police, et des classes maison (`gradient-hero`, `gradient-cta`,
  `text-gradient`, `coming-soon-card`, `store-pill`). Primitives dans
  `src/components/ui/` : Badge, Button, Card, SectionHeading, StoreButtons. **Jamais de
  hex en dur, jamais un sixième bouton.**
- **Langage** : TypeScript strict mode
- **Linter** : ESLint 9 + eslint-config-next + Prettier
- **Email** : Nodemailer via SMTP Google Workspace
- **Captcha** : Google reCAPTCHA v2 (sur `/api/contact` uniquement)
- **Analytics** : Vercel Analytics + Vercel Speed Insights (sans cookie) + **Google
  Analytics 4** derrière **Consent Mode v2 régionalisé** (`src/lib/consent/`,
  `src/components/consent/`, montés dans `src/app/[locale]/layout.tsx`). Seul
  `analytics_storage` varie : `granted` par défaut hors UE/EEE/Royaume-Uni/Suisse, `denied`
  dedans tant qu'aucun choix explicite n'existe. Les trois signaux publicitaires
  (`ad_storage`, `ad_user_data`, `ad_personalization`) restent **`denied` partout,
  toujours** — ce site n'affiche aucune publicité, `ConsentBanner` ne les accorde jamais.
  GA4 (`gtag/js`, `strategy="lazyOnload"`) charge dès que `NEXT_PUBLIC_GA_MEASUREMENT_ID`
  existe (`ConsentBootstrap`), avec `cookie_expires: 34128000` (13 mois) et
  `cookie_update: false` (pas de prolongation glissante à chaque visite) posés dans le
  script inline de défauts pour garantir que la commande `config` précède tout
  `trackEvent`. Bandeau de consentement **maison** (`ConsentBanner`, pas de CMP tierce —
  Google Funding Choices abandonné, il exige un compte AdSense/Ad Manager que ce site n'a
  pas) : Accepter/Refuser au même niveau, choix stocké 6 mois dans `localStorage` (clé
  `sg-consent`, jamais un cookie), rouvrable via « Gérer mes cookies » dans le pied de page
  (`ReopenConsentLink`, toujours affiché).
- **Déploiement** : Vercel — un merge sur `main` publie en production. Tout passe par
  branche + PR. **Ne jamais merger ni promouvoir sans accord explicite d'Adrien.**
  Seule `main` déploie (`vercel.json` > `git.deploymentEnabled` : `"**": false`,
  `"main": true`, décision d'Adrien du 2026-10-01) : aucune preview de branche. Vercel lit
  ce réglage dans le commit poussé, donc toute branche doit partir d'un `main` qui le porte.
- **Langues** : **Anglais (défaut, sans préfixe)** + Français sous `/fr` (i18n maison via
  `src/content/`, pas de `next-intl`). Exception figée : les trois pages légales gardent
  leur schéma historique, français sans préfixe et anglais sous `/en/` (voir « Structure
  des routes »)

## Commandes

```bash
npm run dev       # Serveur de développement
npm run build     # Build de production
npm run start     # Serveur de production (build préalable requis)
npm run lint      # ESLint
npm run format    # Prettier — ÉCRIT les fichiers (npx prettier --check pour vérifier)
npm test          # vitest : invariants de routes (SSG, JSON-LD, redirects, sitemap…)
npm run check:contract  # URLs référencées par les stores, apex et www (réseau ; local ou prod)
```

Portes automatiques : `npm run lint`, `npm test`, `npm run build`, rejouées par la CI
(`.github/workflows/ci.yml`, sans secret). `check:contract` n'est pas dans la CI : à lancer
contre `next start` en local avant tout merge touchant routage, redirects ou
`.well-known` (aucune preview Vercel : seule `main` déploie), puis contre la production
juste après le merge. Tout le reste est humain ou passe par un sous-agent.

## Conventions de code

- Pas de `any` TypeScript implicite
- Composants React : functional components uniquement
- Images : `next/image` obligatoire
- Fonts : `next/font/google` — DM Sans (titres), Inter (corps). JetBrains Mono a été retirée.
- Pages légales : générées en SSG, lisibles sans JavaScript. `LegalPage.formatText()`
  n'interprète que `**gras**` et les paragraphes séparés par `\n\n`, plus l'auto-lien des
  URLs et emails. Pas de listes, pas de titres `###`. Une URL suivie d'une virgule ou
  entre parenthèses est **tronquée** par la regex `[^\s),]+` — et rien ne le détecte :
  ni lint, ni build.
- Aucun texte en dur dans les composants localisés : tout passe par `Dictionary`
  (`src/content/fr.ts` + `en.ts` + `types.ts`). ⚠ Dette connue : **4 ternaires
  `locale === "fr" ? … : …`** subsistent — dans `[locale]/layout.tsx` (lien « aller au
  contenu ») et dans `generateMetadata` de `[locale]/legal/page.tsx`,
  `[locale]/privacy/page.tsx` et `[locale]/terms/page.tsx` (description SEO).
  `Footer.tsx` a été assaini (ternaires remplacés par des clés `Dictionary`).
  `site-reviewer` refuse toute PR qui fait monter ce compte.
- Tout lien interne passe par `pagePath(pageId, locale, hash?)` de `src/lib/routes.ts` (et
  `absoluteUrl()` pour une URL complète). `getLocalePath()` n'existe plus : un test de
  `route-invariants.test.ts` échoue s'il réapparaît dans `src/`

## Structure des routes

Routes actives :

```
/                      → Landing page (EN, locale par défaut, sans préfixe), section FAQ
                         ancrée en `#faq`
/fr                    → Landing page (FR), `#faq`
/en                    → 308 vers `/` (query conservée) — `next.config.ts`
/en/<page>             → 308 vers `/<page>` pour chaque ancienne page anglaise NON légale
                         (`/en/cerebrum`…) : une règle LITTÉRALE par page, jamais de regex ni
                         de `/en/:path*` (elle capterait `/en/privacy`)
/#contact, /fr#contact → URLs de support. App Store Connect déclare `/#contact` (fr-FR) et
                         `/en#contact` (autres langues) ; `/en#contact` redirige désormais en
                         308 vers `/#contact`. L'URL de support française `/#contact` atterrit
                         donc sur l'accueil ANGLAIS tant que App Store Connect fr-FR n'est pas
                         basculé sur `/fr#contact` (suite côté session iOS). L'ancre
                         `id="contact"` de la landing (`Contact.tsx`) est une URL CONTRAT :
                         ne jamais la renommer ni la retirer, dans les deux langues
/privacy               → Privacy Policy en FRANÇAIS   /en/privacy (anglais)
/terms                 → CGU / EULA en FRANÇAIS       /en/terms (anglais)
/legal                 → Mentions légales en FRANÇAIS /en/legal (anglais)
                         Schéma légal FIGÉ (`FROZEN_LEGAL_PATHS`, `src/lib/frozen-legal-paths.ts`) :
                         l'app installée et les stores ouvrent `/privacy` en attendant du
                         français. `/fr/<page légale>` est TRANSITOIRE (200 + canonical vers
                         l'URL sans préfixe) en attendant une redirection 307
                         (`permanent: false`) posée dans un PR ultérieur, après preuve en
                         production (jamais 308 : un permanent se met en cache chez les clients)
/cerebrum/play         → Redirection QR → App Store / Play Store selon le User-Agent.
                         Les paramètres entrants (`?src=…`) sont transmis à la cible mais
                         ne peuvent jamais écraser un paramètre déjà présent dessus
                         (`withIncomingParams` ignore toute clé déjà sur l'URL cible) —
                         `?id=` ou `?ct=&pt=` ne peuvent donc plus détourner la destination
/play, /jouer          → 307 vers /cerebrum/play, query conservée (`next.config.ts`) —
                         QR historiques, JAMAIS casser
/api/contact           → Formulaire de contact (POST) — reCAPTCHA v2
/robots.txt            → src/app/robots.ts
/sitemap.xml           → src/app/sitemap.ts : `renderedPageIds()` × langues via `absoluteUrl()`
                         (8 URLs aujourd'hui), alternates hreflang
/llms.txt              → public/llms.txt, statique ; chaque URL synapgeek.com citée doit être
                         dans le sitemap (garde vitest)
/.well-known/apple-app-site-association
                       → Universal Links iOS. appID 6ZSKBP3TL7.com.synapgeek.cerebrumgame,
                         components /app/*. Apple exige application/json, sans extension
                         ni redirection — JAMAIS casser
/.well-known/assetlinks.json
                       → App Links Android. package com.synapgeek.cerebrum, empreinte de
                         DÉPLOIEMENT Play App Signing (pas celle d'upload). Google refuse
                         toute redirection sur /.well-known/ — JAMAIS casser
/account-deletion      → redirect 307 vers /privacy#account-deletion — URL déclarée dans
                         le formulaire Data Safety de la Play Console — JAMAIS casser
/en/account-deletion   → redirect 307 vers /en/privacy#account-deletion
/fr/account-deletion   → redirect 307 vers /privacy#account-deletion
```

Toutes les pages sont prérendues au build (**SSG pur**) sauf `/cerebrum/play` et `/api/contact`.
Trois fichiers seulement exportent `dynamic` — `/cerebrum/play` en `force-dynamic`
(il doit lire le User-Agent) et les deux route handlers `.well-known` en `force-static`
(prérendu exigé par Apple et Google). Aucun fichier n'exporte `revalidate`,
`dynamicParams`, `"use cache"` ni `cacheComponents`.

La 404 est `src/app/not-found.tsx`. Comme `src/app/layout.tsx` retourne `children` nu,
toute route hors de `src/app/[locale]/` rend son propre `<html lang>`/`<body>` — c'est le
cas de `not-found.tsx` et de `/cerebrum/play`.

Routes prévues (pas encore implémentées) : `/cerebrum`, les pages jeu, les sections du
registre (`src/lib/page-slugs.ts`), `/blog`. Elles n'entrent dans le sitemap qu'avec leur
livraison : `RENDERED_PAGE_IDS` dans `src/lib/routes.ts` est la source unique de ce qui
rend aujourd'hui, et `npm run check:contract` vérifie que chaque `<loc>` répond 200.

Ancres à préserver (URLs contractuelles hors du chemin) : `#account-deletion` et `#website`
dans la politique de confidentialité (formulaire Data Safety, lien du bandeau de consentement),
`#contact` sur la landing (App Store Connect).

## Architecture i18n

- **Locale par défaut** : `en` (pas de préfixe dans l'URL) — `DEFAULT_LOCALE` de
  `src/lib/i18n.ts`
- **Autres locales** : préfixe `/fr/`. Seules les pages légales font exception
  (`FROZEN_LEGAL_PATHS` : français sans préfixe, anglais sous `/en/`)
- **Proxy** (`src/proxy.ts`) : rewrite (jamais redirect) des URLs sans préfixe vers
  `/en/...`, sauf les chemins exacts de `FROZEN_LEGAL_PATHS` réécrits vers `/fr/...`
  (`/privacy-notes` n'est PAS figé : seuls les chemins exacts le sont). Matcher : `["/((?!_next|api|favicon\\.ico|.*\\..*).*)"]` — tout chemin
  contenant un point y échappe (d'où le passage direct de `/.well-known/*`).
  `LOCALE_FREE_ROUTES` exclut en plus les routes servies hors du segment `[locale]` : il
  vaut `["/cerebrum/play"]` et ne couvre PAS `/cerebrum`.
- **Contenu** : `src/content/fr.ts` et `src/content/en.ts`
- **Types** : `src/content/types.ts` (`Dictionary`)
- **Helpers** : `src/lib/i18n.ts` (`LOCALES`, `DEFAULT_LOCALE`, `generateStaticParams`),
  `src/lib/routes.ts` (`PageId`, `pagePath`, `absoluteUrl`, `alternatesFor`,
  `publishedPageIds`, `renderedPageIds`, `X_DEFAULT_LOCALE`), `src/lib/frozen-legal-paths.ts`
  (`FROZEN_LEGAL_PATHS`), `src/lib/page-slugs.ts` (slugs par langue),
  `src/content/index.ts` (`getDictionary`, `getLocale`), `src/lib/seo.ts`
  (`getAlternates(pageId, locale)`, `buildOpenGraph`), `src/lib/app.ts` (identité store)
- ⚠ `/fr/privacy`, `/fr/terms`, `/fr/legal` répondent encore 200 et ne sont dédoublonnées
  que par le canonical (vers l'URL sans préfixe). Ni noindexées ni sitemapées ; leur
  redirection 307 (`permanent: false`) vers l'URL sans préfixe arrivera dans un PR
  ultérieur, après preuve en production.
- Un segment qui n'est pas une locale connue (`/wp-login.php` : tout chemin contenant un
  point échappe au proxy et atterrit dans `[locale]`) déclenche `notFound()` dans
  `[locale]/layout.tsx` → vrai 404. **Jamais `dynamicParams = false`** pour ça. `/llms.txt`
  n'illustre PAS ce cas : servi statiquement depuis `public/`, il répond avant même
  d'atteindre le routing Next — jamais de `notFound()`.
- `pagePath("home", "fr")` renvoie `/fr`, sans slash final : `/fr/` répond 308. La racine
  anglaise est `/` (`absoluteUrl("home", "en")` = `https://synapgeek.com`, sans slash).
- Le sélecteur de langue du header ne rend ses liens qu'une fois ouvert — invisibles pour
  un crawler. Le lien permanent du footer (`dict.common.languageSwitch`) est ce qui relie
  les deux versions du site : ne pas le retirer.

## SEO (implémenté)

- `<title>` et `<meta description>` dynamiques par page et par locale. Le `<title>` et
  l'unique `<h1>` de la landing portent tous deux « Cerebrum » (`Hero.tsx`).
- La landing porte une section **FAQ** (`src/components/landing/FAQ.tsx`, ancre `#faq`) :
  le JSON-LD `FAQPage` reprend **exactement** le texte visible (`dict.landing.faq.items`,
  même tableau des deux côtés — aucune duplication de contenu).
- Open Graph complet (`og:image` comprise) via `buildOpenGraph()` de `src/lib/seo.ts`,
  appelé par chaque page du segment `[locale]`. La fusion des métadonnées de Next est
  superficielle : un `openGraph` partiel dans une page **écrase** celui du layout et fait
  disparaître l'image. Toujours passer par le helper. `/cerebrum/play` et la 404 n'en ont pas.
- OG image custom (`public/images/brand/og-image.jpeg`)
- Hreflang `<link rel="alternate">` et canonical sur toutes les pages. **x-default pointe
  vers l'anglais** (`X_DEFAULT_LOCALE` dans `src/lib/routes.ts`), qui coïncide désormais
  avec `DEFAULT_LOCALE` (`en`) mais reste une constante distincte. Les alternates viennent
  de `alternatesFor(pageId)`, le canonical de `absoluteUrl()` : jamais écrits à la main.
- Smart App Banner Safari via `itunes: { appId }` dans le layout de locale : il s'applique
  donc à toutes les pages du segment `[locale]`, dans les deux langues
- `sitemap.xml` : `renderedPageIds()` × `LOCALES` (aujourd'hui `/`, `/privacy`, `/terms`,
  `/legal` × 2 langues), alternates `alternatesFor()`, `lastModified` réels
  (`lastModifiedFor()` : date du dictionnaire pour le légal, une constante datée par type
  de page sinon). Jamais `/cerebrum/play`, `/en/<page>` ni `/fr/<page légale>`
- `robots.txt` : `Allow: /` pour `*` et, nommés explicitement, OAI-SearchBot, ChatGPT-User,
  GPTBot, PerplexityBot, Perplexity-User, ClaudeBot, Claude-SearchBot, Claude-User,
  Google-Extended, Applebot-Extended, Bingbot ; aucun `Disallow`, aucun `noindex` dans
  `src/` (sauf `/cerebrum/play`, marquée `robots: { index: false }`)
- **`src/lib/structured-data.ts` est la source unique de tout le JSON-LD du site** — aucun
  objet `@type` schema.org ne doit être construit ailleurs. Builders exposés :
  `organizationSchema` (Organization, UN seul noeud, émis par le layout de locale sur
  toutes les pages), `websiteSchema` (WebSite, layout de locale), `softwareApplicationSchema`
  (SoftwareApplication, landing uniquement — `operatingSystem: ["iOS", "Android"]`),
  `faqPageSchema` (FAQPage, landing) et `webPageSchema` (WebPage, pages légales).
  Invariants testés (`structured-data.test.ts`) : `@id` identiques dans les deux langues
  (`https://synapgeek.com/#organization`, `/#website`, `/cerebrum#app`), `url` de
  Organization et WebSite = `https://synapgeek.com/`, `inLanguage` en BCP 47 (`en`, `fr` ;
  les 16 langues de l'app aussi), jamais `fr_FR`.
- `public/llms.txt` : résumé du site et des faits Cerebrum pour les agents/LLM, statique.
  Ses URLs suivent le schéma de langue (`https://synapgeek.com` anglais,
  `/fr` français, légal figé) ; un test vitest les compare au sitemap
- `app-ads.txt` pour la vérification AdMob

## Sécurité (implémenté)

- 7 headers via `vercel.json` : HSTS, X-Content-Type-Options, X-Frame-Options,
  X-XSS-Protection, Referrer-Policy, Permissions-Policy, X-DNS-Prefetch-Control
- DDoS protection automatique Vercel
- `/api/contact` : reCAPTCHA v2, `EMAIL_REGEX`, `MAX_*_LENGTH`, `escapeHtml`,
  `stripNewlines`, messages d'erreur constants
- Aucune `process.env` sans `NEXT_PUBLIC_` lue hors de `src/app/api/`
- Footer sans mailto ; ⚠ mais `LegalPage.tsx` transforme toute adresse du contenu légal
  en `mailto:` — `contact@` et `privacy@` sont donc en clair sur `/privacy`, `/terms`, `/legal`
- `vercel.json` pose `Cache-Control: public, max-age=604800, stale-while-revalidate=86400`
  sur `/images/*`. Conséquence : remplacer une image sous ce même nom de fichier ne suffit
  pas, l'ancienne version reste servie aux clients (CDN et navigateurs) jusqu'à 7 jours.
  Pour changer une image, **renommer le fichier** (et mettre à jour ses références) ou
  invalider le cache Vercel — jamais compter sur un simple écrasement.

## Assets (structure public/)

```
public/
├── app-ads.txt
├── llms.txt
└── images/
    ├── brand/
    │   ├── logo-synapgeek.png       (logo cerveau coloré, fond transparent)
    │   ├── logo-original.png        (logo haute résolution)
    │   ├── og-image.jpeg            (Open Graph)
    │   ├── cerebrum-icon.png        (icône de l'app)
    │   ├── badge-appstore-fr.svg    badge-appstore-en.svg
    │   └── badge-googleplay-fr.png  badge-googleplay-en.png
    ├── games/                        (icônes de jeu, reprises du design-system)
    │   ├── feature-sudoku.webp      feature-pandoku.webp
    │   ├── feature-minesweeper.webp feature-pixelart.webp
    │   ├── feature-crossmath.webp   feature-crosswords.webp
    │   ├── feature-wordsearch.webp  feature-trace.webp
    │   └── feature-maze.webp        feature-arrowmaze.webp
    └── hero/
        ├── hero-bg-desktop.webp     hero-bg-mobile.webp
        └── v3/
            ├── screen-home-{fr,en}.webp      screen-pandoku-{fr,en}.webp
            ├── screen-pixelart-{fr,en}.webp  screen-daily-{fr,en}.webp
            └── screen-progression-{fr,en}.webp
```

Les icônes de jeu (240×240) viennent des icônes LIVRÉES dans l'app iOS
(`cerebrum-ios/Cerebrum/Assets.xcassets/Icons/Games/<jeu>-icon.imageset`, le @3x).

Les captures du slider sont **localisées** : `IPhoneSlider` compose le chemin en
`<SCREENSHOT_DIR>/screen-<écran>-<locale>.webp` (`SCREENSHOT_DIR` = `/images/hero/v3`).
Elles viennent de
`cerebrum-design-system/marketing/ASC-images/release-3.x.x/raw-screenshot/iphone`
(1320×2868, iPhone 16 Pro Max), converties en webp 800 px de large. Le dossier est versionné
(`v3`) à cause du cache 7 jours de `/images/*` : un nouveau lot de captures = un nouveau
dossier (`v4`…), jamais un écrasement. Écrans retenus : `homepage` (→ `home`), `pandoku`,
`pixelart-b` (→ `pixelart`), `daily`, `progression`.

`cerebrum-icon.png` a été réduite de 1024 px à 512 px (poids ≈ 459 Ko).

Tout est en `.webp` sauf les logos (`.png`), l'OG image (`.jpeg`), l'icône Cerebrum
(`.png`), les badges Google Play (`.png`) et les badges App Store (`.svg` — asset fourni
par Apple, à ne pas rasteriser). Les badges
stores ont des dimensions codées en dur **différentes par locale** (`StoreButtons.tsx`).

## Règles critiques

- **JAMAIS casser les URLs `/privacy`, `/terms`, `/legal` et `/account-deletion`**
  (+ pendants `/en/`, `/fr/`) — référencées dans App Store Connect, dans la config AdMob
  consent (UMP) et dans le formulaire Data Safety de la Play Console. Un 404 = rejet
  potentiel de Cerebrum sur l'App Store ou Google Play. **L'app Android pointe le host
  `www.synapgeek.com`** : `www` est aussi critique que l'apex.
- **Liens web qui ouvrent l'app (Universal Links / App Links) : sujet ABANDONNÉ** par Adrien
  le 2026-09-12. L'app se télécharge et s'ouvre normalement ; aucune session ne doit relancer
  ce chantier (entitlement iOS, manifeste Android, page de repli `/app/*`). Les deux fichiers
  `/.well-known/*` restent servis car ils sont inoffensifs ; s'ils sont un jour modifiés, garder
  des route handlers (un fichier sans extension dans `public/` sort en
  `application/octet-stream`).
- **JAMAIS de lien vers un autre site du portefeuille Synapgeek** (Word Search Trove,
  Maze Foundry). Règle du skill `synapgeek-portfolio-rules` ; `site-architect` rend NO-GO
  d'emblée et `site-reviewer` classe bloquant.
- **`/cerebrum/play` (cible des QR), `/play` et `/jouer` (redirections) ne doivent jamais
  changer ni disparaître** : l'URL est encodée dans des QR codes imprimés (chevalets de
  comptoir) qui vivront des mois. Ne jamais créer `[locale]/cerebrum/play`.
- **JAMAIS de vente de contenu digital sur le site** — tout achat passe par StoreKit 2
  (iOS) ou Google Play Billing (Android) dans l'app (guideline Apple 3.1.1).
- **JAMAIS de lien de paiement externe** pour du contenu consommable dans l'app.
- Les pages légales doivent rester accessibles sans JavaScript (SSG).
- HTTPS obligatoire (géré par Vercel).
- La privacy policy doit refléter **exactement** les données collectées par l'app
  (correspondance avec App Store nutrition labels et `PrivacyInfo.xcprivacy`).

## Cerebrum — Infos app

Repos (tous sous `/Users/adrienmonte/Documents/projects/synapgeek/cerebrum/`) :
`cerebrum-ios`, `cerebrum-android`, `cerebrum-design-system`, `cerebrum-generator`.

**Versions** : l'App Store sert la **3.0.0** depuis le 2026-09-28 (bundle
`com.synapgeek.cerebrumgame`, gratuit, classée 4+). Android **3.0.0** est publié sur Google
Play depuis le 2026-10-01 (package `com.synapgeek.cerebrum` — noter que le bundle iOS et le
package Android **diffèrent**, ce n'est pas une coquille). Source de ces deux dates : Adrien.

### Jeux

**Les versions 3.0.0 publiées annoncent 10 jeux en français et en anglais, 8 ailleurs.**
Logique et chiffres : Sudoku, Pandoku (Star Battle), Démineur/Minesweeper, Pixel Art
(nonogrammes, « logimages » en français), Cross Math (mots croisés de calcul). Mots :
Mots Croisés/Crossword, Mots Mêlés/Word Search. Parcours : Trace (un seul trait),
Labyrinthe/Maze, Arrow Maze (casse-tête de flèches). Mots Croisés et Mots Mêlés n'existent
qu'en français et en anglais : dans les 14 autres langues de l'app (16 au total), le joueur
n'en voit que 8. Le site présente les 10 jeux, **sans jamais écrire de nombre de jeux ni de
niveaux** (ni « six », ni « 10 jeux », ni « 1000+ ») : la liste nommée reste vraie quelle que
soit la langue. Chaque jeu maison est accolé à son genre générique. Textes de référence :
`cerebrum-design-system/marketing/ASO/3.x.x/` (`asc-metadata.md`, `geo-assistants-ia.md`).

Nom « Zip » : c'est le **nom de code interne** de Trace (`GameType.zip`, `rawValue "zip"`
dans iOS et Android), pas un onzième jeu. Ne jamais écrire « Zip » (ni « Queens », ni
« Picross ») sur le site. Les « cristaux » ramassés au Labyrinthe ne sont pas les « gemmes »
(la monnaie).

- Difficultés : Facile, Moyen, Difficile et Élite pour Sudoku, Cross Math, Trace, Labyrinthe,
  Pandoku, Démineur et Pixel Art ; trois seulement (pas d'Élite) pour Mots Croisés, Mots
  Mêlés et Arrow Maze. Ne jamais écrire « de Facile à Élite » pour tous les jeux.
- 100 niveaux de progression par difficulté + mode Infini (chiffres internes : jamais publiés
  sur le site)
- **Un seul défi quotidien par jour** pour toute l'app : le joueur choisit son jeu, la grille
  est la même pour tous (jamais « un défi quotidien dans chaque jeu »). Séries de jeu
  (streaks), trophée mensuel.

Formulations à respecter sur le site (vérifiées côté iOS 3.0.0, Android non vérifié) :

- Modèle économique : gratuit **avec publicité** (bannière pendant la partie, pubs entre
  certaines parties), pubs récompensées toujours facultatives. Premium (semaine, mois, an) =
  « pas de pub imposée », jamais « sans pub » ni « zéro pub » (récupérer une série perdue
  passe toujours par une pub). Les packs Cinéma, Cuisine et Voyage sont le seul achat de
  contenu et ne sont pas inclus dans Premium. Aucun prix publié sur le site.
- Aucune note ni aucun avis affiché (trop peu de notes ; aucune aux États-Unis).
- Démineur : le premier tap n'est pas garanti sûr. Arrow Maze est un jeu de détente, pas un
  « défi de logique ». Cross Math respecte la priorité des opérations. Aucun seuil d'étoiles
  de Trace.
- Live Activity et VoiceOver sont des fonctions iOS : ne pas les attribuer à Android.

### Fonctionnalités

- Progression (étoiles, XP, ligue Bronze → Legend selon le score cumulé), monnaie virtuelle
  (gemmes), collection d'avatars. Le classement par jeu est **masqué dans l'app iOS 3.0.0**
  (`FooterView.swift`, « Leaderboard is hidden for now ») : ne jamais l'annoncer sur le site.
  L'écran existe encore dans le code Android (non vérifié côté stores).
- Mode hors-ligne local-first : **SwiftData** sur iOS, **Room + DataStore** sur Android,
  cache Firestore persistant par-dessus sur les deux

### Achats in-app

Montants relevés dans `Configuration.storekit` — un fichier de **test** StoreKit configuré
`_storefront: "USA"` / `_locale: "en_US"`, donc affiché en **dollars** dans Xcode ; seul un
commentaire de `StoreProductIDs.swift` parle d'euros. **App Store Connect et la Play Console
font foi** : ne jamais citer ces prix dans du contenu publié sans les revérifier. La fiche
Play affiche d'ailleurs « $0.99 - $22.99 per item », plafond sans équivalent ci-dessous.

**Consommables** : 500 gemmes 1,99 € · 1 500 gemmes 4,99 € · 5 000 gemmes 9,99 €
**Non-consommables** : Starter Pack 300 gemmes 0,99 € (un par utilisateur) ·
3 packs de thèmes Crossword/Word Search (cinema, food, travel) 2,99 € chacun
**Abonnements Premium** : hebdomadaire 2,99 € · mensuel 4,99 € · annuel 19,99 €
**Abonnements Sans publicité** (mensuel 2,99 €, annuel 14,99 €) : **legacy**,
grandfathered, exclus de `availableForPurchase` — plus vendables à de nouveaux utilisateurs.

Aucun produit « à vie » n'existe.

### Stack technique iOS

- **Swift** + **SwiftUI**
- **Firebase** : Analytics, Crashlytics, Performance, Firestore, Auth, Functions,
  **Messaging** (push + tokens FCM), **App Check activé** (App Attest sur appareil,
  debug provider sur simulateur). ⚠ `FirebaseStorage` et `FirebaseDatabase` sont liés au
  target mais n'ont **aucun site d'appel** — ne pas les déclarer comme collectant quoi que
  ce soit.
- **Meta / Facebook SDK** : Sign-In + App Events (`MetaEventsService.swift`), gatés par le
  consentement publicitaire
- **Google Mobile Ads** (AdMob) — App ID `ca-app-pub-2587609832551275~3649546176`.
  Formats réellement servis en 3.0.0 : bannières, interstitiels, récompensées (rewarded).
  L'App Open est désactivée/commentée depuis le 20/05/2026 — à ne pas décrire comme
  active, ni comme définitivement abandonnée.
- **Auth** : Apple, Google, Facebook, Anonymous. Aucun point d'entrée UI email/mot de passe
  (zéro `SecureField`), mais le chemin reste appelable en API
  (`AuthenticationViewModel.signIn(email:password:)`) — ne pas conclure qu'il est supprimé.
- **Consent** : UMP (GDPR/EEE) + ATT (IDFA). iOS pointe l'apex
  (`https://synapgeek.com/privacy`) ; **Android pointe `https://www.synapgeek.com/privacy`
  et `/terms`** (`strings.xml`) et déclare ses App Links sur le host `www`. Le sous-domaine
  `www` est donc une dépendance dure au même titre que l'apex.
- **SKAdNetwork** : 58 réseaux déclarés dans `Info.plist`
- **Stockage local** : SwiftData (cache 100 MB Firestore)
- iPhone + iPad, portrait uniquement

### Données collectées

| Catégorie     | Données                                                                                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Compte        | Firebase UID, email, nom, photo (selon provider)                                                                                                              |
| Gameplay      | Scores, temps, indices, erreurs, étoiles, niveaux, difficulté                                                                                                 |
| Progression   | Streaks, gemmes, avatars, trophées, XP, ligue                                                                                                                 |
| Appareil      | Type, OS, langue, fuseau horaire, version de l'app, diagnostics                                                                                               |
| Notifications | Token FCM, tokens ActivityKit (push-to-start, update), état d'activation — document Firestore `users/{uid}/devices/{deviceId}`, purgé par `deleteUserAccount` |
| Publicité     | IDFA (ATT) / AAID (UMP en EEE/UK/Suisse), interactions pubs ; events de conversion Meta si consentement                                                       |
| Transactions  | Historique minimal en Firestore `users/{uid}` : productId, type, date, plateforme (pas de données de paiement)                                                |

**Non collecté** : santé, contacts, photos, caméra, calendrier, microphone. L'app ne
demande jamais explicitement la position (aucun CoreLocation, aucune clé `NSLocation*`) ;
Google AdMob déduit néanmoins une localisation approximative à partir de l'IP à des fins
publicitaires, et le SDK UMP l'utilise pour détecter l'EEE — la privacy policy le
documente explicitement (section « Publicités et technologies de suivi »).

### Suppression de compte

Implémentée dans l'app (Profil > Supprimer le compte). Cloud Function `deleteUserAccount()`
supprime : Firestore subcollections, document utilisateur, leaderboards, Firebase Auth.

### Public cible

13 ans et plus dans les CGU, pas de mécanisme COPPA. ⚠ La fiche App Store est classée
**4+** — voir « Points à trancher ».

## Sous-agents

Trois sous-agents dans `.claude/agents/`. Deux jugent, un seul écrit.

| Agent            | Quand                                                                                      | Écrit ? | Rend                              |
| ---------------- | ------------------------------------------------------------------------------------------ | ------- | --------------------------------- |
| `site-architect` | AVANT d'implémenter — routing, URL légale, mode de rendu, i18n, indexation, variable d'env | Non     | **GO / GO-avec-réserves / NO-GO** |
| `designer`       | Conception et implémentation UI/UX (Tailwind 4, composants, assets)                        | **Oui** | du code                           |
| `site-reviewer`  | APRÈS implémentation, `lint` et `build` verts, avant merge                                 | Non     | **mergeable oui / non**           |

Ordre attendu sur tout chantier non trivial, plan formel ou pas :
`site-architect` → implémentation (`designer` si c'est de l'UI) → `site-reviewer`.
Un NO-GO ou un « mergeable non » se corrige dans la session principale, jamais par
l'agent qui l'a rendu.

Règles de process (leçons de Word Search Trove) :

- Architecte et reviewer ne modifient jamais le code.
- Chaque brief de tâche recopie la liste ET l'ordre des skills à invoquer : une règle portée
  seulement par les contraintes globales d'un plan a été violée 3 tâches sur 5.
- Devant une maquette validée, l'agent l'implémente ou s'arrête et escalade, jamais il ne diverge.
- Agents écrivains en parallèle : un worktree chacun ; rien n'est commité dans l'arbre
  partagé pendant un workflow. Un process ne se tue que par son PID noté, port dédié par
  serveur. Preuve de mutation : copie isolée (`git archive | tar -x`, jamais `cp`/`rsync`).
- Génération d'images nbpro : plafond quotidien partagé par toute la machine (~0,13 USD
  l'image en pro). Plafond atteint : stop et rapport, jamais un mode CLI, jamais lire la
  variable ni `~/.claude.json`. Sortie d'abord au scratchpad, puis import avec conversion
  et budget de poids.
- Modèle passé EXPLICITEMENT à chaque sous-agent : Haiku mécanique et docs ; Sonnet
  CSS/layout/composant simple et vérifications factuelles ; Opus état, frontière client,
  a11y fine, architecture et revues. Un correctif après revue ne part jamais sur Haiku.
- Faits Cerebrum : les fiches store en vigueur et les faits vérifiés (docs ASO de
  `cerebrum-design-system/marketing/ASO/`, sessions iOS/Android/Design System) ; copy selon
  `geo-assistants-ia.md` du même dossier.

## Skills auto-chargés

Le contenu réel vit dans `.agents/skills/` (versionné par git) ; `.claude/skills/<nom>`
n'est qu'un symlink vers `../../.agents/skills/<nom>`. L'inventaire et la provenance
(source GitHub + hash) sont dans `skills-lock.json`. **23 skills installés**, plus `design-references` (local, absent de `skills-lock.json`).

| Skill                               | Quand l'utiliser                                                               |
| ----------------------------------- | ------------------------------------------------------------------------------ |
| `next-best-practices`               | Toute création/modification de composant, route, ou page Next.js               |
| `next-cache-components`             | Caching, PPR, `use cache`, `cacheLife`, `cacheTag`                             |
| `next-dev-loop`                     | Vérifier le comportement runtime après édition — nécessite un `next dev` lancé |
| `next-cache-components-adoption`    | Activer `cacheComponents` et traiter les routes bloquantes                     |
| `next-cache-components-optimizer`   | Navigation instantanée sous PPR (exige Next 16.3+)                             |
| `next-partial-prefetching-adoption` | Activer `partialPrefetching`, arbitrer les `<Link prefetch>`                   |
| `vercel-react-best-practices`       | Écriture ou refactoring de composants React, optimisation perf                 |
| `vercel-composition-patterns`       | Architecture de composants, patterns de composition React                      |
| `tailwind-design-system`            | Création de composants UI, design tokens, design system                        |
| `typescript-advanced-types`         | Types complexes, generics, utility types                                       |
| `web-accessibility`                 | Tout travail sur l'UI — toujours vérifier l'accessibilité (WCAG 2.1)           |
| `performance-optimization`          | Bundle size, lazy loading, code splitting                                      |
| `webapp-testing`                    | Tests d'interface, vérification du rendu, screenshots Playwright               |
| `shadcn`                            | Ajout ou modification de composants shadcn/ui                                  |
| `seo-audit`                         | Audit SEO, meta tags, indexation, Core Web Vitals                              |
| `page-cro`                          | Optimisation de conversion sur les pages marketing/landing                     |
| `schema-markup`                     | Données structurées JSON-LD, rich snippets Google                              |
| `analytics-tracking`                | Tracking analytics, events, conversions, GA4/Vercel Analytics                  |
| `find-skills`                       | Quand une fonctionnalité manque — chercher si un skill existe                  |
| `legal`                             | Rédaction/audit des pages légales conformes App Store, GDPR, CCPA              |
| `app-store-review`                  | Conformité App Store Review Guidelines, privacy manifests                      |
| `privacy-policy`                    | Scaffold structuré de privacy policy                                           |
| `localization-strategy`             | SEO multilingue (hreflang, structure URLs i18n, keywords)                      |
| `design-references`                 | AVANT toute idéation visuelle : moodboard, « Parti pris » écrit (skill local)  |

**Quatre skills obligatoires vivent HORS du repo** (niveau utilisateur ou plugin) et ne
sont donc pas dans ce tableau : `clean-code` (standards de code maison — c'est lui qui
définit le format de verdict de `site-reviewer`), `synapgeek-portfolio-rules` (règles
inter-sites), `vercel:nextjs`, `vercel:react-best-practices`. Un clone frais ne les a pas.

Le serveur MCP `shadcn` est déclaré dans `.mcp.json` (Adrien l'approuve au démarrage de
session) : explorer avec `view`, réécrire en style maison, jamais ajouter tel quel.

**Règle** : Ne pas attendre qu'on demande explicitement un skill. Si la tâche en cours
correspond à un skill, le lire et appliquer ses recommandations automatiquement.

⚠ Les 3 skills Cache Components / Partial Prefetching supposent un modèle de rendu que ce
site n'a pas (SSG pur) ; l'optimizer exige Next 16.3+, version désormais installée (16.3.8),
mais le modèle de rendu reste le blocage. Ils ne se déclenchent que si on demande
explicitement une migration.

## Variables d'environnement

```
SMTP_USER=adrien.monte@synapgeek.com    # Login SMTP Google Workspace
SMTP_PASS=****                           # App password Google
CONTACT_EMAIL=contact@synapgeek.com      # Destinataire du formulaire de contact
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=****      # reCAPTCHA v2 site key
RECAPTCHA_SECRET_KEY=****                # reCAPTCHA v2 secret key
NEXT_PUBLIC_GA_MEASUREMENT_ID=****       # GA4 — chargé via ConsentBootstrap, derrière Consent Mode v2
                                          # et le bandeau maison ConsentBanner. Voir
                                          # src/lib/consent/ et src/components/consent/.
```

En local dans `.env.local` (couvert par le `.env*` du `.gitignore`) ; il n'y a pas de
`.env.example`. Toute variable ajoutée doit être configurée dans Vercel en **production ET
preview**, et ajoutée ici. Toute variable `NEXT_PUBLIC_*` est figée au **build** (inlinée
dans le bundle) : la changer dans Vercel n'a d'effet qu'au prochain déploiement, jamais à
chaud. Ne PAS configurer `NEXT_PUBLIC_GA_MEASUREMENT_ID` en preview avec l'ID de production
— cela ferait remonter le trafic de preview dans les données GA4 de prod ; soit l'omettre en
preview (GA4 ne charge alors pas, cf. `ConsentBootstrap`), soit y mettre une propriété GA4
distincte.

`REPLICATE_API_TOKEN` n'est plus utilisé par aucun sous-agent (le `designer` passe par
nbpro) : **rien à provisionner dans Vercel**, et il peut être retiré de `.env.local`.

⚠ `WAITLIST_WEBHOOK_URL` est orpheline : plus aucune référence dans le code (route waitlist
supprimée), mais elle peut subsister dans les variables d'environnement Vercel — à
supprimer là-bas si elle y est encore.

## Événements GA4

`section_viewed` (IntersectionObserver, seuil 0.3) · `app_store_click` ·
`contact_form_submit` · `language_switched`
— émis via `src/lib/gtag.ts`, `src/hooks/useTrackView.ts`, `src/components/TrackSection.tsx`.

## Identité de l'éditeur (publiée sur /legal)

Synapgeek SAS, capital 1 000 € · 185 chemin des Brosses, 69620 Frontenas ·
RCS Villefranche-Tarare 102 429 826 · SIRET 102 429 826 00013 · APE 62.01Z ·
TVA FR86 102 429 826 · Directeur de la publication : Adrien Monte · Hébergeur : Vercel Inc.

Ces données doivent rester cohérentes avec App Store Connect et la Play Console.

## Emails

- **contact@synapgeek.com** — Contact général, destinataire du formulaire, CGU
- **privacy@synapgeek.com** — Questions données personnelles, RGPD, privacy policy
- **adrien.monte@synapgeek.com** — Dev, compte SMTP

## Points à trancher

Contradictions constatées, non arbitrées — à lever, pas à recopier.

1. **Questionnaire App Privacy d'App Store Connect** : la privacy policy documente
   désormais explicitement une localisation approximative déduite de l'IP par AdMob/UMP
   (`fr.ts`/`en.ts`, section publicité). À recouper avec les réponses déclarées dans le
   questionnaire App Privacy (nutrition label) d'App Store Connect et le formulaire Data
   Safety de la Play Console, que je n'ai pas pu lire d'ici — s'assurer qu'ils déclarent
   bien une collecte de localisation approximative à finalité publicitaire.
2. **Classification d'âge** : CGU à 13+, fiche App Store à **4+**, fiche Play à
   **« Everyone »** avec le badge **« Contains ads »** (vérifié en ligne). Une app classée
   tout public qui sert de la pub personnalisée (IDFA/AAID, SDK Meta, 58 réseaux
   SKAdNetwork) sans age gate relève de la Families policy de Google — c'est le risque de
   suspension le plus concret des trois, et il ne se règle pas dans App Store Connect.
3. **Clause de juridiction des CGU** : `fr.ts` et `en.ts` (section droit applicable)
   soumettent les litiges à « la compétence exclusive des tribunaux de Paris », alors que
   le siège social de Synapgeek SAS (mentions légales du même site, `/legal`) est à
   Frontenas (69620), pas à Paris. À faire trancher par un juriste avant de corriger.
4. **Consent Mode avancé hors zone RGPD** : `ConsentBootstrap` pousse `analytics_storage:
"granted"` par défaut à tout visiteur hors des 43 juridictions de `GDPR_REGIONS`, donc
   des signaux sans cookie partent vers Google avant tout choix explicite. Ce point n'a
   jamais été soumis à un avis juridique dédié pour synapgeek.com (réutilisation de
   mécanisme depuis Word Search Trove) — l'arbitrage doit être validé explicitement, pas
   seulement hérité.
5. **Mesures améliorées GA4** : le défilement et les clics sortants (« enhanced
   measurement ») sont activés par défaut côté admin GA4, indépendamment de ce dépôt — à
   vérifier dans l'admin GA4 que leur périmètre reste cohérent avec ce que la privacy
   policy documente comme collecté.
6. **`GDPR_REGIONS` de Word Search Trove** : la liste de `src/lib/consent/regions.ts` vient
   d'être corrigée ici pour couvrir les territoires ultrapériphériques français à code ISO
   propre (GF, GP, MQ, RE, YT, MF) et Åland (AX) — jusque-là absents malgré une liste UE
   nominalement complète. La liste source dans Word Search Trove porte le même défaut et
   n'a pas encore été corrigée.

---

Les trois sous-agents de `.claude/agents/` contiennent des copies partielles de ce
fichier. Quand celui-ci change, les relire — sinon ils jugent contre une version périmée.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
