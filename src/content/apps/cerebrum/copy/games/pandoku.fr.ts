import type { GameCopy } from "@/content/copy/types";

export const pandokuFr: GameCopy = {
  updatedAt: "2026-10-02",
  meta: {
    title: "Pandoku : règles, astuces et app Cerebrum | Synapgeek",
    description:
      "Comment jouer à Pandoku, un puzzle de type Star Battle : règles, astuces et indices expliqués, de Facile à Élite. Hors ligne sur iPhone, iPad et Android.",
  },
  hero: {
    h1: "Pandoku",
    definition:
      "Pandoku est un puzzle de logique de type Star Battle : un panda par ligne, par colonne et par région colorée, sans que deux pandas se touchent. Il se joue hors ligne dans Cerebrum, l'app de Synapgeek, sur iPhone, iPad et Android.",
    phoneAlt:
      "Pandoku dans Cerebrum, niveau Moyen : une grille de 8×8 découpée en régions colorées, avec des pandas posés et des cases barrées, trois cœurs et un chronomètre au-dessus, le rappel des trois règles et le bouton Indice",
  },
  howToPlay: {
    title: "Comment jouer à Pandoku",
    steps: [
      "La grille est un carré découpé en régions colorées de forme libre, aussi nombreuses que les lignes. Votre but : y poser des pandas en respectant trois règles.",
      "Un panda par ligne et par colonne : chaque ligne et chaque colonne n'en contient qu'un seul.",
      "Un panda par région colorée, quelle que soit sa forme : chaque région n'en contient qu'un seul, elle aussi.",
      "Les pandas ne se touchent jamais, même en diagonale. Gardez chaque panda isolé de ses huit voisines.",
      "Dans Cerebrum, touchez une case pour la barrer, puis touchez-la deux fois vite pour y poser un panda. Les croix ne sont qu'un pense-bête : elles ne comptent pas pour la victoire.",
      "Un panda mal placé est retiré et vous coûte un cœur sur trois ; un panda juste reste en place. Vous gagnez quand tous les pandas sont posés.",
    ],
  },
  whatCerebrumAdds: {
    title: "Ce que Cerebrum ajoute à Pandoku",
    paragraphs: [
      "Dans Cerebrum, vous avancez de niveau en niveau dans la difficulté de votre choix. En Facile, la grille grandit au fil du parcours, de 4×4 à 8×8. Une fois le parcours d'une difficulté terminé, le mode Infini s'ouvre et enchaîne de nouvelles grilles.",
      "Pandoku s'ouvre sur une courte fiche « Comment jouer ». Le premier niveau Facile est guidé : l'app vous fait poser les premiers pandas pas à pas, sans cœur perdu ni chrono (un bouton Passer permet de s'en dispenser). Chaque grille Facile commence avec un panda déjà posé : offert d'avance, il ne s'enlève pas et ne compte ni comme erreur, ni comme indice.",
      "Il n'y a pas de bouton Annuler : un toucher barre une case, un autre efface la croix, gratuitement, et un panda juste est verrouillé pour de bon. Glissez le doigt pour barrer plusieurs cases d'un coup.",
      "Un panda mal placé est retiré et coûte un cœur ; au troisième, la partie est perdue, mais vous pouvez la reprendre une fois avec une pub facultative, puis une fois avec des gemmes. Avec Premium, les cœurs sont infinis et la première erreur de chaque partie est pardonnée.",
      "L'indice montre le raisonnement avant de jouer le coup. Il nomme la déduction disponible (case forcée, unité enfermée ou voisinage commun), la met en évidence, puis place le panda ou barre les cases à votre place. Quand rien de simple ne se présente, il vous donne un panda pour repartir. Chaque indice se règle en gemmes ou se débloque avec une pub facultative, et les abonnés Premium en reçoivent cinq gratuits par jour dans chaque jeu.",
      "Sans erreur, trois étoiles ; une erreur, deux ; deux ou plus, une. Les indices ne comptent pas. Pandoku fait aussi partie des jeux à choisir pour le défi du jour, en Facile ou en Moyen : même grille pour tout le monde, jouable hors ligne, jour manqué rattrapable dans le calendrier.",
    ],
    difficultyTable: {
      caption: "Les difficultés de Pandoku dans Cerebrum",
      rows: [
        {
          difficulty: "easy",
          detail:
            "Des grilles de 4×4 au départ, qui grandissent jusqu'à 8×8. Un panda est offert d'avance. Ouverte dès le premier lancement.",
        },
        {
          difficulty: "medium",
          detail: "Des grilles de 8×8. Ouverte dès le premier lancement.",
        },
        {
          difficulty: "hard",
          detail:
            "Des grilles de 9×9, puis de 10×10 plus loin dans le parcours. S'ouvre au fil de votre progression en Moyen.",
        },
        {
          difficulty: "elite",
          detail:
            "Des grilles de 10×10. S'ouvre au fil de votre progression en Difficile.",
        },
      ],
    },
  },
  tips: {
    title: "Astuces pour mieux jouer à Pandoku",
    items: [
      "Partez des plus petites régions. Si toutes les cases encore possibles d'une région tiennent dans une seule ligne ou une seule colonne, son panda s'y trouve : barrez le reste de cette ligne ou colonne, même hors de la région.",
      "Dès qu'un panda est posé, barrez ses huit voisines, puis le reste de sa ligne, de sa colonne et de sa région : les autres régions se resserrent sans effort.",
      "Comptez les régions. Si deux régions tiennent entièrement dans deux mêmes lignes, ces lignes leur sont réservées : toutes les autres cases de ces deux lignes sont vides. Le raisonnement vaut pour trois régions dans trois lignes, et pour les colonnes.",
      "Cherchez le voisinage commun. Une case qui touche toutes les cases encore possibles d'une région est exclue : où que se pose le panda de cette région, il serait collé à elle. Barrez-la.",
      "Barrez sans hésiter. Les croix sont gratuites et ne comptent pas pour la victoire : plus vous marquez de cases exclues, plus les cases forcées apparaissent. Ne posez un panda que lorsque vous savez dire pourquoi : une erreur coûte un cœur.",
    ],
  },
  faq: {
    title: "Questions fréquentes sur Pandoku dans Cerebrum",
    items: [
      {
        question: "Pandoku est-il un Star Battle ?",
        answer:
          "Oui. Pandoku est le nom que Cerebrum donne à ce puzzle de logique de type Star Battle : on y pose des pandas là où le Star Battle place des étoiles, une par ligne, par colonne et par région.",
      },
      {
        question: "Comment poser un panda ou une croix ?",
        answer:
          "Touchez une case pour la barrer, touchez-la deux fois vite pour y poser un panda, touchez une croix pour l'effacer. Les croix ne comptent pas pour la victoire, et il n'y a pas de bouton Annuler.",
      },
      {
        question: "Que se passe-t-il quand je me trompe ?",
        answer:
          "Un panda mal placé est retiré et vous coûte un cœur sur trois ; le troisième met fin à la partie, que vous pouvez reprendre avec une pub facultative ou avec des gemmes. Premium offre des cœurs infinis.",
      },
      {
        question: "Que fait l'indice de Pandoku ?",
        answer:
          "Il montre le raisonnement avant de jouer le coup : il nomme la déduction disponible, puis place le panda ou barre les cases à votre place. Il se paie en gemmes ou se gagne avec une pub facultative ; Premium en offre cinq par jour.",
      },
      {
        question: "Pandoku est-il gratuit, et se joue-t-il hors ligne ?",
        answer:
          "Oui aux deux. Aucune difficulté n'est réservée à un achat, et les grilles sont dans l'app : il ne faut du réseau que pour les pubs, la connexion à votre compte et les achats. La version gratuite affiche une bannière et des pubs entre certaines parties ; les pubs récompensées restent facultatives, et Premium garantit zéro pub imposée.",
      },
      {
        question: "Sur quels appareils jouer à Pandoku ?",
        answer:
          "Sur iPhone et iPad avec iOS 17.0 ou plus récent, et sur Android avec Android 8.0 ou plus récent. Premium s'achète et se garde dans chaque boutique : l'abonnement pris sur l'App Store ne passe pas sur Google Play, et inversement.",
      },
    ],
  },
  whereToPlay: {
    title: "Jouer à Pandoku sur iPhone, iPad et Android",
    body: "Pandoku se joue dans Cerebrum, l'app de jeux de réflexion de Synapgeek, gratuite et utilisable sans connexion : dans le métro, en salle d'attente, ou dès que vous avez cinq minutes. Installez-la depuis l'App Store sur iPhone et iPad, ou depuis Google Play sur Android.",
  },
};
