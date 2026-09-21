import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface HeroCarouselItem {
  title: string;
  image: string;
  credit: string;
  meta: string[];
  accent: string;
}

export interface HeroCarouselProps {
  items: HeroCarouselItem[];
  brand?: string;
  autoplay?: boolean;
  autoplayDelay?: number;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  items,
  brand = 'BHARAT OFFICE SETU',
  autoplay = true,
  autoplayDelay = 4500,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, autoplayDelay);
    return () => clearInterval(timer);
  }, [autoplay, autoplayDelay, items.length]);

  const currentItem = items[currentIndex];

  return (
    <div className="relative w-full h-full overflow-hidden bg-zinc-900 group rounded-2xl">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <img
            src={currentItem.image}
            alt={currentItem.title}
            className="object-cover w-full h-full opacity-60"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      
      {/* SVG Grain overlay */}
      <div 
        className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      <div className="absolute top-8 left-8 flex items-center space-x-2">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentItem.accent }} />
        <span className="text-white text-xs font-bold tracking-widest uppercase opacity-80">
          {brand}
        </span>
      </div>

      <div className="absolute bottom-12 left-12 right-12 flex flex-col md:flex-row justify-between items-end">
        <div className="w-full md:w-2/3">
          <motion.div
            key={`title-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4 whitespace-pre-line">
              {currentItem.title}
            </h1>
          </motion.div>
          <motion.div
            key={`meta-${currentIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-3"
          >
            {currentItem.meta.map((tag, idx) => (
              <span 
                key={idx}
                className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-xs tracking-wider"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </div>
        
        <div className="w-full md:w-1/3 flex justify-start md:justify-end mt-6 md:mt-0">
          <motion.div
            key={`credit-${currentIndex}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-right"
          >
            <p className="text-white/60 text-xs font-semibold tracking-widest mb-2 uppercase">Expertise</p>
            <p className="text-white font-medium tracking-wide">{currentItem.credit}</p>
          </motion.div>
        </div>
      </div>
      
      {/* Progress indicators */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <motion.div
          key={`progress-${currentIndex}`}
          className="h-full"
          style={{ backgroundColor: currentItem.accent }}
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: autoplayDelay / 1000, ease: 'linear' }}
        />
      </div>
    </div>
  );
};
