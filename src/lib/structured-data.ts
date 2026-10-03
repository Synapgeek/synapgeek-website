/**
 * Bibliothèque de données structurées (JSON-LD) du site.
 *
 * Chaque builder est une fonction pure : elle ne fait aucun accès I/O et
 * renvoie un objet sérialisable en JSON-LD (rendu ensuite via <JsonLd data=…>).
 * Les URLs viennent de `src/lib/routes.ts` (`absoluteUrl`), la même source que
 * le canonical, pour ne jamais en diverger.
 */

import { LOCALES, type Locale } from "./i18n";
import {
  getGames,
  platformsFor,
  type AppEntry,
  type GameEntry,
} from "@/content/apps";
import type { AboutCopy, AppCopy, GameCopy } from "@/content/copy";
import { PUBLISHER } from "@/content/publisher";
import {
  BASE_URL,
  absolutePath,
  absoluteUrl,
  pageIdForGame,
  type PageId,
} from "./routes";

// Pages développeur des stores — utilisées comme `sameAs` de l'organisation.
const APP_STORE_DEVELOPER_URL =
  "https://apps.apple.com/fr/developer/synapgeek/id1895554771";
const GOOGLE_PLAY_DEVELOPER_URL =
  "https://play.google.com/store/apps/developer?id=Synapgeek";

// Les noeuds Organization et WebSite décrivent le site entier : même @id et même
// url dans toutes les langues, pour que les moteurs ne voient qu'une entité.
const SITE_ROOT_URL = `${BASE_URL}/`;
const ORGANIZATION_ID = `${BASE_URL}/#organization`;
const WEBSITE_ID = `${BASE_URL}/#website`;

/** @id de l'app : sa page anglaise, une seule entité pour les deux langues. */
const appId = (app: AppEntry): string => `${absoluteUrl(app.slug, "en")}#app`;
/**
 * @id d'un jeu : sa page anglaise, une seule entité pour les deux langues. Source
 * unique du nœud `VideoGame` d'une page jeu et du `hasPart` de l'app, qui doivent
 * viser exactement le même @id.
 */
const gameNodeId = (game: GameEntry): string =>
  `${absoluteUrl(pageIdForGame(game.id), "en")}#game`;
/** Genre schema.org commun à tous les jeux ; le genre maison, quand il existe, s'y ajoute. */
const VIDEO_GAME_GENRE = "Puzzle";

/** Le pays seulement : l'adresse du siège ne figure que dans les mentions légales. */
interface PostalAddressSchema {
  readonly "@type": "PostalAddress";
  readonly addressCountry: string;
}

interface PersonSchema {
  readonly "@type": "Person";
  readonly name: string;
}

interface ContactPointSchema {
  readonly "@type": "ContactPoint";
  readonly contactType: string;
  readonly email: string;
  readonly availableLanguage: readonly string[];
}

interface OrganizationSchema {
  readonly "@context": "https://schema.org";
  readonly "@type": "Organization";
  readonly "@id": string;
  readonly name: string;
  readonly legalName: string;
  readonly description: string;
  readonly url: string;
  readonly logo: string;
  readonly address: PostalAddressSchema;
  readonly vatID: string;
  readonly contactPoint: ContactPointSchema;
  readonly founder: PersonSchema;
  readonly sameAs: readonly string[];
}

/**
 * Organisation Synapgeek — un seul noeud `@id` partagé par toutes les pages
 * (référencé en `publisher`/`author` ailleurs plutôt que redupliqué). La description
 * est la phrase de définition de la page À propos, qui parle du studio à la troisième
 * personne (celle de l'accueil est à la première, mal venue dans un nœud d'entité).
 */
export function organizationSchema(copy: {
  hero: Pick<AboutCopy["hero"], "definition">;
}): OrganizationSchema {
  const sameAs = [APP_STORE_DEVELOPER_URL, GOOGLE_PLAY_DEVELOPER_URL];

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: PUBLISHER.brand,
    legalName: PUBLISHER.legalName,
    description: copy.hero.definition,
    url: SITE_ROOT_URL,
    logo: `${BASE_URL}/images/brand/logo-synapgeek.png`,
    address: {
      "@type": "PostalAddress",
      addressCountry: PUBLISHER.address.countryCode,
    },
    vatID: PUBLISHER.vat,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: PUBLISHER.contactEmail,
      availableLanguage: LOCALES,
    },
    founder: {
      "@type": "Person",
      name: PUBLISHER.publicationDirector,
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
  readonly inLanguage: readonly string[];
  readonly publisher: { readonly "@id": string };
}

/**
 * Site web Synapgeek. Pas de SearchAction : aucun moteur de recherche interne.
 * Même noeud dans toutes les langues, donc `inLanguage` les liste toutes.
 */
export function websiteSchema(): WebSiteSchema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_ROOT_URL,
    name: "Synapgeek",
    inLanguage: LOCALES,
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
  readonly disambiguatingDescription: string;
  readonly url: string;
  readonly sameAs: readonly string[];
  readonly operatingSystem: readonly string[];
  readonly applicationCategory: string;
  readonly offers: {
    readonly "@type": "Offer";
    readonly price: string;
    readonly priceCurrency: string;
    readonly availability: string;
    readonly description: string;
  };
  readonly featureList: readonly string[];
  readonly hasPart: ReadonlyArray<{ readonly "@id": string }>;
  readonly image: string;
  readonly downloadUrl: readonly string[];
  readonly author: { readonly "@id": string };
  readonly publisher: { readonly "@id": string };
  readonly inLanguage: readonly string[];
  readonly datePublished: string;
  readonly dateModified: string;
}

/**
 * Application du registre (Cerebrum aujourd'hui), co-typée MobileApplication et VideoGame. Décisions
 * volontaires : pas d'`aggregateRating` (pas de source unifiée iOS/Android
 * fiable), pas de `softwareVersion` (diverge entre stores et se périme vite),
 * pas de `contentRating`. Android n'est annoncé que si le registre en vérifie
 * la version minimale. Les textes ne s'écrivent pas ici : `offers.description` est la
 * première phrase du modèle économique de la page, `featureList` ses points « Bon à
 * savoir » (le même tableau), `disambiguatingDescription` le champ de copie
 * `disambiguation`. Aucun prix : l'offre n'a que son prix de téléchargement, `0`.
 * `hasPart` renvoie, par @id, aux seuls jeux publiés.
 */
export function mobileApplicationSchema(
  app: AppEntry,
  locale: Locale,
  copy: Pick<AppCopy, "updatedAt" | "disambiguation"> & {
    hero: Pick<AppCopy["hero"], "definition">;
    sections: {
      model: Pick<AppCopy["sections"]["model"], "items">;
      goodToKnow: Pick<AppCopy["sections"]["goodToKnow"], "items">;
    };
  },
): MobileApplicationSchema {
  // Android n'est annoncé que s'il est vérifié : système, boutiques et sameAs vont ensemble.
  const hasAndroid = Boolean(app.platforms.android.minOs);
  const operatingSystem = ["iOS", ...(hasAndroid ? ["Android"] : [])];
  const storeUrls = [
    app.appStoreUrl,
    ...(hasAndroid ? [app.googlePlayUrl] : []),
  ];

  return {
    "@context": "https://schema.org",
    "@type": ["MobileApplication", "VideoGame"],
    "@id": appId(app),
    name: app.name,
    alternateName: app.storeTitles,
    description: copy.hero.definition,
    disambiguatingDescription: copy.disambiguation,
    url: absoluteUrl(app.slug, locale),
    sameAs: storeUrls,
    operatingSystem,
    applicationCategory: "GameApplication",
    image: absolutePath(app.icon),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      description: copy.sections.model.items[0],
    },
    featureList: copy.sections.goodToKnow.items,
    hasPart: getGames(app.slug)
      .filter((game) => game.published)
      .map((game) => ({ "@id": gameNodeId(game) })),
    downloadUrl: storeUrls,
    author: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
    inLanguage: app.languages,
    datePublished: app.datePublished,
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
    "@id": gameNodeId(game),
    name: game.name[locale],
    description: copy.hero.definition,
    url: absoluteUrl(pageId, locale),
    image: absolutePath(game.icon),
    genre: houseGenre ? [VIDEO_GAME_GENRE, houseGenre] : [VIDEO_GAME_GENRE],
    gamePlatform: platformsFor(game),
    isPartOf: { "@id": appId(app) },
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

interface AboutPageSchema {
  readonly "@context": "https://schema.org";
  readonly "@type": "AboutPage";
  readonly url: string;
  readonly name: string;
  readonly inLanguage: string;
  readonly dateModified: string;
  readonly isPartOf: { readonly "@id": string };
  readonly about: { readonly "@id": string };
}

/**
 * Page À propos. Elle RÉFÉRENCE l'organisation par son @id : le noeud
 * Organization complet reste unique, émis par le layout de langue.
 */
export function aboutPageSchema({
  locale,
  name,
  dateModified,
}: {
  readonly locale: Locale;
  readonly name: string;
  readonly dateModified: string;
}): AboutPageSchema {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    url: absoluteUrl("about", locale),
    name,
    inLanguage: locale,
    dateModified,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORGANIZATION_ID },
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
