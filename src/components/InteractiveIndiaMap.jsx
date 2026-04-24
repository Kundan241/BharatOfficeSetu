import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Building2, ArrowRight } from "lucide-react";
import IndiaMapSvg from "./IndiaMapSvg";

/* ── Hook to detect mobile — used only for motion.div optimisation ─ */
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const handler = (e) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    setIsMobile(mql.matches);
    return () => mql.removeEventListener("change", handler);
  }, [breakpoint]);
  return isMobile;
}

export const STATE_DATA = {
  "Maharashtra": { count: 12, img: "/Maharashtra.jpeg" },
  "Kerala": { count: 8, img: "/Kerala.jpeg" },
  "Gujarat": { count: 2, img: "/Gujarat.jpeg" },
  "Tamil Nadu": { count: 5, img: "/Tamil Nadu.jpeg" },
  "Karnataka": { count: 6, img: "/Karnataka.jpeg" },
  "Delhi": { count: 4, img: "/delhi.png" },
  "Telangana": { count: 3, img: "/Telangana.jpeg" },
  "Uttar Pradesh": { count: 3, img: "/Uttar Pradesh.jpeg" },
  "Rajasthan": { count: 2, img: "/Rajasthan.jpeg" },
  "West Bengal": { count: 2, img: "/West Bengal.jpeg" },
  "Madhya Pradesh": { count: 2, img: "/Madhya Pradesh.jpeg" },
  "Bihar": { count: 1, img: "/Bihar.jpeg" },
  "Odisha": { count: 1, img: "/Odisha.jpeg" },
  "Andhra Pradesh": { count: 1, img: "/Andhra Pradesh.jpeg" },
  "Chhattisgarh": { count: 1, img: "/Chhattisgarh.jpeg" },
  "Goa": { count: 1, img: "/Goa.jpeg" },
  "Haryana": { count: 2, img: "/Haryana.jpeg" },
  "Assam": { count: 1, img: "/Assam.jpeg" },
  "Ladakh": { count: 1, img: "/Sikkim.jpeg" },
  "Jammu And Kashmir": { count: 1, img: "/Himachal Pradesh.jpeg" },
};

export const DEFAULT_DATA = { count: 0, img: "/general.png" };

export default function InteractiveIndiaMap({ activeState, setActiveState, showCard = true }) {
  const isMobile = useIsMobile();

  /* Swap motion.div → plain div on mobile to skip JS entry animation */
  const MapContainer = isMobile ? "div" : motion.div;
  const mapMotionProps = isMobile
    ? {}
    : {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.4, ease: "easeOut" },
      };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 w-full max-w-7xl mx-auto py-2 lg:py-4 pb-0 lg:pb-4 overflow-x-hidden">
      {/* Map Section */}
      <MapContainer
        {...mapMotionProps}
        className="w-full lg:w-3/5 flex items-center justify-center relative"
      >
        {/* Desktop-only ambient glow — hidden on mobile */}
        <div className="hidden md:block absolute inset-0 bg-blue-500/5 rounded-full blur-[120px]" />

        {/*
          Responsive wrapper — ONLY Tailwind classes control sizing.
          The SVG internals (viewBox, paths, polygons) are NEVER modified.
          IndiaMapSvg has viewBox="0 0 432 488" and preserveAspectRatio set
          internally; h-auto + the viewBox maintain the correct aspect ratio.
        */}
        <div className="w-full flex justify-center overflow-hidden relative">
          <IndiaMapSvg
            activeState={activeState}
            setActiveState={setActiveState}
            className="w-full max-w-full h-auto object-contain"
          />

          {/* Mobile-only floating Location Card — sits in empty space to the right of the map */}
          <div className="md:hidden absolute top-0 right-0 z-20 w-[26vw] max-w-[105px]">
            <LocationCard activeState={activeState} isMobileFloating={true} />
          </div>
        </div>
      </MapContainer>

      {/* Desktop-only side Location Card */}
      {showCard && (
        <div className="hidden md:block">
          <LocationCard activeState={activeState} />
        </div>
      )}
    </div>
  );
}

export function LocationCard({ activeState, isMobileFloating = false, isMobileGrid = false }) {
  const stateInfo = STATE_DATA[activeState] || DEFAULT_DATA;

  const getDisplayName = (state) => {
    if (state === "Haryana") return "Delhi NCR";
    if (state === "Ladakh") return "Jammu and Kashmir";
    return state;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: isMobileFloating ? -10 : 0, x: isMobileFloating ? 0 : 40 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.4, delay: isMobileFloating ? 0.1 : 0.3, ease: "easeOut" }}
      className={`w-full lg:w-auto lg:min-w-[280px] lg:max-w-[320px] ${isMobileGrid ? 'hidden' : isMobileFloating ? 'w-[120px] shadow-md' : 'md:relative z-10'}`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeState}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="rounded-[12px] md:rounded-3xl overflow-hidden glass-card"
          style={{
            padding: "2px",
            background: "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))",
            boxShadow: "0 8px 24px -4px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.05)",
          }}
        >
          {/* backdrop-blur-xl only on md+ — solid bg on mobile (no compositor layer) */}
          <div className="rounded-[11px] md:rounded-[22px] overflow-hidden bg-[#0f172a] md:bg-[#0f172a]/80 md:backdrop-blur-xl">
            {/* State Image */}
            <div className={`relative ${isMobileFloating ? 'h-[55px]' : 'h-[55px] md:h-48'} overflow-hidden group`}>
              <motion.img
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                src={stateInfo.img}
                alt={getDisplayName(activeState)}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ filter: "brightness(0.7) saturate(1.2)" }}
              />

              {/* Location badge */}
              <div className={`absolute ${isMobileFloating ? 'top-1.5 left-1.5' : 'top-1.5 left-1.5 md:top-4 md:left-4'} flex items-center gap-1 md:gap-2 px-2 py-0.5 md:px-4 md:py-2 rounded-full backdrop-blur-md`}
                style={{
                  background: "rgba(59,130,246,0.3)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <MapPin className={`${isMobileFloating ? 'w-1.5 h-1.5' : 'w-1.5 h-1.5 md:w-3.5 md:h-3.5'} text-blue-400`} />
                <span className={`${isMobileFloating ? 'text-[6px]' : 'text-[7px] md:text-[11px]'} font-extrabold uppercase tracking-[0.05em] md:tracking-[0.2em] text-white truncate max-w-[60px]`}>
                  {getDisplayName(activeState)}
                </span>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-60" />
            </div>

            {/* Content */}
            <div className={`${isMobileFloating ? 'p-1.5' : 'p-1.5 md:p-8'}`}>
              <div className={`flex items-end justify-between ${isMobileFloating ? 'mb-1' : 'mb-3 md:mb-8'}`}>
                <div>
                  <motion.span
                    key={stateInfo.count}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`${isMobileFloating ? 'text-[10px]' : 'text-[12px] md:text-5xl'} font-black text-white leading-none tracking-tighter`}
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    {String(stateInfo.count).padStart(2, "0")}
                  </motion.span>
                  <p className={`${isMobileFloating ? 'text-[4px]' : 'text-[5px] md:text-[10px]'} font-extrabold text-blue-400/80 uppercase tracking-[.05em] md:tracking-[.3em] mt-0.5 md:mt-2`}>
                    Operating Hubs
                  </p>
                </div>

                <div className={`${isMobileFloating ? 'w-4 h-4' : 'w-4 h-4 md:w-14 md:h-14'} rounded-md md:rounded-2xl flex items-center justify-center bg-blue-500/10 border border-blue-500/20 shadow-inner`}>
                  <Building2 className={`${isMobileFloating ? 'w-2 h-2' : 'w-2 h-2'} text-blue-400`} />
                </div>
              </div>

              <div className={`${isMobileFloating ? 'space-y-1' : 'space-y-4 md:space-y-6'}`}>
                <p className="hidden md:block text-[9px] md:text-sm text-slate-400 font-medium leading-relaxed">
                  Premium managed workspaces and virtual office solutions available across{" "}
                  <span className="text-white font-bold ml-1">{getDisplayName(activeState)}</span>.
                </p>

                <a
                  href="mailto:partners@bharatofficesetu.com"
                  className={`w-full ${isMobileFloating ? 'py-0.5' : 'py-1 md:py-4'} rounded-md md:rounded-2xl ${isMobileFloating ? 'text-[6px]' : 'text-[8px]'} md:text-xs font-black uppercase tracking-[0.05em] md:tracking-[0.2em] flex items-center justify-center gap-0.5 md:gap-3 transition-all relative overflow-hidden group/btn shadow-xl`}
                  style={{
                    background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
                    color: "#ffffff",
                    textAlign: "center"
                  }}
                >
                  <span className="relative z-10">Explore</span>
                  <ArrowRight className={`${isMobileFloating ? 'w-2 h-2' : 'w-3 h-3'} relative z-10 transition-transform group-hover/btn:translate-x-1`} />
                  <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
