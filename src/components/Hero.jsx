import React from "react";
import InteractiveIndiaMap from "./InteractiveIndiaMap";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      className="relative min-h-screen overflow-hidden flex flex-col noise-overlay"
      style={{
        background: "linear-gradient(160deg, #0a1628 0%, #0f2038 40%, #132744 70%, #0a1628 100%)",
      }}
    >
      {/* Ambient glow effects */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "600px",
          height: "600px",
          top: "-200px",
          right: "-100px",
          background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: "500px",
          height: "500px",
          bottom: "-100px",
          left: "-100px",
          background: "radial-gradient(circle, rgba(96,165,250,0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Subtle dot grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        }}
      />

      {/* Animated Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-600/10 blur-[80px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            x: [0, -40, 0],
            y: [0, 40, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-cyan-600/10 blur-[100px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            y: [0, 60, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-24 left-1/4 w-72 h-72 rounded-full bg-indigo-600/10 blur-[90px]"
        />
      </div>

      {/* Hero Title — compact, powerful */}
      <div className="relative z-10 text-center pt-28 md:pt-32 pb-4 px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-4"
        >
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter shimmer-text"
            style={{ fontFamily: "'Outfit', sans-serif", lineHeight: 0.9 }}
          >
            Bharat Office Setu
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center justify-center gap-4 mb-6"
        >
          <div className="h-px w-8 md:w-16 bg-gradient-to-r from-transparent to-blue-400/40" />
          <p
            className="text-[11px] md:text-sm font-bold tracking-[0.3em] uppercase"
            style={{ color: "rgba(148,163,184,0.9)" }}
          >
            Digital Infrastructure for the New India
          </p>
          <div className="h-px w-8 md:w-16 bg-gradient-to-l from-transparent to-blue-400/40" />
        </motion.div>

        {/* Quick stats ribbon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center justify-center gap-6 md:gap-10 mt-4"
        >
          {[
            { num: "28+", label: "States" },
            { num: "150+", label: "Cities" },
            { num: "5000+", label: "Clients" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="text-center"
            >
              <span
                className="text-xl md:text-2xl font-black block"
                style={{ color: "#60a5fa", fontFamily: "'Outfit', sans-serif" }}
              >
                {stat.num}
              </span>
              <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: "rgba(148,163,184,0.6)" }}>
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Interactive Map — fills remaining space */}
      <div className="relative z-10 flex-1 mt-2">
        <InteractiveIndiaMap />
      </div>
    </section>
  );
}
