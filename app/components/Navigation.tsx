"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUI } from "../contexts/UIContext";

export function Navigation() {
  const pathname = usePathname();
  const { openArchiveModal, openAboutModal, openPreviewModal } = useUI();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isListenMenuOpen, setIsListenMenuOpen] = useState(false);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
    setIsListenMenuOpen(false);
  };

  // Determine styling based on route (Home transparent vs sticky border on pages)
  const isHome = pathname === "/";
  const headerClass = isHome
    ? "fixed top-0 w-full z-50 glass-nav"
    : "sticky top-0 z-50 border-b border-primary/10 bg-background-dark/80 backdrop-blur-md";

  return (
    <>
      <header className={headerClass}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative z-50">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3" onClick={closeMenu}>
            <div className="text-primary">
              <span className="material-symbols-outlined text-3xl">fluid</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight uppercase">iMagiMason</h1>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {isHome ? (
              <>
                <Link className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-widest" href="#story">Story</Link>
                <Link className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-widest" href="#drops">Drops</Link>
                <div className="relative" onMouseEnter={() => setIsListenMenuOpen(true)} onMouseLeave={() => setIsListenMenuOpen(false)}>
                  <button 
                    onClick={() => setIsListenMenuOpen(!isListenMenuOpen)}
                    className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-widest flex items-center gap-1 focus:outline-none"
                  >
                    Listen
                    <span className="material-symbols-outlined text-[16px] transition-transform duration-300" style={{ transform: isListenMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>keyboard_arrow_down</span>
                  </button>
                  <AnimatePresence>
                    {isListenMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-[120%] left-1/2 -translate-x-1/2 w-48 bg-background-dark/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex flex-col gap-1 shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-50 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-primary/5 pointer-events-none rounded-2xl"></div>
                        <Link href="/listen" onClick={() => setIsListenMenuOpen(false)} className="relative z-10 px-4 py-3 text-xs uppercase tracking-widest font-bold text-slate-300 hover:text-primary hover:bg-white/5 rounded-xl transition-all flex items-center justify-between group">
                          Library <span className="material-symbols-outlined text-xs opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary">play_arrow</span>
                        </Link>
                        <Link href="/echoes" onClick={() => setIsListenMenuOpen(false)} className="relative z-10 px-4 py-3 text-xs uppercase tracking-widest font-bold text-slate-300 hover:text-primary hover:bg-white/5 rounded-xl transition-all flex items-center justify-between group">
                          Echoes <span className="material-symbols-outlined text-xs opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary">auto_stories</span>
                        </Link>
                        <button onClick={() => { openArchiveModal(); setIsListenMenuOpen(false); }} className="relative z-10 px-4 py-3 text-xs uppercase tracking-widest font-bold text-slate-300 hover:text-primary hover:bg-white/5 rounded-xl transition-all text-left flex items-center justify-between group focus:outline-none">
                          Archive <span className="material-symbols-outlined text-xs opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary">history</span>
                        </button>
                        <button onClick={() => { openAboutModal(); setIsListenMenuOpen(false); }} className="relative z-10 px-4 py-3 text-xs uppercase tracking-widest font-bold text-slate-300 hover:text-primary hover:bg-white/5 rounded-xl transition-all text-left flex items-center justify-between group focus:outline-none">
                          About <span className="material-symbols-outlined text-xs opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary">info</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link className={`text-sm font-medium hover:text-primary transition-colors ${pathname === '/' ? 'text-primary border-b-2 border-primary pb-1' : ''}`} href="/">Home</Link>
                <Link className={`text-sm font-medium hover:text-primary transition-colors ${pathname === '/drop' ? 'text-primary border-b-2 border-primary pb-1' : ''}`} href="/drop">Live Auction</Link>
                <div className="relative" onMouseEnter={() => setIsListenMenuOpen(true)} onMouseLeave={() => setIsListenMenuOpen(false)}>
                  <button 
                    onClick={() => setIsListenMenuOpen(!isListenMenuOpen)}
                    className={`text-sm font-medium hover:text-primary transition-colors flex items-center gap-1 focus:outline-none ${(pathname === '/listen' || pathname === '/echoes' || isListenMenuOpen) ? 'text-primary border-b-2 border-primary pb-1' : ''}`}
                  >
                    Listen
                    <span className="material-symbols-outlined text-[16px] transition-transform duration-300" style={{ transform: isListenMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>keyboard_arrow_down</span>
                  </button>
                  <AnimatePresence>
                    {isListenMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-[120%] left-1/2 -translate-x-1/2 w-48 bg-background-dark/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex flex-col gap-1 shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-50 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-primary/5 pointer-events-none rounded-2xl"></div>
                        <Link href="/listen" onClick={() => setIsListenMenuOpen(false)} className="relative z-10 px-4 py-3 text-sm font-medium text-slate-300 hover:text-primary hover:bg-white/5 rounded-xl transition-all flex items-center justify-between group">
                          Library <span className="material-symbols-outlined text-xs opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary">play_arrow</span>
                        </Link>
                        <Link href="/echoes" onClick={() => setIsListenMenuOpen(false)} className="relative z-10 px-4 py-3 text-sm font-medium text-slate-300 hover:text-primary hover:bg-white/5 rounded-xl transition-all flex items-center justify-between group">
                          Echoes <span className="material-symbols-outlined text-xs opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary">auto_stories</span>
                        </Link>
                        <button onClick={() => { openArchiveModal(); setIsListenMenuOpen(false); }} className="relative z-10 px-4 py-3 text-sm font-medium text-slate-300 hover:text-primary hover:bg-white/5 rounded-xl transition-all text-left flex items-center justify-between group focus:outline-none">
                          Archive <span className="material-symbols-outlined text-xs opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary">history</span>
                        </button>
                        <button onClick={() => { openAboutModal(); setIsListenMenuOpen(false); }} className="relative z-10 px-4 py-3 text-sm font-medium text-slate-300 hover:text-primary hover:bg-white/5 rounded-xl transition-all text-left flex items-center justify-between group focus:outline-none">
                          About <span className="material-symbols-outlined text-xs opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary">info</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </nav>

          {/* Desktop Right Actions & Mobile Hamburger */}
          <div className="flex items-center gap-4">
            {isHome ? (
              <>
                <Link href="/admin" className="hidden lg:flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-5 py-2 rounded-lg border border-primary/20 transition-all text-sm font-bold uppercase tracking-wider">
                  <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
                  Admin
                </Link>
                <Link href="/drop" className="hidden sm:flex bg-primary text-background-dark px-6 py-2 rounded-lg font-bold text-sm uppercase tracking-wider hover:brightness-110 transition-all">
                  Next Drop
                </Link>
              </>
            ) : (
              <button onClick={() => openPreviewModal("Wallet Connection")} className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-primary text-background-dark font-bold text-sm rounded-lg hover:brightness-110 transition-all">
                <span className="material-symbols-outlined text-lg">account_balance_wallet</span>
                Connect Wallet
              </button>
            )}
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-slate-100 p-2 rounded-md hover:bg-white/5 transition-colors z-50 relative"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              <span className="material-symbols-outlined text-2xl">
                {isMobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Overlay Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-background-dark/95 backdrop-blur-xl flex flex-col pt-24 px-6 pb-12 overflow-y-auto"
          >
            <nav className="flex flex-col gap-8 mt-8">
              <Link 
                href="/" 
                onClick={closeMenu}
                className={`text-3xl font-black uppercase tracking-tighter hover:text-primary transition-colors ${pathname === '/' ? 'text-primary' : 'text-slate-100'}`}
              >
                Home
              </Link>
              <Link 
                href="/drop" 
                onClick={closeMenu}
                className={`text-3xl font-black uppercase tracking-tighter hover:text-primary transition-colors ${pathname === '/drop' ? 'text-primary' : 'text-slate-100'}`}
              >
                Live Auction
              </Link>
              <div className="flex flex-col">
                <button 
                  onClick={() => setIsListenMenuOpen(!isListenMenuOpen)}
                  className={`text-3xl font-black uppercase tracking-tighter hover:text-primary transition-colors flex items-center justify-between w-full focus:outline-none ${(pathname === '/listen' || pathname === '/echoes' || isListenMenuOpen) ? 'text-primary' : 'text-slate-100'}`}
                >
                  Listen
                  <span className="material-symbols-outlined text-3xl transition-transform duration-300" style={{ transform: isListenMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>keyboard_arrow_down</span>
                </button>
                
                <AnimatePresence>
                  {isListenMenuOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col gap-6 mt-6 ml-6 overflow-hidden border-l-2 border-white/5 pl-4"
                    >
                      <Link href="/listen" onClick={closeMenu} className="text-2xl font-bold tracking-tight text-slate-300 hover:text-primary transition-colors pb-2">Library</Link>
                      <Link href="/echoes" onClick={closeMenu} className="text-xl font-bold tracking-tight text-slate-400 hover:text-primary transition-colors pb-2">Echoes</Link>
                      <button onClick={() => { openArchiveModal(); closeMenu(); }} className="text-xl font-bold tracking-tight text-left text-slate-400 hover:text-primary transition-colors pb-2 focus:outline-none">Archive</button>
                      <button onClick={() => { openAboutModal(); closeMenu(); }} className="text-xl font-bold tracking-tight text-left text-slate-400 hover:text-primary transition-colors pb-2 focus:outline-none">About</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex-grow" />

              {/* Admin Link (Mobile) */}
              <Link 
                href="/admin" 
                onClick={closeMenu}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-primary/10 text-primary border border-primary/20 font-black text-lg uppercase tracking-wider rounded-xl hover:bg-primary/20 transition-all mt-4"
              >
                <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
                Admin Login
              </Link>

              {/* Wallet Link (Mobile) */}
              <button 
                onClick={() => { openPreviewModal("Wallet Connection"); closeMenu(); }} 
                className="w-full mt-4 flex items-center justify-center gap-3 px-6 py-4 bg-primary text-background-dark font-black text-lg uppercase tracking-wider rounded-xl hover:brightness-110 transition-all"
              >
                <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
                Connect Wallet
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
