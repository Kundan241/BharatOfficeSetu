/**
 * Client Logos Configuration & Auto-Discovery
 * 
 * Logos placed in /public/OurClientLogos/ (and any subfolders such as Logos_BOS/)
 * are automatically discovered and displayed in the Client Logos Bulletin Ticker.
 * 
 * You can also specify custom company names or links in CURATED_METADATA below.
 */

export const CURATED_METADATA = {
  'Elegant EKLAVASH Designs Logo.png': {
    name: 'Eklavash Designs',
    industry: 'Design & Architecture',
  },
  'Glossy Multicolour Ribbon S Logo.png': {
    name: 'S-Series Enterprises',
    industry: 'Retail & Consumer Goods',
  },
  'WhatsApp Image 2026-11-16 at 12.55.09.jpeg': {
    name: 'Bharat Partner Network',
    industry: 'Technology & Logistics',
  },
  'WhatsApp Image 2026-11-16 at 12.55.10.jpeg': {
    name: 'Shree Global Trade',
    industry: 'Manufacturing & Exports',
  },
};

// Fallback list of logos in case of environments without glob support
export const DEFAULT_CLIENT_LOGOS = [
  {
    name: 'Eklavash Designs',
    src: '/OurClientLogos/Logos_BOS/Elegant EKLAVASH Designs Logo.png',
  },
  {
    name: 'S-Series Enterprises',
    src: '/OurClientLogos/Logos_BOS/Glossy Multicolour Ribbon S Logo.png',
  },
  {
    name: 'Bharat Partner Network',
    src: '/OurClientLogos/Logos_BOS/WhatsApp Image 2026-11-16 at 12.55.09.jpeg',
  },
  {
    name: 'Shree Global Trade',
    src: '/OurClientLogos/Logos_BOS/WhatsApp Image 2026-11-16 at 12.55.10.jpeg',
  },
];

/**
 * Returns all client logos, merging auto-discovered files from
 * /public/OurClientLogos/ with curated metadata.
 */
export function getClientLogos() {
  try {
    // Vite glob to discover all image assets in public/OurClientLogos
    const globFiles = import.meta.glob(
      '/public/OurClientLogos/**/*.{png,jpg,jpeg,svg,webp,PNG,JPG,JPEG}',
      { eager: true, query: '?url', import: 'default' }
    );

    const entries = Object.entries(globFiles);
    if (entries.length > 0) {
      return entries.map(([fullPath, url]) => {
        // Extract filename from path
        const filename = fullPath.split('/').pop() || '';
        const decodedFilename = decodeURIComponent(filename);
        
        // Clean public path for browser
        const browserSrc = fullPath.startsWith('/public')
          ? fullPath.replace('/public', '')
          : (typeof url === 'string' ? url : fullPath);

        const metadata = CURATED_METADATA[filename] || CURATED_METADATA[decodedFilename] || {};
        
        // Clean name fallback if not in curated metadata
        const cleanName = metadata.name || decodedFilename
          .replace(/\.(png|jpg|jpeg|svg|webp)$/i, '')
          .replace(/^WhatsApp Image [0-9-]+ at [0-9.]+/i, 'BOS Client Partner')
          .replace(/[_-]+/g, ' ')
          .trim();

        return {
          id: filename,
          name: cleanName,
          src: browserSrc,
          industry: metadata.industry || 'Enterprise Client',
        };
      });
    }
  } catch (err) {
    console.warn('Could not auto-glob client logos, using default list:', err);
  }

  return DEFAULT_CLIENT_LOGOS;
}
