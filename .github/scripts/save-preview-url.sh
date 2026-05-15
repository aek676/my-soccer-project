#!/bin/bash
set -e

PREVIEW_URL="$1"
GITHUB_TOKEN="$2"
FILE="${3:-testE2E/.env.preview}"
BRANCH="${4:-${GITHUB_HEAD_REF:-main}}"
REPO="$GITHUB_REPOSITORY"

CONTENT="BASE_URL=${PREVIEW_URL}"
ENCODED=$(echo -n "$CONTENT" | base64)

SHA=$(curl -s -H "Authorization: Bearer ${GITHUB_TOKEN}" \
  "https://api.github.com/repos/${REPO}/contents/${FILE}?ref=${BRANCH}" | jq -r '.sha // empty')

if [ -z "$SHA" ]; then
  curl -X POST -H "Authorization: Bearer ${GITHUB_TOKEN}" \
    -H "Accept: application/vnd.github+json" \
    "https://api.github.com/repos/${REPO}/contents/${FILE}" \
    -d "{\"message\":\"[skip ci] Update preview URL\",\"content\":\"${ENCODED}\",\"branch\":\"${BRANCH}\"}"
else
  curl -X PUT -H "Authorization: Bearer ${GITHUB_TOKEN}" \
    -H "Accept: application/vnd.github+json" \
    "https://api.github.com/repos/${REPO}/contents/${FILE}" \
    -d "{\"message\":\"[skip ci] Update preview URL\",\"content\":\"${ENCODED}\",\"sha\":\"${SHA}\",\"branch\":\"${BRANCH}\"}"
fi
