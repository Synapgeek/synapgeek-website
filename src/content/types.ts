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

/**
 * Lien optionnel posé sur un extrait d'une réponse de FAQ. `text` doit figurer
 * mot pour mot dans `answer` : le composant l'y retrouve pour l'envelopper, ce
 * qui garde la réponse visible identique au texte brut du JSON-LD FAQPage.
 */
export interface FaqLink {
  text: string;
  /** Chemin sans préfixe de locale (ex. "/privacy#account-deletion"), résolu via getLocalePath. */
  path: string;
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
}
