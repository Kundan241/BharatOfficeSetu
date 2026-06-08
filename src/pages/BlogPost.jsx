import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FooterBanner from '../components/FooterBanner';
import WhatsAppWidget from '../components/WhatsAppWidget';
import { getPostBySlug } from '../services/blog';

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const data = await getPostBySlug(slug);
        if (data.error) throw new Error(data.error);
        if (!data.post) throw new Error("Post not found");
        
        setPost(data.post);
        
        // SEO Head injection
        document.title = `${data.post.seo?.title || data.post.title} | Bharat Office Setu`;
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
          metaDescription = document.createElement('meta');
          metaDescription.name = "description";
          document.head.appendChild(metaDescription);
        }
        metaDescription.content = data.post.seo?.description || data.post.brief || "";
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [slug]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  const handleShare = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(post?.title || "");
    let shareUrl = "";
    
    if (platform === 'linkedin') shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    if (platform === 'twitter') shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    if (platform === 'whatsapp') shareUrl = `https://wa.me/?text=${text} ${url}`;
    
    if (shareUrl) window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-[#F4F3EE] min-h-screen text-[#111110]">
      <Navbar />
      
      {post && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "datePublished": post.publishedAt,
            "dateModified": post.updatedAt || post.publishedAt,
            "author": {
              "@type": "Person",
              "name": post.author?.name
            },
            "publisher": {
              "@type": "Organization",
              "name": "Bharat Office Setu"
            },
            "image": post.coverImage?.url,
            "description": post.brief
          })}
        </script>
      )}

      <main className="pt-[120px] pb-24 px-6">
        <div className="max-w-[720px] mx-auto">
          <button 
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 text-[13px] text-[#111110]/45 hover:text-[#111110] transition-colors mb-8 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Blog
          </button>

          {loading ? (
            <div className="animate-pulse">
              <div className="w-24 h-6 bg-black/5 rounded-full mb-4" />
              <div className="w-full h-10 bg-black/5 rounded-lg mb-3" />
              <div className="w-3/4 h-10 bg-black/5 rounded-lg mb-6" />
              <div className="flex items-center gap-4 mb-10">
                <div className="w-8 h-8 rounded-full bg-black/5" />
                <div className="w-32 h-4 bg-black/5 rounded" />
              </div>
              <div className="w-full h-[400px] bg-black/5 rounded-xl mb-10" />
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500 font-medium">
              Error: {error}
            </div>
          ) : post ? (
            <article>
              {/* Header */}
              <header className="mb-10">
                {post.tags?.[0] && (
                  <span className="inline-block px-3 py-1 rounded-full bg-[#1B6B2F]/10 text-[#1B6B2F] font-semibold text-[11px] mb-3">
                    {post.tags[0].name}
                  </span>
                )}
                
                <h1 className="font-extrabold text-[clamp(28px,4vw,42px)] leading-[1.15] text-[#111110] mb-5 tracking-tight">
                  {post.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6">
                  <div className="flex items-center gap-2">
                    {post.author?.profilePicture ? (
                      <img src={post.author.profilePicture} alt={post.author.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#1B6B2F]/10 text-[#1B6B2F] flex items-center justify-center font-bold text-xs">
                        {getInitials(post.author?.name)}
                      </div>
                    )}
                    <span className="text-[14px] font-semibold text-[#111110]">{post.author?.name}</span>
                  </div>
                  
                  <span className="w-1 h-1 rounded-full bg-black/20" />
                  
                  <span className="text-[14px] text-black/45">{formatDate(post.publishedAt)}</span>
                  
                  <span className="w-1 h-1 rounded-full bg-black/20" />
                  
                  <span className="text-[14px] text-black/45 flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {post.readTimeInMinutes || 3} min read
                  </span>
                </div>
              </header>

              {/* Cover Image */}
              {post.coverImage?.url && (
                <img 
                  src={post.coverImage.url} 
                  alt={post.title} 
                  className="w-full max-h-[420px] object-cover rounded-xl mb-10 shadow-sm"
                />
              )}

              {/* Content Rendered */}
              <div 
                className="article-content"
                dangerouslySetInnerHTML={{ __html: post.content.html }} 
              />

              {/* Share Row */}
              <div className="mt-10 flex items-center gap-3">
                <span className="text-[13px] text-black/45 mr-1">Share this article:</span>
                
                <button onClick={() => handleShare('linkedin')} className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center hover:bg-[#0077b5] hover:border-[#0077b5] hover:text-white text-black/60 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </button>
                <button onClick={() => handleShare('twitter')} className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:border-black hover:text-white text-black/60 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </button>
                <button onClick={() => handleShare('whatsapp')} className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center hover:bg-[#25D366] hover:border-[#25D366] hover:text-white text-black/60 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.893-4.448 9.893-9.892 0-2.64-1.027-5.12-2.827-6.919-1.801-1.801-4.281-2.828-6.92-2.828-5.448 0-9.893 4.448-9.893 9.892 0 1.967.545 3.84 1.58 5.495l-1.077 3.931 4.052-1.271z"/></svg>
                </button>
              </div>

              {/* Author Box */}
              {post.author && (
                <div className="mt-10 p-6 bg-white border border-black/5 rounded-2xl flex flex-col sm:flex-row gap-5 items-start shadow-sm">
                  {post.author.profilePicture ? (
                    <img src={post.author.profilePicture} alt={post.author.name} className="w-14 h-14 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-[#1B6B2F]/10 text-[#1B6B2F] flex items-center justify-center font-bold text-xl shrink-0">
                      {getInitials(post.author.name)}
                    </div>
                  )}
                  
                  <div>
                    <div className="text-[11px] text-black/45 tracking-wider uppercase mb-1 font-semibold">Written by</div>
                    <div className="text-[16px] font-bold text-[#111110] mb-2">{post.author.name}</div>
                    {post.author.bio?.html && (
                      <div 
                        className="text-[14px] text-black/60 leading-relaxed max-w-lg"
                        dangerouslySetInnerHTML={{ __html: post.author.bio.html }}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Call to action */}
              <div 
                className="mt-12 rounded-2xl p-8 text-center border shadow-sm"
                style={{
                  background: 'linear-gradient(135deg, rgba(27,107,47,0.06), rgba(244,131,31,0.04))',
                  borderColor: 'rgba(27,107,47,0.1)'
                }}
              >
                <h3 className="text-[22px] font-extrabold text-[#111110] mb-2">
                  Need help with {post.tags?.[0]?.name || 'business compliance'}?
                </h3>
                <p className="text-[15px] text-black/55 mb-6">
                  Our team handles everything — fast, compliant, and hassle-free.
                </p>
                <button 
                  onClick={() => navigate('/#consultation')}
                  className="bg-[#1B6B2F] hover:bg-[#111110] text-white h-12 px-7 rounded-full font-bold text-[14px] transition-colors"
                >
                  Get a Free Consultation →
                </button>
              </div>

            </article>
          ) : null}
        </div>
      </main>

      <FooterBanner />
      <WhatsAppWidget />
    </div>
  );
}
