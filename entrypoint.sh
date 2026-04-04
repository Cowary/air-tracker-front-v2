#!/bin/sh
set -e

BACKEND_URL="${BACKEND_URL:-}"

if [ -n "$BACKEND_URL" ]; then
  sed -i "s|BACKEND_URL:.*|BACKEND_URL: '${BACKEND_URL}'|" /app/dist/config.js
fi

echo "Serving on :${PORT:-80}, BACKEND_URL=${BACKEND_URL:-not set}"
exec npx serve -s /app/dist -l "${PORT:-80}"
