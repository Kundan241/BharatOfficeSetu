import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function FooterBanner() {
  return (
    <section className="bg-forest text-white py-24 relative overflow-hidden" id="contact">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-emerald-500 via-transparent to-transparent" />
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-serif mb-6 leading-tight">Ready to bridge your business to success?</h2>
        <p className="text-lg md:text-xl text-forest-sage mb-10 max-w-2xl mx-auto">
          Join thousands of enterprises growing with Bharat Office Setu. Let's discuss your custom workspace and compliance needs.
        </p>
        <button className="bg-white text-forest px-10 py-5 rounded-full font-bold text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 mx-auto">
          Book a Free Consultation
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 mt-32 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-forest-sage/60">
        <p>&copy; {new Date().getFullYear()} Bharat Office Setu Pvt Ltd. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </section>
  );
}
