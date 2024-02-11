#!/bin/bash
export TF_VAR_do_cdn_spaces_access_id="$(kubectl get secret -n ci ci-ui-secrets -o json | jq -r '.data | map_values(@base64d) | ."FUGUE_STATE_CDN_ACCESS_ID"')"
export TF_VAR_do_cdn_spaces_secret_key="$(kubectl get secret -n ci ci-ui-secrets -o json | jq -r '.data | map_values(@base64d) | ."FUGUE_STATE_CDN_SECRET_KEY"')"
export TF_VAR_nextauth_secret="$(kubectl get secret -n ci ci-ui-secrets -o json | jq -r '.data | map_values(@base64d) | ."NEXTAUTH_SECRET"')"
export TF_VAR_nextauth_url="$(kubectl get secret -n ci ci-ui-secrets -o json | jq -r '.data | map_values(@base64d) | ."NEXTAUTH_URL"')"
export TF_VAR_keycloak_secret="$(kubectl get secret -n ci ci-ui-secrets -o json | jq -r '.data | map_values(@base64d) | ."KEYCLOAK_SECRET"')"
export TF_VAR_keycloak_issuer="$(kubectl get secret -n ci ci-ui-secrets -o json | jq -r '.data | map_values(@base64d) | ."KEYCLOAK_ISSUER"')"
export TF_VAR_keycloak_id="$(kubectl get secret -n ci ci-ui-secrets -o json | jq -r '.data | map_values(@base64d) | ."KEYCLOAK_ID"')"
export TF_VAR_fugue_state_bucket="$(kubectl get secret -n ci ci-ui-secrets -o json | jq -r '.data | map_values(@base64d) | ."FUGUE_STATE_BUCKET"')"

envsubst < ./.env.local.sub > ./.env.local