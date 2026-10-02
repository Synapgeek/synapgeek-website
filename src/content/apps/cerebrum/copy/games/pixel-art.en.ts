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
      "In Cerebrum, drag your finger across the cells to fill them in: a single stroke can paint a whole run. Two modes, Fill and Cross, switch with the toggle button.",
      "Switch to Cross mode to mark the cells you know are empty. A cross never costs you anything.",
      "On iPhone and iPad, filling in a wrong cell costs one of your three lives, and the cell turns into a locked cross. A correct cell locks too.",
      "You win when the whole grid is solved: the picture turns to color, with up to four shades, and its name appears.",
    ],
  },
  whatCerebrumAdds: {
    title: "What Cerebrum adds to Pixel Art",
    paragraphs: [
      "In Cerebrum you move from picture to picture in the difficulty you pick. When its path is finished, Endless Mode serves more of the same size.",
      "Pixel Art opens with a short four-page how-to-play sheet: read the clues, drag to paint, cross what is empty, finish to reveal.",
      "While you play, the grid stays black and white. The toggle button switches between Fill and Cross, and dragging lays down several cells in one stroke.",
      "On iPhone and iPad, as soon as a row or column is complete, its empty cells are crossed out for you. Undo only takes back crosses.",
      "The hint starts by correcting a mistake, if there is one. Otherwise it reveals a cell.",
      "When you win, the picture turns to color and its name appears: Panda, for instance. The grids are the same whatever language the app is set to, but the name is shown in the language you picked.",
      "Stars count mistakes on iPhone and iPad (none earns three stars, one earns two, two or more earn one, and hints do not count) and time on Android. Pixel Art is also one of the games you can pick for the daily challenge, on Easy or Medium: everyone gets the same grid.",
    ],
    difficultyTable: {
      caption: "Pixel Art difficulties in Cerebrum",
      rows: [
        {
          difficulty: "easy",
          detail:
            "8×8 grids. On iPhone and iPad the path starts with smaller 5×5 ones. Open from your first launch.",
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
      "Start with the long runs, using the overlap method. In a row of 10 cells, a 7 can slide by three cells at most: wherever it sits, the four middle cells are filled. The longer the run compared with the line, the more cells are certain.",
      "Spot the lines that fill themselves in. If the numbers, plus one empty cell between runs, add up to the exact length of the line, everything is settled: in 10 cells, a 4-1-3 gives four filled cells, a gap, one filled, a gap, then three filled.",
      "Work from the edges. When the first cell of a line is filled, the first run starts at that edge: fill it along its full length, then cross the cell that follows. The last run works the same way from the opposite side.",
      "Cross out what you know is empty without waiting. A cross never costs anything, and once every run of a line is placed, the rest of that line gets crossed. On iPhone and iPad a wrong fill costs a life, so fill a cell only when you are sure, and cross otherwise.",
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
          "Drag your finger across the grid to fill several cells in one stroke. The toggle button switches between Fill and Cross: in Cross mode you mark the cells you know are empty, and that never costs anything.",
      },
      {
        question: "What happens when I fill in a wrong cell?",
        answer:
          "On iPhone and iPad you lose one of your three lives, and the cell turns into a locked cross. On Android there are no lives and no game over: nothing is checked while you paint.",
      },
      {
        question: "What does the Undo button do?",
        answer:
          "On iPhone and iPad, Undo only takes back crosses. On Android it takes back filled cells as well as crosses.",
      },
      {
        question: "What does the Pixel Art hint do?",
        answer:
          "It corrects a mistake first, if there is one. Otherwise it reveals a cell.",
      },
      {
        question: "Does the picture's name change with the language?",
        answer:
          "The grids are the same in every language of the app, but the picture's name, revealed when you win, is shown in the language you picked in Cerebrum.",
      },
    ],
  },
  whereToPlay: {
    title: "Play Pixel Art",
    body: "Pixel Art is played with your fingertip: you drag across the grid to paint, then switch to Cross mode to mark the empty cells.",
  },
};
