import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Building2, ArrowRight } from "lucide-react";
import IndiaMapSvg from "./IndiaMapSvg";

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
  const MapContainer = isMobile ? "div" : motion.div;
  const mapMotionProps = isMobile
    ? {}
    : {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.4, ease: "easeOut" },
      };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-12 w-full max-w-6xl mx-auto py-2 lg:py-4 pb-0 lg:pb-4 overflow-x-hidden">
      <MapContainer
        {...mapMotionProps}
        className="w-full md:w-[65%] flex items-center justify-center relative"
      >
        <div className="w-full max-w-[700px] flex justify-center overflow-hidden relative">
          <IndiaMapSvg
            activeState={activeState}
            setActiveState={setActiveState}
            className="w-full h-auto object-contain drop-shadow-sm"
          />

          <div className="md:hidden absolute top-0 right-0 z-20 w-[26vw] max-w-[105px]">
            <LocationCard activeState={activeState} isMobileFloating={true} />
          </div>
        </div>
      </MapContainer>

      {showCard && (
        <div className="hidden md:flex md:w-[35%] justify-center md:justify-end z-20">
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
      initial={{ opacity: 0, y: isMobileFloating ? -10 : 0, x: isMobileFloating ? 0 : 20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.4, delay: isMobileFloating ? 0.1 : 0.3, ease: "easeOut" }}
      className={`w-full lg:w-auto lg:min-w-[260px] lg:max-w-[280px] ${isMobileGrid ? 'hidden' : isMobileFloating ? 'w-[120px]' : 'md:relative z-10'}`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeState}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="overflow-hidden bg-[#FFFFFF]"
          style={{
            borderRadius: "14px",
            border: "1px solid var(--color-border-sage)",
            boxShadow: "0 12px 32px -8px rgba(0,0,0,0.06)",
          }}
        >
          <div className={`relative ${isMobileFloating ? 'h-[55px]' : 'h-[55px] md:h-40'} overflow-hidden group`}>
            <motion.img
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              src={stateInfo.img}
              alt={getDisplayName(activeState)}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className={`absolute ${isMobileFloating ? 'top-1.5 left-1.5' : 'top-1.5 left-1.5 md:top-3 md:left-3'} flex items-center gap-1 md:gap-1.5 px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-white shadow-sm`}
              style={{
                border: "1px solid var(--color-border-sage)",
              }}
            >
              <MapPin className={`${isMobileFloating ? 'w-1.5 h-1.5' : 'w-1.5 h-1.5 md:w-3 h-3'} text-[var(--color-accent)]`} />
              <span className={`${isMobileFloating ? 'text-[6px]' : 'text-[7px] md:text-[10px]'} font-bold uppercase tracking-wider text-[var(--color-text-dark)] truncate max-w-[80px]`}>
                {getDisplayName(activeState)}
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60" />
          </div>

          <div className={`${isMobileFloating ? 'p-1.5' : 'p-1.5 md:p-5'}`}>
            <div className={`flex items-end justify-between ${isMobileFloating ? 'mb-1' : 'mb-3 md:mb-5'}`}>
              <div>
                <motion.span
                  key={stateInfo.count}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`${isMobileFloating ? 'text-[10px]' : 'text-[12px] md:text-4xl'} font-bold text-[var(--color-primary)] leading-none`}
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {String(stateInfo.count).padStart(2, "0")}
                </motion.span>
                <p className={`${isMobileFloating ? 'text-[4px]' : 'text-[5px] md:text-[9px]'} font-bold text-[var(--color-text-muted)] uppercase tracking-widest mt-0.5 md:mt-1`}>
                  Operating Hubs
                </p>
              </div>

              <div className={`${isMobileFloating ? 'w-4 h-4' : 'w-4 h-4 md:w-10 md:h-10'} rounded-md md:rounded-lg flex items-center justify-center bg-[var(--color-bg-light-sage)] border border-[var(--color-border-sage)]`}>
                <Building2 className={`${isMobileFloating ? 'w-2 h-2' : 'w-2 h-2 md:w-5 md:h-5'} text-[var(--color-primary)]`} />
              </div>
            </div>

            <div className={`${isMobileFloating ? 'space-y-1' : 'space-y-4 md:space-y-4'}`}>
              <a
                href="mailto:partners@bharatofficesetu.com"
                className={`w-full ${isMobileFloating ? 'py-0.5' : 'py-1 md:py-2.5'} rounded-md md:rounded-lg ${isMobileFloating ? 'text-[6px]' : 'text-[8px]'} md:text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-0.5 md:gap-2 transition-all hover-lift`}
                style={{
                  background: "var(--color-bg-warm)",
                  color: "var(--color-primary)",
                  border: "1px solid var(--color-primary)",
                }}
              >
                <span>Explore Details</span>
                <ArrowRight className={`${isMobileFloating ? 'w-2 h-2' : 'w-3 h-3'}`} />
              </a>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
