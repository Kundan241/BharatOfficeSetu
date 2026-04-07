import React from 'react';
import { motion } from 'framer-motion';
import { Building2, ShieldCheck, TrendingUp, Network, CheckCircle2, Factory } from 'lucide-react';

const services = [
  {
    title: "Capability Centre Solutions",
    desc: "Comprehensive solutions to establish and scale your delivery capabilities across India.",
    items: [
      "Domestic Capability Centre Setup",
      "Global Capability Center (GCC) Consulting",
      "Offshore Delivery Centre Support",
      "Shared Services Setup",
      "Innovation Hub Development"
    ],
    icon: <Network className="w-7 h-7" style={{ color: "#60a5fa" }} />,
    accent: "rgba(59,130,246,0.12)",
    featured: true,
  },
  {
    title: "Workspace & Infrastructure",
    desc: "Premium, flexible working environments tailored to your needs.",
    items: [
      "Coworking Spaces",
      "Managed Offices",
      "Virtual Offices",
      "Registered Office Solutions",
      "Plug-and-Play Business Infrastructure"
    ],
    icon: <Building2 className="w-7 h-7" style={{ color: "#34d399" }} />,
    accent: "rgba(52,211,153,0.12)",
  },
  {
    title: "Business Setup & Compliance",
    desc: "End-to-end legal, tax, and regulatory solutions for your enterprise.",
    items: [
      "Company Incorporation & Business Setup",
      "GST Registration & Compliance Support",
      "Legal and Regulatory Advisory",
      "Taxation and Accounting Support",
      "Payroll and HR Compliance"
    ],
    icon: <ShieldCheck className="w-7 h-7" style={{ color: "#f59e0b" }} />,
    accent: "rgba(245,158,11,0.12)",
  },
  {
    title: "Operations & Support",
    desc: "Streamlined operational support for optimal business efficiency.",
    items: [
      "BPO / KPO Enablement",
      "IT Infrastructure Support",
      "Admin and Facility Management",
      "Financial and Business Consulting",
      "Process and Operational Support"
    ],
    icon: <Factory className="w-7 h-7" style={{ color: "#a78bfa" }} />,
    accent: "rgba(167,139,250,0.12)",
  },
  {
    title: "Growth & Market Enablement",
    desc: "Strategic advisory to help you enter markets and scale rapidly.",
    items: [
      "Branding and Digital Marketing",
      "Community Building & Networking",
      "Ecosystem Partnerships",
      "Market Entry Advisory",
      "Expansion Support for Startups & SMEs"
    ],
    icon: <TrendingUp className="w-7 h-7" style={{ color: "#f472b6" }} />,
    accent: "rgba(244,114,182,0.12)",
  }
];

export default function Services() {
  return (
    <section
      className="relative py-32 px-6 overflow-hidden noise-overlay scanline"
      id="services"
      style={{
        background: "radial-gradient(circle at 50% 0%, #0f172a 0%, #0a1628 50%, #020617 100%)",
      }}
    >
      {/* Dynamic Background Blurs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full mb-6"
            style={{ 
              background: "rgba(59,130,246,0.1)",
              border: "1px solid rgba(59,130,246,0.2)"
            }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">
              Our Expertise
            </p>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Core Solutions for <span className="text-gradient-blue">Success</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto font-medium"
          >
            Comprehensive infrastructure and compliance solutions designed to empower your 
            business expansion across the Indian subcontinent.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className={`relative rounded-3xl p-8 flex flex-col group transition-all duration-500 hover:-translate-y-3
                ${service.featured ? 'md:col-span-2 lg:col-span-1' : ''}`}
              style={{
                background: "linear-gradient(135deg, rgba(30,41,59,0.4) 0%, rgba(15,23,42,0.6) 100%)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.05)",
                boxShadow: "0 20px 40px -15px rgba(0,0,0,0.4)",
              }}
            >
              {/* Card Glow Effect on Hover */}
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
              
              <div className="relative z-10 h-full flex flex-col">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-2xl"
                  style={{ 
                    background: service.accent,
                    border: "1px solid rgba(255,255,255,0.05)"
                  }}
                >
                  {service.icon}
                </div>

                <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {service.title}
                </h3>
                
                <p className="text-sm leading-relaxed mb-6 font-medium" style={{ color: "rgba(148,163,184,0.7)" }}>
                  {service.desc}
                </p>

                <div className="mt-auto pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <ul className="space-y-3">
                    {service.items.map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -5 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: (index * 0.1) + (i * 0.05) }}
                        className="flex items-center gap-3 text-xs font-medium text-slate-300 group/item"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40 group-hover/item:bg-blue-400 group-hover/item:scale-125 transition-all" />
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
