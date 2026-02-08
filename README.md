# jonfinger.com

A polished portfolio and blog, built with Quarto.
Practical, sharp, and a little theatrical.

## Local development

Prerequisites:
- Quarto (https://quarto.org/docs/get-started/)
- Python 3 (for a simple static server)

Build the site:
- `quarto render`

Serve locally:
- `python -m http.server -d docs`

Optional live preview:
- `quarto preview`

## Deployment

The site is designed for GitHub Pages. The Quarto build outputs to `docs/` (see `_quarto.yml`).

To publish on GitHub Pages:
- Use the GitHub Actions workflow in `.github/workflows/quarto-pages.yml` (recommended), or
- Configure GitHub Pages to serve the `docs/` folder on the default branch.

## Tone

Simple on the surface. A touch of gothic circus beneath the lights.
