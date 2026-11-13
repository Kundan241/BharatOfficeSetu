/**
 * Blog HTML normalization, Markdown-in-Quill recovery, safe sanitization, and FAQ extraction.
 * Fixes mid-word wrapping caused by Quill's `&nbsp;` entities and normalizes spacing.
 */

const ALLOWED_TAGS = new Set([
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'hr',
  'strong', 'b', 'em', 'i', 'u', 's', 'del', 'mark', 'small', 'sub', 'sup',
  'ul', 'ol', 'li',
  'blockquote', 'pre', 'code',
  'a', 'img',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
  'figure', 'figcaption', 'span', 'div'
]);

const ALLOWED_ATTRS = new Set([
  'href', 'target', 'rel', 'src', 'alt', 'title', 'width', 'height',
  'loading', 'decoding', 'colspan', 'rowspan', 'scope', 'id'
]);

function isSafeUrl(url, allowDataImage = false) {
  if (!url) return false;
  const trimmed = url.trim().toLowerCase();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/') || trimmed.startsWith('#') || trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) {
    return true;
  }
  if (allowDataImage && trimmed.startsWith('data:image/')) {
    return true;
  }
  return false;
}

/**
 * Cleans accidental "Title: " prefix from blog titles.
 */
export function cleanBlogTitle(title = '') {
  return String(title).replace(/^Title:\s*/i, '').trim();
}

/**
 * Normalizes Quill HTML:
 * - Converts `&nbsp;` / `\u00A0` to standard breaking spaces so words never split mid-word.
 * - Removes empty `<p></p>` / `<p><br></p>` spacer noise.
 * - Converts raw Markdown headings (`## `, `### `), dividers (`---`), and bullet/numbered paragraphs pasted into Quill.
 * - Sanitizes HTML against unsafe tags/attributes.
 */
export function normalizeBlogHtml(rawHtml = '') {
  if (!rawHtml || typeof rawHtml !== 'string') return '';

  // 1. Replace non-breaking spaces with regular spaces so normal word wrapping works
  let html = rawHtml
    .replace(/&nbsp;/gi, ' ')
    .replace(/\u00A0/g, ' ')
    // Collapse runs of spaces inside text nodes without breaking tag attributes
    .replace(/[ \t]{2,}/g, ' ');

  // 2. Remove empty paragraphs that Quill inserts as blank-line spacers
  html = html.replace(/<p(?:\s[^>]*)?>\s*(?:<br\s*\/?>\s*)*<\/p>/gi, '');

  // 3. Convert literal Markdown inside <p>...</p> (e.g. "## Heading", "### Subheading", "---")
  html = html
    // Horizontal rules: <p>---</p>, <p>***</p>, <p>___</p>
    .replace(/<p(?:\s[^>]*)?>\s*(?:-{3,}|\*{3,}|_{3,})\s*<\/p>/gi, '<hr />')
    // Special pattern seen in pasted drafts like <p>----An example</p>
    .replace(/<p(?:\s[^>]*)?>\s*-{3,}\s*([^<\n][^<]*?)<\/p>/gi, '<h3>$1</h3>')
    // Headings: # / ## / ### / #### inside <p>
    .replace(/<p(?:\s[^>]*)?>\s*####\s+([\s\S]*?)<\/p>/gi, '<h4>$1</h4>')
    .replace(/<p(?:\s[^>]*)?>\s*###\s+([\s\S]*?)<\/p>/gi, '<h3>$1</h3>')
    .replace(/<p(?:\s[^>]*)?>\s*##\s+([\s\S]*?)<\/p>/gi, '<h2>$1</h2>')
    .replace(/<p(?:\s[^>]*)?>\s*#\s+([\s\S]*?)<\/p>/gi, '<h2>$1</h2>');

  // 4. Convert consecutive Markdown-style bullet paragraphs (<p>- item</p> or <p>• item</p>) into <ul><li>
  html = html.replace(/(?:<p(?:\s[^>]*)?>\s*(?:-|•|\*)\s+([\s\S]*?)<\/p>\s*)+/gi, (block) => {
    const items = [];
    const itemRegex = /<p(?:\s[^>]*)?>\s*(?:-|•|\*)\s+([\s\S]*?)<\/p>/gi;
    let m;
    while ((m = itemRegex.exec(block)) !== null) {
      items.push(`<li>${m[1].trim()}</li>`);
    }
    return items.length ? `<ul>${items.join('')}</ul>` : block;
  });

  // 5. Convert inline **bold** markdown if pasted as raw text
  html = html.replace(/\*\*([^*\n<>]+?)\*\*/g, '<strong>$1</strong>');

  // 6. Sanitize in browser DOM when available
  if (typeof DOMParser !== 'undefined') {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const sanitizeNode = (node) => {
        const children = Array.from(node.childNodes);
        for (const child of children) {
          if (child.nodeType === 1) {
            const tag = child.tagName.toLowerCase();
            if (!ALLOWED_TAGS.has(tag)) {
              // Strip dangerous containers completely; unwrap harmless unknown inline wrappers
              if (['script', 'style', 'iframe', 'object', 'embed', 'form', 'noscript'].includes(tag)) {
                child.remove();
              } else {
                sanitizeNode(child);
                child.replaceWith(...Array.from(child.childNodes));
              }
              continue;
            }

            // Demote embedded H1 inside body to H2 so article title remains the single H1
            if (tag === 'h1') {
              const h2 = doc.createElement('h2');
              while (child.firstChild) h2.appendChild(child.firstChild);
              child.replaceWith(h2);
              sanitizeNode(h2);
              continue;
            }

            // Clean attributes
            for (const attr of Array.from(child.attributes)) {
              const name = attr.name.toLowerCase();
              if (!ALLOWED_ATTRS.has(name) || name.startsWith('on')) {
                child.removeAttribute(attr.name);
                continue;
              }
              if (name === 'href' && !isSafeUrl(attr.value, false)) {
                child.removeAttribute('href');
              }
              if (name === 'src' && !isSafeUrl(attr.value, true)) {
                child.removeAttribute('src');
              }
            }

            if (tag === 'a') {
              const href = child.getAttribute('href') || '';
              if (href.startsWith('http://') || href.startsWith('https://')) {
                child.setAttribute('target', '_blank');
                child.setAttribute('rel', 'noopener noreferrer');
              }
            }

            if (tag === 'img') {
              child.setAttribute('loading', 'lazy');
              child.setAttribute('decoding', 'async');
            }

            sanitizeNode(child);
          }
        }
      };

      sanitizeNode(doc.body);
      return doc.body.innerHTML.trim();
    } catch {
      return html;
    }
  }

  return html;
}

/**
 * Extracts question headings (ending in `?`) and their immediate answer text for FAQPage JSON-LD.
 */
export function extractFaqFromHtml(normalizedHtml = '') {
  if (!normalizedHtml || typeof DOMParser === 'undefined') return [];
  try {
    const doc = new DOMParser().parseFromString(normalizedHtml, 'text/html');
    const faqs = [];
    const headings = doc.body.querySelectorAll('h2, h3, h4');
    headings.forEach((h) => {
      const q = h.textContent?.trim();
      if (!q || !q.endsWith('?') || q.length < 10) return;
      const answerParts = [];
      let next = h.nextElementSibling;
      while (next && !['H1', 'H2', 'H3', 'H4', 'HR'].includes(next.tagName)) {
        const text = next.textContent?.trim();
        if (text) answerParts.push(text);
        if (answerParts.join(' ').length > 500) break;
        next = next.nextElementSibling;
      }
      const answer = answerParts.join(' ').trim();
      if (answer.length >= 20) {
        faqs.push({ question: q, answer });
      }
    });
    return faqs.slice(0, 8);
  } catch {
    return [];
  }
}

