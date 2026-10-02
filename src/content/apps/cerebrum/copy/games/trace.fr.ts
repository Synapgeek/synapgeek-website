import type { GameCopy } from "@/content/copy/types";

export const traceFr: GameCopy = {
  updatedAt: "2026-10-02",
  meta: {
    title: "Trace : règles, astuces et app Cerebrum | Synapgeek",
    description:
      "Comment jouer à Trace, un puzzle à tracer d'un seul trait : règles, astuces et indice, de Facile à Élite. Hors ligne sur iPhone, iPad et Android.",
  },
  hero: {
    h1: "Trace",
    definition:
      "Trace est un puzzle à tracer d'un seul trait : une ligne continue doit passer par toutes les cases de la grille et franchir les points numérotés dans l'ordre. Il se joue hors ligne dans Cerebrum, l'app de Synapgeek, sur iPhone, iPad et Android.",
    phoneAlt:
      "Trace dans Cerebrum, niveau Difficile : une grille de cases roses où un tracé continu serpente entre des points numérotés, des murs en barres sombres entre certaines cases, trois pastilles de progression et un chronomètre au-dessus, les flèches de direction et le bouton Indice en dessous",
  },
  howToPlay: {
    title: "Comment jouer à Trace",
    steps: [
      "Le but est de dessiner un seul chemin continu qui traverse toutes les cases de la grille. Touchez le 1 pour commencer, puis faites glisser le doigt de case en case : le tracé avance vers le haut, le bas, la gauche ou la droite, jamais en diagonale. Le tracé part toujours du 1 et finit toujours sur le dernier numéro, une fois toutes les autres cases couvertes.",
      "Les points numérotés se franchissent dans l'ordre : le 1, puis le 2, puis le 3. Seule exception, l'Élite, où une paire de points jumeaux peut se franchir dans l'un ou l'autre ordre. Entre deux numéros, le tracé peut faire tous les détours qu'il veut, à condition de ne jamais repasser sur une case.",
      "Les murs, des barres sombres posées entre deux cases, bloquent le passage : le tracé ne peut pas les traverser. Il doit pourtant couvrir toutes les cases, sans en laisser une seule de côté.",
      "Une erreur de parcours se rattrape à tout moment. Repassez sur vos pas pour reculer, touchez une case du tracé pour le couper à cet endroit, ou servez-vous des flèches de direction à l'écran. Un mouvement interdit est simplement refusé.",
    ],
  },
  whatCerebrumAdds: {
    title: "Ce que Cerebrum ajoute à Trace",
    paragraphs: [
      "Dans Cerebrum, un niveau de Trace enchaîne trois grilles, jouées à la suite sous un seul chronomètre qui ne s'arrête pas entre elles. Chaque difficulté a son parcours de niveaux ; quand vous l'avez terminé, le mode Infini prolonge la partie avec d'autres grilles.",
      "Il n'y a ni cœur ni défaite à Trace. Un mouvement interdit, comme traverser un mur, est refusé sans pénalité : le tracé reste où il était et vous cherchez un autre passage.",
      "Seul le temps compte pour les étoiles : plus vite vous finissez, plus vous en gagnez.",
      "L'indice lit l'état de votre tracé. Si vous vous êtes engagé sur une mauvaise voie, il vous ramène au dernier bon point ; si vous êtes sur la bonne, il dessine à votre place les trois cases suivantes. Il se joue pas à pas sur la grille.",
      "Le premier niveau Facile montre aussi un tracé fantôme des deux prochaines cases devant votre ligne, pour guider vos premiers pas. Un tutoriel en cinq pages s'ouvre à la première partie et se rejoue avec le bouton « ? ».",
    ],
    difficultyTable: {
      caption: "Les difficultés de Trace dans Cerebrum",
      rows: [
        {
          difficulty: "easy",
          detail:
            "Surtout des grilles de 5×5 cases, sinon de 6×6, sans aucun mur : le terrain idéal pour prendre le coup de main. Ouverte dès le premier lancement.",
        },
        {
          difficulty: "medium",
          detail:
            "Surtout des grilles de 6×6 cases, sinon de 7×7, avec de zéro à six murs pour guider ou gêner le tracé. Moins de points numérotés qu'en Facile, donc moins de repères pour guider la ligne. Ouverte dès le premier lancement.",
        },
        {
          difficulty: "hard",
          detail:
            "Les murs et les numéros laissent moins de marge : le tracé se déduit davantage qu'il ne se devine. S'ouvre au fil de votre progression en Moyen.",
        },
        {
          difficulty: "elite",
          detail:
            "Les grilles les plus exigeantes du jeu. S'ouvre au fil de votre progression en Difficile.",
        },
      ],
    },
  },
  tips: {
    title: "Astuces pour réussir vos tracés",
    items: [
      "Commencez par les coins et les culs-de-sac. Une case qui n'a que deux sorties, comme un coin de la grille ou une case flanquée de murs, impose son passage : sauf si le tracé y commence ou s'y termine, il y entre par l'une et ressort par l'autre. Une case qui n'en a qu'une est forcément un bout du tracé. Posez ces segments obligatoires avant de chercher les autres.",
      "Ne coupez jamais une poche de cases. Avant chaque mouvement, vérifiez que les cases restantes forment toujours un seul bloc joignable depuis votre position : si votre tracé referme un coin derrière lui, ce coin ne sera jamais couvert et il faudra reculer.",
      "Raisonnez par tronçons, d'un numéro au suivant. Repérez le 3 et le 4, imaginez le chemin le plus court qui les relie, puis cherchez quelles cases voisines vous pouvez ramasser en route. Préparez chaque tronçon avant de vous y engager.",
      "Comptez avant de vous engager. Entre deux numéros, le nombre de pas a toujours la parité du chemin le plus court : si le 3 et le 4 sont à cinq pas l'un de l'autre, le tronçon fera cinq, sept, neuf pas ou davantage, mais jamais six ni huit. Confrontez ce compte aux cases encore vides autour.",
      "Reculez sans hésiter, cela ne coûte que du temps. Quand le tracé paraît coincé, coupez-le au dernier carrefour où vous aviez le choix, en touchant la case, plutôt que de forcer le passage.",
    ],
  },
  faq: {
    title: "Questions fréquentes sur Trace dans Cerebrum",
    items: [
      {
        question: "Peut-on perdre à Trace ou se tromper ?",
        answer:
          "Non. Trace n'a ni cœur ni défaite : un mouvement interdit est refusé sans erreur et vous continuez. Seul le temps joue sur vos étoiles.",
      },
      {
        question:
          "Faut-il passer par toutes les cases ou seulement par les numéros ?",
        answer:
          "Par toutes les cases. Les numéros fixent l'ordre des étapes, hormis les points jumeaux de l'Élite, mais le tracé doit couvrir chaque case de la grille, une fois et une seule.",
      },
      {
        question: "Comment revenir en arrière ?",
        answer:
          "De trois façons : repasser sur vos pas, toucher une case du tracé pour le couper à cet endroit, ou utiliser les flèches de direction.",
      },
      {
        question: "Que fait l'indice de Trace ?",
        answer:
          "Il s'adapte à votre tracé : un retour au dernier bon point si vous faites fausse route, trois cases de plus dans le cas contraire.",
      },
      {
        question: "Pourquoi un niveau compte-t-il trois grilles ?",
        answer:
          "Chaque niveau est une série de trois grilles à finir à la suite, avec un chronomètre qui court sans interruption. Les étoiles se jugent sur le temps, pas sur le nombre d'essais.",
      },
    ],
  },
};
