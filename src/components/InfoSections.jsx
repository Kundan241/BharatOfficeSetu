import React from 'react';
import { motion } from 'framer-motion';

/* ─── Shared fade-up animation ─────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease: [0.4, 0, 0.2, 1] },
});

/* ─── Section wrapper ───────────────────────────────────────────── */
function InfoSection({ id, accentFrom, accentTo, glowColor, label, heading, body, stats, features, reverse = false }) {
  return (
    <section
      id={id}
      className="relative py-28 px-6 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #05050A 0%, #0B0F19 50%, #05050A 100%)',
      }}
    >
      {/* Background glow blobs */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 700,
          height: 700,
          borderRadius: '50%',
          top: '-120px',
          [reverse ? 'left' : 'right']: '-180px',
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          filter: 'blur(90px)',
        }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.022]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Divider line at top */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${accentFrom}44, transparent)` }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16 lg:gap-24`}>

          {/* ── Text column ── */}
          <div className="flex-1 min-w-0">
            {/* Label pill */}
            <motion.div {...fadeUp(0)} className="mb-6">
              <span
                className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.4em]"
                style={{
                  background: `${accentFrom}18`,
                  border: `1px solid ${accentFrom}35`,
                  color: accentFrom,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {label}
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              {...fadeUp(0.08)}
              className="text-4xl md:text-5xl font-black mb-6 leading-tight"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                letterSpacing: '-0.03em',
                color: '#FFFFFF',
              }}
            >
              <span
                style={{
                  background: `linear-gradient(135deg, ${accentFrom}, ${accentTo})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {heading.split(' ').slice(0, 2).join(' ')}{' '}
              </span>
              {heading.split(' ').slice(2).join(' ')}
            </motion.h2>

            {/* Body */}
            <motion.p
              {...fadeUp(0.15)}
              className="text-base md:text-lg leading-relaxed mb-10"
              style={{
                color: '#9CA3AF',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                lineHeight: '1.9',
              }}
            >
              {body}
            </motion.p>

            {/* Stat chips */}
            {stats && (
              <motion.div {...fadeUp(0.22)} className="flex flex-wrap gap-4 mb-10">
                {stats.map((stat, i) => (
                  <div
                    key={i}
                    className="flex flex-col px-5 py-3 rounded-2xl"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)',
                    }}
                  >
                    <span
                      className="text-2xl font-black leading-none mb-0.5"
                      style={{
                        background: `linear-gradient(135deg, ${accentFrom}, ${accentTo})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}
                    >
                      {stat.num}
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color: 'rgba(156,163,175,0.7)' }}>
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm uppercase tracking-[0.15em] transition-all hover:scale-105 active:scale-95"
              style={{
                background: `linear-gradient(135deg, ${accentFrom}, ${accentTo})`,
                color: '#fff',
                boxShadow: `0 8px 32px ${accentFrom}44`,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Get in Touch →
            </motion.a>
          </div>

          {/* ── Feature card column ── */}
          <motion.div
            {...fadeUp(0.18)}
            className="flex-1 min-w-0 w-full"
          >
            <div
              className="rounded-3xl p-8 relative overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.07)',
                backdropFilter: 'blur(16px)',
                boxShadow: `0 40px 80px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.04)`,
              }}
            >
              {/* Inner accent glow */}
              <div
                className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
                  filter: 'blur(40px)',
                  transform: 'translate(30%, -30%)',
                }}
              />

              {/* Gradient top bar */}
              <div
                className="h-1 w-24 rounded-full mb-8"
                style={{ background: `linear-gradient(90deg, ${accentFrom}, ${accentTo})` }}
              />

              <ul className="space-y-4 relative z-10">
                {features.map((feat, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.07, duration: 0.5 }}
                    className="flex items-start gap-4"
                  >
                    {/* Accent dot */}
                    <div
                      className="mt-1.5 flex-shrink-0 w-2 h-2 rounded-full"
                      style={{
                        background: `linear-gradient(135deg, ${accentFrom}, ${accentTo})`,
                        boxShadow: `0 0 8px ${accentFrom}88`,
                      }}
                    />
                    <div>
                      <p
                        className="text-sm font-semibold mb-0.5"
                        style={{ color: '#FFFFFF', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        {feat.title}
                      </p>
                      {feat.sub && (
                        <p className="text-xs" style={{ color: 'rgba(156,163,175,0.75)' }}>
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

/* ─── Section data ──────────────────────────────────────────────── */
export default function InfoSections() {
  return (
    <>
      <InfoSection
        id="workspaces"
        accentFrom="#06B6D4"
        accentTo="#4F46E5"
        glowColor="rgba(6,182,212,0.12)"
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
        accentFrom="#f59e0b"
        accentTo="#ef4444"
        glowColor="rgba(245,158,11,0.10)"
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
        accentFrom="#a78bfa"
        accentTo="#4F46E5"
        glowColor="rgba(167,139,250,0.10)"
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
