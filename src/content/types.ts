import type { Locale } from "@/lib/i18n";
import type { PageId } from "@/lib/routes";

/** Download block: les deux plateformes sont en ligne depuis le lancement Android. */
export interface StoreDownload {
  availableNow: string;
  appStoreLabel: string;
  googlePlayLabel: string;
}

/** Identifiant stable de chaque capture du carrousel du hero (indépendant de la locale). */
export type HeroSlideId =
  | "home"
  | "pandoku"
  | "pixelart"
  | "daily"
  | "progression";

/**
 * Textes localisés du carrousel de captures d'écran (`IPhoneSlider`).
 * `slideLabel` et `goToSlide` sont des gabarits où le composant remplace
 * `{index}` (et `{total}` pour `slideLabel`) par les valeurs réelles.
 */
export interface HeroSlider {
  carouselLabel: string;
  slideLabel: string;
  controlsLabel: string;
  goToSlide: string;
  alts: Record<HeroSlideId, string>;
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

/**
 * Lien optionnel posé sur un extrait d'une réponse de FAQ. `text` doit figurer
 * mot pour mot dans `answer` : le composant l'y retrouve pour l'envelopper, ce
 * qui garde la réponse visible identique au texte brut du JSON-LD FAQPage.
 */
export interface FaqLink {
  text: string;
  /** Page cible et ancre éventuelle, résolues par `pagePath` dans la locale du lecteur. */
  path: { page: PageId; hash?: string };
}

/** Une question/réponse de la FAQ de la home. Réponse autonome, en texte brut. */
export interface FaqItem {
  question: string;
  answer: string;
  link?: FaqLink;
}

/** Une section d'un document légal. `id` n'est posé que sur les sections ciblées par une ancre. */
export type LegalSection = { title: string; content: string; id?: string };

export interface Dictionary {
  common: {
    siteName: string;
    tagline: string;
    nav: {
      home: string;
      privacy: string;
      terms: string;
      features: string;
      about: string;
      faq: string;
      contact: string;
    };
    footer: {
      copyright: string;
      privacy: string;
      terms: string;
      legalNotice: string;
      contact: string;
      /** Lien de retrait/modification du consentement Google Analytics, toujours affiché — rouvre `ConsentBanner`. */
      manageCookies: string;
      /** Titres des colonnes du footer. */
      productHeading: string;
      legalHeading: string;
      contactHeading: string;
      /** Libellé du lien vers la section fonctionnalités de la home. */
      features: string;
      /** Libellé du lien vers la section contact de la home. */
      writeToUs: string;
      /** Mention « Fait avec ❤ en France », coupée en deux autour du cœur. */
      madeWith: string;
      inFrance: string;
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
  };
  landing: {
    /** Title (≤ 60 caractères) et meta description (140-160 caractères) de la home. */
    meta: {
      title: string;
      description: string;
    };
    hero: {
      badge: string;
      title: string;
      subtitle: string;
      cta: string;
      ctaSecondary: string;
      store: StoreDownload;
      slider: HeroSlider;
    };
    stats: {
      items: readonly { value: string; label: string }[];
    };
    features: {
      title: string;
      subtitle: string;
      /** `id` mappe vers le visuel du jeu — l'ordre du tableau n'a donc plus d'effet. */
      items: readonly { id: string; title: string; description: string }[];
    };
    about: {
      title: string;
      description: string;
      values: readonly { title: string; description: string }[];
    };
    faq: {
      title: string;
      subtitle: string;
      items: readonly FaqItem[];
    };
    cta: {
      title: string;
      subtitle: string;
      cta: string;
      note: string;
      store: StoreDownload;
    };
    contact: {
      title: string;
      subtitle: string;
      form: {
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
  };
  privacy: {
    title: string;
    lastUpdated: string;
    /** Date ISO (AAAA-MM-JJ) de dernière mise à jour, utilisée par le sitemap et le JSON-LD. */
    updatedAt: string;
    sections: readonly LegalSection[];
  };
  terms: {
    title: string;
    lastUpdated: string;
    /** Date ISO (AAAA-MM-JJ) de dernière mise à jour, utilisée par le sitemap et le JSON-LD. */
    updatedAt: string;
    sections: readonly LegalSection[];
  };
  legal: {
    title: string;
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
