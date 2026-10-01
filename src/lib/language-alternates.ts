// Module sans import de `routes.ts` : le registre des jeux qu'il tire ne doit pas
// entrer dans le bundle client. Le tableau est construit côté serveur
// (language-switch-table.ts) et seule la consultation s'exécute dans le navigateur.
import type { Locale } from "./i18n";

/** Chemin public d'une même page dans chaque langue. */
export type LanguageAlternates = Readonly<Record<Locale, string>>;

export interface LanguageSwitchTable {
  /** Clé : chemin public ou chemin servi (`/privacy` et `/fr/privacy`), sans ancre. */
  readonly pages: Readonly<Record<string, LanguageAlternates>>;
  /** Accueil de chaque langue, pour un chemin absent du tableau (ex. 404). */
  readonly fallback: LanguageAlternates;
}

export function alternatesForPathname(
  table: LanguageSwitchTable,
  pathname: string,
): LanguageAlternates {
  return table.pages[pathname] ?? table.fallback;
}
