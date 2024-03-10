#!/bin/bash
set -e
docker build . --secret id=kube,src=$HOME/.kube/config --secret id=doctl,src=$HOME/.config/doctl/config.yaml  --progress=plain -t registry.digitalocean.com/fugue-state-registry/fugue-state-ui:local