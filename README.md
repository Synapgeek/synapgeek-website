# Synapgeek Website

Site vitrine de [Synapgeek](https://synapgeek.com), studio indépendant français qui édite
**Cerebrum**, une app de jeux de puzzle (Sudoku, Mots-Croisés, Mots-Mêlés, Cross Math,
Trace, Labyrinthe) pour iOS et Android.

Le site héberge la landing page (FR/EN), les pages légales obligatoires
(Privacy Policy, CGU/EULA, mentions légales) et le formulaire de contact. Il est
entièrement statique (SSG) — aucune base de données, aucun test, aucune CI.

## Stack

Next.js 16 (App Router) · TypeScript strict · Tailwind CSS 4 · i18n maison (fr/en) ·
déployé sur Vercel.

## Commandes

```bash
npm run dev       # Serveur de développement
npm run build     # Build de production
npm run start     # Serveur de production (build préalable requis)
npm run lint      # ESLint
npm run format    # Prettier — écrit les fichiers
```

## Contribuer

Toutes les règles du projet (routes légales à ne jamais casser, conventions de code,
architecture i18n, variables d'environnement, sous-agents, etc.) sont documentées dans
[`CLAUDE.md`](./CLAUDE.md) — à lire avant toute modification.
