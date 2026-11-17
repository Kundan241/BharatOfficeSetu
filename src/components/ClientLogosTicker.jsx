import React, { useMemo } from 'react';
import { getClientLogos } from '../data/clientLogos';

export default function ClientLogosTicker() {
  const logos = useMemo(() => {
    const raw = getClientLogos();
    // If fewer than 8 logos, multiply to ensure seamless wide-screen infinite loop
    if (raw.length === 0) return [];
    let list = [...raw];
    while (list.length < 12) {
      list = [...list, ...raw];
    }
    return list;
  }, []);

  if (logos.length === 0) return null;

  return (
    <section 
      aria-label="Client Logos Bulletin" 
      className="w-full bg-[#F4F3EE] border-y border-stone-200/80 relative overflow-hidden select-none py-2.5 md:py-3 z-10"
    >
      <div className="w-full flex items-center">
        {/* Left Bulletin Headline Badge */}
        <div className="hidden sm:flex items-center gap-2 pl-4 md:pl-6 pr-4 shrink-0 border-r border-stone-300/80 z-20 bg-[#F4F3EE]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-widest text-stone-700 whitespace-nowrap">
            Client Bulletin
          </span>
          <span className="text-[10px] text-stone-400 font-medium">|</span>
          <span className="text-[11px] font-medium text-stone-500 whitespace-nowrap">
            Trusted by Growing Brands
          </span>
        </div>

        {/* Marquee Viewport with Left and Right Fade Overlays */}
        <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_24px,black_calc(100%-24px),transparent)]">
          <div className="flex w-max animate-client-ticker items-center py-0.5">
            {/* First Set of Logos */}
            {logos.map((logo, idx) => (
              <div
                key={`logo-a-${idx}`}
                className="group flex items-center justify-center h-10 px-4 mx-2 bg-white rounded-lg border border-stone-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-emerald-500/50 hover:bg-white hover:-translate-y-0.5 transition-all duration-200 cursor-default shrink-0"
                title={`${logo.name} (${logo.industry || 'Client'})`}
              >
                <img
                  src={logo.src}
                  alt={logo.name || 'Client Logo'}
                  loading="lazy"
                  className="h-6 md:h-7 w-auto max-w-[120px] object-contain filter grayscale contrast-125 opacity-75 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-200"
                  onError={(e) => {
                    // Hide broken image smoothly
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            ))}

            {/* Duplicate Set for Seamless Continuous Looping */}
            {logos.map((logo, idx) => (
              <div
                key={`logo-b-${idx}`}
                className="group flex items-center justify-center h-10 px-4 mx-2 bg-white rounded-lg border border-stone-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-emerald-500/50 hover:bg-white hover:-translate-y-0.5 transition-all duration-200 cursor-default shrink-0"
                title={`${logo.name} (${logo.industry || 'Client'})`}
                aria-hidden="true"
              >
                <img
                  src={logo.src}
                  alt={logo.name || 'Client Logo'}
                  loading="lazy"
                  className="h-6 md:h-7 w-auto max-w-[120px] object-contain filter grayscale contrast-125 opacity-75 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-200"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
