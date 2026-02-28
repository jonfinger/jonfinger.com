# App Repo Map

Last updated: 2026-02-28

## Workspace Repos

- Site repo: `/Users/jaef/things/jonfinger.com`
- App repo: `/Users/jaef/things/useless-tools`

## App Inventory

1. Useless Tools
- Canonical source: `/Users/jaef/things/useless-tools/web/`
- Deployed copy inside site: `/Users/jaef/things/jonfinger.com/useless-tools/`
- Published output: `/Users/jaef/things/jonfinger.com/docs/useless-tools/` (generated)

## Branch Snapshot

1. `jonfinger.com`
- Current working branch: `codex/complete-visual-refresh-and-blog-update`
- Other local branch: `codex/useless-tools-ddr-redesign`
- Note: `codex/useless-tools-ddr-redesign` currently points to the same commit as `master`.

2. `useless-tools`
- Current working branch: `codex/ddr-picker-redesign`
- Base branch: `main`

## Source Of Truth Rules

1. Useless Tools app logic/UI
- Edit in `/Users/jaef/things/useless-tools/web/` first.

2. Sync app into site repo
- Script: `/Users/jaef/things/useless-tools/scripts/sync_to_jonfinger.sh`
- Default target: `/Users/jaef/things/jonfinger.com/useless-tools`

3. Render/deploy
- Run in site repo: `quarto render`
- Generated site artifacts land under `/Users/jaef/things/jonfinger.com/docs/`
