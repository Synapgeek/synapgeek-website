import type { GameCopy } from "@/content/copy/types";

export const wordSearchEn: GameCopy = {
  updatedAt: "2026-10-02",
  meta: {
    title: "Word Search: how to play, tips and the Cerebrum app | Synapgeek",
    description:
      "How to play word search, and what Cerebrum adds: spotting tips, hints, and difficulties from Easy to Hard. Offline on iPhone, iPad and Android.",
  },
  hero: {
    h1: "Word Search",
    definition:
      "A word search is the classic letter-grid puzzle where you hunt for hidden words that run in straight lines. Play it offline in Cerebrum, the puzzle games app by Synapgeek, on iPhone, iPad and Android.",
    phoneAlt:
      "Word Search in Cerebrum, Easy level: a letter grid with three words highlighted in color, the found-word counter and the timer above it, the Hint button and the word list below, with the found words struck through",
  },
  howToPlay: {
    title: "How to play word search",
    steps: [
      "The grid is a square of letters with words hidden in it along straight lines: across, down or diagonally. The list under the grid tells you which words to look for.",
      "To select a word, put your finger on its first letter, drag in a straight line to its last letter, then lift. Direction matters: a word only counts when read from its first letter to its last, never the other way round.",
      "If the selection matches a word on the list, a band of color stays on the grid and the word is struck through in the list. If it does not, nothing is lost: there are no hearts and no mistakes, so you simply try again.",
      "Each level strings together three grids, set in advance and played one after another. It ends when the words of all three grids are found.",
      "A word escaping you? The Hint button offers help that depends on the difficulty, and the list itself changes depending on whether you play Easy, Medium or Hard.",
    ],
  },
  whatCerebrumAdds: {
    title: "What Cerebrum adds to word search",
    paragraphs: [
      "In Cerebrum, a word search level is a run of three fixed grids, with no random draw, solved one after the other. Each difficulty has its own path, where levels unlock one at a time; once the path is done, Endless Mode keeps serving more levels of three grids at the same difficulty.",
      "The word list changes with the difficulty. On Easy, every word to find stays readable. On Medium, only the number of letters of each word shows. On Hard, the list is gone: you have to spot words without knowing which ones to look for, and some of them are written backwards.",
      "There are no mistakes to make and no game to lose: only the clock counts. Stars are worked out from your average time per grid. Three stars take 45 seconds or less on Easy, 2 minutes on Medium and 3 minutes 30 on Hard; two stars go up to 1 minute 30, 3 minutes 30 and 6 minutes.",
      "The Hint button changes with the difficulty. On Easy, it finds a word for you on the grid. On Medium and Hard, it offers two kinds of help: highlighting the first letter of a word you have not found, or revealing the text of a word on the list.",
      "Three theme packs, Movies, Cooking and Travel, add grids built around a subject, from 9 to 11 cells a side and with no backwards words. They are in-app purchases separate from the path, their grids count as Hard, and one pack also opens Crossword.",
      "Word search can also be picked for the daily challenge, on Easy only. Words differ from one language to the other, so the grid is drawn in your app's language: everyone playing in English that day gets the same one.",
    ],
    difficultyTable: {
      caption: "Word Search difficulties in Cerebrum",
      rows: [
        {
          difficulty: "easy",
          detail:
            "Grids from 7 to 9 cells a side, with 5 to 8 words of 4 to 7 letters. The list stays fully visible. Open from your first launch.",
        },
        {
          difficulty: "medium",
          detail:
            "Grids from 9 to 11 cells a side, with 7 to 11 words of 4 to 8 letters. Only the number of letters of each word shows. Open from your first launch.",
        },
        {
          difficulty: "hard",
          detail:
            "Grids from 11 to 12 cells a side, with 8 to 15 words of 3 to 9 letters, some written backwards. The list is hidden. Opens as you progress through Medium.",
        },
      ],
    },
  },
  tips: {
    title: "Tips to spot words faster",
    items: [
      "Sweep the grid for the rarest letters: Z, X, K, J, Q. A word that holds one has only a handful of places to sit. Find the letter, then check the eight cells around it to see whether the rest of the word runs off from there.",
      "Look for double letters. A pair such as SS, LL or TT turns up far less often than a lone letter, so once you spot one, read outward from it along all four axes before moving on.",
      "Think about direction as much as letters. From a likely first letter, do not just read to the right: try downward and all four diagonals. On Hard, add right-to-left and bottom-to-top, and always drag from the first letter of the word towards its last.",
      "On Medium, use the letter count that shows to rank the words. An eight-letter word has few places to sit on a diagonal, while a four-letter word can hide anywhere: take the long ones first, because they narrow the field fast.",
      "When the list is hidden, hunt for common building blocks instead of whole words: endings like -ING, -ED or -ER, pairs like TH or SH. A probable word often takes shape before it is complete, and one drag is enough to confirm it.",
    ],
  },
  faq: {
    title: "Word search questions answered",
    items: [
      {
        question: "Which way do I drag to validate a word?",
        answer:
          "From its first letter to its last. Direction matters: if you start from the last letter and drag back to the first, the word is not accepted, even though you cross the right cells.",
      },
      {
        question: "Can I make mistakes or lose a game?",
        answer:
          "No. Word search has no hearts and no defeat: a selection that matches no word costs nothing and can be redone straight away. Only the time counts, for the stars.",
      },
      {
        question: "Can words be written backwards?",
        answer:
          "On Hard, yes, both across and down: they read from right to left or from bottom to top. On Easy and Medium, across words read left to right and down words read top to bottom; diagonals can run any of the four ways.",
      },
      {
        question: "What do the word search hints do?",
        answer:
          "On Easy, the hint finds a word for you. On Medium and Hard you choose between highlighting the first letter of a word you have not found and revealing the text of a word on the list.",
      },
      {
        question: "Why does a level hold three grids?",
        answer:
          "A word search grid is quick to solve, so each level strings three together, in a fixed order. For stars, what counts is the average time per grid, not the total time of the level.",
      },
      {
        question: "Why don't I see word search in my app?",
        answer:
          "Its grids exist in French and English only: if the app is set to another language, the game is hidden. It reappears as soon as you switch back to one of those two.",
      },
    ],
  },
};
