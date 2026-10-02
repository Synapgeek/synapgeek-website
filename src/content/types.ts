import type { Locale } from "@/lib/i18n";

/** Libellés accessibles des deux badges de boutique (le badge lui-même est une image officielle). */
export interface StoreLabels {
  appStoreLabel: string;
  googlePlayLabel: string;
}

/**
 * Sujet du message de contact. `value` part au serveur et doit exister à
 * l'identique dans `CONTACT_TOPICS` (src/app/api/contact/route.ts) : le serveur
 * refuse toute autre valeur, et c'est lui qui compose l'objet de l'email.
 */
export interface ContactTopic {
  value: string;
  label: string;
}

/** Une section d'un document légal. `id` n'est posé que sur les sections ciblées par une ancre. */
export type LegalSection = { title: string; content: string; id?: string };

export interface Dictionary {
  common: {
    siteName: string;
    tagline: string;
    /** Entrées de navigation du header (et libellés réutilisés par le pied de page). */
    nav: {
      /** Ancre `#games` du hub. */
      games: string;
      cerebrum: string;
      about: string;
      press: string;
    };
    footer: {
      copyright: string;
      /** Ligne d'identité de l'éditeur (raison sociale et nature du studio), sans adresse : l'adresse vit sur la page des mentions légales. */
      identity: string;
      /** Titres des colonnes du pied de page. */
      productHeading: string;
      studioHeading: string;
      legalHeading: string;
      privacy: string;
      terms: string;
      legalNotice: string;
      contact: string;
      /** Lien de retrait/modification du consentement Google Analytics, toujours affiché : rouvre `ConsentBanner`. */
      manageCookies: string;
    };
    /** Bandeau de consentement maison (`ConsentBanner`). Une seule finalité (mesure d'audience) : pas de bouton "Personnaliser". */
    consent: {
      title: string;
      /** 2 phrases maximum : mesure d'audience + absence de publicité. */
      body: string;
      /** Libellé du lien vers `/privacy#website`. */
      learnMore: string;
      accept: string;
      refuse: string;
    };
    languageSwitch: string;
    languageSwitchLocale: Locale;
    a11y: {
      /** Texte du lien d'évitement, premier élément focusable de la page. */
      skipToContent: string;
      /** Nom du bouton qui ouvre le menu mobile (l'icône seule n'a pas de nom). */
      menu: string;
      /** Noms des deux repères de navigation (header, pied de page). */
      mainNavigation: string;
      footerNavigation: string;
    };
    breadcrumb: {
      /** Nom du repère de navigation du fil d'Ariane. */
      label: string;
      /** Premier maillon du fil d'Ariane (Accueil / Home). */
      home: string;
    };
    /** Libellé devant la date de mise à jour d'une page app ou jeu (« Mis à jour le »). */
    updatedOn: string;
    /**
     * Suggestion de langue, rédigée dans la langue qu'elle propose : le texte
     * d'une locale est affiché à un visiteur dont le navigateur parle cette
     * locale alors qu'il consulte une autre version du site.
     */
    languageSuggestion: {
      message: string;
      cta: string;
      /** Nom du bouton qui ferme la suggestion. */
      dismiss: string;
    };
    notFound: {
      title: string;
      body: string;
      cta: string;
    };
    stores: StoreLabels;
    /**
     * Fin de page de chaque page jeu : le modèle économique de l'app, dit une
     * seule fois ici (ruling R5) et jamais dans la copie d'un jeu.
     */
    gameGet: {
      title: string;
      /** Gratuit avec pubs, pubs récompensées facultatives, Premium : jamais « sans pub », aucun prix. */
      model: string;
      /** Libellé du lien vers la page de l'app. */
      premiumLink: string;
    };
    contactForm: {
      name: string;
      email: string;
      message: string;
      topicLabel: string;
      topicPlaceholder: string;
      topics: readonly ContactTopic[];
      submit: string;
      sending: string;
      successTitle: string;
      successBody: string;
      error: string;
      /** Repli affiché à la place du bouton d'envoi quand reCAPTCHA n'a pas de clé au build. */
      unavailable: string;
    };
  };
  privacy: {
    title: string;
    /** Meta description de la page (balise `<meta>` et Open Graph). */
    metaDescription: string;
    lastUpdated: string;
    /** Date ISO (AAAA-MM-JJ) de dernière mise à jour, utilisée par le sitemap et le JSON-LD. */
    updatedAt: string;
    sections: readonly LegalSection[];
  };
  terms: {
    title: string;
    /** Meta description de la page (balise `<meta>` et Open Graph). */
    metaDescription: string;
    lastUpdated: string;
    /** Date ISO (AAAA-MM-JJ) de dernière mise à jour, utilisée par le sitemap et le JSON-LD. */
    updatedAt: string;
    sections: readonly LegalSection[];
  };
  legal: {
    title: string;
    /** Meta description de la page (balise `<meta>` et Open Graph). */
    metaDescription: string;
    lastUpdated: string;
    /** Date ISO (AAAA-MM-JJ) de dernière mise à jour, utilisée par le sitemap et le JSON-LD. */
    updatedAt: string;
    sections: readonly LegalSection[];
  };
  /** Repli de /cerebrum/play (desktop, iPad en mode bureau, robot) — reste en français quelle que soit la locale. */
  play: {
    title: string;
    chooseStore: string;
  };
}
