import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.resolve(projectRoot, 'dist');

// 1. Load environment variables from .env if present
function loadEnv() {
  const envPath = path.resolve(projectRoot, '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        let val = match[2] || '';
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[match[1]]) {
          process.env[match[1]] = val.trim();
        }
      }
    }
  }
}

loadEnv();

// Fallback known published posts in case Supabase is unreachable at build time
const FALLBACK_POSTS = [
  {
    slug: 'gst-registration-reforms-2026-what-every-business-owner-and-e-commerce-seller-must-know',
    title: 'GST Registration Reforms 2026: What Every Business Owner and E-Commerce Seller Must Know',
    created_at: '2026-11-12T11:28:30.495Z',
    category: 'GST',
  },
  {
    slug: 'title-company-registration-101-a-quick-guide-to-incorporation-in-india',
    title: 'Title: Company Registration 101: A Quick Guide to Incorporation in India',
    created_at: '2026-10-09T13:01:45.583Z',
    category: 'Company Setup',
  },
  {
    slug: 'navigating-gst-a-quick-guide-for-small-businesses-and-startups',
    title: 'Navigating GST: A Quick Guide for Small Businesses and Startups',
    created_at: '2026-10-09T12:57:51.287Z',
    category: 'GST',
  },
  {
    slug: 'why-a-virtual-office-is-the-smartest-way-to-get-gst-registration',
    title: 'Why a Virtual Office is the Smartest Way to Get GST Registration',
    created_at: '2026-10-06T12:25:48.625Z',
    category: 'Virtual Office',
  },
];

async function fetchBlogPosts() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[prerender] Supabase credentials not found in env, using fallback posts list.');
    return FALLBACK_POSTS;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug, title, created_at, category, excerpt')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      console.warn('[prerender] Failed to query blog posts from Supabase, using fallback list:', error?.message);
      return FALLBACK_POSTS;
    }

    console.log(`[prerender] Fetched ${data.length} published blog posts from Supabase.`);
    return data;
  } catch (err) {
    console.warn('[prerender] Error connecting to Supabase, using fallback posts:', err.message);
    return FALLBACK_POSTS;
  }
}

// MIME types dictionary for static file serving
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

function startStaticServer(originalIndexHtml) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const parsedUrl = new URL(req.url, 'http://127.0.0.1');
      let reqPath = decodeURIComponent(parsedUrl.pathname);

      // Try physical file in dist/
      const filePath = path.join(distDir, reqPath);

      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        fs.createReadStream(filePath).pipe(res);
        return;
      }

      // Check if directory with index.html exists
      const dirIndex = path.join(filePath, 'index.html');
      if (fs.existsSync(dirIndex) && fs.statSync(dirIndex).isFile()) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        fs.createReadStream(dirIndex).pipe(res);
        return;
      }

      // Fallback for SPA routing: serve original SPA index.html so React Router initializes
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(originalIndexHtml);
    });

    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      resolve({ server, port });
    });

    server.on('error', reject);
  });
}

function generateSitemapXml(posts) {
  const CANONICAL_DOMAIN = 'https://www.bharatofficesetu.com';
  const now = new Date().toISOString().split('T')[0];

  const staticRoutes = [
    { loc: `${CANONICAL_DOMAIN}/`, changefreq: 'weekly', priority: '1.0', lastmod: now },
    { loc: `${CANONICAL_DOMAIN}/blog`, changefreq: 'daily', priority: '0.9', lastmod: now },
    { loc: `${CANONICAL_DOMAIN}/privacy-policy`, changefreq: 'monthly', priority: '0.5', lastmod: '2026-11-18' },
    { loc: `${CANONICAL_DOMAIN}/terms-and-conditions`, changefreq: 'monthly', priority: '0.5', lastmod: '2026-11-18' },
    { loc: `${CANONICAL_DOMAIN}/refund-policy`, changefreq: 'monthly', priority: '0.5', lastmod: '2026-11-18' },
  ];

  const blogRoutes = posts.map((post) => {
    let lastmod = now;
    if (post.created_at) {
      try {
        lastmod = new Date(post.created_at).toISOString().split('T')[0];
      } catch (_) {}
    }
    return {
      loc: `${CANONICAL_DOMAIN}/blog/${post.slug}`,
      changefreq: 'weekly',
      priority: '0.8',
      lastmod,
    };
  });

  const allUrls = [...staticRoutes, ...blogRoutes];

  const xmlLines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...allUrls.map((u) =>
      `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
    ),
    '</urlset>',
  ];

  return xmlLines.join('\n');
}

async function main() {
  console.log('====================================================');
  console.log(' Bharat Office Setu - Build-Time Prerendering Engine');
  console.log('====================================================');

  const originalIndexHtmlPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(originalIndexHtmlPath)) {
    throw new Error(`dist/index.html not found. Please run 'vite build' first.`);
  }

  const originalIndexHtml = fs.readFileSync(originalIndexHtmlPath, 'utf-8');

  // Fetch published posts
  const posts = await fetchBlogPosts();

  // Define route targets
  const routesToPrerender = [
    { route: '/', output: 'index.html', type: 'page', waitFor: 'footer' },
    { route: '/blog', output: 'blog/index.html', type: 'page', waitFor: '.grid h2' },
    { route: '/privacy-policy', output: 'privacy-policy/index.html', type: 'page', waitFor: 'h1' },
    { route: '/terms-and-conditions', output: 'terms-and-conditions/index.html', type: 'page', waitFor: 'h1' },
    { route: '/refund-policy', output: 'refund-policy/index.html', type: 'page', waitFor: 'h1' },
    { route: '/404', output: '404.html', type: '404', waitFor: 'h1' },
    ...posts.map((p) => ({
      route: `/blog/${p.slug}`,
      output: `blog/${p.slug}/index.html`,
      type: 'post',
      title: p.title,
      waitFor: 'article h1',
    })),
  ];

  console.log(`[prerender] Total routes scheduled for static rendering: ${routesToPrerender.length}`);

  // Start internal static server
  const { server, port } = await startStaticServer(originalIndexHtml);
  console.log(`[prerender] Internal static server listening on 127.0.0.1:${port}`);

  // Launch Puppeteer
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-first-run',
      '--no-zygote',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  const results = [];

  for (const item of routesToPrerender) {
    const targetUrl = `http://127.0.0.1:${port}${item.route}`;
    process.stdout.write(`[prerender] Rendering ${item.route.padEnd(65)} ... `);

    let html = null;
    let lastError = null;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

        // Wait for the selector to ensure React has mounted and populated content
        if (item.waitFor) {
          await page.waitForSelector(item.waitFor, { timeout: 25000 });
        }

        // Ensure loading spinners are gone
        await page.waitForFunction(
          () => !document.querySelector('.animate-spin'),
          { timeout: 15000 }
        ).catch(() => {});

        // Small delay to allow applySeoMeta useEffect to finish applying title, canonical, and schemas
        await new Promise((resolve) => setTimeout(resolve, 500));

        html = await page.content();
        break;
      } catch (err) {
        lastError = err;
        if (attempt === 1) {
          process.stdout.write(`(retrying)... `);
          await new Promise((r) => setTimeout(r, 1000));
        }
      }
    }

    if (!html) {
      console.log(`FAILED: ${lastError.message}`);
      results.push({
        route: item.route,
        file: item.output,
        size: '0 KB',
        title: 'FAILED',
        canonical: 'N/A',
        status: `ERROR: ${lastError.message}`,
      });
      continue;
    }

    try {
      // Ensure proper doctype
      if (!html.toLowerCase().startsWith('<!doctype html>')) {
        html = '<!DOCTYPE html>\n' + html;
      }

      // Ensure canonical tag is explicitly verified/present
      const expectedCanonical = `https://www.bharatofficesetu.com${item.route === '/' ? '/' : item.route}`;
      if (item.type !== '404') {
        const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
        if (!canonicalMatch) {
          // Inject canonical if missing
          html = html.replace('</head>', `  <link rel="canonical" href="${expectedCanonical}" />\n</head>`);
        }
      }

      // Extract title for reporting
      const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
      const renderedTitle = titleMatch ? titleMatch[1] : 'No Title';

      // Verify DOM content is not empty
      const rootEmpty = /<div id=["']root["']>\s*<\/div>/.test(html);
      if (rootEmpty) {
        throw new Error('Prerendered #root container is empty!');
      }

      // Write output HTML file
      const outPath = path.join(distDir, item.output);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, html, 'utf-8');

      const sizeKb = (Buffer.byteLength(html, 'utf-8') / 1024).toFixed(1);
      results.push({
        route: item.route,
        file: item.output,
        size: `${sizeKb} KB`,
        title: renderedTitle,
        canonical: item.type === '404' ? 'N/A (404)' : expectedCanonical,
        status: 'OK',
      });

      console.log(`DONE (${sizeKb} KB)`);
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
      results.push({
        route: item.route,
        file: item.output,
        size: '0 KB',
        title: 'FAILED',
        canonical: 'N/A',
        status: `ERROR: ${err.message}`,
      });
    }
  }

  await browser.close();
  server.close();

  // 6. Generate and write sitemap.xml
  console.log('[prerender] Generating dynamic sitemap.xml with full post URLs...');
  const sitemapXml = generateSitemapXml(posts);
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf-8');
  fs.writeFileSync(path.join(projectRoot, 'public', 'sitemap.xml'), sitemapXml, 'utf-8');
  console.log(`[prerender] sitemap.xml generated (${posts.length + 5} URLs).`);

  // 7. Ensure _redirects, robots.txt, llms.txt exist in dist
  const publicFilesToSync = ['_redirects', 'robots.txt', 'llms.txt'];
  for (const f of publicFilesToSync) {
    const srcF = path.join(projectRoot, 'public', f);
    const dstF = path.join(distDir, f);
    if (fs.existsSync(srcF)) {
      fs.copyFileSync(srcF, dstF);
    }
  }

  // Summary Table
  console.log('\n====================================================');
  console.log(' Prerender Build Summary');
  console.log('====================================================');
  console.table(
    results.map((r) => ({
      Route: r.route,
      File: r.file,
      Size: r.size,
      Title: r.title.slice(0, 45) + (r.title.length > 45 ? '...' : ''),
      Status: r.status,
    }))
  );
  console.log('====================================================\n');
}

main().catch((err) => {
  console.error('[prerender] Fatal error:', err);
  process.exit(1);
});
