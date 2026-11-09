# Argent Bank – Front-end

Application bancaire en React : page d'accueil, connexion, profil utilisateur et modification du pseudo.
Projet OpenClassrooms « Implémentez le front-end d'une application bancaire avec React ».

## Stack

- [React](https://react.dev) + [Vite](https://vite.dev)
- [React Router](https://reactrouter.com) pour la navigation
- [Redux Toolkit](https://redux-toolkit.js.org) + React Redux pour le state global
- API : [ArgentBank-Backend](https://github.com/BaptisteChevassus/ArgentBank-Backend) (Node.js, Express, MongoDB)

## Prérequis

- Node.js 20 (voir `.nvmrc`, `nvm use` le sélectionne)
- Le back-end lancé sur `http://localhost:3001` avec sa base de données remplie (voir son README)

## Installation et lancement

```bash
npm install
npm run dev
```

L'application tourne sur http://localhost:5173.

Comptes de test (créés par `npm run populate-db` côté back-end) :

| Email | Mot de passe |
| --- | --- |
| tony@stark.com | password123 |
| steve@rogers.com | password456 |

Pour pointer vers une autre API, créer un fichier `.env.local` :

```
VITE_API_URL=http://localhost:3001/api/v1
```

## Scripts

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production dans `dist/` |
| `npm run preview` | Sert le build de production |
| `npm run lint` | Analyse du code (oxlint) |

## Fonctionnalités

| Route | Page | Accès |
| --- | --- | --- |
| `/` | Accueil | Public |
| `/login` | Connexion (message d'erreur si identifiants incorrects) | Public, redirige vers `/profile` si déjà connecté |
| `/profile` | Profil, comptes, modification du pseudo | Connecté uniquement, sinon redirige vers `/login` |
| `*` | Page 404 | Public |

- **Connexion** : le token JWT est gardé en `localStorage` si « Remember me » est coché, sinon en `sessionStorage` (jusqu'à la fermeture de l'onglet).
- **Déconnexion** : retour à l'accueil, le token et les données de l'utilisateur sont effacés du store.
- **Modification du pseudo** : seul le `userName` est modifiable (prénom et nom en lecture seule). Il est enregistré en base et mis à jour partout dans l'interface.
- **Token expiré ou invalide** : l'utilisateur est déconnecté proprement.

## Organisation du code

```
src/
├── assets/images/   Images optimisées (WebP)
├── components/      Composants réutilisables (Header, Footer, Feature, Account, formulaires…)
├── data/            Contenus statiques (features de l'accueil, comptes de démonstration)
├── pages/           Une page par route
├── services/api.js  Tous les appels à l'API
├── store/           Store Redux : authSlice (token, connexion) et userSlice (profil)
└── styles/          CSS global
designs/             Maquettes HTML/CSS d'origine (référence)
```

Le profil est chargé une seule fois après la connexion. Le header et la page profil lisent la même donnée du store.

## Green Code

- Images converties en WebP à leur taille d'affichage (×2 pour les écrans Retina) : 215 Ko d'images à l'origine, contre 45 Ko chargés sur ordinateur (−79 %) et 27 Ko sur mobile (−87 %), grâce à une image d'accueil plus légère sous 920 px.
- Icônes Font Awesome (CDN externe) remplacées par 2 icônes SVG intégrées au build.
- Composants réutilisables alimentés par des données (`Feature`, `Account`).
- Requête de profil annulée si l'utilisateur se déconnecte pendant le chargement.

## Limites connues

- Le token est stocké dans le navigateur (`localStorage` / `sessionStorage`) : simple et courant, mais exposé en cas de faille XSS. Un cookie `httpOnly` géré par le back-end serait plus sûr.
- Se déconnecter dans un onglet ne déconnecte pas les autres onglets déjà ouverts.
- Les comptes affichés sur le profil sont des données de démonstration : l'API ne fournit pas encore de route pour les comptes (voir la phase 2).

## Phase 2 : API des transactions

La proposition d'API pour les transactions (Swagger 2.0) se trouve dans le `swagger.yaml` du [back-end](https://github.com/BaptisteChevassus/ArgentBank-Backend), section « Transaction Module ». Elle est visible sur http://localhost:3001/api-docs une fois le back-end lancé.
