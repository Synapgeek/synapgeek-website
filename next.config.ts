import type { NextConfig } from "next";

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
    ];
  },
};

export default nextConfig;
