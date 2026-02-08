# AGENTS.md — PR-First Contract (GitHub-only)

You are an agent working in this repo inside :contentReference[oaicite:0]{index=0}. The PR is the artifact: I will review the **PR diff**, not individual commits.

## Non-negotiable rules
1) **Never commit to the default branch** (main/master). Always work on a feature branch.
2) **A draft PR must exist for your branch** as early as possible (create immediately if missing).
3) **Keep the PR continuously updated**:
   - After every small step, **commit + push** so the PR diff reflects progress.
4) **Small diffs only**:
   - Aim for ≤ 1–3 files or ≤ ~150 lines changed per step.
   - If a step will exceed that, stop and ask first.
5) **No surprise refactors**:
   - Preserve behavior unless explicitly approved in `PLANS.md`.
   - Avoid unrelated cleanup.

## Plan-first (required)
Before editing code:
- Create or update `PLANS.md` with:
  - Goal (1–2 sentences)
  - Non-goals
  - Acceptance criteria (testable)
  - Proposed approach (bullets)
  - Step plan split into PR-reviewable chunks
  - Verification commands (build/test/lint)
  - Rollback plan
Then STOP and ask for approval. Do not edit code until I say **"Execute"**.

## Execution loop (required)
When implementing:
- Do **one step at a time** from `PLANS.md`.
- After each step:
  1) Run the fastest verification commands available (or provide them for me to run)
  2) **Commit + push** (so PR updates)
  3) Summarize: what changed, how to verify, and what to review in the PR

## Branch naming
Use one of:
- `feature/<slug>`
- `refactor/<slug>`
- `fix/<slug>`
- `chore/<slug>`
Slug is short, kebab-case, descriptive.

## PR rules (GitHub)
- PR should be **draft** until acceptance criteria are met.
- PR description should be the living spec (prefer mirroring `PLANS.md`):
  - Goal, acceptance criteria, checklist, verification steps
- Assume we will **squash merge** at the end; commit history doesn’t need to be pretty.

## Commands to keep PR updated
### Preferred (if present)
- `./scripts/task.sh sync "<message>"`  ← commit + push (+ optionally update PR body)

### Manual fallback
- `git status`
- `git add -A`
- `git commit -m "<message>"`
- `git push -u origin <branch>`

## Ensure a PR exists (GitHub CLI)
- Create a draft PR (if missing):
  - `gh pr create --draft --fill`
- Get PR URL:
  - `gh pr view --json url --jq .url`
- Save PR URL for reference:
  - write it to `.cursor/PR_URL` and paste it in chat

## Clarifying questions policy
Ask at most **3** questions total, only if the answers materially change the plan/implementation.
Otherwise make a reasonable assumption and label it.

## Stop conditions (ask first)
STOP and ask me before:
- changing deployment/build pipeline
- changing routes/URLs/public interfaces
- adding new dependencies
- large renames/mass formatting
- changes that are hard to revert

## What to report after each step
Reply with:
- PR URL
- What changed (bullets)
- How to verify (commands)
- What I should review in the PR (bullets)
