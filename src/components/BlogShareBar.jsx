import React, { useState, useRef, useEffect } from 'react';
import { Share2, Copy, Check, ExternalLink } from 'lucide-react';

function legacyCopy(text) {
  const field = Object.assign(document.createElement('textarea'), { value: text });
  field.setAttribute('readonly', '');
  field.style.cssText = 'position:fixed;inset-block-start:0;opacity:0';
  document.body.append(field);
  field.select();
  try {
    return document.execCommand('copy');
  } finally {
    field.remove();
  }
}

export default function BlogShareBar({
  title = '',
  excerpt = '',
  imageUrl = '',
  url = typeof window !== 'undefined' ? window.location.href : 'https://bharatofficesetu.com/blog',
  compact = false,
}) {
  const [copyStatus, setCopyStatus] = useState(null); // null | 'copied' | 'failed'
  const [liveMessage, setLiveMessage] = useState('');
  const [isSharingNative, setIsSharingNative] = useState(false);
  const timerRef = useRef(null);
  const lastMsgRef = useRef('');

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const announceCopy = (ok) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    let msg = ok ? 'Copied' : 'Copy failed';
    if (msg === lastMsgRef.current) msg += '\u00A0'; // ensure VoiceOver re-announces identical repeated outcomes
    lastMsgRef.current = msg;

    setCopyStatus(null);
    setLiveMessage('');
    requestAnimationFrame(() => {
      setCopyStatus(ok ? 'copied' : 'failed');
      setLiveMessage(msg);
    });

    timerRef.current = setTimeout(() => {
      setCopyStatus(null);
      setLiveMessage('');
    }, 2000);
  };

  const handleCopyLink = async (e) => {
    if (e) e.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
      announceCopy(true);
    } catch {
      try {
        if (legacyCopy(url)) {
          announceCopy(true);
        } else {
          announceCopy(false);
        }
      } catch {
        announceCopy(false);
      }
    }
  };

  const handlePlatformShare = (platform, e) => {
    if (e) e.stopPropagation();
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(title);
    let shareUrl = '';

    if (platform === 'whatsapp') {
      shareUrl = `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`;
    } else if (platform === 'linkedin') {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    } else if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleNativeShare = async (e) => {
    if (e) e.stopPropagation();
    if (typeof navigator === 'undefined' || !navigator.share) {
      handleCopyLink();
      return;
    }

    setIsSharingNative(true);
    try {
      const shareData = {
        title,
        text: excerpt ? `${title} — ${excerpt}` : title,
        url,
      };

      // Attempt to attach the blog cover thumbnail as a file when supported by the browser share sheet
      if (imageUrl && navigator.canShare) {
        try {
          const resp = await fetch(imageUrl, { mode: 'cors' });
          if (resp.ok) {
            const blob = await resp.blob();
            const ext = blob.type.includes('png') ? 'png' : 'jpg';
            const file = new File([blob], `bharatofficesetu-article.${ext}`, { type: blob.type || 'image/jpeg' });
            if (navigator.canShare({ files: [file] })) {
              shareData.files = [file];
            }
          }
        } catch {
          // Fall back cleanly to URL + Open Graph thumbnail share
        }
      }

      await navigator.share(shareData);
    } catch (err) {
      if (err?.name !== 'AbortError') {
        await handleCopyLink();
      }
    } finally {
      setIsSharingNative(false);
    }
  };

  const displayImage = imageUrl || '/logo.png';

  if (compact) {
    return (
      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={handleNativeShare}
          aria-label={`Share ${title}`}
          className="min-w-[32px] min-h-[32px] px-2.5 py-1 rounded-full border border-black/10 bg-white hover:bg-[#1B6B2F] hover:border-[#1B6B2F] hover:text-white text-black/60 text-[12px] font-semibold inline-flex items-center gap-1.5 transition-colors"
        >
          <Share2 size={13} aria-hidden="true" />
          <span>Share</span>
        </button>
      </div>
    );
  }

  return (
    <section
      aria-label="Share this article"
      className="mt-10 rounded-2xl bg-white border border-black/8 p-5 sm:p-6 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        {/* Visual Thumbnail Link Preview Card */}
        <div className="flex items-center gap-3.5 min-w-0 flex-1 bg-[#FAF9F5] border border-black/6 rounded-xl p-2.5">
          <img
            src={displayImage}
            alt={title || 'Article thumbnail'}
            className="w-20 h-14 sm:w-24 sm:h-16 rounded-lg object-cover shrink-0 bg-[#F4F3EE] border border-black/5"
            loading="lazy"
          />
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#1B6B2F] mb-0.5">
              bharatofficesetu.com
            </div>
            <div className="text-[13px] font-bold text-[#111110] line-clamp-1">
              {title}
            </div>
            {excerpt && (
              <div className="text-[12px] text-black/55 line-clamp-1 mt-0.5">
                {excerpt}
              </div>
            )}
          </div>
        </div>

        {/* Share Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleNativeShare}
            disabled={isSharingNative}
            className="min-h-[38px] px-4 py-2 rounded-full bg-[#1B6B2F] hover:bg-[#145324] text-white text-[13px] font-semibold inline-flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Share2 size={15} aria-hidden="true" />
            <span>{isSharingNative ? 'Preparing...' : 'Share'}</span>
          </button>

          <button
            type="button"
            onClick={(e) => handlePlatformShare('whatsapp', e)}
            aria-label="Share on WhatsApp"
            title="Share on WhatsApp"
            className="min-w-[38px] min-h-[38px] px-3 py-2 rounded-full border border-black/10 hover:bg-[#25D366] hover:border-[#25D366] hover:text-white text-black/70 text-[12px] font-semibold inline-flex items-center justify-center gap-1.5 transition-colors"
          >
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.893-4.448 9.893-9.892 0-2.64-1.027-5.12-2.827-6.919-1.801-1.801-4.281-2.828-6.92-2.828-5.448 0-9.893 4.448-9.893 9.892 0 1.967.545 3.84 1.58 5.495l-1.077 3.931 4.052-1.271z" />
            </svg>
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={(e) => handlePlatformShare('linkedin', e)}
            aria-label="Share on LinkedIn"
            title="Share on LinkedIn"
            className="min-w-[38px] min-h-[38px] px-2.5 py-2 rounded-full border border-black/10 hover:bg-[#0077b5] hover:border-[#0077b5] hover:text-white text-black/70 inline-flex items-center justify-center transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </button>

          <button
            type="button"
            onClick={(e) => handlePlatformShare('twitter', e)}
            aria-label="Share on X"
            title="Share on X"
            className="min-w-[38px] min-h-[38px] px-2.5 py-2 rounded-full border border-black/10 hover:bg-black hover:border-black hover:text-white text-black/70 inline-flex items-center justify-center transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </button>

          {/* Accessible Copy Link button with live status bubble */}
          <span className="copy-wrap">
            <button
              type="button"
              onClick={handleCopyLink}
              data-copied={copyStatus === 'copied' ? '' : undefined}
              data-failed={copyStatus === 'failed' ? '' : undefined}
              aria-label="Copy article link"
              className="copy-btn min-w-[38px] min-h-[38px] px-3 py-2 rounded-full border border-black/10 hover:border-[#1B6B2F] hover:text-[#1B6B2F] text-black/70 text-[12px] font-semibold inline-flex items-center justify-center gap-1.5 transition-colors"
            >
              {copyStatus === 'copied' ? (
                <Check size={14} aria-hidden="true" className="text-[#1B6B2F]" />
              ) : (
                <Copy size={14} aria-hidden="true" />
              )}
              <span>{copyStatus === 'copied' ? 'Copied' : 'Copy Link'}</span>
            </button>
            <span className="copy-tip" role="status">
              {liveMessage}
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}
