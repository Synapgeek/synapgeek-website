import type { HubCopy } from "../types";

export const hubFr: HubCopy = {
  updatedAt: "2026-10-02",
  meta: {
    title: "Synapgeek : studio français indépendant, éditeur de Cerebrum",
    description:
      "Synapgeek est un studio français indépendant. Son app Cerebrum réunit jeux de réflexion classiques et récents, hors ligne, sur iPhone, iPad et Android.",
  },
  hero: {
    h1: "Synapgeek",
    definition:
      "Synapgeek est un studio français indépendant qui crée des applications mobiles. Sa première, Cerebrum, réunit des jeux de réflexion classiques et récents dans une seule app hors ligne, sur iPhone, iPad et Android.",
    phoneAlt:
      "Écran d'accueil de Cerebrum avec le défi quotidien, les thèmes et les cartes de jeux, dont Sudoku, Mots Mêlés, Pandoku et Démineur",
  },
  apps: {
    title: "Notre app",
    items: {
      cerebrum: {
        description:
          "Sudoku, Mots Croisés et Mots Mêlés côtoient Pandoku, Pixel Art, Trace et d'autres. Défi du jour, ligues et séries, le tout jouable sans réseau.",
        cta: "Découvrir Cerebrum",
      },
    },
  },
  games: {
    title: "Les jeux",
    categories: {
      "logic-numbers": "Logique et chiffres",
      words: "Mots",
      paths: "Chemins et labyrinthes",
    },
  },
  facts: [
    { value: "Hors ligne", label: "toutes les grilles sont dans l'app" },
    { value: "16", label: "langues d'interface" },
    { value: "iPhone, iPad, Android", label: "pour y jouer" },
    { value: "Gratuit", label: "au téléchargement" },
  ],
  studio: {
    title: "Un studio français indépendant",
    body: "Synapgeek SAS est un studio indépendant installé à Frontenas, en France, et l'éditeur de Cerebrum. Découvrez qui conçoit les apps et comment le studio travaille.",
    cta: "À propos du studio",
  },
  contact: { title: "Une question ?" },
};
