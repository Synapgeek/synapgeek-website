import type { Locale } from "./i18n";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Date ISO (AAAA-MM-JJ) d'une copie, écrite en toutes lettres dans la langue de
 * la page. Calculée en UTC : la date est un jour calendaire, pas un instant,
 * donc le fuseau du serveur de build ne doit jamais la décaler.
 */
export function formatUpdatedAt(isoDate: string, locale: Locale): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  if (!ISO_DATE.test(isoDate) || Number.isNaN(date.getTime())) {
    throw new Error(`Date attendue au format AAAA-MM-JJ : ${isoDate}`);
  }
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(date);
}
