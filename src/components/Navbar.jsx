import React from "react";
import logo from "/logo.png?url";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-forest-cream/80 backdrop-blur-md border-b border-forest/10 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <img src={logo} alt="Bharat Office Setu Logo" className="h-16 lg:h-24 w-auto object-contain mix-blend-multiply" />
      </div>

      <div className="hidden md:flex items-center space-x-8 text-sm font-medium uppercase tracking-widest text-forest/70">
        <a href="#services" className="hover:text-forest transition-colors">Services</a>
        <a href="#workspaces" className="hover:text-forest transition-colors">Workspaces</a>
        <a href="#compliance" className="hover:text-forest transition-colors">Compliance</a>
        <a href="#about" className="hover:text-forest transition-colors">About</a>
      </div>

      <button className="bg-forest text-white px-6 py-2.5 rounded-full font-semibold shadow-lg shadow-forest/20 hover:scale-105 transition-transform active:scale-95">
        Get Started Now
      </button>
    </nav>
  );
}
