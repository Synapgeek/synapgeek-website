import type { Metadata } from "next";
import { getApp } from "@/content/apps";

/**
 * Smart App Banner de Safari : seulement sur Cerebrum et ses pages jeux (spec
 * §5). Ce layout n'a ni `<html>` ni `<body>` : ceux du segment `[locale]`
 * enveloppent déjà la page.
 */
export const metadata: Metadata = {
  itunes: { appId: getApp("cerebrum").appStoreId },
};

export default function CerebrumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
