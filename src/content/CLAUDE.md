# src/content : registre, copie, dictionnaire

Règles qui valent ici. Détail, règles de copie 1 à 14, gardes et sources de faits :
`docs/contrat/contenu.md`. Les gardes de `content-guards.test.ts` sont la version exécutable.

1. **Un fait vient des sources vérifiées**, dans cet ordre : `docs/contrat/faits-cerebrum-3.0.0.md`
   (iOS), `faits-cerebrum-3.0.0-android.md` (toute affirmation Android), la fiche App Store
   (`cerebrum-design-system/marketing/ASO/3.x.x/asc-metadata.md`). Jamais inventé, jamais un fait iOS
   généralisé à Android. En cas de doute, le dire et demander à la session dédiée (`SendMessage`).
2. **Le français s'écrit nativement**, jamais traduit, avec les espaces insécables devant
   `: ; ? !` et dans « ». **Aucun tiret cadratin (—)** dans un texte visible, dans les deux langues.
3. **Une phrase de définition de 150 à 250 caractères** suit le H1 de chaque page, avec le genre
   générique d'un jeu maison ; `meta.description` de 155 caractères au plus.
4. **Aucun nombre de jeux, de niveaux ni de puzzles**, même en lettres ; les difficultés se
   nomment. **« zéro pub imposée » / « no forced ads »**, jamais « sans pub » / « ad-free ».
5. **Aucun prix, aucune note, aucun nombre de téléchargements.** Cristaux ≠ gemmes. Jamais Zip,
   Queens, Picross. Jamais le classement (masqué en 3.0.0).
6. **Aucun mot qui vise l'enfant ou la famille**, aucun personnage narrateur : public adulte.
7. **Une page jeu ne parle que du jeu** (R4, R5, R7) : le modèle économique et le défi du jour sont
   des lignes de gabarit du Dictionnaire (`gameGet`, `gameDaily`), jamais de la copie du jeu.
8. **Trace Difficile et Élite** : jamais détaillées, jamais de seuils d'étoiles (R6) ; les points
   jumeaux de l'Élite se citent seulement comme exception à l'ordre des points.
9. **Chaque objet de copie porte `updatedAt`** : le mettre à jour quand le texte change. Une
   définition modifiée impose de mettre `public/llms.txt` à jour dans le même commit.
10. **Un module de copie n'est contrôlé qu'inscrit dans `REGISTERED_COPY`** ; un jeu n'est publié
    (`published: true`) qu'avec sa copie en `fr` et en `en`.
11. **Registre** : les slugs viennent de `src/lib/page-slugs.ts`, les couleurs sont des NOMS de
    propriétés CSS (`--game-<id>-wash/-deep`), jamais un hex ; la disponibilité Android se lit dans
    `availability.android`.
12. **Dictionnaire** : `fr.ts`, `en.ts` et `types.ts` évoluent ensemble (TypeScript refuse un écart) ;
    tout texte de composant passe par lui ou par un module de copie.
13. **Textes légaux** (`fr.ts`, `en.ts`) : format de `src/lib/legal-format.ts` seulement ; aucune
    modification de fond sans décision d'Adrien ; ancres `account-deletion` et `website` ;
    une URL suivie d'une virgule ou d'une parenthèse est tronquée.
14. **Identité de l'éditeur** : `publisher.ts` est la source unique (À propos, Presse, JSON-LD),
    cohérente avec `/legal` (`publisher.test.ts`).
15. **Jamais** le nom de code de la future app non-jeu, ni un autre site du portefeuille Synapgeek.
