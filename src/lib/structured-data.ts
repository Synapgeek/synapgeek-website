/**
 * Bibliothèque de données structurées (JSON-LD) du site.
 *
 * Chaque builder est une fonction pure : elle ne fait aucun accès I/O et
 * renvoie un objet sérialisable en JSON-LD (rendu ensuite via <JsonLd data=…>).
 * Les URLs viennent de `src/lib/routes.ts` (`absoluteUrl`), la même source que
 * le canonical, pour ne jamais en diverger.
 */

import type { Locale } from "./i18n";
import { platformsFor, type AppEntry, type GameEntry } from "@/content/apps";
import type { AppCopy, GameCopy } from "@/content/copy";
import {
  BASE_URL,
  absolutePath,
  absoluteUrl,
  pageIdForGame,
  type PageId,
} from "./routes";

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

// Date de première publication de la fiche Cerebrum (iOS), conservée telle
// quelle depuis le JSON-LD SoftwareApplication existant.
const CEREBRUM_DATE_PUBLISHED = "2026-06-03";

// Les noeuds Organization et WebSite décrivent le site entier : même @id et même
// url dans toutes les langues, pour que les moteurs ne voient qu'une entité.
const SITE_ROOT_URL = `${BASE_URL}/`;
const ORGANIZATION_ID = `${BASE_URL}/#organization`;
const WEBSITE_ID = `${BASE_URL}/#website`;
const CEREBRUM_APP_ID = `${BASE_URL}/cerebrum#app`;
/** Genre schema.org commun à tous les jeux ; le genre maison, quand il existe, s'y ajoute. */
const VIDEO_GAME_GENRE = "Puzzle";

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
export function organizationSchema(): OrganizationSchema {
  const sameAs = [APP_STORE_DEVELOPER_URL, GOOGLE_PLAY_DEVELOPER_URL].filter(
    (url): url is string => Boolean(url),
  );

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: "Synapgeek",
    legalName: "Synapgeek SAS",
    url: SITE_ROOT_URL,
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
    "@id": WEBSITE_ID,
    url: SITE_ROOT_URL,
    name: "Synapgeek",
    inLanguage: locale,
    publisher: { "@id": ORGANIZATION_ID },
  };
}

interface MobileApplicationSchema {
  readonly "@context": "https://schema.org";
  readonly "@type": readonly ["MobileApplication", "VideoGame"];
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
  readonly dateModified: string;
}

/**
 * Application Cerebrum, co-typée MobileApplication et VideoGame. Décisions
 * volontaires : pas d'`aggregateRating` (pas de source unifiée iOS/Android
 * fiable), pas de `softwareVersion` (diverge entre stores et se périme vite),
 * pas de `contentRating`. Android n'est annoncé que si le registre en vérifie
 * la version minimale.
 */
export function mobileApplicationSchema(
  app: AppEntry,
  locale: Locale,
  copy: Pick<AppCopy, "updatedAt"> & {
    hero: Pick<AppCopy["hero"], "definition">;
  },
): MobileApplicationSchema {
  const operatingSystem = [
    "iOS",
    ...(app.platforms.android.minOs ? ["Android"] : []),
  ];

  return {
    "@context": "https://schema.org",
    "@type": ["MobileApplication", "VideoGame"],
    "@id": CEREBRUM_APP_ID,
    name: app.name,
    alternateName: [
      APP_STORE_TITLE_FR,
      APP_STORE_TITLE_EN,
      GOOGLE_PLAY_TITLE_FR,
      GOOGLE_PLAY_TITLE_EN,
    ].filter((value, index, all) => all.indexOf(value) === index),
    description: copy.hero.definition,
    url: absoluteUrl(app.slug, locale),
    sameAs: [app.appStoreUrl, app.googlePlayUrl],
    operatingSystem,
    applicationCategory: "GameApplication",
    image: absolutePath(app.icon),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
    downloadUrl: [app.appStoreUrl, app.googlePlayUrl],
    author: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
    inLanguage: app.languages,
    datePublished: CEREBRUM_DATE_PUBLISHED,
    dateModified: copy.updatedAt,
  };
}

interface VideoGameSchema {
  readonly "@context": "https://schema.org";
  readonly "@type": "VideoGame";
  readonly "@id": string;
  readonly name: string;
  readonly description: string;
  readonly url: string;
  readonly image: string;
  readonly genre: readonly string[];
  readonly gamePlatform: readonly string[];
  readonly isPartOf: { readonly "@id": string };
  readonly publisher: { readonly "@id": string };
  readonly inLanguage: readonly string[];
  readonly dateModified: string;
}

/**
 * Un jeu de Cerebrum. L'@id suit le slug anglais (une seule entité pour les
 * deux pages de langue, comme l'app), l'url suit la page de la langue. Les
 * plateformes viennent du registre (`platformsFor`) : Android n'est annoncé
 * que s'il est vérifié. Pas d'`aggregateRating`, pas d'offre : le prix est
 * celui de l'app.
 */
export function videoGameSchema(
  app: AppEntry,
  game: GameEntry,
  locale: Locale,
  copy: Pick<GameCopy, "updatedAt"> & {
    hero: Pick<GameCopy["hero"], "definition">;
  },
): VideoGameSchema {
  const pageId = pageIdForGame(game.id);
  const houseGenre = game.genre[locale];

  return {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "@id": `${absoluteUrl(pageId, "en")}#game`,
    name: game.name[locale],
    description: copy.hero.definition,
    url: absoluteUrl(pageId, locale),
    image: absolutePath(game.icon),
    genre: houseGenre ? [VIDEO_GAME_GENRE, houseGenre] : [VIDEO_GAME_GENRE],
    gamePlatform: platformsFor(game),
    isPartOf: { "@id": CEREBRUM_APP_ID },
    publisher: { "@id": ORGANIZATION_ID },
    inLanguage:
      game.contentLocales === "all" ? app.languages : game.contentLocales,
    dateModified: copy.updatedAt,
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
    inLanguage: locale,
    dateModified,
    isPartOf: { "@id": WEBSITE_ID },
  };
}

interface BreadcrumbListItemSchema {
  readonly "@type": "ListItem";
  readonly position: number;
  readonly name: string;
  /** Absent sur le dernier maillon (la page courante). */
  readonly item?: string;
}

interface BreadcrumbListSchema {
  readonly "@context": "https://schema.org";
  readonly "@type": "BreadcrumbList";
  readonly itemListElement: readonly BreadcrumbListItemSchema[];
}

/**
 * Fil d'Ariane. Reçoit le tableau même que le composant visible (`href`
 * relatif, absent sur la page courante) : le visible et le structuré ne
 * peuvent pas diverger.
 */
export function breadcrumbSchema(
  items: readonly { readonly name: string; readonly href?: string }[],
): BreadcrumbListSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      ...(entry.href !== undefined && { item: absolutePath(entry.href) }),
    })),
  };
}
