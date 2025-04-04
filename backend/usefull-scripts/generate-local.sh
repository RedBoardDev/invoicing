#! /bin/bash

SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
cd "$SCRIPT_DIR/.."

npx prisma generate --schema=./prisma/schema.prisma
