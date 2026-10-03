import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { getLocale } from "@/content";
import { getApp } from "@/content/apps";
import { getAppCopy } from "@/content/copy";
import { parseToken } from "@/design/css-token";
import { findPublishedGame, publishedGameParams } from "@/lib/routes";

export { publishedGameParams as generateStaticParams };

const SIZE = { width: 1200, height: 630 } as const;
const NAME_FONT_SIZE = { short: 124, long: 100 } as const;
/** Au-delà, le nom ne tient plus sur la colonne de texte à la taille courte. */
const LONG_NAME_LENGTH = 10;

// Chemins résolus depuis la racine du projet : `next build` y tourne toujours,
// et les fichiers sont lus une fois, au chargement du module.
const root = process.cwd();
const fredoka = await readFile(
  path.join(root, "src/assets/fonts/Fredoka-Bold.ttf"),
);
const figtree = await readFile(
  path.join(root, "src/assets/fonts/Figtree-SemiBold.ttf"),
);
const globalsCss = await readFile(
  path.join(root, "src/app/globals.css"),
  "utf8",
);
const colour = (name: string) => parseToken(globalsCss, name);

type Params = Promise<{ locale: string; game: string }>;

async function gameFor(params: Params) {
  const { locale: rawLocale, game: slug } = await params;
  const locale = getLocale(rawLocale);
  const game = findPublishedGame(locale, slug);
  if (!game) notFound();
  return { locale, game };
}

const IMAGE_ID = "default";

export async function generateImageMetadata({ params }: { params: Params }) {
  const resolved = await params;
  const image = { id: IMAGE_ID, size: SIZE, contentType: "image/png" };
  // Next interroge d'abord la fonction SANS paramètres, pour apprendre les `id`
  // de la route (un seul ici) : ce passage-là n'a pas de jeu à nommer.
  if (!resolved.game) return [image];
  const { locale, game } = await gameFor(params);
  return [{ ...image, alt: game.name[locale] }];
}

/** Icône du jeu, nom et genre sur le lavis du jeu : l'aperçu d'un lien partagé. */
export default async function Image({ params }: { params: Params }) {
  const { locale, game } = await gameFor(params);
  const app = getApp("cerebrum");
  const { sections } = getAppCopy(app.slug, locale);
  const name = game.name[locale];
  // Un classique n'a pas de genre maison : on nomme sa catégorie.
  const line = game.genre[locale] ?? sections.games.categories[game.category];
  const icon = await readFile(
    path.join(root, "src/assets/og-icons", `${game.id}.png`),
  );
  const deep = colour(game.color.deep);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 88px",
        background: colour(game.color.wash),
        color: colour("--color-ink"),
        fontFamily: "Figtree",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: 640,
        }}
      >
        <div style={{ fontSize: 36, fontWeight: 600 }}>{app.name}</div>
        <div
          style={{
            marginTop: 20,
            fontFamily: "Fredoka",
            fontWeight: 700,
            fontSize:
              name.length > LONG_NAME_LENGTH
                ? NAME_FONT_SIZE.long
                : NAME_FONT_SIZE.short,
            lineHeight: 1.05,
            letterSpacing: -2,
            color: deep,
          }}
        >
          {name}
        </div>
        <div style={{ marginTop: 28, fontSize: 44, fontWeight: 600 }}>
          {line}
        </div>
        <div style={{ marginTop: 56, fontSize: 32, fontWeight: 600 }}>
          {app.publisher}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 400,
          height: 400,
          borderRadius: 96,
          background: colour("--color-canvas"),
        }}
      >
        <img
          src={`data:image/png;base64,${icon.toString("base64")}`}
          width={340}
          height={340}
          alt=""
        />
      </div>
    </div>,
    {
      ...SIZE,
      fonts: [
        { name: "Fredoka", data: fredoka, weight: 700, style: "normal" },
        { name: "Figtree", data: figtree, weight: 600, style: "normal" },
      ],
    },
  );
}
