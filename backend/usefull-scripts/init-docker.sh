#! /bin/bash

SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
cd "$SCRIPT_DIR/.."

npx prisma generate --schema=./prisma/schema.prisma

npx prisma migrate reset --schema=./prisma/schema.prisma --force

npx prisma migrate deploy --schema=./prisma/schema.prisma

npx ts-node prisma/seed.ts
