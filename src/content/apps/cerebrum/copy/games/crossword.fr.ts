import type { GameCopy } from "@/content/copy/types";

export const crosswordFr: GameCopy = {
  updatedAt: "2026-10-02",
  meta: {
    title: "Mots croisés : règles, astuces et app Cerebrum | Synapgeek",
    description:
      "Comment jouer aux mots croisés : règles, astuces de résolution et ce qu'ajoute Cerebrum, de Facile à Difficile. Hors ligne sur iPhone, iPad et Android.",
  },
  hero: {
    h1: "Mots Croisés",
    definition:
      "Les mots croisés sont le jeu de grille classique où l'on retrouve des mots à partir de leurs définitions, chaque réponse croisant les autres. Ils se jouent hors ligne dans Cerebrum, l'app de Synapgeek, sur iPhone, iPad et Android.",
    phoneAlt:
      "Mots croisés dans Cerebrum, niveau Facile : une grille libre à moitié remplie, trois cœurs et un chronomètre au-dessus, la définition en cours avec son nombre de lettres puis le clavier AZERTY en dessous",
  },
  howToPlay: {
    title: "Comment jouer aux mots croisés",
    steps: [
      "La grille est libre : seules les cases utiles existent, et les mots s'y croisent, vers la droite ou vers le bas. Chaque mot commence par une case numérotée, et sa définition porte le même numéro.",
      "Sous la grille s'affiche la définition du mot sélectionné, avec une flèche pour son sens et, entre parenthèses, le nombre de lettres de la réponse. Vous gagnez quand tous les mots sont trouvés.",
      "Touchez une case pour choisir son mot, puis tapez la réponse sur le clavier intégré : AZERTY pour les grilles en français, QWERTY pour celles en anglais. Les accents ne comptent pas : E suffit pour É, È ou Ê.",
      "Une case située au croisement de deux mots appartient aux deux. Touchez-la une seconde fois pour passer du sens horizontal au sens vertical, et inversement.",
      "Un mot est vérifié dès que sa dernière lettre est posée. Juste, il se verrouille et ses lettres deviennent des certitudes pour les mots qui le croisent. Faux, il passe au rouge, vous perdez un cœur et ses lettres sont effacées.",
      "Bloqué ? Le bouton Indice propose trois aides, de la plus légère à la réponse entière.",
    ],
  },
  whatCerebrumAdds: {
    title: "Ce que Cerebrum ajoute aux mots croisés",
    paragraphs: [
      "Les mots croisés de Cerebrum sont des grilles de définitions libres : ni carrées, ni bordées de cases noires. Chaque difficulté a son parcours, où les grilles s'ouvrent une à une ; une fois le parcours terminé, le mode Infini en enchaîne d'autres de la même difficulté.",
      "Le jeu n'existe qu'en français et en anglais : définitions, réponses et clavier sont tous d'une même version, celle de l'app. Si l'app est réglée sur une autre langue, les mots croisés sont simplement masqués.",
      "Trois cœurs, un par mot faux : au troisième, la partie s'arrête, avec une seconde chance proposée. Sans erreur, vous gagnez trois étoiles ; avec une erreur, deux ; avec deux erreurs ou plus, une seule. Les aides n'entrent jamais dans ce compte.",
      "Le bouton Indice propose trois aides. L'indice de définition donne une définition plus facile du même mot ; la lettre dévoile une case de la réponse ; le mot révèle toute la réponse d'un coup. En Facile, l'aide par définition n'est pas proposée.",
      "Trois packs thématiques, Cinéma, Cuisine et Voyage, ajoutent des grilles autour d'un thème. Ce sont des achats intégrés distincts du parcours, leurs grilles sont de difficulté Difficile, et un même pack ouvre aussi les Mots Mêlés.",
      "Les mots croisés se choisissent aussi pour le défi du jour, mais en Facile seulement. Tous les joueurs qui le choisissent ce jour-là ont la même grille, et un jour manqué se rattrape dans le calendrier.",
    ],
    difficultyTable: {
      caption: "Les difficultés des mots croisés dans Cerebrum",
      rows: [
        {
          difficulty: "easy",
          detail:
            "Des grilles de 9 à 12 sur 10 à 12 cases, de 14 à 20 mots, sans aide par définition. Ouverte dès le premier lancement.",
        },
        {
          difficulty: "medium",
          detail:
            "Des grilles de même taille, de 14 à 20 mots, avec l'aide par définition. Ouverte dès le premier lancement.",
        },
        {
          difficulty: "hard",
          detail:
            "Des grilles de 6 à 12 sur 10 à 12 cases, de 9 à 15 mots. C'est aussi la difficulté des packs thématiques. S'ouvre au fil de votre progression en Moyen.",
        },
      ],
    },
  },
  tips: {
    title: "Astuces pour mieux résoudre les mots croisés",
    items: [
      "Commencez par les définitions dont vous êtes sûr : un synonyme direct, un nom propre, une réponse évidente. Chaque mot juste se verrouille, et ses lettres vous servent d'appuis pour les mots qui le croisent : les réponses plus difficiles se dégagent d'elles-mêmes.",
      "Servez-vous du nombre entre parenthèses. Écartez toute réponse qui n'a pas le bon nombre de lettres, et attaquez les mots courts d'abord : ils laissent moins de réponses possibles, et leurs lettres tombent justement sur les longs mots.",
      "Lisez la définition comme une phrase. Un pluriel appelle une réponse au pluriel, donc sans doute un S final ; un féminin, un verbe conjugué ou un participe se retrouvent dans la terminaison. Le temps et l'accord de la définition sont presque toujours ceux de la réponse.",
      "Regardez les lettres déjà posées avant de demander une aide. Deux ou trois lettres bien placées suffisent souvent à débloquer une réponse hésitante. Si ce n'est pas assez, prenez l'aide la plus légère d'abord et gardez la révélation du mot pour la fin.",
      "Ne posez pas la dernière lettre sur un coup de tête. La vérification se déclenche à cette lettre-là : avant, aucune erreur n'est possible. Complétez le mot à une case près, confrontez-le aux mots déjà verrouillés qui le croisent, puis validez seulement si le tout tient.",
    ],
  },
  faq: {
    title: "Questions fréquentes sur les mots croisés dans Cerebrum",
    items: [
      {
        question: "Que se passe-t-il quand un mot est faux ?",
        answer:
          "Dès que vous posez sa dernière lettre, le mot est vérifié. S'il est faux, ses cases passent au rouge, un cœur disparaît et les lettres s'effacent. Le troisième cœur perdu met fin à la partie, avec une seconde chance proposée.",
      },
      {
        question: "Comment passer d'un mot horizontal à un mot vertical ?",
        answer:
          "En touchant une seconde fois la case qui se trouve au croisement. Chaque case partagée appartient à un mot horizontal et à un mot vertical, et le même geste fait basculer de l'un à l'autre.",
      },
      {
        question: "Faut-il taper les accents ?",
        answer:
          "Non. La vérification les ignore : E vaut pour É, È ou Ê. Le clavier intégré n'a d'ailleurs pas de touches accentuées.",
      },
      {
        question: "Que font les aides des mots croisés ?",
        answer:
          "Trois aides existent : une définition plus facile pour le mot en cours, une lettre dévoilée, ou le mot entier. La première n'est pas proposée en Facile. Les étoiles ne tiennent compte que des erreurs, jamais des aides.",
      },
      {
        question: "À quoi servent les packs Cinéma, Cuisine et Voyage ?",
        answer:
          "Chacun apporte des grilles autour de son thème, toutes de difficulté Difficile. C'est un achat intégré à part, qui ouvre aussi les Mots Mêlés. Un pack déjà acheté n'est jamais retiré.",
      },
      {
        question:
          "Pourquoi les mots croisés n'apparaissent-ils pas dans mon app ?",
        answer:
          "Parce que leurs grilles n'existent qu'en français et en anglais : si l'app est réglée sur une autre langue, le jeu est masqué. Il revient dès que vous repassez en français ou en anglais.",
      },
    ],
  },
};
