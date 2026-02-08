#!/usr/bin/env bash
set -euo pipefail

require_gh() {
  if ! command -v gh >/dev/null 2>&1; then
    echo "gh is required. Install GitHub CLI and authenticate." >&2
    exit 1
  fi
}

default_branch() {
  gh repo view --json defaultBranchRef --jq .defaultBranchRef.name 2>/dev/null || echo "main"
}

ensure_pr() {
  local url
  if ! url="$(gh pr view --json url --jq .url 2>/dev/null)"; then
    gh pr create --draft --fill >/dev/null
    url="$(gh pr view --json url --jq .url)"
  fi
  mkdir -p .cursor
  echo "$url" > .cursor/PR_URL
  echo "$url"
}

require_gh

default="$(default_branch)"
branch="$(git rev-parse --abbrev-ref HEAD)"

if [[ "$branch" == "HEAD" || "$branch" == "$default" ]]; then
  timestamp="$(date +%Y%m%d%H%M%S)"
  new_branch="cursor/agent-$timestamp"
  git fetch origin "$default" >/dev/null 2>&1 || true
  if git show-ref --verify --quiet "refs/remotes/origin/$default"; then
    base_ref="origin/$default"
  else
    base_ref="$default"
  fi
  git checkout -B "$new_branch" "$base_ref"
  branch="$new_branch"
fi

git push -u origin "$branch"
ensure_pr
