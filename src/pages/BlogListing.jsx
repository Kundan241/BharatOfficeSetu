import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FooterBanner from '../components/FooterBanner';
import WhatsAppWidget from '../components/WhatsAppWidget';
import { supabase } from '../services/supabaseClient';

const TAGS = ['All', 'GST', 'Virtual Office', 'Company Setup', 'Compliance', 'Expansion'];

export default function BlogListing() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState('All');
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "Insights & Guides | Bharat Office Setu";
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = 'https://bharatofficesetu.com/blog';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const fetchPosts = async (tag, pageNum, append = false) => {
    if (!append) setLoading(true);
    else setLoadingMore(true);
    
    setError(null);
    try {
      let query = supabase
        .from('blog_posts')
        .select('*', { count: 'exact' })
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (tag !== 'All') {
        query = query.eq('category', tag);
      }

      // Pagination setup (9 posts per page)
      const limit = 9;
      const from = (pageNum - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error: supabaseError, count } = await query;
      
      if (supabaseError) throw new Error(supabaseError.message);
      
      setHasNextPage(to < count - 1);
      setPosts(prev => append ? [...prev, ...data] : data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch blog posts. Please try again later.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchPosts(activeTag, 1, false);
  }, [activeTag]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(activeTag, nextPage, true);
  };

  const renderCover = (post) => {
    const imageUrl = post.cover_image || post.image_url;
    if (imageUrl) {
      return <img src={imageUrl} alt={post.title} className="w-full h-full object-cover" />;
    }
    return (
      <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, rgba(27,107,47,0.08), rgba(244,131,31,0.06))' }}>
        <div className="w-full h-full flex items-center justify-center text-[#1B6B2F]/20">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5L18.5 7H20" />
          </svg>
        </div>
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="bg-[#F4F3EE] min-h-screen text-[#111110]">
      <Navbar />
      
      {/* JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "Bharat Office Setu Blog",
          "description": "Weekly guides on GST, company registration, virtual offices and business expansion across India",
          "url": "https://bharatofficesetu.com/blog",
          "publisher": {
            "@type": "Organization",
            "name": "Bharat Office Setu",
            "logo": "https://bharatofficesetu.com/logo.png"
          }
        })}
      </script>

      <main className="pt-[100px] pb-20">
        {/* Hero Section */}
        <div className="bg-white px-6 py-12 md:py-[60px] md:px-12 border-b border-black/5">
          <div className="max-w-[1200px] mx-auto flex flex-col items-center text-center">
            <div 
              className="mb-4 rounded-full px-3 py-1 font-bold tracking-widest text-[#1B6B2F]" 
              style={{ background: 'rgba(27,107,47,0.08)', border: '1px solid rgba(27,107,47,0.15)', fontSize: '10px' }}
            >
              WEEKLY INSIGHTS
            </div>
            <h1 className="font-extrabold text-[clamp(32px,4vw,48px)] leading-[1.1] mb-3 text-[#111110]">
              Business Compliance & <br className="hidden sm:block"/>
              Workspace <span className="text-[#F4831F]">Insights</span>
            </h1>
            <p className="text-[16px] text-[#111110]/45 mt-3 max-w-[520px]">
              Weekly guides on GST, company registration, virtual offices and business expansion across India
            </p>
          </div>
        </div>

        {/* Tag Filter Row */}
        <div className="max-w-[1200px] mx-auto px-6 mt-8 overflow-x-auto no-scrollbar pb-2">
          <div className="flex items-center gap-3 w-max">
            {TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-4 py-1.5 rounded-full text-[13px] font-medium border transition-colors whitespace-nowrap ${
                  activeTag === tag 
                    ? 'bg-[#1B6B2F] text-white border-[#1B6B2F] font-semibold'
                    : 'bg-white border-black/10 text-black/55 hover:border-black/20'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        <div className="max-w-[1200px] mx-auto px-6 py-8 md:py-10">
          {error && !loading && (
            <div className="bg-red-50 text-red-500 p-4 rounded-lg text-center mb-6">
              {error}
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center py-32">
              <div className="w-10 h-10 border-4 border-[#1B6B2F]/20 border-t-[#1B6B2F] rounded-full animate-spin"></div>
            </div>
          ) : posts.length === 0 && !error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <svg className="w-8 h-8 text-black/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <h3 className="text-[15px] font-semibold text-black/60">No articles yet</h3>
              <p className="text-[13px] text-black/40 mt-1">Check back soon — we publish weekly</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => {
                const isFeatured = index === 0 && activeTag === 'All' && page === 1;
                
                return (
                  <div
                    key={post.id}
                    onClick={() => navigate(`/blog/${post.slug}`)}
                    className={`group bg-white border border-black/5 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:border-[#1B6B2F]/20 flex flex-col ${isFeatured ? 'lg:col-span-3 lg:flex-row' : ''}`}
                  >
                    <div className={`${isFeatured ? 'lg:w-[55%] lg:h-[360px]' : 'w-full h-[200px]'} shrink-0 relative bg-[#F4F3EE]`}>
                       {renderCover(post)}
                    </div>
                    
                    <div className={`flex flex-col justify-between ${isFeatured ? 'lg:w-[45%] lg:p-10 p-6' : 'p-5'} flex-1`}>
                      <div>
                        {post.category && (
                          <span className="inline-block px-2.5 py-1 rounded-full bg-[#1B6B2F]/10 text-[#1B6B2F] font-semibold text-[11px] mb-2.5">
                            {post.category}
                          </span>
                        )}
                        <h2 className={`font-bold text-[#111110] leading-snug mb-2 line-clamp-2 ${isFeatured ? 'text-[24px] lg:text-[28px]' : 'text-[17px]'}`}>
                          {post.title}
                        </h2>
                        <p className={`text-black/50 leading-relaxed line-clamp-3 mb-4 ${isFeatured ? 'text-[15px]' : 'text-[14px]'}`}>
                          {post.excerpt || post.brief}
                        </p>
                      </div>
                      
                      <div>
                        {isFeatured && (
                          <button className="h-10 px-5 rounded-full border border-[#1B6B2F]/25 text-[#1B6B2F] font-semibold text-[13px] mb-6 flex items-center group-hover:bg-[#1B6B2F] group-hover:text-white transition-colors">
                            Read Article <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                          </button>
                        )}
                        
                        <div className="flex items-center justify-between pt-3 border-t border-black/5 mt-auto">
                          <span className="text-[12px] text-black/35">{formatDate(post.created_at || post.publishedAt)}</span>
                          <div className="flex items-center text-[12px] text-black/35 gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {post.read_time || post.readTimeInMinutes || 3} min read
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Load More */}
          {!loading && hasNextPage && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="w-full max-w-sm h-12 rounded-full border border-black/10 bg-white font-semibold text-[14px] text-black/60 hover:bg-black/5 hover:text-black transition-colors flex items-center justify-center gap-2"
              >
                {loadingMore ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black/60 rounded-full animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More Articles'
                )}
              </button>
            </div>
          )}
        </div>
      </main>
      
      <FooterBanner />
      <WhatsAppWidget />
    </div>
  );
}
