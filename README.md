# TP DevOps CI/CD GitLab

Projet minimal mais fonctionnel pour démontrer une chaîne CI/CD complète avec GitLab CI/CD, Docker, Docker Compose, Cypress et déploiement automatique sur AWS via SSH.

## Architecture

- `frontend/` : application React servie par Nginx
- `backend/` : API Express avec endpoint `GET /api/health`
- `postgres` : base de données utilisée par le backend
- `tests/` : tests end-to-end Cypress avec screenshots et vidéos

Le frontend appelle le backend en HTTP via `/api/health`. En local, Docker Compose expose :

- frontend : `http://localhost:8080`
- backend : `http://localhost:3000/api/health`
- postgres : `localhost:5432`

## Structure

```text
.
├── frontend/
├── backend/
├── tests/
├── docker-compose.yml
├── docker-compose.prod.yml
├── .gitlab-ci.yml
├── deploy.sh
└── README.md
```

## Lancer le projet en local

```bash
docker compose up --build
```

Puis ouvrir [http://localhost:8080](http://localhost:8080).

Vérification API directe :

```bash
curl http://localhost:3000/api/health
```

Réponse attendue :

```json
{ "status": "ok" }
```

## Lancer les tests Cypress en local

Démarrer d'abord l'application :

```bash
docker compose up --build
```

Dans un autre terminal :

```bash
cd tests
npm install
npx cypress run
```

Les artefacts Cypress sont générés dans :

- `tests/cypress/screenshots/`
- `tests/cypress/videos/`

## Pipeline GitLab CI/CD

Le pipeline contient 4 stages :

1. `build`
2. `test`
3. `package`
4. `deploy`

### Stage `build`

- installe les dépendances du frontend et du backend
- construit l'application React
- génère le dossier `dist` du backend

### Stage `test`

- exécute les tests backend avec Jest et Supertest
- démarre backend + frontend
- exécute Cypress
- conserve screenshots et vidéos comme artefacts GitLab

### Stage `package`

- construit les images Docker du frontend et du backend
- pousse les images vers le GitLab Container Registry
- utilise :
  - `CI_REGISTRY`
  - `CI_REGISTRY_USER`
  - `CI_REGISTRY_PASSWORD`

### Stage `deploy`

- se connecte au serveur AWS en SSH
- copie `docker-compose.prod.yml`
- fait `docker compose pull`
- fait `docker compose up -d`

## Variables GitLab CI/CD à définir

Variables obligatoires :

- `CI_REGISTRY`
- `CI_REGISTRY_USER`
- `CI_REGISTRY_PASSWORD`
- `SSH_PRIVATE_KEY`
- `AWS_HOST`
- `AWS_USER`

Variables optionnelles :

- `AWS_PORT`
- `DEPLOY_PATH`
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `FRONTEND_PORT`
- `BACKEND_PORT`

## Déploiement AWS

Le serveur AWS doit avoir :

- Docker installé
- Docker Compose disponible via `docker compose`
- un accès réseau au GitLab Container Registry
- l'utilisateur SSH autorisé à exécuter Docker

Le script `deploy.sh` est exécuté automatiquement dans GitLab sur la branche `main`.

## Commandes utiles

Rebuild complet local :

```bash
docker compose down -v
docker compose up --build
```

Arrêt des services :

```bash
docker compose down
```
