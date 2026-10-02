---
name: Synapgeek, hub du studio
description: Un studio indépendant français, ses apps, une page honnête par jeu. Fond blanc, vert d'action, lavis pastel, cartes arrondies.
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
    backgroundColor: "game wash (per game)"
    textColor: "game deep (per game)"
    rounded: "{rounded.card}"
  app-card:
    backgroundColor: "{colors.wash-green}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "32px"
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

La densité est aérée : une section par idée, un seul fondu d'entrée par section, aucune parallaxe, aucun carrousel. La preuve visuelle est toujours réelle (captures de l'app 3.0.0 dans un cadre de téléphone dessiné en CSS, icônes des jeux, aquarelle Breeze de l'app, illustrations du Panda). Le public est adulte : les personnages sont des illustrations d'appoint, jamais des narrateurs.

Écart assumé par rapport au contrat de direction : le corps est en Figtree, non en Nunito (Nunito appartient à un autre site du même propriétaire). Le build fait foi.

**Key Characteristics:**

- Fond blanc, encre `#1a1a2e`, vert Synapgeek pour l'action, texte encre sur vert.
- Une seule section violet profond par page, pour casser le rythme.
- Couple lavis / ton profond propre à chaque jeu sur ses cartes et sa page.
- Cartes de 28 px de rayon, boutons pilule, un seul bouton (`Button`, quatre variantes).
- Ombres teintées encre, une échelle de trois crans, jamais décalées ni dures.
- Mouvement court (150 à 250 ms, ease-out), respect de `prefers-reduced-motion`.

## Colors

Une palette de marque courte (vert, violet), des lavis pastel, et une famille de couples lavis/profond par jeu. Toute couleur vit dans `src/app/globals.css` ; aucun hex ailleurs (test `no-hardcoded-hex`).

### Primary

- **Vert Synapgeek** (`brand-green`) : fond des boutons primaires, toujours avec du texte encre (contraste AA). Jamais en texte sur fond clair.
- **Vert encre** (`brand-green-ink`) : le vert quand il doit être du texte sur fond clair.

### Secondary

- **Violet Synapgeek** (`brand-violet`) : accent, anneau de focus sur fond clair, curseur de saisie.
- **Violet profond** (`brand-violet-deep`) : la section profonde unique (texte blanc dessus) et le texte du bouton inverse.

### Tertiary

- **Lavis vert** (`wash-green`) : fond de la carte d'app.
- **Lavis violet** (`wash-violet`) : bouton secondaire, sélection de texte, survol de la langue.
- **Couples par jeu** (variables `--game-<jeu>-wash` et `--game-<jeu>-deep`, dix jeux) : le lavis est le fond, le ton profond est le texte sur ce lavis, assombri pour tenir 4,5:1 (vérifié par `design-tokens.test.ts`). Ils s'appliquent par `gameColorVars`, jamais en copiant une valeur.

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

**The Wash Pair Rule.** Une couleur de jeu se lit toujours comme un couple : lavis en fond, ton profond en texte. Au survol, le voile éclaircit (35 % de blanc), il n'assombrit jamais, pour ne pas perdre le contraste.

## Typography

**Display Font:** Fredoka (600 et 700 chargés ; repli system-ui)
**Body Font:** Figtree (police variable, repli system-ui)

**Character:** Fredoka, ronde et affirmée, donne la voix du studio dans les titres, les noms de jeux et les chiffres de tableaux ; Figtree, neutre et lisible, porte les phrases. Tous les `h1` à `h6` sont en Fredoka 700 avec `text-wrap: balance` ; les paragraphes en `text-wrap: pretty`.

### Hierarchy

- **Display** (700, `text-6xl` / `sm:text-7xl` / `lg:text-8xl`, interligne 1, -0.03em) : le H1 du héros « Synapgeek », unique par page.
- **Headline** (700, `text-3xl` / `sm:text-4xl` / `lg:text-5xl`, 1.1, -0.02em) : le H2 de chaque `SectionBand`.
- **Title** (Fredoka 700, `text-lg` à `text-3xl`) : nom d'une carte de jeu (`text-lg`, `sm:text-xl`), d'une app (`text-2xl`, `sm:text-3xl`), légendes et libellés de tableaux.
- **Body** (Figtree 400, 16 à 20 px, interligne 1,625) : phrases de définition, introductions, descriptions ; colonne limitée à 65ch.
- **Label** (Figtree 700, 12 à 14 px) : genre et plateformes des cartes, boutons, liens de navigation.

### Named Rules

**The Two Voices Rule.** Fredoka pour ce qu'on nomme (titres, noms, libellés de ligne), Figtree pour ce qu'on lit. Pas de troisième police, pas de capitales espacées.

**The 65ch Rule.** Toute prose est plafonnée à 65 caractères de large.

## Layout

Bandes pleine largeur (`SectionBand`) empilées ; chacune centre un contenu de 72 rem (`max-w-6xl`), ou 48 rem pour la colonne de lecture des pages de jeu. Gouttière latérale fluide (`gutter`), rythme vertical fluide entre bandes (`section`, 64 à 120 px). Les bandes alternent blanc, `canvas-soft`, lavis de jeu et, une fois, violet profond.

Le héros est en une colonne centrée sur mobile (H1, définition, badges, puis téléphone) et en deux colonnes dès `lg` (texte à gauche, téléphone à droite). Sur mobile, le téléphone déborde de 6 rem sur la bande suivante (`-mb-24`) ; la bande des jeux compense par un padding haut de 7 rem. Ordre du hub (accueil corporate, amendement d'Adrien du 2026-10-02) : le héros, « Nos jeux » (un encart pleine largeur par app), « Construit par des passionnés » (la bande violet profond), contact. Le héros de l'accueil (`HomeHero`) est la photo de la table (croissant, jus d'orange, mots croisés, crayon) en pleine largeur, sous un voile de la couleur de la page : sur desktop le texte se pose à droite, sur le bois libre, avec un voile `from-canvas/92` qui s'efface vers la gauche pour laisser voir la photo ; sur mobile le texte est centré en haut, sous un voile qui s'éclaircit vers le bas. Le H1 porte le nom du studio puis son accroche (deux blocs du même titre, l'accroche en 2xl à 4xl), suivis de la phrase de définition et du bouton vers la page de l'app. La photo est l'image LCP : un seul `<picture>` à deux sources selon la largeur, préchargé à la main avec `media`. Ce qui précède sur le héros en colonne s'applique à la page app. Les cartes de jeux se rangent en grille ; la barre est collante, 4 rem de haut, et toute ancre garde une marge de défilement d'au moins 6 rem. Cibles tactiles de 44 px au minimum.

## Elevation & Depth

Hybride : surfaces à plat, teintées par lavis, et une échelle de trois ombres douces teintées encre (jamais noires pures, jamais décalées). Le repos est discret, l'élévation répond à l'interaction.

### Shadow Vocabulary

- **Repos** (`--shadow-rest`) : cartes, bouton primaire, pastille de numéro.
- **Surélevé** (`--shadow-raised`) : survol du bouton, icône d'app qui chevauche le téléphone.
- **Soulevé** (`--shadow-lift`) : carte de jeu survolée ou focalisée, qui monte de 6 px.
- **Téléphone** (`drop-shadow` 0 28px 36px, encre à 22 %) : le cadre du téléphone.

### Named Rules

**The Tinted Shadow Rule.** Toute ombre est `color-mix` de l'encre. Aucune ombre à décalage franc ni à contour dur.

## Shapes

Formes rondes et généreuses : cartes à 28 px, boutons et pastilles en pilule (9999 px), champs de saisie à 16 px, icônes d'app en rectangle à 22 % de rayon. Le cadre de téléphone est dessiné en CSS (proportions en `cqw`, donc stable à toute taille : lunette, îlot dynamique, boutons latéraux) autour d'une vraie capture, incliné de 5° au repos.

**Le ciel aquarelle (signature du héros).** Le fond Breeze de l'app est posé derrière le téléphone en champ fondu : une ellipse (masque radial) dans un pseudo-élément, jamais un rectangle. Contraintes mesurées :

- LCP : `breeze-day-v1.webp` reste à 240 px de large. Plus grand (576 px mesuré), il devient l'élément LCP (3,9 s, performance 88). Le flou voulu vient de l'agrandissement et du masque.
- Safari : un masque ne doit jamais dépasser la boîte de l'élément qui le porte (`mask-clip: no-clip` n'y existe pas) ; aucun masque sur `.breeze-clip`.
- Bord : `.breeze-clip` découpe le ciel au bord bas de la bande du héros, et le masque vertical de `.breeze-field` l'efface avant ce bord (34,1 % de la hauteur du champ, calculé sur les proportions du téléphone ; elles changent, ce chiffre change).

Les illustrations du Panda (bébé, ado, adulte) sont des appoints décoratifs, avec leur provenance consignée dans `docs/contrat/provenance-visuels-r8.md`.

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

- **Carte de jeu (`GameCard`)** : format affiche 5:7, lavis du jeu, icône kawaii à 78 % de la largeur, nom en Fredoka, genre, plateformes. Un lien étiré sur le nom (un seul arrêt de tabulation). Survol et focus : montée de 6 px, ombre « soulevé », voile blanc de 35 %. Sans lien (jeu non publié) : même carte, sans effet.
- **Encart d'app (`AppShowcase`)** : lavis vert, 28 px, pleine largeur ; icône, nom, phrase de présentation, rangée des icônes des jeux (chacune un lien nommé par `aria-label`, jamais de texte visible), badges des boutiques, un bouton primaire ; le téléphone déborde le bas de l'encart, qui le coupe. Une app de plus, un encart de plus.
- **Tableaux** : `DifficultyTable` (vrai `<table>` avec `<caption>`, deux colonnes, en-tête `canvas-soft`, filets) et `FactTable` (liste de définitions, libellé à gauche dès `sm`) ; chiffres tabulaires.
- **Étapes (`StepList`)** : vraie `<ol>`, numéro décoratif en pastille blanche, texte à 18 px.

### Inputs / Fields

Champ à bordure de 2 px en `text-tertiary` (4,8:1 sur blanc, donc 3:1 minimum contre le fond), fond blanc, 16 px de rayon, libellé flottant (`.input-field` / `.input-label`). Jetons seulement : ni verre dépoli, ni rgba, ni `transition: all` (transitions ciblées de 150 à 200 ms).

- **Focus:** bordure violette (`brand-violet`) plus l'anneau violet global de 3 px décalé de 3 px ; le libellé flotte et passe en violet. Jamais le vert (2,1:1 sur blanc).
- **Erreur:** bordure et libellé en `error`, après une interaction seulement (`:user-invalid`). L'avis d'erreur du formulaire est en `error` sur teinte légère ; l'avis de succès en `brand-green-ink` sur `wash-green` ; les deux passent l'AA.
- **Select:** apparence native retirée, flèche en triangle dessiné par deux dégradés d'encre.
- **Désactivé:** fond `canvas-soft`, filet `border`, texte `text-tertiary`.

### Navigation

Barre collante blanche à 90 % avec flou, filet bas, logo et wordmark Fredoka à gauche ; liens pilule Figtree 700 gris texte (survol : `canvas-soft`) dès `md` ; sélecteur FR/EN en pastille ; menu mobile en `<details>` avec entrée de 200 ms (`shell-pop`, fondu seul en mouvement réduit).

### Badges des stores

Badges officiels App Store (SVG) et Google Play (PNG), 44 px de haut, rayon 8 px, `scale(0.97)` à l'appui, étiquette accessible localisée.

## Do's and Don'ts

### Do:

- **Do** garder tout texte sur vert en encre (`#1a1a2e`), et le vert en texte clair via `brand-green-ink`.
- **Do** colorer un jeu par son couple `--game-*-wash` / `--game-*-deep` via `gameColorVars`.
- **Do** n'utiliser que `Button` pour une action, avec une de ses quatre variantes, formulaires compris.
- **Do** signaler une erreur de champ par `error` (bordure et libellé), après interaction seulement.
- **Do** laisser le ciel Breeze à 240 px de large et ses masques dans la boîte de leur élément.
- **Do** faire monter une section de 16 px au plus, par la transform seule, jamais par l'opacité (un texte à opacité 0 échoue le contraste).
- **Do** garder des cibles de 44 px, un anneau de focus visible, un seul H1 par page.

### Don't:

- **Don't** ouvrir une page sur un slogan vague posé sur un dégradé : la phrase de définition et la vraie app d'abord.
- **Don't** écrire un hex hors de `globals.css`, ni une couleur de jeu en dur.
- **Don't** poser plus d'une section violet profond par page.
- **Don't** ajouter parallaxe, carrousel automatique ou une animation qui joue sur l'opacité d'un texte lu.
- **Don't** remplacer le ciel Breeze par un fichier plus grand, ni remettre un masque sur `.breeze-clip`.
- **Don't** viser l'enfant ou la famille (mots, images) ; les personnages restent des appoints.
- **Don't** assombrir un lavis de jeu au survol : on éclaircit.
