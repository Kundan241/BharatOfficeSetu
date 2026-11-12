import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FooterBanner from '../components/FooterBanner';
import WhatsAppWidget from '../components/WhatsAppWidget';
import BlogShareBar from '../components/BlogShareBar';
import { supabase } from '../services/supabaseClient';
import { normalizeBlogHtml, cleanBlogTitle, extractFaqFromHtml } from '../utils/blogFormat';
import { applySeoMeta } from '../utils/seo';

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .single();

        if (fetchError) throw fetchError;
        if (!data) throw new Error('Post not found');

        setPost(data);

        const cleanedTitle = cleanBlogTitle(data.title);
        const coverImg = data.image_url || data.cover_image || 'https://bharatofficesetu.com/logo.png';
        const canonicalUrl = `https://bharatofficesetu.com/blog/${data.slug || slug}`;

        applySeoMeta({
          title: `${cleanedTitle} | Bharat Office Setu`,
          description: data.excerpt || cleanedTitle,
          url: canonicalUrl,
          image: coverImg,
          type: 'article',
          publishedTime: data.created_at || '',
          section: data.category || 'Business Compliance',
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const cleanedTitle = useMemo(() => cleanBlogTitle(post?.title || ''), [post?.title]);
  const coverImage = post?.image_url || post?.cover_image || '';
  const normalizedContent = useMemo(() => normalizeBlogHtml(post?.content || ''), [post?.content]);
  const faqs = useMemo(() => extractFaqFromHtml(normalizedContent), [normalizedContent]);

  const wordCount = useMemo(() => {
    if (!normalizedContent) return 0;
    const text = normalizedContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return text ? text.split(' ').length : 0;
  }, [normalizedContent]);

  const readTime = useMemo(() => Math.max(1, Math.ceil(wordCount / 200)), [wordCount]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getInitials = (name) => (name ? name.charAt(0).toUpperCase() : '?');

  const canonicalUrl = `https://bharatofficesetu.com/blog/${post?.slug || slug}`;

  const jsonLdSchemas = useMemo(() => {
    if (!post) return [];
    const schemas = [
      {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl,
        },
        headline: cleanedTitle,
        description: post.excerpt || cleanedTitle,
        image: coverImage ? [coverImage] : ['https://bharatofficesetu.com/logo.png'],
        datePublished: post.created_at,
        dateModified: post.updated_at || post.created_at,
        articleSection: post.category || 'Business Compliance',
        wordCount: wordCount || undefined,
        inLanguage: 'en-IN',
        author: {
          '@type': 'Organization',
          name: 'Bharat Office Setu',
          url: 'https://bharatofficesetu.com',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Bharat Office Setu',
          url: 'https://bharatofficesetu.com',
          logo: {
            '@type': 'ImageObject',
            url: 'https://bharatofficesetu.com/logo.png',
          },
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://bharatofficesetu.com/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: 'https://bharatofficesetu.com/blog',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: cleanedTitle,
            item: canonicalUrl,
          },
        ],
      },
    ];

    if (faqs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer,
          },
        })),
      });
    }

    return schemas;
  }, [post, canonicalUrl, cleanedTitle, coverImage, wordCount, faqs]);

  return (
    <div className="bg-[#F4F3EE] min-h-screen text-[#111110] overflow-x-hidden">
      <Navbar />

      {jsonLdSchemas.map((schema, idx) => (
        <script key={idx} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}

      <main className="pt-[116px] pb-24 px-5 sm:px-6">
        <div className="max-w-[740px] mx-auto">
          <button
            type="button"
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 text-[13px] text-[#111110]/55 hover:text-[#111110] transition-colors mb-7 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Blog
          </button>

          {loading ? (
            <div className="flex justify-center items-center py-32">
              <div className="w-10 h-10 border-4 border-[#1B6B2F]/20 border-t-[#1B6B2F] rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500 font-medium">
              Error: {error}
            </div>
          ) : post ? (
            <article itemScope itemType="https://schema.org/BlogPosting">
              {/* Header */}
              <header className="mb-8">
                {post.category && (
                  <span className="inline-block px-3 py-1 rounded-full bg-[#1B6B2F]/10 text-[#1B6B2F] font-semibold text-[11px] mb-3">
                    {post.category}
                  </span>
                )}

                <h1
                  itemProp="headline"
                  className="font-extrabold text-[clamp(1.75rem,3.6vw,2.5rem)] leading-[1.18] text-[#111110] mb-5 tracking-tight"
                  style={{ textWrap: 'balance' }}
                >
                  {cleanedTitle}
                </h1>

                {post.excerpt && (
                  <p
                    itemProp="description"
                    className="text-[1.0625rem] leading-[1.65] text-black/60 mb-6"
                    style={{ textWrap: 'pretty' }}
                  >
                    {post.excerpt}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-black/8">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <div className="flex items-center gap-2" itemProp="author" itemScope itemType="https://schema.org/Organization">
                      <div className="w-8 h-8 rounded-full bg-[#1B6B2F]/10 text-[#1B6B2F] flex items-center justify-center font-bold text-xs">
                        {getInitials('Bharat Office Setu')}
                      </div>
                      <span itemProp="name" className="text-[14px] font-semibold text-[#111110]">Bharat Office Setu</span>
                    </div>

                    <span className="w-1 h-1 rounded-full bg-black/20" />

                    <time dateTime={post.created_at} itemProp="datePublished" className="text-[14px] text-black/50">
                      {formatDate(post.created_at)}
                    </time>

                    <span className="w-1 h-1 rounded-full bg-black/20" />

                    <span className="text-[14px] text-black/50 flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {readTime} min read
                    </span>
                  </div>

                  {/* Quick top share trigger */}
                  <BlogShareBar
                    compact
                    title={cleanedTitle}
                    excerpt={post.excerpt}
                    imageUrl={coverImage}
                    url={canonicalUrl}
                  />
                </div>
              </header>

              {/* Cover Image */}
              {coverImage && (
                <figure className="mb-10">
                  <img
                    src={coverImage}
                    alt={cleanedTitle}
                    itemProp="image"
                    className="w-full max-h-[440px] object-cover rounded-2xl shadow-sm bg-white"
                  />
                </figure>
              )}

              {/* Normalized, Sanitized Article Content */}
              <div
                itemProp="articleBody"
                className="article-content max-w-none"
                dangerouslySetInnerHTML={{ __html: normalizedContent }}
              />

              {/* Rich Share Card with Blog Thumbnail Preview */}
              <BlogShareBar
                title={cleanedTitle}
                excerpt={post.excerpt}
                imageUrl={coverImage}
                url={canonicalUrl}
              />

              {/* Author Box */}
              <div className="mt-8 p-6 bg-white border border-black/5 rounded-2xl flex flex-col sm:flex-row gap-5 items-start shadow-sm">
                <div className="w-14 h-14 rounded-full bg-[#1B6B2F]/10 text-[#1B6B2F] flex items-center justify-center font-bold text-xl shrink-0">
                  {getInitials('Bharat Office Setu')}
                </div>

                <div>
                  <div className="text-[11px] text-black/45 tracking-wider uppercase mb-1 font-semibold">Written by</div>
                  <div className="text-[16px] font-bold text-[#111110] mb-1.5">Bharat Office Setu Editorial Team</div>
                  <div className="text-[14px] text-black/60 leading-relaxed max-w-lg">
                    Practical guides on Virtual Offices, multi-state GST registration, MCA company incorporation, and business compliance across India.
                  </div>
                </div>
              </div>

              {/* Call to action */}
              <div
                className="mt-10 rounded-2xl p-8 text-center border shadow-sm"
                style={{
                  background: 'linear-gradient(135deg, rgba(27,107,47,0.06), rgba(244,131,31,0.04))',
                  borderColor: 'rgba(27,107,47,0.1)',
                }}
              >
                <h2 className="text-[22px] font-extrabold text-[#111110] mb-2">
                  Need help with {post.category || 'business compliance'}?
                </h2>
                <p className="text-[15px] text-black/60 mb-6">
                  Our team handles everything — Rent Agreement, NOC, Utility Bill & GST/MCA filing across 28+ Indian states.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/#consultation')}
                  className="bg-[#1B6B2F] hover:bg-[#111110] text-white min-h-[48px] px-7 py-3 rounded-full font-bold text-[14px] transition-colors"
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
