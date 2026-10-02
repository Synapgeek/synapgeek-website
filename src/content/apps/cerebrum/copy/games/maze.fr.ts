import type { GameCopy } from "@/content/copy/types";

export const mazeFr: GameCopy = {
  updatedAt: "2026-10-02",
  meta: {
    title: "Labyrinthe : règles, astuces et app Cerebrum | Synapgeek",
    description:
      "Comment jouer au Labyrinthe : guidez une luciole jusqu'à la sortie, cristaux, brouillard et astuces. Hors ligne sur iPhone, iPad et Android.",
  },
  hero: {
    h1: "Labyrinthe",
    definition:
      "Le Labyrinthe est un jeu où l'on guide une luciole à travers un labyrinthe jusqu'au portail de sortie, en ramassant des cristaux en chemin. Il se joue hors ligne dans Cerebrum, l'app de Synapgeek, sur iPhone, iPad et Android.",
    phoneAlt:
      "Le Labyrinthe dans Cerebrum, niveau Moyen : un labyrinthe à sol crème dont les murs cousus orange et violets découpent les couloirs, la luciole au milieu et un cristal rose en bas, le compteur de cristaux et le chronomètre au-dessus, les flèches de direction, le bouton Indice et le bouton de vue d'ensemble en dessous",
  },
  howToPlay: {
    title: "Comment jouer au Labyrinthe",
    steps: [
      "Guidez votre luciole jusqu'au portail de sortie. Avancez avec les flèches de l'écran ou en faisant glisser le doigt sur le labyrinthe : la luciole se déplace d'une case à la fois, vers le haut, le bas, la gauche ou la droite, jamais en diagonale. Maintenez une flèche, ou gardez le doigt posé après un glissé, et la luciole continue d'avancer. Toucher une case ne fait rien.",
      "Un mur vous bloque ? Essayez simplement une autre direction. Le mur arrête la luciole sans rien vous coûter : il n'y a ni cœur à perdre ni partie à rater.",
      "Ramassez les cristaux roses qui jalonnent le plateau. Ils sont facultatifs, le labyrinthe se termine sans eux, mais ils comptent pour les étoiles.",
      "Les boosters donnent un coup de pouce. Dans une impasse, la bulle éclate toute seule et ramène la luciole vers la branche inexplorée la plus proche qui contient encore un cristal, ou vers la sortie quand il n'y en a pas à portée. La fusée, elle, lance la luciole seule le long du couloir.",
      "En Élite, le labyrinthe est plongé dans le brouillard : vous ne voyez que ce qui entoure la luciole. Le bouton de vue d'ensemble dévoile tout le labyrinthe pendant quelques secondes, trois fois par labyrinthe.",
    ],
  },
  whatCerebrumAdds: {
    title: "Ce que Cerebrum ajoute au Labyrinthe",
    paragraphs: [
      "Un niveau de Labyrinthe, c'est un seul labyrinthe à traverser. Chaque difficulté se parcourt niveau après niveau ; une fois au bout, le mode Infini prolonge la partie avec d'autres labyrinthes de la même difficulté.",
      "La plupart des labyrinthes ont une forme, du triangle en Facile jusqu'au cœur, à l'anneau, à l'étoile ou au sablier dans les difficultés plus élevées, et les cases hors de la forme ne se traversent pas. Les autres sont de simples rectangles.",
      "Un petit labyrinthe tient tout entier à l'écran. Dans un grand, la vue suit la luciole pas à pas, et le bouton de vue d'ensemble dézoome pour montrer tout le plateau d'un coup, autant de fois que vous voulez tant qu'il n'y a pas de brouillard.",
      "Chaque étoile récompense une chose : une pour la sortie trouvée, une pour tous les cristaux ramassés, une pour l'arrivée dans le temps cible, calculé d'après la longueur du plus court chemin.",
      "Un tutoriel en cinq pages reprend les règles dans l'app. Le défi du jour ne propose jamais de labyrinthe Élite : il n'a donc jamais de brouillard.",
    ],
    difficultyTable: {
      caption: "Les difficultés du Labyrinthe dans Cerebrum",
      rows: [
        {
          difficulty: "easy",
          detail:
            "Des labyrinthes de 8×8 à 18×18 cases, sans brouillard, avec des cristaux au fond des impasses et parfois une fusée, mais pas de bulle. Ouverte dès le premier lancement.",
        },
        {
          difficulty: "medium",
          detail:
            "Des labyrinthes de 11×11 à 23×23 cases, toujours sans brouillard. C'est ici qu'apparaissent les bulles. Ouverte dès le premier lancement.",
        },
        {
          difficulty: "hard",
          detail:
            "Des labyrinthes de 14×14 à 30×30 cases, sans brouillard, mais aux itinéraires bien plus longs. S'ouvre au fil de votre progression en Moyen.",
        },
        {
          difficulty: "elite",
          detail:
            "Des labyrinthes jusqu'à 36×36 cases, noyés dans le brouillard : vous ne voyez que quelques cases autour de la luciole, et ce cercle se resserre dans les derniers labyrinthes du parcours. S'ouvre au fil de votre progression en Difficile.",
        },
      ],
    },
  },
  tips: {
    title: "Astuces pour sortir plus vite du labyrinthe",
    items: [
      "En Élite, regardez la vue d'ensemble avant d'avancer dans le brouillard. Elle ne dure que quelques secondes et ne se déclenche que trois fois par labyrinthe : employez-en une dès le départ pour repérer la sortie et le sens général du plateau, gardez les deux autres pour vous retrouver. Ce que la luciole a éclairé reste visible ensuite.",
      "Remontez le labyrinthe depuis la sortie. Dès que le plateau est en vue, suivez des yeux le couloir qui touche le portail, puis le suivant, jusqu'à rejoindre un passage proche de la luciole : un chemin cherché à l'envers évite de s'engager dans les branches qui s'éloignent du portail.",
      "Les cristaux se trouvent toujours au fond d'une impasse. Décidez tôt lesquels méritent le détour : une impasse courte au bord de votre route se visite en aller-retour, une longue branche coûte surtout du temps. Les ignorer tous laisse encore deux étoiles à portée d'une course rapide ; l'étoile des cristaux, elle, les exige tous.",
      "Faites travailler vos boosters là où ils rapportent. Une fusée ramassée au début d'un long couloir vous emporte jusqu'au prochain carrefour ou à la prochaine impasse, et il suffit de toucher une direction pour reprendre la main. Plusieurs bulles se cumulent en réserve : chacune se dépense seule dans une impasse, mais reste en réserve quand le retour ne vaut pas le détour.",
      "Gardez l'indice pour le carrefour où vous hésitez. Il n'éclaire que les six prochaines cases du plus court chemin, pendant quelques secondes : notez la direction avant que les cases ne s'éteignent, au lieu de le dépenser au milieu d'un couloir où vous n'avez pas le choix.",
    ],
  },
  faq: {
    title: "Questions fréquentes sur le Labyrinthe dans Cerebrum",
    items: [
      {
        question: "Que se passe-t-il quand la luciole heurte un mur ?",
        answer:
          "Rien de plus : elle reste où elle est et vous choisissez une autre direction. Le Labyrinthe n'a ni cœur ni défaite, donc un mur ne peut jamais vous faire perdre.",
      },
      {
        question: "Y a-t-il une limite de temps ?",
        answer:
          "Non. Le chronomètre ne compte que pour l'étoile du temps cible : arriver plus tard ne fait jamais perdre un niveau.",
      },
      {
        question: "Les cristaux sont-ils des gemmes ?",
        answer:
          "Non. Les gemmes sont la monnaie de l'app, alors que les cristaux se ramassent dans le labyrinthe, et les ramasser tous rapporte l'une des trois étoiles du niveau. Chaque cristal ajoute aussi des points à votre score.",
      },
      {
        question: "Quelle différence entre le Labyrinthe et Arrow Maze ?",
        answer:
          "Au Labyrinthe, vous marchez : une luciole traverse le plateau jusqu'à la sortie. Arrow Maze est un casse-tête de flèches tout en détente, où l'on touche des pièces pour les faire glisser hors du plateau, sans personnage à guider.",
      },
      {
        question: "Que fait l'indice du Labyrinthe ?",
        answer:
          "Il allume pendant environ quatre secondes les six prochaines cases du plus court chemin vers la sortie, à partir de la position de la luciole. Sous le brouillard, l'indice révèle aussi ces cases pour de bon.",
      },
    ],
  },
};
