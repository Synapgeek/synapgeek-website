# Product

<!-- impeccable:product-schema 1 -->

<!-- Établi le 2026-10-01 avec Adrien (session « Synapgeek website - Rework »).
     Faits produit : fiche App Store Cerebrum 3.0.0 (cerebrum-design-system/marketing/ASO/3.x.x/asc-metadata.md)
     et faits vérifiés sur le tag v3.0.0 de cerebrum-ios. Aucune donnée visuelle ici : elle vit dans DESIGN.md. -->

## Platform

web

## Users

- **L'adulte qui cherche une app de réflexion (30-60 ans, pause détente).** Il arrive depuis
  Google ou depuis un assistant IA (ChatGPT, Perplexity, Gemini, Copilot, Claude) avec une
  question précise : « appli de sudoku hors ligne », « un jeu de type Star Battle sur iPhone »,
  « une seule app avec mots croisés et mots mêlés, gratuite, sans wifi ». Souvent sur téléphone,
  dans les transports, une file d'attente ou le soir. Il veut comprendre en quelques secondes ce
  que fait l'app, si elle est gratuite, si elle marche sans réseau, puis la télécharger.
- **L'assistant IA, comme lecteur.** Il retient le H1 et la phrase qui suit, les faits en texte,
  les étapes et la FAQ. Il doit pouvoir décrire Cerebrum sans ambiguïté : éditeur Synapgeek, et
  non CerebrumIQ, Cerebrum Speed ou l'anatomie.
- **Le joueur existant.** Il vient depuis l'app : support (`#contact`), politique de
  confidentialité, conditions, suppression de compte.
- **Les vérificateurs.** App Review d'Apple, Google Play (Data Safety, suppression de compte),
  configuration du consentement AdMob : ils ouvrent des URLs légales qui ne doivent jamais casser.
- **La presse et les auteurs de comparatifs** (« meilleures apps de jeux de réflexion ») : ils
  cherchent une fiche d'identité fiable, des visuels et un contact.

L'enfant n'est jamais un public adressé.

## Product Purpose

synapgeek.com est le site du studio Synapgeek et la source officielle sur ses apps mobiles. Il
présente le studio, chaque app (Cerebrum d'abord) et chacun de ses jeux sur sa propre page, pour
que les moteurs de recherche et les assistants IA comprennent et recommandent les apps, et que le
visiteur passe au store.

Succès, par ordre d'importance :

1. Cerebrum est cité et correctement décrit (gratuit avec publicité, Premium sans pub imposée,
   jouable hors ligne, liste des jeux) par les assistants IA sur le panel de prompts mensuel
   (point zéro du 2026-09-25 : cité sur 3 prompts sur 11).
2. Les visiteurs cliquent vers l'App Store et Google Play.
3. Une nouvelle app, y compris une app qui n'est pas un jeu, s'ajoute sans refonte.

## Positioning

- **Cerebrum** est une seule app, jouable entièrement hors ligne, qui réunit des classiques
  (Sudoku, Mots croisés, Mots mêlés) et des casse-tête plus récents (Pandoku, un puzzle de type
  Star Battle ; Démineur ; Pixel Art, des nonogrammes ; Arrow Maze ; Trace ; Labyrinthe ; Cross
  Math, des mots croisés de calcul). Aucun jeu ni aucune difficulté n'est réservé à un achat ; le
  modèle économique est dit en clair. 16 langues d'interface. Les grilles sont générées par les
  outils du studio et vérifiées par des solveurs.
- **Synapgeek** est un studio indépendant français (Synapgeek SAS, Frontenas), éditeur
  identifiable de ses apps : c'est ce qui lève l'homonymie autour du nom « Cerebrum ».

## Operating Context

- Visite majoritairement sur téléphone, arrivée par un lien de recherche ou d'assistant IA ;
  desktop pour la presse et les vérificateurs.
- Deux langues : anglais par défaut (sans préfixe), français sous `/fr`. Les pages légales gardent
  leur schéma historique (français sans préfixe, anglais sous `/en`), parce que l'app installée,
  les fiches stores et la configuration AdMob les ouvrent ainsi. Les 14 autres langues de l'app
  renvoient vers l'anglais pour l'instant.
- Liens entrants figés que le site ne contrôle pas : app installée (`/privacy`, `/terms`,
  `/#contact` et pendants `/en`), fiches App Store et Google Play, formulaire Data Safety
  (`/account-deletion`), QR codes de chevalets de comptoir (`/cerebrum/play`, alias `/play`,
  `/jouer`).

## Capabilities and Constraints

- Next.js 16 App Router, rendu statique (SSG) sauf la redirection store, Tailwind CSS 4, Vercel ;
  i18n maison ; mesure GA4 derrière Consent Mode v2 ; formulaire de contact protégé par reCAPTCHA.
- Le contrat d'URLs de `CLAUDE.md` est intouchable : pages légales, suppression de compte,
  redirection store, fichiers `/.well-known`, ancre `#contact`.
- Aucune vente sur le site ni lien de paiement (Apple 3.1.1) ; aucun prix publié sans
  vérification dans App Store Connect et la Play Console.
- Les faits sur une app viennent uniquement de ses sources vérifiées (fiche store, faits relevés
  dans le code publié, sessions iOS, Android et Design System). Au 2026-10-01 : iOS en 3.0.0
  (10 jeux en français et en anglais, 8 dans les autres langues), Google Play encore en 2.1.5.
- Décisions ouvertes : nom et date de la future app non-jeu (son nom de code ne doit jamais
  apparaître) ; ajout d'autres langues au site.

## Brand Commitments

- **Synapgeek** : le logo cerveau coloré et l'identité actuelle du studio sont conservés
  (décision d'Adrien du 2026-10-01 : « ADN gardé »), enrichis de l'énergie ludique
  d'oakevergames.com, sans jamais en reprendre l'habillage (logo, mascotte, rendus, enchaînement
  de sections, accroche).
- **Cerebrum** : ses actifs sont la référence (charte et palette dans `cerebrum-design-system`,
  icônes des 10 jeux, icône d'app, personnages chibi en 2D aquarelle, tagline « Think. Play.
  Shine. »). L'app ne contient aucun rendu 3D.
- **Ton** : ludique mais adulte. Jamais adressé à l'enfant : ni « enfants », « kids »,
  « famille », « éducatif », ni personnage qui parle au visiteur. Les personnages sont des
  illustrations d'appoint, jamais des narrateurs ; les usages mis en avant sont adultes (pause,
  trajet, attente, hors ligne, série, ligues, niveau Élite).
- **Écriture (règles GEO de l'ASO Cerebrum)** : chaque page commence par une phrase de définition
  (quoi, sur quels appareils, par qui) ; chaque jeu maison est accolé à son genre (Pandoku = type
  Star Battle, Pixel Art = nonogrammes, Trace = tracé d'un seul trait, Arrow Maze = casse-tête de
  flèches, Cross Math = mots croisés de calcul) ; aucun nombre de jeux ni de niveaux ;
  « zéro pub imposée », jamais « sans pub » ; cristaux ≠ gemmes ; jamais Zip, Queens ni Picross ;
  le français est écrit nativement, jamais traduit.
- **Portefeuille** : Word Search Trove et Maze Foundry n'apparaissent jamais (ni lien, ni logo,
  ni ressemblance de design ou de ton).
- **Direction visuelle choisie par Adrien le 2026-10-01** : le standard de la catégorie, la
  landing de studio d'apps (titre et phrase de définition, téléphone avec l'app, badges stores,
  grille de cartes de jeux), exécuté sans ironie ni bizarrerie glissée, au niveau de finition des
  deux références qu'il a nommées : easybrain.com (principe hub + une page par jeu) et
  oakevergames.com (énergie ludique). Construction code d'abord pour cette refonte.

## Evidence on Hand

- Réel : fiche App Store 3.0.0 FR/EN ; faits vérifiés sur le tag v3.0.0 (règles, difficultés,
  aides, textes des tutoriels FR/EN) ; icônes des 10 jeux et icône d'app ; personnages ; captures
  3.0.0 FR/EN iPhone et iPad ; fonds aquarelle sans texte ; panel ChatGPT point zéro.
- Note App Store : 4,7/5 sur 16 notes en France au 2026-10-01, aucune aux États-Unis — trop peu
  pour être affichée.
- Absent, à ne jamais fabriquer : nombre de téléchargements, témoignages ou avis cités, articles
  de presse, distinctions, classements, prix des abonnements.

## Product Principles

1. **Expliquer avant de séduire.** Chaque page dit d'abord ce qu'est la chose, pour qui, et
   comment elle marche.
2. **Un fait vérifiable plutôt qu'un superlatif.** Rien qui ne se constate dans l'app ou sur sa
   fiche.
3. **Une page par question.** Chaque jeu a sa page qui répond à « qu'est-ce que c'est, comment
   ça se joue, où y jouer ».
4. **Ludique, jamais enfantin.**
5. **Aucune URL citée hors du site ne casse.**

## Accessibility & Inclusion

- WCAG 2.1 AA ; `prefers-reduced-motion` respecté ; pages légales lisibles sans JavaScript.
- Public adulte de 30 à 60 ans : lisibilité standard, sans axe senior particulier.
