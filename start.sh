#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

info() {
  echo "[INFO] $*"
}

warn() {
  echo "[WARN] $*" >&2
}

fail() {
  echo "[ERROR] $*" >&2
  exit 1
}

if [[ ! -f docker-compose.yml ]]; then
  fail "docker-compose.yml not found. Please run this script from the project root."
fi

if [[ ! -f deploy/scripts/deploy.sh ]]; then
  fail "deploy/scripts/deploy.sh not found. Please check the deployment scripts."
fi

if ! command -v docker >/dev/null 2>&1; then
  fail "Docker is not installed. Run: sudo bash deploy/scripts/setup-ubuntu.sh"
fi

if ! docker compose version >/dev/null 2>&1; then
  fail "Docker Compose plugin is not available. Run: sudo bash deploy/scripts/setup-ubuntu.sh"
fi

if [[ ! -f .env ]]; then
  if [[ ! -f .env.example ]]; then
    fail ".env and .env.example are both missing. Cannot create server environment config."
  fi

  cp .env.example .env
  warn ".env was created from .env.example."
  warn "Edit .env and replace production values before starting the server:"
  warn "  POSTGRES_PASSWORD, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, FRONTEND_ORIGIN, DOMAIN_NAME, CERTBOT_EMAIL"
  warn "Then run this script again: bash start.sh"
  exit 1
fi

info "Starting services with Docker Compose..."
bash deploy/scripts/deploy.sh

info "Running health check..."
if bash deploy/scripts/health-check.sh; then
  info "Health check passed."
else
  warn "Health check failed. Services may still be starting."
  warn "Inspect logs with: docker compose logs -f backend"
fi

cat <<'EOF'

Useful commands:
  docker compose ps
  docker compose logs -f backend
  docker compose logs -f nginx

Default URLs:
  http://localhost/
  http://localhost/admin
  http://localhost/api/categories
EOF
