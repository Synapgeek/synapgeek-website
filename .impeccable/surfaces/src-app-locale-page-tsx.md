---
version: 1
slug: "src-app-locale-page-tsx"
primary_target: "src/app/[locale]/page.tsx"
related_targets: ["src/app/[locale]/cerebrum"]
---

# Surface brief : hub studio, page app, pages jeux (synapgeek.com)

Mode : Persuade (hub et page app), Read puis Persuade (pages jeux).
Public : adulte de 30 à 60 ans arrivé depuis Google ou un assistant IA, souvent sur téléphone.
Tâche : comprendre en un écran qui est Synapgeek et ce qu'est Cerebrum, trouver le jeu cherché,
lire comment il se joue, aller au store. Preuve : l'app réelle (captures 3.0.0), les règles
réelles, les faits vérifiés ; aucun chiffre ni avis inventé.
Contraintes : PRODUCT.md, spec docs/superpowers/specs/2026-10-01-studio-hub-rework-design.md,
contrat d'URLs de CLAUDE.md, WCAG 2.1 AA, SSG, Smart App Banner limité aux pages Cerebrum.
Moment mémorable : le téléphone, qui suit le pointeur : l'accueil réel de Cerebrum dans le héros de
/cerebrum, les cartes des jeux au style de l'app dans l'encart « Nos apps » de l'accueil.
Décisions ouvertes : aucune sur la direction ; la forme exacte des routes revient à site-architect.

## Direction contract

THESIS : le standard de la catégorie (landing de studio d'apps), exécuté au niveau de finition
d'easybrain.com et oakevergames.com : un studio, ses apps, une page honnête par jeu. Refuse le
héros SaaS générique (slogan vague sur dégradé) : on ouvre sur une phrase de définition et sur
la vraie app dans un téléphone.

OWN-WORLD : fond blanc, encre #1A1A2E ; vert Synapgeek #58CC02 pour l'action principale (texte
encre sur vert) ; violet #8549BA en accent ; lavis pastel vert et violet derrière le téléphone ;
une seule section violet profond pour casser le rythme ; couples lavis/ton profond de la palette
Cerebrum par jeu sur les cartes et les pages jeux ; titres Fredoka 600/700, texte Figtree
400/700 (jamais Nunito, celle d'un autre site du même propriétaire) ; rayons de 24 à 32 px ; boutons pilule ; cartes de jeux au format affiche avec l'icône
kawaii du jeu ; badges stores officiels ; cadre de téléphone dessiné en CSS autour des vraies
captures ou d'un écran HTML ; scènes d'ambiance générées derrière un voile (jamais présentées comme
des captures) ; « Cerebrum » en magenta (`--color-cerebrum`, grand texte seulement), « Synapgeek » en
violet profond uni.

STORY : en un écran, le visiteur sait que Synapgeek est un studio indépendant français et que
Cerebrum réunit des jeux de réflexion classiques et récents, hors ligne ; il parcourt les jeux par
catégorie, ouvre celui qu'il cherchait, lit comment il se joue et touche le badge du store.

FIRST VIEWPORT : mobile 390×844 : barre (logo et wordmark à gauche, FR/EN et menu à droite) ;
H1 « Synapgeek » centré, phrase de définition sur deux ou trois lignes, rangée de badges stores ;
puis le téléphone légèrement incliné montrant l'accueil de Cerebrum, l'icône de l'app qui
chevauche son coin haut-gauche, lavis pastel derrière ; le titre « Les jeux » affleure en bas.
Desktop 1440 : deux colonnes, texte à gauche (H1, définition, badges), téléphone à droite ;
grille des jeux dessous. Interaction signature : le téléphone s'incline de ±5° vers le pointeur
(amorti), immobile en prefers-reduced-motion ; les cartes de jeux se soulèvent et leur lavis
s'intensifie au survol et au focus. Grammaire du mouvement : transitions courtes (150 à 250 ms,
ease-out), un seul fondu d'entrée par section, ni parallaxe ni carrousel automatique.

FORM : le standard de la catégorie (carte canon), choisi par Adrien le 2026-10-01 contre la
direction tirée « Boîte de jeu » ; seed 91dc9609 ; construction code d'abord, maquette de
référence .impeccable/mocks/decision/canon.png.

FINISH : unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

PREUVE DE LA GRAINE (ajoutée le 2026-10-02, revue de finition) : sortie de `impeccable concept-seed` du 2026-10-01 à 04:45 UTC, « DIRECTION CONCEPT SEED (key: 91dc9609; mode: persuade; source: api; approved pool: c3b204a1eed6; 306/564 human-approved) » ; choix canon signalé le même jour par `concept-seed --kind canon --from 91dc9609 --scope direction --mode persuade`. Chemin de construction : code d'abord pour cette session (bascule faite sur la page de décision, qui ne réécrit jamais `.impeccable/config.json` ; le défaut du projet reste « comp »).

AMENDEMENT D'ADRIEN (2026-10-02, après avoir vu le rendu en local), prioritaire sur les blocs STORY et
FIRST VIEWPORT ci-dessus pour la homepage : la homepage devient corporate, à la manière d'easybrain.com.
Révisée le 2026-10-03 après un nouveau passage en local : il n'y a PLUS de slider (composant, logique et
copie supprimés : Adrien l'a trouvé plat), ni de section « Nos jeux ».
STORY (homepage) : un studio sûr de lui se présente sur la photo d'une table (croissant, jus d'orange, mots
croisés, crayon), puis on descend vers « Nos apps » (`#apps`), un encart pleine largeur par app ; puis
« Construit par des passionnés » (le studio, ses trois valeurs, les trois Pandas, l'unique bande violet
profond, des taches de couleur qui jouent deux cycles puis se figent) ; puis le contact. Tout le détail
éditorial et explicatif de l'app vit sur /cerebrum ; la grille des jeux n'est pas sur la homepage.
FIRST VIEWPORT (homepage) : mobile 390×844 : barre ; la photo en plein cadre sous un voile de la couleur de
la page ; H1 « Synapgeek » en violet profond suivi de l'accroche, phrase de définition en texte, bouton vers
Cerebrum. Desktop 1440 : même photo, texte posé à droite sur le bois libre, le croissant et la grille
restent visibles à gauche. La photo est l'image LCP (un `<picture>` à deux cadrages, eager et
`fetchpriority` haut, aucun préchargement manuel).
ENCART D'APP (« Nos apps ») : la scène zen de l'app (générée) avec le téléphone au centre, dont l'écran est
en HTML (les cartes des jeux au style de l'app, décoratif) ; l'icône de l'app à cheval sur le bas de la
scène ; le nom en magenta Cerebrum (lien étiré vers la page de l'app) ; le genre ; la description, qui nomme
iPhone, iPad et Android et dit « gratuite » ; une ligne de VRAIS liens texte vers chaque page de jeu
publiée ; les badges des boutiques. Décision d'Adrien du 2026-10-03 : la ligne de liens remplace la rangée
d'icônes, le téléphone reste décoratif.
HÉROS DE /CEREBRUM : la même scène en plein cadre sous un voile, H1 « Cerebrum » en magenta, définition qui
dit le modèle économique, badges, téléphone incliné avec la vraie capture à droite dès lg.
