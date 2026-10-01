import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_LOCALE, LOCALES } from "@/lib/i18n";
import {
  FROZEN_LEGAL_LOCALE,
  FROZEN_LEGAL_PATHS,
} from "@/lib/frozen-legal-paths";

/**
 * Routes servies hors du segment `[locale]`, que le proxy ne doit donc jamais
 * préfixer : réécrire `/cerebrum/play` en `/en/cerebrum/play` chercherait un
 * segment `[locale]/cerebrum/play` inexistant et rendrait 404. Le dossier statique
 * l'emporte sur le segment dynamique côté App Router, mais seulement si la requête
 * lui parvient telle quelle. Route exacte et sous-chemins uniquement : `/cerebrum`
 * seul n'est PAS exempté et reste réécrit comme toute page localisée. Ne jamais
 * créer `[locale]/cerebrum/play`.
 */
const LOCALE_FREE_ROUTES = ["/cerebrum/play"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    LOCALE_FREE_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    )
  ) {
    return NextResponse.next();
  }

  const hasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (hasLocale) return NextResponse.next();

  // Réécriture, jamais redirection : l'URL du visiteur reste celle qu'il a saisie.
  // Les pages légales sans préfixe sont déclarées dans App Store Connect, la Play
  // Console et l'UMP, et l'app installée les ouvre en attendant du français : elles
  // gardent leur langue historique (spec §5.2). Tout le reste suit la locale par défaut.
  const url = request.nextUrl.clone();
  const isFrozenLegal = (FROZEN_LEGAL_PATHS as readonly string[]).includes(
    pathname,
  );
  const locale = isFrozenLegal ? FROZEN_LEGAL_LOCALE : DEFAULT_LOCALE;
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next|api|favicon\\.ico|.*\\..*).*)"],
};
