import type { Locale } from "@/lib/i18n";

/** Download block: iOS live on the App Store, Android still coming soon. */
export interface StoreDownload {
  availableNow: string;
  androidSoon: string;
}

/** Android-only "notify me" waitlist form. */
export interface Waitlist {
  placeholder: string;
  button: string;
  success: string;
  error: string;
}

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
      waitlist: Waitlist;
    };
    stats: {
      items: readonly { value: string; label: string }[];
    };
    features: {
      title: string;
      subtitle: string;
      items: readonly { title: string; description: string }[];
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
      waitlist: Waitlist;
    };
    contact: {
      title: string;
      subtitle: string;
    };
  };
  privacy: {
    title: string;
    lastUpdated: string;
    sections: readonly { title: string; content: string }[];
  };
  terms: {
    title: string;
    lastUpdated: string;
    sections: readonly { title: string; content: string }[];
  };
  legal: {
    title: string;
    lastUpdated: string;
    sections: readonly { title: string; content: string }[];
  };
}
