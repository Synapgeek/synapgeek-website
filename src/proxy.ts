import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_LOCALE, LOCALES } from "@/lib/i18n";

/**
 * Routes servies hors du segment `[locale]`, que le proxy ne doit donc jamais
 * préfixer : réécrire `/play` en `/fr/play` chercherait un segment
 * `[locale]/play` inexistant et rendrait 404. Le fichier de route l'emporte sur
 * le segment dynamique côté App Router, mais seulement si la requête lui parvient
 * telle quelle.
 */
const LOCALE_FREE_ROUTES = ["/play"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    LOCALE_FREE_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    )
  ) {
    return NextResponse.next();
  }

  // Check if the pathname already starts with a locale
  const hasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (hasLocale) return NextResponse.next();

  // Rewrite to default locale (FR) — URL stays clean, no /fr/ prefix
  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next|api|favicon\\.ico|.*\\..*).*)"],
};
