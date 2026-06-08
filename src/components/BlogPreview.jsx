import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPosts } from '../services/blog';

function SkeletonCard() {
  return (
    <div className="bg-white border border-black/10 rounded-2xl overflow-hidden shadow-sm animate-pulse">
      <div className="w-full h-[180px] bg-black/5" />
      <div className="p-4">
        <div className="w-16 h-4 bg-black/5 rounded-full mb-3" />
        <div className="w-full h-5 bg-black/5 rounded mb-2" />
        <div className="w-3/4 h-5 bg-black/5 rounded mb-4" />
        <div className="flex justify-between border-t border-black/5 pt-3 mt-4">
          <div className="w-16 h-3 bg-black/5 rounded" />
          <div className="w-16 h-3 bg-black/5 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function BlogPreview() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const data = await getAllPosts(1);
        if (data.error) throw new Error(data.error);
        // Take only top 3
        setPosts(data.posts.slice(0, 3));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  // Hide section on error or empty
  if (error || (!loading && posts.length === 0)) return null;

  const renderCover = (post) => {
    if (post.coverImage?.url) {
      return <img src={post.coverImage.url} alt={post.title} className="w-full h-full object-cover" />;
    }
    return (
      <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, rgba(27,107,47,0.08), rgba(244,131,31,0.06))' }}>
        <div className="w-full h-full flex items-center justify-center text-[#1B6B2F]/20">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
    <section className="py-16 md:py-24 bg-[#F9F8F5] px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1B6B2F]/5 border border-[#1B6B2F]/10 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#F4831F]" />
            <span className="text-[11px] font-bold text-[#1B6B2F] tracking-widest uppercase">FROM THE BLOG</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-[#111110] tracking-tight leading-[1.15]">
            Weekly <span className="text-[#F4831F]">insights</span> for <br className="hidden sm:block"/>
            growing businesses
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading ? (
            [...Array(3)].map((_, i) => <SkeletonCard key={i} />)
          ) : (
            posts.map(post => (
              <div
                key={post.id}
                onClick={() => navigate(`/blog/${post.slug}`)}
                className="group bg-white border border-black/5 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:border-[#1B6B2F]/20 flex flex-col"
              >
                <div className="w-full h-[180px] shrink-0 relative bg-[#F4F3EE]">
                   {renderCover(post)}
                </div>
                
                <div className="flex flex-col justify-between p-5 flex-1">
                  <div>
                    {post.tags?.[0] && (
                      <span className="inline-block px-2.5 py-1 rounded-full bg-[#1B6B2F]/10 text-[#1B6B2F] font-semibold text-[10px] mb-2.5">
                        {post.tags[0].name}
                      </span>
                    )}
                    <h3 className="font-bold text-[#111110] leading-snug mb-2 line-clamp-2 text-[16px]">
                      {post.title}
                    </h3>
                    <p className="text-black/50 leading-relaxed line-clamp-3 mb-4 text-[13px]">
                      {post.brief}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-black/5 mt-auto">
                    <span className="text-[11px] text-black/35">{formatDate(post.publishedAt)}</span>
                    <div className="flex items-center text-[11px] text-black/35 gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {post.readTimeInMinutes || 3} min read
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-12 flex justify-center">
          <button
            onClick={() => navigate('/blog')}
            className="h-12 px-8 rounded-full border border-[#1B6B2F]/25 text-[#1B6B2F] font-semibold text-[14px] flex items-center hover:bg-[#1B6B2F] hover:text-white transition-colors"
          >
            Read All Articles →
          </button>
        </div>
      </div>
    </section>
  );
}
