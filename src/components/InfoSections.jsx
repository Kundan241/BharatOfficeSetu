import React from 'react';
import { motion } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease: [0.4, 0, 0.2, 1] },
});

function InfoSection({ id, accentColor, bgClass, label, heading, body, stats, features, reverse = false }) {
  return (
    <section
      id={id}
      className={`relative py-28 px-6 overflow-hidden ${bgClass}`}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16 lg:gap-24`}>

          {/* ── Text column ── */}
          <div className="flex-1 min-w-0">
            {/* Label pill */}
            <motion.div {...fadeUp(0)} className="mb-6">
              <span
                className="inline-block px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest"
                style={{
                  background: `${accentColor}1A`,
                  border: `1px solid ${accentColor}33`,
                  color: accentColor,
                }}
              >
                {label}
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              {...fadeUp(0.08)}
              className="text-4xl md:text-5xl font-black mb-6 leading-tight text-[#111110] tracking-tight"
            >
              {heading}
            </motion.h2>

            {/* Body */}
            <motion.p
              {...fadeUp(0.15)}
              className="text-lg leading-relaxed mb-10 text-[#111110]/70"
            >
              {body}
            </motion.p>

            {/* Stat chips */}
            {stats && (
              <motion.div {...fadeUp(0.22)} className="flex flex-wrap gap-4 mb-10">
                {stats.map((stat, i) => (
                  <div
                    key={i}
                    className="flex flex-col px-6 py-4 rounded-2xl bg-white border border-[#1B6B2F]/10 shadow-sm"
                  >
                    <span className="text-3xl font-black mb-1 text-[#1B6B2F]">
                      {stat.num}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#111110]/50">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}

            {/* CTA */}
            <motion.a
              {...fadeUp(0.28)}
              href={`mailto:partners@bharatofficesetu.com?subject=Inquiry about ${label}`}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm transition-all hover:scale-105 active:scale-95 bg-[#1B6B2F] text-white shadow-lg shadow-[#1B6B2F]/20"
            >
              Get in Touch →
            </motion.a>
          </div>

          {/* ── Feature card column ── */}
          <motion.div
            {...fadeUp(0.18)}
            className="flex-1 min-w-0 w-full"
          >
            <div className="rounded-[2rem] p-10 relative overflow-hidden bg-white border border-[#1B6B2F]/10 shadow-[0_20px_40px_rgba(27,107,47,0.04)]">
              
              {/* Subtle top accent bar */}
              <div
                className="absolute top-0 left-0 w-full h-1.5"
                style={{ background: accentColor }}
              />

              <ul className="space-y-6 relative z-10 mt-2">
                {features.map((feat, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.07, duration: 0.5 }}
                    className="flex items-start gap-5"
                  >
                    {/* Check icon */}
                    <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-[#1B6B2F]/10 flex items-center justify-center">
                       <svg className="w-3.5 h-3.5 text-[#1B6B2F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                       </svg>
                    </div>
                    <div>
                      <p className="text-base font-bold mb-1 text-[#111110]">
                        {feat.title}
                      </p>
                      {feat.sub && (
                        <p className="text-sm text-[#111110]/60 leading-relaxed">
                          {feat.sub}
                        </p>
                      )}
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function InfoSections() {
  return (
    <>
      <InfoSection
        id="workspaces"
        accentColor="#1B6B2F"
        bgClass="bg-white"
        label="Workspaces"
        heading="Premium Workspaces Built for the New India"
        body="Whether you are an agile startup or a sprawling multinational, your physical footprint matters. Bharat Office Setu delivers premium, fully-managed workspaces designed for productivity, collaboration, and scale. From plug-and-play coworking desks to custom-built enterprise headquarters across 150+ cities, we provide the flexible infrastructure your business needs to thrive without the overhead of traditional real estate."
        stats={[
          { num: '150+', label: 'Cities' },
          { num: '36+', label: 'States' },
          { num: '5000+', label: 'Clients' },
        ]}
        features={[
          { title: 'Plug-and-Play Coworking Desks', sub: 'Ready-to-use shared and dedicated workstations' },
          { title: 'Managed Private Offices', sub: 'Fully serviced, branded office suites for teams of all sizes' },
          { title: 'Enterprise Headquarters', sub: 'Custom-built flagship offices with premium amenities' },
          { title: 'Virtual Office Addresses', sub: 'Premium business addresses with mail handling and GST support' },
          { title: 'Flexible Lease Terms', sub: 'Month-to-month plans with zero long-term commitments' },
        ]}
        reverse={false}
      />

      <InfoSection
        id="compliance"
        accentColor="#F4831F"
        bgClass="bg-[#F9F8F5]"
        label="Compliance"
        heading="Seamless Business Setup & Regulatory Compliance"
        body="Navigating the complexities of business operations across different states shouldn't slow your growth. Our end-to-end compliance ecosystem takes the friction out of expansion. We handle everything from company incorporation and virtual office registrations to GST compliance, payroll, and legal advisory. Focus on your core business while our experts ensure you remain 100% compliant across the Indian subcontinent."
        stats={[
          { num: '100%', label: 'Compliance Rate' },
          { num: '28+', label: 'Service Types' },
          { num: '48 hrs', label: 'Avg Turnaround' },
        ]}
        features={[
          { title: 'Company Incorporation & Business Setup', sub: 'Private Ltd, LLP, OPC — end-to-end registration' },
          { title: 'GST Registration & Compliance Support', sub: 'Multi-state GST filing and advisory' },
          { title: 'Legal & Regulatory Advisory', sub: 'Contracts, policies, and statutory requirements' },
          { title: 'Taxation & Accounting Support', sub: 'Bookkeeping, TDS, income tax, and audits' },
          { title: 'Payroll & HR Compliance', sub: 'PF, ESI, labour law, and payroll processing' },
        ]}
        reverse={true}
      />

      <InfoSection
        id="about"
        accentColor="#8BC34A"
        bgClass="bg-white"
        label="About Us"
        heading="Bridging Your Enterprise to Success"
        body="Bharat Office Setu is more than a real estate or compliance firm—we are the digital and physical infrastructure backbone for India's fastest-growing enterprises. With a presence in 36+ states and union territories, and trusted by over 5,000 clients, our mission is to empower business expansion by providing world-class workspaces and rock-solid operational support. We build the bridges; you cross them to success."
        stats={[
          { num: '36+', label: 'States' },
          { num: '5000+', label: 'Clients' },
          { num: '10+', label: 'Years' },
        ]}
        features={[
          { title: 'Pan-India Presence', sub: '36+ states and union territories covered' },
          { title: 'Trusted by 5,000+ Clients', sub: 'From startups to Fortune 500 enterprises' },
          { title: 'One-Stop Infrastructure Partner', sub: 'Workspace, compliance, and operations under one roof' },
          { title: 'Tech-Enabled Operations', sub: 'Digital-first processes for fast, reliable delivery' },
          { title: 'Dedicated Account Management', sub: 'A named relationship manager for every client' },
        ]}
        reverse={false}
      />
    </>
  );
}
