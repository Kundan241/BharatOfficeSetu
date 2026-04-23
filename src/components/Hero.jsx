import React, { useState } from "react";
import InteractiveIndiaMap, { LocationCard } from "./InteractiveIndiaMap";
import { motion, AnimatePresence } from "framer-motion";

export default function Hero() {
  const [activeState, setActiveState] = useState("Maharashtra");

  return (
    <section
      className="relative min-h-screen overflow-hidden flex flex-col noise-overlay"
      style={{
        background: "linear-gradient(160deg, #05050A 0%, #0B0F19 45%, #080C16 75%, #05050A 100%)",
      }}
    >
      {/* Ambient mesh blobs — Electric Indigo + Deep Magenta */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "700px",
          height: "700px",
          top: "-220px",
          right: "-120px",
          background: "radial-gradient(circle, rgba(79,70,229,0.14) 0%, rgba(109,40,217,0.06) 50%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: "550px",
          height: "550px",
          bottom: "-120px",
          left: "-100px",
          background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, rgba(139,92,246,0.05) 50%, transparent 70%)",
          filter: "blur(90px)",
        }}
      />
      {/* Deep magenta accent blob — center-left */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "400px",
          height: "400px",
          top: "30%",
          left: "5%",
          background: "radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)",
          filter: "blur(70px)",
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

      {/* Animated drifting mesh — Electric Indigo & Cyan */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 60, 0],
            x: [0, 40, 0],
            y: [0, -25, 0],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full blur-[90px]"
          style={{ background: "radial-gradient(circle, rgba(79,70,229,0.13) 0%, transparent 70%)" }}
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -35, 0],
            y: [0, 35, 0],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 -right-24 w-[360px] h-[360px] rounded-full blur-[100px]"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)" }}
        />
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            y: [0, 55, 0],
          }}
          transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-24 left-1/4 w-[320px] h-[320px] rounded-full blur-[80px]"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.09) 0%, transparent 70%)" }}
        />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 flex flex-col items-center lg:block pt-24 md:pt-28 pb-0 px-6 max-w-7xl mx-auto w-full text-center lg:text-center">
        {/* Heading & Bridge Watermark Container */}
        <div className="relative w-full flex justify-center">
          {/* Bridge Watermark SVG */}
          <div 
            className="bridge-watermark" 
            style={{ 
              position: 'absolute', 
              width: '100%', 
              height: '100%', 
              top: 0, 
              left: 0, 
              pointerEvents: 'none', 
              overflow: 'visible', 
              zIndex: 0 
            }}
          >
            <svg 
              width="100%" 
              height="auto" 
              className="h-20 md:h-40" 
              viewBox="0 0 1100 160" 
              preserveAspectRatio="xMidYMid meet"
              style={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)', 
                maxWidth: '1100px',
                opacity: 'var(--bridge-opacity, 0.18)',
                '--bridge-opacity': '0.18'
              }}
            >
              <g fill="none" stroke="#7090b0" strokeWidth="1">
                <line x1="0" y1="140" x2="1100" y2="140" />
                <path d="M 330 140 L 345 20 L 375 20 L 390 140" />
                <line x1="345" y1="60" x2="375" y2="60" />
                <line x1="345" y1="100" x2="375" y2="100" />
                <path d="M 710 140 L 725 20 L 755 20 L 770 140" />
                <line x1="725" y1="60" x2="755" y2="60" />
                <line x1="725" y1="100" x2="755" y2="100" />
                <path d="M 0 140 L 345 20 L 550 100 L 755 20 L 1100 140" />
                <path d="M 100 140 L 345 40 L 550 115 L 755 40 L 1000 140" />
                <line x1="170" y1="140" x2="345" y2="60" />
                <line x1="260" y1="140" x2="345" y2="100" />
                <line x1="420" y1="140" x2="375" y2="40" />
                <line x1="500" y1="140" x2="375" y2="80" />
                <line x1="600" y1="140" x2="725" y2="80" />
                <line x1="680" y1="140" x2="725" y2="40" />
                <line x1="840" y1="140" x2="755" y2="100" />
                <line x1="930" y1="140" x2="755" y2="60" />
                <line x1="200" y1="140" x2="200" y2="90" />
                <line x1="450" y1="140" x2="450" y2="65" />
                <line x1="550" y1="140" x2="550" y2="100" />
                <line x1="650" y1="140" x2="650" y2="65" />
                <line x1="900" y1="140" x2="900" y2="90" />
              </g>
            </svg>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-1.5 md:mb-4 w-full relative z-10"
          >
            <h1
              className="text-[22px] md:text-7xl lg:text-8xl font-black tracking-tighter shimmer-text whitespace-nowrap md:whitespace-normal"
              style={{
                fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif",
                lineHeight: 0.9,
                letterSpacing: '-0.5px',
              }}
            >
              Bharat Office Setu
            </h1>
          </motion.div>
        </div>
        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center justify-center gap-4 mb-6"
        >
          <div className="hidden md:block h-px w-8 md:w-16 bg-gradient-to-r from-transparent to-blue-400/40" />
          <p
            className="text-[10px] md:text-sm font-bold tracking-[0.3em] uppercase"
            style={{ color: "rgba(148,163,184,0.9)" }}
          >
            Digital Infrastructure for the New India
          </p>
          <div className="hidden md:block h-px w-8 md:w-16 bg-gradient-to-l from-transparent to-blue-400/40" />
        </motion.div>

        {/* Quick stats ribbon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center justify-center gap-4 md:gap-10 -mt-2 md:mt-4"
        >
          {[
            { num: "36+", label: "States" },
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
                className="text-base md:text-2xl font-black block"
                style={{
                  background: "linear-gradient(135deg, #06B6D4 0%, #4F46E5 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif",
                }}
              >
                {stat.num}
              </span>
              <span className="text-[7px] md:text-[10px] uppercase tracking-[0.1em] md:tracking-[0.2em] font-medium" style={{ color: "rgba(148,163,184,0.6)" }}>
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

      {/* Interactive Map Section */}
      <div className="relative z-10 flex-1 mt-16 md:-mt-8">
        <InteractiveIndiaMap activeState={activeState} setActiveState={setActiveState} />
      </div>
      </div>
    </section>
  );
}
