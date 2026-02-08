---
description: Enforce branch-only, PR-first workflow
alwaysApply: true
---

# PR First

Always work PR-first:
- Never commit to the default branch (main/master). Use a feature branch.
- Ensure a draft PR exists as early as possible.
  - Create: `gh pr create --draft --fill`
  - URL: `gh pr view --json url --jq .url`
- After each step, commit and push so the PR diff reflects progress.
- Save the PR URL to `.cursor/PR_URL` and include it in updates.
