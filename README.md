# Synapgeek Website

Site officiel de [Synapgeek](https://synapgeek.com), studio indépendant français d'apps
mobiles : un hub studio, une page par app (**Cerebrum**, app de jeux de réflexion pour iOS et
Android, d'abord) et par jeu, À propos, Presse, les pages légales obligatoires (politique de
confidentialité, CGU, mentions légales) et un formulaire de contact. Anglais par défaut,
français sous `/fr`. Le site est entièrement statique (SSG), sans base de données.

## Stack

Next.js 16 (App Router) · TypeScript strict · Tailwind CSS 4 · i18n maison (en/fr) · vitest ·
déployé sur Vercel (seule `main` déploie).

## Commandes

```bash
npm run dev             # Serveur de développement
npm run build           # Build de production
npm run start           # Serveur de production (build préalable requis)
npm run lint            # ESLint
npm test                # vitest : routes, redirections, JSON-LD, sitemap, gardes de copie
npm run format          # Prettier : écrit les fichiers
npm run check:contract  # URLs référencées par les stores (local ou production)
```

## Contribuer

Toutes les règles du projet (URLs légales à ne jamais casser, conventions de code, routage,
copie, processus, variables d'environnement) sont dans [`CLAUDE.md`](./CLAUDE.md) et dans
[`docs/contrat/`](./docs/contrat/) : à lire avant toute modification.
