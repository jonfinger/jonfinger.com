#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
SOURCE_TOKENS="${REPO_ROOT}/design-system/pixel-theme-tokens.css"
TARGETS_FILE="${REPO_ROOT}/design-system/style-sync-targets.txt"

if [[ ! -f "${SOURCE_TOKENS}" ]]; then
  echo "Missing source token file: ${SOURCE_TOKENS}" >&2
  exit 1
fi

if [[ ! -f "${TARGETS_FILE}" ]]; then
  echo "Missing sync target list: ${TARGETS_FILE}" >&2
  exit 1
fi

echo "Syncing style tokens from: ${SOURCE_TOKENS}"

while IFS= read -r line || [[ -n "${line}" ]]; do
  target="$(printf '%s' "${line}" | sed 's/[[:space:]]*$//')"

  if [[ -z "${target}" || "${target}" == \#* ]]; then
    continue
  fi

  if [[ "${target}" != /* ]]; then
    target="${REPO_ROOT}/${target}"
  fi

  mkdir -p "$(dirname "${target}")"
  cp "${SOURCE_TOKENS}" "${target}"
  echo "  -> ${target}"
done < "${TARGETS_FILE}"

token_hash="$(shasum -a 256 "${SOURCE_TOKENS}" | awk '{print $1}')"
echo "Done. Source token SHA256: ${token_hash}"
