import type { GameCopy } from "@/content/copy/types";

export const crossMathFr: GameCopy = {
  updatedAt: "2026-10-02",
  meta: {
    title: "Cross Math : règles, astuces et app Cerebrum | Synapgeek",
    description:
      "Comment jouer à Cross Math, les mots croisés de calcul : règles, astuces, difficultés. Dans Cerebrum, hors ligne sur iPhone, iPad et Android.",
  },
  hero: {
    h1: "Cross Math",
    definition:
      "Cross Math est un jeu de mots croisés de calcul : les « mots » de la grille sont des équations à compléter avec les nombres d'une réserve. Il se joue hors ligne dans Cerebrum, l'app de Synapgeek, sur iPhone, iPad et Android.",
    phoneAlt:
      "Cross Math dans Cerebrum, niveau Moyen : une grille d'équations qui se croisent avec trois cases encore vides, trois cœurs et un chronomètre au-dessus, le bouton Indice puis la réserve de nombres 1, 4 et 24 en dessous",
  },
  howToPlay: {
    title: "Comment jouer à Cross Math",
    steps: [
      "La grille ressemble à des mots croisés, mais ses « mots » sont des calculs : chaque suite de cases reliées par des opérateurs et un signe égal forme une équation, comme 8 × 2 = 16. Certains nombres sont donnés, d'autres manquent, et le but est de remplir toutes les cases vides.",
      "Sous la grille, la réserve liste les nombres qu'il vous reste à placer. Elle contient exactement les nombres manquants, ni plus ni moins : aucun leurre, chaque nombre a sa case.",
      "Touchez une case vide puis un nombre de la réserve, ou faites glisser le nombre jusqu'à la case. Posé, il quitte la réserve.",
      "Les calculs suivent la priorité des opérations : les multiplications et les divisions passent avant les additions et les soustractions. 2 + 3 × 4 fait donc 14, et non 20. Tous les nombres sont entiers.",
      "Chaque nombre est vérifié au moment où vous le posez. Un nombre juste se verrouille. Un nombre faux est signalé aussitôt et vous coûte une vie ; cinq secondes plus tard, il s'efface de la case et regagne la réserve.",
      "Un niveau enchaîne trois grilles. Le chronomètre continue de tourner et les erreurs se cumulent d'une grille à l'autre, et rien n'est comptabilisé avant la fin de la troisième.",
    ],
  },
  whatCerebrumAdds: {
    title: "Ce que Cerebrum ajoute à Cross Math",
    paragraphs: [
      "Cross Math a sa propre progression dans Cerebrum : chaque difficulté a son parcours de niveaux, qui s'ouvrent l'un après l'autre. Quand vous avez terminé le parcours d'une difficulté, le mode Infini prend le relais avec d'autres niveaux de trois grilles, toujours dans cette difficulté.",
      "Plus la difficulté monte, plus les grilles grandissent et plus les opérations se multiplient : Facile s'en tient à l'addition et à la soustraction, Moyen y ajoute la multiplication, Difficile et Élite y ajoutent la division. Les nombres à placer vont de 1 à 30, tandis que les nombres donnés et les résultats montent jusqu'à 100.",
      "Vous disposez de trois vies, affichées en cœurs : chaque nombre faux en retire une, et la troisième perdue arrête la partie, mais une seconde chance reste possible. Une grille sans erreur rapporte trois étoiles, une seule erreur, deux ; deux erreurs ou plus, une seule. Aucun bouton Annuler : la correction se fait toute seule, quand le nombre faux retourne dans la réserve.",
      "Le bouton Indice remplit la case que vous avez sélectionnée, sinon celle qui fait le plus avancer la grille. Il vous relance quand deux équations se tiennent mutuellement en échec.",
    ],
    difficultyTable: {
      caption: "Les difficultés de Cross Math dans Cerebrum",
      rows: [
        {
          difficulty: "easy",
          detail:
            "Des grilles de 5×5 cases, avec des additions et des soustractions, et quatre nombres à placer. Ouverte dès le premier lancement.",
        },
        {
          difficulty: "medium",
          detail:
            "Surtout du 7×7, aussi du 9×7 ou du 7×9 et, plus rarement, du 7×5. La multiplication s'ajoute à l'addition et à la soustraction, pour 6 à 9 nombres à placer. Ouverte dès le premier lancement.",
        },
        {
          difficulty: "hard",
          detail:
            "Surtout du 9×9, sinon du 9×7 ou du 7×9, avec les quatre opérations : la division rejoint les trois autres. De 10 à 15 nombres à placer. S'ouvre au fil de votre progression en Moyen.",
        },
        {
          difficulty: "elite",
          detail:
            "Presque toujours du 9×9, avec la plus grande part d'équations où la priorité des opérations compte. De 10 à 14 nombres à placer. S'ouvre au fil de votre progression en Difficile.",
        },
      ],
    },
  },
  tips: {
    title: "Astuces pour mieux jouer à Cross Math",
    items: [
      "Commencez par l'équation qui n'a plus qu'une case vide : c'est un calcul à une seule inconnue, son nombre est imposé. Dans 7 + ? = 12, la case vaut 5. Une fois posé, ce nombre sert d'appui aux équations qui le croisent, et la grille se dénoue de proche en proche.",
      "Appliquez la priorité des opérations avant de chercher un nombre. Dans ? + 3 × 4 = 17, calculez d'abord 3 × 4 = 12 : la case vaut 5. Lu de gauche à droite, le même calcul donnerait un tout autre résultat. C'est le piège le plus courant dès le niveau Moyen, là où la multiplication apparaît.",
      "Écartez les nombres de la réserve qui ne peuvent pas convenir. Dans ? + 4 = 9, ni 24 ni 10 ne tiennent, puisque dans une addition aucun terme ne dépasse le total. La réserve fond vite, et les derniers nombres qui restent s'imposent d'eux-mêmes.",
      "Dans une division, partez du résultat. Les nombres étant entiers, le dividende est un multiple du diviseur : pour ? ÷ 4 = 6, la case vaut 24, et pour 36 ÷ ? = 9, cherchez le nombre qui entre neuf fois dans 36.",
      "Éprouvez un nombre dans ses deux équations avant de le poser. Une case au croisement d'une ligne et d'une colonne appartient aux deux : un nombre qui convient à l'une mais pas à l'autre est faux, et il coûte une vie. En cas de doute, attaquez d'abord la case où l'une des deux équations est presque complète.",
    ],
  },
  faq: {
    title: "Questions fréquentes sur Cross Math dans Cerebrum",
    items: [
      {
        question: "Cross Math respecte-t-il la priorité des opérations ?",
        answer:
          "Oui. Les multiplications et les divisions se calculent avant les additions et les soustractions, comme en arithmétique. 2 + 3 × 4 vaut 14. La règle compte dès Moyen, la première difficulté où la multiplication apparaît.",
      },
      {
        question: "Que devient un nombre faux ?",
        answer:
          "Il est signalé dès que vous le posez, et une vie disparaît. Après cinq secondes, il quitte la case et revient dans la réserve, prêt à être replacé ailleurs. Un nombre juste, lui, reste verrouillé.",
      },
      {
        question: "Faut-il glisser les nombres ou les toucher ?",
        answer:
          "Les deux gestes marchent : touchez une case puis un nombre de la réserve, ou faites glisser le nombre sur la case. Le résultat est le même.",
      },
      {
        question: "Que fait le bouton Indice dans Cross Math ?",
        answer:
          "Il remplit la case sélectionnée si elle est vide, sinon la case de l'équation qui compte le moins d'inconnues. Un indice ne coûte aucune étoile : seules les erreurs comptent.",
      },
      {
        question: "Y a-t-il un tutoriel dans Cross Math ?",
        answer:
          "Non, le jeu n'en a pas : cette page en tient lieu. La difficulté Facile, avec ses quatre nombres à placer sur 5×5, est un bon terrain pour s'y mettre.",
      },
    ],
  },
};
