import type { GameCopy } from "@/content/copy/types";

export const arrowMazeEn: GameCopy = {
  updatedAt: "2026-10-02",
  meta: {
    title: "Arrow Maze: how to play, tips and the Cerebrum app | Synapgeek",
    description:
      "How to play Arrow Maze, a relaxing arrow puzzle: the rules, tips and what Cerebrum adds, from Easy to Hard. Offline on iPhone, iPad and Android.",
  },
  hero: {
    h1: "Arrow Maze",
    definition:
      "Arrow Maze is a relaxing arrow puzzle: tap a piece to slide it off the board when its way is clear, until the board is empty. Play it offline in Cerebrum, the puzzle games app by Synapgeek, on iPhone, iPad and Android.",
    phoneAlt:
      "Arrow Maze in Cerebrum, Easy level: a board of colored arrow pieces forming a heart shape, three hearts and a timer above it, the help, zoom and Hint buttons below",
  },
  howToPlay: {
    title: "How to play Arrow Maze",
    steps: [
      "The board is covered in colored pieces. Each piece is a line of cells, often bent, with an arrow at its head. You win once no piece is left on the board.",
      "Tap a piece to send it out. It heads the way its arrow points, in a straight line to the edge of the grid: if nothing sits on that path, it slides off the board and vanishes.",
      "If another piece sits anywhere on that path, even far away or past the colored area, the piece is blocked. Tapping it anyway costs a heart.",
      "Tap anywhere on the piece: touching any of its cells plays the whole piece, not just its arrow.",
      "You start with the whole board in view. If the cells are too small, tap the board to zoom in right there, and drag to move around. Pinch or tap the magnifier to zoom in, then tap the map to zoom back out.",
      "There is no wrong order: at least one piece is always free, so you can never get stuck. All that is left is to send them out one by one.",
    ],
  },
  whatCerebrumAdds: {
    title: "What Cerebrum adds to Arrow Maze",
    paragraphs: [
      "Arrow Maze boards usually draw a silhouette, a heart for instance, out of tangled colored pieces. Each difficulty has its own path of boards, and once you have finished it, Endless Mode serves more boards of the same difficulty.",
      "The game opens with a five-page how-to-play sheet: emptying the board, tapping anywhere on a piece, the path to the edge, panning and zooming, and why no move is ever wrong.",
      "On a big board you drag to move, pinch to zoom, and an overview button brings the whole grid back on screen. A long press on a piece shows its path, for free: you see what blocks it before you tap it.",
      "The hint points to a free piece and shows its way out to the edge. It never changes the stars you earn.",
      "Tapping a blocked piece costs a heart: three on Easy and Medium, four on Hard. No mistakes earns three stars, one earns two, two or more earn one.",
      "Arrow Maze is also among the games for the daily challenge, on Easy or Medium: every player gets the same board, and a missed day can be caught up in the calendar.",
    ],
    difficultyTable: {
      caption: "Arrow Maze difficulties in Cerebrum",
      rows: [
        {
          difficulty: "easy",
          detail:
            "Boards from 17×8 to 26×26, with 20 to 141 pieces, and three hearts. Open from your first launch.",
        },
        {
          difficulty: "medium",
          detail:
            "Boards growing up to 34×34, with three hearts. Open from your first launch.",
        },
        {
          difficulty: "hard",
          detail:
            "Boards from 13×26 to 39×39, with 33 to 153 pieces, and one heart more: four. Opens as you progress through Medium.",
        },
      ],
    },
  },
  tips: {
    title: "Tips to play Arrow Maze better",
    items: [
      "Start with the free pieces on the edge. A piece whose arrow points off the board, with nothing in front of it, leaves without fuss: your first moves are almost always around the rim. Each piece that goes frees up room for its neighbors.",
      "Look for the piece that blocks the most others. When several pieces are free, play first the one sitting on the paths of the greatest number of other pieces: a single move often frees several.",
      "Clear one direction at a time. An arrow pointing up can only be held back by what lies above its head, in the same column, so that is the only way you need to look. Go through the pieces facing up, then those facing left, rather than jumping from one side of the board to the other.",
      "Check with a long press before you tap. The path runs to the edge of the grid, even past the colored area, so a piece at the far end of the column is enough to block. A long press shows that path at no cost, while tapping a blocked piece costs a heart.",
      "Switch between the overview and zoom. Zoom in to tap accurately when the cells are small, then go back to the overview to spot the areas that are clearing. If no free piece jumps out at you, remember there is always one, and follow the edge of the board.",
    ],
  },
  faq: {
    title: "Arrow Maze in Cerebrum: frequently asked questions",
    items: [
      {
        question: "Is Arrow Maze a logic game?",
        answer:
          "It is first and foremost a relaxing puzzle. There is no wrong order and no dead end, since at least one piece is always free to tap. Following where each arrow points is all it takes.",
      },
      {
        question: "Do I have to tap the arrow itself?",
        answer:
          "No, any cell of the piece will do. Touching any of them plays the whole piece, not just its arrow.",
      },
      {
        question: "What happens when I tap a blocked piece?",
        answer:
          "It stays where it is and you lose a heart: three on Easy and Medium, four on Hard. That cost counts towards your stars, since no mistakes earns three.",
      },
      {
        question: "How can I tell where a piece will go?",
        answer:
          "Press and hold the piece: its path appears, at no cost. Remember that a piece goes in a straight line to the edge of the grid, even past the colored area.",
      },
      {
        question: "How do I move around a big board?",
        answer:
          "Drag to move and pinch to zoom. The overview button, or the map while you are zoomed in, brings the whole board back on screen.",
      },
      {
        question: "What does the Arrow Maze hint do?",
        answer:
          "It points to a free piece and shows its way out to the edge. It never changes the stars you earn.",
      },
    ],
  },
};
