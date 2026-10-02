# Synapgeek Website

> Vérifié contre le code à la fin de la refonte « hub studio » (2026-10-02). Quand ce fichier et
> le code divergent, **le code fait foi**, et cette ligne devient une tâche, pas une excuse.
> Fichiers qui font contrat : `src/proxy.ts`, `next.config.ts`, `vercel.json`,
> `src/lib/{routes,frozen-legal-paths,page-slugs,i18n,seo,app,structured-data}.ts`,
> `src/app/{sitemap,robots}.ts`, `src/content/{index,types}.ts`, `src/content/apps/`, `public/llms.txt`.
> Le détail vit dans `docs/contrat/` (voir « Documentation »).

## Contexte

Site de **Synapgeek**, studio indépendant français d'apps mobiles : hub studio, une page par app
(Cerebrum d'abord) et par jeu, À propos, Presse, trois pages légales, formulaire de contact.
**Cerebrum** (puzzles, iOS et Android, 3.0.0 sur les deux stores) est la première app ; une future
app non-jeu existe, **son nom de code n'apparaît jamais**. But premier : SEO et GEO. Le site
fournit aussi les URLs déclarées dans App Store Connect, la Play Console (Data Safety) et l'UMP
d'AdMob. Brief produit : `PRODUCT.md`.

## Stack

- **Next.js 16.3.8** (App Router, `src/`) et **React 19.2.8**, versions épinglées exactement
  (comme `eslint-config-next`). TypeScript strict, ESLint 9 + Prettier, **vitest 4**. Contact :
  Nodemailer (SMTP Google Workspace) et reCAPTCHA v2, sur `/api/contact` seulement.
- **Tailwind 4**, CSS-first : `src/app/globals.css` (environ 310 lignes) EST le design system
  (jetons `--color-*`, paires `--game-*`, rythme, ombres, classes `band-*`, `shell-pop`,
  `input-*`), pas de `tailwind.config.js`. Polices Fredoka (titres) et Figtree (texte) par
  `next/font/google` (`src/app/fonts.ts`) ; jamais Nunito ni Baloo 2 (celles de Maze Foundry).
  Primitives dans `src/components/ui/`. **Jamais de hex en dur, jamais un cinquième bouton**
  (`Button` : primary, secondary, outline, inverse). Direction visuelle : `DESIGN.md`.
- **i18n maison** (pas de `next-intl`) : **anglais par défaut sans préfixe, français sous `/fr`**,
  sauf les pages légales (voir « Contrat d'URLs »).
- **Mesure** : Vercel Analytics et Speed Insights (sans cookie) et **GA4** derrière **Consent Mode
  v2 régionalisé** (`src/lib/consent/`, `src/components/consent/`). Seul `analytics_storage`
  varie : `granted` par défaut hors UE/EEE/Royaume-Uni/Suisse (`GDPR_REGIONS`, 43 juridictions),
  `denied` dedans sans choix explicite ; `ad_storage`, `ad_user_data` et `ad_personalization`
  restent **`denied` partout, toujours** (aucune pub sur le site). Bandeau **maison** : Accepter et
  Refuser au même niveau, choix stocké 6 mois dans `localStorage` (`sg-consent`, jamais un
  cookie), rouvrable par « Gérer mes cookies » dans le pied de page. GA4 charge dès que
  `NEXT_PUBLIC_GA_MEASUREMENT_ID` existe ; aucun tag ni cookie Google hors de ce mécanisme.
  Événements : `section_viewed`, `app_store_click`, `contact_form_submit`, `language_switched`.
- **Déploiement** : Vercel. **Seule `main` déploie** (`vercel.json` > `git.deploymentEnabled`) :
  aucune preview de branche, et Vercel lit ce réglage dans le commit poussé. Un merge sur `main`
  publie en production : tout passe par branche et PR, **jamais de merge ni de promotion sans
  accord explicite d'Adrien**. `release/next` est la branche d'intégration pour la recette
  (décision d'Adrien, 2026-10-01). CI (`.github/workflows/ci.yml`, sans secret) : `lint`,
  `next typegen`, `tsc`, `npm test`, `build`, sur chaque push et PR vers `main`.

## Commandes

```bash
npm run dev             # développement
npm run build           # build de production
npm run start           # serveur de production (build préalable) ; cible locale de check:contract
npm run lint            # ESLint
npm test                # vitest : routes, redirections, JSON-LD, sitemap, gardes de copie, design
npm run format          # Prettier : ÉCRIT les fichiers (npx prettier --check pour vérifier)
npm run check:contract  # URLs référencées par les stores (réseau : local ou production)
npm run indexnow        # prévient IndexNow, À LA MAIN, après un déploiement en production
```

- Portes avant un commit : `lint`, `npx next typegen && npx tsc --noEmit`, `test`, `build`.
- `check:contract` sans argument contrôle `https://synapgeek.com` ET `https://www.synapgeek.com` ;
  avec une base (`http://localhost:3130`) une seule. À lancer contre `npm run start` (après
  `build`) avant tout merge touchant routage, redirects, proxy ou `.well-known`, puis contre la
  production juste après le merge. Contre un déploiement Vercel protégé, définir `VERCEL_OIDC_TOKEN` : le script l'envoie en
  en-tête `x-vercel-trusted-oidc-idp-token` sur chaque requête, sans jamais l'afficher.
- `npm run indexnow` envoie les URLs du sitemap de production à IndexNow (`-- --dry-run` n'envoie
  rien), jamais avant que le déploiement soit en ligne. Clé : le fichier `public/<32 hex>.txt`,
  à ne pas renommer ni supprimer.

## Contrat d'URLs

Ne rien casser, ne rien déplacer. Détail, codes et gardes : `docs/contrat/architecture.md`.

| URL                                                                      | Comportement                                                                                    |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| `/`, `/fr`                                                               | hub en anglais, hub en français ; tous deux portent `id="contact"` (URL de support des stores)  |
| `/en`, `/en/<page non légale>`                                           | 308 vers `/` et `/<page>` (règles littérales, jamais `/en/:path*`)                              |
| `/privacy`, `/terms`, `/legal`                                           | 200, **français** (`FROZEN_LEGAL_PATHS`) : l'app installée et les stores les ouvrent ainsi      |
| `/en/privacy`, `/en/terms`, `/en/legal`                                  | 200, anglais                                                                                    |
| `/fr/privacy`, `/fr/terms`, `/fr/legal`                                  | 200 aujourd'hui (canonical vers l'URL sans préfixe) ; 307 dans un PR ultérieur, jamais 308      |
| `/account-deletion`, `/en/…`, `/fr/…`                                    | 307 vers `#account-deletion` de la politique (URL du formulaire Data Safety de la Play Console) |
| `/cerebrum/play`                                                         | redirection QR vers l'App Store ou Google Play selon le User-Agent, repli localisé, noindex     |
| `/play`, `/jouer`                                                        | 307 vers `/cerebrum/play` (QR historiques)                                                      |
| `/cerebrum`, `/cerebrum/<jeu>`, `/about`, `/press`                       | pages publiées ; slugs traduits en français (`/fr/cerebrum/demineur`, `/fr/a-propos`)           |
| `/.well-known/apple-app-site-association`, `…/assetlinks.json`           | 200 en `application/json`, sans redirection, route handlers `force-static`                      |
| `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/app-ads.txt`, clé IndexNow | 200                                                                                             |

Ancres contractuelles : `#account-deletion` et `#website` dans la politique (FR et EN), `#contact`
sur `/` et `/fr` (jamais renommée ni retirée). Liens internes : `pagePath()` de `src/lib/routes.ts`.

## Règles critiques

- **JAMAIS casser** `/privacy`, `/terms`, `/legal`, `/account-deletion` (+ pendants `/en/`, `/fr/`),
  `/cerebrum/play`, `/play`, `/jouer`, les deux `/.well-known/*` ni `#contact`. Un 404 sur une URL
  légale peut faire rejeter Cerebrum par Apple ou Google. `www.synapgeek.com` reste critique pour
  les URLs référencées par les stores (site de contact de la fiche Play, anciennes installations ;
  Android 3.0.0 construit ses liens sur l'apex, comme iOS). Mais en production `www/*` répond 308
  vers l'apex, `/.well-known` compris (lignes `www` de `check:contract`) : la vérification Android
  App Links sur `www` ne peut donc pas aboutir. Le sujet des liens web vers l'app est abandonné
  par Adrien, aucune action.
- **Aucun lien vers un autre site du portefeuille Synapgeek** (Word Search Trove, Maze Foundry),
  ni ressemblance de design ou de ton (skill `synapgeek-portfolio-rules`) : NO-GO pour
  `site-architect`, bloquant pour `site-reviewer`.
- **Jamais le nom de code de la future app non-jeu**, ni dans le code, les commentaires, la
  documentation ou un message de commit.
- **Aucune vente de contenu digital, aucun lien de paiement externe** (Apple 3.1.1) : tout achat
  passe par StoreKit 2 ou Google Play Billing. **Aucun prix publié sans vérification** dans App
  Store Connect et la Play Console ; aucune note, aucun avis, aucun nombre de téléchargements.
- **Pages légales lisibles sans JavaScript** (SSG, aucun `"use client"` dans leur chaîne) ; leur
  texte ne change pas sur le fond sans décision d'Adrien, et la politique reflète exactement les
  données collectées par l'app.
- **Universal Links et App Links : sujet ABANDONNÉ** par Adrien (2026-09-12) : aucune session ne
  le relance. Les deux `/.well-known/*` restent servis ; modifiés, ils restent des route handlers.
- **SSG pur** : trois fichiers seulement exportent `dynamic` (`/cerebrum/play`, les deux
  `.well-known`), ni `revalidate`, `dynamicParams`, `"use cache"` ni `cacheComponents` ; jamais
  `src/app/[locale]/cerebrum/play`. **Images** en cache 7 jours : renommer un fichier remplacé.

## Conventions de code

- Pas de `any` ; composants fonctionnels ; `next/image` et `next/font` obligatoires ; `"use client"`
  le plus bas possible.
- Aucun texte en dur dans un composant localisé : `Dictionary` (`src/content/{fr,en,types}.ts`) ou
  un module de copie typé (`src/content/copy/`, `src/content/apps/<app>/copy/`). Aucun ternaire
  `locale === "fr" ? … : …` : le cliquet de `route-invariants.test.ts` vaut 0.
- Tout lien interne par `pagePath()` ; `InternalLink` est l'unique importeur de `next/link`.
- Tout JSON-LD sort de `src/lib/structured-data.ts` ; jamais d'`aggregateRating`. Tout `openGraph`
  passe par `buildOpenGraph()`, canonical et hreflang par `getAlternates()`, jamais à la main.
- Pages légales : format de `src/lib/legal-format.ts` (`**gras**`, paragraphes séparés par une
  ligne vide, listes `- `, auto-lien des URLs et e-mails). Une URL suivie d'une virgule ou d'une
  parenthèse est **tronquée** par la regex `[^\s),]+` et rien ne le détecte.
- Copie : règles 1 à 14 de `docs/contrat/contenu.md`, appliquées par `content-guards.test.ts`.
  Jamais de tiret cadratin dans un texte visible. Un fait sur Cerebrum vient des sources vérifiées
  de `docs/contrat/`, jamais d'une supposition.

## Processus

- Ordre sur tout chantier non trivial : `site-architect` (GO / GO-avec-réserves / NO-GO), puis
  implémentation (`designer` pour l'UI), puis `site-reviewer` (mergeable oui/non, une fois `lint`,
  `test` et `build` verts). Architecte et reviewer ne modifient jamais le code ; un NO-GO ou un
  « non » se corrige dans la session principale. Définitions : `.claude/agents/`. Depuis un
  worktree, un type d'agent se résout dans le checkout principal : lancer un agent général qui
  lit la définition du worktree.
- **Modèle passé EXPLICITEMENT à chaque sous-agent** : Haiku pour le mécanique et les docs, Sonnet
  pour le CSS, un composant simple, les vérifications factuelles et l'implémentation cadrée, Opus
  pour l'état, la frontière client, l'a11y fine, l'architecture et les revues. Jamais un fan-out
  qui hérite d'Opus ; un correctif après revue ne part jamais sur Haiku.
- Chaque brief de tâche recopie la liste ET l'ordre des skills à invoquer ; devant une maquette
  validée, l'agent l'implémente ou escalade. Écrivains en parallèle : un worktree chacun, rien de
  commité dans l'arbre partagé ; un serveur sur son port dédié, son PID noté, seul ce PID est
  tué ; preuve de mutation dans une copie isolée (`git archive | tar -x`, jamais `cp` ni `rsync`,
  qui copieraient les `.env`).
- **Les autres dépôts ne se modifient jamais depuis ici** (lecture seule), tous sous
  `/Users/adrienmonte/Documents/projects/synapgeek/cerebrum/` : `cerebrum-ios`, `cerebrum-android`,
  `cerebrum-design-system`, `cerebrum-generator`. Un fait ou une action qui les concerne passe par
  leur session dédiée (App iOS, Android, Design System) : `ListAgents` puis `SendMessage`.
- Skills : le contenu vit dans `.agents/skills/` (`.claude/skills/<nom>` : symlinks), inventaire
  dans `skills-lock.json`. **Ne pas attendre qu'on demande un skill** : si la tâche correspond,
  le lire et l'appliquer. Quatre skills obligatoires vivent HORS du dépôt et manquent à un clone
  frais : `clean-code` (format de verdict de `site-reviewer`), `synapgeek-portfolio-rules`,
  `vercel:nextjs`, `vercel:react-best-practices`. Les skills Cache Components et Partial
  Prefetching supposent un rendu que ce site n'a pas (SSG pur) : sur demande de migration seulement.
  Le MCP `shadcn` (`.mcp.json`) sert à explorer avec `view`, jamais à ajouter tel quel.

## Documentation

- `docs/contrat/architecture.md` : routage (proxy, schéma légal figé, redirections et codes,
  helper d'URLs, SSG, Open Graph) et SEO (JSON-LD, sitemap, robots, hreflang, `llms.txt`, IndexNow).
- `docs/contrat/contenu.md` : règles de copie 1 à 14, arbitrages R3 à R7, registre, gardes,
  sources de faits, vérification par la session iOS, suite 3.1.0, données de l'app, éditeur.
- `docs/contrat/lancement.md` : liste de contrôle après le merge, un responsable par ligne.
- `docs/contrat/faits-cerebrum-3.0.0.md` (iOS), `faits-cerebrum-3.0.0-android.md`,
  `provenance-visuels-r8.md` ; `PRODUCT.md`, `DESIGN.md` (direction visuelle), `docs/superpowers/`
  (spec et plan de la refonte). Des `CLAUDE.md` de proximité complètent celui-ci dans `src/app`,
  `src/content` et `src/components`. Les trois agents de `.claude/agents/` pointent vers ces
  documents : quand le contrat change, relire leurs listes de vérifications.

## Variables d'environnement

```
SMTP_USER=adrien.monte@synapgeek.com    # login SMTP Google Workspace
SMTP_PASS=****                           # mot de passe d'application Google
CONTACT_EMAIL=contact@synapgeek.com      # destinataire du formulaire de contact
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=****      # reCAPTCHA v2, clé de site
RECAPTCHA_SECRET_KEY=****                # reCAPTCHA v2, clé secrète
NEXT_PUBLIC_GA_MEASUREMENT_ID=****       # GA4, via ConsentBootstrap (absente : GA4 ne charge pas)
```

En local dans `.env.local` (ignoré par git) ; pas de `.env.example`. Toute variable ajoutée se
configure dans Vercel en production (aucune preview) et s'ajoute ici. Toute `NEXT_PUBLIC_*` est
figée au build. Aucune `process.env` sans `NEXT_PUBLIC_` hors de `src/app/api/`.
`WAITLIST_WEBHOOK_URL` est orpheline (aucune référence) : à supprimer de Vercel si elle y subsiste.

## Sécurité

7 en-têtes via `vercel.json`. `/api/contact` : reCAPTCHA v2 vérifié, `EMAIL_REGEX`, `MAX_*_LENGTH`,
`escapeHtml`, `stripNewlines`, messages d'erreur constants. `contact@` et `privacy@` sont en clair
(`mailto:`) sur les pages légales, À propos, Presse et `ContactBand`, pas dans le pied de page.

## Cerebrum en bref

Faits, données collectées, éditeur : `docs/contrat/`. App Store **3.0.0** depuis le 2026-09-28
(bundle `com.synapgeek.cerebrumgame`, App ID `6763915130`), Google Play **3.0.0** à 100 % depuis
le 2026-10-01 (package `com.synapgeek.cerebrum`, **différent** : pas une coquille). Dates : Adrien.

- **Dix jeux en français et en anglais, huit dans les 14 autres langues** de l'app (16 au total ;
  Mots Croisés et Mots Mêlés seulement en FR et EN). Le site **n'écrit jamais un nombre de jeux
  ni de niveaux**. « Zip » est le nom de code interne de Trace : jamais écrit. Les cristaux du
  Labyrinthe ne sont pas les gemmes.
- Gratuit avec publicité (bannière, pubs entre certaines parties, pubs récompensées facultatives) ;
  Premium (semaine, mois, an) = « zéro pub imposée », jamais « sans pub ». Les packs Cinéma,
  Cuisine et Voyage sont le seul achat de contenu, hors Premium. Un seul défi du jour pour toute
  l'app. Le classement par jeu est masqué en 3.0.0 : ne jamais l'annoncer.
- Hors ligne local-first. Connexion : invité, Apple, Google, Facebook. Public : 13 ans et plus.

## Points à trancher

Contradictions constatées, non arbitrées : à lever, pas à recopier.

1. **App Privacy (App Store Connect) et Data Safety (Play Console)** : la politique documente une
   localisation approximative déduite de l'IP par AdMob et UMP ; à recouper avec les deux consoles
   (non lisibles depuis ce dépôt).
2. **Classification d'âge** : CGU à 13+, App Store à 4+, Play à « Everyone » avec « Contains ads ».
   Une app tout public qui sert de la pub personnalisée sans age gate relève de la Families policy
   de Google : le risque de suspension le plus concret.
3. **Juridiction des CGU** : « tribunaux de Paris » (`fr.ts`, `en.ts`), siège à Frontenas. À faire
   trancher par un juriste avant de corriger.
4. **Consent Mode hors zone RGPD** : `analytics_storage: "granted"` par défaut hors des 43
   juridictions de `GDPR_REGIONS` envoie des signaux sans cookie avant tout choix. Jamais soumis à
   un avis juridique pour synapgeek.com (mécanisme repris de Word Search Trove) : à valider.
5. **Mesures améliorées GA4** (défilement, clics sortants) : actives par défaut côté admin GA4 ;
   vérifier leur cohérence avec la politique.
6. **`GDPR_REGIONS`** couvre ici GF, GP, MQ, RE, YT, MF et AX ; la liste source de Word Search
   Trove ne les a pas encore.
7. **Android, stockage Firebase Analytics accordé quel que soit le choix de consentement** (docs du
   dépôt Android, relevé dans `faits-cerebrum-3.0.0-android.md`) : à confronter à la politique et
   au RGPD.
8. **Politique de confidentialité** : la finalité « gérer les classements » alors que les
   classements sont masqués en 3.0.0, et un consentement affiché « au premier lancement ».
9. **Data Safety (Play Console)** : deux lignes (historique d'achats, interactions avec l'app)
   restent à passer en « partagé » (docs du dépôt Android).
10. **Suite de la refonte** : support fr-FR d'App Store Connect à basculer sur `/fr#contact`, et
    redirection 307 de `/fr/<page légale>` à poser (`docs/contrat/lancement.md`).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
