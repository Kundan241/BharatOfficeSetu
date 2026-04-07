import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function FooterBanner() {
  return (
    <section
      className="relative overflow-hidden"
      id="contact"
      style={{
        background: "linear-gradient(180deg, #132744 0%, #0a1628 100%)",
      }}
    >
      {/* Gradient line separator */}
      <div className="h-px w-full" style={{
        background: "linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.3) 50%, transparent 100%)",
      }} />

      {/* CTA Section */}
      <div className="py-24 relative">
        {/* Ambient glow */}
        <div className="absolute pointer-events-none" style={{
          width: "500px", height: "300px", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(ellipse, rgba(59,130,246,0.08) 0%, transparent 70%)",
          filter: "blur(40px)",
        }} />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold uppercase tracking-[0.3em] mb-4"
            style={{ color: "#60a5fa" }}
          >
            Get Started Today
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Ready to bridge your<br />business to success?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-base md:text-lg mb-10 max-w-2xl mx-auto"
            style={{ color: "rgba(148,163,184,0.6)" }}
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
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-bold text-sm uppercase tracking-[0.15em] transition-all"
            style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)",
              color: "#ffffff",
              boxShadow: "0 8px 30px rgba(59,130,246,0.35), 0 0 60px rgba(59,130,246,0.1)",
            }}
          >
            Book a Free Consultation
            <ArrowRight className="w-4 h-4" />
          </motion.a>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="max-w-7xl mx-auto px-6 pb-8 pt-8 flex flex-col md:flex-row justify-between items-center text-xs"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          color: "rgba(148,163,184,0.35)",
        }}
      >
        <p>&copy; {new Date().getFullYear()} Bharat Office Setu Pvt Ltd. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-white/60 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white/60 transition-colors">Terms of Service</a>
        </div>
      </div>
    </section>
  );
}
