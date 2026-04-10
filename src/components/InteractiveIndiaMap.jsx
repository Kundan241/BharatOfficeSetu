import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Building2, ArrowRight } from "lucide-react";
import IndiaMapSvg from "./IndiaMapSvg";

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
  "Ladakh": { count: 1, img: "/Sikkim.jpeg" }, // Fallback to a scenic mountain image if Ladakh.jpeg is missing
  "Jammu And Kashmir": { count: 1, img: "/Himachal Pradesh.jpeg" },
};

export const DEFAULT_DATA = { count: 0, img: "/general.png" };

export default function InteractiveIndiaMap({ activeState, setActiveState, showCard = true }) {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 w-full max-w-7xl mx-auto py-8 lg:py-4">
      {/* Map Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full lg:w-3/5 aspect-[4/5] sm:aspect-square flex items-center justify-center relative"
      >
        <div className="hidden md:block absolute inset-0 bg-blue-500/5 rounded-full blur-[120px] animate-pulse" />
        <div className="relative w-full h-full transform scale-110 sm:scale-100 flex items-center justify-center">
          <IndiaMapSvg 
            activeState={activeState} 
            setActiveState={setActiveState} 
          />
          
          {/* Mobile-only absolute Location Card in the empty circular area */}
          <div className="md:hidden absolute -top-15 right-0 z-20">
            <LocationCard activeState={activeState} isMobileFloating={true} />
          </div>
        </div>
      </motion.div>

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
      className={`w-full lg:w-auto lg:min-w-[280px] lg:max-w-[320px] ${isMobileGrid ? 'hidden' : isMobileFloating ? 'w-[120px] shadow-2xl' : 'md:relative z-10'}`}
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
            boxShadow: "0 30px 60px -12px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.05)",
          }}
        >
          <div className="rounded-[11px] md:rounded-[22px] overflow-hidden bg-[#0f172a]/80 backdrop-blur-xl">
            {/* State Image */}
            <div className={`relative ${isMobileFloating ? 'h-[75px]' : 'h-[55px] md:h-48'} overflow-hidden group`}>
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
                <MapPin className={`${isMobileFloating ? 'w-2 h-2' : 'w-1.5 h-1.5 md:w-3.5 md:h-3.5'} text-blue-400`} />
                <span className={`${isMobileFloating ? 'text-[8px]' : 'text-[7px] md:text-[11px]'} font-extrabold uppercase tracking-[0.1em] md:tracking-[0.2em] text-white`}>
                  {getDisplayName(activeState)}
                </span>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-60" />
            </div>

            {/* Content */}
            <div className={`${isMobileFloating ? 'p-2' : 'p-1.5 md:p-8'}`}>
              <div className={`flex items-end justify-between ${isMobileFloating ? 'mb-1.5' : 'mb-3 md:mb-8'}`}>
                <div>
                  <motion.span
                    key={stateInfo.count}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`${isMobileFloating ? 'text-[12px]' : 'text-[12px] md:text-5xl'} font-black text-white leading-none tracking-tighter`}
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    {String(stateInfo.count).padStart(2, "0")}
                  </motion.span>
                  <p className={`${isMobileFloating ? 'text-[5px]' : 'text-[5px] md:text-[10px]'} font-extrabold text-blue-400/80 uppercase tracking-[.1em] md:tracking-[.3em] mt-0.5 md:mt-2`}>
                    Operating Hubs
                  </p>
                </div>
                
                <div className={`${isMobileFloating ? 'w-5 h-5' : 'w-4 h-4 md:w-14 md:h-14'} rounded-md md:rounded-2xl flex items-center justify-center bg-blue-500/10 border border-blue-500/20 shadow-inner`}>
                  <Building2 className={`${isMobileFloating ? 'w-2.5 h-2.5' : 'w-2 h-2'} text-blue-400`} />
                </div>
              </div>

              <div className={`${isMobileFloating ? 'space-y-1.5' : 'space-y-4 md:space-y-6'}`}>
                <p className="hidden md:block text-[9px] md:text-sm text-slate-400 font-medium leading-relaxed">
                  Premium managed workspaces and virtual office solutions available across 
                  <span className="text-white font-bold ml-1">{getDisplayName(activeState)}</span>.
                </p>

                <a 
                  href="mailto:partners@bharatofficesetu.com"
                  className={`w-full ${isMobileFloating ? 'py-1' : 'py-1 md:py-4'} rounded-md md:rounded-2xl text-[8px] md:text-xs font-black uppercase tracking-[0.1em] md:tracking-[0.2em] flex items-center justify-center gap-1 md:gap-3 transition-all relative overflow-hidden group/btn shadow-xl`}
                  style={{
                    background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
                    color: "#ffffff",
                    textAlign: "center"
                  }}
                >
                  <span className="relative z-10">Explore</span>
                  <ArrowRight className={`${isMobileFloating ? 'w-2.5 h-2.5' : 'w-3 h-3'} relative z-10 transition-transform group-hover/btn:translate-x-1`} />
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
