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
      "Démineur dans Cerebrum, niveau Facile : une grille de 9 lignes sur 8 colonnes avec des chiffres et des drapeaux, trois cœurs, le compteur de mines et un chronomètre au-dessus, les boutons Drapeau et Indice en dessous",
  },
  howToPlay: {
    title: "Comment jouer au démineur",
    steps: [
      "Au départ, toutes les cases de la grille sont cachées, et certaines abritent une mine. Vous gagnez quand toutes les cases sûres sont ouvertes. Les drapeaux ne servent qu'à vous repérer : ils ne comptent pas pour la victoire.",
      "Un chiffre compte les mines cachées parmi les huit cases qui l'entourent, diagonales comprises. Un 2 signifie deux mines parmi ses huit voisines. Tout le jeu tient dans cette règle.",
      "Une case sans aucune mine voisine ne porte pas de chiffre : elle ouvre d'un coup toutes ses voisines, et la zone s'étend de proche en proche.",
      "Dans Cerebrum, touchez une case pour l'ouvrir. Pour poser un drapeau, restez appuyé sur la case ; restez appuyé de nouveau pour le retirer. Plusieurs mines à marquer d'affilée ? Le bouton Drapeau de la barre évite de maintenir à chaque fois.",
      "Quand un chiffre a déjà autant de drapeaux autour de lui que sa valeur, touchez-le : Cerebrum ouvre d'un coup toutes ses autres voisines. Sur les grandes grilles, pincez pour zoomer.",
      "Toucher une mine coûte un cœur sur trois, et la case reste marquée. Au troisième, la partie s'arrête. Le tout premier toucher peut lui aussi tomber sur une mine ; ensuite, dès qu'une zone s'ouvre, tout le reste se déduit.",
    ],
  },
  whatCerebrumAdds: {
    title: "Ce que Cerebrum ajoute au démineur",
    paragraphs: [
      "Dans Cerebrum, vous progressez de grille en grille dans la difficulté de votre choix. Quand son parcours est terminé, le mode Infini sert d'autres champs de mines de cette même difficulté.",
      "Le démineur s'ouvre sur une courte fiche « Comment jouer » de quatre pages, sur iPhone, iPad et Android : les chiffres, le premier toucher, le drapeau, les cœurs et l'indice. Sur iPhone et iPad, le premier niveau Facile est en plus guidé, en quatre étapes.",
      "Le compteur de mines, toujours affiché en haut, donne le nombre de mines de la grille moins vos drapeaux. Posez un drapeau de trop et il passe sous zéro : il vous signale ainsi que l'un de vos drapeaux est faux.",
      "Une mine touchée coûte un cœur, et la grille reste gagnable : la case se marque d'un drapeau, ce qui garde le compteur juste. Au troisième cœur, la partie est finie, sauf si vous la reprenez : une fois avec une pub facultative, une autre fois avec des gemmes. Premium rend les cœurs infinis et pardonne la première mine touchée de chaque partie.",
      "L'indice ouvre pour vous la prochaine case sûre. Si l'un de vos drapeaux est mal placé, il commence par le retirer. On le règle en gemmes, ou on le gagne devant une pub facultative ; Premium en offre cinq par jour dans chaque jeu.",
      "Zéro erreur donne trois étoiles, une erreur deux, deux erreurs ou plus une seule, et les indices n'y changent rien. Le défi du jour peut aussi se jouer au démineur, en Facile ou en Moyen : tout le monde reçoit la même grille.",
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
      "Repérez les suites le long d'un mur, c'est-à-dire une rangée de chiffres qui longe une rangée de cases cachées. Quand ces cases sont les seules voisines cachées des chiffres, un 1-2-1 pose une mine sous chaque 1 et laisse sûre la case sous le 2 ; un 1-2-2-1 place les mines sous les deux 2.",
      "Gardez le compteur à l'œil en fin de grille. S'il affiche zéro et que vos drapeaux sont justes, tout ce qui reste caché est sûr. S'il est égal au nombre de cases cachées et non marquées, ce sont toutes des mines.",
    ],
  },
  faq: {
    title: "Questions fréquentes sur le démineur dans Cerebrum",
    items: [
      {
        question: "Le premier toucher est-il toujours sûr ?",
        answer:
          "Non. Le tout premier toucher peut tomber sur une mine et vous coûte alors un cœur. Une fois une zone ouverte, tout le reste de la grille se déduit : aucune grille ne demande de deviner.",
      },
      {
        question: "Comment poser un drapeau ?",
        answer:
          "Restez appuyé sur une case pour la marquer comme mine, restez appuyé de nouveau pour retirer le drapeau. Pour en poser plusieurs à la suite, le bouton Drapeau de la barre évite de maintenir à chaque fois.",
      },
      {
        question: "Que se passe-t-il quand je touche une mine ?",
        answer:
          "Vous perdez un cœur sur trois et la case reste marquée d'un drapeau. Un seul toucher qui déterre plusieurs mines ne coûte qu'un cœur. Au troisième, la partie s'arrête : vous pouvez la reprendre avec une pub facultative ou avec des gemmes. Premium offre des cœurs infinis.",
      },
      {
        question: "Que fait l'indice du démineur ?",
        answer:
          "Il ouvre la prochaine case sûre, après avoir retiré l'un de vos drapeaux si celui-ci est mal placé. Il se paie en gemmes ou se gagne avec une pub facultative.",
      },
      {
        question: "Le démineur est-il gratuit, et se joue-t-il sans réseau ?",
        answer:
          "Il est gratuit, comme tous les jeux de Cerebrum. Les grilles sont déjà dans l'app, donc rien ne dépend du réseau pour jouer. La version gratuite affiche une bannière pendant la partie ; les pubs récompensées restent facultatives, et Premium garantit zéro pub imposée.",
      },
      {
        question: "Le niveau guidé existe-t-il sur Android ?",
        answer:
          "Pas tout à fait. La fiche « Comment jouer » de quatre pages existe sur iPhone, iPad et Android, mais le premier niveau Facile guidé n'existe que sur iPhone et iPad.",
      },
    ],
  },
  whereToPlay: {
    title: "Jouer au démineur sur iPhone, iPad et Android",
    body: "Le démineur se joue dans Cerebrum, l'app de jeux de réflexion de Synapgeek : elle se télécharge gratuitement et se joue sans réseau, le temps d'une pause ou d'une file d'attente. Elle s'installe depuis l'App Store sur iPhone et iPad, ou depuis Google Play sur Android.",
  },
};
