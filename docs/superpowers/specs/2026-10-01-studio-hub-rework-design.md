# Spec — refonte de synapgeek.com en hub studio multi-apps

> Statut : rédigée le 2026-10-01 (session « Synapgeek website - Rework »), à partir des décisions
> d'Adrien prises le même jour. Branche : `feat/studio-hub-rework`. Brief produit : `PRODUCT.md`
> (racine). Recherche : brief de cadrage, playbook GEO vérifié et audit du site, résumés ici.
> Le code fait foi dès qu'il existe ; toute divergence entre cette spec et le code livré se
> corrige dans le même lot.

## 1. Objectif

Faire de synapgeek.com, aujourd'hui une landing mono-app Cerebrum, le **site officiel d'un studio
d'apps mobiles** : un accueil studio, une page par app (Cerebrum d'abord), **une page par jeu**, une
page À propos et une page Presse. Le but premier est le **SEO et le GEO** : que Google et les
assistants IA (ChatGPT, Perplexity, Gemini, Copilot, Claude) comprennent, décrivent correctement et
recommandent Cerebrum et les apps à venir.

Pourquoi maintenant :

- ChatGPT pèse déjà environ 18 % des premiers téléchargements de Cerebrum (App Referrer ASC,
  26/08-24/09) et cite synapgeek.com parmi ses sources ; le panel de prompts du 25/09 ne cite
  Cerebrum que sur 3 requêtes sur 11, jamais sur les genres ajoutés en 3.0.0 (Star Battle,
  démineur, nonogrammes).
- Cerebrum 3.0.0 (10 jeux en français et en anglais, 16 langues) est en ligne sur l'App Store
  depuis le 2026-09-28 ; le site décrivait encore la 2.x.

### Mesure du succès

1. Panel de prompts mensuel (`cerebrum-design-system/marketing/ASO/3.x.x/geo-assistants-ia.md`,
   11 prompts + 3 prompts « marque ») : taux de citation de Cerebrum et exactitude de sa
   description (gratuit avec publicité, Premium sans pub imposée, hors ligne, liste des jeux).
2. Clics vers les stores (`app_store_click`) et App Referrer « ChatGPT » dans ASC.
3. Ajouter une app (y compris une app qui n'est pas un jeu) ne demande que des données et une page.

## 2. Décisions d'Adrien (2026-10-01)

| Sujet | Décision |
|---|---|
| Périmètre du hub | Apps mobiles uniquement. Word Search Trove et Maze Foundry n'apparaissent jamais (règle portefeuille 2). |
| Nature du studio | Studio d'apps, pas seulement de jeux. L'app non-jeu en développement n'est jamais nommée (nom de code interne). |
| Architecture | Option A : hub + jeux rangés sous leur app (`/cerebrum/<jeu>`). |
| Langues | Anglais par défaut sans préfixe, français sous `/fr`, architecture prête pour d'autres langues. |
| Slugs | Traduits en français quand le nom change (`/fr/cerebrum/mots-croises`). |
| Contenu | Pages jeux riches, explicatives « comme les descriptions ASO » ; rédigées par Claude, relues par Adrien ; guides plus tard. |
| Presse | Une page Presse dès la v1. |
| Redirection store | `/cerebrum/play` canonique (QR des chevalets) ; `/play` et `/jouer` y redirigent (lot 0c, PR #11). |
| Visuel | Le standard de la catégorie (landing de studio d'apps), au niveau de finition d'easybrain.com et oakevergames.com, ADN conservé (logo cerveau, vert et violet, icônes kawaii des jeux). |
| Méthode | Construction code d'abord pour cette refonte (bascule faite sur la page de décision impeccable). |
| Public | Adultes de 30 à 60 ans, pause détente ; WCAG 2.1 AA standard. |
| Modèles | Sous-agents Sonnet pour l'implémentation ; Opus réservé aux revues et aux gates. |
| Déploiement | Seule `main` déploie sur Vercel (`git.deploymentEnabled`), aucune preview de branche. |

## 3. Hors périmètre

- Guides et articles (rubrique éditoriale) : phase ultérieure.
- Autres langues que FR et EN (l'architecture les permet, aucune n'est ajoutée).
- La page de la future app non-jeu (elle arrivera le jour de sa sortie, par ajout de données).
- Le mécanisme de consentement (Consent Mode v2, `ConsentBanner`) : inchangé ; la divergence avec
  la règle portefeuille 8 (bandeau maison) est un arbitrage séparé d'Adrien.
- Les pages légales : contenu inchangé (hors corrections factuelles déjà faites au lot 0b),
  nouvel habillage seulement.
- Les actions hors site (Bing Webmaster Tools, GA4, Wikidata, presse, YouTube, Reddit) : listées
  en §11 comme suites, hors code.

## 4. Prérequis : les lots 0

La refonte se construit **par-dessus** trois branches déjà prêtes, intégrées localement dans
`feat/studio-hub-rework` (merge de branches) puis re-synchronisées avec `main` quand Adrien les
aura mergées :

| Lot | Branche | Contenu | État |
|---|---|---|---|
| 0a | `chore/claude-stack-from-wst` | vitest + `route-invariants.test.ts`, `check:contract`, CI GitHub, skill `design-references`, MCP shadcn, agents mis à jour | correctifs de revue en cours |
| 0b | `fix/site-facts-3.0.0` | site actuel aligné sur Cerebrum 3.0.0 | correctifs en cours ; merge après Android 3.0.0 à 100 % et le point zéro des prompts « marque » |
| 0c | `feat/cerebrum-play-route` (PR #11) | `/cerebrum/play` + alias `/play`, `/jouer` | mergeable, vérifié sur Vercel |

Les trois portent la règle `vercel.json` « seule `main` déploie ».

## 5. Architecture d'information et URLs

### 5.1 Arborescence

| Page | Anglais (défaut) | Français |
|---|---|---|
| Hub studio | `/` | `/fr` |
| App Cerebrum | `/cerebrum` | `/fr/cerebrum` |
| Sudoku | `/cerebrum/sudoku` | `/fr/cerebrum/sudoku` |
| Pandoku | `/cerebrum/pandoku` | `/fr/cerebrum/pandoku` |
| Minesweeper / Démineur | `/cerebrum/minesweeper` | `/fr/cerebrum/demineur` |
| Pixel Art | `/cerebrum/pixel-art` | `/fr/cerebrum/pixel-art` |
| Cross Math | `/cerebrum/cross-math` | `/fr/cerebrum/cross-math` |
| Crossword / Mots croisés | `/cerebrum/crossword` | `/fr/cerebrum/mots-croises` |
| Word Search / Mots mêlés | `/cerebrum/word-search` | `/fr/cerebrum/mots-meles` |
| Trace | `/cerebrum/trace` | `/fr/cerebrum/trace` |
| Maze / Labyrinthe | `/cerebrum/maze` | `/fr/cerebrum/labyrinthe` |
| Arrow Maze | `/cerebrum/arrow-maze` | `/fr/cerebrum/arrow-maze` |
| À propos | `/about` | `/fr/a-propos` |
| Presse | `/press` | `/fr/presse` |
| Confidentialité (gelée) | `/en/privacy` | `/privacy` |
| CGU (gelées) | `/en/terms` | `/terms` |
| Mentions légales (gelées) | `/en/legal` | `/legal` |

Service, sans langue : `/cerebrum/play` (noindex, hors sitemap).

### 5.2 Le contrat, et pourquoi les pages légales gardent leur schéma

L'app iOS 3.0.0 installée ouvre `synapgeek.com/privacy`, `/terms` et `/#contact` quand sa langue
est le français, et `/en/privacy`, `/en/terms`, `/en#contact` dans les 15 autres langues
(`LegalURLProvider.swift`) ; la fiche App Store fr-FR déclare `synapgeek.com` (marketing),
`/#contact` (support) et `/privacy` ; les 19 autres locales déclarent `/en`, `/en#contact` et
`/en/privacy` ; UMP (AdMob) et le formulaire Data Safety de Google Play (`/account-deletion`)
pointent aussi ces URLs. Une app installée ne se met pas à jour. Donc :

| URL | Comportement après la refonte |
|---|---|
| `/privacy`, `/terms`, `/legal` | 200, **français** (inchangé) |
| `/en/privacy`, `/en/terms`, `/en/legal` | 200, anglais (inchangé) |
| `/fr/privacy`, `/fr/terms`, `/fr/legal` | 308 vers `/privacy`, `/terms`, `/legal` (fin du doublon) |
| `/account-deletion` (+ `/en/`, `/fr/`) | 307 vers l'ancre `#account-deletion`, inchangé |
| `/` | 200, hub **anglais**, garde `id="contact"` |
| `/en` (et `/en/`) | 308 vers `/` (l'ancre `#contact` est conservée par le navigateur) |
| `/fr` | 200, hub français, garde `id="contact"` |
| `/cerebrum/play`, `/play`, `/jouer` | lot 0c, inchangé |
| `/.well-known/*`, `/app-ads.txt`, `/llms.txt`, `/robots.txt`, `/sitemap.xml` | 200, inchangés |
| `www.synapgeek.com/*` | 308 vers l'apex, chemin conservé (réglage Vercel, inchangé) |
| Toute autre URL `/en/<x>` | 308 vers `/<x>` (pas de doublon anglais préfixé) |

Un francophone arrivé sur le hub anglais par l'app (`/#contact`) voit un lien discret « Version
française » vers `/fr#contact` (détection `navigator.language` côté client, sans redirection
automatique, sans changement de contenu servi).

### 5.3 Routage et i18n

- `DEFAULT_LOCALE` devient `en` ; `X_DEFAULT_LOCALE` reste `en`.
- Le proxy (`src/proxy.ts`) : sans préfixe → réécriture vers `/en/<chemin>`, **sauf** les trois
  chemins légaux gelés (réécrits vers `/fr/<chemin>`) et `LOCALE_FREE_ROUTES`
  (`/cerebrum/play`). Les redirections (`/en` → `/`, `/en/<x>` → `/<x>` hors légal, `/fr/<légal>`
  → `/<légal>`) vivent dans `next.config.ts` `redirects()` si l'expression le permet
  proprement, sinon dans le proxy ; `site-architect` tranche. Le matcher du proxy ne change pas.
- Les slugs traduits sont des **données** : chaque page connaît son chemin par locale ; un helper
  unique (`getLocalePath` étendu, ou `pagePath(pageId, locale)`) produit les liens, les canonicals,
  les hreflang et le sitemap. Plus aucune URL interne n'est écrite à la main.
- Routes : `[locale]/page.tsx` (hub), `[locale]/[app]/page.tsx` ou `[locale]/cerebrum/page.tsx`,
  `[locale]/[app]/[game]/page.tsx`, `[locale]/about` et `[locale]/press` avec leurs slugs FR. Le
  choix entre segments dynamiques nourris par le registre et dossiers explicites revient à
  `site-architect` ; contraintes : SSG pur, `generateStaticParams` partout, segment inconnu → vrai
  404, jamais `dynamicParams = false`, jamais de `[locale]/cerebrum/play`.
- Smart App Banner Safari (`itunes.appId`) : uniquement sur `/cerebrum` et ses pages jeux.

## 6. Modèle de contenu

- **Registre des apps** (`src/content/apps/`) : une entrée par app, faits non localisés (slug,
  nom, éditeur, identifiants et URLs stores, plateformes et versions minimales vérifiées, langues
  de l'app, classification, thème, assets) et la liste ordonnée de ses jeux.
- **Registre des jeux** : par jeu, son identifiant, sa catégorie (logique et chiffres ; mots ;
  parcours), ses slugs par locale, son nom maison et son genre par locale, ses difficultés réelles,
  ses vies, la présence d'un tutoriel, la disponibilité par plateforme (version de sortie iOS et
  Android) et par langue de contenu (Mots croisés et Mots mêlés : FR et EN seulement), son couple
  de couleurs (palette Cerebrum `game-palette.json`), son icône et ses captures FR/EN.
- **Textes** par locale, écrits nativement (jamais traduits), typés pour garantir la parité FR/EN :
  textes d'interface partagés (`Dictionary`, allégé), textes du hub, de l'À propos et de la
  Presse, texte de la page app et de chaque page jeu.
- **Disponibilité par plateforme** : les 4 jeux arrivés en 3.0.0 s'affichent « iPhone et iPad »
  tant qu'Android 3.0.0 n'est pas confirmé à 100 %, puis « iPhone, iPad et Android » en changeant
  une donnée.
- **Sources des faits** : fiche App Store 3.0.0 (`asc-metadata.md`), faits vérifiés sur le tag
  v3.0.0 (session App iOS), session Design System (icônes, palette, captures) ; toute affirmation
  sur Android est vérifiée avant publication.

## 7. Gabarits de pages

Règles communes : un seul H1 par page, **suivi immédiatement d'une phrase de définition de 150 à
250 caractères en texte HTML** (quoi, sur quels appareils, par qui) ; faits clés en texte, jamais
dans une image ; fil d'Ariane sur les pages profondes ; boutons stores officiels ; date « Mis à
jour le » sur les pages app et jeu.

- **Hub `/`** : en-tête (logo, Jeux, À propos, Presse, langue) ; héros avec H1 « Synapgeek » et la
  phrase de définition du studio, badges stores, téléphone montrant l'accueil de Cerebrum ; carte
  de l'app Cerebrum ; grille des 10 jeux groupés par catégorie, chaque carte vers sa page ; bande
  de faits vrais (hors ligne, 16 langues, iPhone, iPad et Android, gratuit) ; le studio en bref
  vers `/about` ; contact `#contact` (formulaire actuel) ; pied de page (légal, langue, « Gérer mes
  cookies »). JSON-LD : Organization, WebSite.
- **App `/cerebrum`** : H1 « Cerebrum » + phrase de définition (celle de la fiche) ; capture de
  l'accueil dans un cadre ; les jeux par catégorie ; défi du jour et série ; progression (parcours,
  étoiles, mode infini, ligues, avatar) ; « bon à savoir » (hors ligne, invité, connexion
  facultative, 16 langues, appareils) ; « Gratuit, avec ou sans Premium » en clair et sans prix ;
  FAQ ; résumé confidentialité vers `/privacy`. JSON-LD : SoftwareApplication co-typé
  MobileApplication (+ VideoGame), BreadcrumbList, FAQPage.
- **Jeu `/cerebrum/<jeu>`** : fil d'Ariane ; H1 nom du jeu + phrase de définition accolant le genre
  (« Pandoku est un puzzle de logique de type Star Battle… dans Cerebrum, l'app de jeux de
  réflexion hors ligne de Synapgeek ») ; capture du jeu dans la couleur du jeu ; **comment jouer**
  en étapes numérotées (texte des tutoriels de l'app quand il existe) ; **ce que Cerebrum ajoute**
  avec un tableau des difficultés et des vraies tailles de grille, parcours, étoiles, mode infini,
  aides ; 3 à 5 astuces de joueur originales ; FAQ du jeu ; autres jeux de la même catégorie ;
  badges stores ; « Mis à jour le ». JSON-LD : VideoGame relié à Cerebrum et à Synapgeek,
  BreadcrumbList, FAQPage.
- **À propos `/about`** : Synapgeek SAS, studio indépendant à Frontenas (Rhône), ce qu'il fait et
  comment ; liens vers les fiches stores et `/legal`. Page entité qui lève l'homonymie autour de
  « Cerebrum ». JSON-LD : Organization (complète, `sameAs` limité aux profils réels).
- **Presse `/press`** : fiche d'identité (éditeur, app, plateformes, langues, modèle économique,
  liste des jeux, date de sortie iOS), téléchargements (logos, icône, captures FR/EN), contact
  `contact@synapgeek.com`. Aucun chiffre non vérifié.
- **Pages légales** : contenu et ancres inchangés, nouvel habillage, rendues sans JavaScript.
- **404** et repli desktop de `/cerebrum/play` : nouvel habillage, contenu localisé via
  `Dictionary`.

## 8. Direction visuelle

Choisie par Adrien sur la page de décision impeccable : **le standard de la catégorie, exécuté
impeccablement**, au niveau de finition d'easybrain.com et oakevergames.com, sans ironie ni
bizarrerie glissée. Maquette de référence : `.impeccable/mocks/decision/canon.png`.

- **ADN conservé** : logo cerveau, vert `#58CC02` et violet `#8549BA` du studio, icônes kawaii des
  jeux, captures réelles de l'app.
- **Mécanismes d'Oakever et d'easybrain repris, jamais leur habillage** : sections en bandes de
  couleur, grandes cartes de jeux arrondies au format affiche (lavis et ton profond du jeu), typo
  ronde et grasse, boutons pilule, une section sombre qui casse le rythme, légère inclinaison du
  téléphone du héros qui suit le pointeur (désactivée en `prefers-reduced-motion`), page par jeu
  à la easybrain.
- **Typographie** : Fredoka (titres) et Nunito (texte), via `next/font/google`, déjà associées sur
  le chevalet imprimé de Cerebrum. La police de l'app (Next Sunday) n'a ni accents ni licence web.
- **Couleur** : fond clair ; encre sombre ; vert pour l'action principale avec un texte qui tient
  4,5:1 (encre sur vert, ou vert assombri sous texte blanc) ; violet en accent ; chaque page jeu
  prend son couple de couleurs de la palette Cerebrum. Tous les tokens dans `globals.css`, aucun
  hex en dur dans les composants.
- **Garde-fous COPPA** (session Design System) : personnages en illustration d'appoint, jamais en
  narrateurs ; aucun mot qui vise l'enfant ou la famille ; usages adultes en tête ; vraies captures
  bien visibles ; stades bébé et ado des avatars en texte, jamais en visuel de héros.
- **Images** : icônes livrées dans l'app, captures 3.0.0 dans un cadre de téléphone dessiné par le
  site, images Open Graph générées au build (icône + nom). Toute image remplacée change de nom
  (cache de 7 jours sur `/images/*`).
- `DESIGN.md` et `.impeccable/design.json` sont écrits **à la fin**, depuis le site construit, par
  le documenteur impeccable.

## 9. SEO / GEO technique

Seules les recommandations vérifiées sur sources primaires (playbook du 2026-10-01) :

- H1 + phrase de définition sur chaque page (l'index de ChatGPT retient environ 200 caractères
  ancrés sur le H1).
- Une URL par jeu (les AI Overviews de Google découpent chaque question en sous-recherches).
- `robots.txt` grand ouvert ; robots IA listés en clair (OAI-SearchBot, GPTBot, PerplexityBot,
  ClaudeBot, Claude-SearchBot, Google-Extended, Applebot-Extended, Bingbot…) ; jamais le pare-feu
  Vercel « AI Bots » en mode Deny.
- Sitemap complet (pages × 2 langues), hreflang réciproques avec slugs traduits, x-default en
  anglais, vraies dates de modification.
- JSON-LD uniquement via `src/lib/structured-data.ts`, paramétré par app et par jeu : hygiène, pas
  un levier. Aucune `aggregateRating`.
- FAQ visibles reprises mot pour mot dans `FAQPage`.
- Image Open Graph par page.
- `llms.txt` réécrit pour couvrir le hub, l'app et les 10 jeux ; aucun investissement au-delà.
- IndexNow : fichier clé + script de ping après déploiement (Bing et Copilot).
- Écriture : règles GEO de l'ASO Cerebrum (définition d'abord, nom maison + genre, aucun nombre de
  jeux ni de niveaux, « zéro pub imposée », cristaux ≠ gemmes, jamais Zip, Queens ni Picross),
  français écrit nativement, aucun cadratin dans le texte visible.

## 10. Production du contenu

- Rédaction par des sous-agents Sonnet, page par page, en FR et en EN séparément, depuis les
  sources de faits (§6) ; chaque page jeu apporte une valeur propre (règle portefeuille 9 : pas de
  gabarit où seul le nom change).
- Relecture factuelle par la session App iOS (elle l'a proposée), puis relecture d'Adrien.
- Deux vagues de publication : vague 1 = hub, Cerebrum, À propos, Presse, Sudoku et les 4 jeux de
  la 3.0.0 ; vague 2 = Mots croisés, Mots mêlés, Cross Math, Trace, Labyrinthe.
- Points à vérifier avant d'écrire : la phrase « grilles générées par nos outils et vérifiées par
  des solveurs » (les nonogrammes de Pixel Art sont dessinés à la main) ; les versions minimales
  iOS 17 et Android 8.0 ; les contenus Premium côté Android.

## 11. Qualité, vérification, mise en ligne

- **Gates** : `site-architect` (Opus) sur cette spec puis sur le plan ; `site-reviewer` (Opus) sur
  chaque PR ; revue de finition impeccable (relecteur frais) sur le visuel.
- **Tests** : `route-invariants.test.ts` étendu au nouveau contrat (anglais par défaut, pages
  légales gelées, redirections, slugs, sitemap dérivé du registre, JSON-LD unique, plafond des
  ternaires de locale) ; nouveaux gardes de contenu (aucun nombre de jeux, aucun cadratin, aucun
  mot visant l'enfant, aucun Zip/Queens/Picross, parité FR/EN des registres) ; chaque garde prouvé
  par mutation.
- **`check:contract`** étendu (§5.2) et rejoué sur `next start` avant la PR, puis sur la
  production après le merge.
- **Sans preview Vercel** : vérification locale (`next start`), inspection des redirections
  compilées par `vercel build` sans déploiement, contrôle visuel desktop et mobile dans Chrome,
  Lighthouse (cible : performance mobile ≥ 90, accessibilité et SEO à 100 sur hub, app et jeu).
- **Fondations techniques** : montée de Next 16.1.6 à 16.3.x (version de Word Search Trove) au
  début du chantier, isolée et vérifiée ; restructuration de `CLAUDE.md` en racine courte +
  `docs/contrat/` + `CLAUDE.md` de proximité, à la fin, quand son contenu est stabilisé.
- **Mise en ligne** : PR unique de la refonte, merge par Adrien uniquement. Puis, hors code et
  par session dédiée : URL marketing de la fiche App Store fr-FR vers `/fr/cerebrum` (session
  iOS) ; site de la fiche Play (session Android) ; QR définitif des chevalets vers `/cerebrum/play`
  (session Design System) ; Bing Webmaster Tools et rapport « AI Performance » ; canal « AI
  Assistant » et regroupement Claude/Perplexity dans GA4 ; ping IndexNow ; relevé du panel
  (fenêtre du 12 au 19/10, au moins une semaine après la mise en ligne, sinon décalé).

## 12. Risques et questions ouvertes

| Risque | Parade |
|---|---|
| Android encore en 2.1.5 au moment du merge | disponibilité par plateforme en données (§6) |
| Contenu interchangeable entre pages jeux | valeur propre par jeu, relecture, garde de contenu |
| Le fun bascule vers l'enfantin (Families policy) | garde-fous COPPA (§8), ton adulte, revue |
| Redirections différentes entre `next start` et Vercel | `vercel build` + `check:contract` sur la production juste après le merge |
| Volume de texte à relire pour Adrien | deux vagues, relecture factuelle iOS d'abord |
| Montée de version Next | lot isolé, tests et build verts avant toute autre modification |

Questions ouvertes (non bloquantes) : la phrase sur les solveurs (§10) ; l'ajout futur d'autres
langues ; la règle portefeuille 8 sur le bandeau de consentement (hors chantier).
