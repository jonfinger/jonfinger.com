# Plan

## Goal
- Set up a PR-first, GitHub-only agent workflow with required files, scripts, and
  verification steps, then run the smoketest workflow.

## Non-goals
- No changes to application behavior or features outside workflow setup.
- No dependency upgrades or refactors.

## Acceptance criteria
- Required files are created/updated as specified in the task.
- Git hygiene ignores are added to `.gitignore` and `.cursorignore` as required.
- `scripts/task.sh` supports `start`, `sync`, and `pr` commands with GH checks.
- Optional worktree setup files exist and are executable.
- Smoketest uses GH auth, creates draft PR, syncs a tiny change, and PR reflects it.

## Proposed approach
- Review existing repo files and rules to align with requirements.
- Add or update policy docs, rules, templates, ignores, and scripts.
- Ensure executables and gitignore entries are correct.
- Run verification commands and record the PR URL.

## Step plan (small diffs)
- Step 1: Update policy docs and Cursor rules files.
- Step 2: Add PR template, plans template, and ignore updates.
- Step 3: Add `scripts/task.sh` and optional worktree setup files.
- Step 4: Run verification commands and smoketest.

## Verification
- `gh auth status`
- `chmod +x scripts/task.sh`
- `./scripts/task.sh start chore/cursor-pr-first-smoketest`
- `./scripts/task.sh sync "chore: pr-first smoketest"`

## Rollback plan
- Revert the commits for workflow setup files and delete the smoketest branch/PR.
