# Provenance des visuels du monde Cerebrum (ruling R8, 2026-10-02)

Sources en lecture seule dans le dépôt `cerebrum-design-system` (jamais modifié). Les fichiers
du site portent un nom nouveau (`/images/*` est mis en cache 7 jours).

| Fichier du site | Source | Traitement |
| --- | --- | --- |
| `public/images/characters/panda-adult-v1.webp` | `characters/panda/character-panda-adult-fullsize.png` | rogné au contenu, 480 px de large, webp avec alpha |
| `public/images/characters/panda-teen-v1.webp` | `characters/panda/character-panda-teen-fullsize.png` | rogné au contenu, 320 px de large, webp avec alpha |
| `public/images/characters/panda-baby-v1.webp` | `characters/panda/character-panda-baby-fullsize.png` | rogné au contenu, 320 px de large, webp avec alpha |
| `public/images/characters/panda-celebration-v1.webp` | `characters/panda/victory/panda-celebration-fullsize.png` (1536×1024, les trois Pandas de l'écran de victoire ; ajout du 2026-10-03, demande d'Adrien) | rogné au contenu, 960 px de large, webp q74 avec alpha (241 Ko) |

Le ciel Breeze (`breeze-day-v1.webp`, thème Breeze de l'app) a été retiré avec son asset : jamais servi en production, la scène photo l'a remplacé. Ses mesures LCP n'ont plus d'objet.

Fait vérifié : le Panda est l'avatar offert et les avatars « grandissent de bébé à adulte sur le
parcours » (`docs/contrat/faits-cerebrum-3.0.0.md`, systèmes communs).

## Scène de Cerebrum : encart « Nos apps » et héros de /cerebrum (2026-10-03, demande d'Adrien)

Images générées, non issues du design system : Nano Banana Pro (`gemini-3-pro-image`, 2K) par
l'outil nbpro. Une table de travail vue de dessus, « zen, studieuse, qui inspire l'intelligence »
(thé matcha, bonsaï, carnet de grilles au crayon, crayon, galets, tangram en bois à tranches
lavande, grue en origami, eucalyptus, lunettes), le centre laissé vide pour le téléphone dessiné en
CSS. Consignes : aucun texte, logo, personne, main ni écran.

| Fichier du site | Génération | Traitement |
| --- | --- | --- |
| `public/images/apps/cerebrum-scene-wide-v1.webp` | 16:9 (2752×1536), puis une retouche du même modèle qui rend le bois continu (deux joints retirés au centre) | 2304 px de large, webp q78 (179 Ko) |
| `public/images/apps/cerebrum-scene-narrow-v1.webp` | 4:5 (1856×2304), recomposition portrait de la scène paysage donnée en référence : objets sur les bords gauche et droit | 1200 px de large, webp q78 (97 Ko) |

## Autres visuels du site

| Fichier du site | Source | Traitement |
| --- | --- | --- |
| `public/images/hero/hero-bg-desktop.webp`, `hero-bg-mobile.webp` | décor d'ambiance de l'accueil (table : croissant, jus d'orange, mots croisés, crayon), repris de l'ancien site (ajout du 2026-03-16) ; image générée, jamais présentée comme une capture de l'app | webp, deux cadrages ; la génération d'origine n'est pas consignée |
| `public/images/brand/og-image-v2.jpeg` | recadrage centré de `public/images/brand/og-image.jpeg` (2752×1536) | 1200×630, jpeg (44 Ko) ; image Open Graph du site (`OG_IMAGE`, `getOgImages(locale)` de `src/lib/seo.ts`). `og-image.jpeg` reste dans `public/` pour les cartes déjà partagées, plus référencé par le site |
