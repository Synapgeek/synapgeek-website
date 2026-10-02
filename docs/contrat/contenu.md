# Contenu : règles de copie, registre, gardes et sources de faits

> Vérifié contre le code au HEAD de la branche de refonte. Le code fait foi : les gardes de
> `src/content/content-guards.test.ts` sont la version exécutable de ces règles. Un texte qui
> les contredit échoue à `npm test`, pas en revue. Faits produit : `PRODUCT.md` (racine).

## 1. Les règles de copie (1 à 14)

Elles viennent du brief produit, de la spec de refonte (§9) et des règles GEO de l'ASO Cerebrum
(`cerebrum-design-system/marketing/ASO/3.x.x/geo-assistants-ia.md`). Elles s'appliquent à chaque
page, dans les deux langues. Exception : les trois pages légales, dont le texte n'a reçu
aucune modification de fond (seulement la typographie française et leurs `meta`).

1. **Un H1, puis une phrase de définition.** Chaque page a UN seul H1, immédiatement suivi d'une
   phrase de 150 à 250 caractères, en texte HTML : ce que c'est, sur quels appareils, par qui.
   Les assistants citent cette phrase.
2. **Nom maison + genre.** Chaque jeu maison est accolé à son genre générique dans sa
   définition : Pandoku est un puzzle de logique de type Star Battle (FR « puzzle de logique de
   type Star Battle ») ; Pixel Art, des nonogrammes (FR « nonogrammes », aussi « logimages ») ;
   Trace, un puzzle à tracer d'un seul trait ; Arrow Maze, un casse-tête de flèches, jeu de
   DÉTENTE et jamais « défi de logique » ; Cross Math, des mots croisés de calcul. Les classiques
   (Sudoku, Mots croisés, Mots mêlés, Démineur, Labyrinthe) n'ont pas de genre à citer.
3. **Aucun nombre de jeux, de niveaux ni de puzzles**, ni en chiffres ni en lettres (« dix
   jeux », « 100 niveaux », « 1 000 puzzles », « deux niveaux Moyen » sont interdits). Les
   difficultés se listent par leur nom (Facile, Moyen, Difficile, Élite), jamais par un compte.
   Un nombre de grilles par niveau s'écrit en toutes lettres (« trois grilles »).
4. **Modèle économique honnête, exactement celui de l'App Store.** Gratuit avec publicité : une
   bannière pendant la partie et des pubs entre certaines parties ; les pubs récompensées sont
   toujours facultatives (gemmes, indice, seconde chance) ; Premium (semaine, mois ou an) retire
   la bannière et les pubs entre les parties : écrire « zéro pub imposée » / « no forced ads »,
   JAMAIS « sans pub » / « ad-free » (récupérer une série perdue passe toujours par une pub).
   Premium ajoute des vies infinies (jeux à vies), 5 indices gratuits par jour et par jeu, la
   première erreur pardonnée, des gemmes quotidiennes offertes et des gemmes doublées après
   chaque victoire. Achats intégrés : packs de gemmes, et packs de thèmes Cinéma / Cuisine /
   Voyage pour mots croisés et mots mêlés, non inclus dans Premium. **Aucun prix**, aucune
   promesse d'essai gratuit.
5. **Cristaux ≠ gemmes.** Les cristaux ramassés au Labyrinthe ne sont pas la monnaie. Jamais
   « Zip » (nom de code interne de Trace), « Queens » ni « Picross ». Le classement par jeu est
   masqué dans l'app 3.0.0 : ne jamais l'évoquer (les ligues Bronze à Légende, le trophée du mois
   et la série existent).
6. **Un seul défi du jour pour toute l'app.** Le joueur choisit son jeu, la grille est la même
   pour tout le monde, jouable hors ligne ; un jour manqué se rattrape dans le calendrier.
   Jamais « un défi dans chaque jeu ».
7. **Plateformes.** Google Play affiche Cerebrum 3.0.0 depuis le 2026-10-01 avec les dix jeux
   (téléphones et tablettes) : tout jeu est sur iPhone, iPad et Android (`availability.android`
   du registre). iOS 17.0 ou plus récent, Android 8.0 ou plus récent. Un détail vérifié
   seulement sur iOS s'énonce sans l'attribuer à Android ; VoiceOver est le lecteur d'écran de
   l'iPhone : rien sur TalkBack.
8. **Mots croisés et Mots mêlés n'existent qu'en français et en anglais**, alors que l'interface
   de l'app parle 16 langues.
9. **Pièges des faits.** Le premier tap du Démineur n'est PAS garanti sûr ; Cross Math respecte
   la priorité des opérateurs ; chaque niveau de Mots mêlés compte trois grilles à la suite ;
   jamais les seuils d'étoiles de Trace ni le détail de ses grilles Difficile et Élite (ils
   changent en 3.1.0) ; l'indice du Sudoku explique la technique pas à pas.
10. **Ton adulte, ludique, jamais enfantin.** Aucun mot qui s'adresse à l'enfant ou à la
    famille (enfants, kids, famille, éducatif, « pour les petits ») ; les personnages sont des
    illustrations d'appoint, jamais des narrateurs ; usages mis en avant : pause, trajet, file
    d'attente, hors ligne, série, ligues, niveau Élite.
11. **Français écrit nativement**, jamais traduit de l'anglais, avec la typographie française
    (espace insécable avant `: ; ? !` et à l'intérieur des guillemets « »). **Aucun tiret
    cadratin (—)** dans le texte visible, dans les deux langues.
12. **`meta.description` de 155 caractères au plus** ; titres porteurs de « Cerebrum » ou du nom
    du jeu, et de « Synapgeek » quand c'est naturel.
13. **Faits Android** (relus au tag publié `v3.0.0-15`, `docs/contrat/faits-cerebrum-3.0.0-android.md`,
    qui lie la copie quand il liste une différence) :
    - Pixel Art : aucune différence de plateforme (3 vies, cases verrouillées, croix posées
      automatiquement sur une ligne complète, annulation qui ne reprend que les croix, étoiles
      selon les erreurs). Rédiger sans nommer de plateforme.
    - Premier niveau guidé : sur les deux plateformes, pour Pandoku et Démineur (« commence par
      un court premier niveau guidé, que l'on peut passer »).
    - Rappel du soir : une Live Activity sur l'écran verrouillé de l'iPhone et de l'iPad, une
      notification sur Android ; dans les deux cas un compte à rebours de 20 h à minuit, seulement
      si l'on a une série et pas encore joué ce jour-là.
    - Accessibilité : VoiceOver (iPhone, iPad) peut être cité ; rien sur TalkBack ni sur
      l'accessibilité Android.
    - Seconde chance après une défaite : « une seconde chance avec une pub facultative, puis une
      autre avec des gemmes, chacune rendant deux cœurs », vrai sur les deux plateformes pour les
      jeux à cœurs ; jamais le coût en gemmes, jamais « dans l'un ou l'autre ordre ».
    - Jamais de plafond quotidien sur les indices ou notes obtenus par pub.
    - Premium s'achète et se conserve dans chaque boutique et ne passe pas de l'une à l'autre ;
      ni prix ni essai.
    - Connexion : invité, Apple, Google ou Facebook sur les deux plateformes ; la progression
      suit le compte d'un appareil à l'autre (jamais « toujours synchronisée »).
    - Appareils : jamais le paysage. Mots mêlés Moyen : « seul le nombre de lettres de chaque
      mot s'affiche » ; Difficile : la liste est cachée. Jamais « le son respecte le mode
      silencieux » sur Android. Langue : « à changer dans Profil », jamais « redémarrage requis »
      ni « sans redémarrage ». Jamais la ligne du paywall de l'app (« zéro pub, pour toujours »).
14. **Pages jeu : contenu propre au jeu uniquement** (arbitrages R4 et R5 ci-dessous).

## 2. Arbitrages (R3 à R7)

- **R3, aucun compte de niveaux, sans exception.** Les conditions de déblocage qui comptent des
  niveaux sont retirées de tous les tableaux de difficultés ; une difficulté se décrit par ce
  qui change dans la grille.
- **R4, un fait d'app ne se répète pas d'une page à l'autre.** Les faits valables pour toute
  l'app (avantages Premium, coût des indices, mode Infini, hors ligne, pubs, appareils) ne sont
  pas redits dans les mêmes mots sur dix pages : cela relève du gabarit interchangeable que la
  règle 9 du portefeuille condamne. Sur une page jeu, ils ne passent que par leur effet DANS ce
  jeu (ce que montre un indice ici, ce que signifie le mode Infini pour ces grilles, ce qu'une
  erreur coûte ici), avec les mots propres de la page. Garde : aucune phrase ni proposition de
  60 caractères ou plus ne figure deux fois dans une page, ni à l'identique dans deux pages jeu
  d'une langue.
- **R5, la copie d'un jeu ne parle que du jeu.** Les sujets d'app (prix et modèle, publicité,
  Premium, appareils et versions d'OS, hors ligne, langues d'interface, compte et synchronisation)
  ne s'écrivent PAS dans la copie d'un jeu : pas de question « Est-ce gratuit ? », « Sur quels
  appareils ? » ni de phrase « où y jouer ». Le caractère gratuit et hors ligne peut figurer dans
  la phrase de définition (règle 1) et dans les `meta`. Le modèle est porté une fois, par le
  gabarit : `dict.common.gameGet` (modèle exact de la règle 4 et lien vers `/cerebrum`) rendu à
  côté des badges des stores. Exceptions, minuscules et justifiées une à une dans
  `APP_WIDE_ALLOWLIST` (« free piece » est un terme d'Arrow Maze ; les grilles de Mots croisés
  et de Mots mêlés n'existent qu'en français et en anglais ; le nom du dessin de Pixel Art suit la
  langue de l'interface).
- **R6, Trace Difficile et Élite.** Leurs grilles ne sont jamais détaillées (rangées
  qualitatives) et leurs seuils d'étoiles ne sont jamais publiés : ils changent en 3.1.0. Seule
  exception, confirmée par la session iOS : les points jumeaux de l'Élite (un badge fusionné
  qu'on franchit dans l'ordre que l'on veut) restent en 3.1.0 et se mentionnent UNIQUEMENT comme
  l'exception à la règle d'ordre des points numérotés.
- **R7, le défi du jour d'un jeu est une ligne de gabarit.** La mécanique est celle de
  l'app ; seules les difficultés tirées viennent du registre (`dailyDifficulties` : Facile ou
  Moyen, Facile seule pour Mots croisés et Mots mêlés). `dict.common.gameDaily` (`line`, et
  `lineByLanguage` pour les jeux dont la grille suit la langue) la rend ; aucune phrase de défi du
  jour dans la copie d'un jeu : reformuler une clause d'app sur huit pages, c'est du spinning.

## 3. Registre et modules de copie

- **Registre des faits** : `src/content/apps/` (`types.ts`, `index.ts`, `cerebrum/app.ts`,
  `cerebrum/games.ts`). `AppEntry` : identité, identifiants et URLs des stores (importés de
  `src/lib/app.ts`, source unique côté client), versions minimales, titres de fiche, date de
  première publication, 16 langues d'interface, liste ordonnée des jeux. `GameEntry` : catégorie
  (logique et chiffres, mots, parcours), slugs par langue (lus dans `src/lib/page-slugs.ts`), noms
  et genre par langue, difficultés réelles, difficultés du défi du jour, règle de défaite (`lives`),
  tutoriel, disponibilité par plateforme, langues de contenu, `published`, couple de couleurs
  (NOMS de propriétés CSS `--game-<id>-wash/-deep`, valeurs dans `globals.css`, jamais d'hex),
  icône (`/images/games/<id>-v3.webp`) et captures par langue (`/images/screens/v3/<id>-<locale>.webp`).
- **Copie** : `src/content/copy/{en,fr}/{hub,about,press}.ts` ; la copie de l'app et de ses jeux
  vit sous l'app : `src/content/apps/cerebrum/copy/{en,fr}.ts` (page app) et
  `copy/games/<id>.{en,fr}.ts` (un fichier par jeu et par langue, inscrit dans `games/en.ts` et
  `games/fr.ts`). Les types sont dans `src/content/copy/types.ts` (`HubCopy`, `AppCopy`,
  `GameCopy`, `AboutCopy`, `PressCopy`) ; chaque objet porte `updatedAt` (AAAA-MM-JJ), lu par la
  mention « Mis à jour le », le `lastModified` du sitemap et le `dateModified` du JSON-LD. Un
  module n'est contrôlé qu'une fois inscrit dans `REGISTERED_COPY` (`src/content/copy/index.ts`).
- **Dictionnaire** (`src/content/{fr,en,types}.ts`) : l'interface partagée (en-tête, pied de page,
  bandeau de consentement, 404, formulaire de contact, lignes de gabarit `gameGet` et `gameDaily`,
  pages légales). Aucune chaîne en dur dans un composant ; aucun ternaire `locale === "fr"`
  (cliquet à 0).
- **Publier un jeu** : ses deux fichiers de copie (écrits chacun nativement), l'inscription dans
  `games/en.ts` et `games/fr.ts`, `published: true` dans `games.ts`, son icône PNG
  `src/assets/og-icons/<id>.png` (image Open Graph), son entrée dans `RENDERED_PAGE_IDS`, sa
  ligne dans `public/llms.txt` (définition mot pour mot), ses attentes dans `check:contract`.
  Un jeu publié sans copie, ou une copie sans jeu au registre, fait échouer les gardes.
- **Ajouter une app** : une entrée `AppEntry`, ses jeux éventuels, sa copie (même structure),
  un `PageId`, une route. Le nom de code de la future app non-jeu n'apparaît JAMAIS, ni dans le
  code, ni dans les commentaires, ni dans la documentation.

## 4. Les gardes de contenu

Toutes passent par `npm test` (vitest). Elles sont écrites en deux étages : des fonctions pures
appliquées à chaque module enregistré, puis des « contrôles positifs » qui les appliquent à des
modules fabriqués, un cas fautif par règle. Sans le second étage, un registre vide rendrait le
fichier vert pour rien.

| Garde (fichier)                                                | Ce qu'elle protège                                                                                                                     |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| règles de texte (`content-guards.test.ts`, `FORBIDDEN`)        | règles 3, 4, 5, 10, 11 : nombre de jeux ou de niveaux (même en lettres), cadratin, « sans pub » / « ad-free » / « no ads », Zip/Queens/Picross, mots d'enfant ou de famille, classement, prix (€, $, USD, EUR) |
| longueurs                                                      | règles 1 et 12 : définition de 150 à 250 caractères (bornes incluses), `meta.description` de 155 au plus, jeux compris                  |
| genre                                                          | règle 2 : la définition d'un jeu maison cite son genre (espaces insécables acceptés)                                                    |
| plateforme                                                     | un jeu dont `availability.android` est nul ne mentionne jamais Android                                                                  |
| forme                                                          | 3 à 6 étapes, 3 à 5 conseils, 3 à 6 questions par jeu ; aucune difficulté absente du jeu dans le tableau (pas d'Élite sur un jeu qui n'en a pas) |
| couverture                                                     | un jeu publié a sa copie dans chaque langue, une copie n'existe pas sans jeu au registre                                                |
| parité FR/EN                                                   | mêmes clés partout et mêmes longueurs sur les tableaux comptés (`faq.items`, `howToPlay.steps`, `tips.items`) ; le nombre de paragraphes reste libre (le français est écrit, pas traduit) |
| phrases répétées (R4)                                          | aucune phrase ni proposition de 60+ caractères deux fois dans une page ou dans deux pages jeu ; coupe aussi sur `;` et `:` ; liste blanche minuscule et justifiée |
| quasi-doublons                                                 | une phrase de 60+ caractères recopiée d'un jeu à l'autre en changeant le nom propre (similarité de trigrammes de mots à 0,6) échoue    |
| sujets d'app (R5)                                              | aucun des sujets Premium, App Store, Google Play, iPhone, iPad, Android, gratuit, hors ligne, pubs, abonnement, langues dans la copie d'un jeu (hors définition et `meta`), sauf `APP_WIDE_ALLOWLIST` ; échoue aussi si une entrée de la liste ne sert plus |
| typographie française                                          | espace insécable avant `: ; ? !` et dans les guillemets, dans les modules français et dans `fr.ts` (adresses et heures exemptées)       |
| sujets du formulaire de contact                                | les sujets du formulaire du Dictionnaire sont exactement ceux de la table `CONTACT_TOPICS` de `src/app/api/contact/route.ts`, dans le même ordre |
| `llms-content.test.ts`                                         | `public/llms.txt` reprend, mot pour mot, la définition de chaque page dans chaque langue et le modèle de la page app ; ni cadratin, « sans pub », prix, note ni téléchargements |
| `legal-meta.test.ts`                                           | meta descriptions légales renseignées et sans cadratin                                                                                   |
| `publisher.test.ts`                                            | l'adresse et le capital de la source unique de l'éditeur sont ceux de `/legal`                                                           |
| `registry.test.ts`                                             | dix jeux dans l'ordre, slugs uniques et non réservés, difficultés, vies et tutoriels du fichier de faits, disponibilités, assets qui existent sous `public/`, couleurs nommées par propriété CSS |
| `src/design/*.test.ts`                                         | aucun hex en dur dans les composants, contraste WCAG AA des jetons et des dix couples de jeu, couleur de thème = vert de marque         |

Une garde se corrige en corrigeant le texte, jamais en élargissant sa liste blanche pour la
faire taire : chaque exception se justifie par un commentaire.

## 5. Sources de faits, et leur ordre

Jamais un fait inventé ; jamais un fait iOS généralisé à Android ; en cas de doute, le dire.

1. **Faits iOS** : `docs/contrat/faits-cerebrum-3.0.0.md`, relevés par la session App iOS sur le
   tag `v3.0.0` (règles, difficultés, aides, textes des tutoriels FR/EN). Ils ne disent rien d'Android.
2. **Faits Android** : `docs/contrat/faits-cerebrum-3.0.0-android.md`, relus au tag publié
   `v3.0.0-15` (propriétaire : la session Android). Toute affirmation sur Android, et toute
   différence de plateforme qu'il liste, vient de lui.
3. **Fiche App Store** : `cerebrum-design-system/marketing/ASO/3.x.x/asc-metadata.md` (copie
   vérifiée FR/EN et ses « choix de rédaction »), avec `geo-assistants-ia.md` pour les règles
   d'écriture.
4. Le registre (`src/content/apps/`), qui encode ces faits sous forme typée.
5. Les sessions dédiées (iOS, Android, Design System) pour tout ce que ces documents ne tranchent pas.

Non vérifiés, donc jamais publiés : prix réels des abonnements et packs, essai gratuit, comportement
exact des achats hors ligne, plafond d'indices par pub, coût des indices et ordre de déblocage
dans un pack thématique. La note App Store (4,7/5 sur 16 notes en France) est trop faible pour
être affichée ; aucune note, aucun avis, aucun nombre de téléchargements.

## 6. Demander une vérification de faits à la session iOS

Le code d'une autre app ne se lit ni ne se modifie depuis ce dépôt : on interroge la session
dédiée (`ListAgents` pour retrouver son nom exact, puis `SendMessage`). Procédure suivie pour les
onze pages de la refonte :

1. La copie d'une page est terminée et a passé les gardes ; le contrôleur envoie le texte à la
   session App iOS (jamais les sous-agents implémenteurs).
2. La session répond par page : corrections (faux), précisions (vrai mais à nuancer), notes sur
   la 3.1.0. Elle propose aussi une relecture finale du texte définitif.
3. Les corrections se regroupent et s'appliquent en un lot, puis la copie finale repart pour
   relecture. Une précision iOS s'énonce en nommant la plateforme.
4. Un fait qui n'est ni dans le fichier iOS ni dans le fichier Android se range dans
   `docs/contrat/` avec sa source, pour la traçabilité.

## 7. Suite à prévoir à la 3.1.0 (non publiée, aucune date)

La 3.1.0 n'ajoute aucun jeu ; ni coûts, ni difficultés, ni déblocages ne changent. À la sortie
(date décidée par Adrien), relire :

- **Trace Difficile et Élite** : grilles refaites, seuils d'étoiles Difficile et Élite relevés
  (règle 9 et R6) ; les points jumeaux de l'Élite restent.
- **L'indice des dix jeux** passe dans une bulle commune (le panda) : relire les phrases qui
  décrivent l'indice dans chaque jeu.
- **Phrase de l'indice de Cross Math** : la 3.1.0 y explique le raisonnement dans une bulle ;
  relire la ligne du bouton Indice et la réponse de la FAQ (`cross-math.<locale>.ts`).
- **Présentation de l'indice du Démineur et de Pixel Art** : l'indice passe par une bulle
  avant d'être joué ; relire les deux pages.

Rien de la 3.1.0 ne s'annonce avant sa publication.

## 8. Données de l'app et identité de l'éditeur (pour les pages légales)

La politique de confidentialité reflète EXACTEMENT les données collectées par l'app (étiquettes
App Store, `PrivacyInfo.xcprivacy`, Data Safety de la Play Console).

- **Collecté** : compte (UID Firebase, e-mail, nom, photo selon le fournisseur) ; gameplay ;
  progression ; appareil et diagnostics ; notifications (jeton FCM et jetons ActivityKit dans le
  document Firestore `users/{uid}/devices/{deviceId}`, purgé par `deleteUserAccount`) ; publicité
  (IDFA via ATT, AAID via UMP en EEE, Royaume-Uni et Suisse, interactions avec les pubs,
  événements de conversion Meta si consentement) ; historique minimal des transactions
  (identifiant produit, type, date, plateforme : aucune donnée de paiement).
- **Non collecté** : santé, contacts, photos, caméra, calendrier, micro. La position n'est jamais
  demandée (ni CoreLocation, ni clé `NSLocation*`), mais AdMob déduit une localisation approximative
  de l'IP à des fins publicitaires et UMP s'en sert pour détecter l'EEE ; la politique le dit.
- **Stack iOS** : Firebase (Analytics, Crashlytics, Performance, Firestore, Auth, Functions,
  Messaging, App Check), Meta (connexion et événements, soumis au consentement publicitaire),
  Google Mobile Ads (bannières, interstitiels, récompensées ; l'App Open est désactivée depuis le
  2026-05-20, à ne décrire ni comme active ni comme abandonnée), UMP et ATT. `FirebaseStorage` et
  `FirebaseDatabase` sont liés au target sans aucun site d'appel : ne pas les déclarer.
- **Connexion** : invité, Apple, Google, Facebook. Aucun écran e-mail/mot de passe, mais le chemin
  reste appelable en API : ne pas conclure qu'il est supprimé.
- **Suppression de compte** : dans l'app (Profil > Supprimer le compte), Cloud Function
  `deleteUserAccount` (sous-collections Firestore, document utilisateur, classements, Firebase Auth).
  Public : 13 ans et plus dans les CGU, pas de mécanisme COPPA.
- **Éditeur**, source unique `src/content/publisher.ts`, publié sur `/legal` et à garder cohérent
  avec App Store Connect et la Play Console : Synapgeek SAS, capital 1 000 €, 185 chemin des
  Brosses, 69620 Frontenas, RCS Villefranche-Tarare 102 429 826, SIRET 102 429 826 00013, APE
  62.01Z, TVA FR86 102 429 826, directeur de la publication Adrien Monte, hébergeur Vercel Inc.
- **Boîtes** : `contact@synapgeek.com` (général, destinataire du formulaire, CGU),
  `privacy@synapgeek.com` (données personnelles, RGPD), `adrien.monte@synapgeek.com` (développement,
  compte SMTP).
