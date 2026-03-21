# PRD: TRMNL Plugin Portfolio — trmnl.hossainkhan.com

## Overview

A static portfolio website showcasing all TRMNL e-ink display plugins built by Hossain Khan. The site serves as a public-facing gallery and landing page for the author's 8 published TRMNL recipes, providing visitors with plugin descriptions, screenshots, stats, and links to source code and install pages.

**Target URL:** `https://trmnl.hossainkhan.com`  
**Hosting:** Static site (GitHub Pages or similar)  
**Data source:** `data/recipes.json` (8 plugins, fetched from TRMNL API)

---

## Goals

1. **Showcase** — Present all TRMNL plugins in a visually appealing, browsable gallery
2. **Drive adoption** — Make it easy for visitors to install/fork recipes or view source code
3. **Establish credibility** — Display aggregate stats (total installs, forks) and per-plugin metrics
4. **Low maintenance** — Static HTML/CSS/JS with no build pipeline or server required; data sourced from a single JSON file

---

## Audience

- TRMNL device owners looking for plugins to install
- Developers exploring plugin ideas or looking for open-source examples
- General visitors curious about the author's work

---

## Data Model (from `recipes.json`)

Each plugin exposes:

| Field | Source | Usage |
|-------|--------|-------|
| `name` | `data[].name` | Card title |
| `description` | `data[].author_bio.description` | Card body (HTML, needs sanitization/rendering) |
| `category` | `data[].author_bio.category` | Category tags (comma-separated: e.g. `"life,personal"`) |
| `icon_url` | `data[].icon_url` | Plugin icon/logo |
| `screenshot_url` | `data[].screenshot_url` | E-ink screenshot preview |
| `github_url` | `data[].author_bio.github_url` | Link to source repo |
| `learn_more_url` | `data[].author_bio.learn_more_url` | Link to plugin documentation site |
| `published_at` | `data[].published_at` | Publish date (for sorting/display) |
| `stats.installs` | `data[].stats.installs` | Install count |
| `stats.forks` | `data[].stats.forks` | Fork count |
| `id` | `data[].id` | TRMNL recipe ID (for install link: `https://trmnl.com/recipes/{id}`) |

### Plugin Inventory (8 total)

| # | Name | Categories | Installs | Forks | Published |
|---|------|-----------|----------|-------|-----------|
| 1 | Islamic Prayer Times | life, personal | 5 | 15 | 2026-02-19 |
| 2 | GO Transit Schedule | travel, life | 0 | 11 | 2026-02-18 |
| 3 | Kung Fu Panda Quotes | entertainment, humor | 10 | 19 | 2026-02-09 |
| 4 | Google Photos Canvas | images, personal | 0 | 56 | 2026-01-26 |
| 5 | Google Photos | images, personal | 1 | 106 | 2026-01-21 |
| 6 | Element of the Day | education, discovery | 11 | 56 | 2026-01-17 |
| 7 | Max Payne Quotes | entertainment, games | 28 | 1 | 2026-01-16 |
| 8 | Durham Waste Collection | life, environment | 10 | 6 | 2025-12-18 |

**Aggregate:** 65 installs, 270 forks across 8 plugins

---

## Site Structure

### Single-page layout

```
┌─────────────────────────────────────────────┐
│  Header / Hero                              │
│  - Site title: "TRMNL Plugins by Hossain"   │
│  - Brief tagline                            │
│  - Aggregate stats (8 plugins, 65 installs, │
│    270 forks)                               │
├─────────────────────────────────────────────┤
│  Category Filter Bar (optional)             │
│  [All] [Life] [Entertainment] [Images] ...  │
├─────────────────────────────────────────────┤
│  Plugin Grid                                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │  Card 1  │ │  Card 2  │ │  Card 3  │    │
│  │ icon     │ │ icon     │ │ icon     │    │
│  │ name     │ │ name     │ │ name     │    │
│  │ desc     │ │ desc     │ │ desc     │    │
│  │ tags     │ │ tags     │ │ tags     │    │
│  │ stats    │ │ stats    │ │ stats    │    │
│  │ actions  │ │ actions  │ │ actions  │    │
│  └──────────┘ └──────────┘ └──────────┘    │
│  ... (repeat for all 8 plugins)             │
├─────────────────────────────────────────────┤
│  Footer                                     │
│  - Author info, GitHub link, contact        │
│  - "Powered by TRMNL" attribution           │
└─────────────────────────────────────────────┘
```

---

## Page Sections

### 1. Hero / Header

- Site title (e.g. "My TRMNL Plugins")
- Short tagline describing the author's work (e.g. "Open-source plugins for the TRMNL e-ink display")
- Summary stats badge row: **8 plugins** · **65 installs** · **270 forks**
- Link to TRMNL platform: `https://trmnl.com`

### 2. Category Filter Bar

Unique categories extracted from all plugins:
- `all` (default)
- `life` (3 plugins)
- `personal` (3 plugins)
- `entertainment` (2 plugins)
- `images` (2 plugins)
- `education` (1 plugin)
- `travel` (1 plugin)
- `humor` (1 plugin)
- `games` (1 plugin)
- `discovery` (1 plugin)
- `environment` (1 plugin)

Clicking a category filters the grid. "All" shows everything. Simple JS toggle — no routing needed.

### 3. Plugin Card

Each card displays:

- **Icon** — from `icon_url` (small, top-left or top-center)
- **Screenshot** — from `screenshot_url` (main visual, e-ink preview image)
- **Name** — plugin title
- **Description** — plain-text summary extracted from `author_bio.description` (strip HTML tags for card view; keep it to ~2 lines with truncation)
- **Category tags** — rendered as pill badges
- **Stats** — installs count + forks count (with small icons)
- **Published date** — relative or formatted (e.g. "Jan 2026")
- **Action links:**
  - "Install" → `https://trmnl.com/recipes/{id}` (opens TRMNL recipe page)
  - "GitHub" → `author_bio.github_url`
  - "Learn More" → `author_bio.learn_more_url` (if present)

### 4. Footer

- Author name and email (`trmnl@hossain.dev`)
- GitHub profile link
- "Built for TRMNL" with link to `https://trmnl.com`
- Copyright / year

---

## Technical Requirements

### Stack

| Concern | Choice | Rationale |
|---------|--------|-----------|
| Markup | Single `index.html` | Simplest deployment; no build step |
| Styling | Inline `<style>` or single CSS file | No dependencies |
| Data | `data/recipes.json` loaded via `fetch()` at runtime, or inlined at build time | Keeps content updatable |
| Interactivity | Vanilla JS | Category filtering, no framework needed |
| Hosting | GitHub Pages | Free, static, custom domain support |
| Images | Loaded directly from TRMNL S3 URLs | No need to self-host; images are public |

### Constraints

- **No build tools** — no Node.js, no bundler, no SSG. Pure HTML/CSS/JS.
- **No external JS frameworks** — vanilla JavaScript only
- **CSS-only external dependency allowed** — a single font import (e.g. Google Fonts) is acceptable
- **Responsive** — must work on mobile, tablet, and desktop
- **Accessible** — semantic HTML, proper alt text, keyboard-navigable cards
- **Fast** — target < 1s first contentful paint on broadband; lazy-load screenshot images

### Data Loading Strategy

Two options (decide during implementation):

1. **Runtime fetch** — `index.html` fetches `data/recipes.json` at page load and renders cards dynamically via JS. Simpler to update (just replace the JSON file).
2. **Inline/pre-rendered** — HTML is generated from JSON at development time. Faster initial render, better SEO, but requires regeneration when data changes.

**Recommendation:** Option 1 (runtime fetch) for simplicity, since the dataset is small (8 items) and the site is a personal portfolio.

---

## Design Direction

- Clean, minimal aesthetic — let the e-ink screenshots be the visual focus
- Light background with subtle card shadows/borders
- Monochrome-friendly palette (nodding to e-ink aesthetic) with selective accent color
- Grid layout: 3 columns on desktop, 2 on tablet, 1 on mobile
- Cards should feel tactile — subtle hover states, clear visual hierarchy

---

## File Structure

```
trmnl.hossainkhan.com/
├── index.html          # Main page
├── style.css           # Styles (or inline in HTML)
├── script.js           # JS for data loading + filtering (or inline)
├── data/
│   └── recipes.json    # Plugin data source
├── PRD.md              # This document
└── README.md           # Repo readme (optional)
```

---

## Out of Scope (for v1)

- Individual plugin detail pages (single page is sufficient for 8 plugins)
- Search functionality (category filter is enough)
- Dark mode toggle
- Analytics / tracking
- Contact form
- Blog or changelog
- Automated data refresh from TRMNL API (manual JSON update is fine)
- Build pipeline / SSG (keep it pure static)

---

## Future Considerations (v2+)

- Auto-fetch latest recipe data via TRMNL API or GitHub Action
- Individual plugin detail pages with full description rendering
- Sort by installs, forks, or date
- Dark mode
- Open Graph / social meta tags for link previews
- RSS feed of new plugins

---

## Success Criteria

- All 8 plugins rendered correctly from `recipes.json` data
- Each card links to the correct TRMNL recipe, GitHub repo, and docs page
- Category filtering works
- Page is responsive and usable on mobile
- Page loads in under 2 seconds on a standard connection
- Deployed and accessible at `trmnl.hossainkhan.com`
