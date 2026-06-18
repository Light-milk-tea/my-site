#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/../.."

docker compose --profile certbot run --rm certbot renew --webroot --webroot-path /var/www/certbot
docker compose exec nginx nginx -s reload

echo "Certificate renewal check finished."
