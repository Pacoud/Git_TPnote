#!/usr/bin/env bash
set -euo pipefail

required_vars=(
  AWS_HOST
  AWS_USER
  SSH_PRIVATE_KEY
  CI_REGISTRY
  CI_REGISTRY_USER
  CI_REGISTRY_PASSWORD
  CI_REGISTRY_IMAGE
  CI_COMMIT_SHORT_SHA
)

for var_name in "${required_vars[@]}"; do
  if [[ -z "${!var_name:-}" ]]; then
    echo "Missing required environment variable: ${var_name}" >&2
    exit 1
  fi
done

AWS_PORT="${AWS_PORT:-22}"
DEPLOY_PATH="${DEPLOY_PATH:-/opt/devops-tp}"
POSTGRES_DB="${POSTGRES_DB:-devopsdb}"
POSTGRES_USER="${POSTGRES_USER:-devops}"
POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-devops}"
FRONTEND_PORT="${FRONTEND_PORT:-80}"
BACKEND_PORT="${BACKEND_PORT:-3000}"
FRONTEND_IMAGE="${CI_REGISTRY_IMAGE}/frontend:${CI_COMMIT_SHORT_SHA}"
BACKEND_IMAGE="${CI_REGISTRY_IMAGE}/backend:${CI_COMMIT_SHORT_SHA}"

mkdir -p "${HOME}/.ssh"
chmod 700 "${HOME}/.ssh"
printf "%s\n" "${SSH_PRIVATE_KEY}" | tr -d "\r" > "${HOME}/.ssh/id_ed25519"
chmod 600 "${HOME}/.ssh/id_ed25519"
ssh-keyscan -p "${AWS_PORT}" -H "${AWS_HOST}" >> "${HOME}/.ssh/known_hosts"

tmp_env_file="$(mktemp)"
trap 'rm -f "${tmp_env_file}"' EXIT

cat > "${tmp_env_file}" <<EOF
FRONTEND_IMAGE=${FRONTEND_IMAGE}
BACKEND_IMAGE=${BACKEND_IMAGE}
POSTGRES_DB=${POSTGRES_DB}
POSTGRES_USER=${POSTGRES_USER}
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
FRONTEND_PORT=${FRONTEND_PORT}
BACKEND_PORT=${BACKEND_PORT}
EOF

ssh -p "${AWS_PORT}" "${AWS_USER}@${AWS_HOST}" "mkdir -p '${DEPLOY_PATH}'"
scp -P "${AWS_PORT}" docker-compose.prod.yml "${AWS_USER}@${AWS_HOST}:${DEPLOY_PATH}/docker-compose.prod.yml"
scp -P "${AWS_PORT}" "${tmp_env_file}" "${AWS_USER}@${AWS_HOST}:${DEPLOY_PATH}/.env"

printf "%s\n" "${CI_REGISTRY_PASSWORD}" | ssh -p "${AWS_PORT}" "${AWS_USER}@${AWS_HOST}" "
  set -euo pipefail
  cd '${DEPLOY_PATH}'
  docker login '${CI_REGISTRY}' -u '${CI_REGISTRY_USER}' --password-stdin
  docker compose -f docker-compose.prod.yml --env-file .env pull
  docker compose -f docker-compose.prod.yml --env-file .env up -d --remove-orphans
"

echo "Deployment completed on ${AWS_HOST}:${DEPLOY_PATH}"
