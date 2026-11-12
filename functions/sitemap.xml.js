/**
 * Cloudflare Pages Function: /sitemap.xml
 * Dynamically lists all static public routes and published Supabase blog posts
 * for Google Search Console, Bing, ChatGPT OAI-SearchBot, and Perplexity.
 */

function xmlEscape(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function onRequestGet(context) {
  const { env } = context;
  const siteUrl = 'https://bharatofficesetu.com';

  const staticPages = [
    { loc: `${siteUrl}/`, changefreq: 'weekly', priority: '1.0' },
    { loc: `${siteUrl}/blog`, changefreq: 'daily', priority: '0.9' },
    { loc: `${siteUrl}/privacy-policy`, changefreq: 'yearly', priority: '0.3' },
    { loc: `${siteUrl}/terms-and-conditions`, changefreq: 'yearly', priority: '0.3' },
    { loc: `${siteUrl}/refund-policy`, changefreq: 'yearly', priority: '0.3' },
  ];

  const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
  const supabaseKey = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY;

  const blogEntries = [];
  if (supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(
        `${supabaseUrl.replace(/\/$/, '')}/rest/v1/blog_posts?published=eq.true&select=slug,created_at&order=created_at.desc&limit=500`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
        }
      );
      if (res.ok) {
        const posts = await res.json();
        if (Array.isArray(posts)) {
          for (const p of posts) {
            if (!p?.slug) continue;
            blogEntries.push({
              loc: `${siteUrl}/blog/${encodeURIComponent(p.slug)}`,
              lastmod: p.created_at ? new Date(p.created_at).toISOString().split('T')[0] : undefined,
              changefreq: 'monthly',
              priority: '0.8',
            });
          }
        }
      }
    } catch {
      // Serve static entries if query fails
    }
  }

  const allUrls = [...staticPages, ...blogEntries];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${xmlEscape(u.loc)}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=1800, stale-while-revalidate=3600',
    },
  });
}
