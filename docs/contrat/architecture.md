# Architecture : routage et SEO

> Vérifié contre le code au HEAD de la branche de refonte. Quand ce document et le code
> divergent, **le code fait foi** et l'écart devient une tâche. Fichiers qui font contrat :
> `src/proxy.ts`, `next.config.ts`, `vercel.json`, `src/lib/routes.ts`,
> `src/lib/frozen-legal-paths.ts`, `src/lib/page-slugs.ts`, `src/lib/i18n.ts`,
> `src/lib/seo.ts`, `src/lib/structured-data.ts`, `src/app/sitemap.ts`,
> `src/app/robots.ts`, `public/llms.txt`. Les gardes qui les protègent sont dans
> `src/app/route-invariants.test.ts`, `src/app/legacy-redirects.test.ts`,
> `src/lib/routes.test.ts`, `src/lib/structured-data*.test.ts` et
> `scripts/check-contract-urls.mjs`.

## 1. Routage

### 1.1 Langues

- Deux langues (`LOCALES = ["en", "fr"]`, `src/lib/i18n.ts`). `DEFAULT_LOCALE` vaut `en` :
  l'anglais n'a pas de préfixe, le français vit sous `/fr`. L'architecture accepte d'autres
  langues, aucune n'est ajoutée.
- Exception FIGÉE : les trois pages légales gardent le schéma historique, **français sans
  préfixe, anglais sous `/en/`**. L'app installée, les fiches stores, l'UMP d'AdMob et le
  formulaire Data Safety les ouvrent ainsi, et une app installée ne se met pas à jour.

### 1.2 Le proxy (`src/proxy.ts`)

Il réécrit, il ne redirige jamais : l'URL du visiteur reste celle qu'il a saisie.

| Chemin reçu                                                           | Traitement                                                         |
| --------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `/cerebrum/play` et ses sous-chemins (`LOCALE_FREE_ROUTES`)           | passe tel quel (`NextResponse.next()`)                             |
| commence par `/en/` ou `/fr/`, ou vaut `/en` ou `/fr`                 | passe tel quel                                                     |
| chemin exact de `FROZEN_LEGAL_PATHS` (`/privacy`, `/terms`, `/legal`) | réécrit vers `/fr/<chemin>`                                        |
| tout autre chemin sans préfixe                                        | réécrit vers `/en/<chemin>` (`/` devient `/en`)                    |

- Matcher : `["/((?!_next|api|favicon\\.ico|.*\\..*).*)"]`. Tout chemin contenant un point
  échappe au proxy (d'où le passage direct de `/.well-known/*`, `/llms.txt`, `/robots.txt`,
  `/sitemap.xml`, `/app-ads.txt`, la clé IndexNow). Ne pas le modifier.
- `LOCALE_FREE_ROUTES` vaut `["/cerebrum/play"]` et ne couvre PAS `/cerebrum` seul, qui est
  réécrit comme toute page localisée. Le proxy exempte cette route parce qu'elle vit hors du
  segment `[locale]` : la réécrire en `/en/cerebrum/play` chercherait un segment inexistant.
- Seuls les chemins EXACTS de `FROZEN_LEGAL_PATHS` sont figés : `/privacy-notes` n'en fait pas
  partie.
- Un chemin préfixé qui n'a pas de segment `[locale]/<route>` correspondant rend 404 : le proxy
  le laisse passer sans réécriture (c'est pourquoi `/en/account-deletion` et
  `/fr/account-deletion` ont leur propre redirection).

### 1.3 Schéma légal figé

`src/lib/frozen-legal-paths.ts` n'importe rien (`next.config.ts` le charge par chemin relatif,
avant la résolution de `@/`) et porte `FROZEN_LEGAL_PATHS` et `FROZEN_LEGAL_LOCALE = "fr"`.
Le proxy, `pagePath`, le sitemap et `next.config.ts` le lisent : jamais de copie locale (garde
dans `route-invariants.test.ts`). Aucune page future ne le rejoint.

| URL                                     | Comportement                                                                 |
| --------------------------------------- | ---------------------------------------------------------------------------- |
| `/privacy`, `/terms`, `/legal`          | 200, français, canonical vers elles-mêmes                                    |
| `/en/privacy`, `/en/terms`, `/en/legal` | 200, anglais                                                                 |
| `/fr/privacy`, `/fr/terms`, `/fr/legal` | **200 aujourd'hui**, canonical vers l'URL sans préfixe ; ni noindex ni sitemap |
| `/account-deletion` (+ `/en/`, `/fr/`)  | 307 vers `#account-deletion` de la politique de confidentialité              |

Suite prévue, hors de cette PR : `/fr/<page légale>` passera en **307** (`permanent: false`)
vers l'URL sans préfixe, après preuve en production. Jamais 308 : un permanent se met en cache
chez les clients. (La spec de refonte §5.2 écrivait 308 ; l'amendement 5 du plan, postérieur,
a tranché 307 et `check:contract` attend 200 tant que ce PR n'existe pas.)

Ancres contractuelles dans les contenus légaux : `id: "account-deletion"` (cible de la
redirection Data Safety, aucun build ne la vérifie), `id: "website"` (cible du lien « en savoir
plus » du bandeau de consentement, `pagePath("privacy", locale, "website")`) et, hors légal,
`id="contact"` sur `/` et `/fr` (`SectionBand` du hub). `LegalPage` garde `id` et
`tabIndex={-1}` sur chaque section.

### 1.4 Redirections (`next.config.ts`, `redirects()`)

Les redirections de configuration passent AVANT le proxy. Ordre exact, gardé par
`legacy-redirects.test.ts` :

| Source                                                       | Destination                           | Code |
| ------------------------------------------------------------ | ------------------------------------- | ---- |
| `/account-deletion`                                          | `/privacy#account-deletion`           | 307  |
| `/en/account-deletion`                                       | `/en/privacy#account-deletion`        | 307  |
| `/fr/account-deletion`                                       | `/privacy#account-deletion`           | 307  |
| `/play`                                                      | `/cerebrum/play`                      | 307  |
| `/jouer`                                                     | `/cerebrum/play`                      | 307  |
| `/en`                                                        | `/`                                   | 308  |
| `/en/cerebrum`, `/en/cerebrum/<slug anglais>` (dix jeux), `/en/about`, `/en/press` (treize règles) | le même chemin sans `/en` | 308  |

- `permanent: false` sur les `/account-deletion` : si la page devient un jour autonome, aucun
  301 mis en cache ne pointera plus vers la politique. Même raison pour `/play` et `/jouer`.
- Les règles `/en/<page>` sont **littérales**, générées dans `next.config.ts` depuis
  `GAME_SLUGS` et `SECTION_SLUGS` : jamais de regex, de lookahead ni de `/en/:path*`, qui
  capterait `/en/privacy` (contrat figé) et les `…/opengraph-image*` (l'image Open Graph
  anglaise d'une page jeu ou section garde donc son chemin interne sous `/en/`, servi en 200
  `image/png` sans redirection). Une nouvelle page anglaise n'a jamais besoin de règle : elle
  naît sans préfixe.
- Garde-fou au chargement : si un slug futur coïncidait avec un chemin légal figé, la config
  lève une erreur plutôt que de rediriger `/en/privacy`.
- La query entrante est conservée par Next sur toutes ces redirections (`/en?utm_source=x`
  donne `/?utm_source=x`). Une destination ne porte jamais de query : la sienne l'emporterait
  en cas de conflit.
- `www.synapgeek.com/*` redirige en 308 vers l'apex, chemin conservé : réglage Vercel, hors
  dépôt. `www` reste critique (hôte des liens des anciennes installations, voir le CLAUDE.md
  racine) ; `check:contract` le contrôle sur les deux hôtes.

### 1.5 Le registre des URLs

Une page = un `PageId` (`src/lib/routes.ts`) :
`"home" | "cerebrum" | "game:<GameId>" | "about" | "press" | "privacy" | "terms" | "legal"`
(chaîne, donc sérialisable vers un composant client).

- `pagePath(pageId, locale, hash?)` : chemin relatif, sans slash final (sauf la racine
  anglaise `/`). Les liens internes passent TOUS par lui ; `absoluteUrl(pageId, locale)` donne
  l'URL complète (`https://synapgeek.com` sans slash pour la racine anglaise).
  `alternatesFor(pageId)` donne les hreflang, `getAlternates(pageId, locale)` (`src/lib/seo.ts`)
  le couple canonical et hreflang d'une page. `getLocalePath()` n'existe plus : un test échoue
  s'il réapparaît dans `src/`.
- Les slugs sont des **données** dans `src/lib/page-slugs.ts` (aucun import) : `GAME_SLUGS` (par
  jeu et par langue, ex. `demineur`, `mots-croises`, `mots-meles`, `labyrinthe`) et
  `SECTION_SLUGS` (`about`/`a-propos`, `press`/`presse`). Le registre des jeux les lit, et un
  test garde les deux ensembles de clés identiques. Un slug ne se résout que dans sa propre
  langue (`/fr/cerebrum/crossword` et `/cerebrum/mots-croises` rendent 404).
- Slugs réservés (testés) : `play` n'est jamais un slug de jeu ; aucune section ne prend
  `cerebrum, privacy, terms, legal, account-deletion, play, jouer, api, en, fr`.
- `publishedPageIds()` liste les pages publiées (jeu avec `published: true`) ;
  `renderedPageIds()` les restreint à `RENDERED_PAGE_IDS`, les pages dont la route répond 200
  aujourd'hui : c'est la source unique du sitemap. `pagePath` lève une erreur pour un jeu non
  publié (aucun lien ne doit pointer vers un 404).

Ajouter une page : un `PageId` (et son slug dans `page-slugs.ts`), sa route, sa copie avec
`updatedAt`, son entrée dans `RENDERED_PAGE_IDS` le jour où elle répond 200, sa ligne dans
`public/llms.txt`, ses attentes dans `check:contract`. Le sitemap refuse une page sans date
(`lastModifiedFor` lève une erreur).

### 1.6 Routes et rendu

```
src/app/layout.tsx                      retourne `children` nu (titre par défaut anglais, gabarit « %s | Synapgeek »)
src/app/not-found.tsx                   404 racine, anglaise, avec son propre <html lang="en">
src/app/cerebrum/play/page.tsx          cible des QR, HORS de [locale], force-dynamic
src/app/.well-known/*/route.ts          deux handlers, force-static
src/app/api/contact/route.ts            POST du formulaire de contact
src/app/[locale]/layout.tsx             <html lang>, consentement, JSON-LD Organization et WebSite, en-tête, pied de page
src/app/[locale]/page.tsx               hub studio
src/app/[locale]/cerebrum/layout.tsx    Smart App Banner (metadata seulement)
src/app/[locale]/cerebrum/page.tsx      page de l'app
src/app/[locale]/cerebrum/[game]/       page jeu + opengraph-image
src/app/[locale]/[slug]/                À propos et Presse (slug traduit) + opengraph-image
src/app/[locale]/{privacy,terms,legal}/ pages légales
src/app/[locale]/not-found.tsx          404 localisée
```

- **SSG pur.** Tout est prérendu au build sauf `/cerebrum/play` et `/api/contact`. Exactement
  trois fichiers exportent `dynamic` : `/cerebrum/play` en `force-dynamic` (il lit le
  User-Agent) et les deux handlers `.well-known` en `force-static` (prérendu exigé par Apple
  et Google). Aucun `revalidate`, `dynamicParams`, `runtime`, `"use cache"`, `cacheComponents`
  (garde dans `route-invariants.test.ts`). Rien ne se rafraîchit hors déploiement.
- `generateStaticParams` sur chaque page `[locale]` : langues pour le hub, la page app et les
  pages légales, `publishedGameParams()` (une entrée par jeu publié et par langue, avec le slug
  de CETTE langue) pour les jeux, `sectionParams()` pour À propos et Presse. Les
  `opengraph-image` reprennent les mêmes paramètres.
- Segment inconnu, jeu non publié, slug de l'autre langue : `notFound()` dans
  `generateMetadata` ET dans la page ; un segment de langue inconnu (`/wp-login.php`, tout
  chemin à point échappe au proxy) déclenche `notFound()` dans `[locale]/layout.tsx`. **Jamais
  `dynamicParams = false`**, jamais de `loading.tsx` ni de Suspense autour de ces pages.
- **Jamais `src/app/[locale]/cerebrum/play`.** `/cerebrum/play` est un dossier statique
  hors `[locale]`, exempté du proxy. Jamais un `next/link` vers lui.
- `/cerebrum/play` : le redirect lit le User-Agent seul (iPhone, iPad, iPod vers
  `APP_STORE_QR_URL`, Android vers `GOOGLE_PLAY_URL`) ; un iPad en mode bureau (UA de Mac)
  tombe volontairement sur le repli. Les paramètres entrants (`?src=…`) sont transmis à la
  cible sans jamais écraser un paramètre déjà présent dessus (`?id=` ou `?ct=&pt=` ne peuvent
  pas détourner la destination). Le repli (desktop, robot) se localise par `Accept-Language`
  (`fr*` donne le français, sinon l'anglais), `<html lang>` suit, la liste des jeux vient du
  registre (`Intl.ListFormat`, aucun nombre), `robots: { index: false, follow: false }`, hors
  sitemap, sans Open Graph.
- Les 404 : `[locale]/not-found.tsx` (feuille client qui choisit parmi les textes du dictionnaire
  passés en props) et `src/app/not-found.tsx`. Un seul `<title>` par document (testé).
- `/llms.txt`, `/robots.txt`, `/sitemap.xml`, `/app-ads.txt`, `/.well-known/*` et la clé
  IndexNow ne passent pas par `[locale]` : le chemin à point échappe au proxy.
- Pages légales : `LegalPage` et tout ce qu'elle importe, transitivement, n'ont aucun
  `"use client"` (garde dans `route-invariants.test.ts`) ; le texte légal est dans le HTML servi.
- Liens : `InternalLink` (`src/components/ui/InternalLink.tsx`) est l'unique importeur de
  `next/link` (garde dans `link-prefetch.test.ts`). Il coupe le préchargement des chemins
  internes d'un seul segment (`/privacy`, `/about`…) : le routeur client les prédit comme une
  page d'accueil de langue et reçoit un 404 de l'arbre réécrit par le proxy.
- Sélecteur de langue : la table « chemin vers même page dans chaque langue » est construite
  côté serveur (`buildLanguageSwitchTable`), l'en-tête et le lien permanent du pied de page
  sont de vrais `<a href hreflang lang>` dans le HTML initial (les crawlers relient ainsi les
  deux versions : ne pas retirer le lien du pied de page). `LanguageSuggestion` est une feuille
  client générique sur `LOCALES`, sans redirection ni stockage, absente des pages légales ;
  elle ne s'affiche qu'une fois le bandeau de consentement fermé (feuille en bas d'écran sous
  `lg`, carte en haut à droite au-dessus).

### 1.7 Images Open Graph

- `buildOpenGraph(locale, pageId, title, description, { ownImage })` de `src/lib/seo.ts` est
  l'unique constructeur d'`openGraph` : la fusion des métadonnées de Next est superficielle, un
  `openGraph` partiel dans une page écrase celui du layout et fait disparaître l'image.
- Hub, page app et pages légales : l'image du site, `public/images/brand/og-image.jpeg`.
  Pages jeu et sections (À propos, Presse) : `opengraph-image.tsx` du segment (`ownImage: true`),
  généré au build avec `next/og` (une page jeu : icône, nom et genre sur le lavis du jeu ; une
  section : logo et titre), polices TTF committées dans `src/assets/fonts/`, couleurs lues dans
  `globals.css`. Aucun export
  `dynamic`/`runtime`/`revalidate` dans ces routes.
- Une page porte UNE seule `og:image` qui répond 200 `image/png` sans redirection
  (`check:contract`). `/cerebrum/play` et les 404 n'en ont pas.
- `/images/*` est servi avec `Cache-Control: public, max-age=604800, stale-while-revalidate=86400`
  (`vercel.json`) : remplacer une image sous le même nom ne suffit pas, l'ancienne version reste
  servie jusqu'à 7 jours. Renommer le fichier (ou versionner le dossier : `images/screens/v3/`)
  et mettre à jour les références.
- Smart App Banner Safari (`itunes: { appId }`) : seulement dans `[locale]/cerebrum/layout.tsx`,
  donc sur la page app et les pages jeu, jamais sur le hub, À propos, Presse ni le légal.

## 2. SEO

### 2.1 Métadonnées

- `<title>` et `<meta description>` viennent des modules de copie (`meta.title`,
  `meta.description`, 155 caractères au plus) ou du dictionnaire (légal). Le gabarit du layout
  racine est `%s | Synapgeek` ; les pages de section posent `title: { absolute }`.
- Canonical et hreflang : `getAlternates(pageId, locale)` sur chaque page indexable, jamais
  écrits à la main. **x-default pointe vers l'anglais** (`X_DEFAULT_LOCALE` de `routes.ts`,
  constante distincte de `DEFAULT_LOCALE` bien qu'égale aujourd'hui), y compris pour les pages
  légales (x-default vers `/en/privacy`). Le canonical d'une page légale n'est jamais préfixé
  `/fr/`.
- Seule `/cerebrum/play` est `noindex`. Aucun autre `robots: { index: false }` sans la même
  justification (page de service sans contenu), jamais de canonical + noindex ensemble.

### 2.2 JSON-LD : une seule source

`src/lib/structured-data.ts` construit TOUT le JSON-LD. Aucun objet `@type` schema.org ailleurs
(gardes dans `route-invariants.test.ts` : aucun littéral `@context`/`@type`, émission par
`src/components/JsonLd.tsx` seul, un seul noeud Organization).

| Builder                      | Type                              | Émis par                                         |
| ---------------------------- | --------------------------------- | ------------------------------------------------ |
| `organizationSchema()`       | Organization                      | le layout de langue, sur toutes les pages        |
| `websiteSchema(locale)`      | WebSite                           | le layout de langue                              |
| `mobileApplicationSchema`    | `["MobileApplication","VideoGame"]` | page app                                       |
| `videoGameSchema`            | VideoGame                         | chaque page jeu                                  |
| `faqPageSchema(items)`       | FAQPage                           | page app et pages jeu                            |
| `breadcrumbSchema`           | BreadcrumbList                    | page app, pages jeu, À propos, Presse            |
| `aboutPageSchema`            | AboutPage                         | À propos (référence l'organisation par `@id`)    |
| `webPageSchema`              | WebPage                           | Presse et pages légales                          |

- `@id` identiques dans les deux langues : `https://synapgeek.com/#organization`,
  `https://synapgeek.com/#website`, `https://synapgeek.com/cerebrum#app`,
  `https://synapgeek.com/cerebrum/<slug anglais>#game`. `url` d'Organization et de WebSite vaut
  `https://synapgeek.com/`. `inLanguage` en BCP 47 (`en`, `fr`, et les 16 langues de l'app pour
  l'app), jamais `fr_FR`.
- L'identité vient de l'`AppEntry` et du `PUBLISHER` (`src/content/publisher.ts`, testé contre
  l'adresse et le capital de `/legal`). Android n'est annoncé (système, boutiques, `sameAs`) que
  si le registre porte sa version minimale.
- **Aucun `aggregateRating`**, pas de `softwareVersion`, pas de `contentRating`.
- Le `FAQPage` reprend mot pour mot le tableau affiché (`copy.faq.items`, même source des deux
  côtés, jamais dupliqué). Le fil d'Ariane JSON-LD lit les mêmes maillons que le visible.
- Un étalon (`src/lib/__snapshots__/structured-data.snapshot.test.ts.snap`) fige le JSON-LD de
  l'app et des dix jeux dans les deux langues : un écart de snapshot se relit, il ne se
  régénère pas à l'aveugle.

### 2.3 Sitemap, robots, llms.txt, IndexNow

- `sitemap.xml` (`src/app/sitemap.ts`) : `renderedPageIds()` × `LOCALES`, soit 17 pages et
  **34 URLs** aujourd'hui (hub, app, dix jeux, À propos, Presse, trois pages légales),
  `alternates` par `alternatesFor`, `lastModified` réel (`updatedAt` de la copie de la page,
  date du dictionnaire pour le légal ; jamais `new Date()`). Hebdomadaire pour le hub et l'app,
  mensuelle sinon ; priorité 1 pour le hub, 0,5 sinon. Jamais : `/cerebrum/play`, `/play`,
  `/jouer`, `/en/<page non légale>`, `/fr/<page légale>`, `/account-deletion`.
- `robots.txt` (`src/app/robots.ts`) : `Allow: /` pour `*` et, nommés explicitement,
  OAI-SearchBot, ChatGPT-User, GPTBot, PerplexityBot, Perplexity-User, ClaudeBot,
  Claude-SearchBot, Claude-User, Google-Extended, Applebot-Extended, Bingbot. Aucun `Disallow`,
  ligne `Sitemap`. Ne jamais passer le pare-feu Vercel « AI Bots » en mode Deny.
- `public/llms.txt` : statique, bilingue, un bloc par page avec SA phrase de définition. Deux
  gardes : `route-invariants.test.ts` (chaque URL synapgeek.com citée est au sitemap, chaque URL
  du sitemap y est, jamais la route des QR) et `src/content/llms-content.test.ts` (phrases de
  définition et modèle économique mot pour mot, ni prix, ni note, ni nombre de
  téléchargements, ni cadratin, ni « sans pub »). Une modification de copie qui change une
  définition impose de mettre `llms.txt` à jour dans le même commit.
- IndexNow : le fichier clé `public/<32 hex>.txt` (son contenu est la clé, publique par
  conception ; ne pas le renommer ni le supprimer, `src/lib/indexnow-key.test.ts` et
  `check:contract` le vérifient) et `npm run indexnow`, À LA MAIN, une fois le déploiement en
  production en ligne. Le script lit le sitemap de production, refuse tout hôte hors
  `synapgeek.com` et envoie les URLs à `https://api.indexnow.org/indexnow` ; `-- --dry-run`
  affiche la charge sans rien envoyer, `-- --sitemap <url>` lit un autre sitemap. Ni route, ni
  variable d'environnement, ni étape de build.
- `public/app-ads.txt` : vérification AdMob.

### 2.4 Contrôle des URLs : `check:contract`

`npm run check:contract` (`scripts/check-contract-urls.mjs`) encode le contrat en clair, requêtes
en `redirect: "manual"` : statut et `Location` réels. Sans argument il contrôle
`https://synapgeek.com` et `https://www.synapgeek.com` ; avec une base
(`http://localhost:PORT`) il en contrôle une seule. Contre un déploiement Vercel protégé,
`VERCEL_OIDC_TOKEN` part en en-tête `x-vercel-trusted-oidc-idp-token` sur chaque requête (jamais
affiché). Il couvre : pages légales (langue, canonical, hreflang), ancres, `/en` et ses
variantes avec query, redirections `/en/<page>`, `/account-deletion`, matrice de `/cerebrum/play`
et de ses alias par User-Agent, `.well-known`, pages jeu et sections (canonical, hreflang
réciproques, une `og:image` 200 `image/png`), sondes 404 (statut 404, sans `Location`) : les slugs de l'autre langue (`/fr/cerebrum/crossword`,
`/cerebrum/mots-croises`, `/fr/cerebrum/word-search`, `/cerebrum/mots-meles`, `/fr/cerebrum/maze`,
`/cerebrum/labyrinthe`, `/fr/about`, `/fr/press`, `/a-propos`, `/presse`), un slug inconnu
(`/cerebrum/inconnu`) et deux 404 qui portent en plus un seul `<title>` : `/de/inconnu` (exactement
« Page not found | Synapgeek ») et `/fr/cerebrum/inconnu` ; l'absence de préchargement des liens d'un seul segment, la redirection en 308 de chaque chemin vers l'apex sur `www`, sitemap sans
URL interdite et à 34 `<loc>` qui répondent toutes 200. Il n'est pas dans la CI : à lancer contre
`next start` avant tout merge qui touche routage, redirects, proxy ou `.well-known`, puis contre
la production juste après le merge. Ses listes de slugs sont des copies de `page-slugs.ts` : les
mettre à jour dans le même commit.
