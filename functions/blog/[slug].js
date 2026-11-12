/**
 * Cloudflare Pages Function: /blog/:slug
 *
 * Dynamically injects Open Graph (og:image thumbnail), Twitter Card, Canonical URL,
 * BlogPosting + BreadcrumbList JSON-LD, and semantic <article> fallback HTML inside #root.
 * Zero external dependencies — runs purely on Web Fetch + Cloudflare HTMLRewriter.
 */

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function cleanTitle(title = '') {
  return String(title).replace(/^Title:\s*/i, '').trim();
}

function normalizeTextHtml(raw = '') {
  return String(raw)
    .replace(/&nbsp;/gi, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/<p(?:\s[^>]*)?>\s*(?:<br\s*\/?>\s*)*<\/p>/gi, '')
    .replace(/<p(?:\s[^>]*)?>\s*(?:-{3,}|\*{3,}|_{3,})\s*<\/p>/gi, '<hr />')
    .replace(/<p(?:\s[^>]*)?>\s*####\s+([\s\S]*?)<\/p>/gi, '<h4>$1</h4>')
    .replace(/<p(?:\s[^>]*)?>\s*###\s+([\s\S]*?)<\/p>/gi, '<h3>$1</h3>')
    .replace(/<p(?:\s[^>]*)?>\s*##\s+([\s\S]*?)<\/p>/gi, '<h2>$1</h2>')
    .replace(/<p(?:\s[^>]*)?>\s*#\s+([\s\S]*?)<\/p>/gi, '<h2>$1</h2>')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}

export async function onRequestGet(context) {
  const { request, env, params } = context;
  const slug = params?.slug;

  const assetUrl = new URL('/index.html', request.url);
  const baseResponse = await env.ASSETS.fetch(new Request(assetUrl.toString(), { method: 'GET' }));

  const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
  const supabaseKey = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY;

  if (!slug || !supabaseUrl || !supabaseKey) {
    return baseResponse;
  }

  try {
    const apiUrl = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/blog_posts?slug=eq.${encodeURIComponent(slug)}&select=title,slug,excerpt,category,image_url,cover_image,created_at,content&limit=1`;
    const postRes = await fetch(apiUrl, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });

    if (!postRes.ok) {
      return baseResponse;
    }

    const rows = await postRes.json();
    const post = Array.isArray(rows) ? rows[0] : null;
    if (!post) {
      return baseResponse;
    }

    const siteUrl = 'https://bharatofficesetu.com';
    const postTitle = cleanTitle(post.title);
    const fullTitle = `${postTitle} | Bharat Office Setu`;
    const description = (post.excerpt || postTitle).replace(/\s+/g, ' ').trim().slice(0, 160);
    const canonicalUrl = `${siteUrl}/blog/${encodeURIComponent(post.slug || slug)}`;
    const rawImage = post.image_url || post.cover_image || `${siteUrl}/logo.png`;
    const ogImage = rawImage.startsWith('http') ? rawImage : `${siteUrl}${rawImage}`;
    const cleanBody = normalizeTextHtml(post.content || '');

    const jsonLd = [
      {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
        headline: postTitle,
        description,
        image: [ogImage],
        datePublished: post.created_at,
        dateModified: post.created_at,
        articleSection: post.category || 'Business Compliance',
        inLanguage: 'en-IN',
        author: { '@type': 'Organization', name: 'Bharat Office Setu', url: siteUrl },
        publisher: {
          '@type': 'Organization',
          name: 'Bharat Office Setu',
          url: siteUrl,
          logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.png` },
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog` },
          { '@type': 'ListItem', position: 3, name: postTitle, item: canonicalUrl },
        ],
      },
    ];

    const injectedHead = `
      <title>${escapeHtml(fullTitle)}</title>
      <meta name="description" content="${escapeHtml(description)}" />
      <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />
      <meta property="og:site_name" content="Bharat Office Setu" />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:type" content="article" />
      <meta property="og:title" content="${escapeHtml(postTitle)}" />
      <meta property="og:description" content="${escapeHtml(description)}" />
      <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
      <meta property="og:image" content="${escapeHtml(ogImage)}" />
      <meta property="og:image:secure_url" content="${escapeHtml(ogImage)}" />
      <meta property="og:image:alt" content="${escapeHtml(postTitle)}" />
      ${post.created_at ? `<meta property="article:published_time" content="${escapeHtml(post.created_at)}" />` : ''}
      ${post.category ? `<meta property="article:section" content="${escapeHtml(post.category)}" />` : ''}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${escapeHtml(postTitle)}" />
      <meta name="twitter:description" content="${escapeHtml(description)}" />
      <meta name="twitter:image" content="${escapeHtml(ogImage)}" />
      <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
    `;

    // Semantic SSR fallback inside #root for Googlebot, ChatGPT, Perplexity, and Claude crawlers
    // React createRoot replaces #root contents seamlessly upon hydration/mount in browsers.
    const seoFallbackHtml = `
      <main style="max-width:740px;margin:80px auto;padding:24px;font-family:Inter,sans-serif;color:#111110;">
        <article>
          <h1>${escapeHtml(postTitle)}</h1>
          <p>${escapeHtml(description)}</p>
          ${ogImage ? `<img src="${escapeHtml(ogImage)}" alt="${escapeHtml(postTitle)}" style="max-width:100%;height:auto;" />` : ''}
          <div>${cleanBody}</div>
        </article>
      </main>
    `;

    const rewritten = new HTMLRewriter()
      .on('head > title', { element(el) { el.remove(); } })
      .on('head > meta[name="description"]', { element(el) { el.remove(); } })
      .on('head > link[rel="canonical"]', { element(el) { el.remove(); } })
      .on('head > meta[property^="og:"]', { element(el) { el.remove(); } })
      .on('head > meta[name^="twitter:"]', { element(el) { el.remove(); } })
      .on('head', {
        element(el) {
          el.append(injectedHead, { html: true });
        },
      })
      .on('#root', {
        element(el) {
          el.setInnerContent(seoFallbackHtml, { html: true });
        },
      })
      .transform(baseResponse);

    const headers = new Headers(rewritten.headers);
    headers.set('Content-Type', 'text/html; charset=utf-8');
    headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=3600');

    return new Response(rewritten.body, {
      status: 200,
      headers,
    });
  } catch {
    return baseResponse;
  }
}
