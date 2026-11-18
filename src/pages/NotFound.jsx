import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, BookOpen, MessageCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import FooterBanner from '../components/FooterBanner';
import WhatsAppWidget from '../components/WhatsAppWidget';
import { applySeoMeta } from '../utils/seo';

export default function NotFound() {
  useEffect(() => {
    applySeoMeta({
      title: '404 - Page Not Found | Bharat Office Setu',
      description: 'The page you are looking for does not exist or has been moved. Explore our virtual office plans, compliance services, and business guides.',
      url: 'https://www.bharatofficesetu.com/404',
      image: 'https://www.bharatofficesetu.com/logo.png',
      noindex: true,
    });
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#F4F3EE] min-h-screen text-[#111110] flex flex-col justify-between">
      <Navbar />

      <main className="pt-[140px] pb-24 px-6 max-w-[700px] mx-auto text-center flex flex-col items-center">
        <span className="text-[12px] font-bold uppercase tracking-widest text-[#1B6B2F] bg-[#EBF7EE] border border-[rgba(27,107,47,0.2)] px-3.5 py-1 rounded-full mb-6">
          HTTP 404 — Not Found
        </span>

        <h1 className="text-4xl md:text-5xl font-[800] tracking-tight text-[#111110] mb-4">
          Oops, this page isn't available
        </h1>

        <p className="text-base text-black/60 max-w-[500px] mb-8 leading-relaxed">
          The link you clicked may be broken, or the page may have been moved or updated.
          Let's help you get back on track.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="h-[46px] px-6 rounded-full bg-[#1B6B2F] text-white font-semibold text-[14px] hover:bg-[#145324] transition-all flex items-center gap-2 shadow-xs"
          >
            <Home size={17} />
            <span>Go to Homepage</span>
          </Link>

          <Link
            to="/blog"
            className="h-[46px] px-6 rounded-full bg-white border border-[rgba(17,17,16,0.15)] text-[#111110] font-semibold text-[14px] hover:bg-[#FAF9F5] transition-all flex items-center gap-2"
          >
            <BookOpen size={17} className="text-[#1B6B2F]" />
            <span>Read Guides & Blog</span>
          </Link>

          <a
            href="https://wa.me/917683002685"
            target="_blank"
            rel="noopener noreferrer"
            className="h-[46px] px-6 rounded-full bg-[#25D366] text-white font-semibold text-[14px] hover:bg-[#20bd5a] transition-all flex items-center gap-2 shadow-xs"
          >
            <MessageCircle size={17} />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </main>

      <FooterBanner />
      <WhatsAppWidget />
    </div>
  );
}
