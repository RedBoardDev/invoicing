#! /bin/bash

SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
cd "$SCRIPT_DIR/.."

npx prisma migrate dev --schema=./prisma/schema.prisma --name $(uuidgen)
