#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: bin/new-draft.sh \"Post title\""
  exit 1
fi

title="$*"
date_str="$(date +%F)"
slug="$(printf '%s' "$title" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//')"

if [ -z "$slug" ]; then
  slug="draft-post"
fi

mkdir -p posts/drafts
path="posts/drafts/${date_str}-${slug}.qmd"

if [ -e "$path" ]; then
  echo "Draft already exists: $path"
  exit 1
fi

cat > "$path" <<DRAFT
---
title: "$title"
date: $date_str
draft: true
description: "Draft post."
body-classes: page-post
---

## Idea

Write your idea here.

## Why it matters

- 

## Next steps

- 
DRAFT

echo "Created draft: $path"
