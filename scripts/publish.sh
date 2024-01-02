#!/bin/bash
set -e
export BOOTSTRAP_PATH=$(realpath "$0")
export WORKING_DIRECTORY=$(dirname $BOOTSTRAP_PATH)

export REF=$(git rev-parse HEAD)
echo ${REF:0:8}
if [[ `git status --porcelain` ]]; then
  echo "There are uncommited changes in this repo. Exiting."
  exit 1
else
  docker build . -t registry.digitalocean.com/fugue-state-registry/fugue-state-ui:${REF:0:8}
  docker push registry.digitalocean.com/fugue-state-registry/fugue-state-ui:${REF:0:8}
fi