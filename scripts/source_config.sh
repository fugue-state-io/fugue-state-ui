#!/bin/sh
export TF_VAR_do_cdn_spaces_access_id="$(kubectl get secret -n ui fugue-state-ui-secrets -o json | jq -r '.data | map_values(@base64d) | ."TF_VAR_do_cdn_spaces_access_id"')"
export TF_VAR_do_cdn_spaces_secret_key="$(kubectl get secret -n ui fugue-state-ui-secrets -o json | jq -r '.data | map_values(@base64d) | ."TF_VAR_do_cdn_spaces_secret_key"')"
export TF_VAR_nextauth_url="$(kubectl get secret -n ui fugue-state-ui-secrets -o json | jq -r '.data | map_values(@base64d) | ."TF_VAR_nextauth_url"')"
export TF_VAR_nextauth_secret="$(kubectl get secret -n ui fugue-state-ui-secrets -o json | jq -r '.data | map_values(@base64d) | ."TF_VAR_nextauth_secret"')"
export TF_VAR_nextauth_url="$(kubectl get secret -n ui fugue-state-ui-secrets -o json | jq -r '.data | map_values(@base64d) | ."TF_VAR_nextauth_url"')"
export TF_VAR_keycloak_secret="$(kubectl get secret -n ui fugue-state-ui-secrets -o json | jq -r '.data | map_values(@base64d) | ."TF_VAR_keycloak_secret"')"
export TF_VAR_keycloak_issuer="$(kubectl get secret -n ui fugue-state-ui-secrets -o json | jq -r '.data | map_values(@base64d) | ."TF_VAR_keycloak_issuer"')"
export TF_VAR_keycloak_id="$(kubectl get secret -n ui fugue-state-ui-secrets -o json | jq -r '.data | map_values(@base64d) | ."TF_VAR_keycloak_id"')"
export TF_VAR_fugue_state_bucket="$(kubectl get secret -n ui fugue-state-ui-secrets -o json | jq -r '.data | map_values(@base64d) | ."TF_VAR_fugue_state_bucket"')"
envsubst < ./.env.local.sub > ./.env.local