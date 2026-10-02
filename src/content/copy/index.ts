import type { Locale } from "@/lib/i18n";
import type { AppSlug } from "@/content/apps";
import { cerebrumEn } from "@/content/apps/cerebrum/copy/en";
import { cerebrumFr } from "@/content/apps/cerebrum/copy/fr";
import { hubEn } from "./en/hub";
import { hubFr } from "./fr/hub";
import type { AppCopy, CopyEntry, HubCopy } from "./types";

export type * from "./types";

const HUB: Readonly<Record<Locale, HubCopy>> = { en: hubEn, fr: hubFr };

export function getHubCopy(locale: Locale): HubCopy {
  return HUB[locale];
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
 * Quand un module est livré (à propos, presse, copie d'une app), il s'ajoute
 * ici avec son getter typé (`getAboutCopy`, `getAppCopy`, …) : un getter
 * n'existe pas avant son module, jamais de contenu de remplacement.
 */
export const REGISTERED_COPY: readonly CopyEntry[] = [
  { kind: "hub", locale: "en", copy: hubEn },
  { kind: "hub", locale: "fr", copy: hubFr },
  { kind: "app", app: "cerebrum", locale: "en", copy: cerebrumEn },
  { kind: "app", app: "cerebrum", locale: "fr", copy: cerebrumFr },
];
