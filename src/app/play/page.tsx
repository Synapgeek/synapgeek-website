import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { APP_STORE_QR_URL, GOOGLE_PLAY_URL } from "@/lib/app";
import { getDictionary } from "@/content";

/**
 * /play — cible des QR codes imprimés (chevalets de comptoir).
 *
 * Cette URL est encodée dans du carton qui vivra des mois : elle ne doit JAMAIS
 * changer ni disparaître. Elle ne figure volontairement PAS dans les fichiers
 * d'association (.well-known) : un téléphone qui a déjà l'app doit passer par le
 * store, pas ouvrir l'app — c'est le seul comportement prévisible pour un scan.
 *
 * Seule route du site rendue à la demande : détecter la plateforme impose de lire
 * l'en-tête User-Agent, ce qu'un rendu statique ne permet pas. Tout le reste du
 * site reste en SSG.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Télécharger Cerebrum",
  // Page de service, sans contenu propre : hors index et hors sitemap.
  robots: { index: false, follow: false },
};

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

/** Compose « A, B, C et D. » à partir des titres de jeux du dictionnaire FR. */
function formatGamesList(titles: readonly string[]): string {
  if (titles.length === 0) return "";
  if (titles.length === 1) return `${titles[0]}.`;
  return `${titles.slice(0, -1).join(", ")} et ${titles[titles.length - 1]}.`;
}

/** Transmet les paramètres reçus (?src=…) à l'URL de sortie, sans rien inventer. */
function withIncomingParams(
  target: string,
  incoming: Record<string, string | string[] | undefined>,
): string {
  const url = new URL(target);
  for (const [key, value] of Object.entries(incoming)) {
    if (value === undefined) continue;
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

  // Calculée après la redirection : un scan mobile n'a pas besoin du texte.
  const gamesList = formatGamesList(
    getDictionary("fr").landing.features.items.map((item) => item.title),
  );

  // Repli : desktop, iPad en mode bureau, robot, User-Agent vide.
  // Aucune redirection au hasard, et aucun JavaScript nécessaire.
  return (
    <html lang="fr">
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <Image
            src="/images/brand/cerebrum-icon.png"
            alt=""
            width={88}
            height={88}
            className="mb-8 rounded-[22%]"
            priority
          />
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Cerebrum
          </h1>
          <p className="mt-3 max-w-sm text-lg text-text-secondary">
            {gamesList} Choisissez votre store pour installer
            l&apos;application.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <a
              href={APP_STORE_QR_URL}
              className="transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              <Image
                src="/images/brand/badge-appstore-fr.svg"
                alt="Télécharger dans l'App Store"
                width={127}
                height={40}
                className="h-[48px] w-auto"
              />
            </a>
            <a
              href={GOOGLE_PLAY_URL}
              className="transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              <Image
                src="/images/brand/badge-googleplay-fr.png"
                alt="Disponible sur Google Play"
                width={646}
                height={192}
                className="h-[48px] w-auto"
              />
            </a>
          </div>

          <Link
            href="/"
            className="mt-12 text-sm text-text-secondary underline underline-offset-4"
          >
            synapgeek.com
          </Link>
        </main>
      </body>
    </html>
  );
}
