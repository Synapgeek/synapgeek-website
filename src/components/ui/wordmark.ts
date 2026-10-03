import type { CSSProperties } from "react";
import type { AppEntry } from "@/content/apps";

/**
 * La couleur du nom d'une app dans ses titres : le jeton que nomme son entrée du
 * registre (`wordmarkColor`, défini dans globals.css). Grand texte seulement.
 */
export function wordmarkStyle(
  app: Pick<AppEntry, "wordmarkColor">,
): CSSProperties {
  return { color: `var(${app.wordmarkColor})` };
}
