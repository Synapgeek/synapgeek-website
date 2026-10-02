import type { GameCopy } from "@/content/copy/types";

export const mazeEn: GameCopy = {
  updatedAt: "2026-10-02",
  meta: {
    title: "Maze: how to play, tips and the Cerebrum app | Synapgeek",
    description:
      "How to play Maze: guide a firefly to the exit, collect crystals, cross the fog, with tips. Offline on iPhone, iPad and Android.",
  },
  hero: {
    h1: "Maze",
    definition:
      "Maze is a game where you guide a firefly through a maze to the exit portal, collecting crystals along the way. Play it offline in Cerebrum, the puzzle games app by Synapgeek, on iPhone, iPad and Android.",
    phoneAlt:
      "Maze in Cerebrum, Medium level: a cream-floored maze whose stitched orange and purple walls carve out the corridors, the firefly in the middle and a pink crystal near the bottom, the crystal counter and a timer above it, the direction pad, the Hint button and the overview button below",
  },
  howToPlay: {
    title: "How to play Maze",
    steps: [
      "Guide your firefly to the exit portal. Use the on-screen arrows or swipe across the maze: the firefly moves one cell at a time, up, down, left or right, never diagonally.",
      "A wall in the way? Just try another direction. Walls stop the firefly and cost you nothing: there are no hearts to lose and no way to fail the level.",
      "Pick up the pink crystals scattered over the board. They are optional, since you can finish without them, but they count towards your stars.",
      "Boosters lend a hand. In a dead end the bubble pops by itself and carries the firefly back toward the next crystal, or toward the exit once you have collected them all. The rocket sends the firefly off down the corridor on its own.",
      "In Elite the maze is wrapped in fog, and you only see what surrounds the firefly. The overview button shows the whole maze for a few seconds, three times per maze.",
    ],
  },
  whatCerebrumAdds: {
    title: "What Cerebrum adds to Maze",
    paragraphs: [
      "A Maze level is a single maze to get through. Each difficulty has its own path of levels, and once you have finished it, Endless Mode keeps going with more mazes of the same difficulty.",
      "Most mazes have a shape: a heart, a star, a ring, an hourglass or a triangle cuts out the board, and the cells outside the shape cannot be entered. The others are plain rectangles.",
      "A small maze fits on screen in one piece. In a big one the view follows the firefly step by step, and the overview button zooms out to show the whole board at once, as often as you like whenever there is no fog.",
      "Stars are earned one at a time: the first for reaching the exit, the second for collecting every crystal, the third for arriving within the target time, which is worked out from the length of the shortest route.",
      "A five-page tutorial recaps the rules inside the app. If you pick Maze for the daily challenge, every player gets the same maze that day, and never an Elite one, so never any fog.",
    ],
    difficultyTable: {
      caption: "Maze difficulties in Cerebrum",
      rows: [
        {
          difficulty: "easy",
          detail:
            "Mazes from 8×8 to 18×18 cells, with no fog, crystals waiting at the end of dead ends and the odd rocket, but no bubble. Open from your first launch.",
        },
        {
          difficulty: "medium",
          detail:
            "Mazes from 11×11 to 23×23 cells, still with no fog. This is where bubbles first show up. Open from your first launch.",
        },
        {
          difficulty: "hard",
          detail:
            "Mazes from 14×14 to 30×30 cells, with no fog but much longer routes. Opens as you progress through Medium.",
        },
        {
          difficulty: "elite",
          detail:
            "Mazes up to 36×36 cells, buried in fog: you see only a few cells around the firefly, and that circle tightens in the latest mazes. Opens as you progress through Hard.",
        },
      ],
    },
  },
  tips: {
    title: "Tips for finding the way out faster",
    items: [
      "In Elite, look at the overview before you step into the fog. It lasts only a few seconds and works three times per maze, so spend one right at the start to spot the exit and the general layout, and keep the other two for when you lose your bearings. Whatever the firefly has lit up stays visible afterwards.",
      "Work backwards from the exit. Once the board is in view, follow the corridor that touches the portal with your eyes, then the next one, until you reach a passage near the firefly: a route searched from the far end keeps you from committing to branches that lead away from the portal.",
      "Crystals always sit at the end of a dead end. Decide early which ones deserve a detour: a short dead end next to your route is a quick round trip, while a long branch mostly costs time. If one star is enough for you, skip them all; for the second star you need every one.",
      "Make boosters pay off. A rocket picked up at the start of a long corridor carries you to the next junction or dead end, and a tap on any direction hands control back. Bubbles stack up in reserve: each one is spent by itself in a dead end, but stays in reserve when going back would not be worth it.",
      "Save the hint for the junction where you hesitate. It lights only the next six cells of the shortest route, for a few seconds: note the direction before it fades, rather than spending it in the middle of a corridor where you have no choice anyway.",
    ],
  },
  faq: {
    title: "Maze in Cerebrum: frequently asked questions",
    items: [
      {
        question: "What happens when the firefly bumps into a wall?",
        answer:
          "Nothing more: it stays where it is and you pick another direction. Maze has no hearts and no defeat, so a wall can never make you lose.",
      },
      {
        question: "Is there a time limit?",
        answer:
          "No. The timer only matters for the third star, the one tied to the target time: arriving later never loses you a level.",
      },
      {
        question: "Are crystals the same as gems?",
        answer:
          "No. Gems are the app's currency, while the crystals you pick up in the maze only earn the level's second star.",
      },
      {
        question: "How is Maze different from Arrow Maze?",
        answer:
          "In Maze you walk: a firefly crosses the board to the exit. Arrow Maze is a relaxing arrow puzzle where you tap pieces to slide them off the board, with no character to guide.",
      },
      {
        question: "What does the Maze hint do?",
        answer:
          "It lights up the next six cells of the shortest route to the exit for about four seconds, starting from where the firefly stands.",
      },
    ],
  },
};
