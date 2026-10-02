import type { GameCopy } from "@/content/copy/types";

export const traceEn: GameCopy = {
  updatedAt: "2026-10-02",
  meta: {
    title: "Trace: how to play, tips and the Cerebrum app | Synapgeek",
    description:
      "How to play Trace, a one-line path puzzle: the rules, tips and the hint, from Easy to Elite. Offline on iPhone, iPad and Android.",
  },
  hero: {
    h1: "Trace",
    definition:
      "Trace is a one-line path puzzle: draw a single continuous line through every cell of the grid, crossing the numbered checkpoints in order. Play it offline in Cerebrum, the puzzle games app by Synapgeek, on iPhone, iPad and Android.",
    phoneAlt:
      "Trace in Cerebrum, Hard level: a grid of pink cells with a continuous path winding between numbered checkpoints, dark bars for walls between some cells, three progress dots and a timer above it, the direction arrows and the Hint button below",
  },
  howToPlay: {
    title: "How to play Trace",
    steps: [
      "The goal is to draw one unbroken path that covers every cell of the grid. Tap the 1 to start, then drag your finger from cell to cell: the line moves up, down, left or right, never diagonally. It always starts on the 1 and always ends on the highest number, once every other cell is covered.",
      "Numbered checkpoints are crossed in order: 1, then 2, then 3. The one exception is Elite, where a pair of twin checkpoints can be crossed in either order. Between two numbers the line can wind around as much as it likes, as long as it never goes back over a cell.",
      "Walls, the dark bars between two cells, block the way: the line cannot cross them. It still has to reach all the cells, with none left out.",
      "A wrong turn can be fixed at any time. Backtrack over your own steps, tap a cell on your line to cut it there, or use the on-screen direction arrows. A forbidden move is simply refused.",
    ],
  },
  whatCerebrumAdds: {
    title: "What Cerebrum adds to Trace",
    paragraphs: [
      "In Cerebrum, a Trace level strings together three grids, played back to back under a single timer that never stops between them. Each difficulty has its own path of levels, and once you have finished it, Endless Mode keeps the game going with more grids.",
      "Trace has no hearts and no way to lose. A forbidden move, such as crossing a wall, is turned down at no cost: the line stays where it was and you look for another way through.",
      "Only time counts towards your stars: the faster you finish, the more you earn.",
      "The hint reads the state of your line. If you have gone down a wrong path, it takes you back to the last good point; if you are on the right one, it draws the next three cells for you. It plays out step by step on the grid.",
      "The first Easy level also shows a faint ghost trail of the next two cells ahead of your line, to guide your first steps. A five-page tutorial opens the first time you play and can be replayed with the ? button.",
      "As a daily challenge, Trace runs on Easy or Medium, whichever the app has chosen, and every player draws through the same grid.",
    ],
    difficultyTable: {
      caption: "Trace difficulties in Cerebrum",
      rows: [
        {
          difficulty: "easy",
          detail:
            "Mostly 5×5 grids, else 6×6, with no walls at all: the place to get the feel of the gesture. Open from your first launch.",
        },
        {
          difficulty: "medium",
          detail:
            "Mostly 6×6 grids, else 7×7, with anywhere from none to six walls to steer or block the line. Fewer numbered checkpoints than on Easy, so the line has fewer landmarks to follow. Open from your first launch.",
        },
        {
          difficulty: "hard",
          detail:
            "Walls and numbers leave less room for guessing: the line is worked out rather than felt out. Opens as you progress through Medium.",
        },
        {
          difficulty: "elite",
          detail:
            "The most demanding grids of the game. Opens as you progress through Hard.",
        },
      ],
    },
  },
  tips: {
    title: "Tips for cleaner paths in Trace",
    items: [
      "Start from the corners and dead ends. A cell with only two exits, such as a corner of the grid or a cell hemmed in by walls, dictates its own route: unless the line starts or ends there, it enters by one exit and leaves by the other. A cell with a single exit has to be an end of the line. Lay down these forced stretches before looking at anything else.",
      "Never cut off a pocket of cells. Before each move, check that the cells still empty form one block you can reach from where you stand: if your line closes a corner behind it, that corner will never be covered and you will have to back up.",
      "Think in stretches, from one number to the next. Spot the 3 and the 4, picture the shortest route joining them, then look at which neighboring cells you could pick up on the way. A stretch is something to plan before you commit to it.",
      "Count before you commit. Between two numbers, the number of steps always has the same parity as the shortest route: if the 3 and the 4 sit five steps apart, the stretch will take five, seven, nine or more steps, but never six or eight. Weigh that count against the empty cells around it.",
      "Back up without hesitation, since it only costs time. When the line looks stuck, cut it at the last junction where you had a choice, by tapping that cell, rather than forcing your way through.",
    ],
  },
  faq: {
    title: "Trace in Cerebrum: frequently asked questions",
    items: [
      {
        question: "Can you lose at Trace or make a mistake?",
        answer:
          "No. Trace has no hearts and no defeat: a forbidden move is refused without an error, and you carry on. Only the time affects your stars.",
      },
      {
        question: "Do I have to cover every cell, or just the numbers?",
        answer:
          "Every cell. The numbers set the order of the stops, except for the twin checkpoints of Elite, but the line must cover each cell of the grid, once and only once.",
      },
      {
        question: "How do I go back?",
        answer:
          "In one of three ways: retrace your steps, tap a cell on your line to cut it there, or use the direction arrows.",
      },
      {
        question: "What does the Trace hint do?",
        answer:
          "It adapts to your line: a return to the last good point if you are off track, three more cells otherwise.",
      },
      {
        question: "Why does a level have three grids?",
        answer:
          "Each level is a series of three grids to finish back to back, with a timer that runs without a break. Stars are judged on time, not on how many attempts you needed.",
      },
    ],
  },
};
