#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
USELESS_TOOLS_SYNC="/Users/jaef/things/useless-tools/scripts/sync_to_jonfinger.sh"

echo "[1/3] Syncing shared style tokens"
"${REPO_ROOT}/scripts/sync-style-tokens.sh"

echo "[2/3] Syncing useless-tools app into site repo"
if [[ -x "${USELESS_TOOLS_SYNC}" ]]; then
  "${USELESS_TOOLS_SYNC}"
else
  echo "Skipped: missing sync script at ${USELESS_TOOLS_SYNC}" >&2
fi

echo "[3/3] Rendering Quarto site"
cd "${REPO_ROOT}"
quarto render

echo "Style-chain test complete."
