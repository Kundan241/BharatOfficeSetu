import React, { useState } from "react";
import InteractiveIndiaMap from "./InteractiveIndiaMap";

export default function Hero() {
  const [activeState, setActiveState] = useState("Maharashtra");

  return (
    <section className="relative min-h-[90vh] pt-24 pb-6 px-6 flex flex-col items-center bg-[var(--color-bg-warm)] overflow-hidden">
      
      {/* Top Centered Content - Compact to give map 80% area */}
      <div className="max-w-5xl mx-auto w-full flex flex-col items-center text-center z-10 mt-2">
        
        {/* Atal Setu Inspired Bridge Illustration */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-64 pointer-events-none flex justify-center z-0">
          <svg viewBox="0 0 1200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Sleek curved deck fading at the ends */}
            <path d="M0,150 Q600,165 1200,150" stroke="var(--color-text-muted)" strokeWidth="2" opacity="0.2" />
            <path d="M0,160 Q600,175 1200,160" stroke="var(--color-text-muted)" strokeWidth="1" opacity="0.1" />
            
            {/* Sweeping suspension curves */}
            <path d="M100,50 Q250,150 400,150" stroke="var(--color-primary)" strokeWidth="1" opacity="0.3" />
            <path d="M400,150 Q550,150 700,50" stroke="var(--color-primary)" strokeWidth="1" opacity="0.3" />
            <path d="M700,50 Q850,150 1000,150" stroke="var(--color-primary)" strokeWidth="1" opacity="0.3" />
            <path d="M1000,150 Q1100,150 1200,100" stroke="var(--color-primary)" strokeWidth="1" opacity="0.3" />
            
            {/* Elegant vertical tension cables */}
            {[...Array(25)].map((_, i) => (
              <line 
                key={i} 
                x1={100 + i*41.6} 
                y1={50 + Math.abs(Math.sin(i*0.26))*100} 
                x2={100 + i*41.6} 
                y2={152 + Math.sin(i*0.13)*10} 
                stroke="var(--color-primary)" 
                strokeWidth="0.5" 
                opacity={0.1 + Math.abs(Math.cos(i*0.3))*0.15} 
              />
            ))}
          </svg>
        </div>

        {/* Headline */}
        <h1 
          className="fade-up-enter text-5xl md:text-[76px] font-bold tracking-tight leading-[1.1] mb-2 relative z-10"
          style={{ 
            animationDelay: '0.1s',
            color: "var(--color-text-dark)"
          }}
        >
          Bharat Office Setu
        </h1>

        {/* Subheading / Decorator */}
        <div 
          className="fade-up-enter relative mb-8 w-full flex justify-center"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-20"></div>
          <span className="text-[10px] md:text-[12px] font-bold tracking-[0.3em] uppercase text-[var(--color-text-muted)] bg-[var(--color-bg-warm)] px-4 z-10">
            Digital Infrastructure for the New India
          </span>
        </div>

        {/* Stats Row - Smaller */}
        <div 
          className="fade-up-enter flex flex-wrap items-center justify-center gap-8 md:gap-16 mb-6"
          style={{ animationDelay: '0.3s' }}
        >
          {[
            { num: "36+", label: "States" },
            { num: "150+", label: "Cities" },
            { num: "5000+", label: "Clients" },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center transition-transform hover:-translate-y-1">
              <span className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] leading-none mb-1.5" style={{ fontFamily: "var(--font-display)", filter: "drop-shadow(0 2px 4px rgba(27,107,47,0.1))" }}>
                {stat.num}
              </span>
              <span className="text-[10px] md:text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom Full-Width Map - Maximize Area */}
      <div 
        className="fade-up-enter w-full max-w-[1400px] mx-auto flex-1 flex flex-col items-center relative z-10"
        style={{ animationDelay: '0.4s', minHeight: '60vh' }}
      >
        <InteractiveIndiaMap activeState={activeState} setActiveState={setActiveState} />
      </div>

    </section>
  );
}
