#!/bin/sh
set -euo pipefail
echo "[entrypoint] Applying migrations"
pnpm drizzle-kit push || true 
exec "$@"
