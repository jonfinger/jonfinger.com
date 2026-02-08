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

current_branch() {
  git rev-parse --abbrev-ref HEAD
}

ensure_not_default() {
  local branch="$1"
  local default="$2"
  if [[ "$branch" == "$default" ]]; then
    echo "Refusing to run on default branch: $default" >&2
    exit 1
  fi
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

usage() {
  echo "Usage:"
  echo "  $0 start <branch>"
  echo "  $0 sync \"<message>\""
  echo "  $0 pr"
}

require_gh

cmd="${1:-}"
case "$cmd" in
  start)
    branch="${2:-}"
    if [[ -z "$branch" ]]; then
      usage
      exit 1
    fi
    default="$(default_branch)"
    if [[ "$branch" == "$default" ]]; then
      echo "Branch cannot be default branch: $default" >&2
      exit 1
    fi

    git fetch origin "$default" >/dev/null 2>&1 || true
    if git show-ref --verify --quiet "refs/remotes/origin/$default"; then
      base_ref="origin/$default"
    else
      base_ref="$default"
    fi

    git checkout -B "$branch" "$base_ref"
    if [[ "$(git rev-list --count "$base_ref"..HEAD)" -eq 0 ]]; then
      git commit --allow-empty -m "chore: start PR"
    fi
    git push -u origin "$branch"
    ensure_pr
    ;;

  sync)
    msg="${2:-}"
    if [[ -z "$msg" ]]; then
      usage
      exit 1
    fi
    branch="$(current_branch)"
    if [[ "$branch" == "HEAD" ]]; then
      echo "Detached HEAD. Create a branch with '$0 start <branch>'." >&2
      exit 1
    fi
    default="$(default_branch)"
    ensure_not_default "$branch" "$default"

    git add -A
    if git diff --cached --quiet; then
      echo "No changes to commit."
    else
      git commit -m "$msg"
      git push
    fi
    ensure_pr
    ;;

  pr)
    branch="$(current_branch)"
    if [[ "$branch" == "HEAD" ]]; then
      echo "Detached HEAD. Create a branch with '$0 start <branch>'." >&2
      exit 1
    fi
    default="$(default_branch)"
    ensure_not_default "$branch" "$default"
    ensure_pr
    ;;

  *)
    usage
    exit 1
    ;;
esac
