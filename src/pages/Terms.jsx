import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import FooterBanner from '../components/FooterBanner';
import WhatsAppWidget from '../components/WhatsAppWidget';

export default function Terms() {
  useEffect(() => {
    document.title = "Terms and Conditions | Bharat Office Setu";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#F4F3EE] min-h-screen text-[#111110]">
      <Navbar />
      <main className="pt-[100px] pb-20 px-6 max-w-[800px] mx-auto">
        <h1 className="text-[32px] font-[800] mb-2 text-[#111110]">Terms and Conditions</h1>
        <p className="text-black/50 text-[14px] mb-8">Last Updated: July 2026</p>
        <div className="bg-white rounded-[16px] p-6 md:p-10 shadow-sm border border-black/5 flex flex-col gap-8 text-black/70 leading-relaxed">
          <section>
            <h2 className="text-[18px] font-bold text-[#111110] mb-3">1. Acceptance of Terms</h2>
            <p>By accessing the services of Bharat Office Setu Pvt. Ltd., you agree to be bound by these Terms and Conditions. Our platform provides documentation support, virtual office spaces, and startup advisory services.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#111110] mb-3">2. Description of Services & Limitation of Liability</h2>
            <p className="mb-3">Bharat Office Setu facilitates documentation and business support services.</p>
            <p className="font-medium text-black/90">MANDATORY DISCLAIMER: Virtual office, GST registration address, business address, coworking, and managed office services are provided subject to location availability, landlord consent, valid documentation, and applicable state laws. We do not guarantee "100% approval" or "instant statutory approval." Final approval of GST registration, company incorporation, or any statutory request remains strictly at the discretion of the relevant government authority.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#111110] mb-3">3. Client Responsibilities</h2>
            <p>The client must provide genuine, accurate, and legally valid KYC documents. Any rejection of statutory applications due to forged, incomplete, or inaccurate documentation supplied by the client is solely the client's responsibility.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#111110] mb-3">4. Service Continuity</h2>
            <p>Virtual office addresses are valid only for the duration of the active subscription. Failure to renew the service will result in the withdrawal of the NOC and subsequent intimation to the GST/ROC departments regarding the cessation of the address usage.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#111110] mb-3">5. Governing Law</h2>
            <p>These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in New Delhi, Delhi.</p>
          </section>
        </div>
      </main>
      <FooterBanner />
      <WhatsAppWidget />
    </div>
  );
}
