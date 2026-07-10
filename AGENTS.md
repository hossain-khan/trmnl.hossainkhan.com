# Repository Guidelines

## Project Structure & Module Organization
This repository is a no-build static site for `trmnl.hossainkhan.com`. Main entry points live at the root: `index.html`, `style.css`, `script.js`, `sw.js`, and site assets such as `favicon.svg` and Open Graph images. Content data lives in [`data/recipes.json`](/Users/hossain/dev/repos/static-websites/trmnl.hossainkhan.com/data/recipes.json). Repository docs are in `README.md` and `PRD.md`. Deployment and automation workflows are under `.github/workflows/`.

## Build, Test, and Development Commands
There is no build step or package manager in this repo.

- `python3 -m http.server 8080`
  Starts a local static server for manual testing at `http://localhost:8080`.
- `python3 -m json.tool data/recipes.json`
  Validates and pretty-prints the recipe dataset before committing data changes.
- `git status`
  Confirms the working tree only includes intended edits before opening a PR.

## Coding Style & Naming Conventions
Use plain HTML, CSS, and vanilla JavaScript only. Follow the existing style in [`script.js`](/Users/hossain/dev/repos/static-websites/trmnl.hossainkhan.com/script.js): single quotes, semicolons, and defensive DOM/data handling. Keep indentation consistent with the file you are editing; current source uses two spaces in markup/CSS and two to four spaces in JS blocks. Prefer descriptive, kebab-case file names (`og-image-gen.webp`) and camelCase for JavaScript identifiers.

## Testing Guidelines
This project has no automated test suite yet; contributors should do focused manual verification. Test locally in a browser, confirm `data/recipes.json` loads correctly, category filtering works, theme toggle persists, and broken image/data states fail gracefully. Re-check responsive behavior on narrow and wide viewports.

## Commit & Pull Request Guidelines
Recent history follows short conventional-style messages such as `feat: ...`, `harden: ...`, `polish: ...`, and `chore: ...`. Keep commits scoped and imperative. PRs should include a clear summary, note any data-source or workflow changes, and attach screenshots or a short screen capture for UI changes. Link the related issue when one exists.

## Deployment & Data Notes
GitHub Pages deploys automatically from `main` via `.github/workflows/deploy.yml`. Recipe data is refreshed weekly by `.github/workflows/sync-recipes.yml`; avoid hand-editing generated fields unless you also update the sync logic.
