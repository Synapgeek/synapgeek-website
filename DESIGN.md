---
name: Synapgeek, hub du studio
description: Un studio indépendant français, ses apps, une page honnête par jeu. Fond blanc, vert d'action, lavis pastel, cartes arrondies, scènes d'ambiance sous un voile.
colors:
  ink: "#1a1a2e"
  canvas: "#ffffff"
  canvas-soft: "#f7f7fb"
  border: "#e5e5e5"
  text-secondary: "#5b6270"
  text-tertiary: "#6b7280"
  brand-green: "#58cc02"
  brand-green-ink: "#2f6b00"
  brand-violet: "#8549ba"
  brand-violet-deep: "#3b1f6e"
  cerebrum: "#bf529f"
  wash-green: "#d9f2c4"
  wash-violet: "#e4d8f4"
  error: "#b3261e"
typography:
  display:
    fontFamily: "Fredoka, system-ui, sans-serif"
    fontSize: "clamp(3.75rem, 8vw, 6rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Fredoka, system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 4vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Fredoka, system-ui, sans-serif"
    fontSize: "1.125rem to 1.875rem"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "1rem to 1.125rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "0.75rem to 0.875rem"
    fontWeight: 700
    lineHeight: 1.375
rounded:
  card: "28px"
  pill: "9999px"
  field: "16px"
  app-icon: "22%"
spacing:
  gutter: "clamp(1.25rem, 5vw, 2rem)"
  section: "clamp(4rem, 9vw, 7.5rem)"
  content-wide: "72rem"
  content-prose: "48rem"
components:
  button-primary:
    backgroundColor: "{colors.brand-green}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "44px"
  button-primary-lg:
    backgroundColor: "{colors.brand-green}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 32px"
    height: "56px"
  button-secondary:
    backgroundColor: "{colors.wash-violet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "44px"
  button-outline:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "44px"
  button-outline-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas}"
  button-inverse:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.brand-violet-deep}"
    rounded: "{rounded.pill}"
    height: "44px"
  game-card:
    backgroundColor: "game wash, en dégradé 155° (.game-gradient)"
    textColor: "game deep (per game)"
    rounded: "{rounded.card}"
  app-showcase:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
  app-showcase-name:
    textColor: "{colors.cerebrum}"
    typography: "{typography.headline}"
  difficulty-table:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
  band-violet-deep:
    backgroundColor: "{colors.brand-violet-deep}"
    textColor: "{colors.canvas}"
---

# Design System: Synapgeek, hub du studio

## Overview

**Creative North Star: "La vitrine du studio"**

Le standard de la catégorie « landing de studio d'apps », exécuté proprement : un fond blanc, une encre quasi noire, un vert vif réservé à l'action, des lavis pastel qui portent les jeux, des cartes très arrondies et des boutons pilule. On n'ouvre pas sur un slogan sur dégradé, mais sur une phrase de définition et sur la vraie app dans un téléphone. La chaleur vient de la couleur des jeux et de Fredoka, pas de la décoration.

La densité est aérée : une section par idée, un seul fondu d'entrée par section, aucune parallaxe, aucun carrousel. La preuve produit reste réelle : captures de l'app 3.0.0 dans un cadre de téléphone dessiné en CSS, icônes des jeux, cartes des jeux au style de l'app. Le décor d'ambiance, lui, est généré (la table de l'accueil, la scène zen de Cerebrum) et jamais présenté comme une capture : il se tient derrière un voile, avec `alt=""`, et ne porte aucune information. Le public est adulte : les personnages sont des illustrations d'appoint, jamais des narrateurs ; les trois Pandas de « Construit par des passionnés » sont les avatars de l'app qui grandissent de bébé à adulte, un fait produit, pas une cible enfant.

Écart assumé par rapport au contrat de direction : le corps est en Figtree, non en Nunito (Nunito appartient à un autre site du même propriétaire). Le build fait foi.

**Key Characteristics:**

- Fond blanc, encre `#1a1a2e`, vert Synapgeek pour l'action, texte encre sur vert.
- Une seule section violet profond par page, pour casser le rythme.
- Couple lavis / ton profond propre à chaque jeu sur ses cartes et sa page.
- Cartes de 28 px de rayon, boutons pilule, un seul bouton (`Button`, quatre variantes).
- Ombres teintées encre, une échelle de trois crans, jamais décalées ni dures.
- Scènes d'ambiance générées sous un voile de la couleur de la page, le texte et le téléphone par-dessus.
- Cartes de jeux au style de l'app : dégradé du lavis, liseré clair, paillettes.
- Mouvement court (150 à 250 ms, ease-out), respect de `prefers-reduced-motion`. Une seule exception assumée : les taches de couleur de la bande violet profond (voir Motion).

## Colors

Une palette de marque courte (vert, violet), des lavis pastel, et une famille de couples lavis/profond par jeu. Toute couleur vit dans `src/app/globals.css` ; aucun hex ailleurs (test `no-hardcoded-hex`).

### Primary

- **Vert Synapgeek** (`brand-green`) : fond des boutons primaires, toujours avec du texte encre (contraste AA). Jamais en texte sur fond clair.
- **Vert encre** (`brand-green-ink`) : le vert quand il doit être du texte sur fond clair.

### Secondary

- **Violet Synapgeek** (`brand-violet`) : accent, anneau de focus sur fond clair, curseur de saisie.
- **Violet profond** (`brand-violet-deep`) : la section profonde unique (texte blanc dessus), le texte du bouton inverse, et le nom « Synapgeek » du H1 de l'accueil, en aplat.
- **Magenta Cerebrum** (`cerebrum`, `#bf529f`) : la couleur du wordmark de l'app (constante de marque du design system de Cerebrum), pour le nom « Cerebrum » en très grand corps : le H1 de `/cerebrum` et le H3 de l'encart de l'accueil. Il tient 4,27:1 sur blanc et 3,99:1 sur `canvas-soft` : AA pour le grand texte (24 px et plus) seulement, jamais en corps de texte. Une app lit son nom dans `AppEntry.wordmarkColor`, le nom d'un jeton `--color-<app>` de `globals.css`.

### Tertiary

- **Lavis vert** (`wash-green`) : fond de la figure des trois Pandas sur `/cerebrum`, avis de succès du formulaire de contact.
- **Lavis violet** (`wash-violet`) : bouton secondaire, sélection de texte, survol de la langue.
- **Couples par jeu** (variables `--game-<jeu>-wash` et `--game-<jeu>-deep`, dix jeux) : le lavis est le fond, le ton profond est le texte sur ce lavis, assombri pour tenir 4,5:1 (vérifié par `design-tokens.test.ts`). Ils s'appliquent par `gameColorVars`, jamais en copiant une valeur. Sur une carte, le lavis est posé en dégradé (`.game-gradient`, voir Cards) : il ne fait qu'éclaircir le lavis, le 4,5:1 du ton profond ne bouge pas.

### Erreur

- **Rouge d'erreur** (`error`) : bordure et libellé d'un champ invalide, texte et filet de l'avis d'erreur du formulaire. Jamais en fond plein ; en teinte (5 % de fond, 30 % de filet) pour l'avis.

### Neutral

- **Encre** (`ink`) : texte et ombres (teinte des ombres).
- **Blanc** (`canvas`) et **gris-bleu très clair** (`canvas-soft`) : fonds de bandes alternées.
- **Gris texte** (`text-secondary`, `text-tertiary`) : textes d'appoint, AA sur blanc et sur `canvas-soft`.
- **Filet** (`border`) : séparateurs de tableaux et de fiches, bordure d'en-tête.

### Named Rules

**The Ink On Green Rule.** Tout texte sur le vert est de l'encre. Le blanc sur vert échoue l'AA ; le bouton d'envoi du formulaire de contact suit désormais la règle (`Button` primaire).

**The One Deep Section Rule.** Une seule bande violet profond par page ; le focus y passe en blanc (`--focus-ring`).

**The Token Only Rule.** Une couleur d'état (erreur, succès, focus) vient d'un jeton de `globals.css`, jamais d'un rgba ni d'un hex posé dans un composant.

**The Large Text Only Rule.** Le magenta Cerebrum (`cerebrum`) n'est jamais du corps de texte : 3:1 pour le grand texte, vérifié sur `canvas` et `canvas-soft` par `design-tokens.test.ts` (paires « large text »). Sous 24 px, l'encre.

**The Plain Name Rule.** « Synapgeek » s'écrit en violet profond uni, jamais en dégradé multicolore ni en texte détouré ; « Cerebrum » en magenta uni.

**The Wash Pair Rule.** Une couleur de jeu se lit toujours comme un couple : lavis en fond, ton profond en texte. Au survol, le voile éclaircit (35 % de blanc), il n'assombrit jamais, pour ne pas perdre le contraste.

## Typography

**Display Font:** Fredoka (600 et 700 chargés ; repli system-ui)
**Body Font:** Figtree (police variable, repli system-ui)

**Character:** Fredoka, ronde et affirmée, donne la voix du studio dans les titres, les noms de jeux et les chiffres de tableaux ; Figtree, neutre et lisible, porte les phrases. Tous les `h1` à `h6` sont en Fredoka 700 avec `text-wrap: balance` ; les paragraphes en `text-wrap: pretty`.

### Hierarchy

- **Display** (700, `text-6xl` / `sm:text-7xl` / `lg:text-8xl`, interligne 1, -0.03em) : le H1 du héros, unique par page : « Synapgeek » en violet profond sur l'accueil, « Cerebrum » en magenta sur `/cerebrum`.
- **Headline** (700, `text-3xl` / `sm:text-4xl` / `lg:text-5xl`, 1.1, -0.02em) : le H2 de chaque `SectionBand`.
- **Title** (Fredoka 700, `text-lg` à `text-3xl`) : nom d'une carte de jeu (`text-lg`, `sm:text-xl`), d'une app dans son encart (`text-3xl`, `sm:text-4xl`, en magenta Cerebrum, soit 30 px et plus), légendes et libellés de tableaux.
- **Body** (Figtree 400, 16 à 20 px, interligne 1,625) : phrases de définition, introductions, descriptions ; colonne limitée à 65ch.
- **Label** (Figtree 700, 12 à 14 px) : genre et plateformes des cartes, boutons, liens de navigation.

### Named Rules

**The Two Voices Rule.** Fredoka pour ce qu'on nomme (titres, noms, libellés de ligne), Figtree pour ce qu'on lit. Pas de troisième police, pas de capitales espacées.

**The 65ch Rule.** Toute prose est plafonnée à 65 caractères de large.

## Layout

Bandes pleine largeur (`SectionBand`) empilées ; chacune centre un contenu de 72 rem (`max-w-6xl`), ou 48 rem pour la colonne de lecture des pages de jeu. Gouttière latérale fluide (`gutter`), rythme vertical fluide entre bandes (`section`, 64 à 120 px). Les bandes alternent blanc, `canvas-soft`, lavis de jeu et, une fois, violet profond.

Ordre du hub (accueil corporate, amendement d'Adrien du 2026-10-02) : le héros, « Nos apps » (`#apps`, un encart pleine largeur par app), « Construit par des passionnés » (la bande violet profond), contact. La barre collante et le pied de page pointent vers `#apps`.

**Héros de l'accueil (`HomeHero`).** La photo de la table (croissant, jus d'orange, mots croisés, crayon) en pleine largeur, en deux cadrages, sous un voile de la couleur de la page. Desktop : le texte se pose à droite, sur le bois libre, le voile `from-canvas/92` s'efface vers la gauche pour laisser voir la photo. Mobile : le texte est centré en haut, sous un voile qui s'éclaircit vers le bas. Le H1 porte le nom du studio puis son accroche (deux blocs du même titre, l'accroche en 2xl à 4xl), suivis de la phrase de définition et du bouton vers la page de l'app. La photo est l'image LCP : un seul `<picture>` à deux sources selon la largeur (`SceneBackground`, `priority`), sans préchargement manuel (voir SceneBackground).

**Héros de `/cerebrum`.** La scène de l'app (sa table de travail zen) en fond plein cadre de la bande, sous un voile `from-canvas/95` en haut qui devient `via-canvas/70` (en deux colonnes dès `lg`, le voile se pose à gauche : `from-canvas/92`, `via-canvas/70`). Le fil d'Ariane, le H1 « Cerebrum » en magenta (`--color-cerebrum`, 4,27:1 sur blanc, grand texte seulement), la définition et les badges sont en colonne, le téléphone (`PhoneStage` : vraie capture, incliné de 5°, icône qui chevauche son coin haut-gauche) à droite dès `lg`. Sur mobile, le téléphone déborde de 6 rem sur la bande suivante (`-mb-24`) ; la bande des jeux compense par un padding haut de 10 rem (`pt-40`). La scène y est aussi l'image LCP : la capture du téléphone charge paresseusement.

Les cartes de jeux se rangent en grille ; la barre est collante, 4 rem de haut, et toute ancre garde une marge de défilement d'au moins 6 rem. Cibles tactiles de 44 px au minimum (liens de la barre et du pied de page compris : `inline-flex min-h-11`).

## Elevation & Depth

Hybride : surfaces à plat, teintées par lavis, et une échelle de trois ombres douces teintées encre (jamais noires pures, jamais décalées). Le repos est discret, l'élévation répond à l'interaction.

### Shadow Vocabulary

- **Repos** (`--shadow-rest`) : cartes, bouton primaire, pastille de numéro.
- **Surélevé** (`--shadow-raised`) : survol du bouton, icône d'app qui chevauche le bas de la scène de son encart (ou le coin du téléphone sur `/cerebrum`).
- **Soulevé** (`--shadow-lift`) : carte de jeu survolée ou focalisée, qui monte de 6 px.
- **Téléphone** (`drop-shadow` 0 28px 36px, encre à 22 %) : le cadre du téléphone.

### Named Rules

**The Tinted Shadow Rule.** Toute ombre est `color-mix` de l'encre. Aucune ombre à décalage franc ni à contour dur.

## Shapes

Formes rondes et généreuses : cartes à 28 px, boutons et pastilles en pilule (9999 px), champs de saisie à 16 px, icônes d'app en rectangle à 22 % de rayon. Le cadre de téléphone est dessiné en CSS (proportions en `cqw`, donc stable à toute taille : lunette, îlot dynamique, boutons latéraux) autour d'une vraie capture, incliné de 5° au repos.

**Les scènes (décor d'ambiance).** Trois images générées servent de décor : la table de l'accueil, et la scène zen de Cerebrum (thé matcha, bonsaï, carnet de grilles, galets, tangram, grue en origami) en deux cadrages, paysage et portrait. Ce sont des décors : jamais présentés comme une capture de l'app, `alt=""`, rien d'informatif dedans (aucun texte, logo, personne ni écran), provenance consignée dans `docs/contrat/provenance-visuels-r8.md`. Le centre de la scène zen est laissé libre pour le téléphone.

Les illustrations du Panda (bébé, ado, adulte, et les trois ensemble sur l'écran de victoire) sont des appoints décoratifs : ce sont les avatars de l'app, qui grandissent de bébé à adulte sur le parcours (`docs/contrat/faits-cerebrum-3.0.0.md`). Un fait produit, pas une cible enfant ; provenance dans `docs/contrat/provenance-visuels-r8.md`.

## Motion

Court et discret : 150 à 250 ms en ease-out, un seul fondu d'entrée par section (transform seule), tout figé sous `prefers-reduced-motion`. Une seule exception assumée :

**The Blob Exception Rule.** Les taches de couleur floues de « Construit par des passionnés » (`.blob-1` à `.blob-4` pour la forme, `.animate-blob-drift-1` à `-3` pour la dérive) jouent **deux cycles puis se figent**, sans saut : le premier et le dernier cran de chaque `@keyframes` valent la pose de départ, et l'animation n'a pas de `fill-mode`, donc la tache retombe sur sa pose initiale. Sous `prefers-reduced-motion` elles ne bougent pas du tout. Décor pur, sous le contenu (`-z-10`), jamais une information. Jamais une dérive infinie.

## Components

### Buttons

Le seul bouton du site, `Button`, une pilule, quatre variantes, deux tailles, jamais une cinquième.

- **Shape:** pilule (9999 px), Figtree 700, hauteur minimale 44 px (`md`, 24 px de padding, 14 px) ou 56 px (`lg`, 32 px, 16 px).
- **Primary:** vert sur encre (aussi le bouton d'envoi du formulaire de contact), ombre de repos ; au survol le vert fonce de 8 % d'encre et l'ombre monte.
- **Secondary:** encre sur lavis violet, renforcé de 22 % de violet au survol.
- **Outline:** contour encre de 2 px, se remplit d'encre au survol.
- **Inverse:** blanc avec texte violet profond, sur la section profonde uniquement.
- **Press / Focus:** `scale(0.97)` à l'appui, transitions de 150 ms ; anneau de focus de 3 px décalé de 3 px, violet (blanc sur la section profonde).

### Cards / Containers

- **Carte de jeu (`GameCard`)** : au style de l'app, format affiche 5:7, lavis du jeu en dégradé (`.game-gradient` : éclairci en haut à gauche, plein en bas, là où est le texte), liseré clair de 2 px, semis de paillettes (`Sparkles`) autour de l'icône kawaii (78 % de la largeur), nom en Fredoka, genre, plateformes. Un lien étiré sur le nom (un seul arrêt de tabulation). Survol et focus : montée de 6 px, ombre « soulevé », voile blanc de 35 %. Sans lien (jeu non publié) : même carte, sans effet.
- **Encart d'app (`AppShowcase`)** : une fiche de catalogue, pleine largeur, dans la section « Nos apps ». En haut, la scène de l'app (`SceneBackground`, 4:5 sur mobile, 3:2 dès `sm`, 2:1 dès `lg`, 28 px de rayon) avec le téléphone au centre ; l'écran du téléphone est en HTML (`PhoneFrame` en mode écran HTML) : les cartes des jeux sur deux colonnes, au style de l'app, la liste continuant sous le bord comme dans l'app. Cet écran est décoratif : `aria-hidden`, aucun lien. L'icône de l'app est à cheval sur le bas de la scène. Dessous, centrés : le nom de l'app en magenta Cerebrum (H3, souligné, c'est le lien étiré vers la page de l'app, un seul arrêt de tabulation, avec « , Voir plus » en `sr-only`), le genre, la description suivie d'un « Voir plus » visible, la **ligne de liens vers les jeux publiés** (vrais liens texte, nommés par `gamesLabel`, séparés par « · », 44 px de haut ; un jeu non publié n'y est pas), puis les badges des boutiques et leur lien posés au-dessus du lien étiré. L'anneau de focus de l'article est limité au H3 (`has-[h3_a:focus-visible]`). Entre 640 et 1023 px le téléphone fait 34 % de la scène. Le téléphone monte de 6 px au survol de l'encart. Aux largeurs étroites la ligne de liens se coupe sur deux lignes avec un « · » en fin de ligne : comportement accepté. Une app de plus, un encart de plus.
- **Liste à icônes (`IconList`)** : une `<ul>` dont chaque point porte une icône (lucide, décorative) dans une tuile arrondie de 44 px au dégradé pastel d'un jeu (les lavis tournent, ou un couple imposé), comme les cartes de l'app ; sur la bande violet profond (`surface="dark"`), une tuile translucide et l'icône en pastel. Une icône par point, dans l'ordre : le rendu (donc le build) lève une erreur si `icons` et `items` n'ont pas la même longueur. Remplace l'ancienne liste à coches.
- **Paillettes (`Sparkles`)** : le semis d'étoiles à quatre branches et de croix arrondies d'une carte (trois semis qui tournent), teinte ton profond du jeu à 35 % ou reflet blanc. Décoratif, `aria-hidden`, dimensionné en `cqw` : la carte porte `@container`.
- **Téléphone (`PhoneFrame`)** : cadre dessiné en CSS (proportions en `cqw`). Deux modes : une vraie capture (`src` + `alt`, avec `priority` et `sizes` réservés à ce mode) ou un écran HTML (`children`, qui sert de conteneur de `cqw`, `priority` et `sizes` interdits au type). `PhoneStage` y ajoute l'inclinaison de repos, le suivi du pointeur et l'icône à cheval ; sa prop `priority` (faux par défaut) n'est vraie que si la capture est l'image LCP.
- **Image de scène (`SceneBackground`)** : un seul `<picture>` à deux `<source media>` (paysage, portrait), donc une seule image téléchargée selon la largeur, décorative, qui couvre son parent positionné. `priority` la sert en `loading="eager"` et `fetchpriority="high"`. **Aucun préchargement posé à la main** : un `ReactDOM.preload` appelé depuis un composant serveur part dans le flux RSC (indice `:HL`) et ferait précharger l'image à chaque navigation vers une autre page ; l'`<img>` eager, découverte dans le HTML servi, suffit.
- **Bande (`SectionBand`)** : fond (`canvas`, `soft`, `violet-deep`, lavis de jeu), rythme, gouttières, H2. `backdrop` accueille un décor posé à même la bande, sous le contenu (`-z-10`), hors du conteneur animé : l'entrée du contenu est une `transform`, qui deviendrait la référence du décor et le couperait à ses bords. C'est ce qui porte les taches de couleur.
- **Tableaux** : `DifficultyTable` (vrai `<table>` avec `<caption>`, deux colonnes, en-tête `canvas-soft`, filets) et `FactTable` (liste de définitions, libellé à gauche dès `sm`) ; chiffres tabulaires.
- **Étapes (`StepList`)** : vraie `<ol>`, numéro décoratif en pastille blanche, texte à 18 px.

### Inputs / Fields

Champ à bordure de 2 px en `text-tertiary` (4,8:1 sur blanc, donc 3:1 minimum contre le fond), fond blanc, 16 px de rayon, libellé flottant (`.input-field` / `.input-label`). Jetons seulement : ni verre dépoli, ni rgba, ni `transition: all` (transitions ciblées de 150 à 200 ms).

- **Focus:** bordure violette (`brand-violet`) plus l'anneau violet global de 3 px décalé de 3 px ; le libellé flotte et passe en violet. Jamais le vert (2,1:1 sur blanc).
- **Erreur:** bordure et libellé en `error`, après une interaction seulement (`:user-invalid`). L'avis d'erreur du formulaire est en `error` sur teinte légère ; l'avis de succès en `brand-green-ink` sur `wash-green` ; les deux passent l'AA.
- **Select:** apparence native retirée, flèche en triangle dessiné par deux dégradés d'encre.
- **Désactivé:** fond `canvas-soft`, filet `border`, texte `text-tertiary`.

### Navigation

Barre collante blanche à 90 % avec flou, filet bas, logo et wordmark Fredoka à gauche ; liens pilule Figtree 700 gris texte (survol : `canvas-soft`) dès `md`, hauts de 44 px (`inline-flex min-h-11`), le premier mène à « Nos apps » (`#apps`) ; sélecteur FR/EN en pastille ; menu mobile en `<details>` avec entrée de 200 ms (`shell-pop`, fondu seul en mouvement réduit).

### Badges des stores

Badges officiels App Store (SVG) et Google Play (PNG), 44 px de haut, rayon 8 px, `scale(0.97)` à l'appui. L'étiquette accessible localisée contient le texte visible du badge puis le nom de l'app (« Download on the App Store: Cerebrum »), pour respecter WCAG 2.5.3 (l'étiquette dans le nom). Dans l'encart de l'accueil, ils sont posés au-dessus du lien étiré (`z-10`).

## Do's and Don'ts

### Do:

- **Do** garder tout texte sur vert en encre (`#1a1a2e`), et le vert en texte clair via `brand-green-ink`.
- **Do** colorer un jeu par son couple `--game-*-wash` / `--game-*-deep` via `gameColorVars`.
- **Do** n'utiliser que `Button` pour une action, avec une de ses quatre variantes, formulaires compris.
- **Do** signaler une erreur de champ par `error` (bordure et libellé), après interaction seulement.
- **Do** servir une scène d'ambiance par `SceneBackground` (un `<picture>`, `alt=""`), en `priority` seulement si c'est l'image LCP de la page, et ne poser aucune image prioritaire de plus sans mesure.
- **Do** écrire « Cerebrum » en magenta uniquement à 24 px et plus, « Synapgeek » en violet profond uni.
- **Do** laisser les taches de couleur jouer deux cycles puis se figer.
- **Do** faire monter une section de 16 px au plus, par la transform seule, jamais par l'opacité (un texte à opacité 0 échoue le contraste).
- **Do** garder des cibles de 44 px, un anneau de focus visible, un seul H1 par page.

### Don't:

- **Don't** ouvrir une page sur un slogan vague posé sur un dégradé : la phrase de définition et la vraie app d'abord.
- **Don't** écrire un hex hors de `globals.css`, ni une couleur de jeu en dur.
- **Don't** poser plus d'une section violet profond par page.
- **Don't** ajouter parallaxe, carrousel automatique ou une animation qui joue sur l'opacité d'un texte lu.
- **Don't** précharger une image à la main depuis un composant partagé (`ReactDOM.preload` voyage dans le payload RSC et fuit vers les autres pages) ; ni remettre le ciel Breeze, retiré.
- **Don't** écrire le magenta Cerebrum en corps de texte (3:1 seulement), ni « Synapgeek » en dégradé multicolore.
- **Don't** présenter un décor généré comme une capture de l'app, ni y mettre un fait, un texte ou un logo.
- **Don't** faire dériver les taches de couleur sans fin.
- **Don't** viser l'enfant ou la famille (mots, images) ; les personnages restent des appoints.
- **Don't** assombrir un lavis de jeu au survol : on éclaircit.
