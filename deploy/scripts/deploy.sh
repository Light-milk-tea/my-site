#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/../.."

if [[ ! -f .env ]]; then
  echo ".env not found. Copy .env.example to .env and update production values first."
  exit 1
fi

docker compose pull postgres nginx certbot || true
docker compose up -d --build
docker compose up -d --no-deps --force-recreate nginx
docker compose exec -T nginx nginx -s reload || true
docker compose ps

echo "Deployment finished."
