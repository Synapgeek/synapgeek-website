import type { GameCopy } from "@/content/copy/types";

export const crossMathEn: GameCopy = {
  updatedAt: "2026-10-02",
  meta: {
    title: "Cross Math: how to play, tips and the Cerebrum app | Synapgeek",
    description:
      "How to play Cross Math, the math crossword: rules, solving tips and what Cerebrum adds, from Easy to Elite. Offline on iPhone, iPad and Android.",
  },
  hero: {
    h1: "Cross Math",
    definition:
      "Cross Math is a math crossword: the words in the grid are equations, across and down, that you complete with numbers from a pool. Play it offline in Cerebrum, the puzzle games app by Synapgeek, on iPhone, iPad and Android.",
    phoneAlt:
      "Cross Math in Cerebrum, Medium level: a grid of crossing equations with three empty cells, three hearts and a timer above it, the Hint button, then the number pool 1, 4 and 24 below",
  },
  howToPlay: {
    title: "How to play Cross Math",
    steps: [
      "The grid looks like a crossword, but its words are calculations: every run of cells joined by operators and an equals sign is an equation, such as 8 × 2 = 16. Some numbers are given, others are missing, and the goal is to fill every empty cell.",
      "Under the grid, the pool lists the numbers you still have to place. It holds exactly the missing numbers, no more and no fewer: there are no decoys, and every number has its cell.",
      "Tap an empty cell, then a number in the pool, or drag the number onto the cell. Once placed, it leaves the pool.",
      "Equations follow the order of operations: multiplication and division come before addition and subtraction. So 2 + 3 × 4 makes 14, not 20. Every number is a whole number.",
      "Each number is checked the moment you place it. A right number locks in place. A wrong one is flagged at once and costs you a life; five seconds later it clears from the cell and returns to the pool.",
      "A level chains three grids. The timer and your mistakes carry on from one grid to the next, and nothing counts until the third is done.",
    ],
  },
  whatCerebrumAdds: {
    title: "What Cerebrum adds to Cross Math",
    paragraphs: [
      "Cross Math has its own path in Cerebrum: each difficulty has a run of levels that open one after another. When you have finished a difficulty's path, Endless Mode takes over with more three-grid levels in that same difficulty.",
      "As the difficulty rises, the grids get bigger and the operators multiply: Easy sticks to addition and subtraction, Medium adds multiplication, Hard and Elite add division. The numbers you place run from 1 to 30, while the given numbers and the results go up to 100.",
      "You get three lives, shown as hearts: each wrong number takes one, and losing the third ends the run, though a second chance is on offer. A grid with no mistakes earns three stars, one mistake earns two, and two or more earn one. There is no Undo button: the fix happens by itself when the wrong number drops back into the pool.",
      "The Hint button fills the cell you have selected, or else the one that most helps the grid. It gets you moving when two equations are holding each other up.",
      "On the day you pick Cross Math for the daily challenge, the grid comes in Easy or Medium, as the app decides, and every player gets the very same equations.",
    ],
    difficultyTable: {
      caption: "The Cross Math difficulties in Cerebrum",
      rows: [
        {
          difficulty: "easy",
          detail:
            "5×5 grids with additions and subtractions, and four numbers to place. Open from your first launch.",
        },
        {
          difficulty: "medium",
          detail:
            "Mostly 7×7, also 9×7 or 7×9 and, rarely, 7×5. Multiplication joins addition and subtraction, for 6 to 9 numbers to place. Open from your first launch.",
        },
        {
          difficulty: "hard",
          detail:
            "Mostly 9×9, else 9×7 or 7×9, with all four operations: division joins the other three. From 10 to 15 numbers to place. Opens as you progress through Medium.",
        },
        {
          difficulty: "elite",
          detail:
            "Almost always 9×9, with the biggest share of equations where the order of operations matters. From 10 to 14 numbers to place. Opens as you progress through Hard.",
        },
      ],
    },
  },
  tips: {
    title: "Tips for playing Cross Math better",
    items: [
      "Start with the equation that has only one empty cell: it is an equation with a single unknown, so its number is forced. In 7 + ? = 12, the cell is 5. Once it is placed, that number props up the equations that cross it, and the grid unravels step by step.",
      "Apply the order of operations before you look for a number. In ? + 3 × 4 = 17, work out 3 × 4 = 12 first: the cell is 5. Read left to right, the same equation would give a very different result. It is the most common trap from Medium on, where multiplication appears.",
      "Rule out the pool numbers that cannot fit. In ? + 4 = 9, neither 24 nor 10 works, since in an addition no term can exceed the total. The pool empties fast, and the last numbers left fall into place on their own.",
      "In a division, start from the result. Because the numbers are whole, the dividend is a multiple of the divisor: for ? ÷ 4 = 6 the cell is 24, and for 36 ÷ ? = 9 look for the number that goes into 36 nine times.",
      "Test a number in both of its equations before you place it. A cell where a row and a column cross belongs to both: a number that suits one but not the other is wrong, and it costs a life. When in doubt, go first for the cell where one of the two equations is nearly complete.",
    ],
  },
  faq: {
    title: "Cross Math questions answered",
    items: [
      {
        question: "Does Cross Math follow the order of operations?",
        answer:
          "Yes. Multiplication and division are worked out before addition and subtraction, as in ordinary arithmetic. 2 + 3 × 4 makes 14. The rule matters from Medium, the first difficulty where multiplication appears.",
      },
      {
        question: "What happens to a wrong number?",
        answer:
          "It is flagged as soon as you place it, and a life goes. After five seconds it leaves the cell and returns to the pool, ready to try elsewhere. A right number, by contrast, stays locked.",
      },
      {
        question: "Do I drag the numbers or tap them?",
        answer:
          "Both work: tap a cell and then a number in the pool, or drag the number onto the cell. The result is the same.",
      },
      {
        question: "What does the Hint button do in Cross Math?",
        answer:
          "It fills the cell you have selected if it is empty, otherwise the cell of the equation with the fewest unknowns. A hint costs no star: only mistakes count.",
      },
      {
        question: "Is there a tutorial in Cross Math?",
        answer:
          "No, the game has none: this page stands in for one. Easy, with its four numbers to place on a 5×5 grid, is a good place to start.",
      },
    ],
  },
};
