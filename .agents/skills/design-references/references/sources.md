# Sources vérifiées — galeries 2026-08-13, registries 2026-10-01

Galeries : statuts et fetchabilité vérifiés le 2026-08-13, non re-vérifiés depuis.
Registries : licences re-vérifiées le 2026-10-01 par WebFetch des pages GitHub /
pricing (voir tableau). Un résumé WebFetch n'est pas le texte de la licence. Ces modèles changent vite : au
moindre doute, re-vérifier la page pricing/licence avant de s'appuyer dessus.

## Galeries d'inspiration (gratuites, `how_to_use = regarder`)

| Galerie                                                                     | Pour quoi                                                                              | WebFetch                  |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------- |
| [landing.love](https://www.landing.love/)                                   | LE motion : 2 141 sites animés en VIDÉO, filtres GSAP/WebGL/Three.js                   | OK                        |
| [hoverstat.es](https://www.hoverstat.es/)                                   | micro-interactions, hover states, navigations expérimentales — chaque entrée commentée | OK                        |
| [recent.design](https://recent.design/) (ex-Godly ; godly.website redirige) | curation quotidienne très sélective : motion, typo, 3D                                 | OK                        |
| [dark.design](https://www.dark.design/)                                     | direction sombre (Linear, Vercel, OpenAI…)                                             | OK                        |
| [seesaw.website](https://www.seesaw.website/)                               | goût très sûr, agences/design tools, maj quotidienne                                   | OK                        |
| [minimal.gallery](https://minimal.gallery/)                                 | direction sobre/typographique, 70+ tags                                                | OK                        |
| [siteinspire.com](https://www.siteinspire.com/)                             | vétéran, filtres croisés très fins, goût classique                                     | OK                        |
| [httpster.net](https://httpster.net/)                                       | brutalist/typo/rétro — contrepoint au SaaS gradient                                    | OK                        |
| [footer.design](https://www.footer.design/)                                 | hyper-niche : uniquement des footers, filtre « animated »                              | OK                        |
| [onepagelove.com](https://onepagelove.com/)                                 | 9 000+ one-pagers + 8 688 sections, critique écrite du curateur                        | OK                        |
| [curated.design](https://www.curated.design/)                               | esthétique très actuelle (SaaS, brutalist-clean)                                       | OK                        |
| [awwwards.com](https://www.awwwards.com/)                                   | winners/nominees, motion/WebGL primés (navigation gratuite)                            | variable                  |
| [thefwa.com](https://thefwa.com/)                                           | web expérimental/immersif (WebGL, storytelling)                                        | variable                  |
| [lapa.ninja](https://www.lapa.ninja/)                                       | 6 000+ landing pages par catégorie/couleur                                             | 403 anti-bot → navigateur |
| [unsection.com](https://www.unsection.com/)                                 | 4 000+ sections par style (bento, 3D, gradient)                                        | compte gratuit requis     |

Freemium/payant — à éviter en budget zéro : Mobbin (free tier étroit),
Land-book (Pro 6 $/mois), Refero, Page Flows, SaaS Interface (payants).

## Registries de composants (mécanismes à piocher, jamais un look)

Index officiel : https://ui.shadcn.com/r/registries.json (~600 registries,
namespaces résolus SANS `components.json`). MCP shadcn officiel branché dans
`.mcp.json` (à la racine du repo ; Adrien l'approuve au démarrage de session) (browse/search/install en langage naturel). Explorer sans
installer : `npx shadcn search @ns --query "…"` puis `npx shadcn view @ns/x`.

| Namespace / accès                                                                     | Site                  | Style                                                       | Licence vérifiée                                                                                                    |
| ------------------------------------------------------------------------------------- | --------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `@magicui`                                                                            | magicui.design        | animations marketing : marquee, bento, beams, number ticker | MIT, repo « Free. Open Source. » (vérifié 2026-10-01 ; Pro/templates payants non re-vérifiés)                       |
| `@react-bits`                                                                         | reactbits.dev         | le plus « wow » : backgrounds animés, WebGL, text FX        | ⚠ MIT + Commons Clause, « free for personal and commercial use » (vérifié 2026-10-01 ; revente interdite)           |
| `@aceternity`                                                                         | ui.aceternity.com     | hero effects, spotlight, 3D cards (Framer Motion)           | ⚠ composants gratuits ; Pro payant (169 $/an, 199 $ à vie, vérifié 2026-10-01) ; texte de licence non lu            |
| `@motion-primitives`                                                                  | motion-primitives.com | primitives d'animation sobres, production-ready             | MIT (vérifié 2026-10-01)                                                                                            |
| `@cult-ui`                                                                            | cult-ui.com           | dynamic island, texture cards, morphing dialogs             | MIT (vérifié 2026-10-01 ; aucun Pro mentionné sur le repo) ; ⚠ entrée d'index marquée « unavailable » le 2026-10-01 |
| `@smoothui`                                                                           | smoothui.dev          | micro-interactions springs, reduced-motion aware            | MIT (vérifié 2026-10-01)                                                                                            |
| `@kokonutui`                                                                          | kokonutui.com         | UI produit + touches motion, AI inputs                      | MIT (vérifié 2026-10-01 ; aucun Pro mentionné sur le repo)                                                          |
| URL directe (hors index) : `originui.com/r/comp-XX.json`, lecture seule, jamais `add` | originui.com          | app UI sobre : inputs, selects, calendars, tables           | ⚠ MIT historique mais projet legacy (absorbé par coss.com/Cal.com, monorepo AGPL)                                   |
| copy-paste / registry                                                                 | tailark.com           | blocks landing complets (hero, pricing, footers)            | MIT (blocks gratuits)                                                                                               |
| copy-paste / registry                                                                 | fancycomponents.dev   | typo expressive/weird (scramble, physics)                   | MIT                                                                                                                 |
| copy-paste                                                                            | hyperui.dev           | HTML Tailwind statique, zéro JS                             | MIT                                                                                                                 |
| copy-paste                                                                            | animata.design        | bento grids, widgets, text effects                          | MIT                                                                                                                 |
| copy-paste                                                                            | uiverse.io            | loaders/boutons/toggles CSS one-off                         | MIT, qualité très variable                                                                                          |
| npm `@paper-design/shaders-react`                                                     | paper.design          | mesh gradients, grain, metaballs — sans écrire de GLSL      | Apache-2.0                                                                                                          |
| npm `vaul`, `sonner`                                                                  | emilkowalski          | drawer bottom-sheet iOS-like, toasts — référence motion     | MIT                                                                                                                 |

## 21st.dev (la référence payante, pour mémoire)

Non re-vérifié le 2026-10-01 : navigation illimitée gratuite + 2 copies de composants/jour ; installs
illimités à 6 $/mois (Builder). MCP « 21st » — attention : l'ancien Magic MCP
est DÉPRÉCIÉ, clés révoquées. L'index shadcn ci-dessus couvre l'essentiel
gratuitement ; 21st.dev n'est utile que pour son catalogue communautaire
propre.

## Écarts constatés le 2026-10-01

- L'index https://ui.shadcn.com/r/registries.json, tel que lu par WebFetch, ne
  confirme que `@aceternity` et `@cult-ui` (ce dernier « unavailable », caché) ;
  `@magicui`, `@react-bits`, `@motion-primitives`, `@smoothui`, `@kokonutui`
  n'y sont pas apparus. Peut venir du résumé tronqué de WebFetch : avant de
  compter sur un namespace, tester `npx shadcn view @ns/x`, sinon passer par le
  site ou le repo du projet.
- Cult UI : MIT, repo décrit « Free. Open Source. », aucun Pro mentionné (la
  note « Pro payant » du 2026-08-13 n'est pas reconfirmée).
- Aceternity : plans Pro 169 $/an, 199 $ à vie ; pas de texte de licence lu.
- Galeries, tailark, fancycomponents, hyperui, animata, uiverse, paper-design,
  vaul/sonner, originui, 21st.dev : NON re-vérifiés (dernière vérification
  2026-08-13).

## Rappel portefeuille

Tout ce qui précède nourrit des MÉCANISMES. La couche visible de synapgeek.com
reste la sienne (`synapgeek-portfolio-rules` règle 1 : aucune couche visible
partagée avec Word Search Trove ou Maze Foundry ; règle 2 : aucun lien vers eux) :
piocher, transformer, jamais adopter tel quel.
