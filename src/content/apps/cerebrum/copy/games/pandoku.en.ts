import type { GameCopy } from "@/content/copy/types";

export const pandokuEn: GameCopy = {
  updatedAt: "2026-10-02",
  meta: {
    title: "Pandoku: how to play, tips and the Cerebrum app | Synapgeek",
    description:
      "How to play Pandoku, a Star Battle logic puzzle: rules, tips and hints that explain themselves, from Easy to Elite. Offline on iPhone, iPad and Android.",
  },
  hero: {
    h1: "Pandoku",
    definition:
      "Pandoku is a Star Battle logic puzzle: place one panda in every row, column and colored region, with no two pandas touching. Play it offline in Cerebrum, the puzzle games app by Synapgeek, on iPhone, iPad and Android.",
    phoneAlt:
      "Pandoku in Cerebrum, Medium level: an 8×8 grid split into colored regions, with pandas placed and cells crossed out, three hearts and a timer above it, the three rule reminders and the Hint button",
  },
  howToPlay: {
    title: "How to play Pandoku",
    steps: [
      "The grid is a square split into colored regions of any shape, with exactly as many regions as there are rows. Your job is to place pandas on it, following three rules.",
      "One panda per row and per column. Each row and each column holds exactly one.",
      "One panda per colored region, whatever its shape. Each region holds exactly one too.",
      "Pandas never touch, not even diagonally. Keep every panda clear of the eight cells around it.",
      "In Cerebrum, tap a cell to cross it out and double-tap it to place a panda. Crosses are only a reminder: they do not count towards winning, and a tap erases them.",
      "A misplaced panda is removed and costs one of your three hearts, while a correct panda stays put. You win once every panda is in place.",
    ],
  },
  whatCerebrumAdds: {
    title: "What Cerebrum adds to Pandoku",
    paragraphs: [
      "In Cerebrum you climb a path of levels in the difficulty you choose. On Easy the grids grow along the way, from 4×4 up to 8×8. Clear the last level of a difficulty and Endless Mode takes over, one new grid after another.",
      "Pandoku opens with a short how-to-play sheet. The first Easy level is guided: the app walks you through your first pandas step by step, with no heart lost and no timer, and a Skip button if you would rather start alone. Every Easy grid also begins with one panda already placed. It cannot be removed and counts neither as a mistake nor as a hint.",
      "There is no Undo button. A tap crosses a cell, another tap erases the cross for free, and a correct panda is locked for good. Drag a finger across the grid to cross out several cells at once.",
      "A panda placed in the wrong spot is removed and costs a heart. Lose the third and the game is over, but you can carry on once by watching an optional ad and once more with gems. With Premium, hearts are infinite and the first mistake of every game is forgiven.",
      "The hint shows its reasoning before it plays the move. It names the deduction on offer (a forced cell, a confined unit or shared neighbors), highlights it, then places the panda or crosses out the cells for you. When nothing simple stands out, it hands you a panda to get going again. Each hint is paid in gems or unlocked by an optional ad, and Premium players get five free ones a day in every game.",
      "Stars depend on mistakes alone: none earns three, one earns two, more earns one. Hints never cost you a star. Pandoku is also one of the games you can pick for the daily challenge, on Easy or Medium: the same grid for everyone, playable offline, with a missed day caught up from the calendar.",
    ],
    difficultyTable: {
      caption: "Pandoku difficulties in Cerebrum",
      rows: [
        {
          difficulty: "easy",
          detail:
            "Grids start at 4×4 and grow up to 8×8. One panda is given to you. Open from your first launch.",
        },
        {
          difficulty: "medium",
          detail: "8×8 grids. Open from your first launch.",
        },
        {
          difficulty: "hard",
          detail:
            "9×9 grids, then 10×10 further along the path. Opens as you progress through Medium.",
        },
        {
          difficulty: "elite",
          detail: "10×10 grids. Opens as you progress through Hard.",
        },
      ],
    },
  },
  tips: {
    title: "Tips to play Pandoku better",
    items: [
      "Start with the smallest regions. If every cell still possible in a region sits in one row or one column, that region's panda is there: cross out the rest of that row or column, even outside the region.",
      "The moment you place a panda, cross out the eight cells around it, then the rest of its row, its column and its region. The other regions tighten without any effort.",
      "Count regions. If two regions fit entirely inside the same two rows, those rows belong to them: every other cell in those two rows is empty. The same goes for three regions inside three rows, and for columns.",
      "Look for shared neighbors. A cell that touches every cell still possible in a region is ruled out, because wherever that region's panda lands, it would sit right next to it. Cross it out.",
      "Cross out freely. Crosses cost nothing and do not count towards winning, and the more excluded cells you mark, the more forced cells appear. Place a panda only when you can say why it belongs there: a mistake costs a heart.",
    ],
  },
  faq: {
    title: "Pandoku in Cerebrum: frequently asked questions",
    items: [
      {
        question: "Is Pandoku a Star Battle?",
        answer:
          "Yes. Pandoku is Cerebrum's name for this Star Battle logic puzzle: you place pandas where Star Battle places stars, one per row, column and region.",
      },
      {
        question: "How do I place a panda or a cross?",
        answer:
          "Tap a cell to cross it out, double-tap it to place a panda, and tap a cross to erase it. Crosses do not count towards winning, and there is no Undo button.",
      },
      {
        question: "What happens when I make a mistake?",
        answer:
          "A misplaced panda is removed and costs you one of three hearts. The third ends the game, which you can resume with an optional ad or with gems. Premium gives infinite hearts.",
      },
      {
        question: "What does the Pandoku hint do?",
        answer:
          "It shows its reasoning before it plays the move: it names the deduction on offer, then places the panda or crosses out the cells for you. Gems or an optional ad pay for it; Premium includes five a day.",
      },
      {
        question: "Is Pandoku free, and does it work offline?",
        answer:
          "Both. No difficulty is locked behind a purchase, and the grids already live in the app, so Pandoku plays anywhere: a connection only matters for ads, signing in and purchases. The free version shows a banner and ads between some games. Rewarded ads are always optional, and Premium means no forced ads.",
      },
      {
        question: "Which devices can I play Pandoku on?",
        answer:
          "On iPhone and iPad with iOS 17.0 or later, and on Android with Android 8.0 or later. Premium is bought and kept in each store: a subscription taken on the App Store does not carry over to Google Play, and the other way round.",
      },
    ],
  },
  whereToPlay: {
    title: "Play Pandoku on iPhone, iPad and Android",
    body: "Pandoku lives in Cerebrum, the brain games app by Synapgeek. It is free to download and works without a connection, on the commute, in a waiting room, or whenever you have five minutes. Install it from the App Store on iPhone and iPad, or from Google Play on Android.",
  },
};
