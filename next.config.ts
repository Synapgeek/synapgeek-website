import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ];
  },
};

export default nextConfig;
