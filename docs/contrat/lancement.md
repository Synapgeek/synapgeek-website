# Lancement : liste de contrôle après le merge

> Rédigée à la fin de la refonte (spec §11). Un merge sur `main` publie en production : **seul
> Adrien merge**, aucune session ne merge ni ne promeut sans son accord explicite. Cette liste dit
> quoi faire APRÈS, qui s'en charge, et comment on sait que c'est fait. Les responsables : Adrien ;
> la session **App iOS** ; la session **Android** ; la session **Design System** ; la session du
> site (celle qui a ce dépôt). Une session ne modifie jamais le dépôt d'une autre : elle lui
> adresse un message (`ListAgents` pour retrouver son nom exact, puis `SendMessage`).

## Avant le merge

| # | Action | Responsable | Preuve |
| - | ------ | ----------- | ------ |
| A1 | Lancer les trois prompts « marque » du panel ChatGPT AVANT la mise en ligne : c'est la référence de comparaison (panel de `cerebrum-design-system/marketing/ASO/3.x.x/geo-assistants-ia.md`) | Adrien | résultats notés avec la date |
| A2 | `npm run check:contract` contre `next start` en local, vert (aucune preview de branche : seule `main` déploie ; la preuve sur Vercel est un déploiement CLI protégé, ni `--prod` ni alias, approuvé par Adrien et lancé par la session du site, jamais par un sous-agent, avec `VERCEL_OIDC_TOKEN`) | session du site | sortie sans écart |
| A3 | Relever l'identifiant du déploiement de production actuel (retour arrière armé) | Adrien | identifiant noté |
| A4 | Faire le point sur les PR des lots préparatoires (sécurité, route des QR, outillage Claude, faits 3.0.0), contenues dans la branche d'intégration `release/next` | Adrien | ordre de merge décidé |

## Juste après le merge (le jour même)

| # | Action | Responsable | Preuve |
| - | ------ | ----------- | ------ |
| B1 | `npm run check:contract` sur la production, **apex ET `www`** (sans argument il contrôle les deux). Au premier écart sur le légal, `/account-deletion`, `#contact` ou `/play` : Instant Rollback de Vercel vers le déploiement noté en A3, puis diagnostic | session du site, Adrien pour le rollback | tableau sans écart (34 `<loc>` du sitemap en 200) |
| B2 | Envoyer un vrai message par le formulaire de contact (aucun agent n'envoie d'e-mail) et vérifier sa réception sur `contact@synapgeek.com` | Adrien | e-mail reçu |
| B3 | `npm run indexnow` (une fois, à la main, après avoir constaté que le déploiement est en ligne) ; `-- --dry-run` d'abord si doute | session du site | réponse 200 ou 202 |
| B4 | Vérifier dans Vercel que le pare-feu « AI Bots » n'est PAS en mode Deny, et que `NEXT_PUBLIC_GA_MEASUREMENT_ID` est bien défini en production | Adrien | capture ou note |
| B5 | Supprimer `WAITLIST_WEBHOOK_URL` des variables Vercel si elle y subsiste (plus aucune référence dans le code) | Adrien | variable absente |

## Dans la semaine

| # | Action | Responsable | Preuve |
| - | ------ | ----------- | ------ |
| C1 | **Bing Webmaster Tools** : ajouter le site, soumettre `https://synapgeek.com/sitemap.xml`, activer le rapport « AI Performance » | Adrien | site vérifié, sitemap accepté |
| C2 | **GA4** : créer le canal « AI Assistant » et regrouper Claude et Perplexity dans les canaux par défaut | Adrien | canal visible dans les rapports |
| C3 | **App Store Connect, fiche fr-FR** : URL marketing vers `https://synapgeek.com/fr/cerebrum`, URL de support vers `https://synapgeek.com/fr#contact`. Jusque-là, l'ancienne URL de support `/#contact` atterrit sur le hub ANGLAIS (l'anglais est désormais la racine) ; les autres langues (`/en`, `/en#contact`) suivent la redirection 308 vers `/` | session App iOS (métadonnées ASC), validation d'Adrien | fiche à jour, liens ouverts à la main |
| C4 | **Play Console, champ site web de la fiche** : le mettre à jour (valeur à confirmer par Adrien : la page de l'app `https://synapgeek.com/cerebrum` ou l'accueil). `www.synapgeek.com` continue de répondre en 308 vers l'apex : ne jamais le casser | session Android, validation d'Adrien | fiche à jour |
| C5 | **QR des chevalets** : régénérer vers `https://synapgeek.com/cerebrum/play`. Les QR déjà imprimés (`/play`, `/jouer`) continuent de fonctionner par redirection 307 et ne doivent jamais cesser de répondre | session Design System | scan d'essai iPhone et Android |
| C6 | **Panel ChatGPT** : relevé complet (11 prompts + 3 prompts « marque ») sur la fenêtre **du 12 au 19 octobre 2026**, au moins une semaine après la mise en ligne (sinon décaler la fenêtre). Référence : 3 prompts cités sur 11 le 2026-09-25 | Adrien | relevé daté, comparé à A1 et au point zéro |
| C7 | Suivre `app_store_click` (GA4) et l'App Referrer « ChatGPT » dans App Store Connect : ce sont les mesures de succès de la refonte | Adrien | tendance notée |

## Suite en code (PR séparées, à ouvrir seulement après preuve)

| # | Action | Responsable | Condition |
| - | ------ | ----------- | --------- |
| D1 | **`/fr/privacy`, `/fr/terms`, `/fr/legal` en 307** (`permanent: false`) vers l'URL sans préfixe, règles littérales dans `next.config.ts` ; mettre à jour `check:contract` et les gardes de redirections (elles attendent 200 aujourd'hui). Jamais 308. Passer par `site-architect` puis `site-reviewer` | session du site | B1 vert sur la production et une période d'observation décidée par Adrien |
| D2 | À la sortie de la **3.1.0** (date décidée par Adrien) : relire Trace Difficile et Élite, les phrases d'indice des dix jeux, la phrase de l'indice de Cross Math et les pages Démineur et Pixel Art (`docs/contrat/contenu.md`, section 7) ; mettre à jour `updatedAt`, `llms.txt`, puis `npm run indexnow` | session du site, relecture factuelle par la session App iOS | 3.1.0 publiée |
| D3 | Faire relire par la session App iOS la version définitive des textes (elle l'a proposé) | session du site | à la demande d'Adrien |

## À examiner côté confidentialité (hors de ce dépôt)

Ces points ne se corrigent pas ici : ils demandent une décision d'Adrien ou une action dans une
console. Le détail est dans « Points à trancher » du `CLAUDE.md` racine.

| # | Point | Responsable |
| - | ----- | ----------- |
| E1 | Questionnaire App Privacy d'App Store Connect et formulaire Data Safety : déclarent-ils la localisation approximative déduite de l'IP à finalité publicitaire (AdMob, UMP) ? | session App iOS (ASC), session Android (Play), Adrien |
| E2 | Android : le stockage Firebase Analytics est accordé quel que soit le choix de consentement (docs du dépôt Android, `docs/store/data-safety.md`, relevé dans `faits-cerebrum-3.0.0-android.md`) : à confronter à la politique de confidentialité et au RGPD | session Android, Adrien |
| E3 | La politique de confidentialité liste la finalité « gérer les classements » alors que les classements sont masqués dans la 3.0.0 ; elle parle d'un consentement affiché « au premier lancement » | Adrien (décision), session du site (texte) |
| E4 | Data Safety de la Play Console : deux lignes (historique d'achats, interactions avec l'app) restent à passer en « partagé » | session Android |
| E5 | Classification d'âge (CGU 13+, App Store 4+, Play « Everyone » avec « Contains ads ») : risque Families policy de Google | Adrien |
