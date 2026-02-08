# Plan

## Goal
- Merge the two workflow PRs into one clean PR and close the extra one.

## Non-goals
- No product/content changes beyond workflow setup.
- No dependency or build pipeline changes.

## Acceptance criteria
- All required workflow files live on a single PR branch.
- The extra PR is closed and its branch removed.
- The remaining PR diff is tidy and reviewable.

## Proposed approach
- Compare `chore/cursor-rules` and `chore/cursor-pr-first-smoketest`.
- Cherry-pick missing commits into the smoketest branch.
- Remove smoketest-only noise if any.
- Close PR #1 and delete its branch.

## Step plan (small diffs)
- Step 1: Add this plan file and push.
- Step 2: Merge missing commits from the other branch.
- Step 3: Clean up PR diff if needed, then close extra PR/branch.

## Verification
- `gh pr view --json url --jq .url`
- `gh pr view --json files --jq '.files[].path'`

## Rollback plan
- Reset the branch to the previous commit or revert the merge commits.
