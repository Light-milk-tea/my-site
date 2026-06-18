#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/../.."

DOMAIN="${1:-${DOMAIN_NAME:-}}"
EMAIL="${2:-${CERTBOT_EMAIL:-}}"
EXTRA_DOMAINS=("${@:3}")

if [[ -z "$DOMAIN" || -z "$EMAIL" ]]; then
  echo "Usage: DOMAIN_NAME=example.com CERTBOT_EMAIL=me@example.com bash deploy/scripts/issue-cert.sh"
  echo "Or: bash deploy/scripts/issue-cert.sh example.com me@example.com www.example.com"
  exit 1
fi

docker compose up -d nginx

DOMAIN_ARGS=(-d "$DOMAIN")
SERVER_NAMES="$DOMAIN"
for extra_domain in "${EXTRA_DOMAINS[@]}"; do
  DOMAIN_ARGS+=(-d "$extra_domain")
  SERVER_NAMES="$SERVER_NAMES $extra_domain"
done

docker compose --profile certbot run --rm certbot certonly \
  --webroot \
  --webroot-path /var/www/certbot \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  "${DOMAIN_ARGS[@]}"

sed \
  -e "s/server_name example.com www.example.com;/server_name $SERVER_NAMES;/" \
  -e "s#/etc/letsencrypt/live/example.com/#/etc/letsencrypt/live/$DOMAIN/#g" \
  deploy/nginx/blog.https.conf.example > deploy/nginx/blog.conf
docker compose exec nginx nginx -s reload

echo "HTTPS is enabled for $SERVER_NAMES."
