> Copie du 2026-10-01 de la session App iOS (tag v3.0.0). Source de vérité des pages jeux avec asc-metadata.md.

# Faits Cerebrum pour synapgeek.com — version PUBLIÉE 3.0.0

Établi le 2026-10-01 depuis le tag git `v3.0.0` (build 33), pas depuis la branche de travail. Sources entre parenthèses, chemins relatifs au dépôt `cerebrum-ios` @v3.0.0. Légende : « déduit » = conclu du code sans test en jeu ; « non vérifié » = à ne pas publier.

## 0. À lire d'abord

- **La version publiée est la 3.0.0, pas la 2.1.5.** En vente depuis le 2026-09-28 à 16:51 UTC (API publique iTunes : `version 3.0.0`, `currentVersionReleaseDate 2026-09-28T16:51:18Z`, `minimumOsVersion 17.0`, gratuite, 4+, `iosUniversal`). La 2.1.5 n'est plus la fiche en vente.
- **Cerebrum compte donc 10 jeux, pas 6** : Sudoku, Mots croisés, Mots mêlés, Cross Math, Trace, Labyrinthe (déjà là en 2.1.5) + **Pandoku, Démineur, Arrow Maze, Pixel Art** (nouveaux en 3.0.0). Et **16 langues d'interface**, pas 2.
- Ces faits sont ceux de l'app **iOS**. Rien n'a été vérifié côté Android : ne pas écrire « aussi sur Android » en s'appuyant sur ce document.
- Monnaie in-app : **gemmes / gems** (le code dit « coins », l'interface jamais).
- **Le classement par jeu est masqué en 3.0.0** (`Cerebrum/UI/Components/FooterView.swift:18-21`, « Leaderboard is hidden for now »). Ne pas l'annoncer. Ce qui existe : des **ligues** (Bronze, Silver, Gold, Platinum, Diamond, Master, Legend ; en FR « de Bronze à Légende ») fondées sur le score cumulé, et un trophée mensuel.
- **Le défi du jour n'est pas « par jeu »** : un seul défi par jour pour toute l'app ; le joueur choisit son jeu dans un sélecteur et la grille est la même pour tout le monde (tirée par date + jeu). Difficulté Facile ou Moyen (Facile seulement pour Mots croisés et Mots mêlés) (`GameType.swift:203-210`, `DailyChallengeViewModel.swift:249-275`). Un jour manqué se rattrape dans le calendrier.
- **Tout le contenu est gratuit** : aucun jeu, difficulté ni niveau n'est réservé à un achat (fiche App Store : « Aucun jeu ni aucune difficulté n'est réservé à un achat » ; code : aucun verrou Premium sur la progression, déduit).

## 1. Tableau des 10 jeux

| Jeu (FR / EN) | Difficultés | Niveaux de progression | Mode infini | Erreurs | Tutoriel dans l'app |
|---|---|---|---|---|---|
| Sudoku / Sudoku | 4 : Facile, Moyen, Difficile, **Élite** | 100 par difficulté | 3000 grilles par difficulté | 3 erreurs = perdu | non |
| Mots Croisés / Crossword | 3 (**pas d'Élite**) | 100 par difficulté et par langue | 1000 | 3 cœurs | non |
| Mots Mêlés / Word Search | 3 (**pas d'Élite**) | 100 niveaux de 3 grilles | 1000 niveaux de 3 grilles | aucune (pas de vies) | non |
| Cross Math / Cross Math | 4 dont Élite | 100 niveaux de 3 grilles | 1000 niveaux | 3 vies | non |
| Trace / Trace | 4 dont Élite | 100 niveaux de 3 grilles | 1000 niveaux | aucune | oui, 5 pages |
| Labyrinthe / Maze | 4 dont Élite | 100 | 3000 | aucune | oui, 5 pages |
| Pandoku / Pandoku | 4 dont Élite | 100 | 1000 | 3 cœurs | oui, 3 pages + niveau 1 guidé |
| Démineur / Minesweeper | 4 dont Élite | 100 | 1000 | 3 cœurs | oui, 4 pages + niveau 1 guidé |
| Arrow Maze / Arrow Maze | 3 (**pas d'Élite**) | 100 | 1000 | 3 cœurs (4 en Difficile) | oui, 5 pages |
| Pixel Art / Pixel Art | 4 dont Élite | 100 | 1000 | 3 vies | oui, 4 pages |

Noms : même libellé en FR et EN sauf Mots Croisés/Crossword, Mots Mêlés/Word Search, Labyrinthe/Maze, Démineur/Minesweeper (`Cerebrum/Resources/{fr,en}.lproj/Localizable.strings` clés `games.<jeu>.title`). Dans les 14 autres langues Démineur est traduit (Buscaminas, 扫雷…), Pandoku, Arrow Maze et Pixel Art restent tels quels. Ne jamais écrire « Zip » (nom interne de Trace). Ne jamais appeler Pandoku « Queens ».

**Déblocage des difficultés** (`UnlockConfiguration.swift:50-88`) : Facile et Moyen ouverts d'emblée ; Difficile après **2 niveaux Moyen terminés** ; Élite après **4 niveaux Difficile terminés**. Exception : Mots croisés, Mots mêlés et Arrow Maze (3 difficultés), où Difficile s'ouvre après **5 niveaux Moyen**. À l'intérieur d'une difficulté, les niveaux s'ouvrent un par un. Le **mode infini** s'ouvre en terminant le niveau 100 de la difficulté ; il repart du début quand le corpus est épuisé (`GameProgress.swift:214-222`).

**Étoiles** : sur Sudoku, Mots croisés, Cross Math, Pandoku, Démineur, Arrow Maze, Pixel Art : 0 erreur = 3★, 1 erreur = 2★, 2 ou plus = 1★ (`VictoryData.swift:207-216`), les indices ne comptent pas. Sur Trace, Labyrinthe et Mots mêlés : étoiles au temps (voir plus bas ; **ne pas publier de seuil pour Trace**).

**Aides communes** : indice payant **50 / 75 / 100 / 150 gemmes** (Facile → Élite) ou gratuit via une pub récompensée (illimité), ou **5 indices offerts par jour et par jeu avec Premium** (`GameDifficulty.swift:119-130`, `PremiumHintQuotaTracker.swift:53`). Après une défaite, « continuer » une fois via une pub puis une fois en gemmes (50/75/100/150) (`BaseGameViewModel.swift:1042-1082`). Un joueur gratuit peut aussi, une fois par partie, annuler une erreur contre une pub ; avec Premium la 1re erreur de chaque partie est annulée d'office.

## 2. Détails par jeu

### Sudoku
- Grille 9×9 classique, pas de variante (`docs/SUDOKU.md:5,100`). On touche une case puis un chiffre du pavé 1-9 ; une touche se grise quand ses 9 occurrences correctes sont posées.
- Chaque chiffre est vérifié tout de suite : un chiffre faux = une erreur ; 3 erreurs = partie terminée. Victoire = grille entièrement correcte.
- Cases données (mesuré sur le JSON) : Facile 40-45, Moyen 34-38, Difficile 28-33, Élite 24-28.
- Barre d'actions : Annuler, Effacer, Notes (crayon, retirées automatiquement des cases liées), Indice. Surbrillance des doublons. Chrono et pause.
- Indice : révèle une case avec une explication pas à pas de la technique. « Remplir les notes » : 150/250/350/500 gemmes ou 1 pub par jour.
- Score : (1000 + bonus < 5 min − 100 par erreur − 50 par indice) × 1 / 1,5 / 2 / 3 selon la difficulté.
- Pas de pack thématique. Aucun tutoriel dans l'app, donc **aucun texte de règles officiel à citer**.

### Mots Croisés / Crossword
- Grilles libres, non carrées, définitions horizontales et verticales (`docs/CROSSWORD.md:31`). Tailles mesurées : Facile/Moyen 9-12 × 10-12 (14-20 mots) ; Difficile 6-12 × 10-12 (9-15 mots).
- Clavier intégré : AZERTY en FR, QWERTY en EN. Toucher la même case change le sens. Un mot est vérifié dès sa dernière lettre (sans tenir compte des accents) : juste = verrouillé ; faux = rouge, un cœur perdu, lettres effacées. 3 cœurs ; Premium = vies infinies.
- Indices : **Indice texte** (définition plus facile ; 25/40/60 gemmes ou pub ; absent en Facile), **Révéler une lettre** (50/75/100 gemmes ou pub), **Révéler le mot** (100/175/250 gemmes, pas de pub). Les 5 indices Premium du jour servent au texte ou au mot.
- Étoiles : 0/1/2+ erreurs = 3/2/1★. Pas de bouton Annuler (déduit).
- **Langues du contenu : français et anglais uniquement**, selon la langue de l'app.
- **Packs thématiques Cinéma / Cuisine / Voyage** (EN : Movies / Cooking / Travel) : 100 grilles par jeu et par langue, **achat intégré uniquement** (ni inclus dans Premium, ni achetables en gemmes). Un même pack ouvre Mots croisés ET Mots mêlés. Les grilles de thème sont de difficulté Difficile.
- Défi du jour : Facile seulement.

### Mots Mêlés / Word Search
- On glisse en ligne droite de la 1re à la dernière lettre ; le sens compte (une sélection à rebours ne valide pas) (`WordSearchGameState.swift:305-318`).
- **Chaque niveau = 3 grilles imposées, jouées à la suite** (compteur 1/3), pas de tirage au sort.
- Tailles (JSON) : Facile 7×7 à 9×9, 5-8 mots de 4-7 lettres ; Moyen 9×9 à 11×11, 7-11 mots ; Difficile 11×11 à 12×12, 8-15 mots de 3-9 lettres. Directions : horizontal, vertical, 4 diagonales ; Difficile ajoute les mots à l'envers.
- Liste de mots : visible en Facile, floutée avec le nombre de lettres en Moyen, cachée en Difficile.
- Pas d'erreurs, pas de vies, pas de défaite. Indices : Facile « Révéler le mot » 75 gemmes ; Moyen/Difficile « Révéler la position » 75/100 et « Montrer un mot » 30/50.
- Étoiles au temps moyen par grille (valeurs 3.0.0, inchangées en 3.1.0) : 3★ si ≤ 45 s / 120 s / 210 s, 2★ si ≤ 90 s / 210 s / 360 s (Facile/Moyen/Difficile).
- Mêmes langues, mêmes packs thématiques, même règle d'achat que Mots croisés (grilles de pack : 9-11, sans mots à l'envers). Défi du jour : Facile seulement.

### Cross Math
- Mots croisés de calcul : chaque « mot » est une équation horizontale ou verticale, à compléter avec les nombres de la **réserve** (qui contient exactement les nombres manquants, sans leurre). On touche une case puis un nombre, ou on le glisse (`docs/CROSSMATH.md:16-33`).
- **La priorité des opérations est respectée** (× et ÷ avant + et −) ; nombres entiers ; nombres à placer de 1 à 30, nombres donnés et résultats jusqu'à 100 (mesuré sur 300 grilles).

| Difficulté | Grille | Opérations | Nombres à placer |
|---|---|---|---|
| Facile | 5×5 | + − | 4 |
| Moyen | surtout 7×7 (aussi 9×7, 7×9) | + − × | 6 à 9 |
| Difficile | surtout 9×9 | + − × ÷ | 10 à 15 |
| Élite | surtout 9×9 | + − × ÷ | 10 à 14 |

- Un niveau = 3 grilles à finir à la suite ; rien n'est crédité avant la 3e ; chrono et erreurs courent sur les 3.
- 3 vies ; erreur signalée aussitôt, s'efface seule après 5 s et le nombre revient dans la réserve ; un nombre juste est verrouillé. Indice : remplit une case avec le bon nombre. Pas d'Annuler général. Premium = vies infinies.
- Aucun tutoriel dans l'app.

### Trace (`zip`)
- **Un seul trait continu qui passe une fois par toutes les cases**, en haut/bas/gauche/droite ; les **points numérotés se franchissent dans l'ordre** ; les murs bloquent ; une seule solution par grille (`docs/ZIP.md:47-76`). Glisser le doigt, toucher une case du tracé pour le couper, repasser sur ses pas, ou flèches (D-pad). Un coup interdit est refusé sans erreur.
- Grilles 3.0.0 : Facile 5×5 (surtout) ou 6×6, sans mur ; Moyen 6×6/7×7, 0 à 6 murs ; Difficile 7×7, 2 à 8 murs ; Élite 7×7, 4 à 7 murs, avec des points « jumeaux ». **Ces grilles Difficile/Élite sont refaites en 3.1.0 : ne pas les décrire en détail.**
- 3 grilles par niveau, chrono continu. Pas de vies, pas de défaite. Indice : revient au dernier bon point si le tracé est sur une mauvaise voie, sinon trace les 3 cases suivantes. Niveau 1 Facile : tracé fantôme de départ.
- **Seuils d'étoiles : NE PAS PUBLIER** (3.0.0 : 15/30, 25/50, 32/65, 80/160 s ; la 3.1.0 passe Difficile à 50/100 et Élite à 100/200).
- Tutoriel (FR / EN, `Localizable.strings` fr:986-998, en:985-997) :
  1. « Trace UN chemin continu » / « Commence en touchant le 1, puis glisse ton doigt pour relier toutes les cases en une seule ligne. » — « Trace ONE continuous path » / « Start by tapping 1, then drag your finger to connect every cell in a single unbroken line. »
  2. « Passe les checkpoints dans l'ordre » / « Les checkpoints numérotés doivent être franchis 1, 2, 3… dans cet ordre exact. » — « Hit the checkpoints in order » / « Numbered checkpoints must be crossed 1, 2, 3… in that exact order. »
  3. « Les murs bloquent le passage » / « Ton tracé ne peut pas traverser les murs et doit couvrir absolument toutes les cases. » — « Walls block the way » / « Your path can't cross a wall — and it must cover every single cell. »
  4. « Corrige-toi à tout moment » / « Reviens en arrière en repassant sur tes pas, tape une case de ton tracé pour la couper, ou utilise les flèches. » — « Fix a mistake anytime » / « Backtrack over your steps, tap a cell on your path to cut it there, or use the D-pad. »
  5. « Points de passage jumeaux (Élite) » / « Certains points partagent un badge fusionné comme 3•4 : passe-les dans l'ordre que tu veux. Un seul ordre mène au bout. Dans une impasse ? Reviens en arrière et tente l'autre. » — « Twin checkpoints (Elite) » / « Some checkpoints share a fused badge like 3•4 — cross them in either order. Only one order leads to the end: hit a dead end? Backtrack and try the other. »

### Labyrinthe / Maze
- On guide une **luciole** jusqu'au portail de sortie, case par case, sans diagonale. Flèches ou glissement sur le labyrinthe. Les murs bloquent sans pénalité. Objets facultatifs : **cristaux** (nécessaires à la 2e étoile), **bulle** (en impasse, ramène automatiquement vers le prochain cristal ou la sortie), **fusée** (avance toute seule dans le couloir). Rien à éviter : pas d'ennemis ni de pièges (déduit). 60 % des labyrinthes ont une forme (cœur, étoile, anneau…). 1 labyrinthe par niveau. Pas de vies.
- Tailles (JSON) : Facile 8×8 à 18×18 ; Moyen 11×11 à 23×23 ; Difficile 14×14 à 30×30 ; Élite jusqu'à 36×36, **avec brouillard** (rayon de vision 3 cases aux niveaux 1-50, 2 ensuite). Bouton « vue d'ensemble » : illimité hors brouillard, 3 utilisations en Élite.
- Étoiles : 1★ en finissant, +1★ avec tous les cristaux, +1★ sous le temps cible. Indice : allume ~4 s les 6 prochaines cases du plus court chemin. Le défi du jour n'est jamais en Élite (donc jamais de brouillard).
- Tutoriel (fr:1028-1041, en:1027-1040) :
  1. « Guide ta luciole vers la sortie » / « Utilise les flèches ou glisse ton doigt sur le labyrinthe pour avancer pas à pas. Un mur te bloque ? Essaie simplement une autre direction. » — « Guide your firefly to the exit » / « Use the D-pad or swipe on the maze to move one step at a time. Walls block the way — just bump and try another direction. »
  2. « Cristaux + rapidité = étoiles » / « Ramasse tous les cristaux et termine dans le temps imparti pour obtenir les 3 étoiles. » — « Crystals + speed = stars » / « Collect every crystal and finish within the time window to earn all 3 stars. »
  3. « Les boosters » / « Dans une impasse, la bulle éclate automatiquement et ramène ta luciole vers le prochain cristal, ou vers la sortie si tu les as tous ramassés. La fusée la fait avancer toute seule dans le couloir. » — « Boosters » / « In a dead end, the bubble pops automatically and carries your firefly back toward the next crystal — or the exit once you've got them all. Rockets send your firefly auto-walking down the corridor. »
  4. « Brouillard élite & vue d'ensemble » / « En élite, le labyrinthe est plongé dans le brouillard : tu ne vois que ce qui t'entoure. Utilise le bouton vue d'ensemble pour voir tout le labyrinthe (3 utilisations). » — « Elite fog & overview » / « Elite mazes are shrouded in fog — only your surroundings are revealed. Use the overview button to peek at the whole maze (3 uses). »
  5. « Prêt à explorer ? » / « Trouve la sortie, ramasse les cristaux, et attention aux murs. C'est parti ! » — « Ready to explore? » / « Find the exit, grab the crystals, and watch out for walls. Let's go! »

### Pandoku (nouveau en 3.0.0 ; puzzle de type Star Battle)
- Grille N×N découpée en N régions colorées. **Un panda par ligne, par colonne et par région ; deux pandas ne se touchent jamais, même en diagonale** (`docs/PANDOKU.md:78-90`). Tailles : Facile 4×4 → 8×8 par paliers (4×4 niveaux 1-5, 5×5 niveaux 6-15, 6×6 niveaux 16-35, 7×7 niveaux 36-60, 8×8 niveaux 61-100) ; Moyen 8×8 ; Difficile 9×9 puis 10×10 (dès le niveau 51) ; Élite 10×10.
- Gestes : un tap pose une croix, **deux taps rapides posent un panda**, un tap sur une croix l'efface. Les croix ne sont qu'un pense-bête. Un panda faux coûte 1 cœur sur 3 et est retiré ; un panda juste est verrouillé. **Un panda est offert d'avance en Facile.** Pas d'Annuler.
- Niveau 1 Facile guidé (6 étapes, pas de cœur perdu ni de chrono, bouton « Passer »).
- Indice : nomme la déduction disponible puis la joue (1 ou 2 étapes).
- Tutoriel (fr:1272-1278, en:1271-1277) :
  1. « Un panda par ligne et par colonne » / « Touche une case pour la barrer, deux fois vite pour y poser un panda. Chaque ligne et chaque colonne n'en contient qu'un seul. » — « One panda per row and column » / « Tap a cell to cross it out, double-tap it to place a panda. Each row and each column holds exactly one. »
  2. « Et un par région colorée » / « Chaque région colorée n'en contient qu'un aussi, quelle que soit sa forme. » — « And one per colored region » / « Each colored region holds exactly one panda too, whatever its shape. »
  3. « Les pandas ne se touchent jamais » / « Même en diagonale. Garde chaque panda isolé de ses voisins. » — « Pandas never touch » / « Not even diagonally. Keep every panda clear of its neighbors. »

### Démineur / Minesweeper (nouveau en 3.0.0)
- Tailles (JSON) : Facile 9×8 (5-12 mines) puis 11×9 dès le niveau 51 (13-17) ; Moyen 14×11 (25-29) ; Difficile 16×13 (39-43) ; Élite 18×14 (50-56).
- Un chiffre compte les mines parmi les 8 cases voisines ; une case sans mine voisine ouvre ses voisines en cascade ; **taper un chiffre déjà saturé de drapeaux ouvre ses voisines** (chording). **Drapeau : appui long ou bouton mode drapeau.** Compteur de mines toujours affiché. Zoom au pincement. Victoire = toutes les cases sûres ouvertes. 3 cœurs : toucher une mine en coûte un.
- **Le tout premier tap n'est PAS garanti sûr** (il peut tomber sur une mine : le tutoriel le dit). Les grilles sont « sans devinette » à partir de la case de départ du générateur ; ne pas promettre « tape où tu veux sans risque ».
- Indice : ouvre la prochaine case sûre (retire d'abord un drapeau mal posé). Le 1er indice payé peut désigner la case de départ. Niveau 1 Facile guidé (4 étapes).
- Tutoriel (fr:1074-1081, en:1073-1080) :
  1. « Les chiffres comptent les mines voisines » / « Un 2 signifie deux mines cachées parmi les 8 cases qui l'entourent. Tout le jeu tient dans cette règle. » — « Numbers count the mines next door » / « A 2 means two hidden mines among the 8 cells around it. That single rule is the whole game. »
  2. « Tape où tu veux pour commencer » / « Dès qu'une zone s'ouvre, tout le reste se déduit. Aucune grille ne demande de deviner. Attention quand même au tout premier tap : il peut tomber sur une mine. » — « Tap anywhere to start » / « Once one area opens up, the rest can be worked out. No grid ever asks you to guess. Watch that very first tap though: it can land on a mine. »
  3. « Maintiens une case pour poser un drapeau » / « Reste appuyé sur une case pour la marquer comme mine, maintiens à nouveau pour retirer le drapeau. Pour en marquer plusieurs d'affilée, le bouton drapeau de la barre fait ça sans avoir à maintenir à chaque fois. » — « Hold a cell to flag it » / « Press and hold a cell to mark it as a mine, hold it again to clear the flag. Marking several in a row? The flag button in the toolbar does it without holding each one. »
  4. « Trois cœurs, et un indice si tu bloques » / « Toucher une mine coûte un cœur et la case reste marquée. Au troisième, la partie s'arrête. L'ampoule ouvre une case sûre quand tu es coincé. » — « Three hearts, and a hint if you're stuck » / « Hitting a mine costs a heart and the cell stays marked. At three, the game ends. The bulb opens a safe cell whenever you need one. »

### Arrow Maze (nouveau en 3.0.0)
- **Jeu de détente, jamais un « défi de logique »** (consigne de `docs/ARROWMAZE.md:40-53`). Chaque pièce est une ligne de cases dont la tête porte une flèche. **On touche une pièce, n'importe où dessus : elle sort du plateau si rien ne bloque sa trajectoire en ligne droite jusqu'au bord de la grille** ; sinon un cœur est perdu. Victoire = plateau vide. Il reste toujours au moins une pièce libre : pas de mauvais ordre, pas d'impasse. 3 cœurs (4 en Difficile).
- Grilles (JSON) : Facile de 17×8 à 26×26 (20 à 141 pièces) ; Moyen jusqu'à 34×34 ; Difficile de 13×26 à 39×39 (33 à 153 pièces) ; le plus souvent en silhouette. Glisser pour se déplacer, pincer pour zoomer, bouton vue d'ensemble. Appui long sur une pièce : sa trajectoire s'affiche gratuitement. Indice payant : désigne une pièce libre et son chemin. **3 difficultés seulement** (pas d'Élite).
- Tutoriel (fr:1334-1346, en:1333-1345) :
  1. « Vide le plateau » / « Touche une pièce pour l'envoyer hors de la grille. Fais disparaître toutes les pièces pour gagner le niveau. » — « Empty the board » / « Tap a piece to send it off the grid. Clear every piece to win the level. »
  2. « Touche n'importe où sur la pièce » / « Une pièce peut couvrir plusieurs cases : toucher l'une d'elles joue toute la pièce, pas seulement sa flèche. » — « Tap anywhere on a piece » / « A piece can cover several cells: touching any of them plays the whole piece, not just its arrow. »
  3. « Bloquée jusqu'au bord » / « Une pièce sort dans le sens de sa flèche, en ligne droite jusqu'au bord de la grille, même au-delà de la zone colorée. Une autre pièce sur ce trajet la bloque, même de loin, et la toucher quand même coûte un cœur. » — « Blocked all the way to the edge » / « A piece exits toward its arrow in a straight line to the edge of the grid, even past the colored area. Another piece anywhere on that line blocks it, even far away, and tapping it anyway costs a heart. »
  4. « Déplace-toi et zoome » / « Tu démarres avec tout le plateau visible. Si les cases sont trop petites, touche le plateau pour zoomer à cet endroit. Glisse pour te déplacer. Pince ou touche la loupe pour zoomer, et touche la carte pour dézoomer. » — « Pan, zoom, and overview » / « You start zoomed out, seeing the whole board. If the cells are too small, tap the board to zoom in right there. Drag to move. Pinch or tap the magnifier to zoom in, and tap the map to zoom back out. »
  5. « Aucun mauvais choix » / « Il y a toujours au moins une pièce libre à toucher : pas de mauvais ordre, pas d'impasse. Vide le plateau ! » — « No wrong moves » / « There's always at least one piece free to tap, so there's no bad order and no dead end. Clear them all! »

### Pixel Art (nouveau en 3.0.0 ; nonogramme / logimage)
- Grille en noir et blanc pendant la partie ; les nombres d'une ligne ou colonne donnent les longueurs des blocs de cases pleines. Tailles : Facile 5×5 (niveaux 1-5) puis 8×8 ; Moyen 10×10 ; Difficile 12×12 ; Élite 15×15. On peint en **glissant le doigt** ; deux modes (Remplir / Croix) avec bouton bascule ; Annuler (n'annule que les croix). **3 vies** : une case pleine posée à tort coûte une vie et devient une croix verrouillée. Une case juste se verrouille ; quand une ligne ou colonne est complète, ses cases vides sont barrées automatiquement.
- **À la victoire, le dessin se colore (jusqu'à 4 couleurs) et son nom est révélé.** 2217 noms de dessins, traduits dans les 16 langues. Les grilles ne dépendent pas de la langue.
- Indice unique : corrige une erreur s'il y en a une, sinon révèle une case.
- Tutoriel (fr:1151-1158, en:1150-1157) :
  1. « Lis les indices » / « Chaque nombre est une série de cases noircies dans cette ligne ou cette colonne. Un « 3 » veut dire 3 cases noircies d'affilée. » — « Read the clues » / « Each number is a run of filled cells in that row or column. A "3" means 3 filled cells in a row. »
  2. « Glisse pour peindre » / « Fais glisser ton doigt sur les cases pour les noircir et respecter les indices. » — « Drag to paint » / « Drag across cells to fill them in and match the clues. »
  3. « Croise ce qui est vide » / « Passe en mode Croix pour marquer les cases que tu sais vides. Ça ne coûte jamais rien. Noircir une mauvaise case coûte une vie. » — « Cross what's empty » / « Switch to Cross mode to mark cells you know are empty. It never costs anything. Filling a wrong cell costs a life. »
  4. « Termine pour révéler ! » / « Résous toute la grille et regarde ton image prendre vie en couleur. » — « Finish to reveal! » / « Solve the whole grid and watch your picture come to life in color. »

## 3. L'app (B)

**Langues** (`project.pbxproj:357-375` `knownRegions`, `AppLanguage.swift:12-27`) : 16 langues d'interface — en, fr, es, pt-BR, de, it, nl, tr, id, vi, ja, ko, zh-Hans, zh-Hant, hi, th. Avant la 3.0.0 : en et fr seulement. Premier lancement : l'app suit la langue de l'appareil, sinon l'anglais ; changement possible dans Profil > Réglages (redémarrage demandé). **Mots croisés et Mots mêlés n'existent qu'en français et en anglais** ; dans les 14 autres langues ils sont **masqués** (pas grisés), avec l'onglet Thèmes et les packs de thèmes de la Boutique ; un pack déjà acheté n'est jamais retiré (il redevient accessible en repassant en FR/EN). Les 8 autres jeux sont jouables dans les 16 langues.

**Appareils** : iPhone et iPad (`TARGETED_DEVICE_FAMILY = 1,2`) ; **iOS 17.0 minimum** (`project.pbxproj:696`, confirmé par l'API iTunes) ; portrait seulement (iPad : portrait et portrait inversé) ; pas d'Apple Watch, pas de Mac/Vision Pro. Une **Live Activity** (écran verrouillé, compte à rebours de la série de 20 h à minuit) ; pas de widget d'écran d'accueil. Taille du téléchargement ≈ 476 Mo (API iTunes). Classification d'âge **4+** (App Store Connect). Mode clair/sombre, sons et vibrations réglables, VoiceOver.

**Hors ligne** : les grilles des 10 jeux, mode infini compris, sont **dans l'app** (JSON embarqués). Sans réseau tout reste jouable, défi du jour et série compris ; la synchro (progression, série, score, gemmes, avatars, trophées, packs, univers) est mise en file et reprend au retour du réseau. Les pubs ne se chargent évidemment pas hors ligne. Les achats hors ligne : non vérifié (par nature ils passent par l'App Store).

**Compte** : on joue en invité dès le premier lancement ; connexion Apple, Google ou Facebook facultative pour synchroniser ses appareils (500 gemmes offertes à la première connexion) ; suppression du compte possible depuis l'app.

**Premium** (abonnement auto-renouvelable à la semaine, au mois ou à l'année ; produits `com.synapgeek.cerebrumgame.premium.{weekly,monthly,yearly}`). Liste exacte du paywall (EN) : « No forced ads, ever » · « Infinite lives in all games » · « First mistake saved, every round » · « 5 free hints per day, per game » · « Daily gems without watching ads » · « Automatic ×2 gems after each win ». Précisions : retire la bannière et les pubs entre les parties, **pas les pubs récompensées** (la récupération d'une série perdue exige toujours de regarder une pub, même en Premium) → écrire « zéro pub imposée », pas « zéro pub ». « Vies infinies » ne concerne que les jeux qui ont des vies (pas Trace, Labyrinthe ni Mots mêlés). **Prix : non publiés ici** (les valeurs 4,99 €/mois, 19,99 €/an, 2,99 €/semaine de `docs/STORE.md` sont du catalogue non vérifié en App Store Connect ; renvoyer à la fiche App Store). **Essai gratuit : aucun** à ma connaissance (aucune offre d'introduction dans le code ; absente de la fiche ; à reconfirmer dans ASC avant d'écrire « sans essai »). Anciens abonnements `adfree` retirés de la vente ; les abonnés actuels gardent tout.

**Achats uniques** : 3 packs de thèmes Cinéma / Cuisine / Voyage (grilles de Mots croisés et Mots mêlés, 100 par jeu et par langue), non inclus dans Premium ; packs de gemmes (300 de démarrage, 500, 1 500, 5 000).

**Gemmes** : on en gagne à la 1re réussite d'un niveau ou en améliorant ses étoiles, 100 par jour avec le bonus quotidien, 500 à la première connexion. Elles achètent : indices, seconde chance, remplissage des notes (Sudoku), avatars (500 à 3 500), univers (3 000). **Univers** (habillage visuel du parcours et du fond de jeu des 10 jeux) : Breeze offert ; Cascade, Lagoon et Blossom à 3 000 gemmes chacun, pas en achat intégré.

**Pubs côté gratuit** (Google AdMob) : une bannière en bas pendant la partie, des interstitiels (au plus un par 120 s de jeu effectif, aucun avant la 5e partie terminée, jamais après une défaite, aucun à l'ouverture), des pubs récompensées toujours facultatives (indice, continuer, ×2, bonus quotidien, récupération de série, annulation d'une erreur). Consentement : formulaire RGPD Google (hors EEE sauté), puis écran d'explication, puis demande ATT d'Apple ; refus = pubs non personnalisées, rien n'est bloqué.

**Systèmes communs** : série (tout niveau terminé la fait avancer, indépendante du défi du jour ; perdue, elle se récupère avec une pub dans un délai de 48 h à 120 h selon sa longueur) ; trophée mensuel (défi réussi tous les jours d'un mois) ; 7 ligues sur le score cumulé ; 10 avatars (Panda offert, Tortue à 7 jours de série, Cerf à 30 jours, 7 autres en gemmes) qui grandissent de bébé à adulte sur le parcours ; favoris : un cœur sur chaque tuile d'accueil la fait passer en tête (stockés sur l'appareil, non synchronisés) ; ordre fixe de l'accueil : Sudoku, Mots Mêlés, Pandoku, Démineur, Arrow Maze, Pixel Art, Trace, Labyrinthe, Cross Math, Mots Croisés ; notifications locales (rappel quotidien, alertes de série).

**Données** (`Cerebrum/PrivacyInfo.xcprivacy`) : suivi publicitaire déclaré (identifiant appareil, localisation approximative, interactions, historique d'achats) ; données liées à l'identité sans suivi (identifiant utilisateur, e-mail, nom, données pub) ; plantages et performances non liés. Le détail légal est dans la politique de confidentialité.

**URLs de synapgeek.com codées en dur dans l'app 3.0.0 (à garder en vie)** (`Cerebrum/Core/Utilities/LegalURLProvider.swift:26-52`) : `https://synapgeek.com/privacy` et `/terms` (français), `https://synapgeek.com/en/privacy` et `/en/terms` (les 15 autres langues), contact via l'ancre `#contact` de la page d'accueil (`synapgeek.com#contact`, `synapgeek.com/en#contact`), avec des paramètres `?utm_source=cerebrum&utm_medium=app&utm_campaign=profile|sign_in|store_subscription`. La fiche App Store pointe en plus vers `synapgeek.com` (marketing, fr), `synapgeek.com/en` (marketing, 19 locales non françaises) et `synapgeek.com/#contact`. Aucun lien universel (pas d'associated-domains).

## 4. Nouveautés de la 3.0.0 vs 2.1.5 (pour le site)

4 nouveaux jeux (Pandoku, Démineur, Pixel Art, Arrow Maze) ; 14 nouvelles langues (16 au total) ; accueil à ordre fixe avec favoris (cœur) ; moins d'interstitiels (un par 120 s de jeu, aucun avant la 5e partie) ; accessibilité VoiceOver, Switch Control et Voice Control améliorée ; Mots croisés/Mots mêlés masqués hors FR/EN.

## 5. Ce qui va changer (3.1.0, NON publiée, aucune date annoncée)

Aucun nouveau jeu. Contenu : Trace voit ses grilles Difficile et Élite refaites et ses seuils d'étoiles Difficile/Élite relevés ; l'indice des 10 jeux passe dans une bulle commune (panda). Ni coûts, ni difficultés, ni déblocages ne changent. Pas de date de sortie : c'est Adrien qui la décide. **Ne rien annoncer au-delà de la 3.0.0.**

## 6. Note publique App Store (API iTunes, 2026-10-01)

France : 4,69/5 sur 16 notes. Canada : 4,33/5 sur 3 notes. Suisse : 5/5 sur 1 note. États-Unis, Royaume-Uni, Belgique, Allemagne : 0 note. Il n'y a pas de note mondiale unique (l'App Store compte par pays). C'est trop peu pour afficher une note sur un site ; si un chiffre est voulu : « 4,7/5 sur l'App Store France (16 notes au 1er octobre 2026) », jamais « 4,7 dans le monde ».

## 7. Non vérifié (ne pas publier)

Prix réels des abonnements et packs ; essai gratuit (aucun d'après le code, à reconfirmer dans ASC) ; comportement exact des achats hors ligne ; toute affirmation Android ; plafond d'indices par pub pour un joueur gratuit ; coût des indices et ordre de déblocage dans un pack thématique.
