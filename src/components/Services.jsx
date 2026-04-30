import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, ShieldCheck, Cog, TrendingUp, Network } from 'lucide-react';

const services = [
  {
    id: "capability",
    title: "Capability Centre Solutions",
    desc: "Comprehensive solutions to establish and scale your delivery capabilities across India's fastest-growing corridors.",
    items: [
      "Domestic Capability Centre Setup",
      "Global Capability Center (GCC) Consulting",
      "Offshore Delivery Centre Support",
      "Shared Services Setup",
      "Innovation Hub Development",
    ],
    icon: Network,
  },
  {
    id: "workspace",
    title: "Workspace & Infrastructure",
    desc: "Premium, flexible environments — from plug-and-play offices to enterprise managed campuses.",
    items: [
      "Coworking Spaces",
      "Managed Offices",
      "Virtual Offices",
      "Registered Office Solutions",
      "Plug-and-Play Business Infrastructure",
    ],
    icon: Building2,
  },
  {
    id: "compliance",
    title: "Business Setup & Compliance",
    desc: "End-to-end legal, tax, and regulatory solutions for your enterprise.",
    items: [
      "Company Incorporation & Business Setup",
      "GST Registration & Compliance Support",
      "Legal and Regulatory Advisory",
      "Taxation & Accounting Support",
      "Payroll and HR Compliance",
    ],
    icon: ShieldCheck,
  },
  {
    id: "operations",
    title: "Operations & Support",
    desc: "Streamlined operational support for optimal business efficiency.",
    items: [
      "BPO / KPO Enablement",
      "IT Infrastructure Support",
      "Admin & Facility Management",
      "Financial and Business Consulting",
      "Process and Operational Support",
    ],
    icon: Cog,
  },
  {
    id: "growth",
    title: "Growth & Market Enablement",
    desc: "Strategic advisory to help you enter markets and scale rapidly.",
    items: [
      "Branding and Digital Marketing",
      "Community Building & Networking",
      "Ecosystem Partnerships",
      "Market Entry Advisory",
      "Expansion Support for Startups & SMEs",
    ],
    icon: TrendingUp,
  },
];

const IsometricIllustration = ({ activeIndex, setActiveIndex }) => {
  return (
    <div className="relative w-full max-w-lg aspect-square mx-auto flex items-center justify-center perspective-[1200px]">
      <div 
        className="relative w-64 h-64 transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]"
        style={{ transformStyle: 'preserve-3d', transform: 'rotateX(60deg) rotateZ(-45deg)' }}
      >
        {/* Base Layer */}
        <div 
          className="absolute inset-0 bg-[#F9F8F5] border border-[#1B6B2F]/15 rounded-[2.5rem]" 
          style={{ transform: 'translateZ(-30px)', boxShadow: '-15px 15px 40px rgba(27,107,47,0.06)' }} 
        />
        
        {/* Middle Layer */}
        <div 
          className="absolute inset-4 bg-white border border-[#1B6B2F]/10 rounded-[2rem] flex items-center justify-center" 
          style={{ transform: 'translateZ(0px)', boxShadow: '-5px 5px 20px rgba(0,0,0,0.02)' }}
        >
          {/* Inner details */}
          <div className="w-24 h-24 border border-[#F4831F]/20 rounded-full flex items-center justify-center">
            <div className="w-12 h-12 bg-[#F4831F]/10 rounded-full" />
          </div>
        </div>

        {/* Top Floating Core */}
        <div 
          className="absolute left-1/2 top-1/2 -ml-6 -mt-6 w-12 h-12 bg-[#1B6B2F] rounded-2xl shadow-lg flex items-center justify-center animate-pulse"
          style={{ transform: 'translateZ(40px)' }}
        >
           <div className="w-4 h-4 bg-white rounded-full opacity-80" />
        </div>

        {/* Orbiting Tabs */}
        {services.map((service, index) => {
          // Calculate circular positions
          const angle = (index * (360 / services.length) - 90) * (Math.PI / 180);
          const radius = 170; // Orbit radius
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const isActive = activeIndex === index;

          return (
            <div
              key={service.id}
              className="absolute left-1/2 top-1/2 -ml-8 -mt-8 w-16 h-16 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer"
              style={{ 
                transform: `translate3d(${x}px, ${y}px, ${isActive ? '50px' : '10px'})`,
                transformStyle: 'preserve-3d',
                zIndex: isActive ? 50 : 10,
              }}
              onClick={() => setActiveIndex(index)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              {/* Stand-up Icon Container to counter the isometric rotation */}
              <div 
                className={`absolute inset-0 flex items-center justify-center rounded-2xl border transition-all duration-500 
                  ${isActive 
                    ? 'bg-white border-[#F4831F] text-[#F4831F] shadow-2xl shadow-[#F4831F]/20 scale-110' 
                    : 'bg-white border-[#1B6B2F]/10 text-[#1B6B2F]/60 hover:border-[#1B6B2F]/30 hover:text-[#1B6B2F] shadow-sm'
                  }`}
                style={{ 
                  transform: 'rotateZ(45deg) rotateX(-60deg)', // Stand up straight
                  transformOrigin: 'center center'
                }}
              >
                <service.icon size={26} strokeWidth={isActive ? 2 : 1.5} />
              </div>
              
              {/* Connecting Line (SVG inside the isometric plane) */}
              {isActive && (
                <svg className="absolute top-1/2 left-1/2 overflow-visible pointer-events-none" style={{ transform: 'translate(-50%, -50%)', zIndex: -1 }}>
                   <line 
                     x1="0" y1="0" 
                     x2={-x} y2={-y} 
                     stroke="#F4831F" 
                     strokeWidth="2" 
                     strokeDasharray="6 6" 
                     strokeOpacity="0.4"
                   />
                </svg>
              )}
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default function Services() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="services" className="pt-10 pb-24 lg:py-32 bg-[#F9F8F5] relative overflow-hidden">
      {/* Background Architectural Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]" 
        style={{ 
          backgroundImage: 'linear-gradient(#1B6B2F 1px, transparent 1px), linear-gradient(90deg, #1B6B2F 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
        }} 
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left: 3D Isometric Visual */}
          <div className="w-full lg:w-1/2 order-2 lg:order-1">
             <IsometricIllustration activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
          </div>

          {/* Right: Content details */}
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1B6B2F]/5 border border-[#1B6B2F]/10 mb-8"
             >
                <span className="w-2 h-2 rounded-full bg-[#F4831F]" />
                <span className="text-[11px] font-bold text-[#1B6B2F] tracking-widest uppercase">Our Core Solutions</span>
             </motion.div>
             
             <div className="relative min-h-[400px]">
               <AnimatePresence mode="wait">
                 <motion.div 
                   key={activeIndex}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   transition={{ duration: 0.3, ease: "easeOut" }}
                   className="absolute inset-0"
                 >
                   <h2 className="text-3xl md:text-5xl font-bold text-[#111110] mb-6 tracking-tight leading-[1.15]">
                     {services[activeIndex].title}
                   </h2>
                   <p className="text-[#111110]/70 text-lg leading-relaxed mb-8 max-w-lg">
                     {services[activeIndex].desc}
                   </p>

                   <ul className="space-y-4 mb-10">
                     {services[activeIndex].items.map((item, i) => (
                       <li key={i} className="flex items-start gap-4">
                         <div className="mt-1 w-5 h-5 rounded-full bg-[#8BC34A]/20 flex items-center justify-center flex-shrink-0">
                           <div className="w-1.5 h-1.5 rounded-full bg-[#8BC34A]" />
                         </div>
                         <span className="text-[#111110] font-medium tracking-tight">{item}</span>
                       </li>
                     ))}
                   </ul>
                   
                   <div>
                     <a
                       href={`mailto:partners@bharatofficesetu.com?subject=Inquiry about ${services[activeIndex].title}`}
                       className="inline-flex items-center justify-center px-7 py-3.5 bg-[#1B6B2F] text-white font-semibold rounded-lg hover:bg-[#111110] transition-colors shadow-sm text-sm"
                     >
                       Discuss Your Needs
                     </a>
                   </div>
                 </motion.div>
               </AnimatePresence>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
