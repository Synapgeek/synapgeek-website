import type { Locale } from "@/lib/i18n";
import { hubEn } from "./en/hub";
import { hubFr } from "./fr/hub";
import type { CopyEntry, HubCopy } from "./types";

export type * from "./types";

const HUB: Readonly<Record<Locale, HubCopy>> = { en: hubEn, fr: hubFr };

export function getHubCopy(locale: Locale): HubCopy {
  return HUB[locale];
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
];
