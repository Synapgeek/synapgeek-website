import type { GameCopy } from "@/content/copy/types";

export const sudokuEn: GameCopy = {
  updatedAt: "2026-10-02",
  meta: {
    title: "Sudoku: how to play, tips and the Cerebrum app | Synapgeek",
    description:
      "How to play Sudoku, and what Cerebrum adds: notes, step-by-step hints, difficulties from Easy to Elite. Offline on iPhone, iPad and Android.",
  },
  hero: {
    h1: "Sudoku",
    definition:
      "Sudoku is the classic 9×9 number puzzle: every row, column and 3×3 box must hold the digits 1 to 9 exactly once. Play it offline in Cerebrum, the puzzle games app by Synapgeek, on iPhone, iPad and Android.",
    phoneAlt:
      "Sudoku in Cerebrum, Medium level: a 9×9 grid with three hearts and a timer above it, and the Undo, Erase, Notes and Hint buttons and the 1 to 9 digit pad below",
  },
  howToPlay: {
    title: "How to play Sudoku",
    steps: [
      "The grid has 81 cells, grouped into nine boxes of 3×3. Some cells already hold a digit. Those are your starting clues and they never change.",
      "Your goal is to fill the empty cells so that each row, each column and each box contains the digits 1 to 9 with no repeats.",
      "In Cerebrum, tap a cell, then tap a digit on the pad. To jot down several possibilities in one cell, switch on Notes before you tap the digits.",
      "Every digit is checked the moment you place it. A wrong digit costs you a mistake, and the third mistake ends the game. You win when the whole grid is correct.",
      "Stuck? The Hint button fills in one cell and walks you through the technique that finds it, step by step.",
    ],
  },
  whatCerebrumAdds: {
    title: "What Cerebrum adds to Sudoku",
    paragraphs: [
      "Sudoku in Cerebrum is the classic 9×9 grid, with no variants. You move up a path of levels in the difficulty you choose. Finish the path of a difficulty and Endless Mode opens, serving fresh grids one after another.",
      "Four buttons sit under the grid: Undo, Erase, Notes and Hint. Duplicates are highlighted, your notes clear themselves from the related cells when you place a digit, and a key on the pad greys out once all nine of its correct digits are in place.",
      "A hint does more than hand you the answer. It reveals one cell and explains the technique behind it step by step, so the next grid feels easier. Hints cost gems, or you can earn one by watching an optional ad. With Premium, five hints a day are free in each game. Fill Notes completes your notes for you, also for gems or an optional ad.",
      "Three mistakes end the game, but you can carry on once by watching an optional ad and once more with gems. With Premium, lives are infinite and the first mistake of every game is forgiven.",
      "Finish with no mistakes for three stars, one mistake for two, two or more for one. Hints do not count against your stars. The score rewards a quick, clean grid with few hints, and the difficulty multiplies it.",
      "Sudoku is also one of the games you can pick for the daily challenge, on Easy or Medium. The grid is the same for everyone, it plays offline, and a missed day can be caught up from the calendar.",
    ],
    difficultyTable: {
      caption: "Sudoku difficulties in Cerebrum",
      rows: [
        {
          difficulty: "easy",
          detail: "40 to 45 digits given. Open from your first launch.",
        },
        {
          difficulty: "medium",
          detail: "34 to 38 digits given. Open from your first launch.",
        },
        {
          difficulty: "hard",
          detail:
            "28 to 33 digits given. Opens as you progress through Medium.",
        },
        {
          difficulty: "elite",
          detail: "24 to 28 digits given. Opens as you progress through Hard.",
        },
      ],
    },
  },
  tips: {
    title: "Tips to play Sudoku better",
    items: [
      "Start by scanning. Pick a digit that already appears often, note the rows and columns that contain it, then look in each box for the one cell where it can still go. Move on to the next digit.",
      "Look for naked and hidden singles. If a cell's row, column and box already rule out eight digits, only one is left, so place it. A hidden single works the other way round: a digit that has only one possible cell in a row, column or box, whatever else that cell could hold.",
      "Do not guess: every digit is checked at once, and three mistakes end the game. When scanning runs dry, turn to notes and write the candidates for the most constrained cells. Cerebrum clears notes from the related cells each time you place a digit, so they stay up to date on their own.",
      "Naked pairs unlock hard grids. If two cells in the same row, column or box both hold only the same two candidates, those two digits belong to them: remove them from the notes of every other cell in that row, column or box.",
    ],
  },
  faq: {
    title: "Sudoku in Cerebrum: frequently asked questions",
    items: [
      {
        question: "Is Sudoku free in Cerebrum?",
        answer:
          "Yes. Sudoku is free in Cerebrum, like every game in the app, and no difficulty is locked behind a purchase. The free version shows a banner during play and ads between some games. Rewarded ads are always optional, and the Premium subscription means no forced ads.",
      },
      {
        question: "Can I play Sudoku offline?",
        answer:
          "Yes. Every grid is already inside the app, so Sudoku, the daily challenge and your streak all work without a connection, and your progress syncs when you are back online. Only ads, sign-in and purchases need a connection.",
      },
      {
        question: "How do mistakes work in Sudoku?",
        answer:
          "Every digit is checked as soon as you place it. A wrong digit counts as a mistake and the third one ends the game. You can carry on once by watching an optional ad and once more with gems. Premium gives infinite lives and forgives the first mistake of every game.",
      },
      {
        question: "What does the Hint button do?",
        answer:
          "It reveals one cell and explains the technique that finds it, step by step. Pay for it in gems, or earn it by watching an optional ad. With Premium, five hints a day are free in each game.",
      },
      {
        question: "Are there Sudoku variants in Cerebrum?",
        answer:
          "No. Cerebrum offers the classic 9×9 grid with no variants, from Easy to Elite.",
      },
      {
        question: "Which devices can I play Sudoku on with Cerebrum?",
        answer:
          "On iPhone and iPad with iOS 17.0 or later, and on Android with Android 8.0 or later. It is the same Cerebrum app with the same games.",
      },
    ],
  },
  whereToPlay: {
    title: "Play Sudoku on your phone",
    body: "Sudoku is in Cerebrum, the puzzle games app by Synapgeek. It is free to download and works offline on iPhone, iPad and Android. Pick your store to install it.",
  },
};
