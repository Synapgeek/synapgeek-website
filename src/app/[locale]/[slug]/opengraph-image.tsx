import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { getDictionary, getLocale } from "@/content";
import { getAboutCopy, getPressCopy } from "@/content/copy";
import { parseToken } from "@/design/css-token";
import type { Locale } from "@/lib/i18n";
import { resolveSection, sectionParams, type SectionId } from "@/lib/routes";

export { sectionParams as generateStaticParams };

const SIZE = { width: 1200, height: 630 } as const;
const TITLE_FONT_SIZE = { short: 112, long: 88 } as const;
/** Au-delà, le titre ne tient plus sur la colonne de texte à la taille courte. */
const LONG_TITLE_LENGTH = 18;

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
const logo = await readFile(
  path.join(root, "public/images/brand/logo-synapgeek.png"),
);

type Params = Promise<{ locale: string; slug: string }>;

async function sectionFor(params: Params) {
  const { locale: rawLocale, slug } = await params;
  const locale = getLocale(rawLocale);
  const section = resolveSection(locale, slug);
  if (!section) notFound();
  return { locale, section };
}

const HEADING: Record<SectionId, (locale: Locale) => string> = {
  about: (locale) => getAboutCopy(locale).hero.h1,
  press: (locale) => getPressCopy(locale).hero.h1,
};

const IMAGE_ID = "default";

export async function generateImageMetadata({ params }: { params: Params }) {
  const resolved = await params;
  const image = { id: IMAGE_ID, size: SIZE, contentType: "image/png" };
  // Next interroge d'abord la fonction SANS paramètres, pour apprendre les `id`
  // de la route (un seul ici) : ce passage-là n'a pas de page à nommer.
  if (!resolved.slug) return [image];
  const { locale, section } = await sectionFor(params);
  return [{ ...image, alt: HEADING[section](locale) }];
}

/** Titre de la page et marque du studio sur le lavis violet : l'aperçu d'un lien partagé. */
export default async function Image({ params }: { params: Params }) {
  const { locale, section } = await sectionFor(params);
  const title = HEADING[section](locale);
  const { siteName, tagline } = getDictionary(locale).common;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 88px",
        background: colour("--color-wash-violet"),
        color: colour("--color-ink"),
        fontFamily: "Figtree",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: 660,
        }}
      >
        <div style={{ fontSize: 36, fontWeight: 600 }}>{siteName}</div>
        <div
          style={{
            marginTop: 20,
            fontFamily: "Fredoka",
            fontWeight: 700,
            fontSize:
              title.length > LONG_TITLE_LENGTH
                ? TITLE_FONT_SIZE.long
                : TITLE_FONT_SIZE.short,
            lineHeight: 1.05,
            letterSpacing: -2,
            color: colour("--color-brand-violet-deep"),
          }}
        >
          {title}
        </div>
        <div style={{ marginTop: 28, fontSize: 40, fontWeight: 600 }}>
          {tagline}
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
          src={`data:image/png;base64,${logo.toString("base64")}`}
          width={300}
          height={300}
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
