/**
 * Digital Asset Links — App Links Android.
 *
 * L'empreinte est celle de la clé de **déploiement Play App Signing**, pas celle
 * d'upload : Google resigne l'AAB avec sa propre clé, et c'est donc la sienne que
 * l'appareil vérifie. Les deux sont documentées dans
 * `cerebrum-android/docs/archive/MANUAL_TASKS_2026-09-04.md` (§128 déploiement,
 * §130 upload) ; l'empreinte d'upload `2B:B8:99:DB:…:54:A5` est l'erreur classique.
 *
 * Le manifeste Android déclare l'hôte `www.synapgeek.com` (autoVerify, pathPrefix
 * `/app`). La vérification n'accepte AUCUNE redirection sur `/.well-known/` :
 * tant que `www` répond 308 vers l'apex, ce fichier ne sera pas lu, même déployé.
 *
 * Route handler plutôt que fichier statique, pour garantir le Content-Type et
 * rester symétrique de l'AASA voisin.
 */
const STATEMENTS = [
  {
    relation: ["delegate_permission/common.handle_all_urls"],
    target: {
      namespace: "android_app",
      package_name: "com.synapgeek.cerebrum",
      sha256_cert_fingerprints: [
        "76:67:6C:C0:5C:38:64:C0:0A:89:AB:A0:2D:FB:CD:00:1C:13:68:90:E7:82:2E:0E:2A:E4:9C:66:17:45:D3:5F",
      ],
    },
  },
];

export const dynamic = "force-static";

export function GET() {
  return new Response(JSON.stringify(STATEMENTS), {
    headers: {
      "content-type": "application/json",
      "cache-control": "public, max-age=3600",
    },
  });
}
