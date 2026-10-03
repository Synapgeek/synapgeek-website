# src/components : composants, design, accessibilité

Règles qui valent ici. Direction visuelle : `DESIGN.md` ; règles racine : `CLAUDE.md` ; copie :
`docs/contrat/contenu.md`.

1. **Serveur par défaut.** `"use client"` au plus bas. `LegalPage` et tout ce qu'elle importe,
   transitivement, restent sans `"use client"` : le texte légal est dans le HTML servi.
2. **Jetons, jamais de hex.** La couleur vit dans `src/app/globals.css` ; un test échoue sur tout
   hex dans un `.tsx` de `components/` ou `app/`. Les couleurs d'un jeu s'obtiennent par
   `gameColorVars` (noms de propriétés CSS).
3. **Un seul bouton** : `Button` (primary, secondary, outline, inverse), jamais un cinquième.
   Le bouton d'envoi de `ContactForm` est ce `Button` (primary, `lg`, pleine largeur). Les
   primitives sont dans `ui/` ; en explorer une de shadcn par `view`
   puis la réécrire.
4. **Aucun texte en dur**, `aria-label` et `alt` compris : tout vient du Dictionnaire ou d'un module
   de copie, passé en props. Aucun ternaire `locale === "fr"`.
5. **Liens** : `InternalLink` (unique importeur de `next/link`) et `pagePath()`. Jamais d'URL
   interne écrite à la main, jamais un lien vers `/cerebrum/play`.
6. **Images** : `next/image` obligatoire, `alt` sur toute image qui porte du sens ; un fichier
   remplacé change de nom (cache de 7 jours sur `/images/*`).
7. **Mouvement en CSS natif**, aucune bibliothèque d'animation ; `prefers-reduced-motion` respecté ;
   l'entrée des bandes (`band-enter`) monte de 16 px sans jamais jouer sur l'opacité (un texte à
   opacité 0 échoue axe et Lighthouse). Exception assumée : les taches de couleur de « Construit
   par des passionnés » (`.animate-blob-drift-*`) jouent 2 cycles puis se figent, sans saut (la pose
   finale est celle de départ), et ne bougent pas en mouvement réduit. **LCP** : l'image LCP d'une
   page est sa scène (`SceneBackground` avec `priority` : `<img>` en eager et `fetchpriority="high"`
   dans le HTML servi), sur l'accueil comme sur `/cerebrum` ; **aucune image prioritaire de plus
   sans mesure** (`PhoneStage` a une prop `priority`, fausse par défaut, vraie seulement si la
   capture est le LCP). **Aucun préchargement manuel** (`ReactDOM.preload`, `<link rel="preload">`)
   dans un composant partagé : appelé depuis un composant serveur, il part dans le flux RSC
   (indice `:HL`) et fait précharger l'image à chaque navigation vers une autre page, jusque sur
   celles qui ne la montrent pas. Contrôle de non-régression, serveur lancé :
   `curl -H 'RSC: 1' 'http://localhost:3000/fr?_rsc=x' | grep -c imageSrcSet` doit rendre 0
   (rendait 2 avec le préchargement).
8. **WCAG 2.1 AA** : encre sur vert pour toute nouvelle surface, anneau de focus visible, cibles de
   44 px (les liens du header desktop et du footer sont en `inline-flex min-h-11`), lien d'évitement
   vers `#main-content`, sections ancrées de `LegalPage` en `tabIndex={-1}`, un seul H1 par page.
   **Contraste** : le magenta `--color-cerebrum` n'atteint 3:1 que pour le grand texte (H1 de
   `/cerebrum`, H3 de l'encart de l'accueil, 24 px et plus), sur `canvas` et `canvas-soft`, jamais
   en corps de texte (`design-tokens.test.ts`). **Nom accessible** : il contient le texte visible
   (WCAG 2.5.3) ; les badges des boutiques lisent `common.stores` (« Download on the App Store:
   Cerebrum »), le lien étiré d'un encart porte le nom de l'app puis « , Voir plus » en `sr-only`.
9. **Consentement** : tout tag ou cookie Google passe par `components/consent/` et
   `src/lib/consent/` ; les événements par `trackEvent` de `src/lib/gtag.ts`, jamais un appel
   `gtag` ailleurs. Les signaux publicitaires restent `denied` ; Accepter et Refuser au même niveau.
10. **Un composant client n'importe pas le registre des jeux** (il entrerait dans le bundle) : la
    table de langues et les chemins arrivent par props, construits côté serveur.
11. **Sélecteur de langue** : de vrais `<a href hreflang lang>` dans le HTML initial, et le lien
    permanent du pied de page ne se retire pas.
12. **Public adulte** : aucun mot ni image qui vise l'enfant ou la famille ; les personnages sont
    des illustrations d'appoint, jamais des narrateurs.
13. **Jamais la couche visible d'un autre site du portefeuille** (design, copie, structure), ni un
    lien vers lui.
14. **Pied de page sans `mailto`** ; l'e-mail de contact se publie par `ContactBand` et
    `PublisherIdentity`.
15. **Vérifier** : `npm test` (marquage des primitives, contrastes, hex) et `npm run build`.

## Primitives de `ui/`

Inventaire (un docstring dans chaque fichier ; le marquage est verrouillé par `ui/*-markup.test.ts`) :

- **Actions et liens** : `Button` (quatre variantes), `InternalLink` (seul importeur de
  `next/link`), `StoreBadges` (badges officiels, 44 px, `app_store_click`).
- **Bandes et listes** : `SectionBand` (tons `canvas`, `soft`, `violet-deep`, `game-wash` ; prop
  `backdrop` pour un décor posé à même la bande, sous le contenu), `IconList` (icône par point dans
  une tuile au dégradé pastel ; lève une erreur au rendu, donc au build, si `icons` et `items`
  n'ont pas la même longueur), `ProseList`, `StepList`, `FaqList`, `FactTable`, `DifficultyTable`,
  `DownloadGrid`, `PublisherIdentity`. La liste à coches `CheckList` est supprimée, verrouillée par
  `retired-primitives.test.ts`.
- **Jeux** : `GameCard` (style de l'app : `.game-gradient`, liseré, `Sparkles`), `GameGrid`,
  `Sparkles` (semis décoratif, la carte porte `@container`), `game-colors.ts` (`gameColorVars`).
- **Scènes et téléphone** : `SceneBackground` (un `<picture>` à deux cadrages, aucun
  préchargement manuel), `PhoneFrame` (cadre CSS : capture réelle `src` + `alt`, ou écran HTML
  `children` ; `priority` et `sizes` réservés au mode capture, le mode `children` les interdit au
  type), `PhoneStage` (téléphone incliné + icône à cheval), `TiltOnPointer` (îlot client), `tilt.ts`.
- **Les encarts propres à une page** vivent à côté de leur page (`components/home/`,
  `components/pages/`) : `AppShowcase` (encart d'app de l'accueil : scène, téléphone à écran HTML,
  ligne de liens vers les jeux publiés), `HomeHero`, `BuiltByEnthusiasts`.
