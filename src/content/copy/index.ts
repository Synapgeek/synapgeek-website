import type { Locale } from "@/lib/i18n";
import type { AppSlug } from "@/content/apps";
import { cerebrumEn } from "@/content/apps/cerebrum/copy/en";
import { cerebrumFr } from "@/content/apps/cerebrum/copy/fr";
import { aboutEn } from "./en/about";
import { hubEn } from "./en/hub";
import { pressEn } from "./en/press";
import { aboutFr } from "./fr/about";
import { hubFr } from "./fr/hub";
import { pressFr } from "./fr/press";
import type {
  AboutCopy,
  AppCopy,
  CopyEntry,
  HubCopy,
  PressCopy,
} from "./types";

export type * from "./types";

const HUB: Readonly<Record<Locale, HubCopy>> = { en: hubEn, fr: hubFr };

export function getHubCopy(locale: Locale): HubCopy {
  return HUB[locale];
}

const ABOUT: Readonly<Record<Locale, AboutCopy>> = {
  en: aboutEn,
  fr: aboutFr,
};

export function getAboutCopy(locale: Locale): AboutCopy {
  return ABOUT[locale];
}

const PRESS: Readonly<Record<Locale, PressCopy>> = {
  en: pressEn,
  fr: pressFr,
};

export function getPressCopy(locale: Locale): PressCopy {
  return PRESS[locale];
}

const APPS: Readonly<Record<AppSlug, Readonly<Record<Locale, AppCopy>>>> = {
  cerebrum: { en: cerebrumEn, fr: cerebrumFr },
};

export function getAppCopy(app: AppSlug, locale: Locale): AppCopy {
  return APPS[app][locale];
}

/**
 * Registre des modules de copie : une entrée par module et par langue.
 * `content-guards.test.ts` parcourt cette liste, c'est donc ici qu'un module
 * devient contrôlé.
 *
 * Quand un module est livré, il s'ajoute ici avec son getter typé
 * (`getAboutCopy`, `getPressCopy`, `getAppCopy`, …) : un getter n'existe pas
 * avant son module, jamais de contenu de remplacement.
 */
export const REGISTERED_COPY: readonly CopyEntry[] = [
  { kind: "hub", locale: "en", copy: hubEn },
  { kind: "hub", locale: "fr", copy: hubFr },
  { kind: "about", locale: "en", copy: aboutEn },
  { kind: "about", locale: "fr", copy: aboutFr },
  { kind: "press", locale: "en", copy: pressEn },
  { kind: "press", locale: "fr", copy: pressFr },
  { kind: "app", app: "cerebrum", locale: "en", copy: cerebrumEn },
  { kind: "app", app: "cerebrum", locale: "fr", copy: cerebrumFr },
];
