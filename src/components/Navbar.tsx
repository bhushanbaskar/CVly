import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sparkles, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <header className="fixed top-0 left-0 right-0 z-[100] px-4 py-4 md:px-8 md:py-8 flex items-center justify-between pointer-events-auto">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 md:gap-3 group z-[110]">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl md:rounded-[18px] bg-[var(--accent)] flex items-center justify-center text-white shadow-lg shadow-[var(--accent)]/30 group-hover:scale-110 transition-all card-hover">
          <Sparkles size={20} className="md:w-6 md:h-6" />
        </div>
        <div className="flex flex-col">
          <span className="font-serif italic text-xl md:text-3xl tracking-tight text-white shine leading-none">CVly</span>
          <span className="text-[7px] md:text-[8px] font-mono opacity-40 uppercase tracking-[0.2em] mt-0.5 md:mt-1 ml-0.5 md:ml-1">AI Analyst</span>
        </div>
      </Link>

      {/* Desktop Nav Pill */}
      <div className="hidden lg:flex items-center gap-1.5 md:gap-2 glass px-2 py-1.5 md:px-4 md:py-2 rounded-full md:rounded-[24px] shadow-2xl relative">
        <nav className="flex items-center gap-1">
          <NavLink to="/" active={location.pathname === "/"}>Analyze</NavLink>
          <NavLink to="/design-guide" active={location.pathname === "/design-guide"}>Design Guide</NavLink>
          <NavLink to="/about" active={location.pathname === "/about"}>How it works</NavLink>
        </nav>
      </div>

      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden w-10 h-10 rounded-xl glass border border-white/10 flex items-center justify-center text-white z-[110] active:scale-90 transition-transform"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 bg-black/60 z-[105] lg:hidden flex flex-col items-center justify-center p-6"
          >
            <motion.nav 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex flex-col items-center gap-6"
            >
              <MobileNavLink to="/" active={location.pathname === "/"} onClick={() => setIsOpen(false)}>Analyze</MobileNavLink>
              <MobileNavLink to="/design-guide" active={location.pathname === "/design-guide"} onClick={() => setIsOpen(false)}>Design Guide</MobileNavLink>
              <MobileNavLink to="/about" active={location.pathname === "/about"} onClick={() => setIsOpen(false)}>How it works</MobileNavLink>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const NavLink = ({ to, children, active }: { to: string; children: React.ReactNode; active: boolean }) => (
  <Link 
    to={to} 
    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all relative ${
      active ? "text-white" : "text-white/40 hover:text-white/70"
    }`}
  >
    {active && (
      <motion.div 
        layoutId="active-pill"
        className="absolute inset-0 bg-white/5 border border-white/10 rounded-xl"
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
    <span className="relative z-10">{children}</span>
  </Link>
);

const MobileNavLink = ({ to, children, active, onClick }: { to: string; children: React.ReactNode; active: boolean; onClick: () => void }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className={`text-3xl font-serif italic tracking-tight transition-all ${
      active ? "text-white" : "text-white/30 hover:text-white/60"
    }`}
  >
    {children}
  </Link>
);
