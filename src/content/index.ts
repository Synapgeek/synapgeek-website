import type { Locale } from "@/lib/i18n";
import { DEFAULT_LOCALE, LOCALES } from "@/lib/i18n";
import type { Dictionary } from "./types";
import fr from "./fr";
import en from "./en";

export type { Dictionary };

const dictionaries: Record<Locale, Dictionary> = { fr, en };

export function getDictionary(locale: string): Dictionary {
  const validLocale: Locale = (LOCALES as readonly string[]).includes(locale)
    ? (locale as Locale)
    : DEFAULT_LOCALE;
  return dictionaries[validLocale];
}

export function getLocale(locale: string): Locale {
  return (LOCALES as readonly string[]).includes(locale)
    ? (locale as Locale)
    : DEFAULT_LOCALE;
}
