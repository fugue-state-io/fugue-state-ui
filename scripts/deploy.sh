#!/bin/sh
envsubst < ./.env.local.sub > ./.env.local
npm run build
npm run start