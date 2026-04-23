import React from 'react';
import { motion } from 'framer-motion';

/* ─── Duotone glow icons (inline SVG) ─────────────────────────── */
const IconCapability = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g-cap" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#06B6D4" />
        <stop offset="1" stopColor="#4F46E5" />
      </linearGradient>
    </defs>
    {/* Interlocking hexagons representing network / capability */}
    <path d="M16 2L28 9v14L16 30 4 23V9L16 2z" stroke="url(#g-cap)" strokeWidth="1.5" fill="rgba(6,182,212,0.08)" />
    <path d="M16 8l8 4.5v9L16 26l-8-4.5v-9L16 8z" stroke="url(#g-cap)" strokeWidth="1" fill="rgba(79,70,229,0.12)" />
    <circle cx="16" cy="16" r="3" fill="url(#g-cap)" />
    {/* Nodes */}
    <circle cx="16" cy="6"  r="1.5" fill="#06B6D4" opacity="0.7" />
    <circle cx="26" cy="11" r="1.5" fill="#4F46E5" opacity="0.7" />
    <circle cx="26" cy="21" r="1.5" fill="#06B6D4" opacity="0.7" />
    <circle cx="16" cy="26" r="1.5" fill="#4F46E5" opacity="0.7" />
    <circle cx="6"  cy="21" r="1.5" fill="#06B6D4" opacity="0.7" />
    <circle cx="6"  cy="11" r="1.5" fill="#4F46E5" opacity="0.7" />
  </svg>
);

const IconWorkspace = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g-ws" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#34d399" />
        <stop offset="1" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
    {/* 3D isometric building */}
    <path d="M6 26V12l10-6 10 6v14" stroke="url(#g-ws)" strokeWidth="1.5" fill="rgba(6,182,212,0.07)" />
    <rect x="10" y="16" width="4" height="6" rx="0.5" fill="url(#g-ws)" opacity="0.5" />
    <rect x="18" y="16" width="4" height="6" rx="0.5" fill="url(#g-ws)" opacity="0.5" />
    <rect x="14" y="11" width="4" height="3" rx="0.5" fill="url(#g-ws)" opacity="0.8" />
    {/* Roof sheen */}
    <path d="M6 12l10-6 10 6-10 4L6 12z" fill="rgba(52,211,153,0.12)" />
    <path d="M16 16v-4" stroke="#34d399" strokeWidth="1" opacity="0.6" />
    {/* Base shadow line */}
    <line x1="4" y1="26" x2="28" y2="26" stroke="url(#g-ws)" strokeWidth="1" opacity="0.3" />
  </svg>
);

const IconCompliance = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g-co" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f59e0b" />
        <stop offset="1" stopColor="#ef4444" />
      </linearGradient>
    </defs>
    {/* Shield with gear overlay */}
    <path d="M16 3l10 4v9c0 6-4 10-10 13C10 26 6 22 6 16V7l10-4z" stroke="url(#g-co)" strokeWidth="1.5" fill="rgba(245,158,11,0.08)" />
    {/* Gear */}
    <circle cx="16" cy="16" r="3.5" stroke="url(#g-co)" strokeWidth="1.2" fill="rgba(245,158,11,0.1)" />
    <path d="M16 10v2M16 20v2M10 16h2M20 16h2M12 12l1.4 1.4M18.6 18.6l1.4 1.4M12 20l1.4-1.4M18.6 13.4l1.4-1.4" stroke="url(#g-co)" strokeWidth="1.2" strokeLinecap="round" />
    {/* Checkmark */}
    <path d="M13 16l2 2 4-4" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconOps = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g-ops" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#a78bfa" />
        <stop offset="1" stopColor="#4F46E5" />
      </linearGradient>
    </defs>
    {/* Process flow circles */}
    <circle cx="8"  cy="16" r="4" stroke="url(#g-ops)" strokeWidth="1.3" fill="rgba(167,139,250,0.1)" />
    <circle cx="24" cy="16" r="4" stroke="url(#g-ops)" strokeWidth="1.3" fill="rgba(79,70,229,0.1)" />
    <circle cx="16" cy="8"  r="4" stroke="url(#g-ops)" strokeWidth="1.3" fill="rgba(167,139,250,0.1)" />
    <circle cx="16" cy="24" r="4" stroke="url(#g-ops)" strokeWidth="1.3" fill="rgba(79,70,229,0.1)" />
    {/* Connectors */}
    <line x1="12" y1="16" x2="20" y2="16" stroke="url(#g-ops)" strokeWidth="1" strokeDasharray="2 2" />
    <line x1="16" y1="12" x2="16" y2="20" stroke="url(#g-ops)" strokeWidth="1" strokeDasharray="2 2" />
    <circle cx="16" cy="16" r="2" fill="url(#g-ops)" />
  </svg>
);

const IconGrowth = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g-gr" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f472b6" />
        <stop offset="1" stopColor="#a78bfa" />
      </linearGradient>
    </defs>
    {/* Trend arrow + rocket trail */}
    <polyline points="4,24 10,16 16,18 24,6" stroke="url(#g-gr)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <polyline points="20,6 24,6 24,10" stroke="url(#g-gr)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    {/* Data dots */}
    <circle cx="10" cy="16" r="2" fill="#f472b6" opacity="0.8" />
    <circle cx="16" cy="18" r="2" fill="#a78bfa" opacity="0.8" />
    <circle cx="24" cy="6"  r="2" fill="#f472b6" opacity="0.8" />
    {/* Bar graph shadow */}
    <rect x="4"  y="24" width="4"  height="4" rx="1" fill="rgba(244,114,182,0.2)" />
    <rect x="12" y="20" width="4"  height="8" rx="1" fill="rgba(167,139,250,0.2)" />
    <rect x="20" y="14" width="4" height="14" rx="1" fill="rgba(244,114,182,0.2)" />
  </svg>
);

/* ─── Service data ────────────────────────────────────────────── */
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
    icon: <IconCapability />,
    accentFrom: "#06B6D4",
    accentTo: "#4F46E5",
    glowColor: "rgba(6,182,212,0.18)",
    hoverGlow: "rgba(6,182,212,0.22)",
    /* Bento: spans 2 columns on large screens */
    colSpan: "lg:col-span-2",
    rowSpan: "",
    featured: true,
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
    icon: <IconWorkspace />,
    accentFrom: "#34d399",
    accentTo: "#06B6D4",
    glowColor: "rgba(52,211,153,0.15)",
    hoverGlow: "rgba(52,211,153,0.2)",
    colSpan: "lg:col-span-1",
    rowSpan: "lg:row-span-2",
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
    icon: <IconCompliance />,
    accentFrom: "#f59e0b",
    accentTo: "#ef4444",
    glowColor: "rgba(245,158,11,0.15)",
    hoverGlow: "rgba(245,158,11,0.2)",
    colSpan: "lg:col-span-1",
    rowSpan: "",
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
    icon: <IconOps />,
    accentFrom: "#a78bfa",
    accentTo: "#4F46E5",
    glowColor: "rgba(167,139,250,0.15)",
    hoverGlow: "rgba(167,139,250,0.2)",
    colSpan: "lg:col-span-1",
    rowSpan: "",
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
    icon: <IconGrowth />,
    accentFrom: "#f472b6",
    accentTo: "#a78bfa",
    glowColor: "rgba(244,114,182,0.15)",
    hoverGlow: "rgba(244,114,182,0.2)",
    colSpan: "lg:col-span-1",
    rowSpan: "",
  },
];

/* ─── Card Component ──────────────────────────────────────────── */
function BentoCard({ service, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className={`bento-card p-7 flex flex-col group relative ${service.colSpan} ${service.rowSpan}`}
      style={{
        '--hover-glow': service.hoverGlow,
      }}
    >
      {/* Ambient glow behind icon */}
      <div
        className="absolute top-6 left-6 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ background: service.glowColor }}
      />

      {/* Background mesh spot */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[20px] pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${service.glowColor} 0%, transparent 65%)`,
        }}
      />

      <div className="relative z-10 flex flex-col h-full">
        {/* Icon bubble */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 flex-shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
          style={{
            background: `linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)`,
            border: `1px solid rgba(255,255,255,0.08)`,
            boxShadow: `0 0 20px ${service.glowColor}`,
          }}
        >
          <div className="icon-glow" style={{ color: service.accentFrom }}>
            {service.icon}
          </div>
        </div>

        {/* Title */}
        <h3
          className="text-base font-bold mb-2 tracking-tight"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
          }}
        >
          {service.title}
        </h3>

        {/* Description */}
        <p
          className="text-sm leading-relaxed mb-5 font-medium"
          style={{ color: '#9CA3AF', lineHeight: '1.7' }}
        >
          {service.desc}
        </p>

        {/* Divider */}
        <div
          className="mb-4"
          style={{
            height: '1px',
            background: `linear-gradient(90deg, ${service.accentFrom}33 0%, transparent 100%)`,
          }}
        />

        {/* Feature list */}
        <ul className="space-y-2.5 mt-auto">
          {service.items.map((item, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 + i * 0.04, duration: 0.4 }}
              className="flex items-center gap-3 text-xs font-medium group/item"
              style={{ color: 'rgba(156,163,175,0.85)' }}
            >
              {/* Accent dot */}
              <div
                className="flex-shrink-0 w-1.5 h-1.5 rounded-full transition-all duration-300 group-hover/item:scale-150"
                style={{
                  background: `linear-gradient(135deg, ${service.accentFrom}, ${service.accentTo})`,
                  boxShadow: `0 0 6px ${service.accentFrom}88`,
                }}
              />
              {item}
            </motion.li>
          ))}
        </ul>

        {/* Hover CTA pill */}
        <div
          className="mt-5 opacity-0 group-hover:opacity-100 transition-all duration-400 transform translate-y-2 group-hover:translate-y-0"
        >
          <a
            href={`mailto:partners@bharatofficesetu.com?subject=Inquiry about ${service.title}`}
            className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full transition-all hover:opacity-90"
            style={{
              background: `linear-gradient(135deg, ${service.accentFrom}22, ${service.accentTo}22)`,
              border: `1px solid ${service.accentFrom}44`,
              color: service.accentFrom,
            }}
          >
            Explore →
          </a>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Section ─────────────────────────────────────────────────── */
export default function Services() {
  return (
    <section
      className="relative py-32 px-6 overflow-hidden noise-overlay scanline"
      id="services"
      style={{
        background: "linear-gradient(180deg, #05050A 0%, #0B0F19 40%, #080C14 80%, #05050A 100%)",
      }}
    >
      {/* ── Deep background mesh blobs ── */}
      <div
        className="absolute top-[-120px] right-[-80px] w-[650px] h-[650px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(79,70,229,0.09) 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "mesh-drift 22s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-[-80px] left-[-80px] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)",
          filter: "blur(100px)",
          animation: "mesh-drift 18s ease-in-out infinite reverse",
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(129,140,248,0.04) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* ── Dot grid overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ── Section Header ── */}
        <div className="text-center mb-20">
          {/* Label pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full mb-6"
            style={{
              background: "rgba(79,70,229,0.1)",
              border: "1px solid rgba(79,70,229,0.25)",
            }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: '#818cf8' }}>
              Our Expertise
            </p>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black mb-6"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              color: '#FFFFFF',
            }}
          >
            Core Solutions for{' '}
            <span className="text-gradient-success">Success</span>
          </motion.h2>

          {/* Sub-copy */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12 }}
            className="max-w-2xl mx-auto font-medium"
            style={{
              color: '#9CA3AF',
              fontSize: '1.0625rem',
              lineHeight: '1.85',
              letterSpacing: '0.01em',
            }}
          >
            Comprehensive infrastructure and compliance solutions designed to empower your
            business expansion across the Indian subcontinent.
          </motion.p>
        </div>

        {/* ── Asymmetric Bento Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 auto-rows-auto">
          {services.map((service, index) => (
            <BentoCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
