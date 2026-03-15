import type { Locale } from "@/lib/i18n";

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
}
