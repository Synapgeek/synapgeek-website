> Source : cerebrum-android, branche release/3.0.0 @ 4c80b6093ab176bf199c8172580f60066f2f6493 (committé le 2026-09-23). Lu le 2026-10-02.
> Extraction en lecture seule par la session du site ; propriétaire : la session Android. Copie verbatim ci-dessous.

# Cerebrum Android 3.0.0: facts read from the code

## 1. Ref read

`release/3.0.0` @ `4c80b6093ab176bf199c8172580f60066f2f6493` (committed 2026-09-23T15:44:28+02:00, repo `/Users/adrienmonte/Documents/projects/synapgeek/cerebrum/cerebrum-android`, equal to `origin/release/3.0.0` as last fetched there; read only through `git show`, `git grep`, `git ls-tree`, `git log`, no checkout).

## 2. Facts table

Reading notes:
- iOS column = `docs/contrat/faits-cerebrum-3.0.0.md` (iOS tag v3.0.0). Android column = what the code at the SHA above does. `Same?` is `yes`, `differs` or `not found` (with what was searched).
- Paths are relative to the Android repo root. `J/` = `app/src/main/java/com/synapgeek/cerebrum/`, `R/` = `app/src/main/res/`, `P/` = `puzzle-pack/src/main/assets/puzzles/`.
- Content figures (grid sizes, mine counts, pools, word counts, level counts) were measured by parsing the puzzle JSON blobs of the ref with `git show`, not read from docs.
- `R/values*/strings_ios.xml` is the in-app catalogue mirrored from iOS. All 26 tutorial page title/body pairs of the iOS file (Trace 5, Maze 5, Pandoku 3, Minesweeper 4, Arrow Maze 5, Pixel Art 4) were matched string by string in FR and EN: 25 identical, 1 differs (Pixel Art page 3 body, see the Pixel Art "Tutorial" row).
- Caveat on freshness: the Android port tracked iOS `release/3.0.0` snapshots of 2026-09-12 to 2026-09-21 (`docs/port/pixelart.md:3`), while the iOS fact file was taken from the final tag. Gaps below that look like late iOS changes (Pixel Art lives, Minesweeper guided level) are real at this SHA, but see section 4 for whether the Play build is this SHA.

### A. App, devices, accounts, money

| Fact | iOS (fact file) | Android release/3.0.0 | Same? |
|---|---|---|---|
| Version on sale | 3.0.0 since 2026-09-28, free, 4+ (section 0) | `versionName` defaults to "3.0.0" (`app/build.gradle.kts:139-141`). Store state and price are not in code (Play listing per brief) | yes |
| Minimum OS | iOS 17.0 | Android 8.0 = `minSdk 26` (`build-logic/convention/src/main/kotlin/com/synapgeek/cerebrum/buildlogic/AndroidExt.kt:17`); `targetSdk 36` (`build-logic/convention/src/main/kotlin/CerebrumAndroidApplicationConventionPlugin.kt:20`) | differs |
| Devices | iPhone and iPad | Phones and tablets: tablet predicate `smallestScreenWidthDp >= 600` (`J/ui/theme/DeviceLayout.kt:454-455`), 80 tablet-only background drawables (`R/drawable-sw600dp-nodpi`, `R/drawable-sw600dp-night-nodpi`, 40 each); no `supports-screens` or `uses-feature` limit in `app/src/main/AndroidManifest.xml` | yes |
| Orientation | Portrait only (iPad portrait and upside-down) | Phones locked to portrait (`AndroidManifest.xml:50`). On tablets (sw600dp and up) the lock is lifted, rotation allowed (`J/MainActivity.kt:140-166`, `:310`); tablet landscape is not measured (`docs/divergences/systeme-et-play.md:83-93`) | differs |
| Watch, Mac, Vision, TV, home-screen widget | none | none: no AppWidget or Glance code, no Wear/TV/Auto declaration (grep on `app/src/main` and the manifest) | yes |
| Download size | about 476 MB (iTunes API) | not found: puzzles ship as an `install-time` asset pack (`puzzle-pack/build.gradle.kts:5-10`, `app/build.gradle.kts:54`); the pack is 236 MiB of raw JSON, compressed store size is not in code | not found |
| Age classification | 4+ | not found in code (Play Console). Repo docs only: IARC rating for all ages, target audience 13+ (`docs/divergences/systeme-et-play.md:71-81`, `docs/store/STORE_LISTING.md:35-44`); the Console is the authority | not found |
| Public store rating | FR 4.69/5 on 16 ratings etc. (section 6) | not found in code | not found |
| Interface languages | 16: en fr es pt-BR de it nl tr id vi ja ko zh-Hans zh-Hant hi th | The same 16 in the same order (`J/core/domain/localization/AppLanguage.kt:32-47`). 16 `R/values*` folders, each with the full 1,026-key mirrored catalogue; the 71 to 75 native `strings.xml` keys absent from each non-English folder are all `translatable="false"`, so no user-visible string falls back to English. All 16 ship in the same bundle (`app/build.gradle.kts:56-66`) | yes |
| First-launch language, switching | follows the device language else English; change in Profile; restart asked | Device preference list resolved to one of the 16, else English (`AppLanguage.kt:64-65`, `J/core/domain/localization/DeviceLanguageResolver.kt:33-54`). Change in Profile, then "Please close and reopen the app to apply the new language." (`J/features/profile/viewmodel/ProfileViewModel.kt:441-447`, `R/values/strings_ios.xml:461-462`). No OS-level per-app language entry (no `locales_config` in `R/xml`) | yes |
| Light and dark mode | yes | System, Light or Dark chosen in Profile (`J/ui/theme/DarkModeOverride.kt:13-22`, `J/features/profile/ui/ProfileScreen.kt:183,210`) | yes |
| Sounds and vibrations adjustable | yes | Sound volume and a haptics toggle (`ProfileViewModel.kt:436-439`). Effects ignore the phone's silent or ringer mode (`docs/divergences/systeme-et-play.md:154-164`) | yes |
| Screen reader | VoiceOver, Switch Control and Voice Control improved in 3.0.0 (sections 3 and 4) | TalkBack semantics exist on most boards (154 accessibility strings in `R/values/strings_ios.xml` plus 10 in `strings.xml`; `docs/divergences/accessibilite.md`). But: the tutorial "Next" button and the victory "Continue" button (shared by all ten games) have empty accessibility bounds, invisible to TalkBack and Switch Access, open and unfixed (`docs/port/A_PORTER.md:527-547`); Trace and Maze boards have cell announcements but no per-cell accessibility action, waiting on iOS (`A_PORTER.md:214-238`, `docs/recette/RECETTE_3_0_0.md:777-788`); Cross Math operator cells are hidden to screen readers and its number pool has no semantics (`accessibilite.md:95-105`, `A_PORTER.md:449-459`); the app cannot detect Switch Access, so its spoken-hint texts are tuned for TalkBack touch exploration only (`accessibilite.md:6-16`) | differs |
| Offline play | all grids of the ten games, Endless included, are in the app; everything playable offline (section 3) | Puzzle JSON for the ten games, endless folders included, ships in the install-time pack (`puzzle-pack/build.gradle.kts:5-10`, 114 puzzle files); writes are local-first (Room plus Firestore persistent cache of 100 MB, `J/app/di/FirebaseModule.kt:40,65-68`). Not proven on a device: the fresh-install-offline step is listed as unplayed (`RECETTE_3_0_0.md:186-190`) | yes |
| Sync after reconnect | progress, streak, score, gems, avatars, trophies, packs, universes queued then resumed | Eight sync adapters: game progress, theme progress, daily streak, score, wallet, avatar, monthly trophy, universe (`J/core/domain/sync/SyncEntityType.kt:18-25`); pending-operations queue (`J/core/services/sync/PendingOperationsQueue.kt`) | yes |
| Ads while offline | ads do not load offline | Ads need the network; the rewarded path loads without a network guard (open shared item B28, `A_PORTER.md:358-363`) | yes |
| Purchases while offline | not verified | not found: Play Billing needs Play; a purchase can be recorded and applied later (`R/values/strings.xml:198`) | not found |
| Guest play | guest from the first launch | Anonymous session created at startup (`J/CerebrumApplication.kt:296`); signing in later links to it | yes |
| Sign-in providers | Apple, Google or Facebook, optional | Apple, Google, Facebook, in that order, shown to everyone (`J/features/auth/ui/SignInSheet.kt:98-100,155-205`). No difference in the set. Mechanism differs: Apple = Firebase OAuth in a Chrome Custom Tab, no Apple SDK (`J/core/services/auth/provider/AppleAuthProvider.kt:14-18,77-80`); Google = Credential Manager (`provider/GoogleAuthProvider.kt:6`); Facebook = Facebook SDK (`provider/FacebookAuthProvider.kt:11,116-139`). No email and password UI | yes |
| Welcome gems at first sign-in | 500 | 500 once per account (`J/core/domain/rewards/SignInReward.kt:13`); the once-only gate lives in the Firestore wallet shared with iOS (`J/core/data/firestore/repository/FirestoreWalletRepository.kt:275-308`); offer copy `R/values/strings_ios.xml:1011-1018` | yes |
| Account deletion | possible from the app | Profile "Delete Account" (`R/values/strings_ios.xml:1231`); server function `deleteUserAccount` plus local wipe, needs the network (`J/core/services/deletion/FirebaseAccountDeletionService.kt:33-60`) | yes |
| synapgeek.com URLs hard-coded in the app | apex: `/privacy`, `/terms` (FR), `/en/privacy`, `/en/terms` (15 other languages), contact = home `#contact`, UTM `utm_source=cerebrum&utm_medium=app&utm_campaign=profile, sign_in or store_subscription` | Same. `https://synapgeek.com` when the in-app language is French, `https://synapgeek.com/en` otherwise, plus `/privacy` or `/terms`; contact = home `#contact`; same UTM values (`J/ui/util/LegalUrlProvider.kt:14-48`; call sites `J/features/profile/ui/sections/LegalSection.kt:54-80`, `SupportSection.kt:88-90`, `J/features/auth/ui/SignInSheet.kt:250-276`, `J/features/store/ui/components/SubscriptionTermsView.kt:74,87`). The `www` URLs in `R/values/strings.xml:15-16` are defined but referenced by no code | yes |
| Universal Links or App Links | none (no associated domains) | Declared: custom scheme `cerebrum://` and verified App Links for `https://www.synapgeek.com/app*` (`AndroidManifest.xml:58-77`, `J/ui/navigation/DeepLinkParser.kt:21,34`). Site topic is closed in the website CLAUDE.md; no action | differs |
| Consent flow | Google GDPR form (skipped outside EEA), explanation screen, then Apple ATT; refusal = non-personalised ads, nothing blocked | Google UMP form only, plus a "Privacy Settings" row to reopen it when required (`J/core/services/consent/UmpConsentService.kt`, `ConsentService.kt:15-17,65-70`, `LegalSection.kt:79-85`). No ATT and no explanation screen (`docs/divergences/systeme-et-play.md:29-39`). Analytics storage is granted whatever the choice (`docs/store/data-safety.md:120-130`) | differs |
| Data declared | advertising tracking (device ID, approximate location, interactions, purchase history); linked data (user ID, email, name); crashes and performance | Play Data safety as filed in the repo doc: name, email, account IDs, purchase history, crash logs, diagnostics, app interactions, other activity, device IDs, approximate location; AdMob and Meta gated by UMP (`docs/store/data-safety.md` sections "Ce qui est déclaré aujourd'hui" and "Ce qui part chez Meta"; `AndroidManifest.xml:100-143`). The Console was not readable; the doc says the Console prevails | yes |
| Premium billing model | auto-renewing weekly, monthly, yearly; three StoreKit products `com.synapgeek.cerebrumgame.premium.{weekly,monthly,yearly}` | One Play subscription `com.synapgeek.cerebrum.premium` with three base plans `premium-weekly/-monthly/-yearly` (`J/core/domain/store/StoreProduct.kt:96-111`, `J/core/domain/premium/PremiumTier.kt:30-32`). Entitlement comes only from Play purchases, never from Firestore or the App Store (`J/core/domain/premium/PremiumEntitlementDeriver.kt:39-53`). Plan change = time credit on Play (`docs/PLATFORM_DIVERGENCES.md`, entry "Changement de palier Premium") | differs |
| Premium perk list (EN paywall) | six lines | Identical six strings (`R/values/strings_ios.xml:420-425`; FR `R/values-fr/strings_ios.xml:387-392`; list built in `J/ui/components/premium/PremiumBenefitsList.kt:60-65`) | yes |
| Premium removes banner and between-game ads, not rewarded ads | yes | Banner and interstitials off for Premium (`J/core/services/ads/AdMobService.kt:63-69`); streak restore still needs a rewarded ad (`J/features/streak/ui/StreakRecoveryViewModel.kt:41,185`); daily gems claim skips the ad but keeps the once-a-day cap (`AdMobService.kt:768-780`) | yes |
| Premium infinite lives scope | only games that have lives, not Trace, Maze, Word Search | Sudoku, Crossword, Cross Math, Pandoku, Minesweeper, Arrow Maze only; Word Search, Trace, Maze and Pixel Art are excluded (`J/core/domain/premium/GamePremiumProfile.kt:54-63`) | differs |
| Premium 5 free hints a day per game | yes | 5 per day per game, all ten games (`J/core/services/premium/PremiumHintQuotaTracker.kt:50`, `GamePremiumProfile.kt:54-63`); Crossword: text and word hints share the pool, letter hint never (`J/features/crossword/viewmodel/CrosswordViewModel.kt:1245-1250,1285-1290`) | yes |
| Premium first mistake forgiven | first mistake of each game undone automatically | Same, no ad and no tap, in the games that have a mistake system (`J/core/services/gameplay/ErrorUndoController.kt:86-89`); nothing to forgive in Word Search, Trace, Maze or Pixel Art | yes |
| Premium daily gems and double gems | daily gems without an ad; automatic x2 after each win | Same (`AdMobService.kt:768-780`; `J/core/domain/progression/GameCompletionHandler.kt:123-145`; factor 2 `J/core/domain/wallet/CoinStreakMultiplier.kt:99`) | yes |
| Legacy ad-free subscriptions | withdrawn from sale, holders keep everything | Still honoured as an entitlement, in no sale list (`J/features/store/viewmodel/StoreViewModel.kt:183-194`, `AdMobService.kt:63-69`) | yes |
| Premium free trial | none known, reconfirm in ASC | not found: no trial code, the offer is picked by base plan only (`J/core/domain/store/PremiumOfferCandidate.kt:35-36`); Play Console configuration unknown | not found |
| Prices | not published | not found in code: Play `ProductDetails` are read at runtime (`J/core/services/billing/PlayBillingService.kt:345,380`). Only trace: a 1.99 EUR sale on 2026-09-07 (`docs/MANUAL_TASKS.md:20`), SKU not named | not found |
| Gem packs | starter 300, 500, 1,500, 5,000 | Same: starter 300 (non-consumable, one per user, hidden once owned), then 500, 1,500, 5,000 consumables (`J/core/domain/store/StoreProduct.kt:28-54`, `PlayBillingService.kt:965-975`, `StoreViewModel.kt:141-153`) | yes |
| Theme packs | Cinema, Cooking, Travel (EN Movies, Cooking, Travel); 100 grids per game per language; one pack opens Crossword and Word Search; in-app purchase only, not in Premium, not buyable with gems | Same names (`R/values/strings_ios.xml:902-907`, FR `R/values-fr/strings_ios.xml:866-871`); 100 per game per language (`J/core/domain/theme/PuzzleTheme.kt:25-42`, content `P/crossword/{en,fr}/themes`, `P/wordsearch/{en,fr}/themes`); bought through Play Billing only (`J/features/themes/viewmodel/ThemesViewModel.kt`, `StoreProduct.kt:60-74`); theme grids are Hard (JSON `difficulty: hard`); Pixel Art has no pack (`PuzzleTheme.kt:76-79`) | yes |

### B. Roster, structure, economy shared by the games

| Fact | iOS (fact file) | Android release/3.0.0 | Same? |
|---|---|---|---|
| Games and ids | ten games | Ten: sudoku, crossword, wordSearch, crossMath, zip, maze, pandoku, minesweeper, arrowMaze, pixelArt (`J/core/domain/game/GameType.kt:17-144`) | yes |
| New in 3.0.0 | Pandoku, Minesweeper, Arrow Maze, Pixel Art | Same four carry the NEW badge for 30 days (`J/core/services/newgamebadge/GameNewBadgeTracker.kt:136-141`, window `:147`), banner "4 new games!" (`R/values/strings_ios.xml:257`) | yes |
| In-app names EN and FR | Sudoku, Crossword/Mots Croisés, Word Search/Mots Mêlés, Cross Math, Trace, Maze/Labyrinthe, Pandoku, Minesweeper/Démineur, Arrow Maze, Pixel Art | Identical (EN `R/values/strings_ios.xml:37,39,41,49,53,84,142,220,1101,1148`; FR `R/values-fr/strings_ios.xml:30,32,34,37,39,60,109,187,1056,1102`). Cosmetic: some Android screens still show "Mots croisés" with a lower-case c (`R/values-fr/strings.xml:96-97`, `A_PORTER.md:309-317`) | yes |
| Names in the 14 other languages | Démineur translated, Pandoku, Arrow Maze, Pixel Art unchanged | Same, except German keeps "Minesweeper" (`R/values-de/strings_ios.xml:141`); Cross Math and Trace are unchanged in all 16; 13 languages translate Minesweeper (es Buscaminas, ja マインスイーパ, zh-Hans 扫雷...) | differs |
| Never write "Zip" | internal name of Trace | The UI says Trace in all 16 languages; "zip" is only the internal id (`GameType.kt:41-52`) | yes |
| Crossword and Word Search languages | French and English only; masked (hidden, not greyed) in the other 14, with the Themes tab and theme packs; owned packs are never removed | True only for en and fr (`J/core/domain/localization/WordContentAvailability.kt:22-44`); hidden from hub, daily picker, Themes tab and Store themes (`J/core/domain/localization/GameAvailability.kt:31,45-50`, `J/features/games/ui/GamesHubViewModel.kt:92-99`, `J/features/dailychallenge/ui/DailyChallengeViewModel.kt:346-358`, `J/ui/navigation/CerebrumNavSuite.kt:213-222,346-350`, `J/features/store/ui/StoreScreen.kt:352`); owned packs survive a language switch (`J/core/domain/localization/WordContentNotice.kt:46-57`); in-app notice `R/values/strings_ios.xml:745`, FR `R/values-fr/strings_ios.xml:709` | yes |
| Home order and favourites | fixed order Sudoku, Word Search, Pandoku, Minesweeper, Arrow Maze, Pixel Art, Trace, Maze, Cross Math, Crossword; a heart puts a tile first; device-only | Identical order (`J/features/games/ui/HomeGameOrdering.kt:21-32,53`); favourites in a local DataStore, never synced, kept through sign-out and deletion (`J/core/services/favorites/FavoriteGamesService.kt:26-33`) | yes |
| Difficulties per game | 4 with Elite: Sudoku, Cross Math, Trace, Maze, Pandoku, Minesweeper, Pixel Art; 3 without Elite: Crossword, Word Search, Arrow Maze | Same (`GameType.kt:202-207`); names Easy, Medium, Hard, Elite and Facile, Moyen, Difficile, Élite (`R/values/strings_ios.xml:573-576`, `R/values-fr/strings_ios.xml:540-543`) | yes |
| Difficulty unlocks | Easy and Medium open; Hard after 2 Medium levels; Elite after 4 Hard; Crossword, Word Search, Arrow Maze: Hard after 5 Medium | Same (`J/core/domain/game/GameDifficulty.kt:78-100`, `J/core/domain/progression/GameProgressUnlock.kt:20-52`); only progression levels count | yes |
| Levels | 100 per difficulty (per language for word games), opened one by one | 100 (`J/core/domain/game/EndlessConfiguration.kt:13`; every progression JSON holds 100); level N opens when N-1 is done (`J/features/progression/viewmodel/ProgressionPathViewModel.kt:597-608`); word-game progress is per language (`J/core/domain/progression/GameProgress.kt:40-49`) | yes |
| Endless Mode | opens on finishing level 100 of a difficulty; Sudoku and Maze 3000, others 1000; restarts when exhausted | Same (`J/core/domain/progression/GameProgressEndless.kt:27-37`, `GameType.kt:20-143`, wrap `EndlessConfiguration.kt:24-39`). Measured: Sudoku 3000 and Maze 3000 per difficulty, every other game 1000 per difficulty (and per language) | yes |
| Everything is free | no game, difficulty or level reserved to a purchase | No Premium or purchase check in the unlock rules or the progression and themes code (`GameDifficulty.kt:78-100`; no `isPremium` in `J/features/progression`); theme packs are the only paid content | yes |
| Lives, nine games | 3 errors or hearts: Sudoku, Crossword, Cross Math, Pandoku, Minesweeper; Arrow Maze 3 (4 on Hard); none: Word Search, Trace, Maze | Sudoku `J/features/sudoku/viewmodel/SudokuViewModel.kt:216`, Crossword `J/features/crossword/domain/CrosswordGameState.kt:85`, Cross Math `J/features/crossmath/viewmodel/CrossMathViewModel.kt:225`, Pandoku `J/features/pandoku/domain/PandokuGameState.kt:85`, Minesweeper `J/features/minesweeper/domain/MinesweeperGameState.kt:83`, Arrow Maze `J/features/arrowmaze/domain/ArrowMazeGameState.kt:154` (JSON `hearts` 3, 3, 4); Trace `J/features/zip/domain/ZipGameState.kt:84` and Maze `J/features/maze/domain/MazeGameState.kt:76` are `Int.MAX_VALUE`; Word Search has no error system (`J/features/wordsearch/domain/WordSearchStarRatingCalculator.kt:8-10`) | yes |
| Stars by errors | 0, 1, 2+ errors = 3, 2, 1 stars, hints ignored: Sudoku, Crossword, Cross Math, Pandoku, Minesweeper, Arrow Maze (and Pixel Art in the file) | The six use `StarRatingCalculator` (`J/core/domain/progression/StarRatingCalculator.kt:8-18,40-45`; call sites `SudokuViewModel.kt:1183`, `CrosswordViewModel.kt:2417`, `CrossMathViewModel.kt:1259`, `PandokuViewModel.kt:1565`, `MinesweeperViewModel.kt:1357`, `ArrowMazeViewModel.kt:1035`). Pixel Art is not among them: see the Pixel Art "Stars" row | yes |
| Stars Word Search | time, average per grid: 3 stars at or under 45, 120, 210 s; 2 stars at or under 90, 210, 360 s | Same (`WordSearchStarRatingCalculator.kt:44-49`) | yes |
| Stars Trace | time-based; do not publish thresholds | Time-based, same 3.0.0 values 15/30, 25/50, 32/65, 80/160 s (`ZipGameState.kt:99-103`, `:429-449`); do not publish | yes |
| Stars Maze | 1 star for finishing, +1 with all crystals, +1 under the target time | Same (`MazeGameState.kt:811-823`) | yes |
| Common hint price | 50, 75, 100, 150 gems (Easy to Elite), or a rewarded ad, or Premium daily hints | `hintCost` 50/75/100/150 (`GameDifficulty.kt:42-48`); ad and Premium paths per game (for example `SudokuViewModel.kt:1764`) | yes |
| Hint ads per day | rewarded hint "unlimited"; cap on ads not verified | Hint ads are not capped per day on Android (`J/core/services/ads/AdPlacement.kt:56-76`, `J/core/services/ads/AdConfiguration.kt:11-15`) | yes |
| Sudoku notes auto-fill by ad | 1 ad per day | Not capped: `NotesAutoFill -> null` (`AdPlacement.kt:65`), so `canUse` is always true (`J/core/services/ads/AdLimitsStore.kt:164-183`); a stale once-a-day tracker remains in the store but gates nothing | differs |
| Continue after a defeat | once by rewarded ad, once with gems 50/75/100/150 | Once by ad, once with gems, flags `hasUsedAdContinue` and `hasUsedCoinContinue` (`J/core/services/gameplay/GameOverContinueController.kt:50-88`, `SudokuViewModel.kt:2289-2323`); the player resumes with 2 of 3 hearts (`SudokuViewModel.kt:2304`). Gem costs are 50/75/100/150 except Crossword 75/150/250 (`J/core/domain/game/GameDifficultyExtensions.kt:15-51`) | differs |
| Free player error undo | once per game by ad | Once per game by rewarded ad (`ErrorUndoController.kt:82-84`; per game, not per day, `AdPlacement.kt:71-74`) | yes |
| Interstitials | at most one per 120 s of effective play, none before the 5th completed game, never after a defeat, none at launch | 120 s and 5 games (`AdConfiguration.kt:28,35`); defeat skipped (`J/core/services/ads/InterstitialPacingPolicy.kt:50-55`); no app-open ad class is used (grep `AppOpenAd`: none) | yes |
| Banner | one at the bottom during play | `J/ui/components/ads/BannerAdView.kt:56`; off for Premium (`AdMobService.kt:63-69`) | yes |
| Rewarded ads, always optional | hint, continue, x2 gems, daily bonus, streak restore, error undo | Placements: DailyClaim, FreeHint, ContinueAfterErrors, DoubleCoins, StreakRecovery, WordSearchHint, NotesAutoFill, FreeLetterReveal, ErrorUndo (`AdPlacement.kt:13-25`) | yes |
| Gems earned per level | on the first success of a level or when stars improve | `shouldAwardCoins = isFirstCompletion or isStarImprovement` (`J/core/services/gameplay/GameCompletionHandlerImpl.kt:848`); amount = score / 100 plus a streak bonus of +20% from 3 days, +50% from 7, +75% from 14, +100% from 30 (`CoinStreakMultiplier.kt:14-51`) | yes |
| Daily gems bonus | 100 per day | 100, once a day, rewarded ad (`AdConfiguration.kt:18,89`); Premium claims it without the ad | yes |
| Gem spending | hints, second chance, Sudoku notes, avatars 500 to 3,500, universes 3,000 | Same (`GameDifficulty.kt:42-62`, `J/core/domain/avatar/Avatar.kt:23-40`, `J/core/domain/universe/Universe.kt:32-42`) | yes |

### C. Per game

Sudoku

| Fact | iOS (fact file) | Android release/3.0.0 | Same? |
|---|---|---|---|
| Grid | classic 9x9, no variant | 9x9 (81-character puzzle strings in `P/sudoku/sudoku_easy.json`; 9 per digit `J/features/sudoku/domain/SudokuDigitTally.kt:35`) | yes |
| Given cells | Easy 40-45, Medium 34-38, Hard 28-33, Elite 24-28 | Measured on the 4 progression files (100 grids each): identical | yes |
| Controls and aids | Undo, Erase, Notes, Hint; duplicates highlighted; key greys at 9 correct; notes cleared from related cells | Four buttons (`J/features/sudoku/ui/board/SudokuActionBar.kt:73-78`, undo wired `J/features/sudoku/ui/SudokuGameplayScreen.kt:403`); conflicts red (`J/features/sudoku/ui/board/SudokuCellView.kt:287-317`); key mutes on correct count (`SudokuDigitTally.kt:25-35`); peer notes cleared (`J/features/sudoku/domain/SudokuGrid.kt:138-157`) | yes |
| Error rule | each digit checked at once, 3 errors end the game | `MAX_ERRORS = 3` (`SudokuViewModel.kt:216`) | yes |
| Hint | reveals a cell with a step-by-step explanation of the technique; notes fill 150/250/350/500 gems | Per-technique tutorial steps (`J/features/sudoku/domain/hints/HintTutorialStep.kt:3-17`, `J/features/sudoku/ui/components/HintTutorialPanel.kt:114`); `notesAutoFillCost` 150/250/350/500 (`GameDifficulty.kt:56-62`) | yes |
| Score | (1000 + bonus under 5 min - 100 per error - 50 per hint) x 1, 1.5, 2, 3 | `LevelScoreCalculator.kt:15-18,169-174` (`J/core/domain/progression/`), multipliers `GameDifficulty.kt:27-33` | yes |
| In-app rules tutorial | none for Sudoku, Crossword, Word Search, Cross Math | No `*_tutorial_*` strings for those four; only trace, maze, pandoku, minesweeper, arrow_maze, pixelart (`R/values/strings_ios.xml`) | yes |

Crossword

| Fact | iOS (fact file) | Android release/3.0.0 | Same? |
|---|---|---|---|
| Grids | freeform, non-square; Easy and Medium 9-12 x 10-12 (14-20 words); Hard 6-12 x 10-12 (9-15) | Measured on `P/crossword/{en,fr}/crossword_*_{easy,medium,hard}.json` (`"style": "freeform"`): Easy 9-12 x 10-12, 14-20 words; Medium 10-12 x 10-12, 14-19; Hard 6-12 x 10-12, 9-15 | yes |
| Keyboard and cursor | built-in AZERTY in FR, QWERTY in EN; same cell flips direction | `J/features/crossword/ui/components/CrosswordKeyboardView.kt:172-173,201-202`; `CrosswordViewModel.kt:978` | yes |
| Word check | checked when complete (accents ignored); right = locked; wrong = red, one heart lost, letters cleared | `J/features/crossword/domain/CrosswordGameState.kt:419-446,453-470`; FR grids pre-folded to A-Z (`:56-57`) | yes |
| Hearts | 3, Premium infinite | `CrosswordGameState.kt:85` | yes |
| Hints | text 25/40/60, letter 50/75/100, word 100/175/250 gems; text hint absent on Easy; word reveal has no ad | `J/features/crossword/domain/CrosswordHintType.kt:8-13,24-40`; `J/features/crossword/ui/CrosswordHintSheet.kt:43,60,387` | yes |
| Undo button | none | `undo()` exists but no UI calls it (`CrosswordViewModel.kt:1147`; only Sudoku's `SudokuGameplayScreen.kt:403` is wired) | yes |
| Daily challenge | Easy only | `GameType.kt:224` | yes |

Word Search

| Fact | iOS (fact file) | Android release/3.0.0 | Same? |
|---|---|---|---|
| Selection | drag in a straight line; direction matters, a reversed drag does not validate | `J/features/wordsearch/domain/WordSearchValidator.kt:62-77` (selection path must equal the word's cells in order) | yes |
| Grids per level | 3 imposed grids in a row, no random draw | `J/features/wordsearch/viewmodel/WordSearchViewModel.kt:218`, `J/features/wordsearch/data/WordSearchPuzzleRepository.kt:64-72`; JSON `puzzlesPerLevel: 3` in every file | yes |
| Sizes and words | Easy 7-9 (5-8 words, 4-7 letters), Medium 9-11 (7-11), Hard 11-12 (8-15, 3-9 letters); 8 directions, Hard adds reversed words | Measured: Easy 7-9, 5-8 words, 4-7 letters; Medium 9-11, 7-11 words, 4-8 letters; Hard 11-12, 8-15 words, 3-9 letters; reversed words (`horizontal_reverse`, `vertical_reverse`) only in Hard (`P/wordsearch/{en,fr}/wordsearch_*_*.json`) | yes |
| Word list by difficulty | visible Easy, blurred with the letter count Medium, hidden Hard | Easy full, Medium word plus count, Hard hidden (`J/features/wordsearch/ui/WordSearchGameplayScreen.kt:637-658`). On Android 8 to 11 the blur does not exist: the word is replaced by dots with the count (`J/features/wordsearch/ui/components/WordSearchWordListView.kt:82-87,476-519`) | differs |
| Errors | none, no lives, no defeat | No error system; time-based stars (`WordSearchStarRatingCalculator.kt:8-10`) | yes |
| Hints | Easy "reveal the word" 75; Medium and Hard "reveal the position" 75/100 and "show a word" 30/50 | `J/features/wordsearch/domain/WordSearchHintType.kt:12-16,38-53` | yes |
| Theme grids | 9-11, no reversed words | Measured on the 6 theme files: 9-11, no reversed direction | yes |

Cross Math

| Fact | iOS (fact file) | Android release/3.0.0 | Same? |
|---|---|---|---|
| Pool | the pool holds exactly the missing numbers, no decoys; place by tap or drag | In all 13,200 grids (1,200 progression plus 12,000 endless) the pool equals the missing numbers; drag overlay `J/features/crossmath/ui/components/CrossMathDragOverlay.kt` | yes |
| Operator precedence | respected; whole numbers; numbers to place 1-30, givens and results up to 100 | All 8,765 equations of the 4 progression files hold with x and / before + and -; 149 (Medium), 548 (Hard), 575 (Elite) multi-operator equations would be wrong read left to right; pool values 1-30, maximum 100 elsewhere. Validation is cell by cell against the stored solution (`J/features/crossmath/domain/CrossMathValidator.kt:9-15,28-35`; `MathOperator.kt:13-21`) | yes |
| Sizes, operators, pool size | Easy 5x5, + -, 4; Medium mostly 7x7 (also 9x7, 7x9), + - x, 6-9; Hard mostly 9x9, + - x /, 10-15; Elite mostly 9x9, 10-14 | Measured: Easy 5x5 for all 300 grids, 4 numbers; Medium 7x7 in 208/300, 9x7 72, 7x9 12 (plus 4 of 9x5 and 4 of 7x5), 6-9; Hard 9x9 210/300, 9x7 70, 7x9 20, 10-15, four operators; Elite 9x9 246/300, 9x7 39, 7x9 15, 10-14 | yes |
| Level structure | 3 grids in a row; nothing credited before the 3rd; timer and errors span all 3 | `J/features/crossmath/domain/CrossMathLevel.kt:6,21`; credit only after the last grid, error count spans the level (`CrossMathViewModel.kt:1229-1262`) | yes |
| Lives and feedback | 3 lives; a wrong number shows at once, clears itself after 5 s and returns to the pool; a right number locks; no general undo | `CrossMathViewModel.kt:225-228`; no UI undo (see Crossword row) | yes |

Trace

| Fact | iOS (fact file) | Android release/3.0.0 | Same? |
|---|---|---|---|
| Rules | one continuous path through every cell; numbered points in order; walls block; single solution | Checkpoint order enforced (`J/features/zip/domain/ZipGameState.kt:188-234`); JSON carries `walls` and `solutionPath` | yes |
| Grids (3.0.0) | Easy 5x5 (mostly) or 6x6, no walls; Medium 6x6 or 7x7, 0-6 walls; Hard 7x7, 2-8 walls; Elite 7x7, 4-7 walls with twin points (do not detail Hard and Elite) | Measured: Easy 259 of 5x5 and 41 of 6x6, no wall; Medium 249 of 6x6 and 51 of 7x7, 0-6 walls; Hard 300 of 7x7, 2-8 walls; Elite 300 of 7x7, 4-7 walls, `twinGroups` present | yes |
| Level and errors | 3 grids per level, continuous timer; no lives, no defeat; a forbidden move is refused without error | `J/features/zip/domain/ZipLevel.kt:6,22`; `ZipGameState.kt:84` | yes |
| Hint and ghost | back to the last good point if on a wrong path, else draws the next 3 cells; level 1 Easy has a starting ghost trace | `J/features/zip/domain/ZipHintEngine.kt:14-15,42-56,58-59`; `J/features/zip/domain/ZipGhost.kt:5-25` | yes |
| Tutorial | 5 pages with the quoted FR/EN texts | All 5 pages word for word in FR and EN (EN titles at `R/values/strings_ios.xml:65,67,69,71,80`; FR at `R/values-fr/strings_ios.xml:45,47,49,51,56`) | yes |

Maze

| Fact | iOS (fact file) | Android release/3.0.0 | Same? |
|---|---|---|---|
| Rules | guide a firefly to the exit portal, one cell at a time, no diagonal; arrows or swipe; walls block without penalty; no lives | Tutorial identical (`R/values/strings_ios.xml:105-120`, FR `R/values-fr/strings_ios.xml:78-93`); `MazeGameState.kt:76` | yes |
| Collectibles | optional crystals (needed for the 2nd star), a bubble (in a dead end, returns automatically to the next crystal or the exit), a rocket (auto-walks the corridor); no enemies or traps | Only `gem`, `bubble`, `autoAdvance` exist in the 400 progression mazes (1,246, 247, 292) (`J/features/maze/domain/MazePuzzle.kt:91`, `MazeGameState.kt:371-399,471-475`) | yes |
| Sizes | Easy 8-18, Medium 11-23, Hard 14-30, Elite up to 36 | Measured: Easy 8-18, Medium 11-23, Hard 14-30, Elite 17-36 per side (`P/maze/maze_*.json`) | yes |
| Elite fog | vision radius 3 on levels 1-50, 2 afterwards | `fog: {enabled: true, radius: 3}` on levels 1-50, radius 2 on 51-100; Endless Elite radius 2 (`P/maze/maze_elite.json`, `P/maze/endless/maze_endless_elite.json`) | yes |
| Overview button | unlimited without fog, 3 uses in Elite | `MazeGameState.kt:78-87,258-261` | yes |
| Hint | lights the next 6 cells of the shortest path for about 4 s | 6 cells (`J/features/maze/domain/MazeHintEngine.kt:19-20`), 300 ms plus 3,700 ms (`J/features/maze/viewmodel/MazeHintFlashEvent.kt:33-42`) | yes |
| Shapes and structure | 60% of mazes have a shape; one maze per level | Measured: 60% shaped (triangle, circle, heart...), 20% `full`, 20% `rect`; one maze per level | yes |
| Daily challenge | never Elite, so never fog | `GameType.kt:222-223` | yes |

Pandoku

| Fact | iOS (fact file) | Android release/3.0.0 | Same? |
|---|---|---|---|
| Rules | N x N grid, N colour regions, one panda per row, column and region, none touching even diagonally | `starsPerLine: 1` on all 400 progression grids; tutorial identical (`R/values/strings_ios.xml:186-192`); wrong-panda rule `J/features/pandoku/domain/PandokuGameState.kt:25-37` | yes |
| Size ramp | Easy 4x4 (1-5), 5x5 (6-15), 6x6 (16-35), 7x7 (36-60), 8x8 (61-100); Medium 8x8; Hard 9x9 then 10x10 from 51; Elite 10x10 | Measured identical (`P/pandoku/pandoku_*.json`) | yes |
| Gestures and hearts | tap = cross, two quick taps = panda, tap on a cross erases; a wrong panda costs 1 of 3 hearts and is removed, a right one locks; one panda given on Easy; no undo | Tutorial identical; `PandokuGameState.kt:29-31,85`; `givenStars` is 1 on every Easy grid and 0 elsewhere (`P/pandoku/pandoku_easy.json`); no undo UI | yes |
| Guided level 1 | Easy level 1 guided, 6 steps, no heart lost or timer, Skip button | 6 scripted steps then hand-off (`J/features/pandoku/domain/PandokuGuidedScript.kt:60,73-110`); mistaken taps refused before any heart is spent, clock held back (`J/features/pandoku/viewmodel/PandokuViewModel.kt:843-849,2157-2160`); Skip at `PandokuViewModel.kt:2461` | yes |
| Hint | names the available deduction then plays it (1 or 2 steps) | 2 steps for deductions, 1 for correction or fallback (`J/features/pandoku/domain/PandokuHintPresentation.kt:35-40`; copy `R/values/strings_ios.xml:157-170`) | yes |

Minesweeper

| Fact | iOS (fact file) | Android release/3.0.0 | Same? |
|---|---|---|---|
| Sizes and mines | Easy 9x8 (5-12 mines) then 11x9 from level 51 (13-17); Medium 14x11 (25-29); Hard 16x13 (39-43); Elite 18x14 (50-56) | Measured identical, rows x columns (`P/minesweeper/minesweeper_*.json`) | yes |
| Rules | numbers count the 8 neighbours; a zero cascades; tapping a saturated number opens its neighbours; flag by long press or flag-mode button; mine counter always shown; pinch zoom; 3 hearts, a mine costs one | `J/features/minesweeper/domain/MinesweeperGameState.kt:198-260` (dig, chord, flag), `:61-67`, `:83`; tutorial identical | yes |
| First tap | NOT guaranteed safe | `dig()` has no first-tap protection (`MinesweeperGameState.kt:198-213`); the generator's start cell is deliberately not exposed (`J/features/minesweeper/data/MinesweeperPuzzleParser.kt:33-38`); tutorial says it (`R/values/strings_ios.xml:242-243`) | yes |
| Hint | opens the next safe cell (removes a wrong flag first); the first paid hint may point at the generator's start cell | `J/features/minesweeper/domain/MinesweeperHintEngine.kt:33-38` (uses `safeOrder`, whose first entry is the generator's first click, for example cell 51 = row 6 column 3 in level 1) | yes |
| Guided level 1 | Easy level 1 guided, 4 steps | Absent: no guided script, no `minesweeper_guided_*` string (all 25 `minesweeper_*` keys listed: 4 tutorial pages, hint, accessibility), no mention in `docs/port/minesweeper.md`. Searched `J/features/minesweeper`, `R/values/strings_ios.xml`, the port sheet | differs |

Arrow Maze

| Fact | iOS (fact file) | Android release/3.0.0 | Same? |
|---|---|---|---|
| Rules | relaxing game; tap a piece anywhere; it exits if its straight path to the board edge is clear, else a heart is lost; win = empty board; always at least one free piece | Tutorial identical; every JSON puzzle carries a `solutionOrder` | yes |
| Hearts | 3, 4 on Hard | JSON `hearts` 3 (Easy, Medium), 4 (Hard) (`P/arrowmaze/arrowmaze_*.json`); `ArrowMazeGameState.kt:154` | yes |
| Grids | Easy 17x8 to 26x26 (20-141 pieces); Medium up to 34x34; Hard 13x26 to 39x39 (33-153); mostly silhouettes | Measured: Easy 17x8 to 26x26, 20-141 pieces; Medium up to 34x34, 34-127; Hard 13x26 to 39x39, 33-153 | yes |
| Controls and aids | drag to pan, pinch to zoom, overview button; long press shows the trajectory for free; paid hint points a free piece and its path | `J/features/arrowmaze/domain/ArrowMazeGestureMachine.kt:47-48`, `ArrowMazeBoardChoreography.kt:35` (350 ms); hint `J/features/arrowmaze/viewmodel/ArrowMazeViewModel.kt:221-222,1126-1206`; tutorial identical | yes |
| Difficulties | 3 only | `GameType.kt:205-206` | yes |

Pixel Art

| Fact | iOS (fact file) | Android release/3.0.0 | Same? |
|---|---|---|---|
| Grid sizes | Easy 5x5 (levels 1-5) then 8x8; Medium 10x10; Hard 12x12; Elite 15x15 | Easy is 8x8 on all 100 levels: no 5x5 grid exists anywhere in the pack (smallest is 8x8); Medium 10x10, Hard 12x12, Elite 15x15; Endless identical (`P/pixelart/pixelart_*.json`, `P/pixelart/endless/*`) | differs |
| Painting | black and white while playing; paint by dragging; Fill and Cross modes with a toggle | `J/features/pixelart/domain/PixelArtGameState.kt:90-91,197-200`; `J/features/pixelart/domain/PixelArtPaintGesture.kt` | yes |
| Undo | only undoes crosses | Undoes any gesture, fills and crosses (`PixelArtGameState.kt:250-267`; UI `J/features/pixelart/ui/PixelArtGameplayScreen.kt:458`) | differs |
| Lives and locking | 3 lives; a wrongly filled cell costs a life and becomes a locked cross; a right cell locks; a completed row or column crosses its empty cells automatically | Errorless: no hearts, no game over, nothing checked while painting, marks never locked (`PixelArtGameState.kt:6-10,26-27`; `J/features/pixelart/viewmodel/PixelArtViewModel.kt:87-90`; `PixelArtGameplayScreen.kt:1226`). Auto-crossing of completed lines: not found (searched `features/pixelart` for auto, lock, heart, life); a completed line only greys its clue (`J/features/pixelart/ui/components/PixelArtBoardView.kt:175-179`) | differs |
| Stars | by errors: 0, 1, 2+ = 3, 2, 1 | By time: 3 stars at or under 150/300/480/720 s, 2 stars at or under 240/480/780/1,200 s (Easy to Elite) (`PixelArtGameState.kt:58-64,180-188`) | differs |
| Victory reveal | the picture turns to colour (up to 4 colours) and its name appears; 2,217 names in 16 languages; grids independent of the language | Palette of 4 on the progression grids; 2,217 labels in each of 16 catalogues (`P/pixelart/pixelart_labels_*.json`); reveal and name panel (`PixelArtViewModel.kt:97-115,255-262`) | yes |
| Hint | one hint: corrects a mistake if any, else reveals a cell | "Repair first, then advance" (`J/features/pixelart/domain/PixelArtHintEngine.kt:41,85-89`) | yes |
| Tutorial | 4 pages; page 3 ends "Filling a wrong cell costs a life" | 4 pages; page 3 body stops at "It never costs anything." (`R/values/strings_ios.xml:1180-1181`; FR `R/values-fr/strings_ios.xml:1134-1135`). Other 3 pages identical | differs |

### D. Daily challenge, streak, progression systems

| Fact | iOS (fact file) | Android release/3.0.0 | Same? |
|---|---|---|---|
| One daily challenge for the whole app | the player picks the game in a selector | One CTA, a game picker, the first pick is locked for that date (`J/features/dailychallenge/ui/DailyChallengeViewModel.kt:263-292,343-364`; lock `J/core/data/firestore/repository/FirestoreDailyStreakRepository.kt:158-180`) | yes |
| Same grid for everyone | drawn by date plus game | Seed = FNV-1a of "date-gameId" (`J/features/dailychallenge/ui/DailyChallengeDraw.kt:22-42`). Nuance: Crossword and Word Search draw from the player's content language, FR or EN (`DailyChallengeViewModel.kt:456-459`); the date is the device's time zone (`:477-478`) | yes |
| Daily difficulty | Easy or Medium, Easy only for Crossword and Word Search | `GameType.kt:220-225` | yes |
| Daily offline | playable offline | Draw is computed on the device and grids are in the install pack (no network call in `DailyChallengeDraw.kt`); guests write to a local store (`J/core/data/owner/OwnerAwareDailyStreakRepository.kt:104-122`). Not proven offline on a device (see Offline row) | yes |
| Catch-up | a missed day can be played from the calendar | Missed days stay tappable even after today is done (`DailyChallengeViewModel.kt:157-181`); the calendar starts in February 2026 (`:136,387`) | yes |
| Monthly trophy | daily challenge done every day of a month | `J/core/services/trophy/MonthlyTrophyService.kt:18-23`; `DailyChallengeViewModel.kt:384` | yes |
| Streak rule | any finished level advances it, once a day, independent of the daily challenge | `J/core/services/streak/DailyStreakServiceImpl.kt:175-208` (a gap of more than one day resets to 1); `J/core/domain/streak/DailyStreak.kt:35-36,189-196` | yes |
| Streak restore | lost streak restored with a rewarded ad within 48 to 120 h by length, also for Premium | 2-6 days 48 h, 7-29 days 72 h, 30 and more 120 h; lost streak must be 2 or more; one restore per break (`DailyStreak.kt:80-85,457,474-478`); ad required (`StreakRecoveryViewModel.kt:41,185`) | yes |
| Evening reminder | a Live Activity on the lock screen counts down from 20:00 to midnight | An ongoing notification with a system countdown to midnight, started by a local 20:00 job; shown only if streak is 1 or more, today not played, notifications allowed (Android 13+ permission), toggles on, and not swiped away that evening (`J/core/services/notification/StreakCountdown.kt:11-20,39,76-91`, `StreakCountdownScheduler.kt:23-26,51-56`, `DailyPlayBadgeController.kt:188-253`, `AndroidManifest.xml:9`) | differs |
| Other streak alerts | local notifications: daily reminder and streak alerts | Streak warnings at 13:00, 19:00, 21:30 (21:30 dropped while the countdown runs) plus broken-streak, recovery, milestone, winback, inactivity day 2 and 5 (`J/core/services/notification/StreakReminderScheduler.kt:26-33`, `NotificationService.kt:195-405`); quiet hours 22:00-07:59 (`NotificationTiming.kt:18-22`) | yes |
| Leagues | 7 on cumulative score: Bronze, Silver, Gold, Platinum, Diamond, Master, Legend | `J/core/domain/xp/League.kt:18-24` (0, 5k, 25k, 100k, 300k, 750k, 2M); FR Bronze, Argent, Or, Platine, Diamant, Maître, Légende (`R/values-fr/strings_ios.xml:589-595`) | yes |
| Leaderboards | hidden in 3.0.0 | Route registered but "currently unreachable" (`J/ui/navigation/CerebrumNavSuite.kt:597-602`); footer has four tabs (`J/ui/navigation/NavSuiteViewModel.kt:48-53`); no `navigate` call to the route exists | yes |
| Avatars | 10: Panda free, Turtle at a 7-day streak, Deer at 30, 7 for gems (500 to 3,500) | Same (`Avatar.kt:23-40`: 500, 750, 1,000, 1,500, 1,500, 2,500, 3,500); streak unlocks use the all-time best, so they are permanent (`Avatar.kt:6-8`) | yes |
| Avatar growth | grows from baby to adult along the path | Baby levels 1-30, Teen 31-70, Adult 71-100 of the viewed difficulty (`J/core/domain/avatar/CharacterEvolution.kt:9-17,26-43`) | yes |
| Universes | Breeze free; Cascade, Lagoon, Blossom 3,000 gems each, not an in-app purchase; they dress the path and the ten games' backgrounds | `Universe.kt:32-42`; backgrounds exist for all ten games in each paid universe (`R/drawable/{cascade,lagoon,blossom}_*_ambient_background`) | yes |

## 3. Differences that change website copy

Rule of thumb for every item: when the Android fact differs, either write the platform-neutral sentence given here, or name the platform. Never carry the iOS wording over to Android.

1. Pixel Art has no lives on Android (Pixel Art rows "Grid sizes", "Undo", "Lives and locking", "Stars", "Tutorial", plus the row "Premium infinite lives scope"). Android: errorless, free painting of fills and crosses, undo takes back fills and crosses, stars by time, Easy starts at 8x8, tutorial page 3 says it never costs anything, Premium infinite lives do not apply. iOS file: 3 lives, locked cells, stars by errors, a 5x5 start.
   - Neutral wording (true on both): "Pixel Art: read the clues on each row and column, paint the grid, and watch the picture turn to color when you finish. A hint corrects a mistake before it reveals anything."
   - Never write for Pixel Art without naming the platform: lives, hearts, "a wrong cell costs a life", star rules, Easy grid size, "undo only erases crosses", locked cells, automatic crossing.
   - For the Premium sentence use the neutral "infinite lives in the games that have lives" (Android: six games, Pixel Art not among them).
2. Evening reminder. iPhone and iPad: "a Live Activity on the lock screen counts down the time left to save your streak, from 8 pm to midnight". Android: "a notification counts down the time left to save your streak, from 8 pm to midnight" (it appears only if you have a streak, have not played yet and allowed notifications; on Android 13 and later the app asks permission). Android also sends streak warnings at 1 pm, 7 pm and 9:30 pm.
3. Screen reader. iPhone and iPad: VoiceOver (the file also claims Switch Control and Voice Control). Android: write nothing about TalkBack, screen readers or accessibility. The code has TalkBack semantics on most boards, but the victory "Continue" and tutorial "Next" buttons are invisible to TalkBack and Switch Access (open item B42), Trace and Maze boards expose no per-cell action, Cross Math is not completable with Switch Access on either platform.
4. Minesweeper guided first level: iOS only. Pandoku's guided first level exists on both. Neutral wording: "Pandoku and Minesweeper each open with a short how-to-play sheet" (true on both: 3 and 4 pages). Do not write "guided first level" for Minesweeper on Android.
5. Sudoku "fill the notes" by rewarded ad: iOS file says once a day, Android has no daily cap. Do not state any daily limit on ad-funded hints or notes for either platform.
6. Second chance after a defeat: Crossword costs 75/150/250 gems on Android (the iOS file gives 50/75/100/150 for all games; the Android code comment says Crossword's curve mirrors iOS, so the file is probably incomplete). Do not print continue costs; "a second chance by watching an ad or with gems" is true everywhere.
7. Premium is bought and kept in each store. iPhone and iPad: App Store subscription (weekly, monthly, yearly). Android: Google Play subscription (weekly, monthly, yearly plans of one product). A subscription does not move between stores. No price, no trial claim on either (neither is verifiable).
8. Devices and OS. "iOS 17.0 or later" and "Android 8.0 or later" (Android minSdk 26 confirms the Play listing). Android phones stay in portrait; Android tablets may rotate, but landscape layouts are not measured, so do not advertise landscape.
9. Consent wording for the privacy page. Both: Google's consent form where required. iPhone and iPad only: Apple's tracking prompt (ATT) and its explanation screen. Android has neither.
10. Word Search Medium list: iOS and Android 12 or later blur the words; Android 8 to 11 shows dots. Neutral wording: "in Medium only the number of letters of each word shows; in Hard the list is hidden".
11. Silent mode: on Android the sound effects ignore the silent or ringer setting. Do not claim "respects silent mode" for Android.
12. German catalogue keeps the name "Minesweeper" (the iOS file says Démineur is translated in all 14 other languages). Only matters if a page lists localized game names.
13. Links and hosts. The Android 3.0.0 code builds privacy, terms and contact links on the apex `https://synapgeek.com` (and `/en`), same as iOS, not on `www`. The website CLAUDE.md line "L'app Android pointe le host www" does not describe this code: the `www` URLs in `strings.xml` are unreferenced; `www.synapgeek.com` still appears as the App Link host (`AndroidManifest.xml:75`) and, per repo docs, as the Play listing's contact website (`docs/store/STORE_LISTING.md:27`). Keep both hosts serving the contract URLs; no copy change.
14. App Links and `cerebrum://`: declared on Android, absent on iOS. The website topic is closed; no copy, no action requested.
15. Sign-in providers: no difference. Apple, Google, Facebook or guest on both; on Android "Sign in with Apple" opens a browser tab. Written here only to settle the question.

## 4. Not verifiable from the code

- Prices of gem packs, theme packs and Premium plans, and the "best offer" percentage: read from Play at runtime (`PlayBillingService.kt:345,380`). Only trace: one 1.99 EUR sale on 2026-09-07 (`docs/MANUAL_TASKS.md:20`), SKU not named.
- Premium free trial or introductory offers: Play Console configuration; no trial code exists.
- Rollout percentage, staged rollout state, and whether the AAB on Play is built from SHA `4c80b609`. The ref's last commit is 2026-09-23 and no ref in the local clone is newer (`git log --all`), but `origin` was not fetched and Play shows 3.0.0 since 2026-10-01. A later commit that ports the iOS Pixel Art lives or the Minesweeper guided level would flip the rows above. Ask the Android Claude session before publishing any Pixel Art or Minesweeper detail for Android.
- Download and install size, store rating and review count, countries, device catalogue (Chromebooks, foldables, devices without Google Play services). The app depends on Google Play (Billing, Play Integrity App Check on release builds, Credential Manager; `J/CerebrumApplication.kt:415-433`), so a build installed outside Play cannot write to the server (`docs/MANUAL_TASKS.md:237`).
- Age classification and "Contains ads" flag: Play Console only. Repo docs say content rating is for all ages and target audience 13+ (`docs/divergences/systeme-et-play.md:71-81`); the website CLAUDE.md "Points à trancher" item 2 is about exactly this.
- Data Safety form as currently filed: the Console was not readable; the repo doc says two lines (purchase history, app interactions) still had to be switched to "shared" (`docs/store/data-safety.md`).
- Whether purchases work offline (Play Billing needs Play) and how ads behave offline (open item B28, shared with iOS).
- Real-world screen-reader quality: only unit tests and one S20 FE `adb` pass (`RECETTE_3_0_0.md:798-805`); TalkBack itself was not playable by `adb` and B42 stays open.
- Cross-device reliability: repo docs record an open Android issue where App Check (Play Integrity) is intermittently refused, after which Firestore reads and writes fail (`docs/MANUAL_TASKS.md:89-102`, probe `J/core/services/appcheck/AppCheckStartupProbe.kt`). Do not promise "your progress is always synced" on Android without the Android session confirming it is closed.
- Apple and Facebook sign-in working on every device: depends on Firebase and Meta console configuration, not on code.
- Whether the Remote Config ad kill-switch is active, and the real ad fill.

## 5. Additional Android facts the iOS file does not cover (not counted above)

- Progress follows the account across iOS and Android: the `prod` flavor reads and writes Firebase `cerebrum-a657c`, the iOS project (`AGENTS.md:3`, `app/build.gradle.kts:280-303`), eight entity types synced (`SyncEntityType.kt:18-25`). Favourites, purchase journal, Premium entitlement and store purchases do not follow (`docs/PLATFORM_DIVERGENCES.md`, "Ce que « parité » veut dire ici"; `PremiumEntitlementDeriver.kt:39-53`). See the reliability caveat in section 4.
- The in-app Premium paywall subtitle reads "Play without limits - no ads, ever." (EN `R/values/strings_ios.xml:417`) and "Jouez sans limites : zéro pub, pour toujours." (FR `R/values-fr/strings_ios.xml:384`). Do not copy it: rewarded ads remain optional for Premium.
- The 20:00 countdown can be swiped away; once dismissed it does not return that evening (`StreakCountdown.kt:81-85`).
- AdMob publisher `ca-app-pub-2587609832551275` is shared with iOS (`app/build.gradle.kts:286-292`); no extra `app-ads.txt` line is implied by this code.
- Android-only deep links `cerebrum://game/<game>/<difficulty>/<level>` (`docs/divergences/systeme-et-play.md:95-104`).
- Android hides the system navigation bar in game screens (swipe from the bottom edge brings it back) (`docs/divergences/systeme-et-play.md:59-69`).
