#!/usr/bin/env node
/**
 * Prévient IndexNow (Bing, Yandex, Naver, Seznam…) des URLs du site qui ont
 * changé : à lancer À LA MAIN, après un déploiement en production, jamais avant.
 * Ce n'est ni une route, ni une variable d'environnement, ni une étape de build.
 *
 * IndexNow ne veut que les URLs ajoutées, modifiées, déplacées ou retirées :
 * le script n'envoie jamais le sitemap entier sans `--all`, et refuse de partir
 * sans critère. La sélection vit dans `indexnow-selection.mjs`.
 *
 * Usage :
 *   npm run indexnow -- /press /fr/presse    → ces URLs (chemins, ou URLs de https://synapgeek.com)
 *   npm run indexnow -- --since 2026-10-28   → les URLs du sitemap dont le lastmod est à cette date ou après
 *   npm run indexnow -- --all                → tout le sitemap (exceptionnel : premier lancement, levée d'un blocage)
 *   … --outside-sitemap                      → accepte un chemin absent du sitemap (URL déplacée ou retirée)
 *   … --dry-run                              → affiche la liste et la charge utile, n'envoie rien
 *   … --dry-run --sitemap <url>              → répétition sur un autre sitemap (http://localhost:3126)
 *
 * Le lastmod vaut l'`updatedAt` de la copie (date de rédaction), pas la date du
 * déploiement : `--since` prend la plus ancienne date `updatedAt` modifiée depuis
 * le dernier envoi, `--dry-run` d'abord pour contrôler la liste.
 *
 * Une URL déplacée s'envoie avec l'ancienne ET la nouvelle adresse ; une URL
 * retirée s'envoie aussi (le moteur lit son 404). L'ancienne adresse n'étant
 * plus au sitemap, il faut `--outside-sitemap` : sans lui, un chemin hors
 * sitemap (souvent une faute de frappe) arrête le script avant tout envoi.
 *
 * La clé est le nom du fichier `public/<32 hex>.txt` (son contenu est la clé
 * elle-même) : une seule source, jamais copiée ici. Elle est publique par
 * conception du protocole, le moteur la vérifie en lisant `keyLocation`.
 */
import { readdirSync, readFileSync } from "node:fs";
import { parseArgs, parseSitemap, selectUrls } from "./indexnow-selection.mjs";

const ORIGIN = "https://synapgeek.com";
const HOST = new URL(ORIGIN).host;
const ENDPOINT = "https://api.indexnow.org/indexnow";
const KEY_FILE = /^([0-9a-f]{32})\.txt$/;
// 200 : reçu et clé validée ; 202 : reçu, validation de la clé en attente.
const ACCEPTED = new Set([200, 202]);

function readKey() {
  const publicDir = new URL("../public/", import.meta.url);
  const candidates = readdirSync(publicDir).filter((name) =>
    KEY_FILE.test(name),
  );
  if (candidates.length !== 1) {
    throw new Error(
      `public/ doit contenir exactement un fichier <32 hex>.txt, trouvé : ${candidates.length}`,
    );
  }
  const key = candidates[0].match(KEY_FILE)[1];
  const content = readFileSync(new URL(candidates[0], publicDir), "utf8");
  if (content.trim() !== key) {
    throw new Error(
      `public/${candidates[0]} doit contenir sa propre clé (${key})`,
    );
  }
  return key;
}

async function sitemapEntries(sitemapUrl) {
  const response = await fetch(sitemapUrl);
  if (!response.ok) {
    throw new Error(`${sitemapUrl} répond ${response.status}`);
  }
  const entries = parseSitemap(await response.text());
  if (entries.length === 0) {
    throw new Error(`${sitemapUrl} ne contient aucune <url>`);
  }
  return entries;
}

async function main() {
  const { dryRun, all, since, sitemap, targets, allowOutsideSitemap } =
    parseArgs(process.argv.slice(2), `${ORIGIN}/sitemap.xml`);
  const key = readKey();
  const { urls, outsideSitemap } = selectUrls({
    origin: ORIGIN,
    entries: await sitemapEntries(sitemap),
    targets,
    since,
    all,
    allowOutsideSitemap,
  });

  console.log(urls.join("\n"));
  for (const url of outsideSitemap) {
    console.warn(`Hors sitemap, acceptée par --outside-sitemap : ${url}`);
  }

  const payload = {
    host: HOST,
    key,
    keyLocation: `${ORIGIN}/${key}.txt`,
    urlList: urls,
  };

  if (dryRun) {
    console.log(JSON.stringify(payload, null, 2));
    console.log(`\nDry run : ${urls.length} URLs, rien envoyé.`);
    return;
  }

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });
  if (!ACCEPTED.has(response.status)) {
    throw new Error(
      `IndexNow répond ${response.status} : ${await response.text()}`,
    );
  }
  console.log(`IndexNow ${response.status} : ${urls.length} URLs envoyées.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
