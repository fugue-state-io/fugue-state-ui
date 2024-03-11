#!/bin/sh
set -e
./scripts/source_config.sh
npm run build
npm run start