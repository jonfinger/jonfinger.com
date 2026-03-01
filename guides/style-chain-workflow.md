# Style Chain Workflow

This workflow keeps the main site and app surfaces visually aligned.

## Source Files

1. Shared token source
- `/Users/jaef/things/jonfinger.com/design-system/pixel-theme-tokens.css`

2. Sync target list
- `/Users/jaef/things/jonfinger.com/design-system/style-sync-targets.txt`

3. Sync script
- `/Users/jaef/things/jonfinger.com/scripts/sync-style-tokens.sh`

## Standard Update Flow

1. Edit shared tokens in `design-system/pixel-theme-tokens.css`.
2. Sync shared style tokens:

```bash
cd /Users/jaef/things/jonfinger.com
./scripts/sync-style-tokens.sh
```

3. If `useless-tools` app styles were changed in its source repo, sync app files:

```bash
cd /Users/jaef/things/useless-tools
./scripts/sync_to_jonfinger.sh
```

4. Re-render site:

```bash
cd /Users/jaef/things/jonfinger.com
quarto render
```

## Adding Future Projects To Chain Sync

1. Add the target token file path to:
- `/Users/jaef/things/jonfinger.com/design-system/style-sync-targets.txt`

2. In that project CSS, import its local token file first:

```css
@import url("./theme-tokens.css");
```

3. Keep project-specific layout/component rules in the project stylesheet; keep palette/typography tokens in the shared token file.
