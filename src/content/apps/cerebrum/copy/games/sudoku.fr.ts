import type { GameCopy } from "@/content/copy/types";

export const sudokuFr: GameCopy = {
  updatedAt: "2026-10-02",
  meta: {
    title: "Sudoku : règles, astuces et app Cerebrum | Synapgeek",
    description:
      "Comment jouer au sudoku, et ce qu'apporte Cerebrum : notes, indices expliqués pas à pas, de Facile à Élite. Hors ligne sur iPhone, iPad et Android.",
  },
  hero: {
    h1: "Sudoku",
    definition:
      "Le sudoku est le classique casse-tête de chiffres sur grille 9×9 : chaque ligne, colonne et carré de 3×3 contient les chiffres de 1 à 9, une fois chacun. Il se joue hors ligne dans Cerebrum, l'app de Synapgeek, sur iPhone, iPad et Android.",
    phoneAlt:
      "Sudoku dans Cerebrum, niveau Moyen : une grille de 9×9 avec trois cœurs et un chronomètre au-dessus, les boutons Annuler, Effacer, Notes et Indice et le pavé de chiffres de 1 à 9 en dessous",
  },
  howToPlay: {
    title: "Comment jouer au sudoku",
    steps: [
      "La grille compte 81 cases, réparties en neuf carrés de 3×3. Certaines contiennent déjà un chiffre : ce sont vos points de départ, ils ne changent pas.",
      "Votre but : remplir les cases vides pour que chaque ligne, chaque colonne et chaque carré contienne les chiffres de 1 à 9, sans aucun doublon.",
      "Dans Cerebrum, touchez une case, puis un chiffre sur le pavé. Pour noter plusieurs possibilités dans une case, activez Notes avant de toucher les chiffres.",
      "Chaque chiffre est vérifié dès que vous le posez : un chiffre faux compte pour une erreur, et trois erreurs mettent fin à la partie. Vous gagnez quand la grille est entièrement juste.",
      "Bloqué ? Le bouton Indice vous montre la prochaine étape du raisonnement : il explique la technique pas à pas, puis révèle le chiffre.",
    ],
  },
  whatCerebrumAdds: {
    title: "Ce que Cerebrum ajoute au sudoku",
    paragraphs: [
      "Le sudoku de Cerebrum est la grille classique de 9×9, sans variante. Vous avancez de niveau en niveau dans la difficulté de votre choix ; quand vous avez terminé le parcours d'une difficulté, le mode Infini s'ouvre et enchaîne de nouvelles grilles.",
      "Sous la grille, quatre boutons : Annuler, Effacer, Notes et Indice. Les doublons sont mis en évidence, les notes disparaissent d'elles-mêmes des cases liées quand vous posez un chiffre, et une touche du pavé se grise dès que ses neuf exemplaires corrects sont en place.",
      "L'indice ne se contente pas de donner la réponse : il montre la prochaine étape du raisonnement et nomme la technique à l'œuvre, de quoi mieux aborder la grille suivante. Pour certaines techniques avancées, il retire à la place les candidats impossibles de vos notes. Quand un indice a besoin de vos notes, Cerebrum propose de les remplir à votre place.",
      "Trois erreurs mettent fin à la partie, mais vous pouvez reprendre la même grille jusqu'à deux fois, avec deux cœurs rendus à chaque fois.",
      "Les étoiles se comptent aux erreurs : trois pour une grille sans faute, deux pour une erreur, une dès la deuxième. Les indices ne comptent pas dans les étoiles. Le score récompense une grille rapide, propre et sans trop d'indices, et la difficulté le multiplie.",
    ],
    difficultyTable: {
      caption: "Les difficultés du sudoku dans Cerebrum",
      rows: [
        {
          difficulty: "easy",
          detail:
            "De 40 à 45 chiffres déjà placés. Ouverte dès le premier lancement.",
        },
        {
          difficulty: "medium",
          detail:
            "De 34 à 38 chiffres déjà placés. Ouverte dès le premier lancement.",
        },
        {
          difficulty: "hard",
          detail:
            "De 28 à 33 chiffres déjà placés. S'ouvre au fil de votre progression en Moyen.",
        },
        {
          difficulty: "elite",
          detail:
            "De 24 à 28 chiffres déjà placés (jusqu'à 29 en mode Infini), sur des grilles qui demandent un raisonnement plus avancé. S'ouvre au fil de votre progression en Difficile.",
        },
      ],
    },
  },
  tips: {
    title: "Astuces pour mieux jouer au sudoku",
    items: [
      "Commencez par balayer la grille. Prenez un chiffre déjà bien présent, repérez les lignes et les colonnes où il figure, puis cherchez dans chaque carré l'unique case où il peut encore aller. Passez ensuite au chiffre suivant.",
      "Repérez les candidats uniques. Une case dont la ligne, la colonne et le carré excluent déjà huit chiffres n'en accepte plus qu'un : posez-le. Même logique pour un « singleton caché » : un chiffre qui n'a plus qu'une seule case possible dans une ligne, une colonne ou un carré, quels que soient les autres candidats de cette case.",
      "Ne devinez pas : chaque chiffre est vérifié aussitôt, et trois erreurs terminent la partie. Quand le balayage ne donne plus rien, passez aux notes et inscrivez les candidats des cases les plus contraintes. Cerebrum retire les notes des cases liées à chaque chiffre posé, elles restent donc à jour toutes seules.",
      "Les paires nues débloquent les grilles difficiles. Si deux cases d'une même ligne, colonne ou carré n'ont, l'une comme l'autre, que les mêmes deux candidats, ces deux chiffres leur reviennent : retirez-les des notes des autres cases de cette zone.",
    ],
  },
  faq: {
    title: "Questions fréquentes sur le sudoku dans Cerebrum",
    items: [
      {
        question: "Comment gagne-t-on des étoiles au sudoku ?",
        answer:
          "Seules les erreurs comptent : une grille sans faute rapporte trois étoiles, une erreur deux, et au-delà une seule. Les indices ne les font jamais baisser.",
      },
      {
        question: "À quoi servent les notes ?",
        answer:
          "Activez Notes pour inscrire plusieurs candidats dans une même case. À chaque chiffre posé, Cerebrum l'efface des notes des cases liées : vos notes restent à jour.",
      },
      {
        question: "Comment fonctionnent les erreurs au sudoku ?",
        answer:
          "La grille vérifie chaque chiffre dès que vous le posez. Un chiffre faux compte pour une erreur, la troisième met fin à la partie, avec une seconde chance proposée.",
      },
      {
        question: "Que fait le bouton Indice ?",
        answer:
          "Il vous guide pas à pas dans le raisonnement et nomme la technique à l'œuvre. Il finit en général par révéler le chiffre ; avec quelques techniques avancées, il retire plutôt les candidats impossibles de vos notes.",
      },
      {
        question: "Y a-t-il des variantes du sudoku dans Cerebrum ?",
        answer:
          "Non : Cerebrum propose la grille classique de 9×9, sans variante, de Facile à Élite.",
      },
    ],
  },
};
