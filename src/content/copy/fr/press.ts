import type { PressCopy } from "../types";

export const pressFr: PressCopy = {
  updatedAt: "2026-10-02",
  meta: {
    title: "Presse : fiche de Cerebrum, logo et captures d'écran | Synapgeek",
    description:
      "Espace presse de Synapgeek : fiche d'identité de Cerebrum, liste des jeux avec leur genre, logo, icône et captures à télécharger, contact presse.",
  },
  hero: {
    h1: "Espace presse Synapgeek",
    definition:
      "Les faits à citer sur Synapgeek, studio français indépendant, et sur Cerebrum, son app de jeux de réflexion hors ligne pour iPhone, iPad et Android, avec le logo, l'icône de l'app et des captures à télécharger.",
  },
  factSheet: {
    title: "Fiche d'identité de Cerebrum",
    rows: [
      { label: "App", value: "Cerebrum" },
      {
        label: "Éditeur",
        value:
          "Synapgeek SAS, studio français indépendant installé à Frontenas, dans le Rhône",
      },
      {
        label: "Type",
        value: "App de jeux de réflexion qui se joue hors ligne",
      },
      {
        label: "Plateformes",
        value:
          "iPhone et iPad (iOS 17.0 ou plus récent), Android (Android 8.0 ou plus récent)",
      },
      {
        label: "Disponibilité",
        value: "Sur l'App Store depuis le 3 juin 2026, et sur Google Play",
      },
      {
        label: "Langues",
        value:
          "16 langues d'interface. Les grilles de Mots Croisés et de Mots Mêlés existent en français et en anglais seulement.",
      },
      {
        label: "Modèle économique",
        value:
          "Gratuite au téléchargement et financée par une bannière pendant la partie et des pubs entre certaines parties ; les pubs récompensées sont toujours facultatives, l'abonnement Premium (hebdomadaire, mensuel ou annuel) apporte zéro pub imposée, et les achats intégrés (paquets de gemmes, thèmes Cinéma, Cuisine et Voyage) sont facultatifs.",
      },
    ],
  },
  games: {
    title: "Les jeux, par genre",
    intro: "Chaque jeu est nommé avec son genre et renvoie à sa propre page.",
  },
  publisher: { title: "L'éditeur" },
  downloads: {
    title: "Téléchargements",
    intro:
      "Le logo du studio, l'icône de Cerebrum et quatre captures d'écran de la version 3.0.0, en français.",
    items: [
      { label: "Logo Synapgeek", href: "/press/synapgeek-logo-v3.png" },
      { label: "Icône de Cerebrum", href: "/press/cerebrum-icon-v3.png" },
      {
        label: "Capture : accueil",
        href: "/press/cerebrum-screen-home-fr-v3.webp",
      },
      {
        label: "Capture : défi du jour",
        href: "/press/cerebrum-screen-daily-fr-v3.webp",
      },
      {
        label: "Capture : progression",
        href: "/press/cerebrum-screen-progression-fr-v3.webp",
      },
      {
        label: "Capture : Sudoku",
        href: "/press/cerebrum-screen-sudoku-fr-v3.webp",
      },
    ],
  },
  contact: {
    title: "Contact presse",
    body: "Pour une demande de presse, un visuel ou une précision à vérifier, écrivez-nous.",
  },
};
