import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Services", href: "#services" },
    { name: "Workspaces", href: "#workspaces" },
    { name: "Compliance", href: "#compliance" },
    { name: "About", href: "#about" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between transition-all duration-300`}
        style={{
          background: scrolled ? "rgba(249, 248, 245, 0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "0.5px solid var(--color-border-sage)" : "0.5px solid transparent",
        }}
      >
        {/* Logo */}
        <a href="/" className="flex items-center hover-lift" aria-label="Bharat Office Setu — Home">
          <img
            src="/logo.png"
            alt="Bharat Office Setu Logo"
            className="h-8 md:h-12 lg:h-16 w-auto object-contain"
          />
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-10 text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="hover:text-[var(--color-primary)] transition-colors duration-300 relative group"
            >
              {link.name}
              <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-[var(--color-accent)] group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <a
            href="mailto:partners@bharatofficesetu.com"
            className="px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-[0.1em] transition-all hover-lift"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "#ffffff",
            }}
          >
            Get Started
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 text-[var(--color-text-dark)] focus:outline-none"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </nav>

      {/* Mobile Full-Height Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[60] flex flex-col px-6 py-4"
            style={{ backgroundColor: "var(--color-bg-warm)" }}
          >
            <div className="flex items-center justify-between mb-12">
              <img src="/logo.png" alt="Bharat Office Setu" className="h-8" />
              <button
                className="p-2 text-[var(--color-text-dark)]"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col space-y-8 flex-1 justify-center items-center text-center">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.4 }}
                  className="text-2xl font-bold uppercase tracking-wider text-[var(--color-text-dark)] hover:text-[var(--color-primary)] transition-colors"
                >
                  {link.name}
                </motion.a>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="mt-auto mb-8 flex justify-center"
            >
              <a
                href="mailto:partners@bharatofficesetu.com"
                className="w-full text-center px-6 py-4 rounded-full font-bold text-sm uppercase tracking-[0.1em]"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "#ffffff",
                }}
              >
                Get Started
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
