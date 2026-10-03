import type { GameCopy } from "@/content/copy/types";

export const pixelArtFr: GameCopy = {
  updatedAt: "2026-10-02",
  meta: {
    title: "Pixel Art : règles, astuces et app Cerebrum | Synapgeek",
    description:
      "Comment jouer au Pixel Art (nonogrammes, logimages) : règles, astuces et ce qu'ajoute Cerebrum. Hors ligne sur iPhone, iPad et Android.",
  },
  hero: {
    h1: "Pixel Art",
    definition:
      "Pixel Art est un jeu de nonogrammes, aussi appelés logimages : les nombres en bord de grille disent quelles cases noircir pour révéler un dessin caché. Il se joue hors ligne dans Cerebrum, l'app de Synapgeek, sur iPhone, iPad et Android.",
    phoneAlt:
      "Pixel Art dans Cerebrum, niveau Élite : un panda de 15×15 cases révélé en couleur, trois cœurs, un pinceau à 100 % et un chronomètre au-dessus, et le panneau « Tu as peint : Panda » avec le bouton Continuer",
  },
  howToPlay: {
    title: "Comment jouer au Pixel Art",
    steps: [
      "La grille est un carré de cases vides, avec des nombres en tête de chaque ligne et de chaque colonne. Votre but : noircir les bonnes cases pour faire apparaître un dessin.",
      "Chaque nombre est une série de cases noircies d'affilée dans sa ligne ou sa colonne. Un 3 veut dire trois cases noircies côte à côte. Avec deux nombres, comme 2 puis 1, la ligne porte deux séries dans cet ordre, séparées par au moins une case vide.",
      "Dans Cerebrum, faites glisser le doigt sur les cases pour les noircir : un seul geste peint toute une série. Le bouton bascule vous fait passer de l'un des deux modes à l'autre, Remplir ou Croix.",
      "Passez en mode Croix pour marquer les cases que vous savez vides. Une croix ne coûte jamais rien.",
      "Noircir une mauvaise case coûte une de vos trois vies et la change en croix verrouillée ; une case juste se verrouille aussi.",
      "Vous avez gagné quand toute la grille est résolue : le dessin se colore et son nom s'affiche.",
    ],
  },
  whatCerebrumAdds: {
    title: "Ce que Cerebrum ajoute au Pixel Art",
    paragraphs: [
      "Chaque difficulté a son parcours de dessins cachés. Une fois terminé, le mode Infini continue d'en proposer de nouveaux à la taille de grille de cette difficulté, jusqu'au 15×15 en Élite.",
      "Pixel Art s'ouvre sur une courte fiche « Comment jouer » de quatre pages : lire les indices, glisser pour peindre, croiser ce qui est vide, finir pour révéler.",
      "Pendant la partie, la grille reste en noir et blanc.",
      "Dès qu'une ligne ou une colonne est complète, ses cases vides se barrent toutes seules, et les croix déjà posées s'y verrouillent. Annuler ne reprend que les croix, jamais une case noircie.",
      "Sans vie, la partie s'arrête, mais le dessin n'est pas perdu : deux reprises au plus, chacune avec deux vies. Un glissé qui balaie plusieurs cases fausses s'arrête à la première et ne coûte qu'une vie.",
      "L'indice règle une seule case. Si vous avez barré une case qui fait partie du dessin, il la noircit ; sinon il noircit une case manquante dans la ligne ou la colonne la plus avancée. Un indice ne coûte jamais de vie.",
      "À la victoire, le dessin apparaît en quatre couleurs, avec son nom : Panda, par exemple.",
      "Les étoiles se comptent aux erreurs : aucune, trois étoiles ; une, deux ; deux ou plus, une. Les indices ne comptent pas.",
    ],
    difficultyTable: {
      caption: "Les difficultés du Pixel Art dans Cerebrum",
      rows: [
        {
          difficulty: "easy",
          detail:
            "Des grilles de 8×8, avec quelques 5×5 plus petites pour démarrer le parcours. Ouverte dès le premier lancement.",
        },
        {
          difficulty: "medium",
          detail: "Des grilles de 10×10. Ouverte dès le premier lancement.",
        },
        {
          difficulty: "hard",
          detail:
            "Des grilles de 12×12. S'ouvre au fil de votre progression en Moyen.",
        },
        {
          difficulty: "elite",
          detail:
            "Des grilles de 15×15, les plus grandes. S'ouvre au fil de votre progression en Difficile.",
        },
      ],
    },
  },
  tips: {
    title: "Astuces pour mieux jouer au Pixel Art",
    items: [
      "Commencez par les longues séries, avec la méthode du recouvrement. Dans une ligne de 10 cases, un 7 seul peut glisser de trois cases au plus : quelle que soit sa position, les quatre cases du milieu sont noires. Plus la série est longue par rapport à la ligne, plus il y a de cases sûres.",
      "Repérez les lignes qui se remplissent d'elles-mêmes. Si les nombres, plus une case vide entre deux séries, couvrent exactement la longueur de la ligne, tout est déterminé : dans 10 cases, un 4-1-3 donne quatre cases noires, une case vide, une noire, une case vide, puis trois noires.",
      "Travaillez depuis les bords. Quand la première case d'une ligne est noire, la première série part de ce bord : noircissez-la sur toute sa longueur, puis barrez la case qui la suit. La dernière série se traite de la même façon, côté opposé.",
      "Barrez sans attendre ce que vous savez vide : une croix ne coûte jamais rien. Quand toutes les séries d'une ligne sont placées, barrez le reste de la ligne. Noircir à tort coûte une vie : ne noircissez une case que si les indices le prouvent, et laissez-la vide dans le doute.",
      "Alternez lignes et colonnes. Chaque case noircie ou barrée apporte une certitude à la ligne qu'elle croise. Quand une ligne ne donne plus rien, passez à la colonne suivante, puis revenez : c'est la grille entière qui se débloque, case après case.",
    ],
  },
  faq: {
    title: "Questions fréquentes sur le Pixel Art dans Cerebrum",
    items: [
      {
        question: "Pixel Art est-il un nonogramme ?",
        answer:
          "Oui. Pixel Art est le nom que Cerebrum donne à ses nonogrammes, aussi appelés logimages : on noircit des cases d'après les nombres des lignes et des colonnes, et le résultat dessine une image.",
      },
      {
        question: "Comment peindre et croiser les cases ?",
        answer:
          "Faites glisser le doigt sur la grille pour peindre plusieurs cases d'un seul geste, le bouton bascule sur Remplir. Passez-le sur Croix pour marquer les cases que vous savez vides.",
      },
      {
        question: "Que se passe-t-il quand je noircis une mauvaise case ?",
        answer:
          "Vous perdez une vie et la case devient une croix verrouillée. La troisième vie perdue met fin à la partie, mais une seconde chance vous est proposée.",
      },
      {
        question: "À quoi sert le bouton Annuler ?",
        answer:
          "Il ne reprend que les croix, jamais une case noircie : une case noircie est soit juste et verrouillée, soit fausse et changée en croix verrouillée.",
      },
      {
        question: "Que fait l'indice du Pixel Art ?",
        answer:
          "Il règle une seule case, en commençant par une case barrée à tort, et ne coûte jamais de vie.",
      },
      {
        question: "Le nom du dessin change-t-il avec la langue ?",
        answer:
          "Les grilles sont les mêmes dans toutes les langues de l'app, mais le nom du dessin, révélé à la victoire, s'affiche dans la langue que vous avez choisie dans Cerebrum.",
      },
    ],
  },
};
