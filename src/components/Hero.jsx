import React, { useState } from "react";
import InteractiveIndiaMap from "./InteractiveIndiaMap";

export default function Hero() {
  const [activeState, setActiveState] = useState("Maharashtra");

  React.useEffect(() => {
    window.lastHoveredState = activeState;
  }, [activeState]);

  return (
    <section className="relative pt-24 pb-6 md:pb-6 px-6 flex flex-col items-center bg-[var(--color-bg-warm)] overflow-hidden" style={{ minHeight: 'auto', isolation: 'isolate' }}>
      
      {/* Background Orbs */}
      <div className="orb-1"></div>
      <div className="orb-2"></div>
      <div className="orb-3"></div>
      <div className="bos-aurora" aria-hidden="true"></div>

      {/* Top Centered Content */}
      <div className="max-w-5xl mx-auto w-full flex flex-col items-center text-center z-10 mt-2 order-1">
        
        {/* Atal Setu Inspired Bridge Illustration */}
        {/* Removed bridge graphic */}

        {/* Headline */}
        <div className="w-full flex justify-start md:justify-center px-0 md:px-0 mb-2">
          <h1 
            className="fade-up-enter font-bold relative z-10 whitespace-normal min-[360px]:whitespace-nowrap text-left md:text-center pl-6 md:pl-0 text-[clamp(28px,8.5vw,42px)] md:text-[84px] lg:text-[100px]"
            style={{ 
              animationDelay: '0.1s',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#111110',
              lineHeight: 1.1
            }}
          >
            <span className="whitespace-nowrap">Bharat Office</span>{' '}
            <span className="relative inline-block whitespace-nowrap" style={{ color: '#F4831F' }}>
              Setu
              <svg 
                className="absolute left-0 bottom-[-2px] md:bottom-[-6px] w-full h-[6px] md:h-[16px] lg:h-[20px] underline-draw" 
                viewBox="0 0 100 12" 
                preserveAspectRatio="none"
                style={{ overflow: 'visible' }}
              >
                <path 
                  d="M2,8 Q50,2 98,8" 
                  stroke="#F4831F" 
                  strokeWidth="4" 
                  fill="none" 
                  strokeLinecap="round" 
                />
              </svg>
            </span>
          </h1>
        </div>

        {/* Subheading / Decorator */}
        <div 
          className="fade-up-enter relative mb-6 md:mb-8 w-full flex justify-center"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-20"></div>
          <div className="bg-[var(--color-bg-warm)] px-4 z-10 flex flex-col items-center text-center">
            <span className="text-[10px] md:text-[12px] font-bold tracking-[0.15em] md:tracking-[0.2em] uppercase text-[var(--color-text-muted)]">
              BUSINESS INFRASTRUCTURE &amp; WORKSPACE SOLUTIONS FOR NEW INDIA
            </span>
            <span className="text-[10px] md:text-[12px] font-medium tracking-[0.1em] text-[var(--color-text-muted)] mt-1 uppercase">
              Enabling Businesses Across India
            </span>
          </div>
        </div>
      </div>

      {/* Stats Row - Moves below map on mobile */}
      <div className="fade-up-enter stats-pill-strip z-10 order-3 md:order-2 mt-4 md:mt-0" style={{ animationDelay: '0.3s' }}>
        <div className="stat-item">
          <span className="stat-num">36+</span>
          <span className="stat-label">States</span>
        </div>
        <div className="stat-separator"></div>
        <div className="stat-item">
          <span className="stat-num">150+</span>
          <span className="stat-label">Cities</span>
        </div>
        <div className="stat-separator"></div>
        <div className="stat-item">
          <span className="stat-num">5000+</span>
          <span className="stat-label">Clients</span>
        </div>
      </div>

      {/* Bottom Full-Width Map - Maximize Area */}
      <div 
        className="fade-up-enter w-full max-w-[1400px] mx-auto flex-1 flex flex-col items-center relative z-10 order-2 md:order-3 mb-0 pb-0"
        style={{ animationDelay: '0.4s' }}
      >
        <InteractiveIndiaMap activeState={activeState} setActiveState={setActiveState} />
      </div>

      {/* Hero Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-[80px] pointer-events-none z-[1]" style={{ background: 'linear-gradient(to bottom, transparent, #F4F3EE)' }}></div>
    </section>
  );
}
