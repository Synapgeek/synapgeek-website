"use client";

import { usePathname } from "next/navigation";
import {
  alternatesForPathname,
  type LanguageAlternates,
  type LanguageSwitchTable,
} from "@/lib/language-alternates";

/** La page courante dans chaque langue, d'après le tableau construit côté serveur. */
export function useLanguageAlternates(
  table: LanguageSwitchTable,
): LanguageAlternates {
  return alternatesForPathname(table, usePathname());
}
