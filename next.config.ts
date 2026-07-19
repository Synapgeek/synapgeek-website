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
        // confidentialité — source unique de vérité. C'est cette URL, non localisée, qui est
        // déclarée à Google et citée dans la politique.
        source: "/account-deletion",
        destination: "/privacy#account-deletion",
        // Volontairement temporaire : si la page devient un jour autonome, l'URL ne change pas
        // et aucun 301 mis en cache par les navigateurs ne continuera de pointer vers /privacy.
        permanent: false,
      },
      {
        // Pendant anglais. Sans lui, /en/account-deletion renvoie 404 : le proxy voit un
        // préfixe de locale, laisse passer, et aucune route [locale]/account-deletion n'existe.
        // C'est cette URL-ci qu'on déclare à Google Play, dont la console et les reviewers
        // sont anglophones.
        source: "/en/account-deletion",
        destination: "/en/privacy#account-deletion",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
