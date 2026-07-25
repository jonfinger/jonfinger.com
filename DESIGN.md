---
version: 1
name: Jon Finger — Modern Game World
description: Dark voxel-dusk system with a phosphor signal accent; game metaphors in a contemporary skin.
colors:
  bg-0: "#0c0b16"
  bg-1: "#14131f"
  bg-2: "#1d1b2c"
  ink-strong: "#f5f4fa"
  ink-muted: "#c9c6da"
  ink-dim: "#918da8"
  signal: "#edff85"
  cool: "#97a8ff"
  danger: "#ff8f8f"
  ok: "#7fe6a3"
typography:
  display:
    fontFamily: "Chakra Petch"
    fontWeight: 600
    letterSpacing: "0em"
  body:
    fontFamily: "Atkinson Hyperlegible"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  pixel:
    fontFamily: "Press Start 2P"
    fontSize: "0.625rem"
rounded:
  sm: 2px
  md: 6px
  lg: 12px
spacing:
  base: 8
---

## Overview

A data scientist's personal site rebuilt as a modern turn-based game. The register is brand — design IS the product. Personality: playful, empirical, literary (see PRODUCT.md). The homepage plays like an RPG menu screen: trainer-card hero (stats, HP/EXP gauges, dialog box, command menu), then a "Side Quests" project rail and a "Battle Log" post rail you slide through. The rest of the site keeps the trainer-card and battle-card metaphors in a contemporary skin. Emotional target: delight + "what a simple, sharp site."

## Colors

Strategy: **committed dark**. Voxel-dusk indigo base (not the previous purple haze — cleaner, deeper), near-white ink, and one saturated signal accent carrying the identity.

- `bg-0 #0c0b16` page ground · `bg-1 #14131f` panels · `bg-2 #1d1b2c` raised surfaces
- `ink-strong #f5f4fa` headings/body emphasis · `ink-muted #c9c6da` body · `ink-dim #918da8` metadata (only on bg-0/bg-1; verify 4.5:1 wherever used)
- `signal #edff85` — arcade-phosphor yellow, evolved from the legacy `--accent-hot`. Primary buttons, active nav, key highlights. Text on signal fills is `bg-0`.
- `cool #97a8ff` — secondary accent for links/hover alternates and data-flavored details.
- `danger #ff8f8f` / `ok #7fe6a3` — HP-bar semantics, error/success.
- Page chrome stays quiet — sprites, gauges, and the signal accent carry the color.

## Typography

- **Display: Chakra Petch 500/600/700.** Squared terminals echo voxel geometry without being a pixel font. Headings, nav, stat labels. Letter-spacing ≥ −0.02em; display ceiling clamp() max 4.5rem.
- **Body: Atkinson Hyperlegible 400/700.** Hyper-readable humanist body — the accessibility-first choice is itself on-brand ("empirical over theory"). 1rem/1.65, measure capped at 70ch.
- **Pixel accent: Press Start 2P.** Micro-labels only (nameplates, HP, LV, kbd-style chips) at ≤ 0.7rem, always uppercase, never running text. This is the surviving artifact of the old identity — an accent, not the costume.
- Code: system mono stack (`ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`).
- Scale: 1rem → 1.333 → 1.777 → clamp(2.2rem, 5vw, 3.2rem) for page h1; `text-wrap: balance` on h1–h3.

## Layout

8px base rhythm with fluid `clamp()` section spacing that breathes on desktop. Content max-width 72rem (hero 64rem); prose measure 70ch. The homepage stacks three acts — hero, project rail, battle-log rail — with horizontal scroll-snap rails for the cards; interior pages use asymmetric two-column compositions collapsing at 900px. Breakpoints: 1024 / 900 / 760 (existing convention), plus 700 for hero stacking.

## Elevation & Depth

The chunky 4px pixel-offset shadows are retired. Depth now comes from: (1) layered translucent panels over `bg-0`, (2) 1px crisp hairline borders (`rgba(245,244,250,0.14)`), (3) soft large-radius shadows for floating elements, (4) a faint signal-tinted glow reserved for interactive focus/hover.

## Shapes

Crisp and voxel-adjacent: radius 2px on chips/tags, 6px on cards/panels, 12px on the outro trainer card. No pills, no full-round avatars. HP bars are sharp rectangles with 2px radius.

## Components

- **Navbar**: translucent blur `bg-0` with a signal scroll-progress line; active link marked with a signal underline bar.
- **Trainer card (home hero + about)**: modern stat sheet — Chakra Petch labels, Atkinson values, Press Start 2P micro-tags; animated HP/EXP gauge fills; sprite rendered crisp with a soft platform glow and a subtle idle bob.
- **Dialog box + command menu (home hero)**: RPG text box with a typewriter line and advance cursor; FF-style command grid (Connect / Projects / Battle Log / Trainer Info) with a ▶ hover cursor.
- **Card rails (home)**: horizontal scroll-snap rows with prev/next buttons; next card peeks at the edge as the slide affordance.
- **Battle card (blog listing)**: keeps composition (arena tag, foe sprite, trainer sprite, HP bars, quote box) — restyled with hairline borders, layered dusk panels, smooth hover lift + sprite parallax (transform/opacity only, 200ms ease-out-quart).
- **Buttons**: primary = signal fill with bg-0 text; secondary = hairline outline with ink-strong text; both with 2px radius and focus-visible ring in `cool`.
- **Tags/chips**: hairline border, ink-dim text, 2px radius.
- **Post prose**: Quarto title block styled into a "quest log" header (title, date, description) — no hand-duplicated titles.

## Do's and Don'ts

- DO keep game metaphors structural (stats, HP, party, routes) and their execution modern.
- DO drive all motion with transform/opacity; 150–300ms micro-interactions, ease-out-quart; every animation has a reduced-motion alternative.
- DO keep the homepage simple: three acts, one column, sliding card rails; page chrome stays quiet.
- DON'T reintroduce scanline overlays, chunky offset borders, or `image-rendering: pixelated` on layout chrome (sprites themselves stay pixelated — that's content).
- DON'T use gradient text, side-stripe borders, glassmorphism-by-default, or identical icon-card grids.
- DON'T set body text below 4.5:1 contrast, and never gate content visibility behind a scroll-triggered class.
