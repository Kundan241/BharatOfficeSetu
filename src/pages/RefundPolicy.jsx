import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import FooterBanner from '../components/FooterBanner';
import WhatsAppWidget from '../components/WhatsAppWidget';

export default function RefundPolicy() {
  useEffect(() => {
    document.title = "Refund Policy | Bharat Office Setu";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#F4F3EE] min-h-screen text-[#111110]">
      <Navbar />
      <main className="pt-[100px] pb-20 px-6 max-w-[800px] mx-auto">
        <h1 className="text-[32px] font-[800] mb-2 text-[#111110]">Refund and Cancellation Policy</h1>
        <p className="text-black/50 text-[14px] mb-8">Last Updated: July 2026</p>
        <div className="bg-white rounded-[16px] p-6 md:p-10 shadow-sm border border-black/5 flex flex-col gap-8 text-black/70 leading-relaxed">
          <section>
            <h2 className="text-[18px] font-bold text-[#111110] mb-3">1. Professional Fees Refund</h2>
            <p className="mb-3">Bharat Office Setu Pvt. Ltd. strives to provide transparent and efficient compliance services.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>A full refund of professional fees will be initiated if a cancellation request is made before our team begins processing your documentation or drafting your agreements.</li>
              <li>Once the drafting of documents (such as Rent Agreements or NOCs) has commenced, or applications have been prepared, a maximum of 50% of the professional fee may be refunded, evaluated on a case-by-case basis.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#111110] mb-3">2. Government Fees and Stamp Duty (Strictly Non-Refundable)</h2>
            <p>Under no circumstances can we refund any government challans, statutory registration fees, or stamp duty charges once they have been paid to the respective government authority or vendor on your behalf.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#111110] mb-3">3. Rejections by Government Authorities</h2>
            <p>Our services are advisory and preparatory in nature. We charge for our time, expertise, and documentation support. If a government department rejects a GST or Company Registration application despite correct documentation, our professional fees remain non-refundable.</p>
          </section>

          <section>
            <h2 className="text-[18px] font-bold text-[#111110] mb-3">4. Subscription Cancellations (Virtual Office)</h2>
            <p>Virtual office subscriptions can be canceled with a 30-day written notice. Mid-term cancellations of annual plans do not qualify for pro-rated refunds. Upon cancellation, the client must immediately remove our address from their GST and ROC records.</p>
          </section>
        </div>
      </main>
      <FooterBanner />
      <WhatsAppWidget />
    </div>
  );
}
