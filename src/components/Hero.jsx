import React from "react";
import InteractiveIndiaMap from "./InteractiveIndiaMap";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-screen pt-32 pb-20 px-6 mx-auto max-w-7xl flex flex-col lg:flex-row items-center gap-12 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-forest-mint/30 rounded-l-[100px] transform translate-x-1/4" />

      {/* Left Content */}
      <div className="flex-1 text-center lg:text-left">
        <motion.h1
          className="text-5xl lg:text-7xl font-serif text-forest leading-tight mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Bridging Businesses Across <span className="italic">Bharat</span>, Powering <span className="text-emerald-800">Global</span> Growth
        </motion.h1>

        <motion.p
          className="text-lg lg:text-xl text-forest/70 mb-10 max-w-2xl mx-auto lg:mx-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Comprehensive workspace, compliance, and growth solutions to scale your business seamlessly across India.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <button className="w-full sm:w-auto bg-forest text-white px-10 py-5 rounded-full font-bold text-lg shadow-xl shadow-forest/30 hover:scale-105 active:scale-95 transition-all">
            Find Your Office
          </button>
          <button className="w-full sm:w-auto border-2 border-forest text-forest px-10 py-5 rounded-full font-bold text-lg hover:bg-forest/5 active:scale-95 transition-all">
            Explore Services
          </button>
        </motion.div>
      </div>

      {/* Right Content - Map */}
      <div className="flex-1 w-full lg:min-h-[600px] flex items-center justify-center">
        <InteractiveIndiaMap />
      </div>
    </section>
  );
}
