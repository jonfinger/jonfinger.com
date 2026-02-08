# Plan: <short title>

## Goal
- <1–2 sentences describing the outcome>

## Non-goals
- <explicitly list what is out of scope>

## Acceptance criteria (testable)
- [ ] <criterion 1>
- [ ] <criterion 2>

## Step plan (small diffs)
> Rule: Each step should be small and reviewable (≤ 1–3 files or ~150 lines).

1) Step 1 — <tiny step title>
   - Files:
     - `<file1>`
   - Changes:
     - <bullet list>
   - Verification:
     - `<command>`
   - PR update:
     - `./scripts/task.sh sync "<message>"`

2) Step 2 — <tiny step title>
   - Files:
     - `<file1>`
   - Changes:
     - <bullet list>
   - Verification:
     - `<command>`
   - PR update:
     - `./scripts/task.sh sync "<message>"`

## Verification checklist (final)
- [ ] Build passes: `<command>`
- [ ] Lint/format passes: `<command>`
- [ ] Tests pass: `<command>`
- [ ] Manual checks: <what to click/observe>

## Rollback plan
- Revert the PR (or `git revert <sha>` if already merged).
- Restore prior behavior by undoing:
  - <key file changes>
- Confirm rollback with:
  - `<command>`
