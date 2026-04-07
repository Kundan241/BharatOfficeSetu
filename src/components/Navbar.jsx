import React from "react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-3 flex items-center justify-between transition-all duration-300"
      style={{
        background: "rgba(10,22,40,0.6)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="flex items-center">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-blue-500/20 rounded-xl blur group-hover:bg-blue-500/40 transition"></div>
          <div className="relative flex items-center justify-center bg-white rounded-xl p-0.5 shadow-lg border border-white/20">
            <img
              src="/logo.png"
              alt="Bharat Office Setu Logo"
              className="h-8 lg:h-10 w-auto object-contain rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="hidden md:flex items-center space-x-8 text-xs font-semibold uppercase tracking-[0.2em]"
        style={{ color: "rgba(255,255,255,0.5)" }}
      >
        <a href="#services" className="hover:text-white transition-colors duration-300 relative group">
          Services
          <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-400 group-hover:w-full transition-all duration-300" />
        </a>
        <a href="#workspaces" className="hover:text-white transition-colors duration-300 relative group">
          Workspaces
          <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-400 group-hover:w-full transition-all duration-300" />
        </a>
        <a href="#compliance" className="hover:text-white transition-colors duration-300 relative group">
          Compliance
          <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-400 group-hover:w-full transition-all duration-300" />
        </a>
        <a href="#about" className="hover:text-white transition-colors duration-300 relative group">
          About
          <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-400 group-hover:w-full transition-all duration-300" />
        </a>
      </div>

      <button
        className="px-5 py-2 rounded-full font-bold text-xs uppercase tracking-[0.15em] hover:scale-105 transition-all active:scale-95"
        style={{
          background: "linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)",
          color: "#ffffff",
          border: "none",
          boxShadow: "0 4px 20px rgba(59,130,246,0.3)",
        }}
      >
        Get Started
      </button>
    </nav>
  );
}
