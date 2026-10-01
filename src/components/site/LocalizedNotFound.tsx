"use client";

import { useParams } from "next/navigation";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";
import { NotFoundView, type NotFoundStrings } from "./NotFoundView";

/**
 * 404 du segment `[locale]`. Un `not-found.tsx` ne reçoit pas les params de la
 * route : cette feuille cliente lit `useParams()` pour choisir parmi les textes
 * que le serveur lui passe (un jeu par langue). Langue inconnue : celle par défaut.
 */
export function LocalizedNotFound({
  strings,
}: {
  strings: Readonly<Record<Locale, NotFoundStrings>>;
}) {
  const { locale } = useParams<{ locale?: string }>();
  const selected =
    locale !== undefined && locale in strings
      ? strings[locale as Locale]
      : strings[DEFAULT_LOCALE];

  return <NotFoundView {...selected} />;
}
