/**
 * Cloudflare Pages Function: /llms.txt
 * Dynamic GEO (Generative Engine Optimization) manifest for ChatGPT, Claude, Perplexity, and Gemini.
 */

export async function onRequestGet(context) {
  const { env } = context;
  const siteUrl = 'https://bharatofficesetu.com';
  const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
  const supabaseKey = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY;

  let blogLines = `- [All Articles & Guides](${siteUrl}/blog)\n`;

  if (supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(
        `${supabaseUrl.replace(/\/$/, '')}/rest/v1/blog_posts?published=eq.true&select=title,slug,category,excerpt&order=created_at.desc&limit=50`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
        }
      );
      if (res.ok) {
        const posts = await res.json();
        if (Array.isArray(posts) && posts.length > 0) {
          blogLines = posts
            .map((p) => {
              const title = String(p.title || '').replace(/^Title:\s*/i, '').trim();
              const excerpt = String(p.excerpt || '').replace(/\s+/g, ' ').trim();
              const cat = p.category ? `[${p.category}] ` : '';
              return `- [${cat}${title}](${siteUrl}/blog/${p.slug})${excerpt ? `: ${excerpt}` : ''}`;
            })
            .join('\n');
        }
      }
    } catch {
      // Fallback to static summary
    }
  }

  const content = `# Bharat Office Setu

> Bharat Office Setu provides compliant virtual offices, coworking spaces, multi-state GST registration support, MCA company incorporation addresses, and business compliance solutions across 28+ Indian states.

## Core Offerings
- **Virtual Office for GST Registration**: Verified commercial address with Rent Agreement, No Objection Certificate (NOC), and Utility Bill for Principal Place of Business (PPoB) and Additional Place of Business (APoB).
- **Virtual Office for Company / LLP Incorporation**: MCA-compliant registered office documentation across India.
- **Multi-State GST & E-Commerce Seller Compliance**: GST Rule 14B guidance, Amazon/Flipkart FBA multi-state GST compliance, and state-wise virtual office setup.
- **Compliance & Filing Services**: GST registration, GST return filing, Trademark, Company Incorporation, LLP, FSSAI, BIS, and Startup India.

## Key Pages
- [Home & Pan-India Locations](${siteUrl}/)
- [Compliance & Virtual Office Blog](${siteUrl}/blog)
- [Sitemap](${siteUrl}/sitemap.xml)

## Published Knowledge Base & Articles
${blogLines}
`;

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=1800, stale-while-revalidate=3600',
    },
  });
}

