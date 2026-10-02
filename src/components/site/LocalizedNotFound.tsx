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

  return (
    <>
      {/* Un notFound() levé dans generateMetadata (slug inconnu) fait disparaître toute
          métadonnée, `<title>` racine compris : l'onglet resterait sans nom. React 19 remonte
          ce <title> dans <head>, dès le rendu serveur. La 404 racine n'en pose pas : son
          titre vient de `metadata` (un second <title> serait ignoré et invaliderait le HTML). */}
      <title>{`${selected.title} | Synapgeek`}</title>
      <NotFoundView {...selected} />
    </>
  );
}
