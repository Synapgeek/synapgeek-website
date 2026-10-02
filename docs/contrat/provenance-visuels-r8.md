# Provenance des visuels du monde Cerebrum (ruling R8, 2026-10-02)

Sources en lecture seule dans le dépôt `cerebrum-design-system` (jamais modifié). Les fichiers
du site portent un nom nouveau (`/images/*` est mis en cache 7 jours).

| Fichier du site | Source | Traitement |
| --- | --- | --- |
| `public/images/backgrounds/breeze-day-v1.webp` | `theme/breeze/background/breeze-day-9x16.png` (1536×1982, thème Breeze, jour) | redimensionné à 240 px de large, webp q75 (4 Ko) |
| `public/images/characters/panda-adult-v1.webp` | `characters/panda/character-panda-adult-fullsize.png` | rogné au contenu, 480 px de large, webp avec alpha |
| `public/images/characters/panda-teen-v1.webp` | `characters/panda/character-panda-teen-fullsize.png` | rogné au contenu, 320 px de large, webp avec alpha |
| `public/images/characters/panda-baby-v1.webp` | `characters/panda/character-panda-baby-fullsize.png` | rogné au contenu, 320 px de large, webp avec alpha |

Le fond Breeze est volontairement servi à 240 px de large : Chrome mesure le LCP d'une image sur
sa taille intrinsèque, et un ciel plus grand que la capture du téléphone deviendrait l'élément LCP
(mesuré avec un ciel de 576 px : LCP 3,9 s et performance 88, contre 3,4 s et 91 à 92 avec le
ciel à 240 px). Agrandi par le navigateur
derrière un masque radial, ce ciel reste un champ doux et flou, ce que l'aquarelle accepte.

Fait vérifié : le Panda est l'avatar offert et les avatars « grandissent de bébé à adulte sur le
parcours » (`docs/contrat/faits-cerebrum-3.0.0.md`, systèmes communs).
