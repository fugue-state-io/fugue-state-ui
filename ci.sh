#!/bin/bash
export BOOTSTRAP_PATH=$(realpath "$0")
export WORKING_DIRECTORY=$(dirname $BOOTSTRAP_PATH)

export REF=$(git rev-parse HEAD)
echo ${REF:0:8}

docker build . -t $REGISTRY:${REF:0:8}
docker push $REGISTRY:${REF:0:8}