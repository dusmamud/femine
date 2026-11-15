# Femine

Personal coaching landing page — "Your Personality is What Makes You Character".

Built with **Astro 7** + **Tailwind CSS 4**, Playfair Display + Jost fonts self-hosted
via `@fontsource` (no Google Fonts CDN). Static output, deploys to Cloudflare Pages.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build   # outputs to dist/
npm run preview
```

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml` (build + `wrangler pages
deploy dist --project-name=femine`). It needs these two repository secrets:

- `CLOUDFLARE_API_TOKEN` — custom API token with **Account → Cloudflare Pages → Edit**
- `CLOUDFLARE_ACCOUNT_ID` — your Cloudflare account ID

Live URL (after the first successful deploy): https://femine.pages.dev
