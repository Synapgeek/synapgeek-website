# src/app : routes, métadonnées, redirections

Règles qui valent ici. Le contrat complet est dans `docs/contrat/architecture.md`, les règles
racine dans `CLAUDE.md`. Le code fait foi.

1. **Les URLs figées ne bougent pas** : `/privacy`, `/terms`, `/legal` (français sans préfixe,
   anglais sous `/en/`), `/account-deletion`, `/cerebrum/play`, `/play`, `/jouer`, `/.well-known/*`,
   `#contact`. Les vérifier avec `npm run check:contract` contre `next start` dès qu'on touche
   routage, redirects, proxy ou `.well-known`.
2. **Le proxy réécrit, il ne redirige jamais.** Sans préfixe vers `/en/...` (les trois chemins de
   `FROZEN_LEGAL_PATHS` vers `/fr/...`) ; `/cerebrum/play` exempté (`LOCALE_FREE_ROUTES`). Le
   matcher ne change pas.
3. **Les redirections vivent dans `next.config.ts`**, en règles LITTÉRALES (jamais `/en/:path*` :
   elle capterait `/en/privacy` et les images Open Graph). Les trois `/account-deletion`, `/play` et
   `/jouer` restent `permanent: false`. `/fr/<page légale>` n'est pas redirigée (PR ultérieur, 307).
   Deux règles conditionnelles R1, en 307 et AVANT le 308 `/en`, servent le lien « Contact » des
   apps installées : `/` avec `utm_source=cerebrum` et `utm_medium=app` (sans `hl`) vers `/fr`,
   `/en` avec les mêmes utm vers `/?hl=en`. Elles s'appuient sur la convention des apps (racine
   pour le français seulement, `/en` pour le reste) : ne jamais les retirer ni les déplacer
   après le 308 `/en`, et ne rien changer à l'URL émise par les apps sans repasser par
   `site-architect`.
4. **SSG pur.** Exactement trois `export const dynamic` : `cerebrum/play/page.tsx`
   (`force-dynamic`) et les deux `.well-known` (`force-static`). Jamais `revalidate`,
   `dynamicParams`, `runtime`, `"use cache"`, `cacheComponents`, ni `loading.tsx` ou Suspense
   autour d'une page.
5. **Toute page `[locale]`** : `generateStaticParams` (langues, `publishedGameParams()` ou
   `sectionParams()`), et `notFound()` dans `generateMetadata` ET dans la page pour un slug inconnu,
   non publié ou de l'autre langue. Un segment de langue inconnu 404 dans `[locale]/layout.tsx`.
6. **Jamais `src/app/[locale]/cerebrum/play`**, jamais un `next/link` vers `/cerebrum/play`.
7. **Le layout racine retourne `children` nu** : toute route hors de `[locale]` (404 racine,
   `/cerebrum/play`) rend son propre `<html lang>` et `<body>` avec `FONT_VARIABLES`.
8. **Métadonnées** : titre et description depuis la copie (155 caractères au plus),
   `getAlternates(pageId, locale)` pour canonical et hreflang, `buildOpenGraph()` pour `openGraph`
   (`ownImage: true` quand la page a son `opengraph-image` ; sinon l'image du site vient de
   `getOgImages(locale)`, `og-image-v2.jpeg`). Un `openGraph` partiel écrase celui du
   layout et fait disparaître l'image. Seule `/cerebrum/play` est `noindex`.
9. **JSON-LD** : uniquement un builder de `src/lib/structured-data.ts`, rendu par `JsonLd`. Une
   FAQ visible a son `FAQPage` du même tableau. Un seul noeud Organization (le layout de langue).
10. **Nouvelle page** : un `PageId` et son slug (`src/lib/page-slugs.ts`), sa copie avec
    `updatedAt`, son entrée dans `RENDERED_PAGE_IDS` le jour où elle répond 200 (le sitemap lève
    une erreur sans date), sa ligne dans `public/llms.txt`, ses attentes dans `check:contract`.
11. **Pages légales** : aucune importation `"use client"` dans leur chaîne ; ancres `id`
    `account-deletion` et `website` préservées dans les deux langues.
12. **`opengraph-image`** : aucun export `dynamic`, polices TTF lues au chargement du module, couleurs
    lues dans `globals.css`, une seule `og:image` par page.
13. **Liens et textes** : `pagePath()` et `InternalLink`, jamais d'URL interne écrite à la main ;
    aucun texte en dur (Dictionnaire ou module de copie) ; aucun ternaire `locale === "fr"`.
14. **`api/contact`** : seul endroit où `process.env` sans `NEXT_PUBLIC_` est lu. Garder
    reCAPTCHA vérifié, `EMAIL_REGEX`, `MAX_*_LENGTH`, `escapeHtml`, `stripNewlines`, messages
    d'erreur constants ; toute variable nouvelle est documentée dans `CLAUDE.md`.
15. **Smart App Banner** : seulement dans `[locale]/cerebrum/layout.tsx`.
