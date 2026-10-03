import type { NextConfig } from "next";
// Imports RELATIFS et sans alias : next.config.ts est chargé avant la résolution de `@/`.
// Ces deux modules n'ont eux-mêmes aucun import (une URL = une seule source).
import { FROZEN_LEGAL_PATHS } from "./src/lib/frozen-legal-paths";
import { GAME_SLUGS, SECTION_SLUGS } from "./src/lib/page-slugs";

type Redirect = Awaited<
  ReturnType<NonNullable<NextConfig["redirects"]>>
>[number];

/**
 * Spec §5.2 : l'anglais a quitté `/en` pour la racine. Une règle LITTÉRALE par ancienne page
 * anglaise non légale (plan, amendement 5) : ni regex, ni lookahead, ni `/en/:path*`, pour
 * que rien ne puisse capter `/en/privacy`, `/en/terms`, `/en/legal` (contrat figé, servis en
 * anglais) ni les `…/opengraph-image*`. Une nouvelle page anglaise n'a jamais besoin de règle
 * ici : elle naît sans préfixe.
 */
const LEGACY_ENGLISH_PATHS: readonly string[] = [
  "/cerebrum",
  ...Object.values(GAME_SLUGS).map((slug) => `/cerebrum/${slug.en}`),
  ...Object.values(SECTION_SLUGS).map((slug) => `/${slug.en}`),
];

// Garde-fou : un slug futur qui coïnciderait avec une page légale figée casserait une URL
// déclarée dans les stores. On échoue au chargement de la config plutôt que de rediriger.
for (const frozen of FROZEN_LEGAL_PATHS) {
  if (LEGACY_ENGLISH_PATHS.includes(frozen)) {
    throw new Error(`Redirection /en${frozen} interdite : URL légale figée.`);
  }
}

const legacyEnglishRedirects: Redirect[] = [
  // Spec §5.2 : `/en` redirige en 308 vers `/`. Next fusionne la query entrante dans la
  // destination, donc `/en?utm_source=x` devient `/?utm_source=x`.
  { source: "/en", destination: "/", permanent: true },
  // Spec §5.2 : pages anglaises non légales, 308 vers leur pendant sans préfixe.
  ...LEGACY_ENGLISH_PATHS.map(
    (path): Redirect => ({
      source: `/en${path}`,
      destination: path,
      permanent: true,
    }),
  ),
];

// Lien « Contact » des apps installées (iOS LegalURLProvider.swift, Android
// LegalUrlProvider.kt, identique dans toutes les versions publiées). L'app émet la racine
// en français et `/en` dans toutes les autres langues : la langue est dans l'URL, ce n'est
// pas une négociation. `hl=en` marque les joueurs non français pour que la règle de la
// racine ne les capte pas. 307 pour que la DESTINATION reste modifiable (jamais mise en cache
// par les navigateurs) ; la règle elle-même est permanente : ne jamais la retirer tant que des
// versions de l'app émettent cette URL (src/app/CLAUDE.md règle 3).
// `has.value` est une expression régulière. Mesure : le matcheur de Next ancre déjà la valeur
// (`utm_medium=apps` et `utm_source=cerebrum2` ne déclenchent pas la règle, même sans `^…$`).
// Les ancres explicites restent : le routeur de Vercel est une autre implémentation, que
// cette suite ne peut pas exercer, et elles ne coûtent rien.
const APP_CONTACT_QUERY: NonNullable<Redirect["has"]> = [
  { type: "query", key: "utm_source", value: "^cerebrum$" },
  { type: "query", key: "utm_medium", value: "^app$" },
];

const appContactRedirects: Redirect[] = [
  {
    source: "/",
    has: APP_CONTACT_QUERY,
    missing: [{ type: "query", key: "hl" }],
    destination: "/fr",
    permanent: false,
  },
  {
    source: "/en",
    has: APP_CONTACT_QUERY,
    destination: "/?hl=en",
    permanent: false,
  },
];

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        // Google Play EXIGE une « web link resource » permettant de demander la suppression
        // de son compte, distincte du chemin in-app, et cette URL est un champ OBLIGATOIRE du
        // formulaire Data Safety.
        // https://support.google.com/googleplay/android-developer/answer/13327111
        //
        // Plutôt qu'une page en double à maintenir, on expose une URL dont le nom dit ce
        // qu'elle contient et on redirige vers la section correspondante de la politique de
        // confidentialité — source unique de vérité. C'est cette URL-ci, non localisée
        // (https://synapgeek.com/account-deletion), qui est déclarée dans la Play Console ;
        // chaque locale de la politique cite son pendant dans sa section « Suppression de compte ».
        source: "/account-deletion",
        destination: "/privacy#account-deletion",
        // Volontairement temporaire : si la page devient un jour autonome, l'URL ne change pas
        // et aucun 301 mis en cache par les navigateurs ne continuera de pointer vers /privacy.
        permanent: false,
      },
      {
        // Pendants localisés, par commodité et par symétrie avec /privacy, /fr/privacy et
        // /en/privacy. Sans eux, le proxy voit un préfixe de locale, laisse passer, et aucune
        // route [locale]/account-deletion n'existe → 404. Ces URLs ne sont PAS déclarées à
        // Google Play (seule l'URL nue ci-dessus l'est).
        source: "/en/account-deletion",
        destination: "/en/privacy#account-deletion",
        permanent: false,
      },
      {
        // Destination sans préfixe : l'URL canonique FR est /privacy (locale par défaut).
        source: "/fr/account-deletion",
        destination: "/privacy#account-deletion",
        permanent: false,
      },
      {
        // Le QR imprimé sur les chevalets de comptoir encode désormais
        // https://synapgeek.com/cerebrum/play (route canonique, portée par l'app). `/play` est
        // l'URL des premiers QR : elle doit continuer de répondre, vers la même destination.
        // Les redirections de config passent AVANT le proxy : `/play` n'est jamais réécrit en
        // `/fr/play`. Aucune query dans `destination` : Next y fusionne la query entrante, et
        // la query de la destination l'emporterait en cas de conflit.
        // Volontairement temporaire (307) : si ces alias sont un jour retirés ou déplacés, aucun
        // 301 mis en cache ne continuera de pointer ici.
        source: "/play",
        destination: "/cerebrum/play",
        permanent: false,
      },
      {
        // `/jouer` : URL encodée par les maquettes provisoires des QR, jamais servie en
        // production (404). Alias de précaution si l'une d'elles a été imprimée.
        source: "/jouer",
        destination: "/cerebrum/play",
        permanent: false,
      },
      ...appContactRedirects,
      ...legacyEnglishRedirects,
    ];
  },
};

export default nextConfig;
