#!/bin/sh
set -eu

if [ "$(id -u)" = "0" ]; then
  if [ -z "${DATABASE_URL:-}" ]; then
    database_path="${DATABASE_PATH:-/data/bugboard.sqlite}"
    database_directory="$(dirname "$database_path")"
    mkdir -p "$database_directory"
    chown -R node:node "$database_directory"
  fi
  exec su-exec node:node "$@"
fi

exec "$@"
