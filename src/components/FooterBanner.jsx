import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function FooterBanner() {
  return (
    <>
      <section
        className="relative overflow-hidden bg-[#1B6B2F]"
        id="contact"
      >
        {/* Subtle geometric overlay to break the solid color but no AI slop */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />

        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#F4831F]" />

        {/* CTA Section */}
        <div className="py-24 md:py-32 relative">
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[12px] font-bold uppercase tracking-[0.2em] mb-4 text-[#8BC34A]"
            >
              Get Started Today
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tight"
            >
              Ready to bridge your<br />business to success?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg mb-10 max-w-2xl mx-auto text-white/80 leading-relaxed"
            >
              Join thousands of enterprises growing with Bharat Office Setu. Let's discuss your custom workspace and compliance needs.
            </motion.p>

            <motion.a
              href="mailto:partners@bharatofficesetu.com"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-bold text-[13px] uppercase tracking-widest transition-all bg-[#F4831F] text-white hover:bg-[#E07616] shadow-2xl shadow-[#F4831F]/20"
            >
              Book a Free Consultation
              <ArrowRight className="w-5 h-5" />
            </motion.a>
          </div>
        </div>
      </section>

      {/* Footer bottom */}
      <footer className="bg-[#111110] pt-16 pb-8 border-t border-white/5 text-[rgba(255,255,255,0.6)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Column 1: Brand */}
            <div>
              <div className="text-white text-2xl font-black mb-4">BOS</div>
              <p className="mb-6 text-[14px]">Bharat Office Setu — Your partner for premium virtual offices and business compliance across India.</p>
              <a href="https://wa.me/917683002685" target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-2 rounded-full border border-white/20 text-white hover:bg-white hover:text-[#111110] transition-colors font-medium text-[13px]">
                Chat on WhatsApp
              </a>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-[12px]">Quick Links</h4>
              <ul className="space-y-3 text-[14px]">
                <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="/#services" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="/#workspaces" className="hover:text-white transition-colors">Workspaces</a></li>
                <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="/#about" className="hover:text-white transition-colors">About</a></li>
              </ul>
            </div>

            {/* Column 3: Legal */}
            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-[12px]">Legal</h4>
              <ul className="space-y-3 text-[14px]">
                <li><a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms-and-conditions" className="hover:text-white transition-colors">Terms and Conditions</a></li>
                <li><a href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</a></li>
              </ul>
            </div>

            {/* Column 4: Contact & Registered Office */}
            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-[12px]">Contact & Office</h4>
              <div className="text-[14px] space-y-2">
                <p className="font-bold text-white">Bharat Office Setu Pvt. Ltd.</p>
                <p>CIN: U68200DL2025PTC456641</p>
                <p>Registered Address: B-1 F/F GARAGE PORTION, OPP-SAVITRI CINEMA, Greater Kailash, South Delhi, New Delhi, Delhi, India, 110048</p>
                <p>Phone: +91 76830 02685</p>
                <p>Email: <a href="mailto:support@bharatofficesetu.com" className="hover:text-white transition-colors">support@bharatofficesetu.com</a></p>
                <p>Email: <a href="mailto:compliance@bharatofficesetu.com" className="hover:text-white transition-colors">compliance@bharatofficesetu.com</a></p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col gap-4">
            <p className="text-[10px] leading-relaxed text-white/30 text-justify">
              Disclaimer: Virtual office, GST registration address, coworking, managed office, and related documentation services are provided subject to location availability, landlord consent, valid documentation, applicable laws, state-wise requirements, departmental verification, and approval by the concerned government authority. Bharat Office Setu facilitates documentation and business support services. Final approval of GST registration, business registration, or any statutory approval remains at the discretion of the relevant authority.
            </p>
            <div className="flex flex-col md:flex-row justify-between items-center text-[12px]">
              <p>&copy; {new Date().getFullYear()} Bharat Office Setu Pvt. Ltd. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
