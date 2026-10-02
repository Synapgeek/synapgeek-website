import type { GameCopy } from "@/content/copy/types";

export const minesweeperEn: GameCopy = {
  updatedAt: "2026-10-02",
  meta: {
    title: "Minesweeper: how to play, tips and the Cerebrum app | Synapgeek",
    description:
      "How to play Minesweeper: the rules, deduction tips and what Cerebrum adds, from Easy to Elite. Offline on iPhone, iPad and Android.",
  },
  hero: {
    h1: "Minesweeper",
    definition:
      "Minesweeper is the classic logic game of finding hidden mines: each number counts the mines among the eight cells around it. Play it offline in Cerebrum, the puzzle games app by Synapgeek, on iPhone, iPad and Android.",
    phoneAlt:
      "Minesweeper in Cerebrum, Easy level: a grid of 9 rows by 8 columns with numbers and flags, three hearts, the mine counter and a timer above it, the Flag and Hint buttons below",
  },
  howToPlay: {
    title: "How to play Minesweeper",
    steps: [
      "Every cell of the grid starts hidden, and some of them hide a mine. You win once every safe cell is open. Flags are only for your own bookkeeping and do not count towards winning.",
      "A number tells you how many mines hide among the eight cells around it, diagonals included. A 2 means two mines somewhere in its eight neighbors. That single rule is the whole game.",
      "A cell with no mine next to it carries no number. Opening it opens all its neighbors at once, and the cleared area spreads outwards.",
      "In Cerebrum, tap a cell to open it. To plant a flag, press and hold the cell, and hold it again to take the flag away. Marking several mines in a row? The Flag button in the toolbar saves you from holding each time.",
      "When a number already has as many flags around it as its value, tap it and Cerebrum opens all its other neighbors in one go. On big grids, pinch to zoom.",
      "Touching a mine costs one of your three hearts, and the cell stays marked. The third heart ends the game. Your very first tap can land on a mine too, but once an area is open, everything else can be worked out.",
    ],
  },
  whatCerebrumAdds: {
    title: "What Cerebrum adds to Minesweeper",
    paragraphs: [
      "In Cerebrum you work through a path of grids in the difficulty you pick. When it is finished, Endless Mode serves more minefields of that same difficulty.",
      "Minesweeper opens with a short four-page how-to-play sheet: the numbers, the first tap, flags, hearts and the hint.",
      "The mine counter, always visible at the top, shows the mines in the grid minus your flags. Plant one flag too many and it drops below zero, which tells you that one of your flags is wrong.",
      "A mine you touch costs a heart, yet the grid stays winnable: the cell is marked with a flag, so the counter stays accurate. When the third heart goes, the game is over unless you pick this same minefield back up.",
      "The hint opens the next safe cell for you. If one of your flags is misplaced, it takes that flag off first, before it opens anything.",
      "Stars follow your mistakes: three for a clean grid, two for one mistake, one beyond that, and hints never change that. Minesweeper is also on the list for the daily challenge, on Easy or Medium: everyone gets the same grid.",
    ],
    difficultyTable: {
      caption: "Minesweeper difficulties in Cerebrum",
      rows: [
        {
          difficulty: "easy",
          detail:
            "9×8 grids hiding 5 to 12 mines, then 11×9 grids with 13 to 17 mines further along the path. Open from your first launch.",
        },
        {
          difficulty: "medium",
          detail:
            "14×11 grids with 25 to 29 mines. Open from your first launch.",
        },
        {
          difficulty: "hard",
          detail:
            "16×13 grids with 39 to 43 mines. Opens as you progress through Medium.",
        },
        {
          difficulty: "elite",
          detail:
            "18×14 grids with 50 to 56 mines. Opens as you progress through Hard.",
        },
      ],
    },
  },
  tips: {
    title: "Tips to play Minesweeper better",
    items: [
      "For your very first tap, aim for a corner: it has only three neighbors, so it is more likely to open a blank area at once. In Cerebrum that tap is not guaranteed safe, and it can land on a mine.",
      "Put satisfied numbers to work. A 1 touching an identified mine needs no other mine, so all its other neighbors are safe. Tap it to open them in one go, a shortcut that trusts your flags: mark only proven mines, because on a false flag it uncovers a real mine.",
      "Subtract what you know. A 3 that already has two flags only waits for one more mine among its hidden neighbors. Reduced to that remainder, it often becomes a 1 or a 2 to compare with the neighboring number.",
      "Spot the sequences along a wall, meaning a row of numbers running alongside a row of hidden cells. When those cells are the only hidden neighbors of the numbers, a 1-2-1 puts a mine under each 1 and leaves the cell under the 2 safe; a 1-2-2-1 puts the mines under the two 2s.",
      "Keep an eye on the counter late in the grid. If it reads zero and your flags are right, everything still hidden is safe. If it equals the number of hidden, unmarked cells, they are all mines.",
    ],
  },
  faq: {
    title: "Minesweeper in Cerebrum: frequently asked questions",
    items: [
      {
        question: "Is the first tap always safe?",
        answer:
          "No. Your very first tap can land on a mine, and it then costs you a heart. Once an area is open, the rest of the grid can be worked out: no grid ever asks you to guess.",
      },
      {
        question: "How do I plant a flag?",
        answer:
          "Press and hold a cell to mark it as a mine, and hold it again to remove the flag. To plant several in a row, the Flag button in the toolbar saves you from holding each time.",
      },
      {
        question: "What happens when I touch a mine?",
        answer:
          "You lose one of your three hearts and the cell turns into a flag, so the mine counter stays right. The cost is counted per tap, not per mine: a single tap that uncovers several mines costs one heart. After the third, you can carry on with the same grid instead of starting over.",
      },
      {
        question: "What does the Minesweeper hint do?",
        answer:
          "It opens the next safe cell, after taking off one of your flags if that flag is misplaced. It never changes the stars you earn.",
      },
      {
        question: "What does the mine counter show?",
        answer:
          "The number of mines in the grid minus the flags you have planted. If it drops below zero, one of your flags is wrong. If it reads zero and your flags are right, every hidden cell left is safe.",
      },
      {
        question: "How do I open all the cells around a number at once?",
        answer:
          "When a number has as many flags around it as its value, tap it. Cerebrum opens the rest of its neighbors, but it trusts your flags, so a misplaced flag will uncover a real mine.",
      },
    ],
  },
};
