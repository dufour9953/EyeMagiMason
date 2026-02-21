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

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  const closeMenu = () => setIsMobileMenuOpen(false);

  // Determine styling based on route (Home transparent vs sticky border on pages)
  const isHome = pathname === "/";
  const headerClass = isHome
    ? "fixed top-0 w-full z-50 glass-nav"
    : "sticky top-0 z-50 border-b border-primary/10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md";

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
                <Link className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-widest" href="/listen">Listen</Link>
              </>
            ) : (
              <>
                <Link className={`text-sm font-medium hover:text-primary transition-colors ${pathname === '/' ? 'text-primary border-b-2 border-primary pb-1' : ''}`} href="/">Home</Link>
                <Link className={`text-sm font-medium hover:text-primary transition-colors ${pathname === '/drop' ? 'text-primary border-b-2 border-primary pb-1' : ''}`} href="/drop">Live Auction</Link>
                <Link className={`text-sm font-medium hover:text-primary transition-colors ${pathname === '/listen' ? 'text-primary border-b-2 border-primary pb-1' : ''}`} href="/listen">Listen</Link>
                <button onClick={openArchiveModal} className="text-sm font-medium hover:text-primary transition-colors">Archive</button>
                <button onClick={openAboutModal} className="text-sm font-medium hover:text-primary transition-colors">About</button>
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
            className="fixed inset-0 z-40 bg-background-light/95 dark:bg-[#0a0f0a]/95 backdrop-blur-xl flex flex-col pt-24 px-6 pb-12 overflow-y-auto"
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
              <Link 
                href="/listen" 
                onClick={closeMenu}
                className={`text-3xl font-black uppercase tracking-tighter hover:text-primary transition-colors ${pathname === '/listen' ? 'text-primary' : 'text-slate-100'}`}
              >
                Listen
              </Link>
              
              <div className="w-12 h-px bg-white/20 my-2" />
              
              <button 
                onClick={() => { openArchiveModal(); closeMenu(); }}
                className="text-2xl font-bold tracking-tight text-left hover:text-primary transition-colors text-slate-300"
              >
                Archive
              </button>
              <button 
                onClick={() => { openAboutModal(); closeMenu(); }}
                className="text-2xl font-bold tracking-tight text-left hover:text-primary transition-colors text-slate-300"
              >
                About
              </button>

              <div className="flex-grow" />

              <button 
                onClick={() => { openPreviewModal("Wallet Connection"); closeMenu(); }} 
                className="w-full mt-12 flex items-center justify-center gap-3 px-6 py-4 bg-primary text-background-dark font-black text-lg uppercase tracking-wider rounded-xl hover:brightness-110 transition-all"
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
