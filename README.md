# jonfinger.com

Personal portfolio and blog built with Quarto.

## Local development

Prerequisites:
- Quarto (https://quarto.org/docs/get-started/)
- Python 3 (for the local static server)

Build the site:
- `quarto render`

Serve locally:
- `python -m http.server -d docs`

Optional live preview:
- `quarto preview`

## Deployment

The site is designed for GitHub Pages. The Quarto build outputs to `docs/` (see `_quarto.yml`).

To publish on GitHub Pages you can either:
- Configure GitHub Pages to use the `docs/` folder on the default branch, or
- Use a GitHub Actions workflow to build and deploy (recommended for automated builds).
