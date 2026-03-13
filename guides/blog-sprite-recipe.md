# Blog Sprite Recipe

Last updated: 2026-03-09

Use this when adding a new battle sprite to the blog index.

## Goal

- Keep Jon's sprite as the trainer-side sprite.
- Use a literal opponent sprite image, not a redraw.
- Remove the flat background so the foe sits directly in the battle scene.
- Keep filenames and front matter predictable.

## Files

- Blog listing template: `/Users/jaef/things/jonfinger.com/templates/blog-battle-listing.ejs.md`
- Battle card styles: `/Users/jaef/things/jonfinger.com/styles.css`
- Live foe sprites: `/Users/jaef/things/jonfinger.com/assets/img/blog-battles/`
- Post files: `/Users/jaef/things/jonfinger.com/posts/*.qmd`

## Naming

1. Put the original image somewhere outside the repo first.
2. Copy it into `assets/img/blog-battles/` as `source-<slug>.png`.
3. Generate the transparent in-repo version as `literal-<slug>.png`.
4. Point the post front matter at `literal-<slug>.png`, not the raw source file.

Example:

- `source-poodle.png`
- `literal-poodle.png`

## Post Front Matter

Each post card needs:

- `image`
- `image-alt`
- `battle-name`
- `battle-label`
- `battle-quote`

Example:

```yaml
image: ../assets/img/blog-battles/literal-poodle.png
image-alt: "Pixel sprite of a grayscale poodle wearing a bandana."
battle-name: "Scholar Poodle"
battle-label: "HYBRID BUILD"
battle-quote: "Together, they define how I work: observe carefully, model rigorously, explain simply, and ship responsibly."
```

## Background Removal

Use a flat-background sprite source whenever possible.

For white or light-gray backgrounds, this edge-connected Pillow recipe works well:

```bash
python3 - <<'PY'
from PIL import Image
from collections import deque
from pathlib import Path

src = Path("assets/img/blog-battles/source-example.png")
out = Path("assets/img/blog-battles/literal-example.png")
im = Image.open(src).convert("RGBA")
w, h = im.size
px = im.load()

def is_bg(r, g, b, a):
    return a and (max(r, g, b) - min(r, g, b) < 28) and ((r + g + b) / 3 > 200)

seen = [[False] * h for _ in range(w)]
q = deque()
for x in range(w):
    q.append((x, 0))
    q.append((x, h - 1))
for y in range(h):
    q.append((0, y))
    q.append((w - 1, y))

while q:
    x, y = q.popleft()
    if x < 0 or y < 0 or x >= w or y >= h or seen[x][y]:
        continue
    seen[x][y] = True
    r, g, b, a = px[x, y]
    if not is_bg(r, g, b, a):
        continue
    px[x, y] = (r, g, b, 0)
    q.append((x + 1, y))
    q.append((x - 1, y))
    q.append((x, y + 1))
    q.append((x, y - 1))

bbox = im.getchannel("A").getbbox()
if bbox:
    im = im.crop(bbox)
im.save(out)
PY
```

If the sprite has dark side bars or a non-uniform arena background, inspect the output before using it. Tune the threshold instead of redrawing the sprite.

## Verification

1. Run `quarto render blog.qmd`.
2. Confirm the card uses `literal-<slug>.png` in `docs/blog.html`.
3. Generate a preview thumbnail:

```bash
qlmanage -t -s 1600 -o /tmp /Users/jaef/things/jonfinger.com/docs/blog.html
```

4. Check:
- Jon reads larger and closer than the foe.
- The foe background is transparent.
- The quote fits in the lower dialog box.
- The sprite still looks like the source image.

## Cleanup Rule

After the card is approved:

- Keep `literal-<slug>.png`
- Remove any unused redraws or abandoned SVG experiments
- Remove `source-<slug>.png` from the repo if the original can live outside the repo
