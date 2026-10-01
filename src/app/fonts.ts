import { Fredoka, Figtree } from "next/font/google";

/**
 * Polices du site, déclarées une seule fois : le layout de langue ET la 404
 * racine (qui rend son propre `<html>`, hors du segment `[locale]`) les posent
 * sur `<body>`.
 */
export const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700"],
  display: "swap",
});

// Police variable : sans `weight`, next/font charge l'axe complet (400 à 800
// compris). Une liste explicite de graisses fait échouer le build Turbopack
// ("next/font/google queries have exactly one entry") sur Next 16.3.8.
export const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

/** Classes à poser sur `<body>` pour exposer les deux variables de police. */
export const FONT_VARIABLES = `${fredoka.variable} ${figtree.variable}`;
