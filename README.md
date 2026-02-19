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

## Draft post workflow

Create a draft:
- `bin/new-draft.sh "Your post title"`

Drafts are saved in `posts/drafts/` and are not listed on the public blog.

Preview a draft locally:
- `quarto preview posts/drafts/YYYY-MM-DD-your-post-title.qmd`

Publish a draft:
- `bin/publish-draft.sh posts/drafts/YYYY-MM-DD-your-post-title.qmd`

The publish script moves the file into `posts/` and removes `draft: true`.

## Deployment

The site is designed for GitHub Pages. The Quarto build outputs to `docs/` (see `_quarto.yml`).

To publish on GitHub Pages:
- Use the GitHub Actions workflow in `.github/workflows/quarto-pages.yml` (recommended), or
- Configure GitHub Pages to serve the `docs/` folder on the default branch.

## Tone

Simple on the surface. A touch of gothic circus beneath the lights.
