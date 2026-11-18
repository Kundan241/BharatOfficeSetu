/**
 * SEO, Open Graph, Twitter Card, and JSON-LD meta tag manager.
 * Ensures consistent canonical URLs (https://www.bharatofficesetu.com), titles,
 * descriptions, and structured data across route transitions and build-time prerendering.
 */

export const CANONICAL_DOMAIN = 'https://www.bharatofficesetu.com';
export const SITE_NAME = 'Bharat Office Setu';
export const DEFAULT_IMAGE = `${CANONICAL_DOMAIN}/logo.png`;
export const DEFAULT_DESCRIPTION =
  'Bharat Office Setu provides compliant virtual offices for GST & MCA registration, coworking spaces, and business compliance solutions across India.';

export function cleanUrl(url = '') {
  if (!url) return CANONICAL_DOMAIN;
  // Convert any non-www to www canonical domain
  let normalized = url.replace(/^https?:\/\/bharatofficesetu\.com/i, CANONICAL_DOMAIN);
  if (!normalized.startsWith('http')) {
    normalized = `${CANONICAL_DOMAIN}${normalized.startsWith('/') ? '' : '/'}${normalized}`;
  }
  // Remove trailing slash unless it is root /
  if (normalized.length > CANONICAL_DOMAIN.length + 1 && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }
  return normalized;
}

function upsertMeta(attrName, attrValue, content) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content || '');
}

function upsertLink(rel, href) {
  if (typeof document === 'undefined') return;
  // Remove any legacy duplicate canonical links
  const existingLinks = document.head.querySelectorAll(`link[rel="${rel}"]`);
  if (existingLinks.length > 1) {
    existingLinks.forEach((l, idx) => {
      if (idx > 0) l.remove();
    });
  }
  let el = existingLinks[0];
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function upsertJsonLd(id, data) {
  if (typeof document === 'undefined' || !data) return;
  let script = document.head.querySelector(`script[id="${id}"]`);
  if (!script) {
    script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('id', id);
    document.head.appendChild(script);
  }
  script.textContent = typeof data === 'string' ? data : JSON.stringify(data);
}

export function applySeoMeta({
  title = `${SITE_NAME} | Premium Workspaces & Business Compliance`,
  description = DEFAULT_DESCRIPTION,
  url = CANONICAL_DOMAIN,
  image = DEFAULT_IMAGE,
  type = 'website',
  publishedTime = '',
  section = '',
  noindex = false,
  jsonLd = null,
} = {}) {
  if (typeof document === 'undefined') return;

  const normalizedUrl = cleanUrl(url);
  const fullImage = image && image.startsWith('http') ? image : (image ? `${CANONICAL_DOMAIN}${image.startsWith('/') ? '' : '/'}${image}` : DEFAULT_IMAGE);
  const cleanDesc = (description || DEFAULT_DESCRIPTION).replace(/\s+/g, ' ').trim().slice(0, 160);

  document.title = title;
  upsertLink('canonical', normalizedUrl);

  upsertMeta('name', 'description', cleanDesc);
  upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

  // Open Graph (WhatsApp, LinkedIn, Facebook, Slack, iMessage)
  upsertMeta('property', 'og:site_name', SITE_NAME);
  upsertMeta('property', 'og:type', type);
  upsertMeta('property', 'og:title', title);
  upsertMeta('property', 'og:description', cleanDesc);
  upsertMeta('property', 'og:url', normalizedUrl);
  upsertMeta('property', 'og:image', fullImage);
  upsertMeta('property', 'og:image:secure_url', fullImage);
  upsertMeta('property', 'og:image:alt', title);
  upsertMeta('property', 'og:locale', 'en_IN');

  if (type === 'article' && publishedTime) {
    upsertMeta('property', 'article:published_time', publishedTime);
  }
  if (type === 'article' && section) {
    upsertMeta('property', 'article:section', section);
  }

  // Twitter / X Card
  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', title);
  upsertMeta('name', 'twitter:description', cleanDesc);
  upsertMeta('name', 'twitter:image', fullImage);

  // Structured Data (JSON-LD)
  if (jsonLd) {
    upsertJsonLd('page-json-ld', jsonLd);
  }
}
