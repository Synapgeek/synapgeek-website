import type { Locale } from "@/lib/i18n";

/**
 * Langue du repli de /cerebrum/play, d'après l'en-tête Accept-Language : le
 * français si la langue préférée est du français (`fr`, `fr-CA`…), l'anglais
 * dans tous les autres cas, y compris sans en-tête ou avec un en-tête illisible.
 *
 * « Préférée » = le q le plus haut, à égalité le premier cité. Une entrée dont
 * le q est absent vaut 1 ; une entrée à q=0 ou dont le q est illisible est
 * ignorée, jamais devinée.
 */
export function localeFromAcceptLanguage(header: string | null): Locale {
  let best: { tag: string; q: number } | null = null;

  for (const entry of (header ?? "").split(",")) {
    const [rawTag, ...params] = entry.split(";").map((part) => part.trim());
    if (!rawTag) continue;

    let q = 1;
    for (const param of params) {
      const match = /^q=(\d(?:\.\d{0,3})?)$/i.exec(param);
      if (param.toLowerCase().startsWith("q="))
        q = match ? Number(match[1]) : NaN;
    }
    if (!(q > 0)) continue;

    if (best === null || q > best.q) best = { tag: rawTag, q };
  }

  return best?.tag.toLowerCase().split("-")[0] === "fr" ? "fr" : "en";
}
