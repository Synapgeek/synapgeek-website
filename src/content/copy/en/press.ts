import type { PressCopy } from "../types";

export const pressEn: PressCopy = {
  updatedAt: "2026-10-02",
  meta: {
    title: "Press kit: Cerebrum fact sheet, logo and screenshots | Synapgeek",
    description:
      "Synapgeek press page: Cerebrum fact sheet, the named list of games, logo, app icon and screenshots to download, and the press contact.",
  },
  hero: {
    h1: "Synapgeek press kit",
    definition:
      "The facts to quote about Synapgeek, an independent French studio, and about Cerebrum, its offline puzzle games app for iPhone, iPad and Android, with the logo, the app icon and screenshots to download.",
  },
  factSheet: {
    title: "Cerebrum fact sheet",
    rows: [
      { label: "App", value: "Cerebrum" },
      {
        label: "Publisher",
        value:
          "Synapgeek SAS, an independent French studio",
      },
      { label: "Type", value: "Puzzle games app that plays offline" },
      {
        label: "Platforms",
        value:
          "iPhone and iPad (iOS 17.0 or later), Android (Android 8.0 or later)",
      },
      {
        label: "Availability",
        value: "On the App Store since June 3, 2026, and on Google Play",
      },
      {
        label: "Languages",
        value:
          "16 interface languages. Crossword and Word Search grids exist in French and English only.",
      },
      {
        label: "Business model",
        value:
          "Free to download and supported by a banner during play and ads between some games; rewarded ads are always optional, the Premium subscription (weekly, monthly or yearly) means no forced ads, and in-app purchases (gem packs and the Movies, Cooking and Travel theme packs) are optional.",
      },
    ],
  },
  games: {
    title: "The games, by genre",
    intro: "Each game is named with its genre and links to its own page.",
  },
  publisher: { title: "The publisher" },
  downloads: {
    title: "Downloads",
    intro:
      "The studio logo, the Cerebrum icon and four screenshots of version 3.0.0, in English.",
    items: [
      { label: "Synapgeek logo", href: "/press/synapgeek-logo-v3.png" },
      { label: "Cerebrum icon", href: "/press/cerebrum-icon-v3.png" },
      {
        label: "Screenshot: home",
        href: "/press/cerebrum-screen-home-en-v3.webp",
      },
      {
        label: "Screenshot: daily challenge",
        href: "/press/cerebrum-screen-daily-en-v3.webp",
      },
      {
        label: "Screenshot: progression",
        href: "/press/cerebrum-screen-progression-en-v3.webp",
      },
      {
        label: "Screenshot: Sudoku",
        href: "/press/cerebrum-screen-sudoku-en-v3.webp",
      },
    ],
  },
  contact: {
    title: "Press contact",
    body: "For a press request, an image or a detail to check, write to us.",
  },
};
