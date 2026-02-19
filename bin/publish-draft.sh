#!/usr/bin/env bash
set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Usage: bin/publish-draft.sh .drafts/YYYY-MM-DD-slug.qmd"
  exit 1
fi

src="$1"

if [ ! -f "$src" ]; then
  echo "Draft not found: $src"
  exit 1
fi

case "$src" in
  .drafts/*.qmd) ;;
  *)
    echo "Draft must be inside .drafts/"
    exit 1
    ;;
esac

dest="posts/$(basename "$src")"

if [ -e "$dest" ]; then
  echo "A published post already exists at: $dest"
  exit 1
fi

tmp_file="$(mktemp)"
# Remove a draft marker when publishing.
sed -E '/^draft:[[:space:]]*true[[:space:]]*$/d' "$src" > "$tmp_file"
mv "$tmp_file" "$src"
mv "$src" "$dest"

echo "Published post: $dest"
