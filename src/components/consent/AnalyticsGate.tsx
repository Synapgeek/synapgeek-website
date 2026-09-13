"use client";

import { useEffect, useState, type ComponentType } from "react";

/**
 * AnalyticsGate — frontière client intermédiaire entre `ConsentBootstrap`
 * (Server Component) et `AnalyticsLoader` (Client Component). Un Server
 * Component qui importe statiquement un Client Component monté dans un
 * layout partagé par toutes les routes voit ce chunk préchargé sur CHAQUE
 * route, même quand un test d'exécution (`gaId &&`) l'empêcherait de
 * s'afficher : sans cette frontière, le code de chargement de gtag.js
 * finirait référencé partout, y compris si `NEXT_PUBLIC_GA_MEASUREMENT_ID`
 * n'est jamais renseignée.
 *
 * L'`import()` natif ci-dessous, dans un `useEffect`, obtient le même
 * découpage en chunk qu'un `next/dynamic` sans en payer la couche
 * (gestion d'erreur, `preload-chunks`…) : il ne se déclenche que si `gaId`
 * est non-`null`, jamais au chargement du module lui-même — en état inerte,
 * le navigateur ne demande donc jamais ce chunk.
 */
type AnalyticsLoaderComponent = ComponentType<{ gaId: string }>;

export function AnalyticsGate({ gaId }: { gaId: string | null }) {
  const [Loader, setLoader] = useState<AnalyticsLoaderComponent | null>(null);

  useEffect(() => {
    if (!gaId) return;
    let cancelled = false;
    import("@/components/consent/AnalyticsLoader")
      .then((mod) => {
        if (!cancelled) setLoader(() => mod.AnalyticsLoader);
      })
      .catch(() => {
        // Chunk injoignable (réseau, rotation de déploiement) — un tiers
        // indisponible ne casse jamais le site : `Loader` reste `null`, ce
        // composant continue de rendre `null`.
        console.error(
          "AnalyticsGate: échec du chargement d'AnalyticsLoader — analytics restera inerte pour cette session.",
        );
      });
    return () => {
      cancelled = true;
    };
  }, [gaId]);

  if (!gaId || !Loader) return null;
  return <Loader gaId={gaId} />;
}
