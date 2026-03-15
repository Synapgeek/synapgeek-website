# Synapgeek Website

## Contexte

Site web de Synapgeek, studio indie français développant **Cerebrum** (app iOS de puzzles). Le site sert de landing page, héberge les pages légales obligatoires Apple (Privacy Policy, CGU/EULA), et fournit les URLs référencées dans App Store Connect.

## Stack technique

- **Framework** : Next.js 16.1 (App Router, `src/` directory)
- **Style** : Tailwind CSS 4.x (CSS-first config via `@theme`, pas de `tailwind.config.js`)
- **Langage** : TypeScript strict mode
- **Linter** : ESLint 9 + eslint-config-next + Prettier
- **Email** : Nodemailer via SMTP Google Workspace
- **Captcha** : Google reCAPTCHA v2
- **Analytics** : Vercel Analytics + Vercel Speed Insights
- **Déploiement** : Vercel (push sur `main` = deploy automatique)
- **Langues** : Français (défaut) + Anglais (i18n via fichiers statiques dans `src/content/`, pas de `next-intl`)

## Commandes

```bash
npm run dev       # Serveur de développement
npm run build     # Build de production
npm run lint      # ESLint
npm run format    # Prettier
```

## Conventions de code

- Pas de `any` TypeScript implicite
- Composants React : functional components uniquement
- Images : `next/image` obligatoire
- Fonts : `next/font` (pas de Google Fonts externe)
- Pages légales : générées en SSG
- Tailwind v4 : config via `@theme {}` dans le CSS, `@import "tailwindcss"`, détection auto des fichiers

## Structure des routes

Routes actives :
```
/                → Landing page Synapgeek + Cerebrum (FR, défaut)
/en/             → Landing page (EN)
/privacy         → Privacy Policy (FR)
/terms           → CGU / EULA (FR)
/en/privacy      → Privacy Policy (EN)
/en/terms        → CGU / EULA (EN)
/api/contact     → API route formulaire de contact (POST)
```

Routes prévues (pas encore implémentées) :
```
/blog            → Blog / changelog
/apps/[slug]     → Pages dédiées par app
```

## Architecture i18n

- **Locale par défaut** : `fr` (pas de préfixe dans l'URL)
- **Autres locales** : préfixe `/en/`
- **Proxy** (anciennement middleware) : rewrite des URLs sans préfixe vers `/fr/...` (pas de redirect)
- **Contenu** : fichiers statiques `src/content/fr.ts` et `src/content/en.ts`
- **Types** : `src/content/types.ts` (Dictionary)
- **Helpers** : `src/lib/i18n.ts` (locales, paths) + `src/lib/seo.ts` (hreflang, canonical, OG)

## SEO (implémenté)

- `<title>` et `<meta description>` dynamiques par page et par locale
- Open Graph tags sur toutes les pages (titre, description, type, locale, alternateLocale, image)
- OG image custom (`public/images/brand/og-image.jpeg`)
- Hreflang `<link rel="alternate">` sur toutes les pages (fr + en + x-default)
- Canonical URL sur toutes les pages
- `sitemap.xml` avec alternates hreflang pour toutes les entrées
- `robots.txt` avec référence au sitemap
- JSON-LD `Organization` sur toutes les pages
- JSON-LD `SoftwareApplication` sur la landing page
- `app-ads.txt` pour la vérification AdMob

## Sécurité (implémenté)

- Headers de sécurité via `vercel.json` : HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, X-DNS-Prefetch-Control
- DDoS protection automatique Vercel
- Formulaire de contact protégé par reCAPTCHA v2
- Emails obfusqués (pas de mailto en clair dans le footer)

## Assets (structure public/)

```
public/
├── app-ads.txt
├── images/
│   ├── brand/
│   │   ├── logo-synapgeek.png      (logo cerveau coloré, fond transparent)
│   │   ├── logo-original.png       (logo haute résolution)
│   │   └── og-image.jpeg           (Open Graph image)
│   ├── games/
│   │   ├── feature-sudoku.png
│   │   ├── feature-crosswords.png
│   │   ├── feature-wordsearch.png
│   │   └── feature-crossmath.png
│   └── hero/
│       ├── hero-bg-desktop.png     (flat lay breakfast, Replicate)
│       ├── hero-bg-mobile.png      (version portrait)
│       ├── hero-screen-main.png    (screenshot app)
│       ├── hero-screen-daily.png   (screenshot daily challenge)
│       └── hero-screen-avatars.png (screenshot victoire)
```

## Règles critiques

- **JAMAIS casser les URLs `/privacy` et `/terms`** — elles sont référencées dans App Store Connect et dans la config AdMob consent (UMP). Un 404 = rejet potentiel de Cerebrum sur l'App Store.
- **JAMAIS de vente de contenu digital sur le site** — tout achat passe par StoreKit 2 dans l'app (guideline Apple 3.1.1).
- **JAMAIS de lien de paiement externe** pour du contenu consommable dans l'app.
- Les pages légales doivent être accessibles sans JavaScript (SSG).
- HTTPS obligatoire (géré par Vercel).
- La privacy policy doit refléter **exactement** les données collectées par l'app (correspondance avec App Store nutrition labels et PrivacyInfo.xcprivacy).

## Cerebrum — Infos app iOS

Repo iOS : `/Users/adrienmonte/Documents/projects/synapgeek/cerebrum-ios`

### Jeux

4 jeux de puzzle : **Sudoku**, **Mots-Croisés**, **Mots-Mêlés**, **Cross Math**
- Chaque jeu a 3-4 niveaux de difficulté (Easy, Medium, Hard, Elite)
- 100 niveaux de progression par difficulté + mode endless
- Défis quotidiens, séries de jeu (streaks), trophées mensuels

### Fonctionnalités

- Système de progression (étoiles, XP, ligue/classement : Bronze → Legend)
- Monnaie virtuelle (pièces) pour indices, avatars, etc.
- Collection d'avatars
- Classements (leaderboards) par jeu
- Mode hors-ligne (local-first avec SwiftData, sync Firestore)

### Achats in-app (StoreKit 2)

**Consommables :**
- 500 Pièces — $1.99
- 1 500 Pièces — $4.99
- 5 000 Pièces — $9.99

**Non-consommables :**
- Starter Pack (300 Pièces) — $0.99
- Sans publicité à vie — $29.99
- Premium à vie — $79.99

**Abonnements Sans publicité :**
- Mensuel — $2.99/mois
- Annuel — $14.99/an

**Abonnements Premium :**
- Mensuel — $5.99/mois (sans pub + thèmes + 100 pièces/jour + boost 50%)
- Annuel — $44.99/an

### Stack technique iOS

- **Swift** + **SwiftUI**
- **Firebase** : Analytics, Crashlytics, Performance, Firestore, Auth, Storage, Functions (App Check désactivé — à réactiver après création compte Apple Developer)
- **Google Mobile Ads** (AdMob) : bannières, interstitiels, rewarded, app open
- **AdMob App ID** : `ca-app-pub-2587609832551275~3649546176`
- **Auth** : Apple Sign-In, Google Sign-In, Facebook Sign-In, Email/Password, Anonymous
- **Consent** : UMP (GDPR/EEE) + ATT (IDFA) — URL consent : `https://synapgeek.com/privacy`
- **SKAdNetwork** : 48 réseaux configurés
- **Stockage local** : SwiftData (cache 100 MB Firestore)

### Données collectées

| Catégorie | Données |
|---|---|
| Compte | Firebase UID, email, nom, photo (selon provider) |
| Gameplay | Scores, temps, indices, erreurs, étoiles, niveaux, difficulté |
| Progression | Streaks, pièces, avatars, trophées, XP, ligue |
| Appareil | Type, OS, langue, diagnostics |
| Publicité | IDFA (avec consentement ATT), interactions pubs |
| Transactions | Historique achats (via StoreKit 2, pas de données de paiement) |

**Non collecté** : géolocalisation, santé, contacts, photos, caméra, calendrier, microphone.

### Suppression de compte

Implémentée dans l'app (Profil > Supprimer le compte). Cloud Function `deleteUserAccount()` supprime : Firestore subcollections, document utilisateur, leaderboards, Firebase Auth.

### Public cible

- 16 ans et plus (pas de mécanisme COPPA)
- Pas de contenu restreint
- iPhone + iPad (orientation portrait)

## Skills auto-chargés

Les skills suivants sont installés dans `.claude/skills/` et doivent être consultés automatiquement selon le contexte de la demande :

| Skill | Quand l'utiliser |
|---|---|
| `next-best-practices` | Toute création/modification de composant, route, ou page Next.js |
| `next-cache-components` | Travail sur le caching, PPR, `use cache`, `cacheLife`, `cacheTag` |
| `vercel-react-best-practices` | Écriture ou refactoring de composants React, optimisation perf |
| `vercel-composition-patterns` | Architecture de composants, patterns de composition React |
| `tailwind-design-system` | Création de composants UI, design tokens, design system |
| `typescript-advanced-types` | Types complexes, generics, utility types |
| `web-accessibility` | Tout travail sur l'UI — toujours vérifier l'accessibilité (WCAG 2.1) |
| `performance-optimization` | Optimisation perf, bundle size, lazy loading, code splitting |
| `webapp-testing` | Tests d'interface, vérification du rendu, screenshots Playwright |
| `shadcn` | Ajout ou modification de composants shadcn/ui |
| `seo-audit` | Audit SEO, meta tags, indexation, Core Web Vitals |
| `page-cro` | Optimisation de conversion sur les pages marketing/landing |
| `schema-markup` | Données structurées JSON-LD, rich snippets Google |
| `analytics-tracking` | Tracking analytics, events, conversions, GA4/Vercel Analytics |
| `find-skills` | Quand une fonctionnalité manque — chercher si un skill existe |
| `legal` | Rédaction/audit des pages légales (Privacy Policy, ToS, EULA) conformes App Store, GDPR, CCPA |
| `app-store-review` | Conformité App Store Review Guidelines, prévention des rejets, privacy manifests |
| `privacy-policy` | Scaffold structuré de privacy policy (14 sections, mapping juridictionnel) |
| `localization-strategy` | SEO multilingue (hreflang, structure URLs i18n, keywords par marché) |

**Règle** : Ne pas attendre qu'on demande explicitement un skill. Si la tâche en cours correspond à un skill, le lire et appliquer ses recommandations automatiquement.

## Variables d'environnement

```
SMTP_USER=adrien.monte@synapgeek.com    # Login SMTP Google Workspace
SMTP_PASS=****                           # App password Google
CONTACT_EMAIL=contact@synapgeek.com      # Destinataire du formulaire
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=****      # reCAPTCHA v2 site key
RECAPTCHA_SECRET_KEY=****                # reCAPTCHA v2 secret key
```

## Emails

- **contact@synapgeek.com** — Contact général, destinataire du formulaire, CGU
- **privacy@synapgeek.com** — Questions données personnelles, RGPD, privacy policy
- **adrien.monte@synapgeek.com** — Dev, compte SMTP
