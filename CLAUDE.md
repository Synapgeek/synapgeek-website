# Synapgeek Website

> Vérifié contre le code le 2026-09-12. Quand ce fichier et le code divergent,
> **le code fait foi** — et cette ligne devient une tâche, pas une excuse.
> Les fichiers qui font contrat : `src/proxy.ts`, `src/lib/i18n.ts`, `src/lib/seo.ts`,
> `src/lib/app.ts`, `src/content/index.ts`, `src/content/types.ts`, `src/app/sitemap.ts`,
> `next.config.ts`, `vercel.json`.

## Contexte

Site web de Synapgeek, studio indie français développant **Cerebrum** (app de puzzles,
iOS **et** Android). Le site sert de landing page, héberge les trois pages légales
(Privacy Policy, CGU/EULA, mentions légales françaises), et fournit les URLs référencées
dans App Store Connect, dans la Play Console (formulaire Data Safety) et dans la config
AdMob consent (UMP).

## Stack technique

- **Framework** : Next.js `16.1.6` (App Router, `src/`) — version épinglée exactement,
  comme `eslint-config-next`. React épinglé à `19.2.3`.
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
- **Langues** : Français (défaut) + Anglais (i18n maison via `src/content/`, pas de `next-intl`)

## Commandes

```bash
npm run dev       # Serveur de développement
npm run build     # Build de production
npm run start     # Serveur de production (build préalable requis)
npm run lint      # ESLint
npm run format    # Prettier — ÉCRIT les fichiers (npx prettier --check pour vérifier)
npm test          # vitest : invariants de routes (SSG, JSON-LD, redirects, sitemap…)
npm run check:contract  # URLs référencées par les stores, apex et www (réseau ; preview/prod)
```

Portes automatiques : `npm run lint`, `npm test`, `npm run build`, rejouées par la CI
(`.github/workflows/ci.yml`, sans secret). `check:contract` n'est pas dans la CI : à lancer
contre la preview ou la production avant tout merge touchant routage, redirects ou
`.well-known`. Tout le reste est humain ou passe par un sous-agent.

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
- Tout lien interne passe par `getLocalePath()`

## Structure des routes

Routes actives :

```
/                      → Landing page (FR, locale par défaut, sans préfixe), section FAQ
                         ancrée en `#faq`
/en                    → Landing page (EN), `#faq`
/privacy               → Privacy Policy (FR)          /en/privacy
/terms                 → CGU / EULA (FR)              /en/terms
/legal                 → Mentions légales (FR)        /en/legal
/cerebrum/play         → Redirection QR → App Store / Play Store selon le User-Agent.
                         Les paramètres entrants (`?src=…`) sont transmis à la cible mais
                         ne peuvent jamais écraser un paramètre déjà présent dessus
                         (`withIncomingParams` ignore toute clé déjà sur l'URL cible) —
                         `?id=` ou `?ct=&pt=` ne peuvent donc plus détourner la destination
/play, /jouer          → 307 vers /cerebrum/play, query conservée (`next.config.ts`) —
                         QR historiques, JAMAIS casser
/api/contact           → Formulaire de contact (POST) — reCAPTCHA v2
/robots.txt            → src/app/robots.ts
/sitemap.xml           → src/app/sitemap.ts (8 URLs, alternates hreflang)
/llms.txt              → public/llms.txt, statique
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

Routes prévues (pas encore implémentées) : `/blog`, `/apps/[slug]`.

## Architecture i18n

- **Locale par défaut** : `fr` (pas de préfixe dans l'URL)
- **Autres locales** : préfixe `/en/`
- **Proxy** (`src/proxy.ts`) : rewrite (jamais redirect) des URLs sans préfixe vers
  `/fr/...`. Matcher : `["/((?!_next|api|favicon\\.ico|.*\\..*).*)"]` — tout chemin
  contenant un point y échappe (d'où le passage direct de `/.well-known/*`).
  `LOCALE_FREE_ROUTES` exclut en plus les routes servies hors du segment `[locale]` : il
  vaut `["/cerebrum/play"]` et ne couvre PAS `/cerebrum`.
- **Contenu** : `src/content/fr.ts` et `src/content/en.ts`
- **Types** : `src/content/types.ts` (`Dictionary`)
- **Helpers** : `src/lib/i18n.ts` (`LOCALES`, `DEFAULT_LOCALE`, `getLocalePath`,
  `generateStaticParams`), `src/content/index.ts` (`getDictionary`, `getLocale`),
  `src/lib/seo.ts` (`getAlternates`), `src/lib/app.ts` (identité store)
- ⚠ `/fr`, `/fr/privacy`, `/fr/terms`, `/fr/legal` répondent 200 et ne sont
  dédoublonnées que par le canonical. Ni redirigées, ni noindexées, ni sitemapées.
- Un segment qui n'est pas une locale connue (`/wp-login.php` : tout chemin contenant un
  point échappe au proxy et atterrit dans `[locale]`) déclenche `notFound()` dans
  `[locale]/layout.tsx` → vrai 404. **Jamais `dynamicParams = false`** pour ça. `/llms.txt`
  n'illustre PAS ce cas : servi statiquement depuis `public/`, il répond avant même
  d'atteindre le routing Next — jamais de `notFound()`.
- `getLocalePath("en", "/")` renvoie `/en`, sans slash final : `/en/` répond 308.
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
  vers l'anglais** (`X_DEFAULT_LOCALE` dans `src/lib/seo.ts`, distinct de `DEFAULT_LOCALE`
  = `fr`, qui régit le routage et reste inchangé).
- Smart App Banner Safari via `itunes: { appId }` dans le layout de locale
- `sitemap.xml` : `/`, `/privacy`, `/terms`, `/legal` × 2 locales, avec alternates et des
  `lastModified` réels (`lastModifiedFor()` dans `src/app/sitemap.ts` — plus une date figée)
- `robots.txt` : `Allow: /` intégral, aucun `Disallow`, aucun `noindex` dans `src/`
  (sauf `/cerebrum/play`, marquée `robots: { index: false }`)
- **`src/lib/structured-data.ts` est la source unique de tout le JSON-LD du site** — aucun
  objet `@type` schema.org ne doit être construit ailleurs. Builders exposés :
  `organizationSchema` (Organization, sur toutes les pages du segment `[locale]`),
  `websiteSchema` (WebSite, layout de locale), `softwareApplicationSchema`
  (SoftwareApplication, landing uniquement — `operatingSystem: ["iOS", "Android"]`),
  `faqPageSchema` (FAQPage, landing) et `webPageSchema` (WebPage, pages légales).
- `public/llms.txt` : résumé du site et des faits Cerebrum pour les agents/LLM, statique
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
    │   ├── feature-sudoku.webp      feature-crosswords.webp
    │   ├── feature-wordsearch.webp  feature-crossmath.webp
    │   └── feature-trace.webp       feature-maze.webp
    └── hero/
        ├── hero-bg-desktop.webp     hero-bg-mobile.webp
        ├── screen-home-{fr,en}.webp      screen-sudoku-{fr,en}.webp
        ├── screen-daily-{fr,en}.webp     screen-victory-{fr,en}.webp
        └── screen-profile-{fr,en}.webp
```

Les captures du slider sont **localisées** : `IPhoneSlider` compose le chemin en
`screen-<écran>-<locale>.webp`. Elles viennent de
`cerebrum-design-system/marketing/AppleStoreConnect/release-2.0.0/raw-screenshot/iphone`
(1320×2868, iPhone 16 Pro Max), converties en webp 800 px de large.

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

**Versions** : App Store sert la **2.1.5** (bundle `com.synapgeek.cerebrumgame`, gratuit,
classée 4+, dernière mise à jour 2026-09-07). Le repo iOS est à **3.0.0** en interne — non
publiée. Android est publié sur Google Play (package `com.synapgeek.cerebrum` — noter que
le bundle iOS et le package Android **diffèrent**, ce n'est pas une coquille).

### Jeux

**Les versions publiées annoncent 6 jeux** : Sudoku, Mots-Croisés, Mots-Mêlés, Cross Math,
**Trace** et **Maze/Labyrinthe** (description App Store 2.1.5, mot pour mot : « six
brain-teasing games … Sudoku, Crossword, Word Search, Cross Math, Trace, and Maze » ;
fiche Play : « 6 relaxing brain games »). Le site présente désormais les **6** jeux
(« Un cerveau, six disciplines »). L'enum `GameType` d'iOS 3.0.0 (non publiée) en
déclare 8, avec Pandoku et Minesweeper en plus — non publiés, ne pas les annoncer.

- 3-4 niveaux de difficulté par jeu (Easy, Medium, Hard, Elite)
- 100 niveaux de progression par difficulté + mode endless
- Défis quotidiens, séries de jeu (streaks), trophées mensuels

### Fonctionnalités

- Progression (étoiles, XP, ligue Bronze → Legend), monnaie virtuelle (gemmes),
  collection d'avatars, classements par jeu
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
  Formats réellement servis en 2.1.5 : bannières, interstitiels, récompensées (rewarded).
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
- Faits Cerebrum : `cerebrum-design-system/marketing/ASO/3.x.x/asc-metadata.md` et les sessions
  iOS/Android/Design System ; copy selon `geo-assistants-ia.md` du même dossier.

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
site n'a pas (SSG pur) et, pour l'optimizer, Next 16.3+ alors qu'on est en 16.1.6. Ils ne
se déclenchent que si on demande explicitement une migration.

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

`REPLICATE_API_TOKEN` existe aussi mais sert uniquement au sous-agent `designer` pour la
génération d'assets : local seulement, **rien à provisionner dans Vercel**.

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
