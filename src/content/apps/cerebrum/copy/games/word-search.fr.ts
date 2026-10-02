import type { GameCopy } from "@/content/copy/types";

export const wordSearchFr: GameCopy = {
  updatedAt: "2026-10-02",
  meta: {
    title: "Mots mêlés : règles, astuces et app Cerebrum | Synapgeek",
    description:
      "Comment jouer aux mots mêlés : règles, astuces de repérage et ce qu'ajoute Cerebrum, de Facile à Difficile. Hors ligne sur iPhone, iPad et Android.",
  },
  hero: {
    h1: "Mots Mêlés",
    definition:
      "Les mots mêlés sont le jeu de grille classique où l'on retrouve, dans un tableau de lettres, des mots cachés en ligne droite. On y joue hors ligne dans Cerebrum, l'app de Synapgeek, sur iPhone, iPad et Android.",
    phoneAlt:
      "Mots mêlés dans Cerebrum, niveau Facile : une grille de lettres où trois mots sont surlignés en couleur, le compteur de mots trouvés et le chronomètre au-dessus, le bouton Indice et la liste des mots en dessous, les mots trouvés barrés",
  },
  howToPlay: {
    title: "Comment jouer aux mots mêlés",
    steps: [
      "La grille est un carré de lettres où des mots se cachent en ligne droite : à l'horizontale, à la verticale ou en diagonale. Sous la grille, la liste donne les mots à chercher.",
      "Pour sélectionner un mot, posez le doigt sur sa première lettre, glissez en ligne droite jusqu'à sa dernière, puis relâchez. Le sens compte : un mot se valide lu de sa première à sa dernière lettre, jamais dans l'autre sens.",
      "Si la sélection correspond à un mot de la liste, une bande de couleur reste sur la grille et le mot est barré dans la liste. Sinon, rien n'est perdu : il n'y a ni cœurs ni erreurs, on recommence simplement.",
      "Chaque niveau enchaîne trois grilles, imposées et jouées à la suite. Il se termine quand les mots des trois grilles sont trouvés.",
      "Un mot vous échappe ? Le bouton Indice propose une aide qui dépend de la difficulté, et la liste elle-même change selon que vous jouez en Facile, en Moyen ou en Difficile.",
    ],
  },
  whatCerebrumAdds: {
    title: "Ce que Cerebrum ajoute aux mots mêlés",
    paragraphs: [
      "Dans Cerebrum, un niveau de mots mêlés est une suite de trois grilles fixes, sans tirage au sort, que l'on résout l'une après l'autre. Chaque difficulté a son parcours, où les niveaux s'ouvrent un par un ; une fois le parcours terminé, le mode Infini en enchaîne d'autres, toujours de trois grilles, dans la même difficulté.",
      "La liste des mots change avec la difficulté. En Facile, tous les mots à trouver restent lisibles. En Moyen, seul le nombre de lettres de chaque mot s'affiche. En Difficile, la liste disparaît : il faut repérer les mots sans savoir lesquels chercher, et certains sont écrits à l'envers.",
      "Aucune erreur possible et aucune partie perdue : ici, seul le chronomètre compte. Les étoiles se calculent sur le temps moyen par grille. Trois étoiles demandent 45 secondes ou moins par grille en Facile, 2 minutes en Moyen et 3 minutes 30 en Difficile ; deux étoiles, jusqu'à 1 minute 30, 3 minutes 30 et 6 minutes.",
      "Le bouton Indice change avec la difficulté. En Facile, il trouve un mot à votre place dans la grille. En Moyen et en Difficile, il offre deux aides : surligner la première lettre d'un mot encore caché, ou dévoiler le texte d'un mot de la liste.",
      "Trois packs thématiques, Cinéma, Cuisine et Voyage, ajoutent des grilles bâties autour d'un thème, de 9 à 11 cases de côté et sans mot à l'envers. Ce sont des achats intégrés distincts du parcours, leurs grilles comptent comme Difficile, et un même pack ouvre aussi les Mots Croisés.",
      "Les mots mêlés se choisissent aussi pour le défi du jour, en Facile seulement. Les mots diffèrent d'une langue à l'autre : la grille est tirée dans la langue de l'app, si bien que tous ceux qui jouent en français ce jour-là retrouvent la même.",
    ],
    difficultyTable: {
      caption: "Les difficultés des mots mêlés dans Cerebrum",
      rows: [
        {
          difficulty: "easy",
          detail:
            "Des grilles de 7 à 9 cases de côté, avec 5 à 8 mots de 4 à 7 lettres. La liste reste visible en entier. Ouverte dès le premier lancement.",
        },
        {
          difficulty: "medium",
          detail:
            "Des grilles de 9 à 11 cases de côté, avec 7 à 11 mots de 4 à 8 lettres. Seul le nombre de lettres de chaque mot reste lisible. Ouverte dès le premier lancement.",
        },
        {
          difficulty: "hard",
          detail:
            "Des grilles de 11 à 12 cases de côté, avec 8 à 15 mots de 3 à 9 lettres, dont certains écrits à l'envers. La liste est cachée. S'ouvre au fil de votre progression en Moyen.",
        },
      ],
    },
  },
  tips: {
    title: "Astuces pour trouver plus vite les mots mêlés",
    items: [
      "Balayez la grille à la recherche des lettres rares : Z, X, K, W, Q. Un mot qui en contient une n'a qu'une poignée d'endroits où se loger. Repérez la lettre, puis testez les huit cases voisines pour voir si le reste du mot s'y dessine.",
      "Cherchez les lettres doubles. Une paire comme SS, LL ou TT se croise bien moins souvent qu'une lettre isolée : dès que vous en tenez une, lisez autour d'elle dans les quatre axes avant de passer à la suivante.",
      "Pensez à la direction autant qu'à la lettre. Depuis une première lettre possible, ne vous contentez pas de lire vers la droite : essayez le bas et les quatre diagonales. En Difficile, ajoutez la lecture de droite à gauche et de bas en haut, et glissez toujours de la première lettre du mot vers sa dernière.",
      "En Moyen, servez-vous du nombre de lettres affiché pour classer les mots. Un mot de huit lettres n'a que peu d'emplacements en diagonale, alors qu'un mot de quatre lettres peut se cacher partout : attaquez les longs en premier, ils réduisent vite le champ.",
      "Quand la liste est cachée, cherchez les assemblages courants plutôt que des mots entiers : terminaisons en -ER, -ES ou -ANT, paires comme QU ou CH. Un mot probable se dessine souvent avant d'être complet, et il ne reste qu'à confirmer d'un glissement.",
    ],
  },
  faq: {
    title: "Questions fréquentes sur les mots mêlés dans Cerebrum",
    items: [
      {
        question: "Dans quel sens faut-il glisser pour valider un mot ?",
        answer:
          "De sa première lettre à sa dernière. Le sens compte : si vous partez de la dernière lettre pour remonter jusqu'à la première, le mot n'est pas validé, même si vous traversez les bonnes cases.",
      },
      {
        question: "Peut-on se tromper ou perdre une partie ?",
        answer:
          "Non. Les mots mêlés n'ont ni cœurs ni défaite : une sélection qui ne correspond à aucun mot ne coûte rien et se refait aussitôt. Seul le temps compte, pour les étoiles.",
      },
      {
        question: "Des mots peuvent-ils être écrits à l'envers ?",
        answer:
          "En Difficile, oui, à l'horizontale comme à la verticale : on les lit de droite à gauche ou de bas en haut. En Facile et en Moyen, les mots horizontaux se lisent de gauche à droite et les verticaux de haut en bas ; les diagonales peuvent courir dans les quatre sens.",
      },
      {
        question: "Que font les aides des mots mêlés ?",
        answer:
          "En Facile, l'indice trouve un mot pour vous. En Moyen et en Difficile, vous choisissez entre surligner la première lettre d'un mot encore caché et dévoiler le texte d'un mot de la liste.",
      },
      {
        question: "Pourquoi un niveau compte-t-il trois grilles ?",
        answer:
          "Une grille de mots mêlés se résout vite : chaque niveau en enchaîne donc trois, dans un ordre fixe. Pour les étoiles, c'est le temps moyen par grille qui compte, pas le temps total du niveau.",
      },
      {
        question:
          "Pourquoi les mots mêlés n'apparaissent-ils pas dans mon app ?",
        answer:
          "Les mots mêlés se jouent sur des grilles en français ou en anglais, et nulle part ailleurs. Avec l'app réglée sur une autre langue, le jeu est donc masqué ; il revient dès que vous choisissez l'une de ces deux langues.",
      },
    ],
  },
};
