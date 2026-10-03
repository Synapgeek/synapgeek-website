import type { GameCopy } from "@/content/copy/types";

export const pixelArtEn: GameCopy = {
  updatedAt: "2026-10-02",
  meta: {
    title: "Pixel Art: how to play, tips and the Cerebrum app | Synapgeek",
    description:
      "How to play Pixel Art, a nonogram game: the rules, tips and what Cerebrum adds, from Easy to Elite. Offline on iPhone, iPad and Android.",
  },
  hero: {
    h1: "Pixel Art",
    definition:
      "Pixel Art is a game of nonograms, also known as hanjie: the numbers along the edges of the grid tell you which cells to fill in to reveal a hidden picture. Play it offline in Cerebrum, the puzzle games app by Synapgeek, on iPhone, iPad and Android.",
    phoneAlt:
      'Pixel Art in Cerebrum, Elite level: a 15 by 15 panda revealed in color, three hearts, a brush at 100% and a timer above it, and the "You painted: Panda" panel with the Continue button',
  },
  howToPlay: {
    title: "How to play Pixel Art",
    steps: [
      "The grid is a square of empty cells, with numbers at the head of every row and every column. Your goal is to fill in the right cells until a picture appears.",
      "Each number is a run of filled cells in its row or column. A 3 means three filled cells side by side. With two numbers, say 2 then 1, the line holds two runs in that order, with at least one empty cell between them.",
      "In Cerebrum, drag your finger across the cells to fill them in: a single stroke can paint a whole run. The toggle button switches between two modes, Fill and Cross.",
      "Switch to Cross mode to mark the cells you know are empty. A cross never costs you anything.",
      "Filling in a wrong cell costs one of your three lives and turns it into a locked cross; a correct cell locks as well.",
      "You win when the whole grid is solved: the picture turns to color and its name appears.",
    ],
  },
  whatCerebrumAdds: {
    title: "What Cerebrum adds to Pixel Art",
    paragraphs: [
      "Each difficulty has its own path of hidden pictures. Once it is done, Endless Mode keeps drawing new pictures at that difficulty's grid size, up to 15×15 on Elite.",
      "Pixel Art opens with a short four-page how-to-play sheet: read the clues, drag to paint, cross what is empty, finish to reveal.",
      "While you play, the grid stays black and white.",
      "As soon as a row or column is complete, its empty cells are crossed out for you, and any cross already there locks. Undo only takes back crosses, never a filled cell.",
      "Run out of lives and the picture is not lost: you can take it up again, at most twice, with two lives restored each time. A stroke that sweeps several wrong cells stops at the first one and costs a single life.",
      "The hint fixes one cell. If you crossed out a cell that belongs to the picture, it fills it in; otherwise it fills a missing cell in the row or column closest to being finished. A hint never costs a life.",
      "When you win, the picture is revealed in four colors and its name appears: Panda, for instance.",
      "Stars count mistakes: none earns three stars, one earns two, two or more earn one, and hints do not count.",
    ],
    difficultyTable: {
      caption: "Pixel Art difficulties in Cerebrum",
      rows: [
        {
          difficulty: "easy",
          detail:
            "8×8 grids, with a few smaller 5×5 ones to begin the path. Open from your first launch.",
        },
        {
          difficulty: "medium",
          detail: "10×10 grids. Open from your first launch.",
        },
        {
          difficulty: "hard",
          detail: "12×12 grids. Opens as you progress through Medium.",
        },
        {
          difficulty: "elite",
          detail:
            "15×15 grids, the biggest. Opens as you progress through Hard.",
        },
      ],
    },
  },
  tips: {
    title: "Tips to play Pixel Art better",
    items: [
      "Start with the long runs, using the overlap method. In a row of 10 cells, a lone 7 can slide by three cells at most: wherever it sits, the four middle cells are filled. The longer the run compared with the line, the more cells are certain.",
      "Spot the lines that fill themselves in. If the numbers, plus one empty cell between runs, add up to the exact length of the line, everything is settled: in 10 cells, a 4-1-3 gives four filled cells, a gap, one filled, a gap, then three filled.",
      "Work from the edges. When the first cell of a line is filled, the first run starts at that edge: fill it along its full length, then cross the cell that follows. The last run works the same way from the opposite side.",
      "Cross out what you know is empty without waiting: a cross never costs anything. Once every run of a line is placed, cross the rest of that line. A wrong fill costs a life, so fill a cell only when the clues prove it, and leave it blank while in doubt.",
      "Alternate between rows and columns. Each filled or crossed cell gives certainty to the line that crosses it. When a row stops yielding anything, move to a column, then come back: the whole grid opens up, cell after cell.",
    ],
  },
  faq: {
    title: "Pixel Art in Cerebrum: frequently asked questions",
    items: [
      {
        question: "Is Pixel Art a nonogram?",
        answer:
          "Yes. Pixel Art is the name Cerebrum gives its nonograms, also known as hanjie: you fill in cells from the numbers on the rows and columns, and the result draws a picture.",
      },
      {
        question: "How do I paint and cross cells?",
        answer:
          "Drag across the grid to paint several cells in a single stroke, with the toggle button set on Fill. Set it on Cross to mark the cells you know are empty.",
      },
      {
        question: "What happens when I fill in a wrong cell?",
        answer:
          "You lose one life and the cell turns into a locked cross. Losing the third life ends the game, though a second chance is offered.",
      },
      {
        question: "What does the Undo button do?",
        answer:
          "It only takes back crosses, never a filled cell: a filled cell is either right and locked, or wrong and turned into a locked cross.",
      },
      {
        question: "What does the Pixel Art hint do?",
        answer:
          "It fixes one cell, starting with a cell you crossed out by mistake, and never costs a life.",
      },
      {
        question: "Does the picture's name change with the language?",
        answer:
          "The grids are the same in every language of the app, but the picture's name, revealed when you win, is shown in the language you picked in Cerebrum.",
      },
    ],
  },
};
