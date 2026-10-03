#!/usr/bin/env node
/**
 * Prévient IndexNow (Bing, Yandex, Naver, Seznam…) que les pages du site ont
 * changé : à lancer À LA MAIN, une fois, après un déploiement en production.
 * Ce n'est ni une route, ni une variable d'environnement, ni une étape de build.
 *
 * Usage :
 *   npm run indexnow                        → lit https://synapgeek.com/sitemap.xml, envoie les URLs
 *   npm run indexnow -- --dry-run           → affiche la charge utile, n'envoie rien
 *   npm run indexnow -- --sitemap <url>     → lit un autre sitemap (répétition sur http://localhost:3126)
 *
 * La clé est le nom du fichier `public/<32 hex>.txt` (son contenu est la clé
 * elle-même) : une seule source, jamais copiée ici. Elle est publique par
 * conception du protocole, le moteur la vérifie en lisant `keyLocation`.
 *
 * Les URLs envoyées sont celles du sitemap, donc les URLs canoniques. Le script
 * refuse d'envoyer quoi que ce soit hors de https://synapgeek.com : une URL
 * d'un autre hôte ferait rejeter tout le lot.
 */
import { readdirSync, readFileSync } from "node:fs";

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

function parseArgs(argv) {
  const options = { dryRun: false, sitemap: `${ORIGIN}/sitemap.xml` };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--dry-run") options.dryRun = true;
    else if (argv[i] === "--sitemap" && argv[i + 1])
      options.sitemap = argv[++i];
    else throw new Error(`Argument inconnu : ${argv[i]}`);
  }
  return options;
}

async function sitemapUrls(sitemapUrl) {
  const response = await fetch(sitemapUrl);
  if (!response.ok) {
    throw new Error(`${sitemapUrl} répond ${response.status}`);
  }
  // Seules les balises <loc> comptent : les alternates hreflang sont des <xhtml:link>.
  const urls = [
    ...(await response.text()).matchAll(/<loc>([^<]+)<\/loc>/g),
  ].map((match) => match[1].trim());
  if (urls.length === 0)
    throw new Error(`${sitemapUrl} ne contient aucune <loc>`);
  const foreign = urls.filter((url) => new URL(url).host !== HOST);
  if (foreign.length > 0) {
    throw new Error(`URLs hors de ${HOST} : ${foreign.join(", ")}`);
  }
  return urls;
}

async function main() {
  const { dryRun, sitemap } = parseArgs(process.argv.slice(2));
  const key = readKey();
  const payload = {
    host: HOST,
    key,
    keyLocation: `${ORIGIN}/${key}.txt`,
    urlList: await sitemapUrls(sitemap),
  };

  if (dryRun) {
    console.log(JSON.stringify(payload, null, 2));
    console.log(`\nDry run : ${payload.urlList.length} URLs, rien envoyé.`);
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
  console.log(
    `IndexNow ${response.status} : ${payload.urlList.length} URLs envoyées.`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
