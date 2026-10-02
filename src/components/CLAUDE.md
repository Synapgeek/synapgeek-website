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
   opacité 0 échoue axe et Lighthouse). Le ciel Breeze du héros reste à 240 px de large : plus
   grand, il deviendrait l'élément LCP (`docs/contrat/provenance-visuels-r8.md`).
8. **WCAG 2.1 AA** : encre sur vert pour toute nouvelle surface, anneau de focus visible, cibles de
   44 px, lien d'évitement vers `#main-content`, sections ancrées de `LegalPage` en `tabIndex={-1}`,
   un seul H1 par page.
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
