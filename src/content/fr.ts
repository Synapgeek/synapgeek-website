import type { Dictionary } from "./types";

const fr: Dictionary = {
  common: {
    siteName: "Synapgeek",
    tagline: "Studio indépendant d'applications mobiles",
    nav: {
      games: "Jeux",
      cerebrum: "Cerebrum",
      about: "À propos",
      press: "Presse",
    },
    footer: {
      copyright: `© ${new Date().getFullYear()} Synapgeek. Tous droits réservés.`,
      identity: "Synapgeek SAS, studio indépendant français.",
      productHeading: "Cerebrum",
      studioHeading: "Studio",
      legalHeading: "Légal",
      privacy: "Politique de confidentialité",
      terms: "Conditions d'utilisation",
      legalNotice: "Mentions légales",
      contact: "Contact",
      manageCookies: "Gérer mes cookies",
    },
    consent: {
      title: "Votre choix sur la mesure d'audience",
      body: "Nous utilisons Google Analytics (cookies de mesure d'audience) pour comprendre comment ce site est utilisé. Selon votre pays, cette mesure attend votre accord ou est active par défaut : acceptez-la ou refusez-la ici, et changez d'avis à tout moment via « Gérer mes cookies ». Ce site n'affiche aucune publicité.",
      learnMore: "Lire la politique de confidentialité",
      accept: "Accepter",
      refuse: "Refuser",
    },
    languageSwitch: "English",
    languageSwitchLocale: "en",
    a11y: {
      skipToContent: "Aller au contenu",
      menu: "Menu",
      mainNavigation: "Navigation principale",
      footerNavigation: "Pied de page",
    },
    breadcrumb: {
      label: "Fil d'Ariane",
      home: "Accueil",
    },
    updatedOn: "Mis à jour le",
    publisher: {
      legalName: "Raison sociale",
      legalForm: "Forme juridique",
      legalFormValue: "Société par actions simplifiée (SAS)",
      capital: "Capital social",
      country: "Pays",
      siret: "SIRET",
      ape: "Code APE",
      vat: "TVA intracommunautaire",
      publicationDirector: "Directeur de la publication",
      host: "Hébergeur",
      email: "Email",
    },

    languageSuggestion: {
      message: "Ce site est aussi disponible en français.",
      cta: "Lire en français",
      dismiss: "Fermer",
    },
    notFound: {
      title: "Page introuvable",
      body: "La page que vous cherchez n'existe pas ou a été déplacée.",
      cta: "Retour à l'accueil",
    },
    stores: {
      appStoreLabel: "Télécharger dans l'App Store",
      googlePlayLabel: "Disponible sur Google Play",
    },
    gameGet: {
      title: "Télécharger Cerebrum",
      model:
        "Téléchargement gratuit, avec une bannière pendant la partie et des pubs entre certaines parties. Les pubs récompensées restent toujours facultatives. Avec Premium (hebdomadaire, mensuel ou annuel, souscrit dans chaque boutique), zéro pub imposée et des avantages en plus.",
      premiumLink: "Ce que Premium apporte",
    },
    gameDaily: {
      line: "Défi du jour : si vous choisissez ce jeu, l'app tire la grille du jour en difficulté {difficulties}, la même pour tous.",
      lineByLanguage:
        "Défi du jour : si vous choisissez ce jeu, l'app tire la grille du jour en difficulté {difficulties}, la même pour tous ceux qui jouent dans la même langue, français ou anglais.",
    },
    contactForm: {
      name: "Nom",
      email: "Email",
      message: "Message",
      topicLabel: "Sujet",
      topicPlaceholder: "Choisissez un sujet",
      topics: [
        { value: "support", label: "Problème technique ou bug" },
        { value: "purchases", label: "Achats, abonnements, remboursement" },
        { value: "account", label: "Compte et données personnelles" },
        { value: "feedback", label: "Suggestion ou retour sur un jeu" },
        { value: "press", label: "Presse et partenariats" },
        { value: "other", label: "Autre" },
      ],
      submit: "Envoyer le message",
      sending: "Envoi en cours...",
      successTitle: "Message envoyé !",
      successBody: "Nous vous répondrons dans les plus brefs délais.",
      error:
        "Une erreur est survenue. Réessayez ou contactez-nous directement.",
      unavailable:
        "Le formulaire est momentanément indisponible. Écrivez-nous directement à contact@synapgeek.com.",
    },
  },
  privacy: {
    title: "Politique de confidentialité",
    metaDescription:
      "Politique de confidentialité des apps et services Synapgeek : données collectées, droits RGPD, publicités et cookies.",
    lastUpdated: "Dernière mise à jour : 12 septembre 2026",
    updatedAt: "2026-09-12",
    sections: [
      {
        title: "Qui sommes-nous",
        content:
          "Synapgeek est un studio indie basé en France, développant des applications mobiles de jeux de réflexion. La présente politique de confidentialité s'applique à toutes les applications et services Synapgeek, y compris Cerebrum (ci-après « l'Application »).\n\nPour toute question relative à la protection de vos données, vous pouvez nous contacter à : privacy@synapgeek.com",
      },
      {
        title: "Données collectées et sources",
        content:
          "Nous collectons les catégories de données suivantes :\n\n**Données de compte**\nSi vous créez un compte via Apple, Google ou Facebook : identifiant unique, adresse email, nom d'affichage et photo de profil (selon le fournisseur). Vous pouvez également utiliser l'Application sans compte (mode anonyme).\n\n**Données de jeu et de progression**\nScores, temps de complétion, indices utilisés, erreurs, étoiles obtenues, niveaux complétés, niveau de difficulté, tentatives, meilleurs records, défis quotidiens, séries de jeu (streaks).\n\n**Données de monnaie virtuelle et de personnalisation**\nSolde de gemmes, historique de transactions in-app, avatars débloqués, trophées mensuels, points d'expérience (XP), ligue/classement.\n\n**Données d'appareil et d'utilisation**\nType d'appareil, version du système d'exploitation, langue, données d'utilisation anonymisées, diagnostics, journaux d'erreur, données de performance applicative.\n\n**Données de notification**\nPour vous envoyer des notifications et mettre à jour les Live Activities sur iOS, nous associons à votre appareil : le jeton FCM (Firebase Cloud Messaging), les jetons ActivityKit (démarrage et mise à jour des Live Activities) sur iOS, votre fuseau horaire, votre langue, la version de l'Application, l'état d'activation des Live Activities, ainsi que la plateforme (iOS ou Android). Sur Android, cette fonctionnalité repose sur l'autorisation de notifications et Firebase Cloud Messaging. Ces données sont supprimées avec votre compte.\n\n**Données publicitaires**\nIdentifiant publicitaire (IDFA sur iOS, avec votre consentement via App Tracking Transparency ; AAID sur Android, voir la section « Publicités et technologies de suivi »), interactions avec les publicités, événements de conversion, données d'attribution via SKAdNetwork sur iOS. Notre régie publicitaire (Google AdMob) déduit également une localisation approximative à partir de votre adresse IP à des fins de ciblage publicitaire, et notre plateforme de gestion du consentement (CMP) utilise cette localisation approximative pour déterminer si vous vous trouvez dans l'Espace Économique Européen, au Royaume-Uni ou en Suisse.\n\n**Données de transaction**\nHistorique des achats in-app et abonnements, traités par Apple via StoreKit 2 sur iOS et par Google Play Billing sur Android. Synapgeek ne collecte ni ne stocke vos informations de paiement.\n\n**Données que nous ne collectons PAS**\nL'Application ne demande jamais l'accès à votre position et n'utilise aucune donnée GPS. Une localisation approximative est toutefois déduite de votre adresse IP par notre régie publicitaire, comme décrit dans « Données publicitaires » ci-dessus et « Publicités et technologies de suivi » ci-dessous. Nous ne collectons par ailleurs aucune donnée de santé, de contacts, de photos, de caméra, de calendrier ni de microphone.",
      },
      {
        title: "Base légale du traitement",
        content:
          "Conformément au Règlement Général sur la Protection des Données (RGPD), nous traitons vos données sur les bases légales suivantes.\n\n**Concernant l'Application.** Nous nous appuyons sur l'exécution du contrat pour le traitement nécessaire à la fourniture du service (compte, progression, achats, synchronisation), sur votre consentement pour les publicités personnalisées, l'identifiant publicitaire (IDFA sur iOS, AAID sur Android) et les cookies et technologies de suivi non essentiels, ainsi que sur notre intérêt légitime pour les analytics de première partie, l'amélioration de l'Application, la détection de fraude et la sécurité.\n\n**Concernant le site synapgeek.com.** Nous nous appuyons sur votre consentement pour la mesure d'audience Google Analytics 4, là où votre accord est requis (voir la section « Site web synapgeek.com »), sur notre intérêt légitime pour la mesure sans cookie de la fréquentation et des performances via Vercel Analytics et Vercel Speed Insights, la protection du formulaire de contact par reCAPTCHA, et la mesure d'audience Google Analytics 4 active par défaut en dehors des zones où votre accord est requis — vous pouvez vous y opposer à tout moment via le bandeau de consentement ou « Gérer mes cookies » —, ainsi que sur les mesures précontractuelles ou l'intérêt légitime, selon l'objet de votre message, pour le traitement des messages envoyés via le formulaire de contact, afin de vous répondre.\n\nVous pouvez retirer votre consentement à tout moment via les paramètres de confidentialité de l'Application, les réglages de votre appareil ou, pour le site, le bandeau accessible via « Gérer mes cookies ».",
      },
      {
        title: "Finalités du traitement",
        content:
          "Vos données sont utilisées pour :\n\n- Fournir, maintenir et améliorer l'Application et ses fonctionnalités\n- Synchroniser votre progression entre appareils (si vous êtes connecté)\n- Gérer votre compte et vos préférences\n- Traiter vos achats in-app et abonnements\n- Afficher des publicités (personnalisées avec consentement, ou contextuelles)\n- Mesurer l'efficacité de nos campagnes publicitaires (mesure de conversions, avec votre consentement)\n- Analyser l'utilisation agrégée pour améliorer l'expérience utilisateur\n- Détecter et prévenir les abus, la fraude et les problèmes techniques\n- Gérer les classements et le système de ligue",
      },
      {
        title: "Publicités et technologies de suivi",
        content:
          "L'Application affiche des publicités fournies par Google AdMob. Les utilisateurs disposant d'un abonnement Premium, ou d'un ancien abonnement « Sans publicité », ne voient pas de publicités imposées (bannières et interstitiels) ; les publicités récompensées restent disponibles s'ils choisissent de les regarder.\n\n**Consentement publicitaire (EEE/Royaume-Uni/Suisse)**\nPour les utilisateurs situés dans l'Espace Économique Européen, au Royaume-Uni et en Suisse, une plateforme de gestion du consentement (CMP) est affichée au premier lancement. Vous pouvez modifier vos préférences à tout moment via les paramètres de confidentialité de l'Application.\n\n**App Tracking Transparency (ATT)**\nSur iOS 14.5 et ultérieur, l'Application demande votre autorisation avant d'accéder à votre identifiant publicitaire (IDFA). Si vous refusez, les publicités ne sont pas personnalisées à partir de votre identifiant publicitaire. Le refus du suivi n'affecte aucune fonctionnalité de l'Application.\n\n**Identifiant publicitaire Android (AAID)**\nSur Android, l'Application peut accéder à votre identifiant publicitaire Google (AAID) pour afficher des publicités personnalisées — sous réserve, pour les utilisateurs de l'EEE, du Royaume-Uni et de la Suisse, du consentement recueilli via la plateforme de gestion du consentement décrite ci-dessus. Vous pouvez à tout moment réinitialiser cet identifiant ou refuser toute personnalisation depuis les réglages de votre appareil (voir « Désactivation des publicités personnalisées » ci-dessous). Ce refus n'affecte aucune fonctionnalité de l'Application.\n\n**SKAdNetwork (iOS uniquement)**\nSur iOS, l'Application utilise le framework SKAdNetwork d'Apple pour l'attribution publicitaire. Ce mécanisme ne permet pas de vous identifier personnellement.\n\n**Désactivation des publicités personnalisées**\nVous pouvez désactiver les publicités personnalisées à tout moment via :\n- Les paramètres de confidentialité dans l'Application\n- Réglages iOS > Confidentialité et sécurité > Suivi\n- Paramètres Android > Google > Annonces\n- L'abonnement Premium, qui retire les publicités imposées (bannières et interstitiels) — les publicités récompensées restent disponibles si vous choisissez de les regarder (voir les Conditions Générales d'Utilisation)",
      },
      {
        id: "website",
        title: "Site web synapgeek.com",
        content:
          "Cette section concerne le site synapgeek.com lui-même, distinct de l'Application décrite par ailleurs dans cette politique.\n\n**Compte**\nLe site ne propose ni création de compte ni connexion : sa consultation ne requiert ni email ni mot de passe.\n\n**Mesure d'audience Vercel**\nNous utilisons Vercel Analytics et Vercel Speed Insights pour mesurer la fréquentation et les performances du site. Ces outils ne déposent aucun cookie et ne produisent que des statistiques agrégées, sans identifiant individuel.\n\n**Google Analytics 4**\nNous utilisons Google Analytics 4 pour comprendre l'usage du site : pages consultées, sections de la page d'accueil affichées, changement de langue, clics vers l'App Store et Google Play, envoi du formulaire de contact (avec le sujet choisi). Un bandeau vous permet d'accepter ou de refuser cette mesure d'audience ; il reste affiché tant que vous n'avez pas fait de choix. Votre choix est ensuite mémorisé pendant 6 mois sous la forme d'un simple indicateur dans le stockage local de votre navigateur — jamais un cookie pour ce choix lui-même — et vous pouvez le modifier à tout moment via « Gérer mes cookies » dans le pied de page. Dans l'Espace Économique Européen, au Royaume-Uni, en Suisse, dans les régions ultrapériphériques de l'Union européenne et dans quelques territoires associés, le cookie de mesure (_ga et _ga_*, conservé 13 mois maximum) n'est déposé que si vous avez accepté ; en cas de refus, ou tant que vous n'avez pas répondu, aucun cookie de mesure n'est déposé. En dehors de ces territoires, la mesure est active par défaut sauf si vous refusez via ce même bandeau, avec le même cookie de mesure conservé 13 mois maximum. Quel que soit votre pays, tant que la mesure avec cookies n'est pas active — avant votre accord dans les territoires listés ci-dessus, ou après un refus où que vous soyez — des signaux de mesure sans cookie ni identifiant persistant (page consultée, action effectuée, horodatage, type de navigateur) peuvent néanmoins être envoyés à Google, qui reçoit à cette occasion votre adresse IP et utilise ces signaux de façon agrégée pour modéliser la fréquentation. Vous pouvez aussi vous opposer à cette mesure avec le module de désactivation de Google Analytics, un bloqueur de contenu, ou en écrivant à privacy@synapgeek.com. Module de désactivation de Google Analytics : https://tools.google.com/dlpage/gaoptout Le site n'affiche aucune publicité et n'utilise pas ces données à des fins publicitaires : les signaux de consentement publicitaire (ad_storage, ad_user_data, ad_personalization) restent refusés en toutes circonstances. Politique de confidentialité de Google : https://policies.google.com/privacy\n\n**Formulaire de contact**\nSi vous utilisez le formulaire de contact, nous collectons votre nom, votre adresse email, le sujet choisi et votre message, dans le seul but de vous répondre. Ces informations nous sont transmises par email via notre messagerie professionnelle et ne sont pas conservées dans une base de données distincte. Le formulaire est protégé par reCAPTCHA, un service de Google dont le script n'est chargé que lorsque vous interagissez avec le formulaire (clic, appui ou placement du curseur dans un champ).",
      },
      {
        title: "Partage avec des tiers",
        content:
          "Vos données peuvent être partagées avec les partenaires techniques suivants, dans le cadre strict des finalités décrites ci-dessus.\n\n**Concernant l'Application.** Nous partageons vos données avec Google (Firebase Analytics, Firebase Crashlytics, Firebase Performance, Firebase Firestore, Firebase Auth, Firebase Cloud Messaging, AdMob, Google Play Billing, Google Sign-In) pour l'analyse, le stockage de données, l'authentification, le monitoring, les notifications, la publicité et les achats intégrés sur Android : politique de confidentialité https://policies.google.com/privacy\n\nNous partageons également vos données avec Apple (Sign in with Apple ; StoreKit 2 et SKAdNetwork sur iOS) pour l'authentification sur iOS et Android, ainsi que pour les achats in-app et l'attribution publicitaire sur iOS : politique de confidentialité https://www.apple.com/legal/privacy/\n\nEnfin, nous partageons vos données avec Meta (Facebook SDK) pour l'authentification via Facebook et, sous réserve de votre consentement publicitaire, la mesure de conversions (ouverture de l'Application, achat, création de compte, premier puzzle terminé) : politique de confidentialité https://www.facebook.com/privacy/policy/\n\n**Concernant le site synapgeek.com.** Nous partageons des données avec Google (Google Analytics 4, reCAPTCHA) pour la mesure d'audience du site, selon le choix exprimé via le bandeau décrit dans la section « Site web synapgeek.com », et pour protéger le formulaire de contact contre les soumissions automatisées : politique de confidentialité https://policies.google.com/privacy\n\nNous partageons aussi des données avec Vercel Inc., notre hébergeur, qui traite les requêtes techniques nécessaires pour servir les pages du site, ainsi que Vercel Analytics et Vercel Speed Insights (mesure sans cookie de la fréquentation et des performances) : politique de confidentialité https://vercel.com/legal/privacy-policy\n\nNous ne vendons pas vos données personnelles. Nous ne partageons pas vos données avec des systèmes d'intelligence artificielle tiers à des fins d'entraînement de modèles.",
      },
      {
        title: "Transferts internationaux de données",
        content:
          "Certains de nos partenaires techniques (Google, Meta, Apple, Vercel Inc.) traitent des données en dehors de l'Espace Économique Européen, notamment aux États-Unis — c'est le cas de Vercel Inc., notre hébergeur, établi aux États-Unis. Ces transferts sont encadrés par des clauses contractuelles types approuvées par la Commission européenne, conformément aux articles 46 et 49 du RGPD, afin de garantir un niveau de protection adéquat de vos données.",
      },
      {
        title: "Conservation des données",
        content:
          "Nous conservons vos données selon les durées suivantes :\n\n- **Données analytiques** : 14 mois maximum\n- **Données de compte et de progression** : tant que votre compte est actif\n- **Données de transaction** : nous conservons un historique minimal de vos achats lié à votre compte (notamment l'identifiant du produit, le type et la date d'achat), tant que votre compte est actif. Les enregistrements de facturation et vos informations de paiement sont détenus exclusivement par Apple et Google Play en qualité de vendeurs ; nos obligations comptables portent sur leurs relevés agrégés, qui ne permettent pas de vous identifier\n- **Journaux d'erreur (Crashlytics)** : 90 jours\n\nAprès suppression de votre compte, toutes vos données personnelles sont supprimées de nos serveurs. Certaines données agrégées et anonymisées peuvent être conservées à des fins statistiques.",
      },
      {
        title: "Sécurité des données",
        content:
          "Nous mettons en place les mesures techniques suivantes pour protéger vos données :\n\n- Chiffrement des données en transit (HTTPS/TLS)\n- Règles de sécurité Firebase (accès limité à l'utilisateur authentifié)\n- Authentification sécurisée via les protocoles OAuth 2.0 et nonce pour Apple Sign-In\n- Données stockées localement sur l'appareil, protégées par le chiffrement du système d'exploitation (iOS et Android chiffrent par défaut les données des applications sur un appareil verrouillé par un code)\n\nAucun système n'est infaillible. En cas de violation de données affectant vos droits, nous vous en informerons conformément aux délais légaux applicables.",
      },
      {
        title: "Limite d'âge",
        content:
          "L'Application est destinée à un public âgé de 13 ans et plus. Nous ne collectons pas sciemment de données personnelles de personnes de moins de 13 ans.\n\nSi vous êtes un parent ou tuteur et que vous découvrez que votre enfant de moins de 13 ans nous a fourni des données personnelles, contactez-nous à privacy@synapgeek.com. Nous supprimerons ces données dans les meilleurs délais.",
      },
      {
        title: "Vos droits",
        content:
          "**Droits au titre du RGPD (UE/EEE)**\nConformément au RGPD, vous disposez des droits suivants :\n\n- **Accès** : demander une copie de vos données personnelles\n- **Rectification** : corriger vos données inexactes ou incomplètes\n- **Suppression** : demander l'effacement de vos données\n- **Limitation** : demander la limitation du traitement\n- **Opposition** : vous opposer au traitement fondé sur l'intérêt légitime\n- **Portabilité** : recevoir vos données dans un format structuré et lisible par machine\n- **Révocation du consentement** : retirer votre consentement à tout moment\n\nVous avez également le droit d'introduire une réclamation auprès d'une autorité de contrôle (en France : la CNIL — www.cnil.fr).\n\n**Droits au titre de la CCPA/CPRA (Californie, États-Unis)**\nSi vous résidez en Californie, vous disposez des droits suivants :\n- Droit de connaître les données collectées et leur utilisation\n- Droit de demander la suppression de vos données\n- Droit de refuser la « vente » ou le « partage » de vos données (nous ne vendons pas vos données)\n- Droit à la non-discrimination pour l'exercice de vos droits\n\n**Exercer vos droits**\nPour exercer l'un de ces droits, contactez-nous à : privacy@synapgeek.com. Nous répondrons dans un délai de 30 jours.",
      },
      {
        id: "account-deletion",
        title: "Suppression de compte",
        content:
          "Vous pouvez supprimer votre compte directement dans l'Application via Profil > Supprimer le compte. Cette action est irréversible et entraîne la suppression de toutes vos données personnelles de nos serveurs : progression, achats, avatars et classements.\n\nSi vous n'avez plus accès à l'Application, vous pouvez également demander la suppression de votre compte par email à privacy@synapgeek.com.\n\nCette page est accessible directement à l'adresse : https://synapgeek.com/account-deletion",
      },
      {
        title: "Modifications de cette politique",
        content:
          "Nous pouvons mettre à jour cette politique de confidentialité périodiquement. En cas de modification substantielle, la date de mise à jour en haut de cette page sera actualisée. Nous vous encourageons à consulter régulièrement cette page. La poursuite de l'utilisation de l'Application après toute modification vaut acceptation de la politique révisée.",
      },
      {
        title: "Contact",
        content:
          "Pour toute question relative à cette politique de confidentialité ou à vos données personnelles :\n\n**Synapgeek**\nEmail : privacy@synapgeek.com\nSite web : https://synapgeek.com",
      },
    ],
  },
  terms: {
    title: "Conditions Générales d'Utilisation",
    metaDescription:
      "Conditions générales d'utilisation des apps Synapgeek : licence, achats in-app, biens virtuels, propriété intellectuelle.",
    lastUpdated: "Dernière mise à jour : 1er octobre 2026",
    updatedAt: "2026-10-01",
    sections: [
      {
        title: "Acceptation des conditions",
        content:
          "En téléchargeant, installant ou utilisant les applications Synapgeek (ci-après « l'Application »), vous acceptez les présentes Conditions Générales d'Utilisation (ci-après « les Conditions »). Si vous n'acceptez pas ces Conditions, veuillez ne pas utiliser l'Application.\n\nL'Application est destinée aux utilisateurs âgés de 13 ans et plus. Si vous avez entre 13 et 18 ans, votre parent ou tuteur légal doit lire et accepter ces Conditions en votre nom.",
      },
      {
        title: "Description du service",
        content:
          "Synapgeek développe et distribue des applications mobiles de jeux de réflexion. Cerebrum est une application mobile de jeux de puzzle et de réflexion pour iOS et Android.\n\nL'Application propose des puzzles avec plusieurs niveaux de difficulté, un système de progression fondé sur les étoiles, l'XP et les ligues, un défi quotidien et des séries de jeu (streaks), ainsi qu'une monnaie virtuelle (gemmes) et des avatars.\n\nL'Application se télécharge gratuitement et est financée par la publicité. Elle propose aussi des achats in-app optionnels et un abonnement Premium, qui retire les publicités imposées (bannières et interstitiels) ; les publicités récompensées restent facultatives et disponibles si vous choisissez de les regarder.",
      },
      {
        title: "Licence d'utilisation",
        content:
          "L'Application vous est concédée sous licence, et non vendue. Synapgeek vous accorde une licence personnelle, limitée, non exclusive, non transférable et révocable pour utiliser l'Application sur tout appareil Apple ou Android que vous possédez ou contrôlez, conformément aux règles d'utilisation de la boutique depuis laquelle vous l'avez téléchargée (App Store ou Google Play).\n\nVous vous engagez à ne pas :\n- Copier, modifier, décompiler ou désassembler l'Application\n- Distribuer, louer, prêter ou sous-licencier l'Application\n- Utiliser l'Application à des fins commerciales non autorisées\n- Tenter de contourner les mesures de sécurité ou les restrictions techniques\n- Extraire ou collecter des données de l'Application par des moyens automatisés (scraping, data mining, robots)",
      },
      {
        title: "Compte utilisateur",
        content:
          "Vous pouvez utiliser l'Application sans créer de compte (mode anonyme). Si vous choisissez de créer un compte via Apple, Google ou Facebook, vous êtes responsable de la confidentialité de vos identifiants.\n\nLa création d'un compte permet la synchronisation de votre progression entre appareils. Vous ne pouvez détenir qu'un seul compte actif.",
      },
      {
        title: "Achats intégrés et abonnements",
        content:
          "L'Application propose des achats intégrés (in-app purchases) et des abonnements optionnels. Tous les achats sont traités exclusivement par la boutique de votre plateforme : Apple (StoreKit 2) sur iOS, Google (Google Play Billing) sur Android.\n\n**Achats consommables**\nDes packs de gemmes (monnaie virtuelle) peuvent être achetés. Les gemmes sont utilisables dans l'Application pour débloquer des indices, des avatars et d'autres fonctionnalités.\n\n**Achats non consommables**\nCertains achats sont permanents : des packs thématiques de Mots Croisés et Mots Mêlés (Cinéma, Cuisine, Voyage) et un pack de démarrage de gemmes, disponible une seule fois par utilisateur.\n\n**Abonnements**\nUn abonnement Premium est disponible en formule hebdomadaire, mensuelle ou annuelle. Les abonnements se renouvellent automatiquement sauf annulation au moins 24 heures avant la fin de la période en cours. Certains utilisateurs disposent d'un abonnement « Sans publicité » souscrit avant son retrait de la vente : il reste actif tant qu'il n'est pas résilié, mais n'est plus proposé à l'achat. La gestion et l'annulation des abonnements s'effectuent via les réglages de votre compte Apple sur iOS, ou via Google Play > Paiements et abonnements sur Android.\n\n**Remboursements**\nLes achats sont soumis aux conditions de remboursement de la plateforme concernée. Pour demander un remboursement, contactez Apple via https://reportaproblem.apple.com (iOS) ou Google Play via https://support.google.com/googleplay/answer/2479637 (Android).\n\nLes prix sont affichés dans l'Application avant tout achat et peuvent varier selon le pays.",
      },
      {
        title: "Biens virtuels",
        content:
          "L'Application contient des biens virtuels, incluant des gemmes (monnaie virtuelle), des avatars, des trophées et des points d'expérience (XP).\n\nLes biens virtuels :\n- N'ont aucune valeur monétaire en dehors de l'Application\n- Ne sont ni transférables, ni échangeables, ni remboursables (sauf obligation légale)\n- Peuvent être obtenus par le jeu, le visionnage de publicités ou l'achat in-app\n- Sont liés à votre compte et ne peuvent être transférés à un autre utilisateur\n\nSynapgeek se réserve le droit de modifier les prix, la disponibilité ou la fonctionnalité des biens virtuels à tout moment.",
      },
      {
        title: "Publicités",
        content:
          "L'Application affiche des publicités fournies par Google AdMob. Les publicités incluent des bannières, des interstitiels et des publicités récompensées (que vous choisissez de visionner).\n\nVous pouvez retirer les publicités imposées (bannières et interstitiels) en souscrivant à un abonnement Premium. Les publicités récompensées restent accessibles de manière optionnelle même avec un abonnement actif. Les utilisateurs disposant encore d'un abonnement « Sans publicité » souscrit avant son retrait de la vente continuent également de ne pas voir de publicités imposées.",
      },
      {
        title: "Propriété intellectuelle",
        content:
          "L'ensemble du contenu de l'Application — incluant mais non limité aux textes, graphismes, logos, icônes, images, grilles de puzzles, sons, interfaces, code source et documentation — est la propriété exclusive de Synapgeek et est protégé par les lois françaises et internationales sur la propriété intellectuelle.\n\nToute reproduction, distribution, modification, adaptation ou utilisation non autorisée est strictement interdite.\n\nIl est interdit d'utiliser le contenu de l'Application pour l'entraînement de modèles d'intelligence artificielle ou d'apprentissage automatique, la capture systématique d'écrans, le data mining ou le web scraping.",
      },
      {
        title: "Règles de conduite",
        content:
          "En utilisant l'Application, vous vous engagez à ne pas :\n\n- Utiliser l'Application d'une manière contraire aux lois applicables\n- Tenter de manipuler les classements, scores ou systèmes de progression\n- Exploiter des bugs ou failles pour obtenir un avantage déloyal\n- Créer de faux comptes ou usurper l'identité d'un tiers\n- Interférer avec le fonctionnement normal de l'Application ou de ses serveurs\n\nSynapgeek se réserve le droit de suspendre ou supprimer tout compte en violation de ces règles, sans préavis ni compensation.\n\nVous déclarez par ailleurs ne pas vous trouver dans un pays soumis à un embargo du gouvernement américain, ni être inscrit sur une liste de personnes sanctionnées.",
      },
      {
        title: "Limitation de responsabilité",
        content:
          "L'Application est fournie « en l'état » et « selon disponibilité ». Synapgeek ne garantit pas que l'Application fonctionnera sans interruption, sans erreur, ou que les défauts seront corrigés.\n\nDans les limites autorisées par la loi, Synapgeek ne pourra être tenu responsable :\n- De tout dommage indirect, accessoire, spécial ou consécutif\n- De la perte de données, de progression ou de biens virtuels\n- De toute interruption de service ou indisponibilité de l'Application\n\nLa responsabilité totale cumulée de Synapgeek est limitée au montant que vous avez effectivement payé pour l'Application au cours des 12 mois précédant la réclamation.",
      },
      {
        title: "Résiliation et suppression de compte",
        content:
          "Vous pouvez cesser d'utiliser l'Application à tout moment en la désinstallant.\n\nVous pouvez supprimer votre compte à tout moment via Profil > Supprimer le compte dans l'Application. La suppression est irréversible et entraîne la perte définitive de toutes vos données : progression, gemmes, avatars, trophées et classements.\n\nSynapgeek se réserve le droit de résilier ou suspendre votre accès en cas de violation des présentes Conditions.\n\nLes sections relatives à la propriété intellectuelle, la limitation de responsabilité et le droit applicable survivent à toute résiliation.",
      },
      {
        title: "Notice pour les utilisateurs d'appareils Apple",
        content:
          "Les présentes Conditions constituent un accord entre vous et Synapgeek, et non avec Apple. Synapgeek, et non Apple, est seul responsable de l'Application et de son contenu.\n\nApple n'a aucune obligation de fournir des services de maintenance ou d'assistance pour l'Application.\n\nEn cas de non-conformité de l'Application à toute garantie applicable, vous pouvez en informer Apple, qui pourra vous rembourser le prix d'achat le cas échéant. Apple n'a aucune autre obligation de garantie.\n\nApple n'est pas responsable du traitement des réclamations vous concernant ou concernant votre utilisation de l'Application.\n\nApple et ses filiales sont tiers bénéficiaires des présentes Conditions et peuvent les faire exécuter à votre encontre.",
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
          "Pour toute question relative aux présentes Conditions :\n\n**Synapgeek**\nEmail : contact@synapgeek.com\nSite web : https://synapgeek.com",
      },
    ],
  },
  legal: {
    title: "Mentions légales",
    metaDescription:
      "Mentions légales de Synapgeek : éditeur, hébergeur, immatriculation RCS et informations sur la société.",
    lastUpdated: "Dernière mise à jour : 4 juin 2026",
    updatedAt: "2026-06-04",
    sections: [
      {
        title: "Éditeur du site",
        content:
          "Le présent site est édité par :\n\n**Synapgeek**, société par actions simplifiée (SAS) au capital social de 1 000 €.\nSiège social : 185 chemin des Brosses, 69620 Frontenas, France.\nImmatriculée au Registre du commerce et des sociétés de Villefranche-Tarare sous le numéro **102 429 826**.\nSIRET (siège) : 102 429 826 00013.\nCode APE/NAF : 62.01Z (Programmation informatique).\nNuméro de TVA intracommunautaire : FR86 102 429 826.\nEmail : contact@synapgeek.com",
      },
      {
        title: "Directeur de la publication",
        content:
          "Le directeur de la publication est Adrien Monte, en sa qualité de Président de la société Synapgeek.",
      },
      {
        title: "Hébergeur",
        content:
          "Le site est hébergé par :\n\n**Vercel Inc.**\n440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis.\nSite web : https://vercel.com",
      },
      {
        title: "Propriété intellectuelle",
        content:
          "L'ensemble des éléments du site — notamment les textes, graphismes, logos, icônes, images et la marque « Synapgeek » et « Cerebrum » — est la propriété exclusive de Synapgeek et est protégé par les lois françaises et internationales relatives à la propriété intellectuelle.\n\nToute reproduction, représentation, modification ou exploitation, totale ou partielle, de ces éléments sans autorisation écrite préalable de Synapgeek est interdite et constitue une contrefaçon.",
      },
      {
        title: "Données personnelles et cookies",
        content:
          "Le traitement de vos données personnelles et l'utilisation de cookies et technologies de mesure d'audience sont décrits en détail dans notre Politique de confidentialité : https://synapgeek.com/privacy\n\nConformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez de droits d'accès, de rectification, d'effacement, d'opposition et de portabilité sur vos données. Pour les exercer : privacy@synapgeek.com\n\nVous pouvez également introduire une réclamation auprès de la CNIL : https://www.cnil.fr",
      },
      {
        title: "Contact",
        content:
          "Pour toute question relative au site ou à ces mentions légales :\n\n**Synapgeek**\nEmail : contact@synapgeek.com\nSite web : https://synapgeek.com",
      },
    ],
  },
  play: {
    title: "Télécharger Cerebrum",
    gamesIntro: "Dans Cerebrum\u00a0: ",
    chooseStore: "Choisissez votre store pour installer l'application.",
  },
};

export default fr;
