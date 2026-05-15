#!/bin/bash
set -e

GITHUB_TOKEN="$1"
BRANCH="${2:-${GITHUB_HEAD_REF:-main}}"
REPO="$GITHUB_REPOSITORY"
FILE="testE2E/.env.preview"

RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer ${GITHUB_TOKEN}" \
  "https://api.github.com/repos/${REPO}/contents/${FILE}?ref=${BRANCH}")

if [ "$RESPONSE" != "200" ]; then
  echo "Error: .env.preview not found on branch ${BRANCH}. Run ionic-app preview first." >&2
  exit 1
fi

CONTENT=$(curl -s \
  -H "Authorization: Bearer ${GITHUB_TOKEN}" \
  "https://api.github.com/repos/${REPO}/contents/${FILE}?ref=${BRANCH}" \
  | jq -r '.content' | base64 -d)

eval "$CONTENT"
echo "BASE_URL=${BASE_URL}" >> "$GITHUB_ENV"
