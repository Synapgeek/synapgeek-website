import type { AppCopy } from "@/content/copy/types";
import { gamesFr } from "./games/fr";

/**
 * Qui édite Cerebrum, sans homonymie possible : affichée en tête de la FAQ et reprise telle
 * quelle par le JSON-LD (disambiguatingDescription), qui ne dit jamais plus que la page.
 */
const DISAMBIGUATION_FR =
  "Cerebrum est l'application de jeux de réflexion éditée par Synapgeek SAS, studio français indépendant. À ne pas confondre avec d'autres produits ou sociétés du même nom.";

export const cerebrumFr: AppCopy = {
  updatedAt: "2026-10-03",
  meta: {
    title: "Cerebrum : jeux de réflexion hors ligne | Synapgeek",
    description:
      "Cerebrum de Synapgeek : Sudoku, mots croisés, mots mêlés, hors ligne sur iPhone, iPad et Android. Gratuite avec publicité ; Premium : zéro pub imposée.",
  },
  disambiguation: DISAMBIGUATION_FR,
  hero: {
    h1: "Cerebrum",
    definition:
      "Cerebrum est une application de jeux de réflexion hors ligne, éditée par Synapgeek pour iPhone, iPad et Android : Sudoku, Mots Croisés, Mots Mêlés et d'autres jeux. Gratuite avec publicité ; Premium garantit zéro pub imposée.",
    phoneAlt:
      "Écran d'accueil de Cerebrum avec le défi quotidien, les thèmes et les cartes de jeux, dont Sudoku, Mots Mêlés, Pandoku et Démineur",
  },
  sections: {
    games: {
      title: "Les jeux de Cerebrum",
      categories: {
        "logic-numbers": "Logique et chiffres",
        words: "Mots",
        paths: "Chemins et labyrinthes",
      },
    },
    daily: {
      title: "Défi du jour et série",
      body: "Il y a un seul défi par jour pour toute l'app. Vous choisissez votre jeu, et la grille est la même pour tous les joueurs de ce jeu, dans la même langue. Elle se joue hors ligne. Un jour manqué se rattrape dans le calendrier du mois.",
      items: [
        "Réussissez le défi tous les jours d'un mois pour gagner le trophée du mois.",
        "Votre série avance chaque jour où vous terminez une partie. Si vous perdez une série d'au moins 2 jours, une pub facultative peut la rétablir dans les jours qui suivent, une fois par série perdue.",
        "Sur iPhone et iPad, de 20 h à minuit, si votre série est en cours et que vous n'avez pas encore joué, une Live Activity sur l'écran verrouillé affiche le compte à rebours pour la sauver. Vous pouvez la désactiver dans le Profil.",
        "Sur Android, le même compte à rebours arrive sous forme de notification, à condition que les notifications soient autorisées.",
      ],
    },
    progress: {
      title: "Votre progression",
      items: [
        "Chaque jeu propose un parcours de niveaux par difficulté, de Facile jusqu'à Élite selon le jeu. Les niveaux sont notés de 1 à 3 étoiles, puis le mode Infini prend le relais.",
        "Votre avatar grandit avec vous sur le parcours, de bébé à adulte.",
        "Votre score cumulé, tous jeux confondus, vous fait monter de ligue, de Bronze à Légende.",
        "Pas de minuteur pour recharger des vies, pas d'attente : après une défaite, vous rejouez le niveau tout de suite.",
      ],
      growthCaption:
        "L'avatar Panda à trois stades de croissance : bébé, jeune et adulte.",
    },
    goodToKnow: {
      title: "Bon à savoir",
      items: [
        "Pas de réseau ? Tout reste jouable, défi du jour et série compris. Si vous êtes connecté à un compte, votre progression se synchronise au retour en ligne.",
        "Jouez en invité dès le premier lancement. La connexion est facultative, avec Apple, Google ou Facebook sur iPhone, iPad et Android. Votre progression suit alors votre compte d'un appareil à l'autre, sur iPhone, iPad et Android.",
        "L'app existe en 16 langues. Les grilles de Mots Croisés et de Mots Mêlés n'existent qu'en français et en anglais. Dans les 14 autres langues, ces deux jeux et leurs packs de thèmes sont masqués.",
        "Cerebrum fonctionne sur iPhone et iPad à partir d'iOS 17.0, et sur Android à partir d'Android 8.0.",
        "Sur iPhone, iPad et Android, l'app prend en charge le mode clair et le mode sombre (automatique, ou à votre choix dans le Profil) et permet de régler les sons et les vibrations. Sur iPhone et iPad, elle fonctionne aussi avec VoiceOver.",
      ],
    },
    model: {
      title: "Gratuit, avec ou sans Premium",
      items: [
        "Cerebrum se télécharge gratuitement et vit de la publicité : une bannière pendant la partie et des pubs entre certaines parties.",
        "Les pubs récompensées restent toujours facultatives : à regarder pour des gemmes, un indice ou une seconde chance.",
        "Premium est un abonnement à la semaine, au mois ou à l'année. Il garantit zéro pub imposée : il retire la bannière et les pubs entre les parties. Il ajoute aussi des vies infinies dans les jeux qui ont des vies, 5 indices gratuits par jour et par jeu, la première erreur pardonnée à chaque partie, des gemmes offertes chaque jour et des gemmes doublées après chaque victoire.",
        "Premium s'achète et se conserve dans chaque boutique : sur l'App Store pour iPhone et iPad, sur Google Play pour Android. Un abonnement ne passe pas d'une boutique à l'autre.",
        "Les achats intégrés sont facultatifs : des packs de gemmes, et les packs de thèmes Cinéma, Cuisine et Voyage (mots croisés et mots mêlés thématiques), non inclus dans Premium.",
        "Aucun jeu ni aucune difficulté n'est réservé à un achat.",
      ],
    },
    privacy: {
      title: "La confidentialité en bref",
      body: "Cerebrum fonctionne sans vous connecter à un compte : vous jouez en invité. Si vous vous connectez, votre progression passe sur votre compte et suit ce compte d'un appareil à l'autre, sur iPhone, iPad et Android. Cerebrum conserve aussi le profil de base que votre fournisseur de connexion partage, comme votre nom et votre e-mail. L'app recueille par ailleurs des statistiques d'usage et des rapports de plantage. Les pubs viennent de Google AdMob. Là où la loi l'exige, le formulaire de consentement de Google recueille d'abord votre choix, sur iPhone, iPad et Android ; sur iPhone et iPad, la demande de suivi d'Apple vient ensuite. Un refus ne bloque jamais un jeu. Ce n'est qu'un résumé, pas la liste complète de ce qui est collecté : la politique de confidentialité fait foi.",
      cta: "Lire la politique de confidentialité",
    },
  },
  faq: {
    title: "Questions fréquentes",
    items: [
      {
        question: "Qui édite Cerebrum ?",
        answer: DISAMBIGUATION_FR,
      },
      {
        question: "Cerebrum est-il gratuit ?",
        answer:
          "Oui. Cerebrum se télécharge gratuitement et tous les jeux se jouent sans payer : aucun jeu ni aucune difficulté n'est réservé à un achat. La version gratuite vit de la publicité, et l'abonnement Premium, facultatif, retire les pubs imposées.",
      },
      {
        question: "Y a-t-il de la publicité dans Cerebrum ?",
        answer:
          "Dans la version gratuite, oui : une bannière pendant la partie et des pubs entre certaines parties. Les pubs récompensées sont toujours facultatives, pour des gemmes, un indice ou une seconde chance. Premium retire la bannière et les pubs entre les parties : c'est zéro pub imposée.",
      },
      {
        question: "Peut-on jouer à Cerebrum sans connexion ?",
        answer:
          "Oui. Toutes les grilles sont déjà dans l'app : chaque jeu fonctionne sans réseau, défi du jour et série compris. Si vous êtes connecté à un compte, votre progression se synchronise au retour en ligne. Les pubs, la connexion à un compte et les achats, eux, demandent du réseau.",
      },
      {
        question: "Sur quels appareils fonctionne Cerebrum ?",
        answer:
          "Sur iPhone et iPad à partir d'iOS 17.0, et sur Android à partir d'Android 8.0.",
      },
      {
        question: "Dans quelles langues Cerebrum est-il disponible ?",
        answer:
          "L'app existe en anglais, français, espagnol, portugais (Brésil), allemand, italien, néerlandais, turc, indonésien, vietnamien, japonais, coréen, chinois (simplifié et traditionnel), hindi et thaï. Les grilles de Mots Croisés et de Mots Mêlés n'existent qu'en français et en anglais. Dans les 14 autres langues, ces deux jeux et leurs packs de thèmes sont masqués.",
      },
      {
        question: "Comment supprimer mon compte Cerebrum ?",
        answer:
          "Si vous êtes connecté à un compte, ouvrez Profil, puis Supprimer le compte (une connexion est nécessaire). Votre compte et les données personnelles qui y sont liées sont alors supprimés de nos serveurs. En mode invité sur iPhone ou iPad, ce bouton n'existe pas : la politique de confidentialité explique comment demander la suppression.",
        link: {
          label:
            "La suppression de compte dans la politique de confidentialité",
          page: "privacy",
          hash: "account-deletion",
        },
      },
    ],
  },
  gamePage: {
    relatedTitle: "Autres jeux de Cerebrum",
    difficultyColumns: { difficulty: "Difficulté", detail: "Ce que ça change" },
    difficulties: {
      easy: "Facile",
      medium: "Moyen",
      hard: "Difficile",
      elite: "Élite",
    },
  },
  games: gamesFr,
};
