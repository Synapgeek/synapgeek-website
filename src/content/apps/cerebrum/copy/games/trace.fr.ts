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
      "Le but est de dessiner un seul chemin continu qui traverse toutes les cases de la grille. Touchez le 1 pour commencer, puis faites glisser le doigt de case en case : le tracé avance vers le haut, le bas, la gauche ou la droite, jamais en diagonale.",
      "Les points numérotés sont des étapes à franchir dans l'ordre exact : le 1, puis le 2, puis le 3, et ainsi de suite. Entre deux numéros, le tracé peut faire tous les détours qu'il veut, à condition de ne jamais repasser sur une case.",
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
      "L'indice lit l'état de votre tracé. Si vous vous êtes engagé sur une mauvaise voie, il vous ramène au dernier bon point ; si vous êtes sur la bonne, il dessine à votre place les trois cases suivantes.",
      "Le tout premier niveau Facile commence avec un tracé fantôme déjà posé sur la grille, et un tutoriel en cinq pages reprend les règles dans l'app.",
      "Choisissez Trace pour le défi du jour et vous tracez la même grille que tous les autres joueurs ce jour-là, en Facile ou en Moyen.",
    ],
    difficultyTable: {
      caption: "Les difficultés de Trace dans Cerebrum",
      rows: [
        {
          difficulty: "easy",
          detail:
            "Des grilles de 5×5 cases, parfois de 6×6, sans aucun mur : le terrain idéal pour prendre le coup de main. Ouverte dès le premier lancement.",
        },
        {
          difficulty: "medium",
          detail:
            "Des grilles de 6×6 ou de 7×7 cases, avec de zéro à six murs pour guider ou gêner le tracé. Ouverte dès le premier lancement.",
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
      "Raisonnez par tronçons, d'un numéro au suivant. Repérez le 3 et le 4, imaginez le chemin le plus court qui les relie, puis cherchez quelles cases voisines vous pouvez ramasser en route. Un tronçon se prépare avant de s'y engager.",
      "Comptez avant de vous engager. Entre deux numéros, le nombre de pas a toujours la parité du chemin le plus court : si le 3 et le 4 sont à cinq pas l'un de l'autre, le tronçon fera cinq, sept ou neuf pas, jamais six. Confrontez ce compte aux cases encore vides autour.",
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
          "Par toutes les cases. Les numéros fixent l'ordre des étapes, mais le tracé doit couvrir chaque case de la grille, une fois et une seule.",
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
