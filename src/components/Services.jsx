import React from 'react';
import { motion } from 'framer-motion';
import { Building2, ShieldCheck, TrendingUp, Users, Network, CheckCircle2, Factory } from 'lucide-react';

const services = [
  {
    title: "Capability Centre Solutions",
    desc: "Comprehensive solutions to establish and scale your delivery capabilities.",
    items: [
      "Domestic Capability Centre Setup",
      "Global Capability Center (GCC) Consulting",
      "Offshore Delivery Centre Support",
      "Shared Services Setup",
      "Innovation Hub Development"
    ],
    icon: <Network className="w-8 h-8 text-emerald-700" />,
    className: "col-span-1 lg:col-span-2 bg-gradient-to-br from-forest-mint/80 to-forest-sage/80 shadow-md border border-white"
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
    icon: <Building2 className="w-8 h-8 text-forest" />,
    className: "col-span-1 lg:col-span-1 glass-card"
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
    icon: <ShieldCheck className="w-8 h-8 text-forest" />,
    className: "col-span-1 lg:col-span-1 glass-card"
  },
  {
    title: "Operations & Support Services",
    desc: "Streamlined operational support for optimal business efficiency.",
    items: [
      "BPO / KPO Enablement",
      "IT Infrastructure Support",
      "Admin and Facility Management",
      "Financial and Business Consulting",
      "Process and Operational Support"
    ],
    icon: <Factory className="w-8 h-8 text-forest" />,
    className: "col-span-1 lg:col-span-1 glass-card"
  },
  {
    title: "Growth & Market Enablement",
    desc: "Strategic advisory to help you enter markets and scale rapidly.",
    items: [
      "Branding and Digital Marketing",
      "Community Building & Business Networking",
      "Ecosystem Partnerships",
      "Market Entry Advisory",
      "Expansion Support for Startups & SMEs"
    ],
    icon: <TrendingUp className="w-8 h-8 text-forest" />,
    className: "col-span-1 lg:col-span-1 glass-card"
  }
];

export default function Services() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto" id="services">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-serif text-forest mb-4">Our Core Solutions</h2>
        <p className="text-lg text-forest/70 max-w-3xl mx-auto">Everything you need to establish, manage, and scale your business operations in India securely.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`rounded-3xl p-8 flex flex-col group hover:-translate-y-1 transition-transform duration-300 ${service.className}`}
          >
            <div className="bg-white/70 w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-sm group-hover:bg-white transition-colors mb-6">
              {service.icon}
            </div>
            
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-forest mb-2">{service.title}</h3>
              <p className="text-forest/70 text-sm">{service.desc}</p>
            </div>
            
            <div className="mt-auto pt-4 border-t border-white/40">
              <ul className="space-y-3">
                {service.items.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-3 shrink-0 mt-0.5" />
                    <span className="text-forest/80 text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
