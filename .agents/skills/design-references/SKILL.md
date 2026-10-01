---
name: design-references
description: Use when designing or visually exploring UI for synapgeek.com — a new section, page, component, hero, mockup, motion or interaction idea, a redesign — or when sourcing components/effects from external libraries or registries. Invoke BEFORE writing any code or mockup, not after.
---

# Design references — concevoir avec des yeux, pas seulement des poids

## Principe

Un design né du seul couple « repo + mémoire du modèle » ne produit pas d'idée
neuve : il recombine ce qui existe déjà. Ce skill impose une entrée d'air frais
AVANT le code, et borne son usage : des MÉCANISMES, jamais un look. Sur ce
portefeuille, un look emprunté à un site-frère est le signal qui tue
(`synapgeek-portfolio-rules` règle 1 : jamais de composants, tokens, templates
ni voix partagés ; règle 2 : jamais de lien vers un autre site). Les
références ne viennent donc jamais de Word Search Trove ni de Maze Foundry.

## Quand

- Nouvelle section/page/composant, mockup, refonte, idée de motion/interaction.
- Sourcing de composants ou d'effets externes (registries shadcn, libs).
- PAS pour : bugfix, copy, refactor sans changement visuel.

## Cadre fixe (ce que les références ne changent pas)

- Direction validée = la spec de refonte
  (`docs/superpowers/specs/2026-10-01-studio-hub-rework-design.md`) et ses maquettes (voir
  l'agent `designer`) : ce skill nourrit l'exécution, il ne rouvre pas la direction.
- Couleurs et typo = tokens de `src/app/globals.css` (`--color-*`, 3 variables de
  police). Jamais de hex en dur, jamais un sixième bouton (variantes de
  `src/components/ui/Button.tsx` seulement).
- Ton adulte, jamais adressé à l'enfant (règle 3 du skill portefeuille).
- Image nouvelle ou modifiée : `vercel.json` met 7 jours de cache sur
  `/images/*` — un fichier remplacé sous le même nom reste servi ; un
  changement = un NOUVEAU nom de fichier, références mises à jour.

## Workflow

### 1. Moodboard — obligatoire, avant toute ligne de code

Choisir dans [references/sources.md](references/sources.md) 2 galeries
adaptées au sujet, en tirer 3-5 sites candidats, puis **aller voir les sites
eux-mêmes** :

- session interactive : navigateur + screenshots ;
- sinon : WebFetch du site réel — typo et échelle réelles, palette, structure
  du layout, mécanique d'interaction lisible dans le HTML/CSS.

Une galerie 403 → en prendre une autre (fetchabilité notée dans sources.md).
Le moodboard se proportionne à la tâche (2 références pour un petit
composant) — il ne se saute pas.

### 2. Parti pris écrit — avant le code, dans le livrable

Le livrable (README de mockup, rapport de tâche, description de PR) CONTIENT une
section « Parti pris » aux 4 slots remplis :

1. **Références** : URLs réellement consultées (galeries + sites).
2. **Mécanismes retenus** : pour chaque référence, LE procédé emprunté (une
   mécanique, une structure, un timing — jamais « son look »).
3. **Risque choisi** : l'unique risque esthétique de la pièce (règle
   frontend-design : un seul, le reste discipliné).
4. **Refus** : ce qu'on écarte explicitement (cliché IA, mimétisme d'une
   référence, template « 3 icônes en cercle pastel », tout ce qui parle à un
   enfant, tout emprunt à un site-frère…).

Un parti pris rédigé après le code pour le justifier ne compte pas.

### 3. Idéation débridée, exécution gardée

- Idéation : esquisser 2-3 directions contrastées avant d'en choisir une.
  Ne PAS invoquer les skills correctifs à ce stade (`review-animations`,
  `ui-ux-pro-max:ui-styling`) — ils interviennent à l'exécution/review.
- Exécution : `emil-design-eng`, `apple-design` si gestes/springs, animations en
  `transform`/`opacity`, `prefers-reduced-motion` respecté, `web-accessibility`.

### 4. Composants externes — piocher des mécanismes

```bash
npx shadcn search @magicui --query "marquee"        # explorer
npx shadcn view @magicui/marquee                    # lire le code SANS installer
```

(Le serveur MCP shadcn de `.mcp.json` fait la même chose en langage naturel.)

- `view` puis RÉÉCRIRE dans le langage maison (tokens `globals.css`, primitives
  de `src/components/ui/`, reduced-motion) — jamais `add` tel quel dans `src/`.
  Un effet Aceternity/Magic UI reconnaissable tel quel = composant templaté.
- Aucune librairie d'animation n'est installée : en ajouter une se justifie dans
  le plan avant d'être écrite.
- Vérifier la licence dans sources.md avant d'emprunter du code.

### 5. Boucle œil — après implémentation

Screenshot du rendu réel (navigateur sur `npm run dev` ou la preview), mobile
et desktop, critique contre le parti pris écrit, itération. Un design jamais
regardé n'est pas fini.

## Rationalisations connues

| Excuse                                                           | Réalité                                                                                     |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| « L'identité du site est déjà définie, je recombine l'existant » | L'identité fixe palette/typo/ton — pas les mécanismes. Le moodboard cherche des mécanismes. |
| « Je connais ces sites de mémoire »                              | Les sites changent. 10 min de fetch réel valent mieux qu'un souvenir.                       |
| « Ce composant registry est parfait tel quel »                   | Tel quel = templaté. `view` → réécrire.                                                     |
| « Petit composant, pas besoin de références »                    | Le moodboard se proportionne, il ne se saute pas.                                           |
| « Le site-frère fait déjà ça très bien »                         | Règle 1 du portefeuille : couche visible partagée = signal de scaled content abuse.         |
