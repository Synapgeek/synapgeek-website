import type { GameCopy } from "@/content/copy/types";

export const minesweeperFr: GameCopy = {
  updatedAt: "2026-10-02",
  meta: {
    title: "Démineur : règles, astuces et app Cerebrum | Synapgeek",
    description:
      "Comment jouer au démineur : règles, astuces de déduction et ce qu'ajoute Cerebrum, de Facile à Élite. Hors ligne sur iPhone, iPad et Android.",
  },
  hero: {
    h1: "Démineur",
    definition:
      "Le démineur est le jeu de logique classique où l'on repère des mines cachées : chaque chiffre compte les mines parmi les huit cases qui l'entourent. Il se joue hors ligne dans Cerebrum, l'app de Synapgeek, sur iPhone, iPad et Android.",
    phoneAlt:
      "Démineur dans Cerebrum, niveau Facile : une grille de 9 lignes sur 8 colonnes avec des chiffres et des drapeaux, trois cœurs, le compteur de mines et un chronomètre au-dessus, les boutons Drapeau et Vue d'ensemble et la pastille Indice en dessous",
  },
  howToPlay: {
    title: "Comment jouer au démineur",
    steps: [
      "Au départ, toutes les cases de la grille sont cachées, et certaines abritent une mine. Vous gagnez quand toutes les cases sûres sont ouvertes. Les drapeaux ne servent qu'à vous repérer : ils ne comptent pas pour la victoire.",
      "Un chiffre compte les mines cachées parmi les huit cases qui l'entourent, diagonales comprises. Un 2 signifie deux mines parmi ses huit voisines. Tout le jeu tient dans cette règle.",
      "Une case sans aucune mine voisine ne porte pas de chiffre : elle ouvre d'un coup toutes ses voisines, et la zone s'étend de proche en proche.",
      "Dans Cerebrum, touchez une case pour l'ouvrir. Pour poser un drapeau, restez appuyé sur la case ; restez appuyé de nouveau pour le retirer. Plusieurs mines à marquer d'affilée ? Le bouton Drapeau de la barre évite de maintenir à chaque fois.",
      "Quand un chiffre a déjà autant de drapeaux autour de lui que sa valeur, touchez-le : Cerebrum ouvre d'un coup toutes ses autres voisines. Sur les grandes grilles, pincez pour zoomer.",
      "Toucher une mine coûte un cœur sur trois, et la case reste marquée. Au troisième, la partie s'arrête.",
    ],
  },
  whatCerebrumAdds: {
    title: "Ce que Cerebrum ajoute au démineur",
    paragraphs: [
      "Dans Cerebrum, vous progressez de grille en grille dans la difficulté de votre choix. Quand son parcours est terminé, le mode Infini sert d'autres champs de mines de cette même difficulté.",
      "Le démineur s'ouvre sur une courte fiche « Comment jouer » de quatre pages : les chiffres, le premier toucher, le drapeau, les cœurs et l'indice. Sur le premier niveau Facile, des cases en surbrillance indiquent où ouvrir et où poser un drapeau, et chaque geste reste le vôtre. Aucun cœur n'est en jeu et le chrono est coupé ; vous finissez ensuite seul les cases restantes. Un bouton Passer apparaît dès la deuxième étape si vous préférez continuer sans le guide.",
      "Le compteur de mines, toujours affiché en haut, donne le nombre de mines de la grille moins vos drapeaux. Posez un drapeau de trop et il passe sous zéro : il vous signale ainsi que l'un de vos drapeaux est faux.",
      "Une mine touchée coûte un cœur, et la grille reste gagnable : la case reste marquée d'un drapeau, ce qui garde le compteur juste. Après le troisième cœur, vous pouvez reprendre ce même champ de mines, deux fois au plus, avec deux cœurs rendus à chaque fois.",
      "L'indice ouvre pour vous la prochaine case sûre, avec la cascade habituelle. Il laisse vos drapeaux tranquilles, sauf si la case qu'il ouvre porte un faux drapeau : il le retire d'abord.",
      "Les étoiles suivent vos erreurs : trois pour une grille sans faute, deux pour une erreur, une au-delà, et les indices n'y changent rien.",
    ],
    difficultyTable: {
      caption: "Les difficultés du démineur dans Cerebrum",
      rows: [
        {
          difficulty: "easy",
          detail:
            "Des grilles de 9×8 cachant de 5 à 12 mines, puis de 11×9 avec de 13 à 17 mines plus loin dans le parcours. Ouverte dès le premier lancement.",
        },
        {
          difficulty: "medium",
          detail:
            "Des grilles de 14×11 avec de 25 à 29 mines. Ouverte dès le premier lancement.",
        },
        {
          difficulty: "hard",
          detail:
            "Des grilles de 16×13 avec de 39 à 43 mines. S'ouvre au fil de votre progression en Moyen.",
        },
        {
          difficulty: "elite",
          detail:
            "Des grilles de 18×14 avec de 50 à 56 mines. S'ouvre au fil de votre progression en Difficile.",
        },
      ],
    },
  },
  tips: {
    title: "Astuces pour mieux jouer au démineur",
    items: [
      "Pour le tout premier toucher, visez un coin : il n'a que trois voisines, donc plus de chances d'ouvrir une zone vide d'un coup. Dans Cerebrum, ce toucher n'est pas garanti sûr, il peut tomber sur une mine.",
      "Exploitez les chiffres déjà satisfaits. Un 1 collé à une mine identifiée n'a besoin d'aucune autre mine : toutes ses autres voisines sont libres. Touchez-le pour les ouvrir d'un coup, un raccourci qui fait confiance à vos drapeaux : ne marquez que les mines prouvées, car sur un faux drapeau il déterre une vraie mine.",
      "Soustrayez ce que vous savez. Un 3 qui a déjà deux drapeaux n'attend plus qu'une mine parmi ses voisines encore cachées. Ramené à ce reste, il devient souvent un 1 ou un 2 à comparer au chiffre voisin.",
      "Repérez les suites le long d'un mur, c'est-à-dire une rangée de chiffres qui longe une rangée de cases cachées. Quand ces cases sont les seules voisines cachées des chiffres, un 1-2-1 pose une mine sous chaque 1 et laisse sûre la case sous le 2 ; un 1-2-2-1 place les mines sous les deux 2.",
      "Gardez le compteur à l'œil en fin de grille. S'il affiche zéro et que vos drapeaux sont justes, tout ce qui reste caché est sûr. S'il est égal au nombre de cases cachées et non marquées, ce sont toutes des mines.",
    ],
  },
  faq: {
    title: "Questions fréquentes sur le démineur dans Cerebrum",
    items: [
      {
        question: "Le premier toucher est-il toujours sûr ?",
        answer:
          "Non. Le tout premier toucher est aveugle : il peut tomber sur une mine, ce qui coûte un cœur, ou sur un chiffre, qui n'ouvre rien. Dès qu'une zone s'ouvre, tout le reste se déduit : les grilles de Cerebrum sont vérifiées par un solveur.",
      },
      {
        question: "Comment poser un drapeau ?",
        answer:
          "Restez appuyé sur une case pour la marquer comme mine, restez appuyé de nouveau pour retirer le drapeau. Pour en poser plusieurs à la suite, le bouton Drapeau de la barre évite de maintenir à chaque fois.",
      },
      {
        question: "Que se passe-t-il quand je touche une mine ?",
        answer:
          "Vous perdez un cœur sur trois, et la case devient un drapeau : le compteur de mines reste juste. Le coût se compte par toucher, pas par mine : un seul toucher qui déterre plusieurs mines ne coûte qu'un cœur. Quand le troisième est perdu, la même grille peut être reprise plutôt que recommencée, deux fois au plus.",
      },
      {
        question: "Que fait l'indice du démineur ?",
        answer:
          "Il ouvre la prochaine case sûre, et ne retire l'un de vos drapeaux que si la case qu'il ouvre en porte un faux. Sur une grille vierge, il ouvre une zone de départ sûre.",
      },
      {
        question: "Que montre le compteur de mines ?",
        answer:
          "Les mines de la grille moins les drapeaux posés. Il peut devenir négatif : sous zéro, au moins un de vos drapeaux est faux.",
      },
      {
        question:
          "Comment ouvrir d'un coup toutes les cases autour d'un chiffre ?",
        answer:
          "Quand un chiffre a autant de drapeaux autour de lui que sa valeur, touchez-le. Cerebrum ouvre le reste de ses voisines, mais il fait confiance à vos drapeaux : un drapeau mal placé déterre une vraie mine.",
      },
    ],
  },
};
