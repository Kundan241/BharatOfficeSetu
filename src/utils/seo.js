/**
 * Client-side SEO, Open Graph, and Twitter Card meta tag manager for SPA navigation.
 * Ensures share thumbnails (og:image / twitter:image), titles, descriptions, and canonical URLs
 * stay accurate across route transitions.
 */

const SITE_NAME = 'Bharat Office Setu';
const SITE_URL = 'https://bharatofficesetu.com';
const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;
const DEFAULT_DESCRIPTION =
  'Bharat Office Setu provides premium virtual offices for GST & MCA registration, coworking spaces, and business compliance solutions across India.';

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
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function applySeoMeta({
  title = `${SITE_NAME} | Premium Workspaces`,
  description = DEFAULT_DESCRIPTION,
  url = SITE_URL,
  image = DEFAULT_IMAGE,
  type = 'website',
  publishedTime = '',
  section = '',
} = {}) {
  if (typeof document === 'undefined') return;

  const fullImage = image && image.startsWith('http') ? image : (image ? `${SITE_URL}${image}` : DEFAULT_IMAGE);
  const cleanDesc = (description || DEFAULT_DESCRIPTION).replace(/\s+/g, ' ').trim().slice(0, 160);

  document.title = title;
  upsertLink('canonical', url);

  upsertMeta('name', 'description', cleanDesc);
  upsertMeta('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

  // Open Graph (WhatsApp, LinkedIn, Facebook, iMessage, Slack)
  upsertMeta('property', 'og:site_name', SITE_NAME);
  upsertMeta('property', 'og:type', type);
  upsertMeta('property', 'og:title', title);
  upsertMeta('property', 'og:description', cleanDesc);
  upsertMeta('property', 'og:url', url);
  upsertMeta('property', 'og:image', fullImage);
  upsertMeta('property', 'og:image:secure_url', fullImage);
  upsertMeta('property', 'og:image:alt', title);

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
}
