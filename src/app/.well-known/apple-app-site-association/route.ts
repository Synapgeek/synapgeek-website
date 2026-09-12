/**
 * Apple App Site Association — liens universels iOS.
 *
 * Apple impose trois choses, toutes non négociables :
 *   1. l'URL n'a PAS d'extension de fichier ;
 *   2. le Content-Type est `application/json` ;
 *   3. la réponse est servie en HTTPS, sans redirection.
 *
 * D'où ce route handler plutôt qu'un fichier dans `public/.well-known/` : sur
 * Vercel, un fichier sans extension y sort en `application/octet-stream` et
 * Apple le rejette silencieusement.
 *
 * `appID` = TeamID.bundleID. Le bundle iOS (`com.synapgeek.cerebrumgame`) diffère
 * du package Android (`com.synapgeek.cerebrum`) : ce n'est pas une coquille.
 *
 * `/play` est volontairement absent des `components` : un téléphone équipé de
 * l'app doit passer par le store au scan du QR, pas ouvrir l'app.
 */
const ASSOCIATION = {
  applinks: {
    details: [
      {
        appIDs: ["6ZSKBP3TL7.com.synapgeek.cerebrumgame"],
        components: [{ "/": "/app/*" }],
      },
    ],
  },
};

export const dynamic = "force-static";

export function GET() {
  return new Response(JSON.stringify(ASSOCIATION), {
    headers: {
      "content-type": "application/json",
      "cache-control": "public, max-age=3600",
    },
  });
}
