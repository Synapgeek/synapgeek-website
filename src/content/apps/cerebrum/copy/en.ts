import type { AppCopy } from "@/content/copy/types";
import { gamesEn } from "./games/en";

/**
 * Qui édite Cerebrum, sans homonymie possible : affichée en tête de la FAQ et reprise telle
 * quelle par le JSON-LD (disambiguatingDescription), qui ne dit jamais plus que la page.
 */
const DISAMBIGUATION_EN =
  "Cerebrum is the puzzle games app published by Synapgeek SAS, an independent French studio. Not to be confused with other products or companies named Cerebrum.";

export const cerebrumEn: AppCopy = {
  updatedAt: "2026-10-03",
  meta: {
    title: "Cerebrum: offline puzzle games app | Synapgeek",
    description:
      "Cerebrum by Synapgeek: Sudoku, crosswords, word search and more offline brain games for iPhone, iPad and Android. Free with ads; Premium: no forced ads.",
  },
  disambiguation: DISAMBIGUATION_EN,
  hero: {
    h1: "Cerebrum",
    definition:
      "Cerebrum is an offline puzzle games app by Synapgeek for iPhone, iPad and Android: Sudoku, crosswords, word search and more. Free with ads; Premium means no forced ads.",
    phoneAlt:
      "Cerebrum home screen with the Daily Challenge, the themes and game cards including Sudoku, Word Search, Pandoku and Minesweeper",
  },
  sections: {
    games: {
      title: "The games in Cerebrum",
      categories: {
        "logic-numbers": "Logic and numbers",
        words: "Words",
        paths: "Paths and mazes",
      },
    },
    daily: {
      title: "Daily challenge and streak",
      body: "There is one daily challenge a day for the whole app. You pick the game, and the grid is the same for everyone playing that game in that language. It plays offline. Missed a day? Catch up from the monthly calendar.",
      items: [
        "Complete the challenge every day of a month to earn that month's trophy.",
        "Your streak grows every day you finish a game. If you lose a streak of 2 days or more, an optional ad can bring it back within a few days, once per lost streak.",
        "On iPhone and iPad, from 8 p.m. to midnight, if your streak is alive and you have not played yet, a Live Activity on the Lock Screen counts down the time left to save it. You can turn it off in Profile.",
        "On Android, the same countdown arrives as a notification, as long as notifications are allowed.",
      ],
    },
    progress: {
      title: "Your progress",
      items: [
        "Every game has a level path for each difficulty, from Easy up to Elite depending on the game. Levels are rated from 1 to 3 stars, then Endless Mode takes over.",
        "Your avatar grows up with you along the path, from baby to adult.",
        "Your total score across all games moves you up the leagues, from Bronze to Legend.",
        "No timer to refill lives and no waiting: after a game over, replay the level right away.",
      ],
      growthCaption:
        "The Panda avatar at three stages of growth: baby, young and adult.",
    },
    goodToKnow: {
      title: "Good to know",
      items: [
        "No connection? Every game still works, daily challenge and streak included. If you are signed in, your progress syncs when you are back online.",
        "Play as a guest from the very first launch. Signing in is optional, with Apple, Google or Facebook on iPhone, iPad and Android. Your progress then follows your account across iPhone, iPad and Android.",
        "The app speaks 16 languages. Crossword and Word Search grids exist in English and French only. In the other 14 languages these two games and their theme packs are hidden.",
        "Cerebrum runs on iPhone and iPad with iOS 17.0 or later, and on Android with Android 8.0 or later.",
        "On iPhone, iPad and Android, the app supports light and dark mode (automatic, or your choice in Profile) and lets you adjust sound effects and haptics. On iPhone and iPad, it also works with VoiceOver.",
      ],
    },
    model: {
      title: "Free, with or without Premium",
      items: [
        "Cerebrum is free to download and supported by ads: a banner during play and ads between some games.",
        "Rewarded ads are always optional: watch one for gems, a hint or a second chance.",
        "Premium is a weekly, monthly or yearly subscription. It means no forced ads: it removes the banner and the ads between games. It also adds infinite lives in the games that have lives, 5 free hints a day in each game, your first mistake forgiven in every puzzle, free daily gems and double gems after every win.",
        "Premium is bought and kept in each store: the App Store on iPhone and iPad, Google Play on Android. A subscription does not move from one store to the other.",
        "In-app purchases are optional: gem packs, and the Movies, Cooking and Travel theme packs for crosswords and word searches, which are not included in Premium.",
        "No game and no difficulty level is locked behind a purchase.",
      ],
    },
    privacy: {
      title: "Privacy in short",
      body: "Cerebrum works without signing in: you play as a guest. If you sign in, your progress moves to your account and follows that account across iPhone, iPad and Android. Cerebrum also keeps the basic profile your provider shares, such as your name and email. The app collects usage statistics and crash reports too. Ads come from Google AdMob. Where the law requires it, Google's consent form asks for your choice first, on iPhone, iPad and Android; on iPhone and iPad, Apple's tracking prompt follows. Refusing never blocks a game. This is only a summary, not the full list of what is collected: the privacy policy is the reference.",
      cta: "Read the privacy policy",
    },
  },
  faq: {
    title: "Frequently asked questions",
    items: [
      {
        question: "Who publishes Cerebrum?",
        answer: DISAMBIGUATION_EN,
      },
      {
        question: "Is Cerebrum free?",
        answer:
          "Yes. Cerebrum is free to download and you can play every game without paying: no game and no difficulty level is locked behind a purchase. The free version is supported by ads, and the optional Premium subscription removes the forced ones.",
      },
      {
        question: "Does Cerebrum have ads?",
        answer:
          "In the free version, yes: a banner during play and ads between some games. Rewarded ads are always optional, for gems, a hint or a second chance. Premium removes the banner and the ads between games, so it means no forced ads.",
      },
      {
        question: "Can I play Cerebrum offline?",
        answer:
          "Yes. Every grid is already inside the app, so every game works without a connection, daily challenge and streak included. If you are signed in, your progress syncs when you are back online. Ads, sign-in and purchases do need a connection.",
      },
      {
        question: "Which devices does Cerebrum run on?",
        answer:
          "iPhone and iPad with iOS 17.0 or later, and Android with Android 8.0 or later.",
      },
      {
        question: "Which languages is Cerebrum available in?",
        answer:
          "The app is available in English, French, Spanish, Portuguese (Brazil), German, Italian, Dutch, Turkish, Indonesian, Vietnamese, Japanese, Korean, Chinese (simplified and traditional), Hindi and Thai. Crossword and Word Search grids exist in English and French only. In the other 14 languages these two games and their theme packs are hidden.",
      },
      {
        question: "How do I delete my Cerebrum account?",
        answer:
          "If you signed in, open Profile, then Delete Account (you need to be online). Your account and the personal data tied to it are removed from our servers. As a guest on iPhone or iPad, there is no Delete Account button: the privacy policy explains how to ask for deletion.",
        link: {
          label: "Account deletion in the privacy policy",
          page: "privacy",
          hash: "account-deletion",
        },
      },
    ],
  },
  gamePage: {
    relatedTitle: "Other games in Cerebrum",
    difficultyColumns: { difficulty: "Difficulty", detail: "What changes" },
    difficulties: {
      easy: "Easy",
      medium: "Medium",
      hard: "Hard",
      elite: "Elite",
    },
  },
  games: gamesEn,
};
