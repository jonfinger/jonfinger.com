#!/usr/bin/env bash
set -euo pipefail

if [ ! -d .drafts ]; then
  echo "No drafts directory found (.drafts)."
  exit 0
fi

shopt -s nullglob
drafts=(.drafts/*.qmd)

if [ ${#drafts[@]} -eq 0 ]; then
  echo "No drafts found."
  exit 0
fi

printf '%s\n' "${drafts[@]}"
