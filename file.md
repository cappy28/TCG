# ClassChat Nexus

Un prototype de collection de cartes communautaires :
création, boosters, collection, cadeaux et échanges.

## Statut du projet

Cette version est une application front-end locale.

Elle peut être hébergée comme site statique, mais ce n’est pas encore
une plateforme multijoueur prête pour une ouverture publique.

Les amis et les échanges sont simulés.
La synchronisation des références concerne des catalogues externes,
pas les comptes ou les collections des joueurs.

Le code fourni n’a pas été exécuté ni audité dans un navigateur
au cours de sa rédaction.

## Structure du dépôt

```text
classchat-nexus/
├── index.html
├── style.css
├── app.js
└── README.md
```

Aucun paquet npm, framework ou outil de compilation n’est nécessaire.

## Branchement dans index.html

Le fichier HTML doit charger la feuille de style et le script :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1, viewport-fit=cover"
  >
  <meta name="theme-color" content="#edf3f8">

  <title>ClassChat Nexus</title>

  <link rel="stylesheet" href="./style.css">
  <script src="./app.js" defer></script>
</head>
<body>
  <div id="app"></div>

  <noscript>
    JavaScript est nécessaire pour utiliser ClassChat Nexus.
  </noscript>
</body>
</html>
```

Le script construit la structure de l’application dans `#app`.

Il peut également reprendre la structure du prototype initial
si les éléments suivants existent déjà :

- `#content`
- `#navigation`
- `#modal`
- `#toast`
- `#balance`

Ne pas charger les anciens scripts V1, V2 ou V3 en plus de `app.js`.

## Feuille de style

`app.js` utilise les classes du design Nexus existant, notamment :

- Structure : `shell`, `topbar`, `brand`, `top-actions`
- Navigation : `dock-wrap`, `dock`, `nav-item`
- Surfaces : `glass`, `panel`, `notice`, `tag`
- Boutons : `btn`, `primary`, `secondary`, `text-btn`, `icon-btn`
- Cartes : `tcg`, `art`, `card-top`, `card-bottom`, `card-name`
- Collection : `card-grid`, `shop-grid`, `shop-item`
- Éditeur : `two-col`, `preview-panel`, `preview-card`, `field`
- Boosters : `pack-stage`, `pack`, `pack-orb`, `reveal-grid`, `flip`
- Fenêtres : `dialog-head`, `close`
- Notifications : `toast`, `visible`

La classe `solid`, placée sur `body`, active le mode
à transparence réduite prévu dans la feuille de style.

## Lancer le projet

### Option 1 : GitHub Pages

1. Déposer les quatre fichiers à la racine du dépôt.
2. Ouvrir les paramètres du dépôt : `Settings`.
3. Ouvrir `Pages`.
4. Dans `Build and deployment`, choisir `Deploy from a branch`.
5. Sélectionner la branche contenant le projet, par exemple `main`.
6. Sélectionner le dossier `/(root)`.
7. Enregistrer et attendre le déploiement.

La disponibilité de GitHub Pages dépend du type de dépôt
et de l’offre GitHub utilisée.

### Option 2 : serveur de développement local

Utiliser par exemple la fonction de serveur local de son éditeur.

L’ouverture directe en `file://` peut servir pour un premier aperçu,
mais n’est pas le mode recommandé pour tester le stockage
et les requêtes réseau.

## Fonctionnalités

### Boosters

- Deux boosters disponibles par jour.
- Renouvellement à minuit UTC.
- Les boosters non ouverts ne s’accumulent pas.
- Cinq cartes par booster.
- Probabilités indépendantes pour chaque carte :
  - Commune : 70 %.
  - Rare : 25 %.
  - Mythique : 5 %.
- Aucun tirage rare garanti.
- Les cartes sont enregistrées avant l’animation de révélation.

La rareté correspond à une probabilité de tirage.
Elle ne garantit pas un nombre limité d’exemplaires.

### Récompenses de découverte

Une carte découverte pour la première fois dans un booster rapporte :

| Rareté | Jetons |
|---|---:|
| Commune | 5 |
| Rare | 15 |
| Mythique | 45 |

Les doubles ne donnent pas de nouvelle récompense.

Les achats et les échanges marquent la carte comme déjà découverte,
sans donner de jetons.

Le premier exemplaire offert lors d’une création ne donne aucun bonus.

### Création

- Coût : 80 jetons virtuels.
- Limite : trois créations par jour UTC.
- Limite locale totale : 200 créations.
- Nom : 30 caractères maximum.
- Description : 140 caractères maximum.
- Image facultative : JPG, PNG ou WebP, 2 Mo maximum.
- L’image importée est réduite à 600 pixels sur son plus grand côté.
- Les créations sont communes.

Les imports de fichiers sont traités dans le navigateur.
Ils ne sont pas envoyés aux fournisseurs de références.

### Cadeau obligatoire

Le premier exemplaire est attribué à un ami fictif.

Il ne rejoint pas l’inventaire du créateur.

Le créateur peut ensuite obtenir un autre exemplaire
en booster ou dans la boutique.

Le cadeau est une simulation locale :
aucun message ni notification n’est envoyé.

### Collection

- Recherche par nom et créateur.
- Filtres par rareté.
- Filtre des doubles.
- Quantités possédées.
- Fiches détaillées.

### Profil

- Pseudo local.
- Vitrine de trois cartes possédées.
- Liste de souhaits.
- Historique des premiers cadeaux.

Une carte est retirée automatiquement des souhaits
dès qu’elle rejoint l’inventaire.

### Échanges

- Amis fictifs uniquement.
- Échange entre cartes de même rareté.
- Chaque participant doit posséder au moins deux exemplaires
  de la carte qu’il donne.
- Le dernier exemplaire est conservé.
- Le bouton simule l’accord de l’autre participant.
- Aucun jeton n’est attribué.
- Les créations personnelles ne sont pas proposées en retour
  par les amis fictifs.

### Boutique

| Rareté | Prix |
|---|---:|
| Commune | 30 jetons |
| Rare | 90 jetons |
| Mythique | 270 jetons |

Aucun paiement en argent réel.
Aucune conversion des jetons en argent.

## Bibliothèque de mèmes et références

### Activation facultative

La connexion doit être activée pour chaque session.

Avant activation :

- aucune requête n’est lancée vers les API de références ;
- les images externes sauvegardées sont remplacées visuellement
  par une illustration locale ;
- les fichiers importés personnellement restent visibles.

L’écran de confirmation demande de déclarer avoir au moins 13 ans.
Il ne constitue pas un système de vérification d’âge.

### Source principale : justmeme.wtf

Endpoints utilisés :

```text
GET https://justmeme.wtf/api/v1/templates
GET https://justmeme.wtf/api/v1/templates/search?q=...
GET https://justmeme.wtf/api/v1/trending
```

Documentation :

https://justmeme.wtf/api-docs

L’intégration suit les formats publiés dans cette documentation.

Les réponses de ces endpoints n’ont pas été vérifiées directement
avec l’outil utilisé pendant la rédaction. Leur fonctionnement
effectif dans le navigateur reste à tester.

### Source de secours : Imgflip

Endpoint :

```text
GET https://api.imgflip.com/get_memes
```

Documentation :

https://imgflip.com/api

La source de secours fournit des modèles populaires,
pas une liste exhaustive des dernières nouveautés.

### Fonctionnement réseau

- Cache en mémoire de session : 15 minutes.
- Bouton d’actualisation pour ignorer le cache.
- Délai maximal : 10 secondes par requête.
- Pause de la source principale pendant une minute après un échec.
- Repli vers Imgflip si nécessaire.
- Résultats obsolètes ignorés lorsqu’une autre recherche les remplace.
- Aucune clé API intégrée au navigateur.
- Aucun contenu factice présenté comme synchronisé.

Il n’existe pas de téléchargement automatique de tout le catalogue.
Les contenus sont chargés lors de la consultation.

### Limites

Le catalogue :

- n’est pas modéré par Nexus ;
- n’est pas garanti adapté à tous les collégiens ;
- n’est pas exhaustif ;
- ne garantit pas les dernières références TikTok françaises ;
- dépend de la disponibilité et des règles des fournisseurs ;
- peut contenir des images qui deviennent indisponibles.

Une image importée depuis ce catalogue conserve son hébergement
externe : elle n’est pas copiée dans un stockage Nexus.

### Attribution et droits

Les liens vers les fournisseurs et les sources sont affichés
dans l’interface.

La présence d’une image dans une API ne donne pas automatiquement
le droit de la réutiliser, la modifier ou la redistribuer.

Conditions Imgflip :

https://imgflip.com/terms

Avant une ouverture publique, prévoir une sélection de contenus
adaptés, une gestion des droits et une procédure de retrait.

## Sauvegarde

Clé principale :

```text
classchat-nexus-state-v4
```

Migration de l’ancien prototype :

```text
classchat-nexus-demo-v1
```

Si aucune sauvegarde actuelle n’existe, le script tente de reprendre
l’ancienne progression compatible.

L’ancienne clé n’est pas supprimée lors de cette migration.

### Ce qui est sauvegardé

- Jetons.
- Inventaire.
- Cartes déjà découvertes.
- Créations et images locales.
- Cadeaux simulés.
- Stocks des amis fictifs.
- Pseudo, souhaits et vitrine.
- Préférence de transparence.

### Ce qui n’est pas synchronisé

- Autres appareils.
- Autres navigateurs.
- Comptes d’autres personnes.
- Autres adresses d’hébergement.

Les onglets d’une même origine peuvent recharger la progression
lorsqu’un changement de stockage est reçu.

Ce mécanisme ne garantit pas des transactions simultanées :
éviter de modifier la progression dans plusieurs onglets à la fois.

L’effacement des données du site supprime la progression locale.
Le stockage du navigateur peut être limité ou indisponible.

## Sécurité et limites avant publication publique

Cette version ne doit pas être utilisée comme une économie réelle.

Un utilisateur peut modifier ses données locales et son horloge.

Avant le multijoueur, il faut notamment ajouter :

- Authentification et comptes réels.
- Base de données avec règles d’accès.
- Validation des jetons et des tirages côté serveur.
- Transactions d’échange atomiques.
- Protection contre les doubles dépenses.
- Gestion des cadeaux et des destinataires réels.
- Stockage et validation serveur des images.
- Modération des créations.
- Signalement, blocage et retrait.
- Gestion adaptée de la confidentialité et des accès.
- Tests automatisés et tests sur appareils mobiles.

Ne jamais ajouter une clé secrète de serveur dans `app.js`.

## Vérifications manuelles

- [ ] Le site démarre sans erreur JavaScript.
- [ ] Les cinq onglets fonctionnent sur ordinateur et mobile.
- [ ] Le solde initial est de 160 jetons pour une nouvelle partie.
- [ ] L’ouverture d’un booster ajoute exactement cinq cartes.
- [ ] Fermer la révélation ne fait pas perdre les cartes.
- [ ] Un double ne donne pas de nouvelle récompense.
- [ ] Le troisième booster quotidien est bloqué.
- [ ] La création dépense 80 jetons.
- [ ] Le premier cadeau n’apparaît pas dans l’inventaire du créateur.
- [ ] La carte créée rejoint boutique et boosters.
- [ ] Une quatrième création quotidienne est bloquée.
- [ ] Une image personnelle apparaît dans l’aperçu.
- [ ] L’image n’est pas envoyée aux fournisseurs externes.
- [ ] Les échanges conservent un exemplaire de chaque côté.
- [ ] Un achat ne donne aucun jeton.
- [ ] La vitrine refuse une quatrième carte.
- [ ] Une carte obtenue quitte les souhaits.
- [ ] Un rechargement conserve la progression locale.
- [ ] Aucune image externe ne charge avant activation.
- [ ] Les références affichent leur source réelle.
- [ ] Une panne réseau affiche un message, sans faux résultat.
- [ ] La navigation clavier et la fermeture des fenêtres fonctionnent.
- [ ] La réduction de transparence fonctionne.

## Documentation des services

- justmeme : https://justmeme.wtf/api-docs
- Imgflip API : https://imgflip.com/api
- Imgflip, conditions : https://imgflip.com/terms
- GitHub Pages :
  https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Identité du projet

ClassChat Nexus est un projet indépendant.

Les illustrations générées dans l’application sont propres
au prototype. Les images importées conservent les droits
de leurs auteurs respectifs.

Le dépôt n’inclut pas de licence générale par défaut :
choisir explicitement une licence avant une distribution publique.
