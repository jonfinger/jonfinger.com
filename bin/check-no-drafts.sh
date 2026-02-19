#!/usr/bin/env bash
set -euo pipefail

err=0

# Guard 1: staged files must not include .drafts content.
if git diff --cached --name-only | grep -q '^\.drafts/'; then
  echo "Error: staged files include .drafts/ content."
  err=1
fi

# Guard 2: published posts cannot keep draft marker.
if grep -RIn '^draft:[[:space:]]*true[[:space:]]*$' posts/*.qmd >/dev/null 2>&1; then
  echo "Error: one or more files in posts/ still contain draft: true"
  grep -RIn '^draft:[[:space:]]*true[[:space:]]*$' posts/*.qmd || true
  err=1
fi

if [ "$err" -ne 0 ]; then
  exit 1
fi

echo "OK: no staged drafts and no draft markers in published posts."
