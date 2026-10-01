import type { CopyEntry } from "./types";

export type * from "./types";

/**
 * Registre des modules de copie : une entrée par module et par langue.
 * `content-guards.test.ts` parcourt cette liste, c'est donc ici qu'un module
 * devient contrôlé.
 *
 * Quand un module est livré (hub, à propos, presse, copie d'une app), il
 * s'ajoute ici avec son getter typé (`getHubCopy`, `getAppCopy`, …) : un getter
 * n'existe pas avant son module, jamais de contenu de remplacement.
 */
export const REGISTERED_COPY: readonly CopyEntry[] = [];
