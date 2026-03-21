# trmnl.hossainkhan.com

Static portfolio showcasing open-source plugins for the [TRMNL](https://trmnl.com) e-ink display platform.

**Live:** [trmnl.hossainkhan.com](https://trmnl.hossainkhan.com)

## Stack

Pure HTML / CSS / JS — no frameworks, no build tools. Plugin data loaded from `data/recipes.json`.

## Development

```bash
python3 -m http.server 8080
```

## Deployment

- **GitHub Pages** via Actions workflow
- **Cloudflare Workers** via static assets (`wrangler.toml`)
