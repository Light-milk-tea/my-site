#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/../.."

mkdir -p deploy/backups

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  . ./.env
  set +a
fi

DB_NAME="${POSTGRES_DB:-blog}"
DB_USER="${POSTGRES_USER:-blog}"
STAMP="$(date +%Y%m%d-%H%M%S)"
OUT="deploy/backups/${DB_NAME}-${STAMP}.sql.gz"

docker compose exec -T postgres pg_dump -U "$DB_USER" "$DB_NAME" | gzip > "$OUT"

find deploy/backups -name "*.sql.gz" -type f -mtime +14 -delete

echo "Database backup written to $OUT"
