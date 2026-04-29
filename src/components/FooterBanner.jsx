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
      <footer className="bg-[#111110] py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-[13px] text-white/50">
          <p>&copy; {new Date().getFullYear()} Bharat Office Setu Pvt Ltd. All rights reserved.</p>
          <div className="flex gap-8 mt-6 md:mt-0 font-medium">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </>
  );
}
