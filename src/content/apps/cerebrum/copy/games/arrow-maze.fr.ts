import type { GameCopy } from "@/content/copy/types";

export const arrowMazeFr: GameCopy = {
  updatedAt: "2026-10-02",
  meta: {
    title: "Arrow Maze : règles, astuces et app Cerebrum | Synapgeek",
    description:
      "Comment jouer à Arrow Maze, casse-tête de flèches tout en détente : règles, astuces et ce qu'ajoute Cerebrum. Hors ligne sur iPhone, iPad et Android.",
  },
  hero: {
    h1: "Arrow Maze",
    definition:
      "Arrow Maze est un casse-tête de flèches tout en détente : on touche une pièce pour la faire glisser hors du plateau quand sa voie est libre, jusqu'à le vider. Il se joue hors ligne dans Cerebrum, l'app de Synapgeek, sur iPhone, iPad et Android.",
    phoneAlt:
      "Arrow Maze dans Cerebrum, niveau Facile : un plateau de pièces fléchées colorées qui dessinent un cœur, trois cœurs et un chronomètre au-dessus, les boutons d'aide, de zoom et Indice en dessous",
  },
  howToPlay: {
    title: "Comment jouer à Arrow Maze",
    steps: [
      "Le plateau est couvert de pièces colorées. Chaque pièce est une ligne de cases, souvent coudée, dont la tête porte une flèche. Vous gagnez quand il ne reste plus aucune pièce sur le plateau.",
      "Touchez une pièce pour l'envoyer dehors. Elle part dans le sens de sa flèche, en ligne droite, jusqu'au bord de la grille : si rien ne se trouve sur ce trajet, elle glisse hors du plateau et disparaît.",
      "Si une autre pièce se trouve sur ce trajet, même de loin, même au-delà de la zone colorée, la pièce est bloquée. La toucher quand même coûte un cœur.",
      "Touchez n'importe où sur la pièce : toucher l'une de ses cases joue la pièce entière, pas seulement sa flèche.",
      "Au départ, tout le plateau est visible. Si les cases sont trop petites, touchez le plateau pour zoomer à cet endroit et glissez pour vous déplacer. Pincez ou touchez la loupe pour zoomer, puis touchez la carte pour dézoomer.",
      "Il n'y a pas de mauvais ordre : il reste toujours au moins une pièce libre, donc jamais d'impasse. Il suffit de les faire sortir une à une.",
    ],
  },
  whatCerebrumAdds: {
    title: "Ce que Cerebrum ajoute à Arrow Maze",
    paragraphs: [
      "Les plateaux d'Arrow Maze dessinent le plus souvent une silhouette, un cœur par exemple, faite de pièces colorées entremêlées. Chaque difficulté a son parcours de plateaux, et une fois celui-ci terminé, le mode Infini en sert d'autres de la même difficulté.",
      "Le jeu s'ouvre sur une fiche « Comment jouer » de cinq pages : vider le plateau, toucher n'importe où sur la pièce, le trajet jusqu'au bord, se déplacer et zoomer, et l'absence de mauvais choix.",
      "Sur un grand plateau, vous glissez pour vous déplacer, vous pincez pour zoomer, et un bouton de vue d'ensemble remet toute la grille à l'écran. Un appui long sur une pièce affiche son trajet, gratuitement : vous voyez ce qui la bloque avant de la toucher.",
      "L'indice désigne une pièce libre et montre son chemin jusqu'au bord. Il ne change jamais les étoiles que vous gagnez.",
      "Toucher une pièce bloquée coûte un cœur : trois en Facile et en Moyen, quatre en Difficile. Zéro erreur donne trois étoiles, une erreur deux, deux erreurs ou plus une seule.",
      "Arrow Maze compte aussi parmi les jeux du défi du jour, en Facile ou en Moyen : chaque joueur reçoit le même plateau, et un jour manqué se rattrape dans le calendrier.",
    ],
    difficultyTable: {
      caption: "Les difficultés d'Arrow Maze dans Cerebrum",
      rows: [
        {
          difficulty: "easy",
          detail:
            "Des plateaux de 17×8 à 26×26, de 20 à 141 pièces, avec trois cœurs. Ouverte dès le premier lancement.",
        },
        {
          difficulty: "medium",
          detail:
            "Des plateaux qui montent jusqu'à 34×34, avec trois cœurs. Ouverte dès le premier lancement.",
        },
        {
          difficulty: "hard",
          detail:
            "Des plateaux de 13×26 à 39×39, de 33 à 153 pièces, avec un cœur de plus : quatre. S'ouvre au fil de votre progression en Moyen.",
        },
      ],
    },
  },
  tips: {
    title: "Astuces pour mieux jouer à Arrow Maze",
    items: [
      "Commencez par les pièces libres du bord. Une pièce dont la flèche pointe vers l'extérieur du plateau, sans rien devant elle, part sans histoire : les premiers coups se trouvent presque toujours sur le pourtour. Chaque pièce partie dégage de la place pour ses voisines.",
      "Repérez la pièce qui en bloque le plus. Quand plusieurs pièces sont libres, jouez d'abord celle qui se trouve sur le trajet du plus grand nombre d'autres : un seul coup en libère souvent plusieurs.",
      "Traitez une direction à la fois. Une flèche qui pointe vers le haut ne peut être gênée que par ce qui se trouve au-dessus de sa tête, dans la même colonne : il suffit de regarder dans ce seul sens. Parcourez les pièces tournées vers le haut, puis celles tournées vers la gauche, plutôt que de sauter d'un côté à l'autre du plateau.",
      "Vérifiez d'un appui long avant de toucher. Le trajet va jusqu'au bord de la grille, même au-delà de la zone colorée : une pièce à l'autre bout de la colonne suffit à bloquer. L'appui long affiche ce trajet sans rien coûter, alors qu'un toucher sur une pièce bloquée coûte un cœur.",
      "Alternez vue d'ensemble et zoom. Zoomez pour toucher juste quand les cases sont petites, puis revenez à la vue d'ensemble pour repérer les zones qui se dégagent. Si aucune pièce libre ne saute aux yeux, rappelez-vous qu'il y en a toujours une, et suivez le bord du plateau.",
    ],
  },
  faq: {
    title: "Questions fréquentes sur Arrow Maze dans Cerebrum",
    items: [
      {
        question: "Arrow Maze est-il un jeu de logique ?",
        answer:
          "C'est avant tout un casse-tête de détente. Il n'existe pas de mauvais ordre et pas d'impasse, puisqu'il reste toujours au moins une pièce libre à toucher. Il suffit de suivre du regard où pointe chaque flèche.",
      },
      {
        question: "Faut-il toucher la flèche elle-même ?",
        answer:
          "Non, n'importe quelle case de la pièce convient. Toucher l'une d'elles joue la pièce entière, pas seulement sa flèche.",
      },
      {
        question: "Que se passe-t-il quand je touche une pièce bloquée ?",
        answer:
          "Elle reste en place et vous perdez un cœur : trois en Facile et en Moyen, quatre en Difficile. Ce coût compte dans les étoiles, puisque zéro erreur en donne trois.",
      },
      {
        question: "Comment savoir où va une pièce ?",
        answer:
          "Restez appuyé sur la pièce : son trajet s'affiche, sans rien coûter. Rappelez-vous qu'une pièce part en ligne droite jusqu'au bord de la grille, même au-delà de la zone colorée.",
      },
      {
        question: "Comment me déplacer sur un grand plateau ?",
        answer:
          "Glissez pour vous déplacer et pincez pour zoomer. Le bouton de vue d'ensemble, ou la carte quand vous êtes zoomé, remet tout le plateau à l'écran.",
      },
      {
        question: "Que fait l'indice d'Arrow Maze ?",
        answer:
          "Il désigne une pièce libre et montre son chemin jusqu'au bord. Il ne change jamais les étoiles que vous gagnez.",
      },
    ],
  },
  whereToPlay: {
    title: "Jouer à Arrow Maze",
    body: "Arrow Maze se joue du bout du doigt : on touche une pièce pour la faire sortir, on glisse pour se déplacer et on pince pour zoomer.",
  },
};
