import Image from "next/image";
import { InternalLink } from "@/components/ui/InternalLink";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { APP_STORE_QR_URL, GOOGLE_PLAY_URL } from "@/lib/app";
import { localeFromAcceptLanguage } from "@/lib/accept-language";
import { formatPublishedGameNames } from "@/lib/play-games";
import { pagePath } from "@/lib/routes";
import { STORE_BADGES } from "@/lib/store-badges";
import { getDictionary } from "@/content";
import { FONT_VARIABLES } from "@/app/fonts";

/**
 * /cerebrum/play — cible des QR codes imprimés (chevalets de comptoir).
 *
 * Cette URL est encodée dans du carton qui vivra des mois : elle ne doit JAMAIS
 * changer ni disparaître. Les anciennes URLs `/play` et `/jouer` y redirigent en
 * 307 (voir `next.config.ts`), query string conservée. Elle ne figure volontairement PAS dans les fichiers
 * d'association (.well-known) : un téléphone qui a déjà l'app doit passer par le
 * store, pas ouvrir l'app — c'est le seul comportement prévisible pour un scan.
 *
 * Seul le repli (desktop, iPad, robot) se localise : français si l'en-tête
 * Accept-Language préfère le français, anglais sinon. La redirection, elle, ne
 * lit que le User-Agent et passe avant tout le reste.
 *
 * Seule route du site rendue à la demande : détecter la plateforme impose de lire
 * l'en-tête User-Agent, ce qu'un rendu statique ne permet pas. Tout le reste du
 * site reste en SSG.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = localeFromAcceptLanguage(
    (await headers()).get("accept-language"),
  );
  return {
    title: getDictionary(locale).play.title,
    // Page de service, sans contenu propre : hors index et hors sitemap.
    robots: { index: false, follow: false },
  };
}

/**
 * Renvoie la destination store, ou null s'il faut afficher le repli.
 *
 * iPadOS 13+ envoie un User-Agent de Mac sur un iPad en mode « bureau » (le
 * défaut). Rien, côté serveur, ne distingue alors un iPad d'un MacBook —
 * `navigator.maxTouchPoints` n'existe qu'au navigateur. Plutôt que de rediriger
 * tous les Mac vers l'App Store, ces iPads tombent sur le repli à deux boutons :
 * une tape de plus, jamais une mauvaise destination.
 */
function storeUrlFor(userAgent: string): string | null {
  if (/iPhone|iPad|iPod/i.test(userAgent)) return APP_STORE_QR_URL;
  if (/Android/i.test(userAgent)) return GOOGLE_PLAY_URL;
  return null;
}

/**
 * Transmet les paramètres reçus (?src=…) à l'URL de sortie, sans rien inventer
 * et sans jamais écraser un paramètre déjà présent sur la cible.
 *
 * `url.searchParams.set` écraserait un paramètre existant : un simple
 * `/cerebrum/play?id=com.autre.app` enverrait alors un Android vers la fiche Play d'une
 * AUTRE app depuis synapgeek.com, et `/cerebrum/play?ct=x&pt=y` fausserait le jeton de
 * campagne Apple. On ignore donc toute clé entrante déjà présente sur la
 * cible ; seuls les paramètres de campagne réellement absents (ex. `?src=…`)
 * sont ajoutés.
 */
function withIncomingParams(
  target: string,
  incoming: Record<string, string | string[] | undefined>,
): string {
  const url = new URL(target);
  for (const [key, value] of Object.entries(incoming)) {
    if (value === undefined) continue;
    if (url.searchParams.has(key)) continue;
    url.searchParams.set(key, Array.isArray(value) ? value[0] : value);
  }
  return url.toString();
}

export default async function PlayPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const userAgent = (await headers()).get("user-agent") ?? "";
  const target = storeUrlFor(userAgent);

  if (target) redirect(withIncomingParams(target, await searchParams));

  // Calculé après la redirection : un scan mobile n'a pas besoin du texte.
  const locale = localeFromAcceptLanguage(
    (await headers()).get("accept-language"),
  );
  const dict = getDictionary(locale);
  const badges = STORE_BADGES[locale];
  const badgeLink =
    "rounded-lg transition-transform duration-150 ease-out active:scale-[0.97]";

  // Repli : desktop, iPad en mode bureau, robot, User-Agent vide.
  // Aucune redirection au hasard, et aucun JavaScript nécessaire.
  return (
    <html lang={locale}>
      <body className={`${FONT_VARIABLES} antialiased`}>
        <main className="flex min-h-screen flex-col items-center justify-center bg-canvas-soft px-gutter py-section text-center">
          <Image
            src="/images/brand/cerebrum-icon.png"
            alt=""
            width={96}
            height={96}
            className="mb-8 rounded-[22%] shadow-raised"
            priority
          />
          <h1 className="text-5xl leading-none tracking-[-0.03em] sm:text-6xl">
            Cerebrum
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-text-secondary">
            {dict.play.gamesIntro}
            {formatPublishedGameNames(locale)}. {dict.play.chooseStore}
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <a
              href={APP_STORE_QR_URL}
              aria-label={dict.common.stores.appStoreLabel}
              className={badgeLink}
            >
              <Image
                src={badges.appStore}
                alt=""
                width={badges.appStoreWidth}
                height={40}
                className="h-11 w-auto"
              />
            </a>
            <a
              href={GOOGLE_PLAY_URL}
              aria-label={dict.common.stores.googlePlayLabel}
              className={badgeLink}
            >
              <Image
                src={badges.googlePlay}
                alt=""
                width={badges.googlePlayWidth}
                height={badges.googlePlayHeight}
                className="h-11 w-auto"
              />
            </a>
          </div>

          <InternalLink
            href={pagePath("home", locale)}
            className="mt-12 rounded-sm font-bold text-ink underline underline-offset-4"
          >
            {dict.common.siteName}
          </InternalLink>
        </main>
      </body>
    </html>
  );
}
