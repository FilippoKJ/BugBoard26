#!/bin/sh
set -eu

database_path="${DATABASE_PATH:-/data/bugboard.sqlite}"
database_directory="$(dirname "$database_path")"

if [ "$(id -u)" = "0" ]; then
  mkdir -p "$database_directory"
  chown -R node:node "$database_directory"
  exec su-exec node:node "$@"
fi

exec "$@"
