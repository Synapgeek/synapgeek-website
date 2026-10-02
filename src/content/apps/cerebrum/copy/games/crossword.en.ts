import type { GameCopy } from "@/content/copy/types";

export const crosswordEn: GameCopy = {
  updatedAt: "2026-10-02",
  meta: {
    title: "Crossword: how to play, tips and the Cerebrum app | Synapgeek",
    description:
      "How to play crosswords, and what Cerebrum adds: solving tips, three kinds of hint, difficulties from Easy to Hard. Offline on iPhone, iPad and Android.",
  },
  hero: {
    h1: "Crossword",
    definition:
      "A crossword is the classic word-grid puzzle: you solve clues to fill in answers that cross one another. Play it offline in Cerebrum, the puzzle games app by Synapgeek, on iPhone, iPad and Android.",
    phoneAlt:
      "Crossword in Cerebrum, Easy level: a partly filled grid with three hearts and a timer above it, the current clue with its letter count, and the QWERTY keyboard below",
  },
  howToPlay: {
    title: "How to play crosswords",
    steps: [
      "The grid is open-shaped: only the cells that hold letters exist, and the words cross each other, running across or down. Every word starts on a numbered cell, and its clue carries the same number.",
      "The clue for the selected word sits under the grid, with an arrow for its direction and, in brackets, the number of letters in the answer. You win when every word has been found.",
      "Tap a cell to pick its word, then type the answer on the built-in keyboard. The bracketed number tells you when the word is full.",
      "A cell where two words meet belongs to both. Tap it a second time to flip between across and down.",
      "A word is checked the moment its last letter goes in. If it is right, it locks, and its letters become certainties for the words that cross it. If it is wrong, it turns red, you lose a heart and its letters are cleared.",
      "Stuck? The Hint button offers three kinds of help, from the lightest nudge to the full answer.",
    ],
  },
  whatCerebrumAdds: {
    title: "What Cerebrum adds to crosswords",
    paragraphs: [
      "Crosswords in Cerebrum are clue-based grids with an open shape: not square, and not fenced in by black cells. Each difficulty has its own path, where grids unlock one after another; when you finish the path, Endless Mode keeps serving more grids of the same difficulty.",
      "The game exists in French and in English only, and the clues, the answers and the keyboard all belong to one of the two, following the app's setting. If the app is set to any other language, crosswords are simply hidden.",
      "You have three hearts, and a wrong word costs one: the third ends the game, with a second chance on offer. A clean grid earns three stars, one mistake two, and two or more just one. Hints never enter that count.",
      "The Hint button holds three kinds of help. The clue hint gives an easier clue for the same word; the letter hint uncovers one cell of the answer; the word hint reveals the whole answer at once. On Easy, the clue hint is not offered.",
      "Three theme packs, Movies, Cooking and Travel, add grids built around a subject. They are in-app purchases separate from the path, their grids are Hard, and one pack also opens Word Search.",
      "Crosswords can also be picked for the daily challenge, on Easy only. The grid is drawn in your app's language, so everyone playing in English that day solves the same one, and everyone in French shares another.",
    ],
    difficultyTable: {
      caption: "Crossword difficulties in Cerebrum",
      rows: [
        {
          difficulty: "easy",
          detail:
            "Grids from 9 to 12 by 10 to 12 cells, with 14 to 20 words and no clue hint. Open from your first launch.",
        },
        {
          difficulty: "medium",
          detail:
            "Grids of the same size, with 14 to 20 words and the clue hint available. Open from your first launch.",
        },
        {
          difficulty: "hard",
          detail:
            "Grids from 6 to 12 by 10 to 12 cells, with 9 to 15 words. It is also the difficulty of the theme packs. Opens as you progress through Medium.",
        },
      ],
    },
  },
  tips: {
    title: "Tips to solve crosswords better",
    items: [
      "Start with the clues you are sure of: a direct synonym, a proper name, an obvious answer. Every right word locks, and its letters become footholds for the words that cross it, so the harder answers loosen up on their own.",
      "Use the number in brackets. Throw out any answer that has the wrong number of letters, and take the short entries first: they leave fewer possible answers, and their letters land right in the middle of the long words.",
      "Read the clue like a sentence. A plural clue calls for a plural answer, so probably a final S; a past tense, a participle or an -ING form shows up in the ending. The tense and the agreement of the clue are almost always those of the answer.",
      "Look at the letters already in place before you ask for help. Two or three well-placed letters often unlock a doubtful answer. If that is not enough, take the lightest hint first and keep the word reveal for the end.",
      "Never drop in a letter that completes a word on impulse. A word is checked the moment its last empty cell is filled, and that can be a crossing word you were not looking at. Before you fill the last cell of any word, test the answer against the locked words that cross it, then commit only if everything fits.",
    ],
  },
  faq: {
    title: "Crossword questions answered",
    items: [
      {
        question: "What happens when a word is wrong?",
        answer:
          "The word is checked as soon as its last letter is in. If it is wrong, its cells turn red, a heart goes and the letters are cleared. Losing the third heart ends the game, with a second chance on offer.",
      },
      {
        question: "How do I switch between across and down?",
        answer:
          "Tap the cell where the two words meet a second time. Every shared cell belongs to an across word and a down word, and the same tap flips from one to the other.",
      },
      {
        question: "Which keyboard does the crossword use?",
        answer:
          "A built-in one, laid out QWERTY for the English grids and AZERTY for the French ones. The French grids ignore accents: E counts for É, È or Ê.",
      },
      {
        question: "What do the crossword hints do?",
        answer:
          "There are three: an easier clue for the current word, one letter uncovered, or the entire word. The first is not offered on Easy. Stars only count mistakes, never hints.",
      },
      {
        question: "What are the Movies, Cooking and Travel packs for?",
        answer:
          "Each one brings grids built around its subject, all at Hard difficulty. It is a separate in-app purchase that also opens Word Search. A pack you already own is never taken away.",
      },
      {
        question: "Why don't I see crosswords in my app?",
        answer:
          "Their grids exist in French and English only: if the app is set to another language, the game is hidden. It comes back as soon as you switch to French or English.",
      },
    ],
  },
};
