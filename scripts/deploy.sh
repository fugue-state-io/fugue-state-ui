#!/bin/sh
set -e
envsubst < ./.env.local.sub > ./.env.local
npm run build
npm run start