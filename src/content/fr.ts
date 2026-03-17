import type { Dictionary } from "./types";

const fr: Dictionary = {
  common: {
    siteName: "Synapgeek",
    tagline: "Studio indie de jeux mobiles",
    nav: {
      home: "Accueil",
      privacy: "Confidentialité",
      terms: "CGU",
    },
    footer: {
      copyright: `© ${new Date().getFullYear()} Synapgeek. Tous droits réservés.`,
      privacy: "Politique de confidentialité",
      terms: "Conditions d'utilisation",
      contact: "Contact",
    },
    languageSwitch: "English",
    languageSwitchLocale: "en",
  },
  landing: {
    hero: {
      badge: "Bientôt sur iOS & Android",
      title: "Entraînez votre cerveau, un puzzle à la fois",
      subtitle:
        "Cerebrum réunit Sudoku, Mots-Croisés, Mots-Mêlés et Cross Math dans une seule app conçue pour stimuler votre esprit au quotidien.",
      cta: "Télécharger Cerebrum",
      ctaSecondary: "Découvrir",
      comingSoon: "Bientôt disponible",
      waitlist: {
        placeholder: "Votre email",
        button: "Me notifier",
        success: "Vous serez notifié du lancement !",
        error: "Une erreur est survenue. Réessayez.",
        platformIos: "iOS",
        platformAndroid: "Android",
        platformBoth: "Les deux",
      },
    },
    stats: {
      items: [
        { value: "4", label: "Jeux en 1" },
        { value: "1000+", label: "Puzzles" },
        { value: "FR & EN", label: "Langues" },
        { value: "Gratuit", label: "Téléchargement" },
      ],
    },
    features: {
      title: "Un cerveau, quatre disciplines",
      subtitle:
        "Chaque jeu stimule des compétences cognitives différentes. Combinez-les pour un entraînement complet.",
      items: [
        {
          title: "Sudoku",
          description:
            "Logique pure et raisonnement déductif. Des grilles de tous niveaux, du débutant à l'expert, avec des indices intelligents.",
        },
        {
          title: "Mots-Croisés",
          description:
            "Enrichissez votre vocabulaire et votre culture générale. Des grilles originales mises à jour régulièrement.",
        },
        {
          title: "Mots-Mêlés",
          description:
            "Retrouvez les mots cachés dans la grille. Un classique des jeux de lettres pour entraîner votre sens de l'observation.",
        },
        {
          title: "Cross Math",
          description:
            "Des équations croisées qui mêlent calcul et logique. Le défi parfait pour les esprits mathématiques.",
        },
      ],
    },
    about: {
      title: "Construit par des passionnés",
      description:
        "Synapgeek est un studio indie français passionné de jeux mobiles. Nous croyons que les meilleurs jeux sont ceux qui allient élégance, challenge et plaisir.",
      values: [
        {
          title: "Qualité avant quantité",
          description:
            "Chaque puzzle est conçu avec soin. Pas de contenu généré en masse.",
        },
        {
          title: "Respect de votre vie privée",
          description:
            "Vos données vous appartiennent. Pas de tracking invasif.",
        },
        {
          title: "Fait en France",
          description: "Conçu et développé à Paris avec passion.",
        },
      ],
    },
    cta: {
      title: "Prêt à entraîner votre cerveau ?",
      subtitle:
        "Cerebrum arrive bientôt. Quatre jeux de puzzle dans une seule app.",
      cta: "Télécharger gratuitement",
      note: "Gratuit avec achats optionnels dans l'app.",
      comingSoon: "Bientôt disponible",
      waitlist: {
        placeholder: "Votre email",
        button: "Me notifier",
        success: "Vous serez notifié du lancement !",
        error: "Une erreur est survenue. Réessayez.",
        platformIos: "iOS",
        platformAndroid: "Android",
        platformBoth: "Les deux",
      },
    },
    contact: {
      title: "Une question ?",
      subtitle: "N'hésitez pas à nous écrire, nous vous répondrons dans les plus brefs délais.",
    },
  },
  privacy: {
    title: "Politique de confidentialité",
    lastUpdated: "Dernière mise à jour : 15 mars 2026",
    sections: [
      {
        title: "Qui sommes-nous",
        content:
          "Synapgeek est un studio indie basé en France, développant des applications mobiles de jeux de réflexion. La présente politique de confidentialité s'applique à toutes les applications et services Synapgeek, y compris Cerebrum (ci-après « l'Application »).\n\nPour toute question relative à la protection de vos données, vous pouvez nous contacter à : privacy@synapgeek.com",
      },
      {
        title: "Données collectées et sources",
        content:
          "Nous collectons les catégories de données suivantes :\n\n**Données de compte**\nSi vous créez un compte via Apple, Google, Facebook ou par email : identifiant unique, adresse email, nom d'affichage et photo de profil (selon le fournisseur). Vous pouvez également utiliser l'Application sans compte (mode anonyme).\n\n**Données de jeu et de progression**\nScores, temps de complétion, indices utilisés, erreurs, étoiles obtenues, niveaux complétés, niveau de difficulté, tentatives, meilleurs records, défis quotidiens, séries de jeu (streaks).\n\n**Données de monnaie virtuelle et de personnalisation**\nSolde de pièces, historique de transactions in-app, avatars débloqués, trophées mensuels, points d'expérience (XP), ligue/classement.\n\n**Données d'appareil et d'utilisation**\nType d'appareil, version du système d'exploitation, langue, données d'utilisation anonymisées, diagnostics, journaux d'erreur, données de performance applicative.\n\n**Données publicitaires**\nIdentifiant publicitaire (IDFA, avec votre consentement via App Tracking Transparency), interactions avec les publicités, données d'attribution via SKAdNetwork.\n\n**Données de transaction**\nHistorique des achats in-app et abonnements, traités par Apple via StoreKit 2. Synapgeek ne collecte ni ne stocke vos informations de paiement.\n\n**Données que nous ne collectons PAS**\nNous ne collectons aucune donnée de géolocalisation, de santé, de contacts, de photos, de caméra, de calendrier ni de microphone.",
      },
      {
        title: "Base légale du traitement",
        content:
          "Conformément au Règlement Général sur la Protection des Données (RGPD), nous traitons vos données sur les bases légales suivantes :\n\n- **Exécution du contrat** : traitement nécessaire à la fourniture du service (compte, progression, achats, synchronisation)\n- **Consentement** : publicités personnalisées, identifiant publicitaire (IDFA), cookies et technologies de suivi non essentiels\n- **Intérêt légitime** : analytics de première partie, amélioration de l'Application, détection de fraude, sécurité\n\nVous pouvez retirer votre consentement à tout moment via les paramètres de confidentialité de l'Application ou les réglages de votre appareil.",
      },
      {
        title: "Finalités du traitement",
        content:
          "Vos données sont utilisées pour :\n\n- Fournir, maintenir et améliorer l'Application et ses fonctionnalités\n- Synchroniser votre progression entre appareils (si vous êtes connecté)\n- Gérer votre compte et vos préférences\n- Traiter vos achats in-app et abonnements\n- Afficher des publicités (personnalisées avec consentement, ou contextuelles)\n- Analyser l'utilisation agrégée pour améliorer l'expérience utilisateur\n- Détecter et prévenir les abus, la fraude et les problèmes techniques\n- Gérer les classements et le système de ligue",
      },
      {
        title: "Publicités et technologies de suivi",
        content:
          "L'Application affiche des publicités fournies par Google AdMob. Les utilisateurs disposant d'un abonnement ou d'un achat « sans publicité » ne voient pas de publicités.\n\n**Consentement publicitaire (EEE/Royaume-Uni/Suisse)**\nPour les utilisateurs situés dans l'Espace Économique Européen, au Royaume-Uni et en Suisse, une plateforme de gestion du consentement (CMP) est affichée au premier lancement. Vous pouvez modifier vos préférences à tout moment via les paramètres de confidentialité de l'Application.\n\n**App Tracking Transparency (ATT)**\nSur iOS 14.5 et ultérieur, l'Application demande votre autorisation avant d'accéder à votre identifiant publicitaire (IDFA). Si vous refusez, seules des publicités contextuelles (non personnalisées) sont affichées. Le refus du suivi n'affecte aucune fonctionnalité de l'Application.\n\n**SKAdNetwork**\nL'Application utilise le framework SKAdNetwork d'Apple pour l'attribution publicitaire. Ce mécanisme ne permet pas de vous identifier personnellement.\n\n**Désactivation des publicités personnalisées**\nVous pouvez désactiver les publicités personnalisées à tout moment via :\n- Les paramètres de confidentialité dans l'Application\n- Réglages iOS > Confidentialité et sécurité > Suivi\n- L'achat d'un abonnement ou d'un forfait sans publicité",
      },
      {
        title: "Partage avec des tiers",
        content:
          "Vos données peuvent être partagées avec les partenaires techniques suivants, dans le cadre strict des finalités décrites ci-dessus :\n\n- **Google (Firebase Analytics, Firebase Crashlytics, Firebase Performance, Firebase Firestore, Firebase Auth, AdMob)** — pour l'analyse, le stockage de données, l'authentification, le monitoring et la publicité. Politique de confidentialité : https://policies.google.com/privacy\n- **Apple (StoreKit 2, Sign in with Apple, SKAdNetwork)** — pour les achats in-app, l'authentification et l'attribution publicitaire. Politique de confidentialité : https://www.apple.com/legal/privacy/\n- **Meta (Facebook SDK)** — pour l'authentification via Facebook. Politique de confidentialité : https://www.facebook.com/privacy/policy/\n\nNous ne vendons pas vos données personnelles. Nous ne partageons pas vos données avec des systèmes d'intelligence artificielle tiers à des fins d'entraînement de modèles.",
      },
      {
        title: "Transferts internationaux de données",
        content:
          "Certains de nos partenaires techniques (Google, Meta, Apple) traitent des données en dehors de l'Espace Économique Européen, notamment aux États-Unis. Ces transferts sont encadrés par des clauses contractuelles types approuvées par la Commission européenne, conformément aux articles 46 et 49 du RGPD, afin de garantir un niveau de protection adéquat de vos données.",
      },
      {
        title: "Conservation des données",
        content:
          "Nous conservons vos données selon les durées suivantes :\n\n- **Données analytiques** : 14 mois maximum (politique par défaut de Firebase Analytics)\n- **Données de compte et de progression** : tant que votre compte est actif\n- **Données de transaction** : conformément aux obligations légales applicables (jusqu'à 10 ans pour les obligations comptables)\n- **Journaux d'erreur (Crashlytics)** : 90 jours\n\nAprès suppression de votre compte, toutes vos données personnelles sont supprimées de nos serveurs. Certaines données agrégées et anonymisées peuvent être conservées à des fins statistiques.",
      },
      {
        title: "Sécurité des données",
        content:
          "Nous mettons en place les mesures techniques suivantes pour protéger vos données :\n\n- Chiffrement des données en transit (HTTPS/TLS)\n- Règles de sécurité Firebase (accès limité à l'utilisateur authentifié)\n- Authentification sécurisée via les protocoles OAuth 2.0 et nonce pour Apple Sign-In\n- Stockage local chiffré sur l'appareil\n\nAucun système n'est infaillible. En cas de violation de données affectant vos droits, nous vous en informerons conformément aux délais légaux applicables.",
      },
      {
        title: "Limite d'âge",
        content:
          "L'Application est destinée à un public âgé de 13 ans et plus. Nous ne collectons pas sciemment de données personnelles de personnes de moins de 13 ans.\n\nSi vous êtes un parent ou tuteur et que vous découvrez que votre enfant de moins de 13 ans nous a fourni des données personnelles, contactez-nous à privacy@synapgeek.com. Nous supprimerons ces données dans les meilleurs délais.",
      },
      {
        title: "Vos droits",
        content:
          "**Droits au titre du RGPD (UE/EEE)**\nConformément au RGPD, vous disposez des droits suivants :\n\n- **Accès** : demander une copie de vos données personnelles\n- **Rectification** : corriger vos données inexactes ou incomplètes\n- **Suppression** : demander l'effacement de vos données\n- **Limitation** : demander la limitation du traitement\n- **Opposition** : vous opposer au traitement fondé sur l'intérêt légitime\n- **Portabilité** : recevoir vos données dans un format structuré et lisible par machine\n- **Révocation du consentement** : retirer votre consentement à tout moment\n\nVous avez également le droit d'introduire une réclamation auprès d'une autorité de contrôle (en France : la CNIL — www.cnil.fr).\n\n**Droits au titre de la CCPA/CPRA (Californie, États-Unis)**\nSi vous résidez en Californie, vous disposez des droits suivants :\n- Droit de connaître les données collectées et leur utilisation\n- Droit de demander la suppression de vos données\n- Droit de refuser la « vente » ou le « partage » de vos données (nous ne vendons pas vos données)\n- Droit à la non-discrimination pour l'exercice de vos droits\n\n**Suppression de compte**\nVous pouvez supprimer votre compte directement dans l'Application via Profil > Supprimer le compte. Cette action est irréversible et entraîne la suppression de toutes vos données personnelles (progression, achats, avatars, classements).\n\n**Exercer vos droits**\nPour exercer l'un de ces droits, contactez-nous à : privacy@synapgeek.com. Nous répondrons dans un délai de 30 jours.",
      },
      {
        title: "Modifications de cette politique",
        content:
          "Nous pouvons mettre à jour cette politique de confidentialité périodiquement. En cas de modification substantielle, la date de mise à jour en haut de cette page sera actualisée. Nous vous encourageons à consulter régulièrement cette page. La poursuite de l'utilisation de l'Application après toute modification vaut acceptation de la politique révisée.",
      },
      {
        title: "Contact",
        content:
          "Pour toute question relative à cette politique de confidentialité ou à vos données personnelles :\n\n**Synapgeek**\nEmail : privacy@synapgeek.com\nSite web : https://synapgeek.com",
      },
    ],
  },
  terms: {
    title: "Conditions Générales d'Utilisation",
    lastUpdated: "Dernière mise à jour : 15 mars 2026",
    sections: [
      {
        title: "Acceptation des conditions",
        content:
          "En téléchargeant, installant ou utilisant les applications Synapgeek (ci-après « l'Application »), vous acceptez les présentes Conditions Générales d'Utilisation (ci-après « les Conditions »). Si vous n'acceptez pas ces Conditions, veuillez ne pas utiliser l'Application.\n\nL'Application est destinée aux utilisateurs âgés de 13 ans et plus. Si vous avez entre 13 et 18 ans, votre parent ou tuteur légal doit lire et accepter ces Conditions en votre nom.",
      },
      {
        title: "Description du service",
        content:
          "Synapgeek développe et distribue des applications mobiles de jeux de réflexion. Cerebrum est une application iOS réunissant quatre jeux de puzzle : Sudoku, Mots-Croisés, Mots-Mêlés et Cross Math.\n\nL'Application propose notamment :\n- Des centaines de puzzles avec plusieurs niveaux de difficulté\n- Un système de progression avec étoiles, XP et classements\n- Des défis quotidiens et des séries de jeu (streaks)\n- Un système de monnaie virtuelle (pièces) et d'avatars\n- Des achats in-app et des abonnements optionnels\n- Un mode avec ou sans publicité",
      },
      {
        title: "Licence d'utilisation",
        content:
          "L'Application vous est concédée sous licence, et non vendue. Synapgeek vous accorde une licence personnelle, limitée, non exclusive, non transférable et révocable pour utiliser l'Application sur tout appareil Apple que vous possédez ou contrôlez, conformément aux règles d'utilisation de l'App Store.\n\nVous vous engagez à ne pas :\n- Copier, modifier, décompiler ou désassembler l'Application\n- Distribuer, louer, prêter ou sous-licencier l'Application\n- Utiliser l'Application à des fins commerciales non autorisées\n- Tenter de contourner les mesures de sécurité ou les restrictions techniques\n- Extraire ou collecter des données de l'Application par des moyens automatisés (scraping, data mining, robots)",
      },
      {
        title: "Compte utilisateur",
        content:
          "Vous pouvez utiliser l'Application sans créer de compte (mode anonyme). Si vous choisissez de créer un compte via Apple, Google, Facebook ou par email, vous êtes responsable de la confidentialité de vos identifiants.\n\nLa création d'un compte permet la synchronisation de votre progression entre appareils et la participation aux classements. Vous ne pouvez détenir qu'un seul compte actif.",
      },
      {
        title: "Achats intégrés et abonnements",
        content:
          "L'Application propose des achats intégrés (in-app purchases) et des abonnements optionnels. Tous les achats sont traités exclusivement par Apple via StoreKit 2.\n\n**Achats consommables**\nDes packs de pièces (monnaie virtuelle) peuvent être achetés. Les pièces sont utilisables dans l'Application pour débloquer des indices, des avatars et d'autres fonctionnalités.\n\n**Achats non consommables**\nCertains achats sont permanents, comme le forfait « Sans publicité à vie » ou le « Premium à vie ».\n\n**Abonnements**\nDes abonnements mensuels et annuels sont disponibles (Sans publicité, Premium). Les abonnements se renouvellent automatiquement sauf annulation au moins 24 heures avant la fin de la période en cours. La gestion et l'annulation des abonnements s'effectuent via les réglages de votre compte Apple.\n\n**Remboursements**\nTous les achats sont soumis aux conditions de remboursement d'Apple. Pour demander un remboursement, veuillez contacter Apple directement via https://reportaproblem.apple.com.\n\nLes prix sont affichés dans l'Application avant tout achat et peuvent varier selon le pays.",
      },
      {
        title: "Biens virtuels",
        content:
          "L'Application contient des biens virtuels, incluant des pièces (monnaie virtuelle), des avatars, des trophées et des points d'expérience (XP).\n\nLes biens virtuels :\n- N'ont aucune valeur monétaire en dehors de l'Application\n- Ne sont ni transférables, ni échangeables, ni remboursables (sauf obligation légale)\n- Peuvent être obtenus par le jeu, le visionnage de publicités ou l'achat in-app\n- Sont liés à votre compte et ne peuvent être transférés à un autre utilisateur\n\nSynapgeek se réserve le droit de modifier les prix, la disponibilité ou la fonctionnalité des biens virtuels à tout moment.",
      },
      {
        title: "Publicités",
        content:
          "L'Application affiche des publicités fournies par Google AdMob. Les publicités peuvent inclure des bannières, des interstitiels, des publicités récompensées (que vous choisissez de visionner) et des publicités à l'ouverture de l'application.\n\nVous pouvez supprimer les publicités en souscrivant à un abonnement « Sans publicité » ou en effectuant l'achat « Sans publicité à vie ». Les publicités récompensées restent accessibles optionnellement même pour les utilisateurs sans publicité.",
      },
      {
        title: "Propriété intellectuelle",
        content:
          "L'ensemble du contenu de l'Application — incluant mais non limité aux textes, graphismes, logos, icônes, images, grilles de puzzles, sons, interfaces, code source et documentation — est la propriété exclusive de Synapgeek et est protégé par les lois françaises et internationales sur la propriété intellectuelle.\n\nToute reproduction, distribution, modification, adaptation ou utilisation non autorisée est strictement interdite.\n\nIl est interdit d'utiliser le contenu de l'Application pour l'entraînement de modèles d'intelligence artificielle ou d'apprentissage automatique, la capture systématique d'écrans, le data mining ou le web scraping.",
      },
      {
        title: "Règles de conduite",
        content:
          "En utilisant l'Application, vous vous engagez à ne pas :\n\n- Utiliser l'Application d'une manière contraire aux lois applicables\n- Tenter de manipuler les classements, scores ou systèmes de progression\n- Exploiter des bugs ou failles pour obtenir un avantage déloyal\n- Créer de faux comptes ou usurper l'identité d'un tiers\n- Interférer avec le fonctionnement normal de l'Application ou de ses serveurs\n\nSynapgeek se réserve le droit de suspendre ou supprimer tout compte en violation de ces règles, sans préavis ni compensation.",
      },
      {
        title: "Limitation de responsabilité",
        content:
          "L'Application est fournie « en l'état » et « selon disponibilité ». Synapgeek ne garantit pas que l'Application fonctionnera sans interruption, sans erreur, ou que les défauts seront corrigés.\n\nDans les limites autorisées par la loi, Synapgeek ne pourra être tenu responsable :\n- De tout dommage indirect, accessoire, spécial ou consécutif\n- De la perte de données, de progression ou de biens virtuels\n- De toute interruption de service ou indisponibilité de l'Application\n\nLa responsabilité totale cumulée de Synapgeek est limitée au montant que vous avez effectivement payé pour l'Application au cours des 12 mois précédant la réclamation.",
      },
      {
        title: "Résiliation et suppression de compte",
        content:
          "Vous pouvez cesser d'utiliser l'Application à tout moment en la désinstallant.\n\nVous pouvez supprimer votre compte à tout moment via Profil > Supprimer le compte dans l'Application. La suppression est irréversible et entraîne la perte définitive de toutes vos données : progression, pièces, avatars, trophées et classements.\n\nSynapgeek se réserve le droit de résilier ou suspendre votre accès en cas de violation des présentes Conditions.\n\nLes sections relatives à la propriété intellectuelle, la limitation de responsabilité et le droit applicable survivent à toute résiliation.",
      },
      {
        title: "Notice pour les utilisateurs d'appareils Apple",
        content:
          "Les présentes Conditions constituent un accord entre vous et Synapgeek, et non avec Apple. Synapgeek, et non Apple, est seul responsable de l'Application et de son contenu.\n\nApple n'a aucune obligation de fournir des services de maintenance ou d'assistance pour l'Application.\n\nEn cas de non-conformité de l'Application à toute garantie applicable, vous pouvez en informer Apple, qui pourra vous rembourser le prix d'achat le cas échéant. Apple n'a aucune autre obligation de garantie.\n\nApple n'est pas responsable du traitement des réclamations vous concernant ou concernant votre utilisation de l'Application.\n\nApple et ses filiales sont tiers bénéficiaires des présentes Conditions et peuvent les faire exécuter à votre encontre.\n\nVous déclarez ne pas vous trouver dans un pays soumis à un embargo du gouvernement américain, ni être inscrit sur une liste de personnes sanctionnées.",
      },
      {
        title: "Droit applicable et litiges",
        content:
          "Les présentes Conditions sont régies par le droit français, sans égard à ses dispositions en matière de conflit de lois.\n\nTout litige relatif aux présentes Conditions sera soumis à la compétence exclusive des tribunaux compétents de Paris, France.\n\nSi une disposition des présentes Conditions est jugée invalide ou inapplicable, les autres dispositions resteront pleinement en vigueur.",
      },
      {
        title: "Modifications des conditions",
        content:
          "Synapgeek se réserve le droit de modifier les présentes Conditions à tout moment. En cas de modification substantielle, la date de mise à jour en haut de ce document sera actualisée.\n\nLa poursuite de l'utilisation de l'Application après toute modification vaut acceptation des Conditions révisées.",
      },
      {
        title: "Contact",
        content:
          "Pour toute question relative aux présentes Conditions :\n\n**Synapgeek**\nEmail : contact@synapgeek.com\nSite web : https://synapgeek.com",
      },
    ],
  },
};

export default fr;
