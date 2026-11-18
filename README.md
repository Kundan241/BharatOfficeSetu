# Bharat Office Setu (BOS)

Digital infrastructure, compliant virtual offices, and business registration across 28+ Indian states.

- **Production Domain**: `https://www.bharatofficesetu.com`
- **Hosting**: Cloudflare Pages
- **Database & CMS**: Supabase (`blog_posts`, client records, drafts)
- **Framework**: React 19 + Vite 8 + Tailwind CSS

---

## Architecture & Build-Time Prerendering (SSG)

The site is built with React 19 and Vite 8, enhanced with an automated build-time prerendering engine (`scripts/prerender.mjs`) powered by Puppeteer.

### How It Works:
1. **`vite build`** compiles React bundles, runs asset optimization, and generates PWA service worker files in `dist/`.
2. **`scripts/prerender.mjs`** runs immediately after Vite:
   - Queries Supabase for all published blog posts (`SELECT slug, title, created_at, category, excerpt FROM blog_posts WHERE published = true`).
   - Starts an internal static server on an ephemeral loopback port serving `dist/`.
   - Uses headless Chromium via Puppeteer to render each public page:
     - `/` &rarr; `dist/index.html`
     - `/blog` &rarr; `dist/blog/index.html`
     - `/blog/:slug` &rarr; `dist/blog/<slug>/index.html` (for each post)
     - `/privacy-policy` &rarr; `dist/privacy-policy/index.html`
     - `/terms-and-conditions` &rarr; `dist/terms-and-conditions/index.html`
     - `/refund-policy` &rarr; `dist/refund-policy/index.html`
     - `/404` &rarr; `dist/404.html`
   - Captures the complete HTML with visible text, headings, paragraphs, and prices so search engines and AI crawlers (Googlebot, Bing, ChatGPT, Claude, Perplexity) see full content without JavaScript execution.
   - Generates dynamic `sitemap.xml` listing all pages and individual post URLs with their respective `<lastmod>` timestamps.
   - Copies `_redirects`, `robots.txt`, and `llms.txt` to `dist/`.
3. In the browser, React 19 uses `hydrateRoot` in `src/main.jsx` to bind event handlers to the existing HTML without any content flash or layout shift.

---

## Canonical Domain & SEO Rules

- **Canonical Host**: Strict `https://www.bharatofficesetu.com` (with `www`).
- **No Self-Duplication**: `/blog` canonical is `https://www.bharatofficesetu.com/blog`, NOT the homepage.
- **301 Redirects (`_redirects`)**:
  - Non-www `https://bharatofficesetu.com/*` &rarr; `https://www.bharatofficesetu.com/:splat` (301 permanent).
  - HTTP `http://*` &rarr; `https://www.bharatofficesetu.com/:splat` (301 permanent).
- **Soft 404 Prevention**: Unmatched routes return HTTP status `404` with `404.html` (with `<meta name="robots" content="noindex, nofollow">`), instead of falling back to 200 index.html.
- **Private SPA Routes**: Only private app routes (`/dashboard/*`, `/partner-dashboard/*`, `/admin/*`, `/login`, etc.) are routed to `/index.html 200` by Cloudflare.

---

## Publishing a New Blog Post

When a new blog post is published in the Admin dashboard or Supabase:

1. **Automatic Deploy Hook (Recommended)**:
   - In Cloudflare Pages, go to **Settings &rarr; Builds & Deployments &rarr; Deploy hooks**.
   - Create a Deploy Hook (e.g. named `supabase-blog-publish`).
   - Copy the generated webhook URL.
   - You can trigger this hook directly from Supabase Database Webhooks (on `INSERT` or `UPDATE` where `published = true` on table `blog_posts`) or by making an HTTP POST request:
     ```bash
     curl -X POST "https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/<hook-id>"
     ```
   - Cloudflare Pages will automatically run `npm run build`, fetching the new post from Supabase, rendering `dist/blog/<new-slug>/index.html`, updating `dist/blog/index.html` and `dist/sitemap.xml`, and deploying live.

2. **Manual Rebuild via Git**:
   - Alternatively, pushing any commit to `main` automatically triggers a Cloudflare Pages build.

---

## Local Development & Build

```bash
# Run local dev server
npm run dev

# Run full production build + prerender pass
npm run build

# Preview the prerendered distribution
npm run preview
```
