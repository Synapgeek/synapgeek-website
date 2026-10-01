/**
 * Bibliothèque de données structurées (JSON-LD) du site.
 *
 * Chaque builder est une fonction pure : elle ne fait aucun accès I/O et
 * renvoie un objet sérialisable en JSON-LD (rendu ensuite via <JsonLd data=…>).
 * Les URLs viennent de `src/lib/routes.ts` (`absoluteUrl`), la même source que
 * le canonical, pour ne jamais en diverger.
 */

import type { Locale } from "./i18n";
import { APP_STORE_URL, GOOGLE_PLAY_URL } from "./app";
import { BASE_URL, absoluteUrl, type PageId } from "./routes";

// Pages développeur des stores — utilisées comme `sameAs` de l'organisation.
// Faits stores fournis par la tâche ; on omet une URL introuvable plutôt que
// d'en inventer une.
const APP_STORE_DEVELOPER_URL =
  "https://apps.apple.com/fr/developer/synapgeek/id1895554771?uo=4";
const GOOGLE_PLAY_DEVELOPER_URL =
  "https://play.google.com/store/apps/developer?id=Synapgeek";

// Titres des fiches store (FR + EN), utilisés comme `alternateName` de l'app.
const APP_STORE_TITLE_FR = "Cerebrum : Jeux zen sans wifi";
const APP_STORE_TITLE_EN = "Cerebrum: Offline Puzzle Games";
const GOOGLE_PLAY_TITLE_FR = "Cerebrum : Jeux zen sans wifi";
const GOOGLE_PLAY_TITLE_EN = "Cerebrum: Offline Puzzle Games";

// Langues de l'interface de l'app (16, iOS et Android), en BCP 47. Distinctes
// de `LOCALES`, qui ne liste que les langues du site web.
const CEREBRUM_APP_LANGUAGES = [
  "en",
  "fr",
  "de",
  "es",
  "it",
  "pt-BR",
  "nl",
  "tr",
  "hi",
  "id",
  "ja",
  "ko",
  "th",
  "vi",
  "zh-Hans",
  "zh-Hant",
] as const;

// Date de première publication de la fiche Cerebrum (iOS), conservée telle
// quelle depuis le JSON-LD SoftwareApplication existant.
const CEREBRUM_DATE_PUBLISHED = "2026-06-03";

function ogLocale(locale: Locale): string {
  const map: Record<Locale, string> = {
    fr: "fr_FR",
    en: "en_US",
  };
  return map[locale];
}

interface PostalAddressSchema {
  readonly "@type": "PostalAddress";
  readonly streetAddress: string;
  readonly postalCode: string;
  readonly addressLocality: string;
  readonly addressCountry: string;
}

interface PersonSchema {
  readonly "@type": "Person";
  readonly name: string;
}

interface OrganizationSchema {
  readonly "@context": "https://schema.org";
  readonly "@type": "Organization";
  readonly "@id": string;
  readonly name: string;
  readonly legalName: string;
  readonly url: string;
  readonly logo: string;
  readonly address: PostalAddressSchema;
  readonly founder: PersonSchema;
  readonly sameAs: readonly string[];
}

/**
 * Organisation Synapgeek — un seul noeud `@id` partagé par toutes les pages
 * (référencé en `publisher`/`author` ailleurs plutôt que redupliqué).
 */
export function organizationSchema(locale: Locale): OrganizationSchema {
  const sameAs = [APP_STORE_DEVELOPER_URL, GOOGLE_PLAY_DEVELOPER_URL].filter(
    (url): url is string => Boolean(url),
  );

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: "Synapgeek",
    legalName: "Synapgeek SAS",
    url: absoluteUrl("home", locale),
    logo: `${BASE_URL}/images/brand/logo-synapgeek.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "185 chemin des Brosses",
      postalCode: "69620",
      addressLocality: "Frontenas",
      addressCountry: "FR",
    },
    founder: {
      "@type": "Person",
      name: "Adrien Monte",
    },
    sameAs,
  };
}

interface WebSiteSchema {
  readonly "@context": "https://schema.org";
  readonly "@type": "WebSite";
  readonly "@id": string;
  readonly url: string;
  readonly name: string;
  readonly inLanguage: string;
  readonly publisher: { readonly "@id": string };
}

/** Site web Synapgeek. Pas de SearchAction : aucun moteur de recherche interne. */
export function websiteSchema(locale: Locale): WebSiteSchema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    url: absoluteUrl("home", locale),
    name: "Synapgeek",
    inLanguage: ogLocale(locale),
    publisher: { "@id": `${BASE_URL}/#organization` },
  };
}

interface SoftwareApplicationSchema {
  readonly "@context": "https://schema.org";
  readonly "@type": "SoftwareApplication";
  readonly "@id": string;
  readonly name: string;
  readonly alternateName: readonly string[];
  readonly description: string;
  readonly url: string;
  readonly sameAs: readonly string[];
  readonly operatingSystem: readonly string[];
  readonly applicationCategory: string;
  readonly offers: {
    readonly "@type": "Offer";
    readonly price: string;
    readonly priceCurrency: string;
    readonly availability: string;
  };
  readonly image: string;
  readonly downloadUrl: readonly string[];
  readonly author: { readonly "@id": string };
  readonly publisher: { readonly "@id": string };
  readonly inLanguage: readonly string[];
  readonly datePublished: string;
}

/**
 * Application Cerebrum. Décisions volontaires : pas d'`aggregateRating` (pas
 * de source unifiée iOS/Android fiable), pas de `softwareVersion` (diverge
 * entre stores et se périme vite), pas de `contentRating`.
 */
export function softwareApplicationSchema(
  locale: Locale,
  { description }: { description: string },
): SoftwareApplicationSchema {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${BASE_URL}/#cerebrum`,
    name: "Cerebrum",
    alternateName: [
      APP_STORE_TITLE_FR,
      APP_STORE_TITLE_EN,
      GOOGLE_PLAY_TITLE_FR,
      GOOGLE_PLAY_TITLE_EN,
    ].filter((value, index, all) => all.indexOf(value) === index),
    description,
    url: absoluteUrl("home", locale),
    sameAs: [APP_STORE_URL, GOOGLE_PLAY_URL],
    operatingSystem: ["iOS", "Android"],
    applicationCategory: "GameApplication",
    image: `${BASE_URL}/images/brand/og-image.jpeg`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
    downloadUrl: [APP_STORE_URL, GOOGLE_PLAY_URL],
    author: { "@id": `${BASE_URL}/#organization` },
    publisher: { "@id": `${BASE_URL}/#organization` },
    inLanguage: CEREBRUM_APP_LANGUAGES,
    datePublished: CEREBRUM_DATE_PUBLISHED,
  };
}

interface FaqQuestionSchema {
  readonly "@type": "Question";
  readonly name: string;
  readonly acceptedAnswer: {
    readonly "@type": "Answer";
    readonly text: string;
  };
}

interface FaqPageSchema {
  readonly "@context": "https://schema.org";
  readonly "@type": "FAQPage";
  readonly mainEntity: readonly FaqQuestionSchema[];
}

export function faqPageSchema(
  items: readonly { readonly question: string; readonly answer: string }[],
): FaqPageSchema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

interface WebPageSchema {
  readonly "@context": "https://schema.org";
  readonly "@type": "WebPage";
  readonly url: string;
  readonly name: string;
  readonly inLanguage: string;
  readonly dateModified: string;
  readonly isPartOf: { readonly "@id": string };
}

export function webPageSchema({
  locale,
  pageId,
  name,
  dateModified,
}: {
  readonly locale: Locale;
  readonly pageId: PageId;
  readonly name: string;
  readonly dateModified: string;
}): WebPageSchema {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: absoluteUrl(pageId, locale),
    name,
    inLanguage: ogLocale(locale),
    dateModified,
    isPartOf: { "@id": `${BASE_URL}/#website` },
  };
}
