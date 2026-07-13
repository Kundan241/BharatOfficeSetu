import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import FooterBanner from '../components/FooterBanner';
import WhatsAppWidget from '../components/WhatsAppWidget';

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = "Privacy Policy | Bharat Office Setu";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#F4F3EE] min-h-screen text-[#111110]">
      <Navbar />
      <main className="pt-[100px] pb-20 px-6 max-w-[800px] mx-auto">
        <h1 className="text-[32px] font-[800] mb-8 text-[#111110]">Privacy Policy</h1>
        <div className="bg-white rounded-[16px] p-6 md:p-10 shadow-sm border border-black/5">
          <p className="text-black/70 leading-relaxed">
            [Privacy Policy Content Goes Here]
          </p>
        </div>
      </main>
      <FooterBanner />
      <WhatsAppWidget />
    </div>
  );
}
