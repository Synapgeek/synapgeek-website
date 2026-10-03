# Plan de redirection : bascule de synapgeek.com vers la refonte

> **État : R1 et T1 appliqués dans la branche le 2026-10-03, non mergés ; changements de console à
> faire** (section 5). Le reste du plan (G1, D1, consoles) n'est pas appliqué. Date : 2026-10-03.
> Rédigé à partir de trois inventaires (apps installées, consoles et fiches, espace d'URLs du site)
> et d'une mesure (production par curl, build de production local de la refonte sur
> `http://localhost:3201`). Le code fait foi. Préfixes de source : `rework:` pour le worktree
> `.claude/worktrees/rework` (branche `feat/studio-hub-rework`, HEAD `2e83a82` plus la copie de
> travail), `main:` pour la branche en production. Aucun fichier de code n'a été modifié pour
> écrire ce plan.

## Décisions d'Adrien (2026-10-03)

1. **R1 : OUI.** Deux règles 307 conditionnelles pour le lien Contact des apps installées, livrées
   dans le même déploiement que le 308 `/en`.
2. **QR imprimés : `/play`.** Rien à faire : `/play` reste un alias 307 à vie (question 2 réglée,
   aucune règle d'urgence sur `main`).
3. **C4 tranché : le site web de la fiche Google Play devient `https://synapgeek.com/cerebrum`**
   (apex obligatoire). Changement de console, à faire après le merge (K6).
4. **Perte acceptée** des ancres `#features`, `#faq`, `#about` et des captures
   `/images/hero/screen-*.webp` (question 5).

**Appliqué dans la branche** : R1 (`next.config.ts`, `appContactRedirects`), T1
(`src/app/legacy-redirects.test.ts`, `scripts/check-contract-urls.mjs`) et le contrat écrit
(`architecture.md` section 1.4, `src/app/CLAUDE.md` règle 3, `lancement.md` A5). Mesure : le
matcheur de Next ancre déjà `has.value` (le cas `utm_medium=apps` répond 200 même sans `^…$`) ;
les ancres explicites sont gardées pour le routeur de Vercel, que la suite ne peut pas exercer.

## 0. Décisions de `site-architect`

Verdict global : **GO-avec-réserves**. Toutes les réserves sont intégrées dans le texte ci-dessous.

| Point | Décision | Réserve intégrée |
| ----- | -------- | ---------------- |
| R1 : deux règles conditionnelles en 307 pour le Contact des apps | GO-avec-réserves | Tests existants à réécrire (section 4, T1). Amender la règle « aucune query dans une destination » d'`architecture.md:97-98`. Prouver l'ancrage de `has.value` par un cas `utm_medium=apps`. Garde côté apps par un test dans leur dépôt |
| T1 : attentes `check:contract` et tests | GO-avec-réserves | Réécrire les gardes d'ordre et de permanence (gardes d'ordre et de permanence de `legacy-redirects.test.ts`). Garder `CAMPAIGN_PARAM` tel quel (non-régression du 308 `/en`) |
| Mise à jour du contrat écrit | GO-avec-réserves | Citer aussi `architecture.md:79-85` et `:97-98`. Corriger le commentaire d'en-tête de `check-contract-urls.mjs` (commentaire d'en-tête) |
| G1 : committer les fichiers non suivis | **Bloquant tant que non corrigé** | Committer TOUT l'état mesuré, pas seulement les `??` (section 4, G1) |
| D1 : `/fr/<légale>` en 307 | GO-avec-réserves | Amender la garde `:146-154`, ne pas la supprimer. Repasser par `site-architect` à la PR |
| « Ce qu'il ne faut PAS faire » | GO | |
| Question 2 : règle d'urgence `/jouer` sur `main` | GO-avec-réserves | 307 littéral, PR séparée, merge par Adrien seul |
| K1, K2, K3, K4 | GO | Rester sur l'apex (lecture d'`app-ads.txt` par AdMob) |
| K5 et K7 : URLs légales inchangées | GO | |
| K6 : site web de la Play Console | GO-avec-réserves | Valeur à trancher par Adrien. Apex obligatoire. Vérifier K10 à J+1 et J+7 |
| K8, K9, K11, K13, K14 : relevés en console | GO | K8 à confirmer avant le merge : seule URL contractuelle qu'aucun build ne vérifie |
| K12, K15, K16 | GO | |
| K17 : QR vers `/cerebrum/play` | GO | `/play` et `/jouer` restent des alias 307 à vie |

## 1. Résumé

**Ce qui change.** La racine `/` sert désormais l'anglais (avant : le français) et le français
passe sous `/fr` (rework:src/lib/i18n.ts:4, rework:src/proxy.ts:41-46). `/en` n'est plus une
page : il redirige en 308 vers `/`, query conservée (rework:next.config.ts, `legacyEnglishRedirects`). Les pages légales
gardent leur schéma historique : `/privacy`, `/terms`, `/legal` en français, `/en/privacy`,
`/en/terms`, `/en/legal` en anglais (rework:src/lib/frozen-legal-paths.ts:7). `/play` et `/jouer`
redirigent en 307 vers `/cerebrum/play` (rework:next.config.ts, règles `/play` et `/jouer`). Nouvelles pages :
`/cerebrum`, `/cerebrum/<jeu>`, `/about`, `/press` et leurs pendants `/fr/...`.

**Bonne nouvelle : aucune URL déclarée dans une fiche ou une console ne casse.** Les URLs légales,
`/account-deletion`, `/app-ads.txt`, `/.well-known/*` et le 308 `www` vers l'apex répondent à
l'identique (mesure : statuts, langue, titre et canonical identiques sur les 9 URLs légales ;
`id="account-deletion"` présent sur `/privacy` et `/en/privacy`).

**Les risques, par ordre d'importance.**

1. **Un francophone qui suit un ancien lien vers la racine arrive en anglais.** Trois sources :
   le lien « Contact » des apps installées en français
   (`https://synapgeek.com?utm_source=cerebrum&utm_medium=app&utm_campaign=profile#contact`,
   cerebrum-ios `LegalURLProvider.swift:36-51`, cerebrum-android `LegalUrlProvider.kt:32-47`),
   les champs URL marketing et URL d'assistance des fiches App Store fr-FR et fr-CA
   (`https://synapgeek.com` et `https://synapgeek.com/#contact`, fiche publique lue par curl le
   2026-10-03), et le champ « Site web » de la fiche Google Play (`https://synapgeek.com`). Aucun
   404 : `id="contact"` existe sur le hub anglais (rework:src/app/[locale]/page.tsx:75). Le proxy
   ne peut pas corriger cela par négociation de langue (rework:src/app/CLAUDE.md:10-12). Les
   fiches se corrigent en console ; les apps installées ne se corrigent que par une règle
   conditionnelle (R1, section 4).
2. **Versions d'app installées.** Le code qui construit les URLs est identique dans les 22 tags
   iOS (md5 `b3b81726`) et les 5 tags Android (md5 `8b538077`) : chaque joueur, quelle que soit
   sa version, produit les mêmes 6 formes d'URL. Elles restent servies toute la durée de vie des
   installations. Une seule change de langue (le Contact français, point 1).
3. **QR imprimés.** `/play` répond en production aujourd'hui ; `/jouer` répond 404 (curl). Si un
   QR `/jouer` est déjà imprimé, il est cassé jusqu'au merge. Après le merge, `/play` fait deux
   sauts 307 (vers `/cerebrum/play`, puis vers le store), avec `pt=128805365&ct=plv-comptoir`
   et `src` conservés (mesure locale).
4. **Ancres disparues.** `#features`, `#faq`, `#about` n'existent plus sur l'accueil. Un fragment
   n'est jamais envoyé au serveur : aucune redirection n'est possible. La page s'ouvre en haut,
   sans erreur. Aucune fiche ni aucune app ne vise ces ancres.
5. **`www` et apex.** `www` répond 308 vers l'apex (curl prod), par un réglage de domaine Vercel :
   aucune règle `www` dans le dépôt (vercel.json du worktree, 0 occurrence). Le merge ne peut pas
   le casser, un changement dans Vercel Domains si. L'app Android cite encore `www` dans des
   ressources mortes (`strings.xml:15-16`, 0 référence dans le code).
6. **`app-ads.txt`.** Inchangé (200 `text/plain`, `google.com, pub-2587609832551275, DIRECT,
   f08c47fec0942fa0`). AdMob le lit à la racine du domaine du site déclaré dans les fiches : tout
   champ « site » modifié en console doit rester sur l'apex `synapgeek.com`.
7. **Meta et OAuth.** Les liens de bio Facebook, Instagram et TikTok visent directement
   apps.apple.com (cerebrum-design-system `docs/ADS.md:127-152`) : aucun impact. Les URLs
   déclarées dans les apps Meta (connexion Facebook, « Cerebrum Publishing ») et dans l'écran de
   consentement Google OAuth sont des URLs légales ou la racine : elles restent valides, mais leurs
   valeurs exactes ne sont lisibles qu'en console.
8. **Pertes acceptables.** Les 10 captures `/images/hero/screen-*.webp` de l'ancienne landing
   répondent 404 (supprimées, `git diff --name-status main HEAD -- public`) ; rien de connu ne les
   cite. Le repli desktop de `/play` suit désormais `Accept-Language` (français si préféré,
   anglais sinon : rework:scripts/check-contract-urls.mjs (attentes de `/cerebrum/play`) ; mesure locale avec
   `Accept-Language: fr-FR` : `<html lang="fr">`), alors qu'il était toujours français avant.

**Prérequis bloquant, hors redirections.** La copie de travail du worktree n'est pas committée :
fichiers non suivis (`??`, dont `public/images/brand/og-image-v2.jpeg` et `public/images/apps/`),
environ 70 fichiers modifiés et deux suppressions (`git status --short`). Un déploiement depuis git
publierait un arbre jamais mesuré, et les nouvelles pages perdraient leur image Open Graph
(`og-image-v2.jpeg` répond 404 en production aujourd'hui). Voir G1, section 4.

## 2. Inventaire des liens publiés, par surface

Certitude : **vérifié** (lu dans le code ou par curl), **probable** (docs des dépôts), **à
vérifier dans la console** (aucune source lisible ici).

### 2.1 Apps installées (iOS toutes versions v1.0.0 à v3.1.0, Android v2.1.5 à v3.0.0-16)

| URL émise | Écran | Source | Certitude |
| --------- | ----- | ------ | --------- |
| `https://synapgeek.com/privacy?utm_source=cerebrum&utm_medium=app&utm_campaign={profile,sign_in,store_subscription}` (langue fr) | Profil, connexion, mentions d'abonnement | iOS `LegalURLProvider.swift:27,50-51`, appels `ProfileScreen.swift:622`, `SignInView.swift:148`, `SubscriptionTermsView.swift:53` ; Android `LegalUrlProvider.kt:24-25,41,47`, `LegalSection.kt:68`, `SignInSheet.kt:276`, `SubscriptionTermsView.kt:87` | vérifié |
| `https://synapgeek.com/en/privacy?utm_…` (15 autres langues) | idem | `LegalURLProvider.swift:51,55-58` ; `LegalUrlProvider.kt:41` ; `AppLanguage.swift:12-27` | vérifié |
| `https://synapgeek.com/terms?utm_…` (fr) | idem | `LegalURLProvider.swift:32` ; `LegalUrlProvider.kt:28-29` | vérifié |
| `https://synapgeek.com/en/terms?utm_…` (autres langues) | idem | idem | vérifié |
| `https://synapgeek.com?utm_source=cerebrum&utm_medium=app&utm_campaign=profile#contact` (fr) | Profil > Contact | `LegalURLProvider.swift:36-43,51`, `ProfileScreen.swift:596` ; `LegalUrlProvider.kt:32-33,41,44`, `SupportSection.kt:90`, test `LegalUrlProviderTest.kt:46` | vérifié |
| `https://synapgeek.com/en?utm_…&utm_campaign=profile#contact` (autres langues) | Profil > Contact | idem, test `LegalUrlProviderTest.kt:50` | vérifié |
| `https://www.synapgeek.com/privacy`, `/terms` | aucun : ressources mortes | Android `values/strings.xml:15-16`, `values-fr/strings.xml:3-4` (0 référence dans le code, 5 tags) | vérifié |
| `https://www.synapgeek.com/app/*`, `/.well-known/assetlinks.json` | App Links reçus (sujet abandonné) | `AndroidManifest.xml:66-77`, `DeepLinkParser.kt:32` | vérifié |

Hôte toujours l'apex en https, jamais `www` ni `http` (`LegalURLProvider.swift:50`,
`LegalUrlProvider.kt:47`). Aucune app ne vise `/play`, `/cerebrum`, `/about`, `/press` ni `/fr/…`.

### 2.2 App Store Connect (fiche Cerebrum, id 6763915130)

| Champ | Valeur actuelle | Source | Certitude |
| ----- | --------------- | ------ | --------- |
| URL marketing, fr-FR et fr-CA | `https://synapgeek.com` | curl `apps.apple.com/fr/app/id6763915130` (et `ca?l=fr`), `ExternalUrlAction` ; intention `cerebrum-design-system/marketing/ASO/3.x.x/asc-metadata.md:22` | vérifié |
| URL d'assistance, fr-FR et fr-CA | `https://synapgeek.com/#contact` | idem | vérifié |
| URL marketing, 19 autres locales | `https://synapgeek.com/en` | curl des fiches us, gb, de, es, jp, br, mx, kr, tr, vn, th, id, nl, ca/en ; `asc-metadata.md:23` | vérifié |
| URL d'assistance, 19 autres locales | `https://synapgeek.com/en#contact` | idem | vérifié |
| Politique de confidentialité | `https://synapgeek.com/privacy` (fr), `https://synapgeek.com/en/privacy` (autres) | fiches publiques, lien « Politique de confidentialité du développeur » | vérifié |
| Texte de description | `/privacy`, `/terms` (fr) ; `/en/privacy`, `/en/terms` (autres) | fiches publiques ; `asc-metadata.md:100,154-155` | vérifié |

### 2.3 Google Play Console (package `com.synapgeek.cerebrum`)

| Champ | Valeur actuelle | Source | Certitude |
| ----- | --------------- | ------ | --------- |
| Coordonnées : Site web | `https://synapgeek.com` | curl fiche publique `hl=en,fr,de` ; contredit `cerebrum-android/docs/store/STORE_LISTING.md:27` (`www`, doc périmé) | vérifié |
| Politique de confidentialité | `https://synapgeek.com/privacy` | fiche publique `hl=fr` ; `STORE_LISTING.md:28` | vérifié |
| Data Safety : URL de suppression de compte | `https://synapgeek.com/account-deletion` | `cerebrum-android/docs/store/data-safety.md:31`, `docs/MANUAL_TASKS.md:346` | à vérifier dans la console |
| Description longue | `/privacy`, `/terms` (fr) ; `/en/privacy`, `/en/terms` (en, de…) | fiches publiques ; `listing/fr-FR.md:105-106`, `listing/en-US.md:104-105` | vérifié |

### 2.4 AdMob

| Champ | Valeur actuelle | Source | Certitude |
| ----- | --------------- | ------ | --------- |
| Message de consentement UMP (EEE, UK, Suisse ; États américains) : URL de politique | `https://synapgeek.com/privacy` | mémoire `project_cerebrum_app.md:34` ; `cerebrum-android/docs/MANUAL_TASKS.md:336` | à vérifier dans la console |
| Vérification app-ads.txt | `https://synapgeek.com/app-ads.txt` | curl prod 200 ; rework:public/app-ads.txt:1 | vérifié |

### 2.5 Meta

| Surface | Valeur | Source | Certitude |
| ------- | ------ | ------ | --------- |
| App « Cerebrum Publishing » : Privacy policy URL | `https://synapgeek.com/privacy` | `cerebrum-design-system/social-network/posts/publishing/README.md:363` (relu le 27/08) | probable |
| App de connexion Facebook (projet Firebase `cerebrum-a657c`) : confidentialité, conditions, suppression des données, domaines, URL du site | non documentées ; piste `/privacy`, `/terms`, `/account-deletion`, domaine `synapgeek.com` | `cerebrum-android/docs/MANUAL_TASKS.md:210-212` (sans URLs) | à vérifier dans la console |
| Bio Facebook, Instagram, TikTok, bouton Facebook | `https://apps.apple.com/app/apple-store/id6763915130?pt=128805365&ct={fb,ig,tiktok}-bio&mt=8` | `cerebrum-design-system/docs/ADS.md:127-152` | vérifié (hors synapgeek.com) |

### 2.6 Google Cloud OAuth, Apple, Firebase

| Surface | Valeur | Source | Certitude |
| ------- | ------ | ------ | --------- |
| Écran de consentement OAuth (Google Sign-In) : accueil, politique, conditions, domaines autorisés | piste : `https://synapgeek.com`, `/privacy`, `/terms`, `synapgeek.com` | aucune source dans les dépôts | à vérifier dans la console |
| Sign in with Apple, Return URL | `https://cerebrum-a657c.firebaseapp.com/__/auth/handler` | `cerebrum-android/docs/MANUAL_TASKS.md:205` | vérifié (hors synapgeek.com) |
| Domaines autorisés Firebase Auth | non documentés | fichiers de config Firebase non suivis par git | à vérifier dans la console |

### 2.7 QR imprimés (chevalets de comptoir)

| URL | Statut | Source | Certitude |
| --- | ------ | ------ | --------- |
| `https://synapgeek.com/play` | premiers QR selon le CLAUDE.md racine | CLAUDE.md racine, règles critiques | probable |
| `https://synapgeek.com/jouer` | maquette provisoire `qr-test.svg`, « à remplacer avant tirage », peut-être imprimée | `cerebrum-design-system/social-network/images/bar-chevalet/README.md:43,68` | à vérifier (Adrien) |
| `https://synapgeek.com/cerebrum/play` | cible canonique des futurs QR, 404 en prod aujourd'hui | rework:docs/contrat/lancement.md:37 (C5) | vérifié |

### 2.8 Liens externes, moteurs, divers

- Profils sociaux (champ « site web »), signatures Gmail, publicités et endcards Meta : aucune
  occurrence dans les dépôts frères. À vérifier à l'œil.
- Moteurs : sitemap de production à 8 URLs (main:src/app/sitemap.ts:13,29-46), refonte à 34
  (rework:scripts/check-contract-urls.mjs).
- Cartes Open Graph déjà partagées : `/images/brand/og-image.jpeg`, conservée
  (rework:docs/contrat/architecture.md, section 1.7).

## 3. Ancienne URL vers comportement dans la refonte

Mesure : production par curl le 2026-10-03 ; refonte sur build de production local. `www` et
`http` ne sont pas testables en local.

| Ancienne URL | Prod aujourd'hui | Refonte (statut, cible, langue) | Verdict |
| ------------ | ---------------- | ------------------------------- | ------- |
| `/privacy` (avec ou sans `utm_*`) | 200 fr | 200 fr, canonical `/privacy`, `#account-deletion` présent | inchangé |
| `/en/privacy` (avec ou sans `utm_*`) | 200 en | 200 en, aucune règle ne la capte (rework:next.config.ts, `legacyEnglishRedirects` : aucune règle sur les pages légales) | inchangé |
| `/terms`, `/legal` | 200 fr | 200 fr | inchangé |
| `/en/terms`, `/en/legal` | 200 en | 200 en | inchangé |
| `/fr/privacy`, `/fr/terms`, `/fr/legal` | 200 fr, canonical sans préfixe | 200 fr identique ; 307 prévu plus tard (D1) | inchangé |
| `/account-deletion` | 307 `/privacy#account-deletion` | identique (rework:next.config.ts, règle `/account-deletion`) | inchangé |
| `/en/account-deletion`, `/fr/account-deletion` | 307 vers la politique de leur langue | identique (rework:next.config.ts, règles `/en/account-deletion` et `/fr/account-deletion`) | inchangé |
| `/?utm_source=cerebrum&utm_medium=app&utm_campaign=profile#contact` (app, fr) | 200 fr, `#contact` présent | 200 **en**, `#contact` présent | **change de langue** : corrigé par R1 (307 vers `/fr`) |
| `/en?utm_…&utm_campaign=profile#contact` (app, autres langues) | 200 en | 308 `/?utm_…` puis 200 en, `#contact` présent ; avec R1 : 307 `/?utm_…&hl=en` puis 200 en | redirigé correctement (fragment à tester sur appareil) |
| `/` (ASC fr marketing, Play site web) | 200 fr | 200 **en** | **change de langue** : console (K2, K6) |
| `/#contact` (ASC fr assistance) | 200 fr | 200 **en**, `#contact` présent | **change de langue** : console (K1) |
| `/en` (ASC 19 locales marketing) | 200 en | 308 `/`, 200 en (hub studio) | redirigé correctement |
| `/en#contact` (ASC 19 locales assistance) | 200 en | 308 `/`, 200 en, `#contact` présent | redirigé correctement (fragment à tester) |
| `/en/` | 308 `/en` | 308 `/en` puis 308 `/` | redirigé correctement (2 sauts) |
| `/fr` | 200 fr (doublon, canonical `/`) | 200 fr, hub, canonical `/fr`, `#contact` présent | inchangé (devient l'accueil français officiel) |
| `/fr/` | 308 `/fr` | 308 `/fr` | inchangé |
| `/#features`, `/#faq`, `/#about` | 200, ancres présentes | 200 en, ancres **absentes** (FAQ sur `/cerebrum#faq`, À propos sur `/about`) | perte acceptée (non redirigeable) |
| `/#cta` | ancre jamais existante | idem | inchangé |
| `/play` (iPhone, Android) | 307 direct vers le store | 307 `/cerebrum/play` puis 307 vers le même store, mêmes paramètres | redirigé correctement |
| `/play` (desktop) | 200 repli fr, noindex | 307 puis 200 repli, langue selon `Accept-Language` | redirigé correctement |
| `/jouer` | **404** | 307 `/cerebrum/play` puis store | corrigé par le merge |
| `/cerebrum/play` | 404 | 200 (desktop) ou 307 store | nouvelle route |
| `www.synapgeek.com/*` | 308 vers l'apex, chemin et query conservés | dépend de Vercel Domains, non modifié par le merge | inchangé (à re-tester) |
| `http://…` | 308 vers https | plateforme | inchangé |
| `/.well-known/apple-app-site-association`, `/.well-known/assetlinks.json` | 200 `application/json` | 200 `application/json`, sans redirection | inchangé |
| `/app-ads.txt` | 200 `text/plain` | 200, même contenu | inchangé |
| `/sitemap.xml`, `/robots.txt`, `/llms.txt` | 200 | 200, contenu nouveau | inchangé (à re-soumettre) |
| `/images/brand/og-image.jpeg` | 200 | 200 | inchangé |
| `/images/brand/og-image-v2.jpeg` | 404 | 200 en local, **non suivi par git** | à corriger avant merge (G1) |
| `/images/hero/screen-*.webp` (10 fichiers) | 200 | 404 | cassé, perte acceptée |
| `/app/*`, `/blog`, `/apps/cerebrum`, `/wp-login.php` | 404 | 404 | inchangé |

## 4. Code : règles à ajouter ou modifier

Rappels de contrat : redirections **littérales** dans `next.config.ts`, jamais `/en/:path*` qui
capterait `/en/privacy` et les images Open Graph (rework:src/app/CLAUDE.md:13-15) ; le proxy
réécrit, il ne redirige jamais (rework:src/app/CLAUDE.md:10-12). Code HTTP : **307**
(`permanent: false`) pour toute URL liée à un contrat externe qui doit rester réversible ;
**308** seulement pour un déplacement définitif sans enjeu de conformité (cas de `/en` et des
`/en/<page non légale>`, déjà en place).

**Portes de vérification de chaque chantier.** Chaque chantier passe par `site-architect`, puis
l'implémentation, puis `site-reviewer`. Les portes sont `npm run lint` et `npm run build` (seules
portes automatiques du CLAUDE.md racine, section Commandes), plus `npx vitest run` et
`npm run check:contract` contre `next start`. **R1 n'est acceptable que si ces quatre commandes
sont vertes sur le commit propre de G1.**

### R1. Lien « Contact » des apps installées (recommandé, à décider par Adrien)

**Problème.** Le joueur français tape Profil > Contact et arrive sur le hub anglais. C'est la seule
URL embarquée dans les binaires qui change de langue, et aucune mise à jour ne corrigera les
installations existantes.

**Pourquoi c'est faisable sans négociation de langue.** L'URL dit déjà la langue : l'app émet la
racine **seulement** en français, `/en` pour toutes les autres langues (`LegalURLProvider.swift:48-51`,
`LegalUrlProvider.kt:41-42`). Les seuls appels passent toujours une campagne
(`ProfileScreen.swift:596`, `SupportSection.kt:90`) : la query `utm_*` est donc toujours présente.
Les redirections de `next.config.ts` passent avant le proxy : rien n'est réécrit, rien ne sort du
SSG. Seule difficulté : après le 308 actuel, `/en?utm_…` devient `/?utm_…`, identique au lien
français. Il faut donc un marqueur posé par la règle `/en`.

**Règles proposées**, placées dans `redirects()` **avant** `...legacyEnglishRedirects` (la première
règle qui correspond l'emporte) :

```ts
// Lien « Contact » des apps installées (iOS LegalURLProvider.swift, Android
// LegalUrlProvider.kt, identique dans toutes les versions publiées). L'app émet la racine
// en français et `/en` dans toutes les autres langues : la langue est dans l'URL, ce n'est
// pas une négociation. `hl=en` marque les joueurs non français pour que la règle de la
// racine ne les capte pas. Temporaire (307) : contrat d'app, doit rester réversible.
const APP_CONTACT_QUERY = [
  { type: "query", key: "utm_source", value: "cerebrum" },
  { type: "query", key: "utm_medium", value: "app" },
] as const;

{
  source: "/",
  has: [...APP_CONTACT_QUERY],
  missing: [{ type: "query", key: "hl" }],
  destination: "/fr",
  permanent: false,
},
{
  source: "/en",
  has: [...APP_CONTACT_QUERY],
  destination: "/?hl=en",
  permanent: false,
},
```

**Preuve de faisabilité (partielle).** Config jetable passée à `unstable_getResponseFromNextConfig`
de Next 16.3.8 (script `scratchpad/redirects/r2-probe.mjs`, lancé depuis le worktree). Attention :
ce probe tourne sur une **config réduite**, pas sur le vrai `next.config.ts`, et ne teste pas
l'ancrage de la valeur `has` (voir plus bas).

| Requête | Résultat |
| ------- | -------- |
| `/?utm_source=cerebrum&utm_medium=app&utm_campaign=profile` | 307 `https://synapgeek.com/fr?utm_source=cerebrum&utm_medium=app&utm_campaign=profile` |
| `/en?utm_source=cerebrum&utm_medium=app&utm_campaign=profile` | 307 `https://synapgeek.com/?utm_source=cerebrum&utm_medium=app&utm_campaign=profile&hl=en` |
| `/?hl=en&utm_source=cerebrum&utm_medium=app&utm_campaign=profile` | 200 |
| `/?utm_source=x&utm_medium=app&utm_campaign=profile` | 200 |
| `/` | 200 |
| `/en` | 308 `https://synapgeek.com/` |
| `/en?src=contract-check` | 308 `https://synapgeek.com/?src=contract-check` |
| `/privacy?utm_source=cerebrum&utm_medium=app&utm_campaign=profile` | 200 |
| `/fr?utm_source=cerebrum&utm_medium=app&utm_campaign=profile` | 200 |

**Preuve finale exigée.** Elle doit passer par le **vrai** `next.config.ts` (via
`legacy-redirects.test.ts`) et inclure le cas d'ancrage
`/?utm_source=cerebrum&utm_medium=apps&utm_campaign=profile` : **200**. Pour Next, `has.value` est
une expression régulière : sans ancrage, `apps` correspondrait à `app`. Si le cas échoue, ancrer la
valeur (`^app$`, `^cerebrum$`).

Le fragment `#contact` n'est pas dans l'URL envoyée au serveur ; une `Location` sans fragment le
fait hériter par le navigateur (RFC 9110 §10.2.2). `id="contact"` existe sur `/fr` et sur `/`
(mesure). Les `utm_*` sont conservés : GA4 garde l'attribution.

**Ce que R1 protège.** Le Contact des joueurs français, sur toutes les versions installées ; le
Contact des autres langues reste en anglais, en un seul saut. Ne touche ni `/`, ni `/#contact` des
fiches (sans `utm_*`), ni les pages légales (règle sur `/` exact, mesuré 200 sur `/privacy?utm_…`).

**Contraintes.**

- **Même déploiement que le 308 `/en`, ou jamais.** Le 308 est mis en cache par les navigateurs
  pour l'URL exacte. Si R1 arrivait après, un joueur non français ayant déjà ouvert le Contact
  aurait `/en?utm_…` vers `/?utm_…` en cache, sans `hl`, et serait envoyé vers `/fr`.
- **Couplage avec les apps, gardé par un test dans LEUR dépôt.** Après la bascule, l'URL anglaise
  « naturelle » d'une future version serait `/?utm_source=cerebrum&utm_medium=app`, et R1
  l'enverrait vers `/fr`. Un simple message ne suffit pas : on demande aux sessions iOS et Android
  un test de garde (Android : `LegalUrlProviderTest.kt:46-51` existe déjà ; iOS : équivalent) qui
  garantit que la racine avec `utm_medium=app` n'est émise que pour le français, et que toute
  autre langue émet `/en?…` (ou un chemin explicite). Le site n'écrit rien dans ces dépôts. Avec
  R1, **aucun changement d'app n'est nécessaire** : les URLs actuelles deviennent justes.
- **Amender le contrat écrit.** `rework:docs/contrat/architecture.md:97-98` dit « Une destination
  ne porte jamais de query ». Il faut la transformer en exception documentée pour `/?hl=en`, avec
  sa raison : la règle ne capte que les URLs d'app, qui n'émettent jamais `hl`. Ajouter aussi les
  deux lignes R1 au tableau des redirections (`architecture.md:79-85`), et mentionner les deux
  règles conditionnelles dans `src/app/CLAUDE.md` règle 3.

**Sans R1**, la seule correction est côté apps (nouvelle version), et seulement pour les joueurs
qui mettent à jour : Contact français vers `https://synapgeek.com/fr?utm_…#contact`.

### T1. Attentes à ajouter ou réécrire (`check:contract` et tests de redirection)

Dans `rework:scripts/check-contract-urls.mjs` (liste `checks`, près des lignes 184-196 et 345-363) :

- `/?utm_source=cerebrum&utm_medium=app&utm_campaign=profile` : avec R1, 307 vers
  `/fr?utm_source=cerebrum&utm_medium=app&utm_campaign=profile` ; sans R1, 200, `htmlLang("en")`,
  `id="contact"`.
- `/en?utm_source=cerebrum&utm_medium=app&utm_campaign=profile` : avec R1, 307 vers
  `/?utm_source=cerebrum&utm_medium=app&utm_campaign=profile&hl=en` ; sans R1, 308 vers
  `/?utm_…`.
- `/?utm_source=cerebrum&utm_medium=app&utm_campaign=profile&hl=en` : 200, `htmlLang("en")`,
  `id="contact"` (avec R1).
- `/?utm_source=cerebrum&utm_medium=apps&utm_campaign=profile` : 200 (prouve l'ancrage de `has`).
- `/privacy?utm_source=cerebrum&utm_medium=app&utm_campaign=sign_in` et
  `/en/terms?utm_source=cerebrum&utm_medium=app&utm_campaign=store_subscription` : 200, sans
  `Location`, langue de l'URL (les liens d'app ne déclenchent aucune règle).
- `/images/brand/og-image.jpeg` et `/images/brand/og-image-v2.jpeg` : 200 `image/jpeg`.
- **Garder tel quel** le test `redirect(`/en?${CAMPAIGN_PARAM}`, 308, …)` (ligne 192) :
  `CAMPAIGN_PARAM` vaut `src=contract-check` (ligne 85), c'est la non-régression du 308.
- **Corriger le commentaire d'en-tête (lignes 7-14, en particulier 9-11)** : il affirme que
  `/en#contact` redirige en 308, ce qui ne sera plus vrai pour la forme utm de l'app.
- Ajouter dans `wwwChecks()` (ligne 472) la forme `/?utm_source=cerebrum&utm_medium=app&utm_campaign=profile`
  (308 vers l'apex, query conservée ; l'attente `location(${APEX}${path})` s'applique à un chemin
  avec query).

Dans `rework:src/app/legacy-redirects.test.ts`, **les gardes existantes échoueraient et doivent
être réécrites, pas seulement complétées** :

- Garde d'ordre (lignes 117-131) : `expect(redirects[5]).toEqual({source:"/en",destination:"/",permanent:true})`
  casse, car R1 occupe les indices 5 et 6 et le 308 `/en` passe à l'indice 7. Réécrire.
- Garde de permanence (lignes 133-144) : la boucle `redirects.slice(5)` exige `permanent: true`
  sur chaque règle, et R1 est en `permanent: false`. Exclure les deux règles R1 ou les identifier
  par leur `has`.
- Ajouter les cas R1 (racine et `/en` avec utm d'app, `/?hl=en` non redirigée), le cas d'ancrage
  `utm_medium=apps` en 200, et conserver la non-régression `/en?utm_source=x` en 308 (déjà aux
  lignes 39-44).

### D1. `/fr/privacy`, `/fr/terms`, `/fr/legal` en 307 (plus tard, déjà prévu)

Trois règles littérales `permanent: false` vers l'URL sans préfixe, après B1 vert et une période
d'observation (rework:docs/contrat/lancement.md:45). Aucune console ne cite ces URLs (inventaire
de la section 2). Ce sont des pendants critiques au sens du CLAUDE.md racine (Règles critiques,
« + pendants /en/, /fr/ ») : le 307 les maintient en vie, jamais 308.

Mettre à jour `check:contract` (lignes 352-356 attendent 200) et `legacy-redirects.test.ts`
(lignes 79-90). **Amender** la garde des lignes 146-154, qui interdit toute source
`^/(en|fr)/(privacy|terms|legal)$` : elle ne doit laisser passer que les trois sources
`/fr/<légale>`, `/en/<légale>` restant interdites. Ne jamais la supprimer. Le passage par
`site-architect` est à refaire au moment de la PR.

### G1. Prérequis git (avant merge, bloquant)

Committer l'**intégralité** de la copie de travail mesurée :

- les fichiers ` M` (environ 70, dont `src/app/[locale]/page.tsx` qui porte l'ancre
  `id="contact"`, `src/lib/seo.ts` et `src/app/CLAUDE.md`) ;
- les suppressions (`D  src/components/ui/CheckList.tsx`, ` D public/images/backgrounds/breeze-day-v1.webp`) ;
- les fichiers `??` (dont `public/images/brand/og-image-v2.jpeg`, `public/images/apps/`,
  `public/images/characters/panda-celebration-v1.webp` et les composants non suivis).

Puis constater que `git status --short` est vide, et relancer `npm run lint`, `npm run build`,
`npx vitest run` et `npm run check:contract` sur ce commit. Sans cela, le plan publie un arbre qui
n'a jamais été mesuré.

### Ce qu'il ne faut PAS faire

- **Pas de redirection sur `Accept-Language`** à la racine : contraire au contrat (le proxy ne
  redirige jamais ; `LanguageSuggestion` est une feuille cliente sans redirection,
  rework:docs/contrat/architecture.md:187-191).
- **Pas de `/en/:path*`** ni de regex dans une source (rework:next.config.ts, commentaire de tête de `legacyEnglishRedirects`).
- **Pas de règle pour `#features`, `#faq`, `#about`** : impossible côté serveur. Une ancre d'alias
  ou un script client serait du code d'UI pour aucun lien publié connu : non recommandé.
- **Pas de redirection pour `/images/hero/screen-*.webp`** : aucune surface connue ne les cite.
- **Pas de règle `www`** dans le dépôt : c'est un réglage Vercel Domains.
- **Ne jamais passer `/play`, `/jouer`, `/account-deletion` en 308** : un 308 en cache survivrait
  à tout changement de destination (rework:next.config.ts, règles `/account-deletion`, `/play` et `/jouer`).
- Ne jamais rediriger `/privacy`, `/terms`, `/legal`, `/en/<légale>`, `/.well-known/*`,
  `/app-ads.txt`, ni retirer `id="contact"` ou `id="account-deletion"`.

## 5. Changements dans les consoles

« Avant » : possible dès aujourd'hui sans rien casser. « Après » : seulement une fois la refonte
en ligne et B1 vert, car la cible n'existe pas encore en production (`/fr/cerebrum`, `/cerebrum`
répondent 404 aujourd'hui, mesure). **Règle commune à tout champ « site » : l'hôte reste l'apex
`synapgeek.com`, jamais `www`, car AdMob lit `app-ads.txt` sur ce domaine.**

| # | Console | Champ | Valeur actuelle | Valeur cible | Qui | Quand |
| - | ------- | ----- | --------------- | ------------ | --- | ----- |
| K1 | App Store Connect | URL d'assistance, fr-FR et fr-CA | `https://synapgeek.com/#contact` | `https://synapgeek.com/fr#contact` | session App iOS, validation Adrien | **Avant** possible : `/fr` a `id="contact"` en prod aujourd'hui et après le merge. À joindre à la prochaine soumission si le champ est lié à la version |
| K2 | App Store Connect | URL marketing, fr-FR et fr-CA | `https://synapgeek.com` | `https://synapgeek.com/fr/cerebrum` (apex obligatoire) | session App iOS, validation Adrien | **Après** (404 aujourd'hui). Si la version part en revue avant le merge : `https://synapgeek.com/fr` (200 fr avant et après) |
| K3 | App Store Connect | URL marketing, 19 autres locales | `https://synapgeek.com/en` | `https://synapgeek.com/cerebrum` (apex obligatoire) | session App iOS | **Après**, non urgent (le 308 tient) |
| K4 | App Store Connect | URL d'assistance, 19 autres locales | `https://synapgeek.com/en#contact` | `https://synapgeek.com/#contact` | session App iOS | **Après uniquement** : avant le merge, `/#contact` est français. Non urgent |
| K5 | App Store Connect | Politique de confidentialité, descriptions | `/privacy`, `/en/privacy`, `/terms`, `/en/terms` | inchangé | personne | ne rien toucher |
| K6 | Play Console | Fiche > Coordonnées > Site web | `https://synapgeek.com` | `https://synapgeek.com/cerebrum` (décidé par Adrien le 2026-10-03) | session Android, validation Adrien | **Après**. Garder l'apex |
| K7 | Play Console | Politique de confidentialité, descriptions | `/privacy`, `/terms`, `/en/privacy`, `/en/terms` | inchangé | personne | ne rien toucher |
| K8 | Play Console | Data Safety > URL de suppression de compte | `https://synapgeek.com/account-deletion` (docs) | inchangé ; relever la valeur réelle (seule URL contractuelle qu'aucun build ne vérifie) | Adrien (lecture) | Avant, à confirmer avant le merge |
| K9 | AdMob | Confidentialité et messagerie : URL de politique des messages EEE et États américains | `/privacy` (docs) | inchangé ; relever les deux messages | Adrien (lecture) | Avant |
| K10 | AdMob | Applications > app-ads.txt | « trouvé » attendu | vérifier le statut après K2, K3, K6 (nouveau crawl) | Adrien | J+1 puis J+7 |
| K11 | Meta for Developers | App de connexion Facebook : Privacy URL, Terms URL, Data deletion instructions URL, App domains, Site URL | non documenté | inchangé si légal ou racine ; relever | Adrien (lecture) | Avant |
| K12 | Meta for Developers | App « Cerebrum Publishing » : Privacy policy URL | `/privacy` | inchangé | personne | relecture J+1 |
| K13 | Google Cloud | Écran de consentement OAuth : accueil, politique, conditions, domaines autorisés | non documenté | inchangé ; l'accueil doit garder le lien vers `/privacy` (rework:src/components/site/SiteFooter.tsx:129) | Adrien (lecture) | Avant |
| K14 | Firebase Auth, Apple Developer | Domaines autorisés, Services ID | non documenté | inchangé attendu | Adrien (lecture) | Avant |
| K15 | Profils sociaux (Facebook Page, Instagram, TikTok, LinkedIn) | Site web | non documenté | profils français : `https://synapgeek.com/fr` ; autres : `https://synapgeek.com` | Adrien | Après |
| K16 | Signatures Gmail | Lien du site | non documenté | `https://synapgeek.com` (ou `/fr` pour une signature française) | Adrien | Après |
| K17 | QR des chevalets | URL encodée | `/play` (confirmé par Adrien le 2026-10-03) | `https://synapgeek.com/cerebrum/play` pour tout nouveau tirage | session Design System | **Après B1 vert**, jamais avant. `/play` et `/jouer` restent des alias 307 à vie (rework:next.config.ts:93-103, route-invariants.test.ts:232-243) |

Hypothèse à confirmer par la session App iOS : les URLs marketing et d'assistance d'App Store
Connect sont liées à une version et ne changent qu'avec une soumission. Si c'est le cas, K1 et K2
partent avec la prochaine version et le choix de K2 dépend de la date de mise en ligne.

### Messages aux autres sessions

Retrouver les noms exacts avec `ListAgents`, puis `SendMessage`. Aucune écriture dans leurs dépôts
(rework:docs/contrat/lancement.md:5-8).

- **Session App iOS.** « Bascule de synapgeek.com : la racine sert l'anglais, le français est sous
  `/fr`. Merci de préparer pour la prochaine soumission les URLs fr-FR et fr-CA (K1 :
  `https://synapgeek.com/fr#contact` ; K2 : `https://synapgeek.com/fr/cerebrum` si la version sort
  après le merge, sinon `https://synapgeek.com/fr`), puis après le merge les 19 autres locales (K3,
  K4). Peux-tu confirmer si ces champs sont liés à la version, et le statut de la 3.1.0 ? Le site
  prend en charge les URLs actuelles (R1) : ne change pas le schéma d'URL de `LegalURLProvider`
  sans repasser par `site-architect`. Contrainte durable : ne jamais émettre la racine avec
  `utm_medium=app` pour une langue autre que fr. Merci d'ajouter dans ton dépôt un test de garde
  équivalent à `LegalUrlProviderTest.kt:46-51` côté Android : racine avec `utm_medium=app`
  uniquement pour le français, `/en?…` pour toute autre langue. »
- **Session Android.** « Même bascule. Après le merge : champ Site web de la fiche (K6, valeur
  validée par Adrien). Merci de relever la valeur réelle du Data Safety (K8). Docs périmés chez
  toi : `docs/store/STORE_LISTING.md:27` (`www`, la fiche affiche l'apex), `docs/store/PRIVACY_POLICY.md`
  (`www`). Au prochain build, tu peux retirer les ressources mortes `privacy_policy_url` et
  `terms_of_service_url` de `strings.xml`. Ne change pas le schéma d'URL de `LegalUrlProvider`
  sans repasser par `site-architect` ; même contrainte `utm_medium=app` que sur iOS, et garde le
  test `LegalUrlProviderTest.kt:46-51` qui la protège. »
- **Session Design System.** « Ne réimprime aucun QR vers `/cerebrum/play` avant le feu vert
  (B1). Merci de confirmer quel QR est imprimé (`/play` ou `/jouer`) et le nombre de chevalets ;
  `bar-chevalet/README.md:43,68` contredit le CLAUDE.md du site. `marketing/ASO/3.x.x/asc-metadata.md:21`
  dit que la racine sert le français : faux après le merge. »

## 6. Ordre des opérations et contrôles

### J-1 (avant le merge)

1. Adrien tranche R1. Si oui : implémentation dans la branche de la refonte (même déploiement que
   le 308 `/en`), tests T1, `site-architect` puis `site-reviewer`.
2. G1 : committer **tout** l'état mesuré, constater `git status --short` vide.
3. Sur ce commit propre : `npm run lint`, `npm run build`, `npx vitest run` (legacy-redirects,
   route-invariants), `npm run check:contract` contre `next start` local (A2).
4. Noter l'identifiant du déploiement de production actuel pour le retour arrière (A3).
5. Adrien relève en console K8, K9, K11, K13, K14 et confirme le QR imprimé (K17).
6. Search Console : exporter les pages et requêtes des 3 derniers mois (point de comparaison).
7. K1 peut partir dès maintenant s'il y a une soumission iOS en cours.

### J0 (merge par Adrien, déploiement)

1. `npm run check:contract` sur la production, **apex et `www`** (B1, sans argument). Premier écart
   sur le légal, `/account-deletion`, `#contact` ou `/play` : Instant Rollback Vercel.
2. Contrôles curl (avec `--max-redirs 0`, saut par saut) :
   - `/privacy?utm_source=cerebrum&utm_medium=app&utm_campaign=sign_in` : 200, `lang="fr"` ;
     `/en/privacy?utm_…` : 200, `lang="en"`.
   - `/?utm_source=cerebrum&utm_medium=app&utm_campaign=profile` : 307 `/fr?utm_…` (R1) ;
     `/en?utm_…` : 307 `/?utm_…&hl=en` (R1) ou 308.
   - `/account-deletion` : 307 `/privacy#account-deletion` ; `www.synapgeek.com/account-deletion` :
     308 puis 307.
   - `/play` et `/jouer` avec UA iPhone et Android : 307 `/cerebrum/play`, puis 307 store avec
     `pt=128805365&ct=plv-comptoir`.
   - `/app-ads.txt` : 200 `text/plain`, ligne `pub-2587609832551275` ; `/.well-known/*` : 200
     `application/json`, sans redirection.
   - `/images/brand/og-image-v2.jpeg` : 200.
3. Tests sur appareil : ouvrir Profil > Contact depuis l'app en français et dans une autre langue
   (iPhone : Safari ; Android : Chrome Custom Tabs) et vérifier l'arrivée sur la section contact,
   dans la bonne langue. Ouvrir `https://synapgeek.com/en#contact` depuis la fiche App Store
   anglaise. Scanner le QR imprimé sur iPhone et Android.
4. Envoyer un vrai message par le formulaire (B2).
5. `npm run indexnow` (B3), `-- --dry-run` d'abord en cas de doute.
6. Search Console : soumettre `https://synapgeek.com/sitemap.xml` ; inspecter et demander
   l'indexation de `/`, `/fr`, `/cerebrum`, `/fr/cerebrum`, `/about` ; inspecter `/en` (doit dire
   « Page avec redirection »).

### J+1

1. Consoles : K2 (si non parti avec une version), K3, K4, K6, K15, K16.
2. Bing Webmaster Tools : sitemap (C1).
3. AdMob : statut app-ads.txt (K10).
4. Régénération du QR vers `/cerebrum/play` (K17, C5), scan d'essai iPhone et Android.
5. Relecture des fiches publiques par curl (`ExternalUrlAction`) pour confirmer les nouvelles
   valeurs.

### J+7

1. Search Console : rapport d'indexation (404 nouveaux, `/images/hero/*` attendus, rien d'autre) ;
   hreflang sans erreur ; `/` indexée en anglais, `/fr` en français.
2. GA4 : sessions `utm_source=cerebrum` par page d'arrivée (`/fr` pour le français si R1).
3. AdMob : app-ads.txt toujours « trouvé ».

### J+30

1. Décision D1 (`/fr/<légale>` en 307) selon B1 et l'observation ; PR séparée.
2. Bilan Search Console comparé à l'export de J-1.
3. Mise à jour des docs périmés par les sessions concernées.
4. Ne jamais retirer `/en`, `/play`, `/jouer`, R1 ni les règles `/en/<page>` : des liens en cache
   et des binaires installés en dépendent.

## 7. Questions ouvertes pour Adrien

1. **R1** : tranché le 2026-10-03, OUI. On corrige le Contact des joueurs français des apps installées par deux règles
   conditionnelles en 307. Condition : même déploiement que le 308 `/en`, sinon
   jamais.
2. **QR** : quel QR est imprimé (`/play` ou `/jouer`), combien de chevalets ? Si c'est `/jouer`,
   il répond 404 jusqu'au merge : faut-il une règle d'urgence sur `main` ou avancer le merge ?
   Si règle d'urgence : `/jouer` vers `/play` en 307 littéral (`permanent: false`), sur une branche
   et une PR séparées de `main` (`site-architect`, puis `site-reviewer`, puis merge par Adrien
   seul). Au merge de la refonte, résoudre le conflit de `next.config.ts` en faveur de `/jouer`
   vers `/cerebrum/play` (rework:next.config.ts, règles `/play` et `/jouer`). Le 307 évite tout blocage par cache
   client.
3. **Fiche Play, Site web (C4)** : tranché le 2026-10-03, `https://synapgeek.com/cerebrum`.
4. **App Store Connect** : date de la prochaine soumission iOS, qui détermine K1 et K2.
5. **Ancres** `#features`, `#faq`, `#about` et captures `/images/hero/*` : perte acceptée ?
   Recommandé : oui.
6. **Repli desktop de `/play`** : il suit désormais la langue du navigateur au lieu d'être toujours
   en français. D'accord ?
7. **Valeurs de console** à relever : Data Safety, messages UMP, apps Meta, écran OAuth, domaines
   Firebase et Apple.
8. **D1** : quelle période d'observation avant de rediriger `/fr/privacy`, `/fr/terms`,
   `/fr/legal` ?
9. **Versions d'app** : statut de publication de la v3.1.0 iOS et de la v3.0.0-16 Android (sans
   effet sur les URLs, constructeur identique dans tous les tags).
