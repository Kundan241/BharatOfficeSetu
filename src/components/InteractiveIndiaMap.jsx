import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Building2, ArrowRight } from "lucide-react";
import IndiaMapSvg from "./IndiaMapSvg";

const STATE_DATA = {
  "Maharashtra": { count: 12, img: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=250&fit=crop" },
  "Kerala": { count: 8, img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=250&fit=crop" },
  "Gujarat": { count: 2, img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&h=250&fit=crop" },
  "Tamil Nadu": { count: 5, img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&h=250&fit=crop" },
  "Karnataka": { count: 6, img: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400&h=250&fit=crop" },
  "Delhi": { count: 4, img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=250&fit=crop" },
  "Telangana": { count: 3, img: "https://images.unsplash.com/photo-1572427998628-6a1d60c60de5?w=400&h=250&fit=crop" },
  "Uttar Pradesh": { count: 3, img: "https://images.unsplash.com/photo-1564507592924-fe71ec30953e?w=400&h=250&fit=crop" },
  "Rajasthan": { count: 2, img: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&h=250&fit=crop" },
  "West Bengal": { count: 2, img: "https://images.unsplash.com/photo-1558431382-27e303142255?w=400&h=250&fit=crop" },
  "Madhya Pradesh": { count: 2, img: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=400&h=250&fit=crop" },
  "Bihar": { count: 1, img: "https://images.unsplash.com/photo-1609947490824-1d05b3db8e4d?w=400&h=250&fit=crop" },
  "Odisha": { count: 1, img: "https://images.unsplash.com/photo-1621427642768-b413a1be79d0?w=400&h=250&fit=crop" },
  "Andhra Pradesh": { count: 1, img: "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?w=400&h=250&fit=crop" },
  "Chhattisgarh": { count: 1, img: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=400&h=250&fit=crop" },
  "Goa": { count: 1, img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=250&fit=crop" },
  "Haryana": { count: 2, img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=250&fit=crop" },
  "Assam": { count: 1, img: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400&h=250&fit=crop" },
  "Ladakh": { count: 1, img: "https://images.unsplash.com/photo-1581793745862-99fde7f73d23?w=400&h=250&fit=crop" },
  "Jammu And Kashmir": { count: 1, img: "https://images.unsplash.com/photo-1566833925222-be74391694f4?w=400&h=250&fit=crop" },
};

const DEFAULT_DATA = { count: 0, img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=250&fit=crop" };

export default function InteractiveIndiaMap() {
  const [activeState, setActiveState] = useState("Maharashtra");

  const stateInfo = STATE_DATA[activeState] || DEFAULT_DATA;

  const getDisplayName = (state) => {
    if (state === "Haryana") return "Delhi NCR";
    if (state === "Ladakh") return "Jammu and Kashmir";
    return state;
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 w-full max-w-7xl mx-auto py-12">
      {/* Map Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full lg:w-3/5 aspect-[4/5] sm:aspect-square flex items-center justify-center relative"
      >
        <div className="absolute inset-0 bg-blue-500/5 rounded-full blur-[120px] animate-pulse" />
        <div className="relative w-full h-full transform scale-110 sm:scale-100">
          <IndiaMapSvg 
            activeState={activeState} 
            setActiveState={setActiveState} 
          />
        </div>
      </motion.div>

      {/* Info Card Section */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.6, ease: "easeOut" }}
        className="w-full lg:w-2/5 max-w-md"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeState}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="rounded-3xl overflow-hidden glass-card"
            style={{
              padding: "2px",
              background: "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))",
              boxShadow: "0 30px 60px -12px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.05)",
            }}
          >
            <div className="rounded-[22px] overflow-hidden bg-[#0f172a]/80 backdrop-blur-xl">
              {/* State Image */}
              <div className="relative h-48 overflow-hidden group">
                <motion.img
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  src={stateInfo.img}
                  alt={getDisplayName(activeState)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ filter: "brightness(0.7) saturate(1.2)" }}
                />
                
                {/* Location badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md"
                  style={{
                    background: "rgba(59,130,246,0.3)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-white">
                    {getDisplayName(activeState)}
                  </span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-60" />
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex items-end justify-between mb-8">
                  <div>
                    <motion.span
                      key={stateInfo.count}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-7xl font-black text-white leading-none tracking-tighter"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      {String(stateInfo.count).padStart(2, "0")}
                    </motion.span>
                    <p className="text-[10px] font-extrabold text-blue-400/80 uppercase tracking-[.3em] mt-2">
                      Operating Hubs
                    </p>
                  </div>
                  
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-blue-500/10 border border-blue-500/20 shadow-inner">
                    <Building2 className="w-7 h-7 text-blue-400" />
                  </div>
                </div>

                <div className="space-y-6">
                  <p className="text-sm text-slate-400 font-medium leading-relaxed">
                    Premium managed workspaces and virtual office solutions available across 
                    <span className="text-white font-bold ml-1">{getDisplayName(activeState)}</span>.
                  </p>

                  <button className="w-full py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all relative overflow-hidden group/btn shadow-xl"
                    style={{
                      background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
                      color: "#ffffff",
                    }}
                  >
                    <span className="relative z-10">Explore Location</span>
                    <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover/btn:translate-x-1" />
                    <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Global reach indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="flex items-center justify-center gap-4 mt-12 opacity-30 group hover:opacity-80 transition-opacity cursor-default"
        >
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-slate-500" />
          <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-slate-400 whitespace-nowrap">
            Interactive Coverage
          </span>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-slate-500" />
        </motion.div>
      </motion.div>
    </div>
  );
}
