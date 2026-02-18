# Codex AGENTS.md Best Practices (PR-first Workflow)

**Purpose**
- AGENTS.md is the agent briefing that defines how to build, test, and structure the project, which conventions to follow, how to format PRs, and what operations are allowed.

**Layering and Overrides**
- Use global `~/.codex/AGENTS.md` for defaults, a repo-root `AGENTS.md` for project rules, and optional subdirectory `AGENTS.md` files for package-specific instructions.
- Use `AGENTS.override.md` when a submodule needs different guidance.
- Remember that deeper files override earlier ones from root to current working directory.

**Concise and Actionable**
- Keep the file short (target ~150 lines) and use headings with flat bullet lists.
- Use exact commands in backticks with real flags and paths; include single-file or targeted variants.
- Update AGENTS.md alongside code changes; link to existing docs instead of duplicating long content.

**Request Precision**
- Be explicit about the task goal, which files can be edited, and the success criteria.

**Build, Test, Verification**
- Document install, lint, type-check, build, and test commands in the order to run them.
- Match local instructions to CI gates and require green results before PRs.
- Encourage test-first for fixes and features.

**Project Structure and Standards**
- Point to entry points, key directories, data flow, and subsystem locations.
- Specify languages/versions, preferred patterns, and do/don't lists with rationale.
- Link to good and bad example files to reduce drift.

**Design System and APIs**
- Link to design tokens/components and API docs or clients used by the project.

**Safety and Permissions**
- Clearly list what can be done without asking and what requires confirmation (installs, deletions, full builds, pushes).
- Protect sensitive directories and forbid secrets or `.env` edits; never disable tests to pass CI.

**PR Checklist and Review Rubric**
- Define “ready for review” (up-to-date branch, tests/lint/type-check pass, focused diff).
- Require meaningful PR descriptions: what changed, why, how to test, and risks.
- Add self-review questions (scope, formatting noise, public API docs, tests, errors, perf/security impact).
- Use draft PRs until the checklist is satisfied.

**Planning and Incremental Work**
- If uncertain, ask clarifying questions or propose a short plan before editing.
- Prefer small, atomic tasks with explicit acceptance criteria.

**Monorepos**
- Add per-package `AGENTS.md` files for localized rules when stacks or versions differ.

**Maintenance**
- Keep a single source of truth and update instructions when tooling changes.
- Require objective evidence (tests, lint, type checks, clean diff) before merging.

**Skeleton Template (Example)**
```md
# Build & Test
- Install dependencies: `...`
- Lint: `...`
- Type check: `...`
- Unit tests: `...`
- Single test: `...`

# Architecture Overview
- Entry point: `...`
- Key modules: `...`

# Conventions & Patterns
- Language/version: `...`
- Do: `...`
- Don’t: `...`

# Safety & Permissions
- Allowed: `...`
- Ask before: `...`
- Never edit: `...`

# Git Workflow
- Branching rules: `...`
- Commit message format: `...`

# PR Checklist
- Tests/lint/type-check pass
- PR description includes what/why/how/risk
- Diff is focused

# When Stuck
- Ask questions or propose a short plan
```

**Source**
- Derived from `Codex PR-first Workflow.pdf`.
