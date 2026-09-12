import type { Locale } from "@/lib/i18n";

/** Download block: les deux plateformes sont en ligne depuis le lancement Android. */
export interface StoreDownload {
  availableNow: string;
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
    nav: {
      home: string;
      privacy: string;
      terms: string;
    };
    footer: {
      copyright: string;
      privacy: string;
      terms: string;
      legalNotice: string;
      contact: string;
    };
    languageSwitch: string;
    languageSwitchLocale: Locale;
  };
  landing: {
    hero: {
      badge: string;
      title: string;
      subtitle: string;
      cta: string;
      ctaSecondary: string;
      store: StoreDownload;
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
      };
    };
  };
  privacy: {
    title: string;
    lastUpdated: string;
    sections: readonly LegalSection[];
  };
  terms: {
    title: string;
    lastUpdated: string;
    sections: readonly LegalSection[];
  };
  legal: {
    title: string;
    lastUpdated: string;
    sections: readonly LegalSection[];
  };
}
