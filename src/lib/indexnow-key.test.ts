import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";

/**
 * La clé IndexNow est le nom du fichier `public/<32 hex>.txt`, et son contenu
 * est la clé elle-même. `scripts/indexnow-ping.mjs` lit la clé dans ce nom ; si
 * le fichier disparaît ou se désaccorde, le moteur ne peut plus la vérifier et
 * ignore tous les envois, sans rien signaler.
 */
describe("clé IndexNow", () => {
  const keyFiles = readdirSync("public").filter((name) =>
    /^[0-9a-f]{32}\.txt$/.test(name),
  );

  it("existe en un seul exemplaire à la racine du site", () => {
    expect(keyFiles).toHaveLength(1);
  });

  it("contient sa propre clé, et rien d'autre", () => {
    const [file] = keyFiles;
    expect(readFileSync(`public/${file}`, "utf8").trim()).toBe(
      file.replace(/\.txt$/, ""),
    );
  });
});
