#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/../.."

BASE_URL="${1:-${FRONTEND_ORIGIN:-http://localhost}}"

echo "== Docker services =="
docker compose ps

echo
echo "== Disk usage =="
df -h /

echo
echo "== Memory usage =="
free -h

echo
echo "== HTTP checks =="
curl -fsS "$BASE_URL/" >/dev/null && echo "Frontend OK: $BASE_URL/"
curl -fsS "$BASE_URL/api/categories" >/dev/null && echo "API OK: $BASE_URL/api/categories"
